import { BetColor, GameMode, GameResult, UserBet } from '../types';

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function generatePeriodId(mode: GameMode, timestamp: number = Date.now()): string {
  const dateStr = new Date(timestamp)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '');
  const minutesOfDay = Math.floor(
    (timestamp - new Date().setHours(0, 0, 0, 0)) / (mode === 'parity' ? 30000 : 60000)
  );
  const periodSeq = String(Math.max(1, minutesOfDay)).padStart(4, '0');
  const prefixMap: Record<GameMode, string> = {
    parity: '2026',
    sapre: '2027',
    bcone: '2028',
    emerd: '2029',
  };
  return `${prefixMap[mode]}${dateStr}${periodSeq}`;
}

export function calculateOutcome(number: number): {
  color: BetColor;
  colors: BetColor[];
  size: 'big' | 'small';
} {
  const size: 'big' | 'small' = number >= 5 ? 'big' : 'small';

  if (number === 0) {
    return { color: 'red', colors: ['red', 'violet'], size };
  }
  if (number === 5) {
    return { color: 'green', colors: ['green', 'violet'], size };
  }
  if ([1, 3, 7, 9].includes(number)) {
    return { color: 'green', colors: ['green'], size };
  }
  // 2, 4, 6, 8
  return { color: 'red', colors: ['red'], size };
}

export function evaluateBet(
  bet: UserBet,
  result: GameResult
): { won: boolean; winAmount: number } {
  let won = false;
  let multiplier = 0;

  if (bet.targetType === 'color') {
    if (bet.targetValue === 'violet') {
      if (result.colors.includes('violet')) {
        won = true;
        multiplier = 4.5;
      }
    } else if (bet.targetValue === 'green') {
      if (result.colors.includes('green')) {
        won = true;
        // if green has violet (i.e. number 5), 1.5x payout, otherwise 2x
        multiplier = result.colors.includes('violet') ? 1.5 : 2.0;
      }
    } else if (bet.targetValue === 'red') {
      if (result.colors.includes('red')) {
        won = true;
        // if red has violet (i.e. number 0), 1.5x payout, otherwise 2x
        multiplier = result.colors.includes('violet') ? 1.5 : 2.0;
      }
    }
  } else if (bet.targetType === 'number') {
    const targetNum = parseInt(bet.targetValue, 10);
    if (targetNum === result.number) {
      won = true;
      multiplier = 9.0;
    }
  } else if (bet.targetType === 'size') {
    if (bet.targetValue === result.size) {
      won = true;
      multiplier = 2.0;
    }
  }

  const winAmount = won ? Math.floor(bet.totalAmount * multiplier) : 0;
  return { won, winAmount };
}
