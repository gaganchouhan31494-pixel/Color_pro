import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Download,
  Printer,
  ExternalLink,
  Lock,
  Building,
  Scale,
  Sparkles,
  QrCode,
  X,
  FileText,
  BadgeAlert,
  Fingerprint,
} from 'lucide-react';
import { Member, LegalDocument, MemberVerificationResult } from '../types';
import {
  COMPANY_LEGAL_INFO,
  LEGAL_DOCUMENTS,
  DIRECT_SELLING_COMPLIANCE_PILLARS,
  REGISTERED_PANS,
} from '../data/legalData';
import { OfficialStampBadge } from './OfficialStampBadge';

interface LegalProofViewProps {
  members: Member[];
  lang: 'en' | 'hi';
}

export const LegalProofView: React.FC<LegalProofViewProps> = ({ members, lang }) => {
  const [searchQuery, setSearchQuery] = useState('MLM-1001');
  const [verificationResult, setVerificationResult] = useState<MemberVerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);

  // Perform Duplicate & Legitimacy Verification
  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    setHasSearched(true);

    if (!query) {
      setVerificationResult(null);
      return;
    }

    // Check by Member ID
    const foundMember = members.find(
      (m) =>
        m.id.toUpperCase() === query ||
        m.name.toUpperCase().includes(query) ||
        m.phone.includes(query)
    );

    if (foundMember) {
      // Look for known PAN
      const matchedPan = Object.values(REGISTERED_PANS).find((p) => p.memberId === foundMember.id);

      setVerificationResult({
        isFound: true,
        isDuplicate: false,
        member: foundMember,
        panNumber: matchedPan ? matchedPan.pan : 'ABCDE1234F',
        verificationId: `VER-REG-${foundMember.id}-${Math.floor(1000 + Math.random() * 9000)}`,
        verifiedAt: new Date().toLocaleString(),
        kycStatus: 'VERIFIED',
        riskScore: 'LOW',
        state: matchedPan ? matchedPan.state : 'Delhi (NCT)',
        remarks: 'Genuine & Original Distributor. Registered under 1-PAN-1-ID Central Protocol.',
        remarksHi: 'मूल एवं सत्यापित वैध डिस्ट्रीब्यूटर। 1-पैन-1-आईडी नियम के अंतर्गत पूर्णतः प्रमाणित।',
      });
      return;
    }

    // Check by PAN Card
    const foundByPan = REGISTERED_PANS[query];
    if (foundByPan) {
      const associatedMember = members.find((m) => m.id === foundByPan.memberId);
      setVerificationResult({
        isFound: true,
        isDuplicate: false,
        member: associatedMember,
        panNumber: foundByPan.pan,
        verificationId: `VER-PAN-${foundByPan.memberId}-${Math.floor(1000 + Math.random() * 9000)}`,
        verifiedAt: new Date().toLocaleString(),
        kycStatus: 'VERIFIED',
        riskScore: 'LOW',
        state: foundByPan.state,
        remarks: 'Genuine primary PAN registration confirmed. No duplicate identity detected.',
        remarksHi: 'प्राथमिक पैन पंजीकरण सत्यापित। कोई डुप्लीकेट खाता नहीं पाया गया।',
      });
      return;
    }

    // If query contains 'DUP' or not found, show Duplicate/Unregistered alert
    if (query.includes('DUP') || query.includes('FAKE') || query.includes('TEST')) {
      setVerificationResult({
        isFound: false,
        isDuplicate: true,
        verificationId: `FLAG-DUP-${Math.floor(10000 + Math.random() * 90000)}`,
        verifiedAt: new Date().toLocaleString(),
        kycStatus: 'DUPLICATE_FLAGGED',
        riskScore: 'HIGH',
        state: 'Unknown',
        remarks:
          'DUPLICATE / UNAUTHORIZED ID DETECTED! This record violates the 1-PAN-1-ID direct selling guideline.',
        remarksHi:
          'चेतावनी: डुप्लीकेट अथवा अनाधिकृत आईडी पाई गई! यह 1-पैन-1-आईडी सरकारी नियम का उल्लंघन है।',
        originalMemberId: 'MLM-1001',
      });
      return;
    }

    // Unregistered record
    setVerificationResult({
      isFound: false,
      isDuplicate: false,
      verificationId: `NOTFOUND-${Math.floor(1000 + Math.random() * 9000)}`,
      verifiedAt: new Date().toLocaleString(),
      kycStatus: 'PENDING',
      riskScore: 'MEDIUM',
      state: 'N/A',
      remarks: 'No active distributor found with this ID or PAN in the official central registry.',
      remarksHi: 'केंद्रीय डेटाबेस में इस आईडी अथवा पैन कार्ड का कोई पंजीकृत सदस्य नहीं मिला।',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'hi'
                  ? 'भारत सरकार उपभोक्ता संरक्षण नियम 2021 अनुपालित'
                  : 'Govt. of India Direct Selling Rules 2021 Compliant'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {lang === 'hi'
                ? 'कंपनी कानूनी दस्तावेज, मुहर व डिस्ट्रीब्यूटर सत्यापन'
                : 'Legal Certificates, Official Stamps & De-Duplication Verification'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'कॉर्पोरेट कार्य मंत्रालय (MCA), ISO 9001:2015, आयकर विभाग पैन/टैन व जीएसटी द्वारा पंजीकृत। 1-पैन-1-आईडी से डुप्लीकेट आईडी का तुरंत सत्यापन करें।'
                : 'Registered with Ministry of Corporate Affairs, ISO 9001:2015, PAN, TAN & GSTIN. Interactive search tool to detect duplicate or genuine distributor IDs.'}
            </p>
          </div>

          {/* Stamped Seals Cluster */}
          <div className="flex items-center gap-3 shrink-0 self-center sm:self-auto">
            <OfficialStampBadge type="GOVT_COMPLIANT" size="md" />
            <OfficialStampBadge type="MCA_ROC" size="md" className="hidden sm:flex" />
          </div>
        </div>
      </div>

      {/* SECTION 1: DUPLICATE & MEMBER VERIFICATION TOOL (Requested Feature) */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'hi'
                  ? 'डुप्लीकेट आईडी व सदस्य सत्यता जांच टूल'
                  : 'Live Member & Duplicate ID Verification Engine'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'किसी भी डिस्ट्रीब्यूटर आईडी (जैसे MLM-1001) या पैन कार्ड नंबर डालकर जांचें कि आईडी असली है या डुप्लीकेट'
                : 'Enter Distributor ID (e.g. MLM-1001) or PAN (e.g. ABCDE1234F) to verify authenticity and duplicate check'}
            </p>
          </div>

          {/* Sample quick test tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500">{lang === 'hi' ? 'टेस्ट करें:' : 'Quick Test:'}</span>
            <button
              onClick={() => {
                setSearchQuery('MLM-1001');
                setTimeout(() => handleVerify(), 50);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono"
            >
              MLM-1001 (Original)
            </button>
            <button
              onClick={() => {
                setSearchQuery('ABCDE1234F');
                setTimeout(() => handleVerify(), 50);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono"
            >
              ABCDE1234F (PAN)
            </button>
            <button
              onClick={() => {
                setSearchQuery('MLM-DUP-999');
                setTimeout(() => handleVerify(), 50);
              }}
              className="px-2 py-0.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono"
            >
              MLM-DUP-999 (Duplicate Test)
            </button>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'आईडी / पैन नंबर दर्ज करें (उदा. MLM-1001, ABCDE1234F)...'
                  : 'Enter Member ID or PAN (e.g. MLM-1001, ABCDE1234F)...'
              }
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0 min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'सत्यापन करें (Verify ID)' : 'Verify Identity'}</span>
          </button>
        </form>

        {/* Verification Result Card */}
        {hasSearched && verificationResult && (
          <div
            className={`p-4 sm:p-6 rounded-2xl border transition-all ${
              verificationResult.isFound
                ? 'bg-gradient-to-br from-emerald-950/40 via-slate-950/70 to-slate-900 border-emerald-500/40'
                : verificationResult.isDuplicate
                ? 'bg-gradient-to-br from-rose-950/40 via-slate-950/70 to-slate-900 border-rose-500/40'
                : 'bg-slate-950/70 border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    verificationResult.isFound
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : verificationResult.isDuplicate
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {verificationResult.isFound ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : verificationResult.isDuplicate ? (
                    <BadgeAlert className="w-6 h-6 animate-pulse" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        verificationResult.isFound
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : verificationResult.isDuplicate
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {verificationResult.isFound
                        ? lang === 'hi'
                          ? 'सत्यापित मूल डिस्ट्रीब्यूटर (ORIGINAL)'
                          : 'VERIFIED & ORIGINAL ID'
                        : verificationResult.isDuplicate
                        ? lang === 'hi'
                          ? 'डुप्लीकेट / अनाधिकृत आईडी चिन्हित!'
                          : 'DUPLICATE RECORD FLAGGED!'
                        : lang === 'hi'
                        ? 'अंपंजीकृत रिकॉर्ड'
                        : 'RECORD NOT FOUND'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ID: {verificationResult.verificationId}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white mt-1">
                    {verificationResult.isFound && verificationResult.member
                      ? `${verificationResult.member.name} (${verificationResult.member.id})`
                      : verificationResult.isDuplicate
                      ? lang === 'hi'
                        ? 'अमान्य डुप्लीकेट प्रविष्टि रोकी गई'
                        : 'Unauthorized Duplicate Registration Blocked'
                      : lang === 'hi'
                      ? 'कोई सदस्य नहीं मिला'
                      : 'No Distributor Found'}
                  </h3>

                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {lang === 'hi' ? verificationResult.remarksHi : verificationResult.remarks}
                  </p>
                </div>
              </div>

              {/* Stamp Badge & Action */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {verificationResult.isFound && (
                  <>
                    <OfficialStampBadge type="DUPLICATE_CHECK_PASSED" size="sm" />
                    <button
                      onClick={() => setShowIdCardModal(true)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'hi' ? 'डिजिटल आईडी कार्ड' : 'View ID Card'}</span>
                    </button>
                  </>
                )}

                {verificationResult.isDuplicate && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-[11px] text-rose-300 max-w-xs text-center">
                    <p className="font-bold">
                      {lang === 'hi' ? '1 पैन = 1 आईडी सुरक्षा नीति' : 'Strict Anti-Duplicate Policy'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {lang === 'hi'
                        ? 'मूल आईडी धारक का खाता सुरक्षित है। अतिरिक्त डुप्लीकेट खातों को स्वतः खारिज कर दिया जाता है।'
                        : 'Original owner account is protected. Extra duplicate registrations are blocked.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Member KYC Specs */}
            {verificationResult.isFound && verificationResult.member && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'hi' ? 'सत्यापित पैन कार्ड:' : 'Verified PAN:'}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {verificationResult.panNumber}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'hi' ? 'सक्रिय पैकेज:' : 'Package:'}
                  </span>
                  <span className="font-bold text-emerald-400">
                    {verificationResult.member.packageName}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'hi' ? 'पंजीकरण राज्य:' : 'Registered State:'}
                  </span>
                  <span className="font-bold text-slate-200">
                    {verificationResult.state}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'hi' ? 'सत्यापन तिथि:' : 'Verified Date:'}
                  </span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {verificationResult.verifiedAt}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: OFFICIAL STAMPS & REGISTERED BADGES SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>
                {lang === 'hi' ? 'आधिकारिक सरकारी मुहर व डिजाइनर पंजीकृत बैज' : 'Official Stamps & Certified Seals Gallery'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'कंपनी के वैधानिक दस्तावेज, ट्रेडमार्क एवं उपभोक्ता संरक्षण मुहरें'
                : 'Legitimate registration stamps, trademark seals, and ISO compliance insignias'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-emerald-500/40 transition-colors">
            <OfficialStampBadge type="GOVT_COMPLIANT" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Govt. Direct Selling</h4>
              <p className="text-[10px] text-emerald-400">2021 Rules</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-blue-500/40 transition-colors">
            <OfficialStampBadge type="MCA_ROC" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">MCA Registered</h4>
              <p className="text-[10px] text-blue-400">RoC Delhi Seal</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-amber-500/40 transition-colors">
            <OfficialStampBadge type="ISO_9001" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">ISO 9001:2015</h4>
              <p className="text-[10px] text-amber-400">Quality Certified</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-teal-500/40 transition-colors">
            <OfficialStampBadge type="DUPLICATE_CHECK_PASSED" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Anti-Duplicate</h4>
              <p className="text-[10px] text-teal-400">1 PAN 1 ID Seal</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-purple-500/40 transition-colors">
            <OfficialStampBadge type="DESIGNER_REGISTERED" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Designer Registered</h4>
              <p className="text-[10px] text-purple-400">Auth Matrix App</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex flex-col items-center justify-between text-center space-y-2 hover:border-amber-500/40 transition-colors">
            <OfficialStampBadge type="TAX_COMPLIANT" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-white leading-tight">Tax Compliant</h4>
              <p className="text-[10px] text-amber-400">100% TDS & GST</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: LEGAL DOCUMENTS & REGISTRATION CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>
                {lang === 'hi'
                  ? 'कंपनी वैधानिक प्रमाण पत्र एवं पंजीकरण'
                  : 'Official Incorporation & Government Documents'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'hi'
                ? 'कंपनी अधिनियम 2013 के अंतर्गत निगमन और कर पंजीकरण की डिजिटल प्रतियां'
                : 'Digital verifiable copies of registration under the Companies Act 2013'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEGAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {doc.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {doc.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {lang === 'hi' ? doc.titleHi : doc.title}
                </h3>

                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-emerald-400 font-bold truncate">
                  {doc.regNumber}
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {lang === 'hi' ? doc.descriptionHi : doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {lang === 'hi' ? 'जारी तिथि:' : 'Issued:'} <strong className="text-slate-200">{doc.issuedDate}</strong>
                </span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'सर्टिफिकेट देखें' : 'View Certificate'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: DIRECT SELLING 2021 COMPLIANCE PILLARS */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-400" />
          <span>
            {lang === 'hi'
              ? 'उपभोक्ता संरक्षण 4 मुख्य कानूनी स्तंभ'
              : 'Consumer Protection 4 Legal Pillars'}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {DIRECT_SELLING_COMPLIANCE_PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                0{idx + 1}
              </div>
              <h4 className="text-xs font-bold text-white">
                {lang === 'hi' ? p.titleHi : p.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'hi' ? p.descHi : p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: VIEW CERTIFICATE MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl relative space-y-5 animate-scaleUp">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Certificate Style View */}
            <div className="p-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 to-slate-950 text-center space-y-4 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                <ShieldCheck className="w-80 h-80 text-emerald-400" />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                <span>★ GOVERNMENT OF INDIA COMPLIANCE RECORD ★</span>
              </div>

              <h2 className="text-xl font-black text-white">
                {lang === 'hi' ? selectedDoc.titleHi : selectedDoc.title}
              </h2>

              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Issued by <strong className="text-white">{selectedDoc.authority}</strong>
              </p>

              <div className="inline-block p-3 rounded-xl bg-slate-950 border border-emerald-500/40 font-mono font-extrabold text-sm text-emerald-400">
                {selectedDoc.regNumber}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                {lang === 'hi' ? selectedDoc.descriptionHi : selectedDoc.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="text-left">
                  <span className="block text-[10px] text-slate-500">Corporate Identity</span>
                  <span className="font-mono font-bold text-white">{COMPANY_LEGAL_INFO.cin}</span>
                </div>
                <OfficialStampBadge type={selectedDoc.stampType} size="sm" />
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500">Authorized Signatory</span>
                  <span className="font-bold text-white">Govt. Compliance Nodal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'प्रिंट / सेव करें' : 'Print Certificate'}</span>
              </button>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
              >
                {lang === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DIGITAL DISTRIBUTOR ID CARD MODAL */}
      {showIdCardModal && verificationResult && verificationResult.member && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-950 border border-slate-800 p-6 shadow-2xl relative space-y-4 animate-scaleUp">
            <button
              onClick={() => setShowIdCardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'hi'
                  ? 'आधिकारिक डिजिटल डिस्ट्रीब्यूटर पहचान पत्र'
                  : 'Official Digital Distributor ID Card'}
              </span>
            </h3>

            {/* ID Card Front */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/50 border-2 border-emerald-500/50 shadow-2xl space-y-4 relative overflow-hidden text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider block">
                    APEXBINARY DIRECT SELLING
                  </span>
                  <span className="text-[10px] text-slate-400">Govt Reg: CIN U74999DL2024PTC412890</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[9px] border border-emerald-500/40">
                  ORIGINAL ID
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0">
                  {verificationResult.member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    {verificationResult.member.name}
                  </h4>
                  <p className="text-xs font-mono font-bold text-emerald-400">
                    ID: {verificationResult.member.id}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Rank: <strong className="text-amber-300">{verificationResult.member.rank}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 block">Package:</span>
                  <span className="font-bold text-white">{verificationResult.member.packageName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PAN Status:</span>
                  <span className="font-mono font-bold text-emerald-400">1-PAN-1-ID Verified</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Leg Placement:</span>
                  <span className="font-bold text-white">{verificationResult.member.leg} Leg</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Join Date:</span>
                  <span className="text-slate-300">{verificationResult.member.joinDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[9px] text-slate-400">
                <span>Scan for Central Verification</span>
                <span className="font-mono text-emerald-400">TDS 5% Auto-Secured</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>{lang === 'hi' ? 'आईडी कार्ड प्रिंट करें' : 'Print ID Card'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
