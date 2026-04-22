/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export enum CubeColor {
  WHITE = 'white',
  RED = 'red',
  GREEN = 'green',
  YELLOW = 'yellow',
  ORANGE = 'orange',
  BLUE = 'blue',
}

export const FACE_NAMES: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];

export const INITIAL_CUBE_STATE: Record<FaceName, CubeColor[]> = {
  U: Array(9).fill(CubeColor.WHITE),
  R: Array(9).fill(CubeColor.RED),
  F: Array(9).fill(CubeColor.GREEN),
  D: Array(9).fill(CubeColor.YELLOW),
  L: Array(9).fill(CubeColor.ORANGE),
  B: Array(9).fill(CubeColor.BLUE),
};

export const COLOR_MAP: Record<CubeColor, string> = {
  [CubeColor.WHITE]: '#FFFFFF',
  [CubeColor.RED]: '#C41E3A',
  [CubeColor.GREEN]: '#009E60',
  [CubeColor.YELLOW]: '#FFD500',
  [CubeColor.ORANGE]: '#FF5800',
  [CubeColor.BLUE]: '#0051BA',
};

export const FACE_TO_COLOR: Record<FaceName, CubeColor> = {
  U: CubeColor.WHITE,
  R: CubeColor.RED,
  F: CubeColor.GREEN,
  D: CubeColor.YELLOW,
  L: CubeColor.ORANGE,
  B: CubeColor.BLUE,
};

export const COLOR_TO_FACE_CHAR: Record<CubeColor, string> = {
  [CubeColor.WHITE]: 'U',
  [CubeColor.RED]: 'R',
  [CubeColor.GREEN]: 'F',
  [CubeColor.YELLOW]: 'D',
  [CubeColor.ORANGE]: 'L',
  [CubeColor.BLUE]: 'B',
};

export const FACE_CHAR_TO_COLOR: Record<string, CubeColor> = {
  U: CubeColor.WHITE,
  R: CubeColor.RED,
  F: CubeColor.GREEN,
  D: CubeColor.YELLOW,
  L: CubeColor.ORANGE,
  B: CubeColor.BLUE,
};
