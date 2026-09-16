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
  Palette,
  Sparkles,
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
  onOpenThemeModal?: () => void;
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
  onOpenThemeModal,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-b border-white/15 shadow-2xl">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          onClick={() => onSelectPage('game')}
          className="flex items-center gap-2.5 text-left focus:outline-none flex-shrink-0 group"
        >
          {/* Sleek Monochrome Luxury Monogram */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-white via-zinc-200 to-zinc-400 p-0.5 shadow-[0_4px_12px_rgba(255,255,255,0.15)] flex-shrink-0 transition-transform group-active:scale-95">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <span className="font-black text-white text-xs sm:text-sm tracking-wider font-mono">
                PRO
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-xs sm:text-base md:text-lg tracking-tight text-white leading-tight">
                {t.appTitle}
              </h1>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[8px] sm:text-[10px] font-black bg-white/10 text-white border border-white/20">
                VIP
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-none hidden sm:block font-medium mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </button>

        {/* Right actions: Wallet & Profile & Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wallet Balance 3D Chip */}
          <div
            id="wallet-balance-chip"
            className="flex items-center gap-1.5 bg-zinc-900 border border-white/20 rounded-full pl-2.5 pr-1.5 py-1 shadow-[0_4px_10px_rgba(0,0,0,0.5)] cursor-pointer hover:border-white/40 transition-all active:scale-95"
            onClick={onOpenRecharge}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span id="wallet-balance-text" className="text-xs sm:text-sm font-black text-amber-300 font-mono tracking-tight">
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
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-full p-1 transition-all active:scale-90 shadow-sm"
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
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 border border-white/15 px-2.5 py-1 rounded-full transition-all active:scale-95"
              >
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs font-bold text-white max-w-[75px] truncate">
                  {user.username}
                </span>
                <span className="text-[8px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1 rounded font-black font-mono">
                  V{user.vipLevel}
                </span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-zinc-950 text-xs font-black shadow hover:bg-zinc-200 active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
              </button>
            )}

            {/* Language Toggle (Desktop) */}
            <button
              id="btn-toggle-language"
              onClick={onToggleLanguage}
              aria-label="Toggle Language"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-white/15 hover:bg-zinc-800 text-zinc-200 text-xs font-bold transition-all active:scale-95"
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-zinc-300" />
              <span>{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* Sound Toggle (Desktop) */}
            <button
              id="btn-toggle-sound-header"
              onClick={onToggleSound}
              aria-label="Toggle Sound"
              className="p-1.5 rounded-xl bg-zinc-900 text-zinc-300 border border-white/15 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            {/* Rules button (Desktop) */}
            <button
              id="btn-open-rules"
              onClick={onOpenRules}
              aria-label={t.tabRules}
              className="p-1.5 rounded-xl bg-zinc-900 text-zinc-300 border border-white/15 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
              title={t.tabRules}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Palette Button (Visible on both Desktop & Mobile) */}
          {onOpenThemeModal && (
            <button
              id="btn-open-theme-modal"
              onClick={onOpenThemeModal}
              aria-label="Change Color Theme"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/20 text-white active:scale-90 transition-all flex items-center gap-1.5 shadow-md group"
              title={language === 'hi' ? 'कलर थीम बदलें' : 'Change Color Theme'}
            >
              <Palette className="w-4 h-4 text-white group-hover:rotate-45 transition-transform" />
              <span className="text-[11px] font-black hidden md:inline text-white">
                {language === 'hi' ? 'थीम' : 'Theme'}
              </span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle Button with Smooth 3D Press Animation */}
          {onOpenMobileDrawer && (
            <button
              id="btn-mobile-menu-drawer"
              onClick={onOpenMobileDrawer}
              aria-label="Open Navigation Menu"
              className="sm:hidden p-2 rounded-xl bg-zinc-900 text-white border border-white/20 hover:bg-zinc-850 active:scale-90 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center"
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
