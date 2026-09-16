import React from 'react';
import {
  X,
  User,
  Gamepad2,
  Wallet,
  ArrowDownCircle,
  Receipt,
  Users2,
  Headphones,
  HelpCircle,
  Volume2,
  VolumeX,
  Languages,
  Sun,
  Moon,
  Palette,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AppPage, Language, ThemeMode, UserAccount, UserWallet } from '../types';
import { formatCurrency } from '../utils/gameLogic';
import { sound } from '../utils/sound';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  user: UserAccount;
  wallet: UserWallet;
  language: Language;
  soundEnabled: boolean;
  themeMode: ThemeMode;
  onToggleThemeMode: () => void;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenRules: () => void;
  onOpenThemeModal: () => void;
  onResetWallet: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  onSelectPage,
  user,
  wallet,
  language,
  soundEnabled,
  themeMode,
  onToggleThemeMode,
  onToggleSound,
  onToggleLanguage,
  onOpenRules,
  onOpenThemeModal,
  onResetWallet,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const isLight = themeMode === 'light';

  const handleNav = (page: AppPage) => {
    sound.playClick();
    onSelectPage(page);
    onClose();
  };

  return (
    <div
      id="mobile-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="mobile-drawer-box"
        className={`w-4/5 max-w-xs h-full border-l p-5 flex flex-col justify-between shadow-2xl transition-all overflow-y-auto animate-slideLeft ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-zinc-950 border-white/15 text-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-5">
          {/* Top Profile & Close Button */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <div>
                <div className="font-black text-sm">{user.username}</div>
                <span className="text-[9px] bg-amber-400 text-zinc-950 font-black px-2 py-0.5 rounded-full font-mono">
                  VIP LEVEL {user.vipLevel}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wallet Balance Card */}
          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isLight ? 'bg-amber-50/80 border-amber-300' : 'bg-zinc-900 border-white/10'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-zinc-400">
              {isHi ? 'उपलब्ध बैलेंस' : 'Current Balance'}
            </div>
            <div className="text-xl font-black font-mono text-amber-500">
              {formatCurrency(wallet.balance)}
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1 text-sm font-bold">
            <button
              onClick={() => handleNav('game')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'game'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span>{isHi ? 'कलर प्रेडिक्शन गेम' : 'Game'}</span>
            </button>

            <button
              onClick={() => handleNav('deposit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'deposit'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span>{isHi ? 'डिपॉजिट (+10% बोनस)' : 'Deposit (+10% Bonus)'}</span>
            </button>

            <button
              onClick={() => handleNav('withdraw')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'withdraw'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5" />
              <span>{isHi ? 'निकासी (Withdraw)' : 'Withdraw'}</span>
            </button>

            <button
              onClick={() => handleNav('transactions')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'transactions'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>{isHi ? 'लेन-देन इतिहास' : 'Transactions'}</span>
            </button>

            <button
              onClick={() => handleNav('refer')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'refer'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Users2 className="w-5 h-5" />
              <span>{isHi ? 'रेफर व कमाएं' : 'Refer & Earn'}</span>
            </button>

            <button
              onClick={() => handleNav('support')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activePage === 'support'
                  ? 'bg-amber-400 text-zinc-950 shadow font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Headphones className="w-5 h-5" />
              <span>{isHi ? '24/7 वीआईपी सपोर्ट' : 'VIP Support'}</span>
            </button>
          </nav>

          {/* Quick Actions & Settings */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              onClick={onToggleThemeMode}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-zinc-300"
            >
              <div className="flex items-center gap-2">
                {isLight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                <span>{isLight ? (isHi ? 'डार्क थीम मोड' : 'Dark Mode') : (isHi ? 'लाइट थीम मोड' : 'Light Mode')}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">TOGGLE</span>
            </button>

            <button
              onClick={() => {
                onOpenThemeModal();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-zinc-300"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>{isHi ? 'थीम कस्टमाइज़र' : 'Themes'}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">OPEN</span>
            </button>

            <button
              onClick={onToggleLanguage}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-zinc-300"
            >
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'Language: हिन्दी' : 'Language: English'}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">CHANGE</span>
            </button>

            <button
              onClick={onToggleSound}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-zinc-300"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                <span>{soundEnabled ? (isHi ? 'साउंड: चालू' : 'Sound: ON') : (isHi ? 'साउंड: म्यूट' : 'Sound: OFF')}</span>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenRules();
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 text-xs font-bold text-zinc-300"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'गेमिंग नियम' : 'Rules & Multipliers'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Demo Reload Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => {
              onResetWallet();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400 hover:bg-amber-400/25 text-xs font-mono font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isHi ? 'डेमो बैलेंस रीलोड (₹10,000)' : 'Reload Demo Balance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
