import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Trash2, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Info,
  Layers
} from 'lucide-react';
import { 
  CubeColor, 
  FaceName, 
  INITIAL_CUBE_STATE, 
  COLOR_MAP, 
  FACE_NAMES,
  FACE_TO_COLOR
} from './types';
import { solveCube, generateRandomScramble } from './services/cubeService';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<'solver' | 'tutorials' | 'timer' | 'algorithms'>('solver');
  const [cubeState, setCubeState] = React.useState(INITIAL_CUBE_STATE);
  const [selectedColor, setSelectedColor] = React.useState<CubeColor>(CubeColor.WHITE);
  const [solution, setSolution] = React.useState<string[] | null>(null);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [isSolving, setIsSolving] = React.useState(false);

  const handleStickerClick = (face: FaceName, index: number) => {
    // Only center sticker of a face should not be changed (to maintain orientation context)
    // Actually, Ruwix allows it but it's better to keep orientation consistent.
    // For now, let's allow changing everything for flexibility, but warn users.
    const newState = { ...cubeState };
    newState[face] = [...newState[face]];
    newState[face][index] = selectedColor;
    setCubeState(newState);
    if (solution) setSolution(null);
  };

  const handleSolve = () => {
    setIsSolving(true);
    setError(null);
    setSolution(null);
    
    // Slight delay to show loading state
    setTimeout(() => {
      try {
        const result = solveCube(cubeState);
        if (result) {
          setSolution(result);
          setCurrentStep(0);
        } else {
          setError("Invalid cube configuration. Make sure you have 9 of each color and unique centers!");
        }
      } catch (err) {
        setError("An unexpected error occurred during solving.");
        console.error(err);
      } finally {
        setIsSolving(false);
      }
    }, 100);
  };

  const handleReset = () => {
    setCubeState(INITIAL_CUBE_STATE);
    setSolution(null);
    setError(null);
  };

  const handleClear = () => {
    const cleared = { ...INITIAL_CUBE_STATE };
    FACE_NAMES.forEach(face => {
      cleared[face] = Array(9).fill(CubeColor.WHITE);
    });
    setCubeState(cleared);
    setSolution(null);
  };

  const handleScramble = () => {
    try {
      const newState = generateRandomScramble();
      setCubeState(newState);
      setSolution(null);
      setError(null);
    } catch (err) {
      console.error('Failed to scramble:', err);
      setError('Failed to generate a random scramble.');
    }
  };

  const nextStep = () => {
    if (solution && currentStep < solution.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (solution && currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-black/10">
      {/* Header */}
      <nav className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-extrabold tracking-tighter uppercase">cubelab</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          <button 
            onClick={() => setActiveTab('solver')} 
            className={cn("transition-colors uppercase tracking-widest text-[11px] font-bold", activeTab === 'solver' ? "text-black" : "hover:text-black")}
          >
            Solver
          </button>
          <button 
            onClick={() => setActiveTab('tutorials')} 
            className={cn("transition-colors uppercase tracking-widest text-[11px] font-bold", activeTab === 'tutorials' ? "text-black" : "hover:text-black")}
          >
            Tutorials
          </button>
          <button 
            onClick={() => setActiveTab('timer')} 
            className={cn("transition-colors uppercase tracking-widest text-[11px] font-bold", activeTab === 'timer' ? "text-black" : "hover:text-black")}
          >
            Timer
          </button>
          <button 
            onClick={() => setActiveTab('algorithms')} 
            className={cn("transition-colors uppercase tracking-widest text-[11px] font-bold", activeTab === 'algorithms' ? "text-black" : "hover:text-black")}
          >
            Algorithms
          </button>
        </div>
        <button className="px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
          Connect Cube
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-6 items-start w-full">
        {activeTab === 'solver' && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start w-full">
            {/* Left Column: Cube Input */}
            <section className="flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
            <div className="absolute top-8 left-8 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interactive View</span>
              <h2 className="text-2xl font-light italic text-gray-800">Virtual Solver</h2>
            </div>
            
            <div className="flex flex-col items-center scale-90 md:scale-100">
              <CubeNet 
                state={cubeState} 
                onStickerClick={handleStickerClick}
              />
            </div>
            
            <div className="absolute bottom-8 flex gap-3">
              <button 
                onClick={handleReset}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:border-black transition-all"
                title="Reset to Solved"
              >
                <div className="scale-x-[-1] opacity-60 hover:opacity-100">↺</div>
              </button>
              <button 
                onClick={handleClear}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:border-black transition-all"
                title="Clear All Colors"
              >
                <Trash2 className="w-5 h-5 opacity-40 hover:opacity-100 text-red-500" />
              </button>
              <button 
                onClick={handleSolve}
                disabled={isSolving}
                className="px-8 h-12 rounded-full bg-black text-white font-bold text-sm tracking-widest uppercase hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {isSolving ? 'Solving...' : 'Solve Now'}
              </button>
            </div>
          </div>

          {/* Solution Area */}
          <AnimatePresence>
            {solution && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Algorithm Output</h3>
                    <p className="text-sm font-semibold mt-1">{solution.length} moves total</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded-full transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="w-16 text-center text-xs font-bold mono uppercase tracking-tight text-gray-400">
                      Step {currentStep + 1}
                    </div>
                    <button 
                      onClick={nextStep}
                      disabled={currentStep === solution.length - 1}
                      className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-30 rounded-full transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8 mono text-[13px] leading-relaxed text-gray-600 border border-gray-100 min-h-[100px]">
                  <div className="flex flex-wrap gap-2">
                    {solution.map((move, idx) => (
                      <span 
                        key={idx}
                        className={cn(
                          "px-2 py-1 rounded transition-colors",
                          idx === currentStep ? "bg-black text-white" : "hover:bg-gray-200 cursor-pointer"
                        )}
                        onClick={() => setCurrentStep(idx)}
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 bg-gray-100 rounded-2xl border border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-2xl font-bold mono">
                    {solution[currentStep]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">Current Action</h4>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
                      {getMoveDescription(solution[currentStep])}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50/50 border border-red-100 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-wider text-center"
            >
              {error}
            </motion.div>
          )}
        </section>

        {/* Right Column: Tools */}
        <aside className="sticky top-24 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Color Palette</h3>
            <div className="grid grid-cols-3 gap-4">
              {(Object.values(CubeColor)).map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-full aspect-square rounded-lg shadow-inner transition-all",
                    selectedColor === color ? "outline-3 outline-[#1A1A1A] outline-offset-2 scale-105" : "hover:scale-105 border border-gray-100"
                  )}
                  style={{ backgroundColor: COLOR_MAP[color] }}
                />
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-6 leading-relaxed">
              Select a color and paint the virtual cube faces below for manual solve input.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Controls</h3>
            <button
              onClick={handleScramble}
              className="w-full py-3 bg-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-gray-200 transition-colors"
            >
              Scramble
            </button>
            <button
              onClick={handleReset}
              className="w-full py-3 bg-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-tighter hover:bg-gray-200 transition-colors"
            >
              Reset Defaults
            </button>
          </div>

          <div className="bg-white/50 rounded-3xl p-6 border border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest leading-loose">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
              <span>Cubelab Engine v2.4.0</span>
            </div>
            <p>Ready to process: 43 quintillion possibilities</p>
          </div>
        </aside>
      </div>
    )}

        {activeTab === 'tutorials' && <TutorialsView />}
        {activeTab === 'timer' && <TimerView />}
        {activeTab === 'algorithms' && <AlgorithmsView />}
      </main>
    </div>
  );
}

function CubeNet({ state, onStickerClick }: { 
  state: Record<FaceName, CubeColor[]>, 
  onStickerClick: (face: FaceName, index: number) => void 
}) {
  return (
    <div className="flex flex-col gap-4 md:gap-8 py-8 items-center cursor-default">
      {/* Top Face */}
      <div className="flex flex-col items-center">
        <Face face="U" colors={state.U} onClick={(i) => onStickerClick('U', i)} label="Top" />
      </div>
      
      {/* Middle Row */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <Face face="L" colors={state.L} onClick={(i) => onStickerClick('L', i)} label="Left" />
        <Face face="F" colors={state.F} onClick={(i) => onStickerClick('F', i)} label="Front" />
        <Face face="R" colors={state.R} onClick={(i) => onStickerClick('R', i)} label="Right" />
        <Face face="B" colors={state.B} onClick={(i) => onStickerClick('B', i)} label="Back" />
      </div>

      {/* Bottom Face */}
      <div className="flex flex-col items-center">
        <Face face="D" colors={state.D} onClick={(i) => onStickerClick('D', i)} label="Bottom" />
      </div>
    </div>
  );
}

function Face({ face, colors, onClick, label }: { 
  face: FaceName, 
  colors: CubeColor[], 
  onClick: (idx: number) => void,
  label: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="grid grid-cols-3 gap-0.5 bg-[#2D2D2D] p-0.5 rounded-md shadow-sm">
        {colors.map((color, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.9 }}
            onClick={() => onClick(idx)}
            className="w-7 h-7 md:w-9 md:h-9 rounded-sm transition-transform relative"
            style={{ backgroundColor: COLOR_MAP[color] }}
          >
            {idx === 4 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-1 h-1 rounded-full bg-black" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function getMoveDescription(move: string): string {
  const [face, ...modifiers] = move.split('');
  const mod = modifiers.join('');
  
  let desc = "";
  switch(face) {
    case 'U': desc = "Up face (top layer)"; break;
    case 'D': desc = "Down face (bottom layer)"; break;
    case 'L': desc = "Left face"; break;
    case 'R': desc = "Right face"; break;
    case 'F': desc = "Front face"; break;
    case 'B': desc = "Back face"; break;
  }
  
  if (mod === "'") desc += " counter-clockwise";
  else if (mod === '2') desc += " twice (180\u00B0)";
  else desc += " clockwise";
  
  return desc;
}

function TutorialsView() {
  const steps = [
    { title: "The Cross", desc: "Create a cross on the first layer matching center colors.", icon: "✚" },
    { title: "The Corners", desc: "Insert the first layer corners into their correct positions.", icon: "◸" },
    { title: "Middle Layer", desc: "Solve the second layer edges using F2L algorithms.", icon: "⚍" },
    { title: "Yellow Cross", desc: "Orient yellow edges to form a cross on the top face.", icon: "➕" },
    { title: "Yellow Corners", desc: "Orient and permute the final layer to finish the cube.", icon: "◼" },
  ];

  return (
    <div className="w-full grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-6">Beginner's Guide</h2>
        <div className="space-y-6">
          {steps.map((s, idx) => (
            <div key={idx} className="flex gap-4 items-start group">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-black group-hover:text-white transition-all shrink-0">
                {idx + 1}
              </div>
              <div>
                <h4 className="font-bold flex items-center gap-2">
                  <span>{s.icon}</span>
                  {s.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-black rounded-3xl p-8 text-white flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-emerald-400">Pro Tips</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex gap-2">
              <span className="text-white">●</span>
              Always keep the same center face color orientation while solving.
            </li>
            <li className="flex gap-2">
              <span className="text-white">●</span>
              Learn finger tricks to improve your speed and efficiency.
            </li>
            <li className="flex gap-2">
              <span className="text-white">●</span>
              Practice one step at a time until it becomes muscle memory.
            </li>
          </ul>
        </div>
        <div className="pt-8 border-t border-white/10">
          <p className="text-xs text-gray-500 italic">"The cube is more than a toy, it's a practice in patience."</p>
        </div>
      </div>
    </div>
  );
}

function TimerView() {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isRunning) {
          setIsReady(true);
        } else {
          stopTimer();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (isReady && !isRunning) {
          startTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isRunning, isReady]);

  const startTimer = () => {
    setIsReady(false);
    setIsRunning(true);
    setTime(0);
    const start = Date.now();
    timerRef.current = window.setInterval(() => {
      setTime(Date.now() - start);
    }, 10);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm min-h-[400px]">
      <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-8">Session Timer</div>
      <div className={cn(
        "text-9xl font-bold mono transition-colors",
        isReady ? "text-emerald-500" : isRunning ? "text-gray-800" : "text-gray-300"
      )}>
        {formatTime(time)}s
      </div>
      <div className="mt-12 flex flex-col items-center gap-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest bg-gray-100 px-6 py-2 rounded-full font-bold">
          {isRunning ? "Press SPACE to stop" : isReady ? "Release SPACE to start" : "Hold SPACE to prime"}
        </p>
        <button 
          onClick={isRunning ? stopTimer : (isReady ? startTimer : () => {})}
          className="md:hidden px-8 py-3 bg-black text-white rounded-full font-bold uppercase text-xs"
        >
          {isRunning ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}

function AlgorithmsView() {
  const algs = [
    { name: "Sune", notation: "R U R' U R U2 R'", type: "OLL" },
    { name: "Anti-Sune", notation: "R U2 R' U' R U' R'", type: "OLL" },
    { name: "T-Perm", notation: "(R U R' U') R' F R2 U' R' U' R U R' F'", type: "PLL" },
    { name: "Y-Perm", notation: "F R U' R' U' R U R' F' R U R' U' R' F R F'", type: "PLL" },
    { name: "U-Perm (a)", notation: "R2 U R U R' U' R' U' R' U R'", type: "PLL" },
    { name: "J-Perm (b)", notation: "R U R' F' R U R' U' R' F R2 U' R'", type: "PLL" },
  ];

  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Algorithm Library</h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{algs.length} Essential Algs</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {algs.map((a, idx) => (
          <div key={idx} className="p-6 border border-gray-50 hover:bg-gray-50 transition-colors group">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg">{a.name}</h4>
              <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-bold">{a.type}</span>
            </div>
            <div className="bg-gray-100 rounded-xl p-4 font-mono text-sm text-gray-600 leading-relaxed group-hover:bg-white transition-colors">
              {a.notation}
            </div>
            <button className="mt-4 text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
              Visual Guide →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
