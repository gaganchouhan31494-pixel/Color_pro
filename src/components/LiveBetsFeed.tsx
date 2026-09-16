import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, Users, TrendingUp, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { formatCurrency } from '../utils/gameLogic';

interface LiveBetsFeedProps {
  language: Language;
}

interface SimulatedBet {
  id: string;
  userName: string;
  avatar: string;
  target: string;
  colorType: 'green' | 'red' | 'violet' | 'amber' | 'cyan';
  amount: number;
  timeAgo: string;
  isVip?: boolean;
}

const INITIAL_SIMULATED_BETS: SimulatedBet[] = [
  {
    id: 'sb-1',
    userName: 'VIP_Rajesh99',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80',
    target: 'Green (2.0x)',
    colorType: 'green',
    amount: 5000,
    timeAgo: 'Just now',
    isVip: true,
  },
  {
    id: 'sb-2',
    userName: '98***4102',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80',
    target: '#2 Red (9.0x)',
    colorType: 'red',
    amount: 1500,
    timeAgo: '2s ago',
  },
  {
    id: 'sb-3',
    userName: 'Amit_Jaipur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
    target: 'Big (5-9)',
    colorType: 'amber',
    amount: 3000,
    timeAgo: '4s ago',
  },
  {
    id: 'sb-4',
    userName: 'VIP_CryptoRider',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
    target: 'Violet Bumper (4.5x)',
    colorType: 'violet',
    amount: 10000,
    timeAgo: '6s ago',
    isVip: true,
  },
  {
    id: 'sb-5',
    userName: '87***9182',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&auto=format&fit=crop&q=80',
    target: 'Red (2.0x)',
    colorType: 'red',
    amount: 800,
    timeAgo: '8s ago',
  },
  {
    id: 'sb-6',
    userName: 'Vikram_Patel',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&auto=format&fit=crop&q=80',
    target: 'Small (0-4)',
    colorType: 'cyan',
    amount: 2500,
    timeAgo: '11s ago',
  },
];

const RANDOM_NAMES = [
  'VIP_Sanjay', '91***281', 'Rahul_Bhopal', 'WinnerQueen_01', '78***992', 
  'Tiger_Bet77', 'Kunal_Delhi', 'VIP_Sharma', '96***334', 'ProGamer_X'
];

const RANDOM_TARGETS: Array<{ label: string; type: 'green' | 'red' | 'violet' | 'amber' | 'cyan' }> = [
  { label: 'Green (2.0x)', type: 'green' },
  { label: 'Red (2.0x)', type: 'red' },
  { label: 'Violet Bumper (4.5x)', type: 'violet' },
  { label: '#2 Red (9.0x)', type: 'red' },
  { label: '#7 Green (9.0x)', type: 'green' },
  { label: '#0 Red+Violet (9.0x)', type: 'violet' },
  { label: 'Big (5-9)', type: 'amber' },
  { label: 'Small (0-4)', type: 'cyan' },
];

const RANDOM_AMOUNTS = [200, 500, 1000, 2000, 3500, 5000, 10000, 25000];

export const LiveBetsFeed: React.FC<LiveBetsFeedProps> = ({ language }) => {
  const [bets, setBets] = useState<SimulatedBet[]>(INITIAL_SIMULATED_BETS);
  const [totalPool, setTotalPool] = useState(184200);
  const [activePlayers, setActivePlayers] = useState(1428);

  // Periodically inject fresh realistic bets
  useEffect(() => {
    const interval = setInterval(() => {
      const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      const randomTarget = RANDOM_TARGETS[Math.floor(Math.random() * RANDOM_TARGETS.length)];
      const randomAmount = RANDOM_AMOUNTS[Math.floor(Math.random() * RANDOM_AMOUNTS.length)];
      const isVip = randomName.startsWith('VIP_') || randomAmount >= 5000;

      const newBet: SimulatedBet = {
        id: 'sb-' + Date.now(),
        userName: randomName,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=60&auto=format&fit=crop&q=80`,
        target: randomTarget.label,
        colorType: randomTarget.type,
        amount: randomAmount,
        timeAgo: 'Just now',
        isVip,
      };

      setBets((prev) => [newBet, ...prev.slice(0, 7)]);
      setTotalPool((prev) => prev + randomAmount);
      setActivePlayers((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950/90 border border-white/15 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl mb-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <span>{language === 'hi' ? 'लाइव प्लेयर्स दांव (रियल-टाइम फीड)' : 'Live Player Bets Feed'}</span>
            <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-md text-zinc-300">
              LIVE
            </span>
          </h3>
        </div>

        {/* Live Pool & Active Players Badges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1 text-zinc-400">
            <Users className="w-3.5 h-3.5 text-zinc-300" />
            <span>{language === 'hi' ? 'खिलाड़ी' : 'Online'}:</span>
            <span className="text-white font-bold">{activePlayers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'hi' ? 'राउंड पूल' : 'Pool'}:</span>
            <span className="text-amber-400 font-bold">{formatCurrency(totalPool)}</span>
          </div>
        </div>
      </div>

      {/* Bets List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-none">
        {bets.map((bet) => {
          let badgeBg = 'bg-rose-500/15 text-rose-300 border-rose-500/30';
          if (bet.colorType === 'green') {
            badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
          } else if (bet.colorType === 'violet') {
            badgeBg = 'bg-purple-500/15 text-purple-300 border-purple-500/30';
          } else if (bet.colorType === 'amber') {
            badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
          } else if (bet.colorType === 'cyan') {
            badgeBg = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
          }

          return (
            <div
              key={bet.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/5 transition-all text-xs animate-fadeIn"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-7 h-7 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-[10px] text-white">
                    {bet.userName.slice(0, 2).toUpperCase()}
                  </div>
                  {bet.isVip && (
                    <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 fill-amber-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white tracking-tight">
                    <span>{bet.userName}</span>
                    {bet.isVip && (
                      <span className="text-[8px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded uppercase font-mono">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{bet.timeAgo}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase font-mono border ${badgeBg}`}>
                  {bet.target}
                </span>
                <span className="font-mono font-black text-white text-xs">
                  {formatCurrency(bet.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{language === 'hi' ? '100% वेरिफाइड ब्लॉकचेन RNG' : '100% Verified Blockchain Fair RNG'}</span>
        </span>
        <span className="font-mono text-zinc-500">{language === 'hi' ? 'रीयल-टाइम सिंक' : 'Realtime Sync'}</span>
      </div>
    </div>
  );
};
