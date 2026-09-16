import React from 'react';
import {
  Gamepad2,
  Wallet,
  ArrowDownCircle,
  Users2,
  CheckCircle2,
  Headphones,
  Info,
  User,
  LogIn,
  Sparkles,
  Menu,
  Receipt,
} from 'lucide-react';
import { AppPage, Language, ThemeMode } from '../types';
import { translations } from '../utils/translations';
import { sound } from '../utils/sound';

interface NavigationProps {
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  language: Language;
  isLoggedIn?: boolean;
  themeMode?: ThemeMode;
  onOpenMobileDrawer?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onSelectPage,
  language,
  isLoggedIn = true,
  themeMode = 'dark',
  onOpenMobileDrawer,
}) => {
  const t = translations[language];
  const isHi = language === 'hi';
  const isLight = themeMode === 'light';

  const handleNav = (page: AppPage) => {
    sound.playClick();
    onSelectPage(page);
  };

  const navItems: Array<{ id: AppPage; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'game', label: t.navGame, icon: Gamepad2 },
    { id: 'deposit', label: t.navDeposit, icon: Wallet, badge: '+10%' },
    { id: 'withdraw', label: t.navWithdraw, icon: ArrowDownCircle },
    { id: 'transactions', label: isHi ? 'लेन-देन' : 'Transactions', icon: Receipt, badge: 'New' },
    { id: 'refer', label: t.navRefer, icon: Users2, badge: 'Hot' },
    { id: 'proof', label: t.navProof, icon: CheckCircle2 },
    { id: 'support', label: t.navSupport, icon: Headphones, badge: '24/7' },
    { id: 'about', label: t.navAbout, icon: Info },
    { id: isLoggedIn ? 'profile' : 'auth', label: isLoggedIn ? t.navProfile : t.navLogin, icon: isLoggedIn ? User : LogIn },
  ];

  return (
    <>
      {/* Top Category Horizontal Navigation (Desktop & Mobile Scroll) with animated crisp styling */}
      <nav
        id="main-category-navigation"
        className={`w-full max-w-4xl mx-auto rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none backdrop-blur-xl border transition-colors ${
          isLight
            ? 'bg-white/95 border-slate-300 shadow-md'
            : 'bg-zinc-950/90 border-white/15 shadow-xl'
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'auth' && activePage === 'auth');
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleNav(item.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 whitespace-nowrap flex-shrink-0 active:scale-95 border ${
                isActive
                  ? isLight
                    ? 'bg-slate-900 text-white shadow-md border-slate-900'
                    : 'bg-white text-zinc-950 shadow-md shadow-white/20 border-white'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-transparent'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[8px] sm:text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded-full ${
                  item.badge === '+10%'
                    ? 'bg-amber-400 text-zinc-950 animate-pulse'
                    : item.badge === 'Hot'
                    ? 'bg-rose-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Floating Bottom Menu Dock (Elevated with 3D tactile buttons, 100% fixed) */}
      <nav
        id="mobile-bottom-navigation"
        className={`md:hidden fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 max-w-md mx-auto z-40 backdrop-blur-2xl rounded-3xl px-2 py-1.5 border transition-all animate-slideUp ${
          isLight
            ? 'bg-white/95 border-slate-300 shadow-[0_12px_35px_rgba(0,0,0,0.15)]'
            : 'bg-zinc-950/95 border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.9)]'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* 1. Game Tab */}
          <button
            id="mobile-nav-game"
            onClick={() => handleNav('game')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'game'
                ? isLight ? 'text-slate-950 font-black' : 'text-white font-black'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Gamepad2 className={`w-5 h-5 ${activePage === 'game' ? 'stroke-[2.5] scale-110' : 'stroke-2'}`} />
              {activePage === 'game' && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-950' : 'bg-white shadow-[0_0_8px_#ffffff]'}`} />
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1">
              {t.navGame}
            </span>
          </button>

          {/* 2. Transactions Tab */}
          <button
            id="mobile-nav-transactions"
            onClick={() => handleNav('transactions')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'transactions'
                ? isLight ? 'text-slate-950 font-black' : 'text-white font-black'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Receipt className={`w-5 h-5 ${activePage === 'transactions' ? 'stroke-[2.5] scale-110' : 'stroke-2'}`} />
              {activePage === 'transactions' && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-950' : 'bg-white shadow-[0_0_8px_#ffffff]'}`} />
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1">
              {isHi ? 'लेन-देन' : 'History'}
            </span>
          </button>

          {/* 3. CENTER 3D FLOATING DEPOSIT BUTTON WITH +10% BONUS */}
          <div className="flex-1 flex justify-center -mt-6">
            <button
              id="mobile-nav-deposit-center"
              onClick={() => handleNav('deposit')}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-white text-zinc-950 p-1 shadow-[0_8px_20px_rgba(251,191,36,0.5)] border-2 border-zinc-950 active:scale-90 transition-transform active:translate-y-1"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 flex flex-col items-center justify-center text-zinc-950 shadow-inner">
                <Wallet className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
                <span className="text-[8px] font-black uppercase tracking-wider text-zinc-950 leading-none mt-0.5">
                  +10%
                </span>
              </div>
            </button>
          </div>

          {/* 4. Withdraw Tab */}
          <button
            id="mobile-nav-withdraw"
            onClick={() => handleNav('withdraw')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'withdraw'
                ? isLight ? 'text-slate-950 font-black' : 'text-white font-black'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <ArrowDownCircle className={`w-5 h-5 ${activePage === 'withdraw' ? 'stroke-[2.5] scale-110' : 'stroke-2'}`} />
              {activePage === 'withdraw' && (
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-950' : 'bg-white shadow-[0_0_8px_#ffffff]'}`} />
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1">
              {t.navWithdraw}
            </span>
          </button>

          {/* 5. Mobile Fixed Menu Button (Opens full drawer with zero overflow) */}
          <button
            id="mobile-nav-menu"
            onClick={() => {
              sound.playClick();
              if (onOpenMobileDrawer) {
                onOpenMobileDrawer();
              } else {
                handleNav(isLoggedIn ? 'profile' : 'auth');
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              isLight ? 'text-slate-600 hover:text-slate-950' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold tracking-tight mt-1">
              {isHi ? 'मेन्यू' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
