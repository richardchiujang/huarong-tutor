export type PieceType = 'cao-cao' | 'v-general' | 'h-general' | 'soldier';

export interface Position {
  x: number; // 0-3 (col)
  y: number; // 0-4 (row)
}

export interface Piece {
  id: string;
  type: PieceType;
  width: number;
  height: number;
  x: number;
  y: number;
  label: string; // e.g., "曹操", "關羽"
}

export interface GameState {
  pieces: Piece[];
  history: Piece[][]; // Array of piece configurations
  historyIndex: number;
  stepCount: number;
  isComplete: boolean;
}

// Standard "Heng Dao Li Ma" (橫刀立馬) Layout
export const INITIAL_PIECES: Piece[] = [
  { id: 'cao', type: 'cao-cao', width: 2, height: 2, x: 1, y: 0, label: '曹操' },
  { id: 'v1', type: 'v-general', width: 1, height: 2, x: 0, y: 0, label: '張飛' },
  { id: 'v2', type: 'v-general', width: 1, height: 2, x: 3, y: 0, label: '趙雲' },
  { id: 'v3', type: 'v-general', width: 1, height: 2, x: 0, y: 2, label: '馬超' },
  { id: 'v4', type: 'v-general', width: 1, height: 2, x: 3, y: 2, label: '黃忠' },
  { id: 'h1', type: 'h-general', width: 2, height: 1, x: 1, y: 2, label: '關羽' },
  { id: 's1', type: 'soldier', width: 1, height: 1, x: 0, y: 4, label: '卒' },
  { id: 's2', type: 'soldier', width: 1, height: 1, x: 1, y: 3, label: '卒' },
  { id: 's3', type: 'soldier', width: 1, height: 1, x: 2, y: 3, label: '卒' },
  { id: 's4', type: 'soldier', width: 1, height: 1, x: 3, y: 4, label: '卒' },
];

export const BOARD_WIDTH = 4;
export const BOARD_HEIGHT = 5;
export const TARGET_STEPS = 81;
