export type GameMode = '30s' | '1m' | '3m';

export type BetTargetType = 'color' | 'number' | 'size';

export type ColorType = 'green' | 'red' | 'violet';
export type SizeType = 'big' | 'small';

export type AppPage =
  | 'game'
  | 'deposit'
  | 'withdraw'
  | 'transactions'
  | 'refer'
  | 'proof'
  | 'support'
  | 'about'
  | 'profile'
  | 'auth';

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
  totalDeposited: number;
  totalWithdrawn: number;
}

export interface BankAccount {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface UserAccount {
  id: string;
  phone: string;
  username: string;
  avatar: string;
  vipLevel: number;
  inviteCode: string;
  invitedBy?: string;
  isLoggedIn: boolean;
  createdAt: number;
  bankDetails?: BankAccount;
}

export interface DepositRecord {
  id: string;
  amount: number;
  method: 'upi' | 'paytm' | 'phonepe' | 'gpay' | 'bank' | 'usdt' | string;
  status: 'completed' | 'processing' | 'failed';
  utr: string;
  bonus: number;
  timestamp: number;
}

export interface WithdrawRecord {
  id: string;
  amount: number;
  payoutMethod: 'bank' | 'upi' | string;
  targetAddress: string;
  status: 'completed' | 'processing' | 'pending';
  utr: string;
  fee: number;
  timestamp: number;
}

export interface ProofItem {
  id: string;
  userMasked: string;
  avatar: string;
  amount: number;
  method: string;
  utr: string;
  timeAgo: string;
  bankName: string;
  city: string;
}

export interface ReferralFriend {
  id: string;
  phone: string;
  level: 1 | 2 | 3;
  date: string;
  totalBet: number;
  commission: number;
}

export interface ReferralData {
  inviteCode: string;
  referralLink: string;
  totalInvited: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  todayCommission: number;
  totalCommission: number;
  claimedCommission: number;
  unclaimedCommission: number;
  friends: ReferralFriend[];
}

export type Language = 'en' | 'hi';

export type ThemeMode = 'dark' | 'light';

export type ColorThemeId = 'monochrome' | 'emerald' | 'cyber' | 'royalGold' | 'rubyMonaco' | 'platinumLight' | 'pearlGoldLight';

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
  activeTabClass: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
}


