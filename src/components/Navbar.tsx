import React, { useState, useRef, useEffect } from 'react';
import {
  GitMerge,
  LayoutDashboard,
  Layers,
  Calculator,
  PackageCheck,
  Wallet,
  Globe,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Users,
  Palette,
  Check,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Smartphone,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Member, ThemeColor } from '../types';
import { THEME_CONFIGS } from '../utils/themePresets';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  members: Member[];
  currentMemberId: string;
  onMemberChange: (memberId: string) => void;
  onOpenAddMember: () => void;
  theme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  lang: 'en' | 'hi';
  onToggleLang: () => void;
  isMobileDrawerOpen?: boolean;
  onToggleMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  members,
  currentMemberId,
  onMemberChange,
  onOpenAddMember,
  theme,
  onThemeChange,
  lang,
  onToggleLang,
  isMobileDrawerOpen: externalDrawerOpen,
  onToggleMobileDrawer,
}) => {
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isMemberPickerOpen, setIsMemberPickerOpen] = useState(false);

  // Sync drawer open state
  const isDrawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : internalDrawerOpen;
  const toggleDrawer = () => {
    if (onToggleMobileDrawer) {
      onToggleMobileDrawer();
    } else {
      setInternalDrawerOpen((prev) => !prev);
    }
  };
  const closeDrawer = () => {
    if (onToggleMobileDrawer && externalDrawerOpen) {
      onToggleMobileDrawer();
    } else {
      setInternalDrawerOpen(false);
    }
  };

  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const currentMember = members.find((m) => m.id === currentMemberId) || members[0];
  const activeThemeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.emerald;

  // Auto-scroll active tab into view on mobile
  useEffect(() => {
    if (tabsScrollRef.current) {
      const activeEl = tabsScrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentTab]);

  const navItems = [
    {
      id: 'DASHBOARD',
      label: lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      descHi: 'मुख्य सारांश व पेयर स्टेटस',
      descEn: 'Overview & Binary Status',
    },
    {
      id: 'TREE',
      label: lang === 'hi' ? 'बाइनरी ट्री' : 'Binary Tree',
      icon: <GitMerge className="w-4 h-4" />,
      badge: '1:1',
      descHi: 'लेफ्ट-राइट डाउनलाइन व्यू',
      descEn: 'Left/Right Genealogy',
    },
    {
      id: 'PROOF',
      label: lang === 'hi' ? 'कानूनी प्रूफ व सत्यापन' : 'Legal & Proofs',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: 'MCA',
      descHi: 'MCA व ISO आधिकारिक प्रमाण',
      descEn: 'Govt. Compliance & Seals',
    },
    {
      id: 'TEAM',
      label: lang === 'hi' ? 'मेरी टीम' : 'Downline Team',
      icon: <Users className="w-4 h-4" />,
      descHi: 'सक्रिय डाउनलाइन डिस्ट्रीब्यूटर्स',
      descEn: 'All Downline Members',
    },
    {
      id: 'INCOMES',
      label: lang === 'hi' ? '7 इनकम प्लान' : '7 Incomes',
      icon: <Layers className="w-4 h-4" />,
      badge: '7 STREAMS',
      descHi: 'मैचिंग, डायरेक्ट, रॉयल्टी आदि',
      descEn: 'Pair Matching & Bonuses',
    },
    {
      id: 'CALCULATOR',
      label: lang === 'hi' ? 'प्लान कैलकुलेटर' : 'Plan Calculator',
      icon: <Calculator className="w-4 h-4" />,
      descHi: 'संभावित कमाई अनुमानक',
      descEn: 'Projection Simulator',
    },
    {
      id: 'PACKAGES',
      label: lang === 'hi' ? 'पैकेज अपग्रेड' : 'Packages',
      icon: <PackageCheck className="w-4 h-4" />,
      descHi: '₹500 से ₹10,000 एक्टिवेशन',
      descEn: 'Activation & Top-ups',
    },
    {
      id: 'WALLET',
      label: lang === 'hi' ? 'वॉलेट व रिचार्ज' : 'Wallet & Recharge',
      icon: <Wallet className="w-4 h-4" />,
      badge: '2% CBK',
      descHi: 'तत्काल निकासी व मोबाइल रिचार्ज',
      descEn: 'IMPS Payout & Recharge',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER BAR: Perfectly Responsive, Zero Mobile Overflow */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Logo - Never shrinks, responsive sizing */}
          <div
            onClick={() => onTabChange('DASHBOARD')}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink-0"
          >
            <div
              style={{ backgroundColor: activeThemeConfig.hex }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/40 transition-colors"
            >
              <GitMerge className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  APEX<span style={{ color: activeThemeConfig.hex }}>BINARY</span>
                </span>
                <span className="hidden sm:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-white/10 text-slate-300 border border-white/15">
                  1:1 MATRIX
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                {lang === 'hi' ? 'मल्टी-लेवल बाइनरी नेटवर्क प्लेटफॉर्म' : 'MLM Binary Network Matrix'}
              </p>
            </div>
          </div>

          {/* RIGHT CONTROLS: Scaled strictly for mobile & desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Active Member Switcher (Hidden on Mobile to prevent squishing) */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1 text-xs">
              <UserCheck className="w-3.5 h-3.5 shrink-0" style={{ color: activeThemeConfig.hex }} />
              <div className="flex flex-col text-left max-w-[170px]">
                <span className="text-[9px] text-slate-400 leading-none">
                  {lang === 'hi' ? 'सक्रिय वितरक:' : 'Active Distributor:'}
                </span>
                <select
                  value={currentMemberId}
                  onChange={(e) => onMemberChange(e.target.value)}
                  className="bg-transparent text-white font-bold font-mono text-xs focus:outline-none cursor-pointer truncate"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="bg-slate-950 text-white">
                      {m.id} - {m.name} ({m.rank})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Active Member Quick Pill (Compact, Fits perfectly) */}
            <button
              onClick={() => setIsMemberPickerOpen(true)}
              className="sm:hidden flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-[11px] font-bold font-mono min-h-[36px]"
              title="Switch Active Member"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeThemeConfig.hex }}
              />
              <span className="max-w-[70px] truncate">{currentMember.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* COLOR THEME SWITCHER (Requested Feature) */}
            <div className="relative">
              <button
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm min-h-[36px] min-w-[36px] justify-center"
                title="Change Color Theme / कलर थीम बदलें"
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shadow-sm ring-1 ring-white/30 shrink-0"
                  style={{ backgroundColor: activeThemeConfig.hex }}
                />
                <Palette className="w-3.5 h-3.5 text-slate-300 hidden md:inline" />
                <span className="text-[11px] hidden lg:inline">
                  {lang === 'hi' ? activeThemeConfig.nameHi.split(' ')[0] : activeThemeConfig.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {/* Theme Picker Dropdown Popover */}
              {isThemePickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsThemePickerOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-40 w-56 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 p-2 shadow-2xl space-y-1 animate-scaleUp">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                      {lang === 'hi' ? 'ट्रांसपेरेंट कलर थीम चुनें' : 'Transparent Color Theme'}
                    </div>

                    {(Object.keys(THEME_CONFIGS) as ThemeColor[]).map((tKey) => {
                      const cfg = THEME_CONFIGS[tKey];
                      const isSelected = theme === tKey;
                      return (
                        <button
                          key={tKey}
                          onClick={() => {
                            onThemeChange(tKey);
                            setIsThemePickerOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-slate-800 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shadow-md"
                              style={{ backgroundColor: cfg.hex }}
                            />
                            <span>{lang === 'hi' ? cfg.nameHi : cfg.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Language Switcher Button (Compact on Mobile) */}
            <button
              onClick={onToggleLang}
              className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[11px] sm:text-xs font-bold text-slate-200 flex items-center gap-1 transition-colors min-h-[36px]"
              title="Toggle Language (English / हिन्दी)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Quick Add Member Button */}
            <button
              onClick={onOpenAddMember}
              style={{ backgroundColor: activeThemeConfig.hex }}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-black/30 transition-all shrink-0 hover:opacity-90 min-h-[36px]"
              title="Add New Member / नया सदस्य जोड़ें"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {lang === 'hi' ? '+ नया वितरक' : '+ Add Member'}
              </span>
            </button>

            {/* Mobile Full Menu Toggle Button */}
            <button
              onClick={toggleDrawer}
              className={`p-2 rounded-xl border text-slate-200 sm:hidden transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                isDrawerOpen
                  ? 'bg-slate-800 border-emerald-500/40 text-white'
                  : 'bg-slate-900/90 border-white/10 hover:bg-slate-800'
              }`}
              title="Toggle Menu / मेन्यू"
              aria-label="Toggle navigation menu"
            >
              {isDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HORIZONTAL SUB-NAV TABS: Smooth Swipeable Carousel on Mobile */}
      {/* ------------------------------------------------------------- */}
      <div className="border-t border-white/10 bg-slate-950/70 backdrop-blur-md relative">
        {/* Soft edge gradient indicator for horizontal scroll */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-950 to-transparent sm:hidden z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-slate-950 to-transparent sm:hidden z-10" />

        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div
            ref={tabsScrollRef}
            className="flex items-center gap-1.5 overflow-x-auto py-1.5 sm:py-2 scrollbar-none no-scrollbar"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  data-active={isActive}
                  onClick={() => {
                    onTabChange(item.id);
                    closeDrawer();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none shrink-0 min-h-[38px] ${
                    isActive
                      ? 'text-white bg-slate-800/90 border border-white/20 shadow-md ring-1 ring-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <span style={{ color: isActive ? activeThemeConfig.hex : undefined }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MOBILE MEMBER SELECTOR MODAL (When tapping Mobile Member chip) */}
      {/* ------------------------------------------------------------- */}
      {isMemberPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {lang === 'hi' ? 'सक्रिय वितरक चुनें' : 'Switch Active Distributor'}
                </h3>
              </div>
              <button
                onClick={() => setIsMemberPickerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'जिस डिस्ट्रीब्यूटर की आईडी चुनेंगे, उसका ट्री और वॉलेट लोड होगा:'
                : 'Select any distributor to load their personal tree, earnings & wallet:'}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {members.map((m) => {
                const isSelected = m.id === currentMemberId;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      onMemberChange(m.id);
                      setIsMemberPickerOpen(false);
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs flex items-center justify-between border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-white font-bold shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-emerald-400">{m.id}</span>
                        <span className="font-bold text-white">{m.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {m.rank} • Package: ₹{m.packageAmount}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. MOBILE FULL NAVIGATION DRAWER (Slide-Over / Overlay Modal) */}
      {/* ------------------------------------------------------------- */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={closeDrawer}
          />

          {/* Drawer Content */}
          <div className="relative z-10 bg-slate-950 border-b border-white/15 rounded-b-3xl shadow-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-5 space-y-5 animate-slideDown">
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div
                  style={{ backgroundColor: activeThemeConfig.hex }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                >
                  <GitMerge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">APEXBINARY MENU</h3>
                  <p className="text-[10px] text-slate-400">1:1 Binary MLM Matrix System</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Active Member Status Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-white/10 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono text-xs">
                    {currentMember.id.slice(-2)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{currentMember.name}</span>
                      <span className="text-[9px] font-mono text-emerald-400">({currentMember.id})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{currentMember.rank}</span>
                      <span>•</span>
                      <span>Package: ₹{currentMember.packageAmount}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    closeDrawer();
                    setIsMemberPickerOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700"
                >
                  {lang === 'hi' ? 'बदलें' : 'Switch'}
                </button>
              </div>

              {/* BV Quick Status */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[10px]">
                <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Left BV:</span>
                  <span className="font-mono font-bold text-emerald-400">{currentMember.leftBV}</span>
                </div>
                <div className="bg-slate-950/60 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Right BV:</span>
                  <span className="font-mono font-bold text-emerald-400">{currentMember.rightBV}</span>
                </div>
              </div>
            </div>

            {/* All 8 Navigation Cards Grid */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {lang === 'hi' ? 'नेविगेशन पेजेस (8 Pages)' : 'All Platform Pages (8 Pages)'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        closeDrawer();
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[72px] ${
                        isActive
                          ? 'bg-slate-800/90 border-emerald-500/50 text-white shadow-lg ring-1 ring-emerald-500/30'
                          : 'bg-slate-900/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.icon}
                        </div>
                        {item.badge && (
                          <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white mt-1.5 leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[9px] text-slate-400 leading-tight truncate mt-0.5">
                          {lang === 'hi' ? item.descHi : item.descEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Presets Row inside Drawer */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-300" />
                  <span>{lang === 'hi' ? 'ट्रांसपेरेंट कलर थीम' : 'Transparent Theme'}</span>
                </span>
                <span className="text-white font-mono">{activeThemeConfig.name.split(' ')[0]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(THEME_CONFIGS) as ThemeColor[]).map((tKey) => {
                  const cfg = THEME_CONFIGS[tKey];
                  const isSelected = theme === tKey;
                  return (
                    <button
                      key={tKey}
                      onClick={() => onThemeChange(tKey)}
                      className={`h-10 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                        isSelected
                          ? 'border-white bg-white/10 shadow-md ring-2 ring-white/20'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full shadow-sm ring-1 ring-white/30"
                        style={{ backgroundColor: cfg.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions Row: Add Member & Language */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  closeDrawer();
                  onOpenAddMember();
                }}
                style={{ backgroundColor: activeThemeConfig.hex }}
                className="py-3 px-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'hi' ? '+ नया वितरक' : '+ Add Member'}</span>
              </button>

              <button
                onClick={onToggleLang}
                className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'hi' ? 'English में बदलें' : 'हिन्दी में बदलें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
