export type Leg = 'LEFT' | 'RIGHT';

export type MemberRank =
  | 'DISTRIBUTOR'
  | 'STAR'
  | 'SILVER'
  | 'GOLD'
  | 'PLATINUM'
  | 'DIAMOND'
  | 'CROWN_AMBASSADOR';

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  sponsorId: string | null;
  placementId: string | null;
  leg: Leg;
  packageId: string;
  packageName: string;
  packageAmount: number;
  pv: number; // Point Value / Business Volume
  isActive: boolean;
  joinDate: string;
  leftChildId?: string | null;
  rightChildId?: string | null;
  leftBV: number; // current balance Left BV
  rightBV: number; // current balance Right BV
  leftTotalBV: number; // lifetime accumulated
  rightTotalBV: number; // lifetime accumulated
  leftTeamCount: number;
  rightTeamCount: number;
  directReferralsCount: number;
  rank: MemberRank;
  avatarSeed: string;
}

export interface Package {
  id: string;
  name: string;
  nameHi: string;
  price: number;
  pv: number;
  dailyCapping: number; // Max binary payout per day
  directBonusPercent: number; // e.g. 10%
  pairMatchingPercent: number; // e.g. 10%
  roiDailyPercent: number; // e.g. 0.5% daily
  roiDays: number; // e.g. 200 days
  color: string;
  borderColor: string;
  badgeBg: string;
  features: string[];
  featuresHi: string[];
  isPopular?: boolean;
}

export type IncomeCategory =
  | 'DIRECT'
  | 'PAIR_MATCHING'
  | 'LEVEL_ROI'
  | 'SPILLOVER'
  | 'ROYALTY'
  | 'REWARD'
  | 'DAILY_ROI';

export interface IncomeStreamInfo {
  id: IncomeCategory;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  percentageOrAmount: string;
  iconName: string;
  color: string;
  bgGradient: string;
  description: string;
  descriptionHi: string;
  formula: string;
  keyRule: string;
  keyRuleHi: string;
}

export interface TransactionRecord {
  id: string;
  date: string;
  type: IncomeCategory | 'WITHDRAWAL' | 'PACKAGE_PURCHASE' | 'MOBILE_RECHARGE';
  title: string;
  titleHi: string;
  amount: number;
  isCredit: boolean;
  notes: string;
  memberReference?: string;
  status: 'COMPLETED' | 'PENDING' | 'REJECTED';
}

export interface RankReward {
  id: string;
  rank: MemberRank;
  rankName: string;
  rankNameHi: string;
  pairsRequired: number;
  rewardTitle: string;
  rewardTitleHi: string;
  rewardValue: number;
  royaltyPoolPercent: number;
  icon: string;
  badgeColor: string;
}

export interface PlanSettings {
  companyName: string;
  currency: string;
  currencySymbol: string;
  matchingRatio: '1:1' | '2:1_OR_1:2';
  defaultPairPercentage: number;
  defaultDirectPercentage: number;
  tdsPercent: number;
  adminPercent: number;
  minWithdrawal: number;
  spilloverEnabled: boolean;
  powerLegCarryForward: boolean;
  dailyCappingEnforced: boolean;
}

export interface SimulationResult {
  leftBV: number;
  rightBV: number;
  packagePrice: number;
  directCountLeft: number;
  directCountRight: number;
  matchedBV: number;
  carryForwardLeg: 'LEFT' | 'RIGHT' | 'NONE';
  carryForwardBV: number;
  directIncome: number;
  pairMatchingIncome: number;
  cappingLimit: number;
  flushedIncome: number;
  payablePairIncome: number;
  levelIncomeEst: number;
  royaltyPoolEst: number;
  grossTotal: number;
  tdsAmount: number;
  adminAmount: number;
  netPayable: number;
}

export type ThemeColor = 'emerald' | 'sapphire' | 'purple' | 'amber' | 'crimson';

export interface LegalDocument {
  id: string;
  title: string;
  titleHi: string;
  category: 'REGISTRATION' | 'COMPLIANCE' | 'TAX' | 'ISO';
  regNumber: string;
  authority: string;
  issuedDate: string;
  status: 'ACTIVE' | 'VERIFIED';
  description: string;
  descriptionHi: string;
  stampType: 'MCA' | 'ISO' | 'GOVT' | 'TAX' | 'SECURITY';
  docDate: string;
}

export interface MemberVerificationResult {
  isFound: boolean;
  isDuplicate: boolean;
  member?: Member;
  panNumber?: string;
  verificationId?: string;
  verifiedAt?: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'DUPLICATE_FLAGGED';
  riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
  state: string;
  remarks: string;
  remarksHi: string;
  originalMemberId?: string;
}

export type ActiveTab =
  | 'DASHBOARD'
  | 'TREE'
  | 'PROOF'
  | 'TEAM'
  | 'INCOMES'
  | 'CALCULATOR'
  | 'PACKAGES'
  | 'WALLET';

