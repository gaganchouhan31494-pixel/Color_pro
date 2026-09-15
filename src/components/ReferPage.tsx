import React, { useState } from 'react';
import {
  Users2,
  Copy,
  Share2,
  Gift,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import { Language, ReferralData } from '../types';
import { sound } from '../utils/sound';
import { ASSETS_3D } from '../utils/assets3d';

interface ReferPageProps {
  referralData: ReferralData;
  onClaimCommission: (amount: number) => void;
  language: Language;
}

export const ReferPage: React.FC<ReferPageProps> = ({
  referralData,
  onClaimCommission,
  language,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [claimedToast, setClaimedToast] = useState<string | null>(null);

  const copyCode = () => {
    navigator.clipboard?.writeText(referralData.inviteCode);
    setCopiedCode(true);
    sound.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(referralData.referralLink);
    setCopiedLink(true);
    sound.playClick();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaim = () => {
    if (referralData.unclaimedCommission <= 0) return;
    const amt = referralData.unclaimedCommission;
    sound.playWin();
    onClaimCommission(amt);
    setClaimedToast(
      language === 'hi'
        ? `₹${amt.toLocaleString('en-IN')} का कमीशन सीधे वॉलेट में जोड़ दिया गया!`
        : `₹${amt.toLocaleString('en-IN')} commission claimed and credited to wallet!`
    );
    setTimeout(() => setClaimedToast(null), 4000);
  };

  return (
    <div id="page-refer" className="space-y-5 animate-fadeIn">
      {claimedToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{claimedToast}</span>
        </div>
      )}

      {/* Hero Banner with 3D Graphic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'hi' ? 'वीआईपी एजेंट प्रोग्राम' : 'VIP Agent Program'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'hi' ? 'दोस्तों को आमंत्रित करें और कमाएं' : 'Invite Friends & Earn Daily'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              {language === 'hi'
                ? 'अपने दोस्तों को इनवाइट करें और उनके हर दांव पर 3 स्तरों तक 0.6% लाइफटाइम कमीशन पाएं!'
                : 'Invite your friends and earn up to 0.6% lifetime passive rebate on every bet they place!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 3D VIP Gold Chips Asset */}
            <div className="hidden sm:block w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl bg-slate-950/60 p-1 flex-shrink-0">
              <img
                src={ASSETS_3D.vipGoldChips}
                alt="3D Gold VIP"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Unclaimed Commission Card */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-2xl p-4 text-center sm:text-right flex flex-col items-center sm:items-end">
              <span className="text-[11px] uppercase font-bold text-slate-400">
                {language === 'hi' ? 'दावा योग्य कमीशन' : 'Unclaimed Commission'}
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-400 my-1">
                ₹{referralData.unclaimedCommission.toLocaleString('en-IN')}
              </div>
              <button
                id="btn-claim-commission"
                onClick={handleClaim}
                disabled={referralData.unclaimedCommission <= 0}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-lg disabled:opacity-50 transition-all active:scale-95"
              >
                {language === 'hi' ? 'वॉलेट में ट्रांसफर करें' : 'Claim to Wallet'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Code & Link Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          <span>{language === 'hi' ? 'आपका इनविटेशन कोड व शेयर लिंक' : 'Your Invite Code & Referral Link'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Invite Code Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {language === 'hi' ? 'इनविटेशन कोड' : 'Invitation Code'}
              </span>
              <div className="text-lg font-mono font-black text-amber-300">{referralData.inviteCode}</div>
            </div>
            <button
              onClick={copyCode}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Share Link Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {language === 'hi' ? 'रेफरल लिंक' : 'Referral Link'}
              </span>
              <div className="text-xs font-mono text-slate-300 truncate">{referralData.referralLink}</div>
            </div>
            <button
              onClick={copyLink}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3-Tier Commission Structure */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>{language === 'hi' ? '3-स्तरीय कमीशन सिस्टम' : '3-Tier Agency Commission Rates'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase">Level 1 (Direct)</span>
              <span className="text-base font-black font-mono text-emerald-300">0.6%</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'आपके द्वारा सीधे जोड़े गए दोस्तों के हर राउंड दांव पर'
                : 'From friends directly invited by your invite code.'}
            </p>
            <div className="text-xs font-mono text-slate-300 pt-1 border-t border-slate-800">
              Active: {referralData.level1Count} users
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase">Level 2 (Secondary)</span>
              <span className="text-base font-black font-mono text-indigo-300">0.3%</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'जब आपके दोस्त अन्य खिलाड़ियों को जोड़ते हैं'
                : 'From sub-referrals invited by your direct friends.'}
            </p>
            <div className="text-xs font-mono text-slate-300 pt-1 border-t border-slate-800">
              Active: {referralData.level2Count} users
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase">Level 3 (Tertiary)</span>
              <span className="text-base font-black font-mono text-purple-300">0.1%</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'तीसरे स्तर पर जुड़ने वाले सभी खिलाड़ियों के दांव पर'
                : 'From third-tier extended network players.'}
            </p>
            <div className="text-xs font-mono text-slate-300 pt-1 border-t border-slate-800">
              Active: {referralData.level3Count} users
            </div>
          </div>
        </div>
      </div>

      {/* Referral Records List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-purple-400" />
            <span>{language === 'hi' ? 'आमंत्रित मित्रों की सूची (Live Friends List)' : 'Invited Friends List'}</span>
          </span>
          <span className="text-xs text-slate-400">Total: {referralData.friends.length}</span>
        </h3>

        <div className="space-y-2">
          {referralData.friends.map((f) => (
            <div
              key={f.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-mono font-bold text-white flex items-center gap-2">
                  <span>+91 {f.phone}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-sans">
                    Tier {f.level}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Joined: {f.date} • Total Turnover: ₹{f.totalBet.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Commission</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +₹{f.commission.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
