import { LegalDocument } from '../types';

export const COMPANY_LEGAL_INFO = {
  name: 'APEX GLOBAL MARKETING & INFOTECH PRIVATE LIMITED',
  nameHi: 'एपेक्स ग्लोबल मार्केटिंग एंड इन्फोटेक प्राइवेट लिमिटेड',
  brandName: 'ApexBinary Matrix',
  cin: 'U74999DL2024PTC412890',
  pan: 'AABCA8921P',
  tan: 'DELA12903E',
  gstin: '07AABCA8921P1Z4',
  roc: 'Registrar of Companies, Delhi & Haryana',
  incorporationDate: '12 January 2024',
  registeredAddress: 'Plot 42, Sector 18, Institutional Area, New Delhi - 110025, India',
  nodalOfficer: 'Adv. Rajeshwar Sharma (Grievance & Nodal Compliance Officer)',
  email: 'compliance@apexbinary.com',
  helpline: '1800-889-2024 (Toll-Free Direct Selling Helpline)',
  isoNumber: 'ISO 9001:2015 / QMS-24-98210',
  dpiitStartupId: 'DIPP-104928',
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'DOC-MCA-01',
    title: 'Certificate of Incorporation (MCA)',
    titleHi: 'निगमन प्रमाण पत्र (कंपनी पंजीयक - भारत सरकार)',
    category: 'REGISTRATION',
    regNumber: 'CIN: U74999DL2024PTC412890',
    authority: 'Ministry of Corporate Affairs, Govt. of India',
    issuedDate: '12 Jan 2024',
    status: 'ACTIVE',
    description:
      'Officially incorporated under the Companies Act, 2013 (18 of 2013) as a private limited entity authorized for Direct Selling & E-commerce Operations.',
    descriptionHi:
      'कंपनी अधिनियम, 2013 के तहत भारत सरकार के कॉर्पोरेट कार्य मंत्रालय द्वारा पंजीकृत वैध प्राइवेट लिमिटेड डायरेक्ट सेलिंग कंपनी।',
    stampType: 'MCA',
    docDate: '2024-01-12',
  },
  {
    id: 'DOC-DS-02',
    title: 'Direct Selling Guidelines 2021 Compliance',
    titleHi: 'उपभोक्ता संरक्षण (प्रत्यक्ष बिक्री) नियम 2021 अनुपालन',
    category: 'COMPLIANCE',
    regNumber: 'DOCA/DS/2024/7712',
    authority: 'Department of Consumer Affairs (MoCA)',
    issuedDate: '18 Feb 2024',
    status: 'VERIFIED',
    description:
      '100% adherence to Consumer Protection (Direct Selling) Rules 2021. Prohibition of Pyramid / Money Circulation Schemes. Genuine product delivery with 30-day return warranty.',
    descriptionHi:
      'भारत सरकार के उपभोक्ता मामले विभाग के दिशा-निर्देशों के पूर्ण अनुपालन में। कोई मनी सर्कुलेशन नहीं, 100% वास्तविक उत्पाद आधारित पारदर्शी बाइनरी मैट्रिक्स।',
    stampType: 'GOVT',
    docDate: '2024-02-18',
  },
  {
    id: 'DOC-ISO-03',
    title: 'ISO 9001:2015 Quality Management System',
    titleHi: 'आईएसओ 9001:2015 अंतरराष्ट्रीय गुणवत्ता प्रमाणन',
    category: 'ISO',
    regNumber: 'ISO/IEC-QMS/9001-2024/IND',
    authority: 'International Accreditation Forum & JAS-ANZ',
    issuedDate: '05 Mar 2024',
    status: 'ACTIVE',
    description:
      'Certified for supreme quality customer support, commission calculation accuracy, secure server infrastructure, and transparent distributor payout management.',
    descriptionHi:
      'वितरक पेआउट सटीकता, ग्राहक सेवा, डेटा सुरक्षा और पारदर्शी कमीशन प्रबंधन के लिए वैश्विक आईएसओ प्रमाण पत्र।',
    stampType: 'ISO',
    docDate: '2024-03-05',
  },
  {
    id: 'DOC-TAX-04',
    title: 'Income Tax Permanent Account Number (PAN)',
    titleHi: 'आयकर विभाग स्थायी खाता संख्या (PAN & TAN)',
    category: 'TAX',
    regNumber: 'PAN: AABCA8921P | TAN: DELA12903E',
    authority: 'Income Tax Department, Govt. of India',
    issuedDate: '15 Jan 2024',
    status: 'VERIFIED',
    description:
      'Section 194H & 194R statutory compliant. 5% TDS mandatory deduction and automated Form 16A generation on all distributor commission payouts.',
    descriptionHi:
      'आयकर धारा 194H के तहत सभी पेआउट पर 5% टीडीएस की नियमित कटौती व पैन कार्ड पर 26AS/फॉर्म 16A क्रेडिट।',
    stampType: 'TAX',
    docDate: '2024-01-15',
  },
  {
    id: 'DOC-GST-05',
    title: 'Goods & Services Tax Registration (GSTIN)',
    titleHi: 'वस्तु एवं सेवा कर पंजीकरण (GSTIN)',
    category: 'TAX',
    regNumber: 'GSTIN: 07AABCA8921P1Z4',
    authority: 'Central Board of Indirect Taxes & Customs',
    issuedDate: '20 Jan 2024',
    status: 'VERIFIED',
    description:
      'Regular GST tax payer with valid e-invoicing and GST-compliant distributor purchase receipts on every product package.',
    descriptionHi:
      'प्रत्येक पैकेज और उत्पाद पर सरकार को 18% जीएसटी भुगतान और आधिकारिक ई-चालान रसीद उपलब्ध।',
    stampType: 'TAX',
    docDate: '2024-01-20',
  },
  {
    id: 'DOC-STARTUP-06',
    title: 'Startup India DPIIT Recognition',
    titleHi: 'स्टार्टअप इंडिया (DPIIT) भारत सरकार मान्यता',
    category: 'COMPLIANCE',
    regNumber: 'DIPP-104928/INNOV/2024',
    authority: 'DPIIT, Ministry of Commerce & Industry',
    issuedDate: '22 Apr 2024',
    status: 'ACTIVE',
    description:
      'Recognized for developing scalable direct sales technology with automated dual-leg smart binary tree placement and de-duplication engines.',
    descriptionHi:
      'आधुनिक बाइनरी ट्री तकनीक व पारदर्शी डिजिटल डायरेक्ट सेलिंग के लिए केंद्र सरकार द्वारा मान्यता प्राप्त।',
    stampType: 'SECURITY',
    docDate: '2024-04-22',
  },
];

