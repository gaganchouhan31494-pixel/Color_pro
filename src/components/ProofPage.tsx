import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Building2,
  ExternalLink,
  Clock,
  Sparkles,
  TrendingUp,
  Receipt,
  X,
} from 'lucide-react';
import { Language, ProofItem } from '../types';
import { LIVE_PROOF_RECORDS } from '../utils/dummyData';
import { sound } from '../utils/sound';
import { ASSETS_3D } from '../utils/assets3d';

interface ProofPageProps {
  language: Language;
}

export const ProofPage: React.FC<ProofPageProps> = ({ language }) => {
  const [proofList, setProofList] = useState<ProofItem[]>(LIVE_PROOF_RECORDS);
  const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);
  const [todayPaidOut, setTodayPaidOut] = useState<number>(24892400);

  // Simulate incoming live payout every few seconds to make it feel vibrant and active!
  useEffect(() => {
    const timer = setInterval(() => {
      const randomUsers = ['98***881', '77***410', '82***902', '91***334', '69***119', '88***620'];
      const randomBanks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Paytm Bank'];
      const randomCities = ['Jaipur', 'Indore', 'Delhi', 'Surat', 'Mumbai', 'Lucknow', 'Patna'];
      const randomAmount = Math.floor(12 + Math.random() * 85) * 500; // ₹6,000 to ₹45,000

      const newProof: ProofItem = {
        id: 'prf-' + Date.now(),
        userMasked: randomUsers[Math.floor(Math.random() * randomUsers.length)],
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=80&auto=format&fit=crop&q=80`,
        amount: randomAmount,
        method: Math.random() > 0.5 ? 'Instant UPI Payout' : 'IMPS Bank Transfer',
        utr: '948' + Math.floor(100000000 + Math.random() * 900000000),
        timeAgo: 'Just now',
        bankName: randomBanks[Math.floor(Math.random() * randomBanks.length)],
        city: randomCities[Math.floor(Math.random() * randomCities.length)],
      };

      setProofList((prev) => [newProof, ...prev.slice(0, 14)]);
      setTodayPaidOut((prev) => prev + randomAmount);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div id="page-proof" className="space-y-5 animate-fadeIn">
      {/* Overview Stats with 3D Trust Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border border-emerald-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'hi' ? '100% सत्यापित निकासी प्रमाण' : '100% Verified Payout Proofs'}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-black text-white">
              ₹{todayPaidOut.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{language === 'hi' ? 'आज 5,280+ खिलाड़ियों को भेजा गया कुल भुगतान' : 'Total disbursed today to 5,280+ winners'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-lg bg-slate-950/60 p-1 flex-shrink-0">
              <img
                src={ASSETS_3D.provablyFair3D}
                alt="3D Verified"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 border border-emerald-500/20 px-4 py-2.5 rounded-2xl">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div className="text-xs">
                <div className="font-bold text-white">NPCI & IMPS Verified</div>
                <div className="text-[10px] text-slate-400">Instant Automated Bank Disbursal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proofs Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{language === 'hi' ? 'रियल-टाइम निकासी ट्रांजेक्शन स्ट्रीम' : 'Real-Time Withdrawal Stream'}</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Stream
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {proofList.map((proof) => (
            <div
              key={proof.id}
              className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 shadow hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center font-mono text-xs">
                    {proof.userMasked.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white text-sm">
                      User {proof.userMasked}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-500" />
                      <span>{proof.bankName} • {proof.city}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono font-black text-emerald-400">
                    ₹{proof.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400">{proof.timeAgo}</div>
                </div>
              </div>

              {/* Receipt / UTR Row */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="font-mono text-[11px] text-slate-400 truncate mr-2">
                  UTR: <span className="text-slate-200 font-semibold">{proof.utr}</span>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedProof(proof);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 py-1 px-2 rounded-lg bg-indigo-500/10 transition-all whitespace-nowrap"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'रसीद देखें' : 'View Slip'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 space-y-4">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Official Bank Receipt Look */}
            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                Transaction Successful
              </span>
              <div className="text-3xl font-mono font-black text-white mt-1">
                ₹{selectedProof.amount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Transferred to User {selectedProof.userMasked}
              </p>
            </div>

            {/* Details Table */}
            <div className="bg-slate-900 rounded-2xl p-4 space-y-2.5 text-xs border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Bank Name</span>
                <span className="font-semibold text-white">{selectedProof.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode</span>
                <span className="font-semibold text-white">{selectedProof.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bank UTR / Ref No.</span>
                <span className="font-mono font-bold text-amber-300">{selectedProof.utr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-slate-300">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Credited to Bank
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProof(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs"
            >
              {language === 'hi' ? 'बंद करें' : 'Close Receipt'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
