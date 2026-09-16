import { Member, Package, PlanSettings, SimulationResult, TransactionRecord, RankReward } from '../types';
import { RANK_REWARDS } from '../data/mlmData';

/**
 * Calculates a complete binary plan simulation with capping and deduction breakdown
 */
export function calculatePlanSimulation(
  leftBV: number,
  rightBV: number,
  selectedPackage: Package,
  directCountLeft: number,
  directCountRight: number,
  directPackagePrice: number,
  settings: PlanSettings
): SimulationResult {
  const matchedBV = Math.min(leftBV, rightBV);
  let carryForwardLeg: 'LEFT' | 'RIGHT' | 'NONE' = 'NONE';
  let carryForwardBV = 0;

  if (leftBV > rightBV) {
    carryForwardLeg = 'LEFT';
    carryForwardBV = leftBV - rightBV;
  } else if (rightBV > leftBV) {
    carryForwardLeg = 'RIGHT';
    carryForwardBV = rightBV - leftBV;
  }

  // Direct Referral Income
  const totalDirects = directCountLeft + directCountRight;
  const directIncome = totalDirects * (directPackagePrice * (selectedPackage.directBonusPercent / 100));

  // Pair Matching Income
  const rawPairIncome = (matchedBV * selectedPackage.pairMatchingPercent) / 100;
  const cappingLimit = selectedPackage.dailyCapping;
  const payablePairIncome = settings.dailyCappingEnforced
    ? Math.min(rawPairIncome, cappingLimit)
    : rawPairIncome;
  const flushedIncome = Math.max(0, rawPairIncome - payablePairIncome);

  // Level Booster Estimate (approx 12-15% of pair matching from downlines)
  const levelIncomeEst = Math.round(payablePairIncome * 0.12);

  // Royalty Pool estimate if high package
  const royaltyPoolEst = selectedPackage.price >= 12000 ? Math.round(selectedPackage.price * 0.1) : 0;

  const grossTotal = directIncome + payablePairIncome + levelIncomeEst + royaltyPoolEst;
  const tdsAmount = (grossTotal * settings.tdsPercent) / 100;
  const adminAmount = (grossTotal * settings.adminPercent) / 100;
  const netPayable = Math.max(0, grossTotal - tdsAmount - adminAmount);

  return {
    leftBV,
    rightBV,
    packagePrice: selectedPackage.price,
    directCountLeft,
    directCountRight,
    matchedBV,
    carryForwardLeg,
    carryForwardBV,
    directIncome,
    pairMatchingIncome: rawPairIncome,
    cappingLimit,
    flushedIncome,
    payablePairIncome,
    levelIncomeEst,
    royaltyPoolEst,
    grossTotal,
    tdsAmount,
    adminAmount,
    netPayable,
  };
}

/**
 * Traverses uplines and adds BV to all ancestors
 */
export function propagateBVUpwards(
  members: Member[],
  startPlacementId: string,
  leg: 'LEFT' | 'RIGHT',
  volumeToAdd: number
): Member[] {
  const map = new Map<string, Member>(members.map((m) => [m.id, { ...m }]));
  let currentPlacementId: string | null = startPlacementId;
  let currentLeg: 'LEFT' | 'RIGHT' = leg;

  while (currentPlacementId && map.has(currentPlacementId)) {
    const upline = map.get(currentPlacementId)!;
    if (currentLeg === 'LEFT') {
      upline.leftBV += volumeToAdd;
      upline.leftTotalBV += volumeToAdd;
      upline.leftTeamCount += 1;
    } else {
      upline.rightBV += volumeToAdd;
      upline.rightTotalBV += volumeToAdd;
      upline.rightTeamCount += 1;
    }

    // Determine next upline's leg
    const nextPlacementId = upline.placementId;
    currentLeg = upline.leg;
    currentPlacementId = nextPlacementId;
  }

  return Array.from(map.values());
}

/**
 * Adds a new distributor to the binary tree with auto-spillover placement if the targeted position is occupied
 */
