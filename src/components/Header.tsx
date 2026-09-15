import React from 'react';
import { Volume2, VolumeX, HelpCircle, PlusCircle, RefreshCw, Languages, Coins } from 'lucide-react';
import { Language, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';

interface HeaderProps {
  wallet: UserWallet;
  language: Language;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenRecharge: () => void;
  onOpenRules: () => void;
  onResetBalance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  language,
  soundEnabled,
  onToggleSound,
  onToggleLanguage,
  onOpenRecharge,
  onOpenRules,
  onResetBalance,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-purple-500 to-rose-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400 text-lg">
                CP
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base md:text-lg tracking-tight text-white leading-tight">
                {t.appTitle}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-none">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right actions: Wallet & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Balance Chip */}
          <div id="wallet-balance-chip" className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-full pl-2.5 pr-1.5 py-1 shadow-inner">
            <Coins className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span id="wallet-balance-text" className="text-xs font-semibold text-amber-300 font-mono">
              {formatCurrency(wallet.balance)}
            </span>
            <button
              id="btn-open-recharge"
              onClick={onOpenRecharge}
              title={t.recharge}
              aria-label={t.recharge}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full p-1 transition-all active:scale-95 shadow"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            aria-label={soundEnabled ? t.soundOff : t.soundOn}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 text-emerald-400 border-emerald-500/30 hover:bg-slate-700'
                : 'bg-slate-800/60 text-slate-500 border-slate-700 hover:bg-slate-800'
            }`}
            title={soundEnabled ? t.soundOff : t.soundOn}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Toggle */}
          <button
            id="btn-toggle-language"
            onClick={onToggleLanguage}
            aria-label="Toggle Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
          </button>

          {/* How to play / Rules button */}
          <button
            id="btn-open-rules"
            onClick={onOpenRules}
            aria-label={t.tabRules}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
            title={t.tabRules}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
