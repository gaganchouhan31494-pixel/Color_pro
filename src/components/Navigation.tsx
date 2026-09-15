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
} from 'lucide-react';
import { AppPage, Language } from '../types';
import { translations } from '../utils/translations';

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
      {/* Top Category Horizontal Scroll Bar (Responsive: Smooth scroll on Mobile, Centered on Desktop) */}
      <nav
        id="main-category-navigation"
        className="w-full max-w-4xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-lg p-1 sm:p-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'auth' && activePage === 'auth');
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectPage(item.id)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md shadow-emerald-950 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[8px] sm:text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full ${
                  item.badge === '+10%'
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : item.badge === 'Hot'
                    ? 'bg-rose-500 text-white'
                    : 'bg-indigo-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Dock (Fixed 5-Key Native Touch Navigation) */}
      <nav
        id="mobile-bottom-navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* 1. Game */}
          <button
            id="mobile-nav-game"
            onClick={() => onSelectPage('game')}
            className={`flex flex-col items-center justify-center flex-1 py-1 min-w-[56px] transition-all active:scale-95 ${
              activePage === 'game' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className={`w-5 h-5 ${activePage === 'game' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              {t.navGame}
            </span>
          </button>

          {/* 2. Withdraw */}
          <button
            id="mobile-nav-withdraw"
            onClick={() => onSelectPage('withdraw')}
            className={`flex flex-col items-center justify-center flex-1 py-1 min-w-[56px] transition-all active:scale-95 ${
              activePage === 'withdraw' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownCircle className={`w-5 h-5 ${activePage === 'withdraw' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              {t.navWithdraw}
            </span>
          </button>

          {/* 3. CENTER RAISED 3D DEPOSIT ACTION BUTTON */}
          <div className="flex-1 flex justify-center -mt-5">
            <button
              id="mobile-nav-deposit-center"
              onClick={() => onSelectPage('deposit')}
              className="relative flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 text-slate-950 p-0.5 shadow-xl shadow-emerald-500/40 border-2 border-slate-900 active:scale-90 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-b from-emerald-400 to-teal-600 flex flex-col items-center justify-center text-slate-950">
                <Wallet className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                <span className="text-[8px] font-black uppercase tracking-wider text-slate-950 leading-tight">
                  +10%
                </span>
              </div>
            </button>
          </div>

          {/* 4. Refer & Earn */}
          <button
            id="mobile-nav-refer"
            onClick={() => onSelectPage('refer')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 min-w-[56px] transition-all active:scale-95 ${
              activePage === 'refer' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Users2 className={`w-5 h-5 ${activePage === 'refer' ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="absolute -top-1 -right-2 text-[7px] font-black bg-rose-500 text-white px-1 rounded-full">
                HOT
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              {t.navRefer}
            </span>
          </button>

          {/* 5. Profile / Account */}
          <button
            id="mobile-nav-profile"
            onClick={() => onSelectPage(isLoggedIn ? 'profile' : 'auth')}
            className={`flex flex-col items-center justify-center flex-1 py-1 min-w-[56px] transition-all active:scale-95 ${
              activePage === 'profile' || activePage === 'auth' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isLoggedIn ? (
              <User className={`w-5 h-5 ${activePage === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            ) : (
              <LogIn className={`w-5 h-5 ${activePage === 'auth' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            )}
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">
              {isLoggedIn ? t.navProfile : t.navLogin}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