export function registerNewDistributor(
  members: Member[],
  data: {
    name: string;
    phone: string;
    email: string;
    sponsorId: string;
    placementId: string;
    preferredLeg: 'LEFT' | 'RIGHT';
    pkg: Package;
  }
): { updatedMembers: Member[]; newMember: Member; spilloverOccurred: boolean } {
  const memberList = members.map((m) => ({ ...m }));
  const memberMap = new Map<string, Member>(memberList.map((m) => [m.id, m]));

  const nextNumber = 1000 + memberList.length + 1;
  const newId = `MLM-${nextNumber}`;

  let targetPlacementId = data.placementId;
  let targetLeg = data.preferredLeg;
  let spilloverOccurred = false;

  // Check if chosen position is taken. If so, drill down that leg until a vacant slot is found (Spillover)
  while (true) {
    const parent = memberMap.get(targetPlacementId);
    if (!parent) break;

    const childId = targetLeg === 'LEFT' ? parent.leftChildId : parent.rightChildId;
    if (!childId) {
      // Slot is free!
      break;
    } else {
      // Slot is occupied -> spillover down this leg
      spilloverOccurred = true;
      targetPlacementId = childId;
      // continue down the same preferred leg or left
    }
  }

  const newMember: Member = {
    id: newId,
    name: data.name,
    phone: data.phone,
    email: data.email,
    sponsorId: data.sponsorId,
    placementId: targetPlacementId,
    leg: targetLeg,
    packageId: data.pkg.id,
    packageName: data.pkg.name,
    packageAmount: data.pkg.price,
    pv: data.pkg.pv,
    isActive: true,
    joinDate: new Date().toISOString().split('T')[0],
    leftChildId: null,
    rightChildId: null,
    leftBV: 0,
    rightBV: 0,
    leftTotalBV: 0,
    rightTotalBV: 0,
    leftTeamCount: 0,
    rightTeamCount: 0,
    directReferralsCount: 0,
    rank: 'DISTRIBUTOR',
    avatarSeed: data.name.split(' ')[0] || 'Member',
  };

  // Attach to parent
  const parentNode = memberMap.get(targetPlacementId);
  if (parentNode) {
    if (targetLeg === 'LEFT') {
      parentNode.leftChildId = newId;
    } else {
      parentNode.rightChildId = newId;
    }
  }

  // Update direct referrals count for sponsor
  const sponsor = memberMap.get(data.sponsorId);
  if (sponsor) {
    sponsor.directReferralsCount += 1;
  }

  memberMap.set(newId, newMember);

  // Propagate BV up the binary tree
  const membersWithBV = propagateBVUpwards(
    Array.from(memberMap.values()),
    targetPlacementId,
    targetLeg,
    data.pkg.pv
  );

  return {
    updatedMembers: membersWithBV,
    newMember,
    spilloverOccurred,
  };
}

/**
 * Calculates current rank and reward eligibility
 */
export function evaluateRankAndRewards(
  matchedPairs: number
): { currentRankReward: RankReward; nextRankReward?: RankReward; progressPercent: number } {
  let currentRank = RANK_REWARDS[0];
  let nextRank: RankReward | undefined = RANK_REWARDS[0];

  for (let i = 0; i < RANK_REWARDS.length; i++) {
    if (matchedPairs >= RANK_REWARDS[i].pairsRequired) {
      currentRank = RANK_REWARDS[i];
      nextRank = RANK_REWARDS[i + 1];
    } else {
      if (!nextRank || nextRank === currentRank) {
        nextRank = RANK_REWARDS[i];
      }
      break;
    }
  }

  let progressPercent = 100;
  if (nextRank && nextRank !== currentRank) {
    const prevReq = currentRank === nextRank ? 0 : currentRank.pairsRequired;
    const needed = nextRank.pairsRequired - prevReq;
    const done = Math.max(0, matchedPairs - prevReq);
    progressPercent = Math.min(100, Math.round((done / needed) * 100));
  }

  return {
    currentRankReward: currentRank,
    nextRankReward: nextRank,
    progressPercent,
  };
}

/**
 * Formats Indian Currency (INR Lakhs/Crores/Thousands)
 */
export function formatCurrency(amount: number, symbol = '₹'): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formatted}`;
}
