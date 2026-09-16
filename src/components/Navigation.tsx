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
} from 'lucide-react';
import { AppPage, Language } from '../types';
import { translations } from '../utils/translations';
import { sound } from '../utils/sound';

interface NavigationProps {
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  language: Language;
  isLoggedIn?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onSelectPage,
  language,
  isLoggedIn = true,
}) => {
  const t = translations[language];

  const handleNav = (page: AppPage) => {
    sound.playClick();
    onSelectPage(page);
  };

  const navItems: Array<{ id: AppPage; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'game', label: t.navGame, icon: Gamepad2 },
    { id: 'deposit', label: t.navDeposit, icon: Wallet, badge: '+10%' },
    { id: 'withdraw', label: t.navWithdraw, icon: ArrowDownCircle },
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
        className="w-full max-w-4xl mx-auto bg-zinc-950/90 border border-white/15 rounded-2xl shadow-xl p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none backdrop-blur-xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'auth' && activePage === 'auth');
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => handleNav(item.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-md shadow-white/20 border border-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
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

      {/* Floating Bottom Menu Dock (Elevated ABOVE the bottom edge with 3D animation buttons) */}
      <nav
        id="mobile-bottom-navigation"
        className="md:hidden fixed bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-md mx-auto z-40 bg-zinc-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl px-2 py-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] transition-all animate-slideUp"
      >
        <div className="flex items-center justify-between">
          {/* 1. Game Tab */}
          <button
            id="mobile-nav-game"
            onClick={() => handleNav('game')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'game' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Gamepad2 className={`w-5 h-5 ${activePage === 'game' ? 'stroke-[2.5] text-white scale-110' : 'stroke-2'}`} />
              {activePage === 'game' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-tight mt-1 ${activePage === 'game' ? 'text-white font-black' : 'text-zinc-400'}`}>
              {t.navGame}
            </span>
          </button>

          {/* 2. Withdraw Tab */}
          <button
            id="mobile-nav-withdraw"
            onClick={() => handleNav('withdraw')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'withdraw' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <ArrowDownCircle className={`w-5 h-5 ${activePage === 'withdraw' ? 'stroke-[2.5] text-white scale-110' : 'stroke-2'}`} />
              {activePage === 'withdraw' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-tight mt-1 ${activePage === 'withdraw' ? 'text-white font-black' : 'text-zinc-400'}`}>
              {t.navWithdraw}
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

          {/* 4. Refer & Earn Tab */}
          <button
            id="mobile-nav-refer"
            onClick={() => handleNav('refer')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'refer' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              <Users2 className={`w-5 h-5 ${activePage === 'refer' ? 'stroke-[2.5] text-white scale-110' : 'stroke-2'}`} />
              <span className="absolute -top-1 -right-2 text-[7px] font-black bg-rose-500 text-white px-1 rounded-full animate-pulse">
                HOT
              </span>
              {activePage === 'refer' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-tight mt-1 ${activePage === 'refer' ? 'text-white font-black' : 'text-zinc-400'}`}>
              {t.navRefer}
            </span>
          </button>

          {/* 5. Profile Tab */}
          <button
            id="mobile-nav-profile"
            onClick={() => handleNav(isLoggedIn ? 'profile' : 'auth')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-150 active:scale-90 ${
              activePage === 'profile' || activePage === 'auth' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <div className="relative">
              {isLoggedIn ? (
                <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5] text-white scale-110' : 'stroke-2'}`} />
              ) : (
                <LogIn className={`w-5 h-5 ${activePage === 'auth' ? 'stroke-[2.5] text-white scale-110' : 'stroke-2'}`} />
              )}
              {(activePage === 'profile' || activePage === 'auth') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-tight mt-1 ${activePage === 'profile' || activePage === 'auth' ? 'text-white font-black' : 'text-zinc-400'}`}>
              {isLoggedIn ? t.navProfile : t.navLogin}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
