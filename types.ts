
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON'
}

export enum Difficulty {
  EASY = 'EASY', // 2x3 (6 cards)
  MEDIUM = 'MEDIUM', // 4x3 (12 cards)
  HARD = 'HARD' // 5x4 (20 cards)
}

export interface CardType {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameLevel {
  rows: number;
  cols: number;
  name: string;
}

export const Levels: Record<Difficulty, GameLevel> = {
  [Difficulty.EASY]: { rows: 2, cols: 3, name: 'Easy' },
  [Difficulty.MEDIUM]: { rows: 3, cols: 4, name: 'Medium' },
  [Difficulty.HARD]: { rows: 4, cols: 5, name: 'Hard' }
};
