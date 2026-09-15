export type GameMode = '30s' | '1m' | '3m';

export type BetTargetType = 'color' | 'number' | 'size';

export type ColorType = 'green' | 'red' | 'violet';
export type SizeType = 'big' | 'small';

export interface RoundResult {
  id: string; // e.g. "20260915001"
  period: string;
  gameMode: GameMode;
  number: number; // 0 - 9
  colors: ColorType[]; // [red, violet] for 0, [green, violet] for 5, etc.
  size: SizeType; // big (5-9), small (0-4)
  timestamp: number;
  hash?: string;
}

export interface UserBet {
  id: string;
  period: string;
  gameMode: GameMode;
  targetType: BetTargetType;
  selectedColor?: ColorType;
  selectedNumber?: number;
  selectedSize?: SizeType;
  amount: number;
  multiplier: number;
  totalBet: number;
  status: 'pending' | 'won' | 'lost';
  winAmount?: number;
  roundResult?: RoundResult;
  createdAt: number;
}

export interface UserWallet {
  balance: number;
  totalWon: number;
  totalLost: number;
  totalBetsPlaced: number;
}

export type Language = 'en' | 'hi';
