import React from 'react';
import { ShieldCheck, Check, Sparkles, Zap, ArrowRight, Award } from 'lucide-react';
import { PACKAGES } from '../data/mlmData';
import { Package, Member } from '../types';
import { formatCurrency } from '../utils/mlmEngine';

interface PackagesViewProps {
  currentMember: Member;
  onUpgradePackage: (pkg: Package) => void;
  lang: 'en' | 'hi';
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  currentMember,
  onUpgradePackage,
  lang,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'जॉइनिंग और एक्टिवेशन पैकेज' : 'Product Activation Packages'}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">
          {lang === 'hi' ? 'अपनी क्षमता अनुसार पैकेज चुनें' : 'Choose Your Growth Tier'}
        </h1>
        <p className="text-xs text-slate-400">
          {lang === 'hi'
            ? 'हर पैकेज 100% बिजनेस वॉल्यूम (BV) प्रदान करता है। बड़ा पैकेज = अधिक दैनिक कैपिंग और अधिक लेवल इनकम।'
            : 'All packages yield 100% BV. Higher packages offer higher daily binary capping limits and generational levels.'}
        </p>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {PACKAGES.map((pkg) => {
          const isCurrent = currentMember.packageId === pkg.id;
          return (
            <div
              key={pkg.id}
              className={`p-5 rounded-2xl bg-slate-900 border flex flex-col justify-between transition-all duration-200 relative ${
                isCurrent
                  ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/40'
                  : pkg.isPopular
                  ? 'border-cyan-500/60 shadow-lg'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {pkg.isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  MOST POPULAR
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                  CURRENT ACTIVE
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-white">
                    {lang === 'hi' ? pkg.nameHi : pkg.name}
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {pkg.pv} BV
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-2xl font-black text-white font-mono">
                    {formatCurrency(pkg.price)}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {lang === 'hi' ? 'एकमुश्त एक्टिवेशन' : 'One-time Activation'}
                  </span>
                </div>

                {/* Highlights */}
                <div className="space-y-2 py-3 border-y border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {lang === 'hi' ? 'दैनिक कैपिंग:' : 'Daily Capping:'}
                    </span>
                    <span className="font-bold text-amber-400 font-mono">
                      {formatCurrency(pkg.dailyCapping)}/d
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर:' : 'Direct Bonus:'}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {pkg.directBonusPercent}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {lang === 'hi' ? 'बाइनरी पेयर मैचिंग:' : 'Pair Matching:'}
                    </span>
                    <span className="font-bold text-blue-400">
                      {pkg.pairMatchingPercent}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {lang === 'hi' ? 'दैनिक कैशबैक:' : 'Daily Cashback:'}
                    </span>
                    <span className="font-bold text-cyan-300">
                      {pkg.roiDailyPercent}% x {pkg.roiDays}d
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="mt-4 space-y-2 text-[11px] text-slate-300">
                  {(lang === 'hi' ? pkg.featuresHi : pkg.features).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                {isCurrent ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'आपका सक्रिय पैकेज' : 'Active Package'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onUpgradePackage(pkg)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 hover:border-emerald-500 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>
                      {pkg.price > currentMember.packageAmount
                        ? lang === 'hi'
                          ? 'अपग्रेड करें'
                          : 'Upgrade Package'
                        : lang === 'hi'
                        ? 'स्विच करें'
                        : 'Switch Package'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
