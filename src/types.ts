export type GameMode = 'parity' | 'sapre' | 'bcone' | 'emerd';

export type BetColor = 'green' | 'violet' | 'red';

export type BetTargetType = 'color' | 'number' | 'size';

export interface UserBet {
  id: string;
  period: string;
  gameMode: GameMode;
  targetType: BetTargetType;
  targetValue: string; // 'green' | 'red' | 'violet' | '0'-'9' | 'big' | 'small'
  amount: number;
  multiplier: number;
  totalAmount: number;
  status: 'pending' | 'won' | 'lost';
  winAmount?: number;
  createdAt: number;
}

export interface GamePeriod {
  period: string;
  gameMode: GameMode;
  countdown: number;
  duration: number;
  status: 'betting' | 'calculating' | 'completed';
}

export interface GameResult {
  period: string;
  number: number;
  color: BetColor;
  colors: BetColor[];
  size: 'big' | 'small';
  hash: string;
  timestamp: number;
}

export interface UserWallet {
  balance: number;
  totalWon: number;
  totalWithdrawn: number;
  totalRecharged: number;
}

export interface UserAccount {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  vipLevel: number;
  isLoggedIn: boolean;
}

export interface DepositRecord {
  id: string;
  amount: number;
  bonus: number;
  method: string;
  utr: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: number;
}

export interface WithdrawRecord {
  id: string;
  amount: number;
  fee: number;
  payoutMethod: 'bank' | 'upi';
  targetAddress: string;
  utr: string;
  status: 'completed' | 'processing' | 'failed';
  timestamp: number;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId: string;
}

export type AppPage =
  | 'game'
  | 'deposit'
  | 'withdraw'
  | 'transactions'
  | 'refer'
  | 'proof'
  | 'support'
  | 'profile'
  | 'auth';

export type Language = 'en' | 'hi';

export type ThemeMode = 'dark' | 'light';

export type ColorThemeId =
  | 'monochrome'
  | 'emerald'
  | 'cyber'
  | 'royalGold'
  | 'rubyMonaco'
  | 'platinumLight'
  | 'pearlGoldLight';

export interface ThemeConfig {
  id: ColorThemeId;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  previewColors: string[];
  mode: ThemeMode;
  bgClass: string;
  headerBg: string;
  headerBorder: string;
  ambientGlow1: string;
  ambientGlow2: string;
  activeTabClass?: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
}
