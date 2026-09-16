import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Member,
  TransactionRecord,
  Package,
  Leg,
  PlanSettings,
  ThemeColor,
} from './types';
import {
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  DEFAULT_PLAN_SETTINGS,
  PACKAGES,
} from './data/mlmData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GenealogyTreeView } from './components/GenealogyTreeView';
import { LegalProofView } from './components/LegalProofView';
import { TeamListView } from './components/TeamListView';
import { IncomeStreamsView } from './components/IncomeStreamsView';
import { PlanCalculatorView } from './components/PlanCalculatorView';
import { PackagesView } from './components/PackagesView';
import { WalletStatementsView } from './components/WalletStatementsView';
import { AddMemberModal } from './components/AddMemberModal';
import { formatCurrency } from './utils/mlmEngine';
import { THEME_CONFIGS } from './utils/themePresets';
import {
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  GitMerge,
  ShieldCheck,
  Wallet,
  Users,
  Menu,
} from 'lucide-react';

export function App() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activeMemberId, setActiveMemberId] = useState<string>('MLM-1001');
  const [treeRootId, setTreeRootId] = useState<string>('MLM-1001');
  const [currentTab, setCurrentTab] = useState<string>('DASHBOARD');
  const [lang, setLang] = useState<'hi' | 'en'>('hi'); // Default Hindi as requested by user prompt
  const [settings, setSettings] = useState<PlanSettings>(DEFAULT_PLAN_SETTINGS);

  // Theme state (Transparent Glass Themes: emerald, sapphire, amber, purple, crimson)
  const [theme, setTheme] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem('apex_binary_theme');
    return (saved as ThemeColor) || 'emerald';
  });

  const handleThemeChange = (newTheme: ThemeColor) => {
    setTheme(newTheme);
    localStorage.setItem('apex_binary_theme', newTheme);
  };

  const activeThemeConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.emerald;

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [targetPlacementId, setTargetPlacementId] = useState('MLM-1001');
  const [targetLeg, setTargetLeg] = useState<Leg>('LEFT');

  // Flash Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentMember = members.find((m) => m.id === activeMemberId) || members[0];

  // Open add member modal helper
  const handleOpenAddMember = (placementId?: string, leg?: Leg) => {
    setTargetPlacementId(placementId || activeMemberId);
    setTargetLeg(leg || 'LEFT');
    setIsAddModalOpen(true);
  };

  // On Member Added callback
  const handleMemberAdded = (updatedMembers: Member[], newMember: Member, spillover: boolean) => {
    setMembers(updatedMembers);

    // If active member was sponsor, give instant direct bonus
    if (newMember.sponsorId === activeMemberId) {
      const directBonus = (newMember.packageAmount * 10) / 100;
      const directTxn: TransactionRecord = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'DIRECT',
        title: 'Direct Referral Commission',
        titleHi: 'डायरेक्ट स्पॉन्सर कमीशन',
        amount: directBonus,
        isCredit: true,
        notes: `Sponsored ${newMember.name} (${newMember.id}) on ${newMember.packageName}`,
        memberReference: newMember.id,
        status: 'COMPLETED',
      };
      setTransactions((prev) => [directTxn, ...prev]);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(
      lang === 'hi'
        ? `नया डिस्ट्रीब्यूटर ${newMember.name} (${newMember.id}) सफलतापूर्वक जोड़ा गया! ${
            spillover ? '(स्पिलओवर द्वारा नीचे प्लेस हुआ)' : ''
          }`
        : `New Distributor ${newMember.name} (${newMember.id}) added successfully! ${
            spillover ? '(Auto-spillover placed)' : ''
          }`
    );
  };

  // Run Daily 1:1 Matching Payout
  const handleRunDailyMatching = () => {
    const matchedBV = Math.min(currentMember.leftBV, currentMember.rightBV);

    if (matchedBV <= 0) {
      showToast(
        lang === 'hi'
          ? 'मैचिंग के लिए दोनों लेग्स (Left और Right) में बिजनेस वॉल्यूम होना जरूरी है।'
          : 'Both Left and Right legs need active business volume to generate 1:1 matching payout.',
        'info'
      );
      return;
    }

    const currentPkg = PACKAGES.find((p) => p.id === currentMember.packageId) || PACKAGES[0];
    const rawPairIncome = (matchedBV * currentPkg.pairMatchingPercent) / 100;
    const payableIncome = Math.min(rawPairIncome, currentPkg.dailyCapping);

    // Create Transaction
    const newTxn: TransactionRecord = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'PAIR_MATCHING',
      title: '1:1 Binary Pair Matching Daily Cutoff',
      titleHi: '1:1 बाइनरी पेयर मैचिंग दैनिक कटऑफ पेआउट',
      amount: payableIncome,
      isCredit: true,
      notes: `Matched ${matchedBV.toLocaleString()} BV @ 10%. Excess volume carried forward.`,
      status: 'COMPLETED',
    };

    // Update member's leftBV and rightBV
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === currentMember.id) {
          return {
            ...m,
            leftBV: m.leftBV - matchedBV,
            rightBV: m.rightBV - matchedBV,
          };
        }
        return m;
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });

    showToast(
      lang === 'hi'
        ? `बधाई! ${matchedBV.toLocaleString()} BV मैच हुआ और ${formatCurrency(
            payableIncome
          )} पेआउट वॉलेट में क्रेडिट हुआ!`
        : `Congratulations! ${matchedBV.toLocaleString()} BV matched and ${formatCurrency(
            payableIncome
          )} credited to your wallet!`
    );
  };

  // Handle Package Upgrade
  const handleUpgradePackage = (pkg: Package) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === currentMember.id) {
          return {
            ...m,
            packageId: pkg.id,
            packageName: pkg.name,
            packageAmount: pkg.price,
            pv: pkg.pv,
          };
        }
        return m;
      })
    );

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });

    showToast(
      lang === 'hi'
        ? `सफलतापूर्वक ${pkg.name} पैकेज पर अपग्रेड किया गया!`
        : `Successfully upgraded to ${pkg.name} package!`
    );
  };

  // Handle Withdrawal
  const handleWithdrawal = (amount: number, method: string, accountDetail: string) => {
    const netAmount = amount * 0.9;
    const newTxn: TransactionRecord = {
      id: `WTH-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'WITHDRAWAL',
      title: `Bank Withdrawal via ${method}`,
      titleHi: `${method} द्वारा बैंक खाता निकासी`,
      amount: amount,
      isCredit: false,
      notes: `Transfer to ${accountDetail}. Net Credited: ${formatCurrency(netAmount)} (TDS 5% + Admin 5% deducted)`,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [newTxn, ...prev]);

    showToast(
      lang === 'hi'
        ? `${formatCurrency(amount)} की निकासी प्रोसेस हुई! शुद्ध राशि ${formatCurrency(netAmount)} बैंक में भेजी गई।`
        : `Withdrawal of ${formatCurrency(amount)} processed! Net ${formatCurrency(netAmount)} sent to ${accountDetail}.`
    );
  };

  // Handle Mobile Recharge via Wallet
  const handleRecharge = (amount: number, mobileNumber: string, operator: string, planName: string) => {
    const rechargeTxnId = `RCH-${Math.floor(100000 + Math.random() * 900000)}`;
    const cashbackTxnId = `CBK-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const cashbackAmount = Math.max(1, Math.round(amount * 0.02)); // 2% MLM utility cashback

    const debitTxn: TransactionRecord = {
      id: rechargeTxnId,
      date: dateStr,
      type: 'MOBILE_RECHARGE',
      title: `Mobile Recharge (${operator})`,
      titleHi: `मोबाइल रिचार्ज (${operator})`,
      amount: amount,
      isCredit: false,
      notes: `${operator} Mobile: +91 ${mobileNumber} | Plan: ${planName}. Operator Ref: ${operator.toUpperCase().slice(0, 3)}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: 'COMPLETED',
    };

    const cashbackTxn: TransactionRecord = {
      id: cashbackTxnId,
      date: dateStr,
      type: 'MOBILE_RECHARGE',
      title: `Recharge 2% Cashback Bonus`,
      titleHi: `मोबाइल रिचार्ज 2% कैशबैक बोनस`,
      amount: cashbackAmount,
      isCredit: true,
      notes: `Instant 2% utility cashback earned on Mobile Recharge ₹${amount} (${operator})`,
      status: 'COMPLETED',
    };

    setTransactions((prev) => [cashbackTxn, debitTxn, ...prev]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    showToast(
      lang === 'hi'
        ? `₹${amount} का ${operator} मोबाइल रिचार्ज सफल! +₹${cashbackAmount} कैशबैक वॉलेट में क्रेडिट हुआ।`
        : `Mobile recharge of ₹${amount} for ${operator} successful! +₹${cashbackAmount} cashback credited to wallet.`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-emerald-500 selection:text-white pb-28 sm:pb-8">
      {/* Ambient Transparent Theme Glow Backdrop (Non-intrusive) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 transition-all duration-700"
          style={{ backgroundColor: activeThemeConfig.hex }}
        />
        <div
          className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 transition-all duration-700"
          style={{ backgroundColor: activeThemeConfig.hex }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[160px] opacity-20 transition-all duration-700"
          style={{ backgroundColor: activeThemeConfig.hex }}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-slideUp">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold backdrop-blur-xl ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/90 text-amber-300 border-amber-500/40'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header with Theme Switcher */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        members={members}
        currentMemberId={activeMemberId}
        onMemberChange={(id) => {
          setActiveMemberId(id);
          setTreeRootId(id);
          showToast(
            lang === 'hi'
              ? `स्विच किया गया: ${members.find((m) => m.id === id)?.name}`
              : `Switched view to ${members.find((m) => m.id === id)?.name}`,
            'info'
          );
        }}
        onOpenAddMember={() => handleOpenAddMember()}
        theme={theme}
        onThemeChange={handleThemeChange}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'hi' ? 'en' : 'hi'))}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen((prev) => !prev)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {currentTab === 'DASHBOARD' && (
          <DashboardView
            member={currentMember}
            allMembers={members}
            transactions={transactions}
            onOpenAddMember={handleOpenAddMember}
            onRunDailyMatching={handleRunDailyMatching}
            onNavigateTab={setCurrentTab}
            lang={lang}
          />
        )}

        {currentTab === 'TREE' && (
          <GenealogyTreeView
            members={members}
            rootMemberId={treeRootId}
            onSelectRoot={setTreeRootId}
            onOpenAddMember={handleOpenAddMember}
            lang={lang}
          />
        )}

        {currentTab === 'PROOF' && (
          <LegalProofView
            members={members}
            lang={lang}
          />
        )}

        {currentTab === 'TEAM' && (
          <TeamListView
            members={members}
            currentMember={currentMember}
            onSelectMember={(id) => {
              setActiveMemberId(id);
              setTreeRootId(id);
              showToast(
                lang === 'hi'
                  ? `स्विच किया गया: ${members.find((m) => m.id === id)?.name}`
                  : `Switched view to ${members.find((m) => m.id === id)?.name}`,
                'info'
              );
            }}
            onOpenAddMember={() => handleOpenAddMember()}
            lang={lang}
          />
        )}

        {currentTab === 'INCOMES' && (
          <IncomeStreamsView
            lang={lang}
            onNavigateToCalculator={() => setCurrentTab('CALCULATOR')}
          />
        )}

        {currentTab === 'CALCULATOR' && <PlanCalculatorView lang={lang} />}

        {currentTab === 'PACKAGES' && (
          <PackagesView
            currentMember={currentMember}
            onUpgradePackage={handleUpgradePackage}
            lang={lang}
          />
        )}

        {currentTab === 'WALLET' && (
          <WalletStatementsView
            member={currentMember}
            transactions={transactions}
            onWithdraw={handleWithdrawal}
            onRecharge={handleRecharge}
            settings={settings}
            lang={lang}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Quick Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-2 pt-1.5 pb-2.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => {
            setCurrentTab('DASHBOARD');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all min-w-[54px] ${
            currentTab === 'DASHBOARD' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-all ${
              currentTab === 'DASHBOARD' ? 'bg-white/10 shadow-sm' : ''
            }`}
          >
            <LayoutDashboard
              className="w-4 h-4"
              style={{ color: currentTab === 'DASHBOARD' ? activeThemeConfig.hex : undefined }}
            />
          </div>
          <span className="leading-none text-[10px]">{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
          {currentTab === 'DASHBOARD' && (
            <div
              className="w-1.5 h-1.5 rounded-full mt-0.5"
              style={{ backgroundColor: activeThemeConfig.hex }}
            />
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('TREE');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all min-w-[54px] ${
            currentTab === 'TREE' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-all ${
              currentTab === 'TREE' ? 'bg-white/10 shadow-sm' : ''
            }`}
          >
            <GitMerge
              className="w-4 h-4"
              style={{ color: currentTab === 'TREE' ? activeThemeConfig.hex : undefined }}
            />
          </div>
          <span className="leading-none text-[10px]">{lang === 'hi' ? 'ट्री' : 'Tree'}</span>
          {currentTab === 'TREE' && (
            <div
              className="w-1.5 h-1.5 rounded-full mt-0.5"
              style={{ backgroundColor: activeThemeConfig.hex }}
            />
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('PROOF');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all min-w-[54px] ${
            currentTab === 'PROOF' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-all ${
              currentTab === 'PROOF' ? 'bg-white/10 shadow-sm' : ''
            }`}
          >
            <ShieldCheck
              className="w-4 h-4"
              style={{ color: currentTab === 'PROOF' ? activeThemeConfig.hex : undefined }}
            />
          </div>
          <span className="leading-none text-[10px]">{lang === 'hi' ? 'प्रूफ' : 'Proof'}</span>
          {currentTab === 'PROOF' && (
            <div
              className="w-1.5 h-1.5 rounded-full mt-0.5"
              style={{ backgroundColor: activeThemeConfig.hex }}
            />
          )}
        </button>

        <button
          onClick={() => {
            setCurrentTab('WALLET');
            setIsMobileDrawerOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all min-w-[54px] ${
            currentTab === 'WALLET' ? 'text-white' : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-all ${
              currentTab === 'WALLET' ? 'bg-white/10 shadow-sm' : ''
            }`}
          >
            <Wallet
              className="w-4 h-4"
              style={{ color: currentTab === 'WALLET' ? activeThemeConfig.hex : undefined }}
            />
          </div>
          <span className="leading-none text-[10px]">{lang === 'hi' ? 'वॉलेट' : 'Wallet'}</span>
          {currentTab === 'WALLET' && (
            <div
              className="w-1.5 h-1.5 rounded-full mt-0.5"
              style={{ backgroundColor: activeThemeConfig.hex }}
            />
          )}
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
          className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-xl text-[10px] font-bold transition-all min-w-[54px] ${
            ['TEAM', 'INCOMES', 'CALCULATOR', 'PACKAGES'].includes(currentTab) || isMobileDrawerOpen
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <div
            className={`p-1 rounded-lg transition-all ${
              ['TEAM', 'INCOMES', 'CALCULATOR', 'PACKAGES'].includes(currentTab) || isMobileDrawerOpen
                ? 'bg-white/10 shadow-sm'
                : ''
            }`}
          >
            <Menu
              className="w-4 h-4"
              style={{
                color:
                  ['TEAM', 'INCOMES', 'CALCULATOR', 'PACKAGES'].includes(currentTab) || isMobileDrawerOpen
                    ? activeThemeConfig.hex
                    : undefined,
              }}
            />
          </div>
          <span className="leading-none text-[10px]">
            {currentTab === 'TEAM'
              ? lang === 'hi' ? 'टीम' : 'Team'
              : currentTab === 'INCOMES'
              ? lang === 'hi' ? 'इनकम' : 'Income'
              : currentTab === 'CALCULATOR'
              ? lang === 'hi' ? 'कैलकुलेटर' : 'Calc'
              : currentTab === 'PACKAGES'
              ? lang === 'hi' ? 'पैकेज' : 'Packages'
              : lang === 'hi' ? 'मेन्यू' : 'Menu'}
          </span>
          {(['TEAM', 'INCOMES', 'CALCULATOR', 'PACKAGES'].includes(currentTab) || isMobileDrawerOpen) && (
            <div
              className="w-1.5 h-1.5 rounded-full mt-0.5"
              style={{ backgroundColor: activeThemeConfig.hex }}
            />
          )}
        </button>
      </nav>

      {/* Add Member Placement Modal */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        members={members}
        onMemberAdded={handleMemberAdded}
        defaultPlacementId={targetPlacementId}
        defaultLeg={targetLeg}
        sponsorId={activeMemberId}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/70 backdrop-blur-md py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 {settings.companyName}. All Rights Reserved. Complete 1:1 Binary MLM Matrix System.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>1:1 Pair Matching</span>
            <span>•</span>
            <span>Anti-Duplicate System</span>
            <span>•</span>
            <span>Power Leg Carry Forward</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
