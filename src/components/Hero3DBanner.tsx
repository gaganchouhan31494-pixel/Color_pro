import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Gift } from 'lucide-react';
import { Language } from '../types';
import { ASSETS_3D } from '../utils/assets3d';

interface Hero3DBannerProps {
  language: Language;
  onOpenDeposit: () => void;
  onOpenRules: () => void;
  onSelectGameTab: (tab: 'wingo' | 'reduction') => void;
}

export const Hero3DBanner: React.FC<Hero3DBannerProps> = ({
  language,
  onOpenDeposit,
  onOpenRules,
  onSelectGameTab,
}) => {
  const isHi = language === 'hi';

  return (
    <div
      id="hero-3d-gaming-banner"
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl p-4 sm:p-6"
    >
      {/* 3D Background Decorative Image with overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
        <img
          src={ASSETS_3D.heroBanner}
          alt="3D Casino"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Floating 3D Accent Light Glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Left Column: Headlines & Call to Action */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-amber-500/40 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {isHi ? '3D लाइव गेमिंग अरेना • 9x तक रिटर्न' : '3D Live Gaming Arena • Up to 9x Returns'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            {isHi ? (
              <>
                कलर प्रेडिक्ट करें और जीतें{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  रियल कैश रिवार्ड्स
                </span>
              </>
            ) : (
              <>
                Predict The Next Color & Win{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  Instant VIP Rewards
                </span>
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            {isHi
              ? 'अल्ट्रा-फास्ट 30s राउंड्स, 3D लकी स्फीयर, क्रिप्टोग्राफिक निष्पक्षता (SHA-256) और 24/7 तुरंत विड्रॉल।'
              : 'Ultra-fast 30s rounds, 3D interactive lucky sphere, SHA-256 verifiable fairness, and instant 0-fee withdrawals.'}
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            <button
              id="hero-btn-deposit-bonus"
              onClick={onOpenDeposit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/60 active:scale-95 transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>{isHi ? '+10% बोनस के साथ डिपॉजिट' : 'Deposit with +10% Bonus'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="hero-btn-rules"
              onClick={onOpenRules}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'गेम के नियम' : 'Game Rules'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Feature Cards Showcase */}
        <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto flex-shrink-0">
          {/* 3D Card 1: Win Go 30s */}
          <div
            onClick={() => onSelectGameTab('wingo')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 hover:border-emerald-500/60 transition-all active:scale-95 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 bg-emerald-950/40 p-1 flex-shrink-0 shadow-md">
                <img
                  src={ASSETS_3D.luckySphere}
                  alt="3D Orb"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span className="text-[10px] font-bold uppercase text-emerald-400">Win Go 30s</span>
                </div>
                <div className="text-xs font-black text-white">
                  {isHi ? 'सुपर फास्ट' : 'Super Fast'}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              {isHi ? 'हरा • बैंगनी • लाल • 0-9' : 'Green • Violet • Red • 0-9'}
            </div>
          </div>

          {/* 3D Card 2: Color Reduction */}
          <div
            onClick={() => onSelectGameTab('reduction')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 hover:border-purple-500/60 transition-all active:scale-95 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/40 bg-purple-950/40 p-1 flex-shrink-0 shadow-md">
                <img
                  src={ASSETS_3D.colorReduction3D}
                  alt="3D Reduction"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-[10px] font-bold uppercase text-purple-400">
                    {isHi ? 'कलर रिडक्शन' : 'Reduction'}
                  </span>
                </div>
                <div className="text-xs font-black text-white">
                  {isHi ? 'RGB सर्वाइवर' : 'RGB Arena'}
                </div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              {isHi ? '3 राउंड्स • 5.5x मल्टीप्लायर' : '3 Rounds • 5.5x Multiplier'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
