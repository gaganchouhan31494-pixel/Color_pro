import React, { useState } from 'react';
import { Users2, Copy, Share2, Sparkles, Gift, CheckCircle2 } from 'lucide-react';
import { Language, ThemeConfig } from '../types';
import { ASSETS_3D } from '../utils/assets3d';
import { sound } from '../utils/sound';

interface ReferPageProps {
  language: Language;
  theme: ThemeConfig;
}

export const ReferPage: React.FC<ReferPageProps> = ({ language, theme }) => {
  const isHi = language === 'hi';
  const isLight = theme.mode === 'light';
  const [copied, setCopied] = useState(false);

  const referLink = 'https://vip998.club/register?r=VIP998_ROYAL';

  const handleCopy = () => {
    navigator.clipboard?.writeText(referLink);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="refer-earn-page" className="space-y-4 animate-fadeIn">
      {/* 3D Referral Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-500 border border-amber-400/30 text-xs font-black">
            <Gift className="w-3.5 h-3.5" />
            <span>{isHi ? '3-लेवल वीआईपी कमीशन' : '3-Tier VIP Agency Program'}</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {isHi ? 'मित्रों को रेफर करें व लाइफटाइम कमाएं' : 'Refer Friends & Earn Passive Income'}
          </h2>
          <p className="text-xs text-zinc-400 max-w-md">
            {isHi
              ? 'प्रत्येक इनवाइट पर ₹150 तत्काल बोनस और टीम के हर दांव पर 30% तक आजीवन कमीशन प्राप्त करें।'
              : 'Earn instant ₹150 bonus per friend invite plus up to 30% lifetime trade rebate commission.'}
          </p>
        </div>

        <img
          src={ASSETS_3D.referral3D}
          alt="3D Referral Bonus"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/50 shadow-xl shrink-0"
        />
      </div>

      {/* Referral Link Copy Card */}
      <div
        className={`p-5 rounded-3xl border space-y-3 ${
          isLight ? 'bg-white border-slate-300' : 'bg-zinc-950/90 border-white/15'
        }`}
      >
        <div className="font-bold text-xs text-zinc-400">
          {isHi ? 'आपका अनूठा इनविटेशन लिंक:' : 'Your Exclusive Invitation Link:'}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={referLink}
            className="flex-1 px-3.5 py-3 rounded-2xl bg-zinc-900 border border-white/10 text-white font-mono text-xs font-bold focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-3 rounded-2xl bg-amber-400 text-zinc-950 font-black text-xs shadow active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Tier 1 Friends</span>
          <div className="text-xl font-black font-mono text-amber-400">30% REBATE</div>
          <p className="text-[11px] text-zinc-500">Directly invited players</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Tier 2 Friends</span>
          <div className="text-xl font-black font-mono text-emerald-400">20% REBATE</div>
          <p className="text-[11px] text-zinc-500">Invited by your friends</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Tier 3 Friends</span>
          <div className="text-xl font-black font-mono text-cyan-400">10% REBATE</div>
          <p className="text-[11px] text-zinc-500">Network team depth</p>
        </div>
      </div>
    </div>
  );
};
