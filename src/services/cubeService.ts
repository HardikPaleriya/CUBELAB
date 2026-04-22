import Cube from 'cubejs';
import { CubeColor, FaceName, FACE_CHAR_TO_COLOR, INITIAL_CUBE_STATE } from '../types';

// Initialize the solver (this should only happen once)
Cube.initSolver();

export function generateRandomScramble(): Record<FaceName, CubeColor[]> {
  const cube = Cube.random();
  const cubeString = cube.asString(); // Returns 54 chars like "UUUUUUUUURRRRRRRRR..."
  
  const newState = { ...INITIAL_CUBE_STATE };
  const faces: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  
  for (let i = 0; i < 6; i++) {
    const faceName = faces[i];
    const faceString = cubeString.substring(i * 9, (i + 1) * 9);
    newState[faceName] = faceString.split('').map(char => FACE_CHAR_TO_COLOR[char]);
  }
  
  return newState;
}

export function solveCube(state: Record<FaceName, CubeColor[]>): string[] | null {
  try {
    // 1. Validation: Must have exactly 54 stickers total
    const faces: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];
    const allStickers = faces.flatMap(f => state[f]);
    
    // 2. Count colors - must be exactly 9 of each
    const counts: Record<string, number> = {};
    allStickers.forEach(c => counts[c] = (counts[c] || 0) + 1);
    
    const colors = Object.values(CubeColor);
    for (const color of colors) {
      if (counts[color] !== 9) {
        console.warn(`Invalid color count: ${color} has ${counts[color]}`);
        return null;
      }
    }

    // 3. Create a dynamic mapping from Color -> Face Name
    // The center sticker (index 4) of each face defines its identity
    const colorToFaceMap: Record<string, string> = {
      [state.U[4]]: 'U',
      [state.R[4]]: 'R',
      [state.F[4]]: 'F',
      [state.D[4]]: 'D',
      [state.L[4]]: 'L',
      [state.B[4]]: 'B',
    };

    // If there are duplicate centers, the cube is invalid
    if (Object.keys(colorToFaceMap).length < 6) return null;

    // 4. Generate the Kociemba string
    let cubeString = '';
    for (const face of faces) {
      const faceColors = state[face];
      for (const color of faceColors) {
        cubeString += colorToFaceMap[color];
      }
    }

    const cube = Cube.fromString(cubeString);
    const solution = cube.solve();
    
    if (!solution) return null;
    
    return solution.split(' ').filter(move => move.length > 0);
  } catch (error) {
    console.error('Solver Error:', error);
    return null;
  }
}
