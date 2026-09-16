import React, { useState } from 'react';
import { GameResult, Language, ThemeConfig, UserBet } from '../types';
import { formatCurrency } from '../utils/gameLogic';

interface HistoryAndTrendsProps {
  results: GameResult[];
  userBets: UserBet[];
  language: Language;
  theme: ThemeConfig;
}

export const HistoryAndTrends: React.FC<HistoryAndTrendsProps> = ({
  results,
  userBets,
  language,
  theme,
}) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';
  const [activeTab, setActiveTab] = useState<'records' | 'myBets' | 'trends'>('records');

  return (
    <div
      id="history-trends-card"
      className={`rounded-3xl p-4 sm:p-5 border shadow-xl transition-all ${
        isLight
          ? 'bg-white border-slate-300'
          : 'bg-zinc-950/90 border-white/15'
      }`}
    >
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
        <button
          onClick={() => setActiveTab('records')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
            activeTab === 'records'
              ? isLight
                ? 'bg-slate-900 text-white'
                : 'bg-white text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isHi ? 'गेम रिकॉर्ड (Records)' : 'Game Record'}
        </button>

        <button
          onClick={() => setActiveTab('myBets')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 flex items-center gap-1 ${
            activeTab === 'myBets'
              ? isLight
                ? 'bg-slate-900 text-white'
                : 'bg-white text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span>{isHi ? 'मेरे दांव (My Bets)' : 'My Bets'}</span>
          {userBets.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-zinc-950 font-bold font-mono">
              {userBets.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
            activeTab === 'trends'
              ? isLight
                ? 'bg-slate-900 text-white'
                : 'bg-white text-zinc-950 shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isHi ? 'ट्रेंड एनालिसिस (Trends)' : 'Trend Chart'}
        </button>
      </div>

      {/* 1. Game Records Table */}
      {activeTab === 'records' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-zinc-500 uppercase text-[10px]">
                <th className="py-2 px-2">Period</th>
                <th className="py-2 px-2">Number</th>
                <th className="py-2 px-2">Big/Small</th>
                <th className="py-2 px-2 text-right">Color</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {results.slice(0, 10).map((r) => {
                const isDualGreen = r.colors.includes('green') && r.colors.includes('violet');
                const isDualRed = r.colors.includes('red') && r.colors.includes('violet');

                return (
                  <tr key={r.period} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-2 font-bold">{r.period}</td>
                    <td className="py-2.5 px-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-white bg-zinc-800 text-xs shadow-sm">
                        {r.number}
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          r.size === 'big'
                            ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                            : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        }`}
                      >
                        {r.size}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isDualGreen ? (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 via-purple-500 to-purple-600 shadow-sm" />
                        ) : isDualRed ? (
                          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 via-purple-500 to-purple-600 shadow-sm" />
                        ) : r.color === 'green' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 shadow-sm" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500 shadow-sm" />
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

      {/* 2. My Bets History */}
      {activeTab === 'myBets' && (
        <div className="space-y-2">
          {userBets.length === 0 ? (
            <div className="text-center py-8 text-zinc-400 text-xs font-medium">
              {isHi ? 'आपने अभी कोई दांव नहीं लगाया है।' : 'No bets placed yet.'}
            </div>
          ) : (
            userBets.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold font-mono uppercase text-white">
                      {b.targetType}: {b.targetValue}
                    </span>
                    <span className="text-[10px] text-amber-500 font-mono font-bold">
                      ({b.multiplier}x)
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Period: {b.period}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-black text-white">
                    {formatCurrency(b.totalAmount)}
                  </div>
                  <div className="mt-0.5">
                    {b.status === 'won' ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        +{formatCurrency(b.winAmount || 0)} WON
                      </span>
                    ) : b.status === 'lost' ? (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                        LOST
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Trend Statistics */}
      {activeTab === 'trends' && (
        <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3 text-xs">
          <div className="font-bold text-zinc-300">
            {isHi ? 'हाल के 25 राउंड्स का वितरण:' : 'Last 25 Rounds Frequency:'}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              <div>GREEN</div>
              <div className="text-base font-black mt-1">48%</div>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
              <div>VIOLET</div>
              <div className="text-base font-black mt-1">16%</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">
              <div>RED</div>
              <div className="text-base font-black mt-1">48%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
