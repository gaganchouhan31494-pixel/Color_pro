import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Member, Package, Leg } from '../types';
import { PACKAGES } from '../data/mlmData';
import { registerNewDistributor, formatCurrency } from '../utils/mlmEngine';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onMemberAdded: (updatedMembers: Member[], newMember: Member, spillover: boolean) => void;
  defaultPlacementId?: string;
  defaultLeg?: Leg;
  sponsorId: string;
  lang: 'en' | 'hi';
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  members,
  onMemberAdded,
  defaultPlacementId,
  defaultLeg = 'LEFT',
  sponsorId,
  lang,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSponsorId, setSelectedSponsorId] = useState(sponsorId);
  const [placementId, setPlacementId] = useState(defaultPlacementId || sponsorId);
  const [leg, setLeg] = useState<Leg>(defaultLeg);
  const [selectedPackageId, setSelectedPackageId] = useState(PACKAGES[2].id); // Silver Pro default
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync if props change
  React.useEffect(() => {
    if (defaultPlacementId) {
      setPlacementId(defaultPlacementId);
    }
    if (defaultLeg) {
      setLeg(defaultLeg);
    }
    if (sponsorId) {
      setSelectedSponsorId(sponsorId);
    }
  }, [defaultPlacementId, defaultLeg, sponsorId]);

  if (!isOpen) return null;

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const { updatedMembers, newMember, spilloverOccurred } = registerNewDistributor(
        members,
        {
          name: name.trim(),
          phone: phone.trim() || '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
          email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
          sponsorId: selectedSponsorId,
          placementId: placementId,
          preferredLeg: leg,
          pkg: selectedPackage,
        }
      );

      onMemberAdded(updatedMembers, newMember, spilloverOccurred);
      onClose();
      // Reset
      setName('');
      setPhone('');
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'hi' ? 'नया सदस्य जोड़ें (Binary Placement)' : 'Register New Distributor'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'hi'
                  ? 'लेफ्ट या राइट लेग में सदस्य जोड़ें, BV तुरंत अपलाइन में जुड़ेगा'
                  : 'Place in Left or Right leg. 100% BV propagates to uplines'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {lang === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ramesh@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Placement & Leg Select */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'hi' ? 'स्पॉन्सर आईडी' : 'Sponsor ID'}
              </label>
              <select
                value={selectedSponsorId}
                onChange={(e) => setSelectedSponsorId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} ({m.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'hi' ? 'प्लेसमेंट आईडी' : 'Placement Parent'}
              </label>
              <select
                value={placementId}
                onChange={(e) => setPlacementId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 font-mono text-xs focus:outline-none"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} ({m.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === 'hi' ? 'लेग (Position)' : 'Binary Leg Position'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setLeg('LEFT')}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    leg === 'LEFT'
                      ? 'bg-blue-600/30 border-blue-500 text-blue-400 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  LEFT (बाएं)
                </button>
                <button
                  type="button"
                  onClick={() => setLeg('RIGHT')}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    leg === 'RIGHT'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-400 shadow-sm'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  RIGHT (दाएं)
                </button>
              </div>
            </div>
          </div>

          {/* Package Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'hi' ? 'जॉइनिंग पैकेज चुनें' : 'Select Activation Package'}
              </label>
              <span className="text-[11px] text-amber-400 font-medium">
                {lang === 'hi' ? 'BV / PV 100% काउंट होगा' : '100% BV Added to Tree'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PACKAGES.map((pkg) => {
                const isSelected = pkg.id === selectedPackageId;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`cursor-pointer p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 ring-1 ring-emerald-500/50 shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                        POPULAR
                      </span>
                    )}
                    <p className="text-xs font-bold text-white">{lang === 'hi' ? pkg.nameHi : pkg.name}</p>
                    <p className="text-sm font-extrabold text-emerald-400 mt-0.5">
                      {formatCurrency(pkg.price)}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{pkg.pv} BV</span>
                      <span>Cap {formatCurrency(pkg.dailyCapping)}/d</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instant Benefits Preview */}
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>{lang === 'hi' ? 'तत्काल मिलने वाले लाभ:' : 'Instant Impact Preview:'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>
                • {lang === 'hi' ? 'डायरेक्ट स्पॉन्सर इनकम:' : 'Direct Sponsor Bonus:'}{' '}
                <strong className="text-white">
                  {formatCurrency((selectedPackage.price * selectedPackage.directBonusPercent) / 100)}
                </strong>{' '}
                ({selectedPackage.directBonusPercent}%)
              </div>
              <div>
                • {lang === 'hi' ? 'बाइनरी वॉल्यूम:' : 'Binary Leg BV Added:'}{' '}
                <strong className="text-white">+{selectedPackage.pv} BV</strong> ({leg} Leg)
              </div>
              <div>
                • {lang === 'hi' ? 'स्पिलओवर:' : 'Spillover Feature:'}{' '}
                <span className="text-cyan-300">
                  {lang === 'hi' ? 'जगह भरी होने पर स्वतः नीचे शिफ्ट' : 'Auto spillover if slot busy'}
                </span>
              </div>
              <div>
                • {lang === 'hi' ? 'दैनिक आरओआई:' : 'Daily Cashback:'}{' '}
                <span className="text-emerald-300">
                  {selectedPackage.roiDailyPercent}% x {selectedPackage.roiDays} {lang === 'hi' ? 'दिन' : 'days'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? lang === 'hi'
                    ? 'दर्ज किया जा रहा है...'
                    : 'Registering...'
                  : lang === 'hi'
                  ? `सदस्य जोड़ें और ₹${selectedPackage.price.toLocaleString()} एक्टिवेट करें`
                  : `Register & Activate ${selectedPackage.name} (${formatCurrency(selectedPackage.price)})`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