export const DIRECT_SELLING_COMPLIANCE_PILLARS = [
  {
    title: 'Mandatory PAN & KYC Verification (Anti-Duplicate)',
    titleHi: '1 पैन - 1 आईडी नियम (डुप्लीकेट आईडी पर पूर्ण प्रतिबंध)',
    desc: 'Strict 1 PAN = 1 Primary Distributor rule. Dual accounts under same PAN are automatically flagged to prevent duplicate fraudulent entries.',
    descHi: 'एक व्यक्ति एक ही पैन कार्ड से केवल 1 प्राथमिक आईडी चला सकता है। किसी भी डुप्लीकेट आईडी को सिस्टम तुरंत रोक देता है।',
    icon: 'ShieldCheck',
  },
  {
    title: '30-Day Cooling-off & Money Back Guarantee',
    titleHi: '30 दिनों की कूलिंग-ऑफ व मनी-बैक गारंटी',
    desc: 'If a newly joined distributor or customer wishes to exit within 30 days of registration, 100% refund of physical package kits is honored.',
    descHi: 'नया सदस्य जॉइनिंग के 30 दिनों के भीतर बिना किसी शर्त पैकेज वापस कर पूरा रिफंड प्राप्त कर सकता है।',
    icon: 'RotateCcw',
  },
  {
    title: 'Genuine Tangible Products & No Entry Fees',
    titleHi: 'वास्तविक उपयोगी उत्पाद (कोई प्रवेश शुल्क नहीं)',
    desc: 'Registration as distributor is free. All BV amounts are strictly backed by physical wellness, health and digital productivity packages.',
    descHi: 'पंजीकरण पूर्णतः निःशुल्क है। बिजनेस वॉल्यूम (BV) केवल वास्तविक फिजिकल वेलनेस और हेल्थ उत्पादों की खरीद पर मिलता है।',
    icon: 'Package',
  },
  {
    title: 'Automated 5% TDS & 5% Admin Deductions',
    titleHi: '100% पारदर्शी 5% टीडीएस व 5% एडमिन कटौती',
    desc: 'Every payout transaction is credited to distributor bank accounts via NEFT/IMPS with statutory government tax receipts.',
    descHi: 'कमीशन से भारत सरकार का 5% टीडीएस कटकर सीधे पैन कार्ड से जुड़े 26AS खाते में जमा होता है।',
    icon: 'FileCheck',
  },
];

// Mock PAN/Aadhaar Registry for Duplicate Checking
export const REGISTERED_PANS: Record<string, { memberId: string; name: string; pan: string; state: string; isOriginal: boolean }> = {
  'ABCDE1234F': {
    memberId: 'MLM-1001',
    name: 'Rajesh Sharma',
    pan: 'ABCDE1234F',
    state: 'Delhi (NCT)',
    isOriginal: true,
  },
  'BKLPK5678Q': {
    memberId: 'MLM-1002',
    name: 'Sunita Verma',
    pan: 'BKLPK5678Q',
    state: 'Maharashtra (Mumbai)',
    isOriginal: true,
  },
  'CWPMN9012R': {
    memberId: 'MLM-1003',
    name: 'Amit Patel',
    pan: 'CWPMN9012R',
    state: 'Gujarat (Ahmedabad)',
    isOriginal: true,
  },
  'DLKPS3456T': {
    memberId: 'MLM-1004',
    name: 'Pooja Singh',
    pan: 'DLKPS3456T',
    state: 'Uttar Pradesh (Lucknow)',
    isOriginal: true,
  },
  'ERQWZ7890U': {
    memberId: 'MLM-1005',
    name: 'Vikram Malhotra',
    pan: 'ERQWZ7890U',
    state: 'Punjab (Chandigarh)',
    isOriginal: true,
  },
  'FSTVN2345V': {
    memberId: 'MLM-1006',
    name: 'Neha Gupta',
    pan: 'FSTVN2345V',
    state: 'Rajasthan (Jaipur)',
    isOriginal: true,
  },
  'GHYKL6789W': {
    memberId: 'MLM-1007',
    name: 'Rahul Joshi',
    pan: 'GHYKL6789W',
    state: 'Madhya Pradesh (Indore)',
    isOriginal: true,
  },
};
