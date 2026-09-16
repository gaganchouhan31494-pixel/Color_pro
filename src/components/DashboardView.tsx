import React, { useState } from 'react';
import {
  TrendingUp,
  GitMerge,
  Award,
  Zap,
  Copy,
  Check,
  Users,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  Calendar,
  CreditCard,
  FileCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { Member, TransactionRecord, ActiveTab } from '../types';
import { formatCurrency, evaluateRankAndRewards } from '../utils/mlmEngine';
import { OfficialStampBadge } from './OfficialStampBadge';

interface DashboardViewProps {
  member: Member;
  allMembers: Member[];
  transactions: TransactionRecord[];
  onOpenAddMember: (placementId: string, leg: 'LEFT' | 'RIGHT') => void;
  onRunDailyMatching: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  lang: 'en' | 'hi';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  member,
  allMembers,
  transactions,
  onOpenAddMember,
  onRunDailyMatching,
  onNavigateTab,
  lang,
}) => {
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);

  const baseUrl = window.location.origin;
  const leftReferralLink = `${baseUrl}/register?ref=${member.id}&leg=LEFT`;
  const rightReferralLink = `${baseUrl}/register?ref=${member.id}&leg=RIGHT`;

  const copyToClipboard = (text: string, isLeft: boolean) => {
    navigator.clipboard.writeText(text);
    if (isLeft) {
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } else {
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    }
  };

  // Compute stats
  const totalEarned = transactions
    .filter((t) => t.isCredit && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const directIncomeTotal = transactions
    .filter((t) => t.type === 'DIRECT' && t.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const pairIncomeTotal = transactions
    .filter((t) => t.type === 'PAIR_MATCHING' && t.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const levelIncomeTotal = transactions
    .filter((t) => t.type === 'LEVEL_ROI' && t.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const royaltyTotal = transactions
    .filter((t) => t.type === 'ROYALTY' && t.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const roiTotal = transactions
    .filter((t) => t.type === 'DAILY_ROI' && t.isCredit)
    .reduce((sum, t) => sum + t.amount, 0);

  const matchedPairsApprox = Math.floor(member.leftTotalBV / 1000);
  const rankEvaluation = evaluateRankAndRewards(matchedPairsApprox);

  // Power leg vs weaker leg
  const isLeftPower = member.leftBV >= member.rightBV;
  const matchedPendingBV = Math.min(member.leftBV, member.rightBV);
  const pendingPairEarning = Math.round(matchedPendingBV * 0.1);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile & Welcome Hero (Clean Transparent Glass & Responsive Layout) */}
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Member Card */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-500/25 shrink-0">
              {member.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-white truncate">{member.name}</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  ID: {member.id}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1 shrink-0">
                  <Award className="w-3 h-3" />
                  {member.rank}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400">
                <span>
                  {lang === 'hi' ? 'सक्रिय पैकेज:' : 'Package:'}{' '}
                  <strong className="text-white">
                    {member.packageName} ({formatCurrency(member.packageAmount)})
                  </strong>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {lang === 'hi' ? 'स्पॉन्सर:' : 'Sponsor:'}{' '}
                  <strong className="text-slate-200">{member.sponsorId || 'Master ID'}</strong>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>
                  {lang === 'hi' ? 'जॉइनिंग:' : 'Joined:'}{' '}
                  <span className="text-slate-300">{member.joinDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Dual Leg Referral Links - Mobile Friendly Full Width Stacks */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-blue-500/30 flex items-center justify-between gap-3 text-xs flex-1 sm:flex-initial">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-blue-400 block uppercase tracking-wider">
                  {lang === 'hi' ? 'लेफ्ट रेफरल लिंक' : 'Left Link'}
                </span>
                <span className="font-mono text-slate-300 text-[11px] truncate block max-w-[150px] sm:max-w-[120px]">
                  ?ref={member.id}&leg=LEFT
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(leftReferralLink, true)}
                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-colors shrink-0"
                title="Copy Left Link"
              >
                {copiedLeft ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs flex-1 sm:flex-initial">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                  {lang === 'hi' ? 'राइट रेफरल लिंक' : 'Right Link'}
                </span>
                <span className="font-mono text-slate-300 text-[11px] truncate block max-w-[150px] sm:max-w-[120px]">
                  ?ref={member.id}&leg=RIGHT
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(rightReferralLink, false)}
                className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors shrink-0"
                title="Copy Right Link"
              >
                {copiedRight ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Legal & Anti-Duplicate Quick Compliance Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">
              {lang === 'hi'
                ? 'भारत सरकार पंजीकृत • 1-पैन-1-आईडी डुप्लीकेट संरक्षित • CIN: U74999DL'
                : 'Govt. 2021 Rules Compliant • 1-PAN-1-ID Anti-Duplicate Protected'}
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('PROOF')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>{lang === 'hi' ? 'कानूनी प्रूफ व स्टैम्प देखें' : 'View Legal Proof & Stamps'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Binary Volume Status & Matching Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left vs Right Live Business Volume */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'hi' ? 'लाइव बाइनरी लेग्स वॉल्यूम स्थिति' : 'Binary Leg Matching Status'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'hi'
                  ? '1:1 अनुपात में मैच होकर पेआउट बनता है और पावर लेग कैरी फॉरवर्ड रहती है'
                  : '1:1 ratio matches for daily payout. Excess strong leg volume carries forward'}
              </p>
            </div>

            {/* Run Daily Matching Button */}
            <button
              onClick={onRunDailyMatching}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all self-stretch sm:self-auto min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span>{lang === 'hi' ? 'दैनिक पेआउट मैचिंग चलाएं' : 'Run 1:1 Matching Payout'}</span>
            </button>
          </div>

          {/* Left vs Right Big Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Left Leg */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  {lang === 'hi' ? 'लेफ्ट लेग (Team A)' : 'Left Leg (Team A)'}
                </span>
                {isLeftPower && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    POWER LEG
                  </span>
                )}
              </div>

              <p className="text-2xl font-black text-white font-mono">
                {member.leftBV.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-400">BV</span>
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{lang === 'hi' ? 'टीम सदस्य:' : 'Team Size:'} <strong className="text-white">{member.leftTeamCount}</strong></span>
                <span>{lang === 'hi' ? 'लाइफटाइम:' : 'Lifetime:'} <strong className="text-slate-300">{member.leftTotalBV.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Right Leg */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  {lang === 'hi' ? 'राइट लेग (Team B)' : 'Right Leg (Team B)'}
                </span>
                {!isLeftPower && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    POWER LEG
                  </span>
                )}
              </div>

              <p className="text-2xl font-black text-white font-mono">
                {member.rightBV.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-400">BV</span>
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{lang === 'hi' ? 'टीम सदस्य:' : 'Team Size:'} <strong className="text-white">{member.rightTeamCount}</strong></span>
                <span>{lang === 'hi' ? 'लाइफटाइम:' : 'Lifetime:'} <strong className="text-slate-300">{member.rightTotalBV.toLocaleString()}</strong></span>
              </div>
            </div>
          </div>

          {/* Matching preview bar - Stacked on Mobile to prevent squishing */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-300 font-medium">
                {lang === 'hi' ? 'तत्काल मैच होने योग्य बिजनेस:' : 'Ready to Match in Next Cutoff:'}
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {matchedPendingBV.toLocaleString()} BV (= {formatCurrency(pendingPairEarning)} Binary Income)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-400 text-[11px] pt-1.5 border-t border-slate-900">
              <span>
                {lang === 'hi' ? 'पावर लेग से कैरी फॉरवर्ड:' : 'Carry Forward to Next Day:'}
              </span>
              <span className="font-mono text-cyan-300 font-bold">
                {Math.abs(member.leftBV - member.rightBV).toLocaleString()} BV ({isLeftPower ? 'LEFT' : 'RIGHT'})
              </span>
            </div>
          </div>
        </div>

        {/* Quick Summary & Action Card */}
        <div className="lg:col-span-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-between space-y-5">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'hi' ? 'कुल अर्जित कमीशन' : 'Total Earnings Accumulated'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {formatCurrency(totalEarned)}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">
              {lang === 'hi' ? '100% बैंक में ट्रांसफर योग्य (5% TDS कटकर)' : 'TDS & Admin Compliant Payout'}
            </p>

            {/* Next Rank Progress */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{lang === 'hi' ? 'अगला रैंक रिवॉर्ड:' : 'Next Milestone:'}</span>
                <span className="font-bold text-amber-400">
                  {rankEvaluation.nextRankReward?.rewardTitle || 'Max Crown'}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${rankEvaluation.progressPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{matchedPairsApprox} Pairs matched</span>
                <span>{rankEvaluation.nextRankReward?.pairsRequired || 1800} Pairs target</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onOpenAddMember(member.id, isLeftPower ? 'RIGHT' : 'LEFT')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors min-h-[44px]"
            >
              <Users className="w-4 h-4" />
              <span>
                {lang === 'hi'
                  ? `कमजोर लेग (${isLeftPower ? 'दाएं' : 'बाएं'}) में सदस्य जोड़ें`
                  : `Add Downline to Weaker Leg (${isLeftPower ? 'RIGHT' : 'LEFT'})`}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('TREE')}
                className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors min-h-[42px]"
              >
                <GitMerge className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'hi' ? 'जीनोलॉजी ट्री' : 'Binary Tree'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('WALLET')}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 hover:from-indigo-900/80 hover:to-purple-900/80 text-indigo-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-indigo-500/30 transition-colors min-h-[42px]"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'hi' ? 'मोबाइल रिचार्ज' : 'Recharge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6+ Active Income Streams Dashboard Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'hi' ? 'इनकम प्रकार अनुसार संचित कमाई' : 'Income Streams Real-Time Breakdown'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi' ? '7 विभिन्न प्रकार के आय स्रोतों का वास्तविक समय डेटा' : 'Multi-tier earning channels with real-time audit ledger'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('INCOMES')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
          >
            <span>{lang === 'hi' ? 'सभी 7 प्लान देखें' : 'View Incomes'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* 1. Direct Income */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400">
                1. {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर इनकम' : 'Direct Referral Income'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">
                10% - 15%
              </span>
            </div>
            <h3 className="text-xl font-mono font-black text-white">
              {formatCurrency(directIncomeTotal)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'प्रत्येक व्यक्तिगत रूप से जोड़े गए सदस्य के पैकेज पर'
                : 'Earned instantly on direct sponsor package purchases'}
            </p>
          </div>

          {/* 2. Pair Matching Income */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                2. {lang === 'hi' ? '1:1 बाइनरी पेयर इनकम' : '1:1 Binary Pair Income'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                10% Matching
              </span>
            </div>
            <h3 className="text-xl font-mono font-black text-white">
              {formatCurrency(pairIncomeTotal)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'लेफ्ट एवं राइट के समान BV मैचिंग पर दैनिक भुगतान'
                : '1:1 matched volume paid out daily with carry-forward'}
            </p>
          </div>

          {/* 3. Daily ROI */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">
                3. {lang === 'hi' ? 'दैनिक प्रोडक्ट कैश रिटर्न' : 'Daily Cash Back / ROI'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                0.5% - 1%
              </span>
            </div>
            <h3 className="text-xl font-mono font-black text-white">
              {formatCurrency(roiTotal)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? '200 दिनों तक दैनिक निष्क्रिय रिटर्न'
                : 'Daily passive credit on active product packages for 200 days'}
            </p>
          </div>

          {/* 4. Generation Level Income */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400">
                4. {lang === 'hi' ? 'जनरेशन लेवल बोनस' : 'Generation Level Bonus'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                Up to 7 Levels
              </span>
            </div>
            <h3 className="text-xl font-mono font-black text-white">
              {formatCurrency(levelIncomeTotal)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'डाउनलाइन वितरकों की पेयर मैचिंग कमाई का प्रतिशत'
                : 'Matching bonus on downline distributor binary checks'}
            </p>
          </div>

          {/* 5. Company Turnover Royalty */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400">
                5. {lang === 'hi' ? 'कंपनी टर्नओवर रॉयल्टी' : 'Company Turnover Royalty'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300">
                1% - 3% Pool
              </span>
            </div>
            <h3 className="text-xl font-mono font-black text-white">
              {formatCurrency(royaltyTotal)}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi'
                ? 'कंपनी के कुल मासिक टर्नओवर से शेयर'
                : 'Profit sharing pool for top Gold & Diamond leaders'}
            </p>
          </div>

          {/* 6. Lifetime Rank Rewards */}
          <div className="p-4 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-rose-500/40 transition-colors space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">
                6. {lang === 'hi' ? 'लाइफटाइम रिवॉर्ड्स व फंड' : 'Lifetime Rank Rewards'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300">
                Gifts & Trips
              </span>
            </div>
            <h3 className="text-sm font-bold text-white truncate">
              {rankEvaluation.currentRankReward.rewardTitle}
            </h3>
            <p className="text-xs font-mono font-bold text-emerald-400">
              {formatCurrency(rankEvaluation.currentRankReward.rewardValue)} Achieved!
            </p>
          </div>
        </div>
      </div>

      {/* Downline Fast Team List */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'hi' ? 'डायरेक्ट स्पॉन्सर्ड डिस्ट्रीब्यूटर्स' : 'Direct Sponsored Team Members'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'आपकी आईडी से सीधे जुड़े सदस्य और उनका बिजनेस'
                : 'Distributors directly registered under your sponsor code'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('TEAM')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 shrink-0"
          >
            {lang === 'hi' ? 'पूरी टीम देखें →' : 'View All Team →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allMembers
            .filter((m) => m.sponsorId === member.id)
            .map((downline) => (
              <div
                key={downline.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                    {downline.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white truncate">{downline.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {downline.id} • {downline.leg} Leg
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-white block">
                    {downline.packageAmount.toLocaleString()} BV
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {downline.packageName}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
