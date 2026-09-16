import React from 'react';
import {
  X,
  Gamepad2,
  Wallet,
  ArrowDownCircle,
  Users2,
  CheckCircle2,
  Headphones,
  Info,
  User,
  LogIn,
  Languages,
  Volume2,
  VolumeX,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Palette,
} from 'lucide-react';
import { AppPage, Language, UserAccount, UserWallet } from '../types';
import { translations } from '../utils/translations';
import { formatCurrency } from '../utils/gameLogic';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: AppPage;
  onSelectPage: (page: AppPage) => void;
  user: UserAccount;
  wallet: UserWallet;
  language: Language;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenRules: () => void;
  onResetWallet: () => void;
  onOpenThemeModal?: () => void;
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
  onToggleSound,
  onToggleLanguage,
  onOpenRules,
  onResetWallet,
  onOpenThemeModal,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const handleItemClick = (page: AppPage) => {
    onSelectPage(page);
    onClose();
  };

  const navLinks: Array<{ id: AppPage; label: string; icon: React.ElementType; badge?: string }> = [
    { id: 'game', label: t.navGame, icon: Gamepad2 },
    { id: 'deposit', label: t.navDeposit, icon: Wallet, badge: '+10% Bonus' },
    { id: 'withdraw', label: t.navWithdraw, icon: ArrowDownCircle, badge: 'Instant' },
    { id: 'refer', label: t.navRefer, icon: Users2, badge: 'Hot' },
    { id: 'proof', label: t.navProof, icon: CheckCircle2, badge: 'Live' },
    { id: 'support', label: t.navSupport, icon: Headphones, badge: '24/7' },
    { id: 'about', label: t.navAbout, icon: Info },
    { id: user.isLoggedIn ? 'profile' : 'auth', label: user.isLoggedIn ? t.navProfile : t.navLogin, icon: user.isLoggedIn ? User : LogIn },
  ];

  return (
    <div
      id="mobile-nav-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="mobile-nav-drawer-content"
        className="w-full max-w-xs h-full bg-zinc-950 border-l border-white/15 shadow-2xl flex flex-col overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black text-xs shadow-md font-mono">
              PRO
            </div>
            <div>
              <div className="text-sm font-black text-white">{t.appTitle}</div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">VIP Gaming Face</div>
            </div>
          </div>
          <button
            id="btn-close-mobile-drawer"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white active:scale-90 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Card */}
        <div className="p-4 bg-zinc-900/80 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-11 h-11 rounded-2xl border-2 border-white/30 object-cover shadow"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">{user.username}</span>
                <span className="text-[9px] font-black bg-white/15 text-white border border-white/20 px-1 rounded">
                  VIP {user.vipLevel}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">UID: {user.id}</div>
              <div className="text-sm font-mono font-black text-amber-400 mt-0.5">
                {formatCurrency(wallet.balance)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-3 px-3 space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-500 px-3 py-1">
            {language === 'hi' ? 'नेविगेशन मेनू' : 'Navigation Menu'}
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                id={`drawer-link-${link.id}`}
                onClick={() => handleItemClick(link.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-md border border-white'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Settings & Tools Footer */}
        <div className="p-4 border-t border-white/10 bg-zinc-900/60 space-y-2">
          {/* Quick theme selector button */}
          {onOpenThemeModal && (
            <button
              id="drawer-btn-theme"
              onClick={() => {
                onOpenThemeModal();
                onClose();
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-xs font-bold text-white transition-all shadow-sm active:scale-95"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-white" />
                <span className="text-white font-bold">
                  {language === 'hi' ? 'कलर थीम बदलें' : 'Change Color Theme'}
                </span>
              </div>
              <span className="text-[10px] bg-white/10 text-zinc-200 px-2 py-0.5 rounded-full font-mono font-bold">
                Themes
              </span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            {/* Language switch */}
            <button
              id="drawer-btn-language"
              onClick={onToggleLanguage}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold text-white active:scale-95 transition-all"
            >
              <Languages className="w-4 h-4 text-zinc-400" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Sound toggle */}
            <button
              id="drawer-btn-sound"
              onClick={onToggleSound}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-2xl bg-zinc-900 border border-white/10 text-xs font-bold text-white active:scale-95 transition-all"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-rose-400" />
                  <span>Sound OFF</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Rules */}
            <button
              id="drawer-btn-rules"
              onClick={() => {
                onOpenRules();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-2xl bg-zinc-900 border border-white/10 text-[11px] font-bold text-zinc-300 hover:text-white active:scale-95 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabRules}</span>
            </button>

            {/* Reset demo balance */}
            <button
              id="drawer-btn-reset"
              onClick={() => {
                onResetWallet();
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-2xl bg-zinc-900 border border-white/10 text-[11px] font-bold text-zinc-300 hover:text-amber-400 active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ₹10k</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
