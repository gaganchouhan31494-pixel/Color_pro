import React, { useEffect, useState } from 'react';
import { Trophy, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

const FAKE_VIP_WINNERS = [
  { user: '98***21', win: 4500, target: 'Violet (4.5x)', color: 'text-purple-400' },
  { user: '87***04', win: 9000, target: 'Number 7 (9.0x)', color: 'text-amber-400' },
  { user: '70***15', win: 2000, target: 'Green (2.0x)', color: 'text-emerald-400' },
  { user: '91***88', win: 5500, target: 'Color Reduction Survivor', color: 'text-cyan-400' },
  { user: '82***34', win: 1800, target: 'Red (2.0x)', color: 'text-rose-400' },
  { user: '95***67', win: 9000, target: 'Number 0 (Dual Red+Violet)', color: 'text-purple-300' },
  { user: '74***90', win: 3600, target: 'Big (2.0x)', color: 'text-amber-300' },
];

interface VIPTickerProps {
  language: Language;
}

export const VIPTicker: React.FC<VIPTickerProps> = ({ language }) => {
  const t = translations[language];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % FAKE_VIP_WINNERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const current = FAKE_VIP_WINNERS[index];

  return (
    <div
      id="vip-live-payout-ticker"
      className="bg-slate-900/90 border border-slate-800/80 rounded-2xl px-3 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-inner overflow-hidden"
    >
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400">
          <Trophy className="w-3 h-3 stroke-[2.5]" />
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 whitespace-nowrap">
          {t.vipWinners}:
        </span>
      </div>

      {/* Ticker Item with smooth fade */}
      <div className="flex-1 flex items-center gap-2 text-xs truncate overflow-hidden">
        <span className="font-mono text-slate-300 font-medium">User {current.user}</span>
        <span className="text-slate-500">•</span>
        <span className="text-slate-400">Won</span>
        <span className="font-mono font-bold text-emerald-400">₹{current.win.toLocaleString('en-IN')}</span>
        <span className="text-slate-500">on</span>
        <span className={`font-semibold truncate ${current.color}`}>{current.target}</span>
      </div>

      <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0 font-medium">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Verified Fair</span>
      </div>
    </div>
  );
};
