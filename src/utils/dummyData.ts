import { DepositRecord, GameResult, WithdrawRecord } from '../types';
import { calculateOutcome } from './gameLogic';

export const INITIAL_RESULTS: GameResult[] = Array.from({ length: 25 }).map((_, i) => {
  const timestamp = Date.now() - (25 - i) * 60000;
  const num = Math.floor(Math.random() * 10);
  const outcome = calculateOutcome(num);
  const periodSeq = String(1000 + i).padStart(4, '0');
  return {
    period: `20260916${periodSeq}`,
    number: num,
    color: outcome.color,
    colors: outcome.colors,
    size: outcome.size,
    hash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    timestamp,
  };
}).reverse();

export const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    id: 'DEP-8842',
    amount: 1000,
    bonus: 100,
    method: 'UPI Instant',
    utr: '425918372645',
    status: 'completed',
    timestamp: Date.now() - 3600000 * 2,
  },
  {
    id: 'DEP-9104',
    amount: 500,
    bonus: 50,
    method: 'Paytm UPI',
    utr: '425938472911',
    status: 'completed',
    timestamp: Date.now() - 3600000 * 18,
  },
];

export const INITIAL_WITHDRAWALS: WithdrawRecord[] = [
  {
    id: 'WDR-3312',
    amount: 2500,
    fee: 0,
    payoutMethod: 'bank',
    targetAddress: 'HDFC Bank •••• 4912',
    utr: 'UTR4918274619',
    status: 'completed',
    timestamp: Date.now() - 3600000 * 5,
  },
];

export const MOCK_TICKER_WINNERS = [
  { user: 'VIP_Raj99', win: '₹18,500', game: 'Parity 9X Number' },
  { user: 'Sunil_Pro', win: '₹4,200', game: 'Violet 4.5X Win' },
  { user: 'Pooja_K', win: '₹9,000', game: 'Green Double' },
  { user: 'Amit_Singh', win: '₹27,000', game: 'Number 7 Mega Hit' },
  { user: 'Vicky_88', win: '₹3,600', game: 'Red Double' },
];
