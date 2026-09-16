import React from 'react';
import { Volume2, Trophy, Flame } from 'lucide-react';
import { MOCK_TICKER_WINNERS } from '../utils/dummyData';
import { ThemeConfig } from '../types';

interface VIPTickerProps {
  theme: ThemeConfig;
}

export const VIPTicker: React.FC<VIPTickerProps> = ({ theme }) => {
  const isLight = theme.mode === 'light';

  return (
    <div
      id="vip-live-ticker"
      className={`rounded-2xl px-3 py-2 border flex items-center gap-2 overflow-hidden text-xs transition-all ${
        isLight
          ? 'bg-amber-50/90 border-amber-300 text-slate-800'
          : 'bg-zinc-950/80 border-white/10 text-zinc-300'
      }`}
    >
      <div className="flex items-center gap-1.5 shrink-0 font-bold text-amber-500 pr-2 border-r border-amber-400/30">
        <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
        <span className="font-black text-[11px] uppercase tracking-wider">LIVE WINS</span>
      </div>

      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div className="inline-flex items-center gap-6 animate-marquee font-mono text-[11px]">
          {MOCK_TICKER_WINNERS.concat(MOCK_TICKER_WINNERS).map((w, i) => (
            <div key={i} className="inline-flex items-center gap-1.5">
              <span className="text-zinc-400 font-sans">{w.user}</span>
              <span className="font-black text-emerald-400">{w.win}</span>
              <span className="text-[10px] text-zinc-500">({w.game})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
