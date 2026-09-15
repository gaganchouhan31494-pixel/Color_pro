import { ColorType, GameMode, RoundResult, SizeType, UserBet } from '../types';

export const NUMBER_PROPERTIES: Record<number, { colors: ColorType[]; size: SizeType }> = {
  0: { colors: ['red', 'violet'], size: 'small' },
  1: { colors: ['green'], size: 'small' },
  2: { colors: ['red'], size: 'small' },
  3: { colors: ['green'], size: 'small' },
  4: { colors: ['red'], size: 'small' },
  5: { colors: ['green', 'violet'], size: 'big' },
  6: { colors: ['red'], size: 'big' },
  7: { colors: ['green'], size: 'big' },
  8: { colors: ['red'], size: 'big' },
  9: { colors: ['green'], size: 'big' },
};

export function getNumberColors(num: number): ColorType[] {
  return NUMBER_PROPERTIES[num]?.colors || ['green'];
}

export function getNumberSize(num: number): SizeType {
  return NUMBER_PROPERTIES[num]?.size || 'small';
}

export function generatePeriodId(gameMode: GameMode, offset: number = 0): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const prefix = `${year}${month}${day}`;

  // Deterministic or timestamp based period count
  const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const intervalSeconds = gameMode === '30s' ? 30 : gameMode === '1m' ? 60 : 180;
  const currentInterval = Math.floor(secondsSinceMidnight / intervalSeconds) + offset + 1;
  const modeCode = gameMode === '30s' ? '1' : gameMode === '1m' ? '2' : '3';
  return `${prefix}${modeCode}${String(currentInterval).padStart(4, '0')}`;
}

export function generateRandomResult(period: string, gameMode: GameMode): RoundResult {
  const number = Math.floor(Math.random() * 10);
  const { colors, size } = NUMBER_PROPERTIES[number];
  
  // Random hash for provably fair simulation feel
  const characters = 'abcdef0123456789';
  let hash = '0x';
  for (let i = 0; i < 16; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return {
    id: period,
    period,
    gameMode,
    number,
    colors,
    size,
    timestamp: Date.now(),
    hash,
  };
}

export function calculateBetResult(bet: UserBet, result: RoundResult): { status: 'won' | 'lost'; winAmount: number } {
  let isWin = false;
  let multiplier = 0;

  if (bet.targetType === 'color' && bet.selectedColor) {
    if (bet.selectedColor === 'green') {
      if (result.number === 5) {
        // Dual color half payout (1.5x)
        isWin = true;
        multiplier = 1.5;
      } else if ([1, 3, 7, 9].includes(result.number)) {
        isWin = true;
        multiplier = 2.0;
      }
    } else if (bet.selectedColor === 'red') {
      if (result.number === 0) {
        // Dual color half payout (1.5x)
        isWin = true;
        multiplier = 1.5;
      } else if ([2, 4, 6, 8].includes(result.number)) {
        isWin = true;
        multiplier = 2.0;
      }
    } else if (bet.selectedColor === 'violet') {
      if ([0, 5].includes(result.number)) {
        isWin = true;
        multiplier = 4.5;
      }
    }
  } else if (bet.targetType === 'number' && bet.selectedNumber !== undefined) {
    if (result.number === bet.selectedNumber) {
      isWin = true;
      multiplier = 9.0;
    }
  } else if (bet.targetType === 'size' && bet.selectedSize) {
    if (result.size === bet.selectedSize) {
      isWin = true;
      multiplier = 2.0;
    }
  }

  const winAmount = isWin ? Math.floor(bet.totalBet * multiplier) : 0;
  return {
    status: isWin ? 'won' : 'lost',
    winAmount,
  };
}

export function generateInitialHistory(gameMode: GameMode, count = 20): RoundResult[] {
  const list: RoundResult[] = [];
  const baseTimestamp = Date.now();
  const intervalSeconds = gameMode === '30s' ? 30 : gameMode === '1m' ? 60 : 180;

  for (let i = count; i >= 1; i--) {
    const period = generatePeriodId(gameMode, -i);
    const num = Math.floor(Math.random() * 10);
    const { colors, size } = NUMBER_PROPERTIES[num];
    list.push({
      id: period,
      period,
      gameMode,
      number: num,
      colors,
      size,
      timestamp: baseTimestamp - i * intervalSeconds * 1000,
    });
  }
  return list;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
