import React, { useState } from 'react';
import {
  UserCheck,
  GitMerge,
  TrendingDown,
  Layers,
  Crown,
  Award,
  Sparkles,
  Calculator,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Percent,
} from 'lucide-react';
import { INCOME_STREAMS, RANK_REWARDS, PACKAGES } from '../data/mlmData';
import { formatCurrency } from '../utils/mlmEngine';

interface IncomeStreamsViewProps {
  lang: 'en' | 'hi';
  onNavigateToCalculator: () => void;
}

export const IncomeStreamsView: React.FC<IncomeStreamsViewProps> = ({
  lang,
  onNavigateToCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [testVolume, setTestVolume] = useState<number>(10000);

  // Icon map
  const getIcon = (name: string) => {
    switch (name) {
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-blue-400" />;
      case 'GitMerge':
        return <GitMerge className="w-5 h-5 text-emerald-400" />;
      case 'TrendingDown':
        return <TrendingDown className="w-5 h-5 text-cyan-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-rose-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-emerald-300" />;
      default:
        return <Percent className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-cyan-900/30 border border-emerald-500/30 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? '7 प्रकार की शानदार बाइनरी इनकम'
                : '7 High-Earning Binary Income Streams'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {lang === 'hi'
              ? 'बाइनरी एमएलएम प्लान इनकम संरचना'
              : 'Complete MLM Binary Income Architecture'}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {lang === 'hi'
              ? 'यह प्लान 1:1 पेयर मैचिंग, पावर लेग कैरी फॉरवर्ड, डायरेक्ट स्पॉन्सर, 7-लेवल जनरेशन, कंपनी ग्लोबल रॉयल्टी तथा लाइफटाइम रिवॉर्ड्स का एक पारदर्शी और अत्यधिक लाभकारी मॉडल प्रस्तुत करता है।'
              : 'Engineered for exponential distributor motivation: featuring 1:1 business matching, permanent power-leg carry forward, direct referral bonuses, 7-level generation boosters, global turnover royalty, and guaranteed milestone gifts.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToCalculator}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span>{lang === 'hi' ? 'प्लान कैलकुलेटर चलाएं' : 'Open Plan Calculator'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'hi'
                  ? 'TDS 5% + Admin 5% पारदर्शी कटौती'
                  : 'TDS 5% + Admin 5% Transparent Deductions'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of All Incomes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'hi' ? 'विस्तृत इनकम विवरण' : 'Detailed Income Stream Breakdown'}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {lang === 'hi' ? 'कुल 7 एक्टिव इनकम स्रोत' : '7 Active Income Modules'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INCOME_STREAMS.map((stream, idx) => {
            return (
              <div
                key={stream.id}
                className={`p-6 rounded-2xl bg-gradient-to-b ${stream.bgGradient} bg-slate-900/90 border backdrop-blur-sm shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all group`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        {getIcon(stream.iconName)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          INCOME #{idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {lang === 'hi' ? stream.nameHi : stream.name}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-800 border border-slate-700 text-white shrink-0">
                      {stream.percentageOrAmount}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs font-medium text-emerald-400 mb-2">
                    {lang === 'hi' ? stream.taglineHi : stream.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {lang === 'hi' ? stream.descriptionHi : stream.description}
                  </p>

                  {/* Formula Box */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-mono text-cyan-300 mb-3 space-y-1">
                    <span className="text-[10px] font-sans font-bold text-slate-500 block uppercase">
                      {lang === 'hi' ? 'गणना सूत्र (Calculation Formula):' : 'Formula:'}
                    </span>
                    <p className="text-[11px] break-words">{stream.formula}</p>
                  </div>
                </div>

                {/* Key Rule Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'hi' ? stream.keyRuleHi : stream.keyRule}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranks & Milestone Rewards Showcase */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Award className="w-4 h-4" />
              <span>{lang === 'hi' ? 'लाइफटाइम पेयर रिवॉर्ड्स' : 'Cumulative Lifetime Rewards'}</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {lang === 'hi' ? 'रैंक रिवॉर्ड्स और लीडरशिप फंड्स' : 'Rank Achievements & Guaranteed Gifts'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'hi'
                ? 'कोई समय सीमा नहीं! जैसे ही आपके पेयर्स मैच होते हैं, गिफ्ट या नकद राशि अनलॉक हो जाती है।'
                : 'No time limits or volume flushing. Rewards unlock automatically as binary pairs accumulate.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RANK_REWARDS.map((item, i) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {lang === 'hi' ? item.rankNameHi : item.rankName}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {item.pairsRequired} {lang === 'hi' ? 'पेयर्स' : 'Pairs'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {lang === 'hi' ? item.rewardTitleHi : item.rewardTitle}
                </h4>
                <p className="text-xs text-emerald-400 font-extrabold">
                  {lang === 'hi' ? 'मूल्य: ' : 'Value: '}{formatCurrency(item.rewardValue)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{lang === 'hi' ? 'रॉयल्टी शेयर:' : 'Royalty Pool:'}</span>
                <span className="font-bold text-cyan-300">+{item.royaltyPoolPercent}% Global</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Binary Plan Advantage Explanation Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'hi' ? 'बाइनरी प्लान ही सबसे सफल क्यों है?' : 'Why is the Binary Plan Most Preferred?'}</span>
        </h3>
        <p className="leading-relaxed">
          {lang === 'hi'
            ? '1. इसमें केवल 2 लेग्स (Team A और Team B) होती हैं, जिससे टीम का फोकस बहुत स्पष्ट रहता है।'
            : '1. Only two legs (Team A and Team B) are required, allowing crystal clear team focus.'}
        </p>
        <p className="leading-relaxed">
          {lang === 'hi'
            ? '2. अपलाइन की अतिरिक्त जॉइनिंग सीधे नीचे वाले डिस्ट्रीब्यूटर को मिलती है (Spillover Benefit), जिससे नए सदस्य भी बहुत जल्दी कमाने लगते हैं।'
            : '2. Extra recruits from uplines spill over under new team members, giving rapid initial momentum.'}
        </p>
        <p className="leading-relaxed">
          {lang === 'hi'
            ? '3. पावर लेग का बिजनेस कभी लैप्स नहीं होता (Life-time Carry Forward), जिससे डिस्ट्रीब्यूटर की मेहनत कभी बर्बाद नहीं जाती।'
            : '3. Strong power leg business volume carries forward permanently, guaranteeing no wasted distributor effort.'}
        </p>
      </div>
    </div>
  );
};
