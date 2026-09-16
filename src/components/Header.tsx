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
  Sun,
  Moon,
} from 'lucide-react';
import { AppPage, Language, UserAccount, UserWallet, ThemeMode } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';

interface HeaderProps {
  wallet: UserWallet;
  user: UserAccount;
  language: Language;
  soundEnabled: boolean;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
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
  themeMode,
  onToggleThemeMode,
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
  const isLight = themeMode === 'light';

  const formattedMobileBalance = `₹${Math.floor(wallet.balance).toLocaleString('en-IN')}`;

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-200 ${
        isLight
          ? 'bg-white/95 border-slate-300 shadow-md'
          : 'bg-zinc-950/95 border-white/15 shadow-2xl'
      }`}
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1 sm:gap-2">
        {/* Brand */}
        <button
          onClick={() => onSelectPage('game')}
          className="flex items-center gap-1.5 sm:gap-2.5 text-left focus:outline-none shrink min-w-0 group"
        >
          {/* Sleek 3D Monogram */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 p-0.5 shadow-md shrink-0 transition-transform group-active:scale-95">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isLight ? 'bg-white text-zinc-950' : 'bg-zinc-950 text-white'}`}>
              <span className="font-black text-[11px] sm:text-xs font-mono tracking-wider">
                PRO
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h1 className={`font-black text-xs sm:text-base md:text-lg tracking-tight truncate max-w-[95px] xs:max-w-[130px] sm:max-w-none leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {t.appTitle}
              </h1>
              <span className="hidden xs:inline-flex items-center px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-black bg-amber-400/20 text-amber-500 border border-amber-400/30">
                VIP
              </span>
            </div>
            <p className={`text-[9px] sm:text-[10px] leading-none hidden sm:block font-medium mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {t.appSubtitle}
            </p>
          </div>
        </button>

        {/* Right actions: Wallet & Profile & Light/Dark Theme & Fixed Menu */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Wallet Balance 3D Chip */}
          <div
            id="wallet-balance-chip"
            className={`flex items-center gap-1 sm:gap-1.5 rounded-full pl-2 sm:pl-2.5 pr-1 py-0.5 sm:py-1 cursor-pointer transition-all active:scale-95 border ${
              isLight
                ? 'bg-amber-50/90 border-amber-300 shadow-sm hover:border-amber-400'
                : 'bg-zinc-900 border-white/20 shadow-md hover:border-white/40'
            }`}
            onClick={onOpenRecharge}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span
              id="wallet-balance-text"
              className="text-xs sm:text-sm font-black text-amber-600 sm:text-amber-400 font-mono tracking-tight"
            >
              <span className="inline sm:hidden">{formattedMobileBalance}</span>
              <span className="hidden sm:inline">{formatCurrency(wallet.balance)}</span>
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
              <PlusCircle className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          {/* Desktop User Account / Login Pill */}
          <div className="hidden sm:flex items-center gap-1.5">
            {user.isLoggedIn ? (
              <button
                id="header-profile-btn"
                onClick={() => onSelectPage('profile')}
                className={`flex items-center gap-1.5 border px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-900'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-white/15 text-white'
                }`}
              >
                <img
                  src={user.avatar}
                  alt="User"
                  className="w-5 h-5 rounded-full object-cover border border-amber-400"
                />
                <span className="text-xs font-bold max-w-[75px] truncate">
                  {user.username}
                </span>
                <span className="text-[8px] bg-amber-400/20 text-amber-500 border border-amber-400/30 px-1 rounded font-black font-mono">
                  V{user.vipLevel}
                </span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenAuth}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black shadow active:scale-95 transition-all ${
                  isLight
                    ? 'bg-slate-900 hover:bg-slate-800 text-white'
                    : 'bg-white hover:bg-zinc-200 text-zinc-950'
                }`}
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
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/15 text-zinc-200'
              }`}
              title="Switch Language / भाषा बदलें"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
            </button>

            {/* Sound Toggle (Desktop) */}
            <button
              id="btn-toggle-sound-header"
              onClick={onToggleSound}
              aria-label="Toggle Sound"
              className={`p-1.5 rounded-xl border text-xs active:scale-90 transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/15'
              }`}
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            {/* Rules button (Desktop) */}
            <button
              id="btn-open-rules"
              onClick={onOpenRules}
              aria-label={t.tabRules}
              className={`p-1.5 rounded-xl border text-xs active:scale-90 transition-all ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/15 text-zinc-300'
              }`}
              title={t.tabRules}
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
            </button>
          </div>

          {/* LIGHT / DARK THEME TOGGLE BUTTON (1-click direct toggle) */}
          <button
            id="btn-toggle-theme-mode"
            onClick={onToggleThemeMode}
            aria-label={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            title={isLight ? (language === 'hi' ? 'डार्क थीम करें' : 'Switch to Dark Mode') : (language === 'hi' ? 'लाइट थीम करें' : 'Switch to Light Mode')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border active:scale-90 transition-all flex items-center gap-1.5 shadow-sm shrink-0 ${
              isLight
                ? 'bg-amber-100/90 hover:bg-amber-200 border-amber-300 text-amber-900'
                : 'bg-zinc-900 hover:bg-zinc-800 border-white/20 text-amber-300'
            }`}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
                <span className="text-[10px] font-black hidden md:inline text-indigo-900">
                  {language === 'hi' ? 'डार्क थीम' : 'Dark'}
                </span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span className="text-[10px] font-black hidden md:inline text-amber-300">
                  {language === 'hi' ? 'लाइट थीम' : 'Light'}
                </span>
              </>
            )}
          </button>

          {/* Theme Palette Modal Button */}
          {onOpenThemeModal && (
            <button
              id="btn-open-theme-modal"
              onClick={onOpenThemeModal}
              aria-label="Change Color Theme"
              className={`p-1.5 sm:px-2 sm:py-1.5 rounded-xl border active:scale-90 transition-all flex items-center gap-1 shadow-sm shrink-0 group ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-white/20 text-white'
              }`}
              title={language === 'hi' ? 'कलर थीम बदलें' : 'Change Color Theme'}
            >
              <Palette className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              <span className="text-[11px] font-black hidden md:inline">
                {language === 'hi' ? 'थीम' : 'Theme'}
              </span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle Button - 100% FIXED & GUARANTEED INSIDE VIEW */}
          {onOpenMobileDrawer && (
            <button
              id="btn-mobile-menu-drawer"
              onClick={onOpenMobileDrawer}
              aria-label="Open Navigation Menu"
              className={`sm:hidden p-2 rounded-xl border active:scale-90 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center shrink-0 ${
                isLight
                  ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                  : 'bg-white text-zinc-950 border-white hover:bg-zinc-200'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
