import React from 'react';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  PlusCircle,
  Languages,
  Coins,
  User,
  LogIn,
  Menu,
} from 'lucide-react';
import { AppPage, Language, UserAccount, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';

interface HeaderProps {
  wallet: UserWallet;
  user: UserAccount;
  language: Language;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenRecharge: () => void;
  onOpenRules: () => void;
  onOpenAuth: () => void;
  onSelectPage: (page: AppPage) => void;
  onOpenMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  wallet,
  user,
  language,
  soundEnabled,
  onToggleSound,
  onToggleLanguage,
  onOpenRecharge,
  onOpenRules,
  onOpenAuth,
  onSelectPage,
  onOpenMobileDrawer,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/90 shadow-md">
      <div className="max-w-4xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          onClick={() => onSelectPage('game')}
          className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-purple-500 to-rose-500 p-0.5 shadow-lg shadow-emerald-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-violet-400 to-rose-400 text-sm sm:text-lg">
                CP
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-xs sm:text-base md:text-lg tracking-tight text-white leading-tight">
                {t.appTitle}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-none hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </button>

        {/* Right actions: Wallet & Profile & Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Wallet Balance Chip */}
          <div
            id="wallet-balance-chip"
            className="flex items-center gap-1 sm:gap-1.5 bg-slate-800/90 border border-slate-700/80 rounded-full pl-2 sm:pl-2.5 pr-1 sm:pr-1.5 py-1 shadow-inner cursor-pointer hover:border-emerald-500/40 transition-colors"
            onClick={onOpenRecharge}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span id="wallet-balance-text" className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
              {formatCurrency(wallet.balance)}
            </span>
            <button
              id="btn-open-recharge"
              onClick={(e) => {
                e.stopPropagation();
                onOpenRecharge();
              }}
              title={t.recharge}
              aria-label={t.recharge}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full p-0.5 sm:p-1 transition-all active:scale-95 shadow"
            >
              <PlusCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Desktop User Account / Login Pill */}
          <div className="hidden sm:flex items-center gap-1.5">
            {user.isLoggedIn ? (
              <button
                id="header-profile-btn"
                onClick={() => onSelectPage('profile')}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded-full transition-all"
              >
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs font-bold text-slate-200 max-w-[70px] truncate">
                  {user.username}
                </span>
                <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 rounded font-bold">
                  V{user.vipLevel}
                </span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow hover:from-emerald-500"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
              </button>
            )}

            {/* Language Toggle (Desktop) */}
            <button
              id="btn-toggle-language"
              onClick={onToggleLanguage}
              aria-label="Toggle Language"
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* Rules button (Desktop) */}
            <button
              id="btn-open-rules"
              onClick={onOpenRules}
              aria-label={t.tabRules}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors"
              title={t.tabRules}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle Button */}
          {onOpenMobileDrawer && (
            <button
              id="btn-mobile-menu-drawer"
              onClick={onOpenMobileDrawer}
              aria-label="Open Navigation Menu"
              className="sm:hidden p-1.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

