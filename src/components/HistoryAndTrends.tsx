import React, { useState } from 'react';
import { History, TrendingUp, UserCheck, BookOpen, ChevronRight } from 'lucide-react';
import { GameMode, Language, RoundResult, UserBet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';

interface HistoryAndTrendsProps {
  history: RoundResult[];
  userBets: UserBet[];
  gameMode: GameMode;
  language: Language;
}

type TabType = 'history' | 'trend' | 'myBets' | 'rules';

export const HistoryAndTrends: React.FC<HistoryAndTrendsProps> = ({
  history,
  userBets,
  gameMode,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [betFilter, setBetFilter] = useState<'all' | 'won' | 'lost' | 'pending'>('all');

  // Filter user bets for current mode or all
  const filteredBets = userBets.filter((bet) => {
    if (betFilter === 'all') return true;
    return bet.status === betFilter;
  });

  // Calculate statistics for trend chart
  const recent30 = history.slice(0, 30);
  const totalCount = recent30.length || 1;

  let greenCount = 0;
  let redCount = 0;
  let violetCount = 0;
  let bigCount = 0;
  let smallCount = 0;

  recent30.forEach((r) => {
    if (r.colors.includes('green')) greenCount++;
    if (r.colors.includes('red')) redCount++;
    if (r.colors.includes('violet')) violetCount++;
    if (r.size === 'big') bigCount++;
    if (r.size === 'small') smallCount++;
  });

  const greenPct = Math.round((greenCount / totalCount) * 100);
  const redPct = Math.round((redCount / totalCount) * 100);
  const violetPct = Math.round((violetCount / totalCount) * 100);
  const bigPct = Math.round((bigCount / totalCount) * 100);
  const smallPct = Math.round((smallCount / totalCount) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 pb-3 mb-4 gap-2 overflow-x-auto">
        <button
          id="tab-btn-history"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>{t.tabHistory}</span>
        </button>

        <button
          id="tab-btn-trend"
          onClick={() => setActiveTab('trend')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'trend'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t.tabTrend}</span>
        </button>

        <button
          id="tab-btn-mybets"
          onClick={() => setActiveTab('myBets')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'myBets'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.tabMyBets}</span>
          {userBets.length > 0 && (
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full">
              {userBets.length}
            </span>
          )}
        </button>

        <button
          id="tab-btn-rules"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t.tabRules}</span>
        </button>
      </div>

      {/* Tab 1: Game History Record */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">{t.period}</th>
                <th className="py-2.5 px-3 text-center">{t.drawNumber}</th>
                <th className="py-2.5 px-3 text-center">{t.drawSize}</th>
                <th className="py-2.5 px-3 text-center">{t.drawColor}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {history.map((row) => {
                const isDualRed = row.number === 0;
                const isDualGreen = row.number === 5;
                const isGreen = row.colors.includes('green') && !isDualGreen;

                return (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-300 font-medium">
                      {row.period}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-white text-sm shadow-sm ${
                        isDualRed
                          ? 'bg-gradient-to-r from-rose-600 via-purple-600 to-purple-600'
                          : isDualGreen
                          ? 'bg-gradient-to-r from-emerald-600 via-purple-600 to-purple-600'
                          : isGreen
                          ? 'bg-emerald-600'
                          : 'bg-rose-600'
                      }`}>
                        {row.number}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        row.size === 'big'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {row.size === 'big' ? 'Big' : 'Small'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isDualRed ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                            <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block shadow-sm" />
                          </>
                        ) : isDualGreen ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                            <span className="w-3.5 h-3.5 rounded-full bg-purple-500 inline-block shadow-sm" />
                          </>
                        ) : isGreen ? (
                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block shadow-sm" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Trend Chart & Analytics */}
      {activeTab === 'trend' && (
        <div className="space-y-6">
          {/* Statistics summary bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color Distribution Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                {t.distribution} ({language === 'hi' ? 'पिछले 30 राउंड' : 'Last 30 Rounds'})
              </h4>

              <div className="space-y-2.5 text-xs">
                {/* Green */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      Green ({greenCount})
                    </span>
                    <span className="text-slate-300 font-mono">{greenPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${greenPct}%` }} />
                  </div>
                </div>

                {/* Red */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      Red ({redCount})
                    </span>
                    <span className="text-slate-300 font-mono">{redPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${redPct}%` }} />
                  </div>
                </div>

                {/* Violet */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                      Violet ({violetCount})
                    </span>
                    <span className="text-slate-300 font-mono">{violetPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${violetPct}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Big vs Small Ratio Card */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                  {language === 'hi' ? 'बड़ा / छोटा अनुपात' : 'Big vs Small Ratio'}
                </h4>

                <div className="flex justify-between text-xs mb-2">
                  <span className="text-amber-400 font-semibold">Big ({bigCount}) - {bigPct}%</span>
                  <span className="text-cyan-400 font-semibold">Small ({smallCount}) - {smallPct}%</span>
                </div>

                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${bigPct}%` }} />
                  <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${smallPct}%` }} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                💡 <span className="text-slate-300 font-medium">Pro Tip:</span> Observe alternating patterns (Green-Red cycles) and number clumps to time your predictions!
              </div>
            </div>
          </div>

          {/* Number Trend Grid Chart (Interactive connect pattern) */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 overflow-x-auto">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{language === 'hi' ? 'नंबर ट्रेंड मैट्रिक्स (0 - 9)' : 'Number Trend Matrix (0 - 9)'}</span>
              <span className="text-[11px] text-slate-400 font-normal">Latest rounds at top</span>
            </h4>

            <table className="w-full text-center text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                  <th className="py-2 text-left px-2">{t.period}</th>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <th key={n} className="py-2 px-1 w-8 font-mono">
                      {n}
                    </th>
                  ))}
                  <th className="py-2 px-2">{t.drawSize}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {history.slice(0, 15).map((row) => {
                  const isDualRed = row.number === 0;
                  const isDualGreen = row.number === 5;
                  const isGreen = row.colors.includes('green') && !isDualGreen;

                  return (
                    <tr key={row.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-2 text-left text-slate-400 text-[11px]">
                        {row.period.slice(-4)}
                      </td>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                        const isHit = row.number === n;
                        return (
                          <td key={n} className="py-1 px-1">
                            {isHit ? (
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black text-white shadow-md ${
                                isDualRed
                                  ? 'bg-gradient-to-r from-rose-600 to-purple-600'
                                  : isDualGreen
                                  ? 'bg-gradient-to-r from-emerald-600 to-purple-600'
                                  : isGreen
                                  ? 'bg-emerald-600'
                                  : 'bg-rose-600'
                              }`}>
                                {n}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs">•</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-2 px-2">
                        <span className={`text-[10px] font-bold uppercase ${
                          row.size === 'big' ? 'text-amber-400' : 'text-cyan-400'
                        }`}>
                          {row.size === 'big' ? 'B' : 'S'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: My Bets */}
      {activeTab === 'myBets' && (
        <div className="space-y-4">
          {/* Status Filter buttons */}
          <div className="flex gap-2 text-xs">
            {(['all', 'won', 'lost', 'pending'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setBetFilter(filter)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                  betFilter === filter
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {filter === 'all'
                  ? (language === 'hi' ? 'सभी' : 'All')
                  : filter === 'won'
                  ? (language === 'hi' ? 'जीत (Won)' : 'Won')
                  : filter === 'lost'
                  ? (language === 'hi' ? 'हार (Lost)' : 'Lost')
                  : (language === 'hi' ? 'लंबित (Pending)' : 'Pending')}
              </button>
            ))}
          </div>

          {filteredBets.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              {language === 'hi'
                ? 'अभी तक कोई दांव नहीं मिला। खेलना शुरू करने के लिए ऊपर दिए गए रंग या नंबर पर टैप करें!'
                : 'No bets found for this filter. Tap any color or number above to place a prediction!'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBets.map((bet) => {
                let targetLabel = '';
                let targetBg = 'bg-slate-800 text-white';

                if (bet.targetType === 'color') {
                  targetLabel = bet.selectedColor ? bet.selectedColor.toUpperCase() : '';
                  if (bet.selectedColor === 'green') targetBg = 'bg-emerald-600 text-white';
                  if (bet.selectedColor === 'red') targetBg = 'bg-rose-600 text-white';
                  if (bet.selectedColor === 'violet') targetBg = 'bg-purple-600 text-white';
                } else if (bet.targetType === 'number') {
                  targetLabel = `No. ${bet.selectedNumber}`;
                  targetBg = 'bg-indigo-600 text-white';
                } else {
                  targetLabel = bet.selectedSize === 'big' ? 'BIG' : 'SMALL';
                  targetBg = bet.selectedSize === 'big' ? 'bg-amber-600 text-white' : 'bg-cyan-600 text-white';
                }

                return (
                  <div
                    key={bet.id}
                    className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left: Period & Target */}
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase shadow-sm ${targetBg}`}>
                        {targetLabel}
                      </span>
                      <div>
                        <div className="text-xs font-mono font-semibold text-slate-200">
                          {t.period}: {bet.period}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(bet.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    {/* Right: Bet amount and Outcome */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-700/40">
                      <div className="text-left sm:text-right">
                        <div className="text-xs text-slate-400 font-mono">
                          {formatCurrency(bet.totalBet)}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          (₹{bet.amount} × {bet.multiplier})
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="text-right">
                        {bet.status === 'pending' && (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {t.pending}
                          </span>
                        )}
                        {bet.status === 'won' && (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                            +{formatCurrency(bet.winAmount || 0)}
                          </span>
                        )}
                        {bet.status === 'lost' && (
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                            -{formatCurrency(bet.totalBet)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: How to Play Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span>{t.howToPlayTitle}</span>
            </h4>
            <p className="text-slate-400 text-xs">
              {language === 'hi'
                ? 'कलर प्रेडिक्शन गेम एक बेहद लोकप्रिय और रोमांचक खेल है जिसमें खिलाड़ी रंगों (Green, Red, Violet), नंबरों (0 से 9) या Big/Small का सही अनुमान लगाकर इनाम जीतते हैं।'
                : 'The Color Prediction game is an exciting parity game where players predict colors (Green, Red, Violet), numbers (0 to 9), or Big/Small outcomes to earn payouts.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Green Card */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>Green (हरा)</span>
                  <span className="ml-auto text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">2x / 1.5x</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rule1}
                </p>
              </div>

              {/* Red Card */}
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 font-bold text-rose-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>Red (लाल)</span>
                  <span className="ml-auto text-xs bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">2x / 1.5x</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rule2}
                </p>
              </div>

              {/* Violet Card */}
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 font-bold text-purple-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Violet (बैंगनी)</span>
                  <span className="ml-auto text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">4.5x Payout</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rule3}
                </p>
              </div>

              {/* Number Card */}
              <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 font-bold text-indigo-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span>Exact Number (0 - 9)</span>
                  <span className="ml-auto text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">9.0x Bumper</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rule4}
                </p>
              </div>

              {/* Big / Small Card */}
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3 md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span>Big / Small (बड़ा / छोटा)</span>
                  <span className="ml-auto text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">2.0x</span>
                </div>
                <p className="text-xs text-slate-300">
                  {t.rule5}
                </p>
              </div>
            </div>

            {/* Lock rule */}
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400 flex items-start gap-2">
              <span className="text-amber-400 text-base">⚠️</span>
              <span>{t.ruleLock}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
