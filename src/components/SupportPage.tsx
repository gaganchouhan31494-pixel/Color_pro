import React, { useState } from 'react';
import {
  Headphones,
  Send,
  MessageCircle,
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { sound } from '../utils/sound';

interface SupportPageProps {
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const SupportPage: React.FC<SupportPageProps> = ({ language }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text:
        language === 'hi'
          ? 'नमस्ते! 24/7 कस्टमर सपोर्ट में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?'
          : 'Hello! Welcome to 24/7 VIP Customer Support. How may I assist you today?',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');
    sound.playClick();

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      sound.playChip();

      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('deposit') || lower.includes('डिपॉजिट') || lower.includes('पैसा') || lower.includes('fund')) {
        reply =
          language === 'hi'
            ? 'डिपॉजिट पेज पर जाएं, राशि चुनें और UPI/QR कोड से भुगतान करें। फंड 30 सेकंड में स्वतः क्रेडिट हो जाता है।'
            : 'Navigate to Deposit tab, choose an amount and pay via UPI/QR code. Funds credit instantly within 30 seconds!';
      } else if (lower.includes('withdraw') || lower.includes('निकासी') || lower.includes('बैंक')) {
        reply =
          language === 'hi'
            ? 'निकासी 24/7 खुली है! विड्रॉ पेज पर जाएं, अपना बैंक या UPI दर्ज करें और राशि सबमिट करें। 0% शुल्क है।'
            : 'Withdrawals are 24/7 instant! Bind your Bank or UPI in Withdraw page and submit. There is 0% processing fee.';
      } else if (lower.includes('refer') || lower.includes('कमीशन') || lower.includes('दोस्त')) {
        reply =
          language === 'hi'
            ? 'रेफर पेज पर आपका विशेष इनवाइट कोड उपलब्ध है। दोस्तों को आमंत्रित करने पर आपको 3 स्तरों में 0.6% कमीशन मिलता है।'
            : 'Check the Refer & Earn tab for your unique invite code. Earn up to 0.6% 3-tier commission on friend turnovers.';
      } else {
        reply =
          language === 'hi'
            ? 'धन्यवाद! आपकी समस्या हमारे कस्टमर मैनेजर को प्रेषित कर दी गई है। हमारा सपोर्ट 24 घंटे सक्रिय है।'
            : 'Thank you! Your query has been logged with our senior support manager. We are available 24/7.';
      }

      const agentMsg: ChatMessage = {
        id: 'agt-' + Date.now(),
        sender: 'agent',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 1000);
  };

  const FAQS = [
    {
      q: language === 'hi' ? 'कलर प्रेडिक्शन गेम कैसे खेलें?' : 'How does Color Prediction work?',
      a:
        language === 'hi'
          ? 'हर राउंड 30 सेकंड, 1 मिनट या 3 मिनट का होता है। आप हरा (Green), लाल (Red), बैंगनी (Violet), 0 से 9 नंबर या Big/Small चुनकर दांव लगा सकते हैं। परिणाम क्रिप्टोग्राफिक हैश द्वारा निर्धारित होता है।'
          : 'Rounds run on 30s, 1m, or 3m intervals. You predict Green, Red, Violet, Numbers 0-9, or Big/Small. Winning multipliers range from 1.5x up to 9x.',
    },
    {
      q: language === 'hi' ? 'जमा और निकासी का समय कितना है?' : 'What are deposit and withdrawal processing times?',
      a:
        language === 'hi'
          ? 'डिपॉजिट तुरंत क्रेडिट होता है। निकासी 24 घंटे IMPS और UPI के माध्यम से तत्काल प्रोसेस की जाती है।'
          : 'Deposits are credited immediately. Withdrawals are processed 24/7 via instant IMPS and UPI transfers.',
    },
    {
      q: language === 'hi' ? 'क्या गेम फेयर और निष्पक्ष है?' : 'Is the game provably fair and certified?',
      a:
        language === 'hi'
          ? 'हाँ, हर राउंड का नतीजा SHA-256 क्रिप्टोग्राफिक हैश और सर्वर सीड द्वारा उत्पन्न होता है, जिसमें किसी भी प्रकार की छेड़छाड़ संभव नहीं है।'
          : 'Yes! Every round outcome is secured via deterministic SHA-256 cryptographic hashes and transparent seeds.',
    },
  ];

  return (
    <div id="page-support" className="space-y-5 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 border border-teal-500/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400 mb-1">
              <Headphones className="w-4 h-4" />
              <span>{language === 'hi' ? '24/7 कनेक्ट व कस्टमर सर्विस' : '24/7 Connect & Support'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {language === 'hi' ? 'हम आपकी सहायता के लिए सदैव तत्पर हैं' : 'We are Here to Assist You 24/7'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {language === 'hi'
                ? 'लाइव चैट, आधिकारिक टेलीग्राम चैनल और प्राथमिकता सहायता'
                : 'Connect via Live Chat, Official Telegram Channel, or VIP Desk'}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-teal-500/20 px-3.5 py-2 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-300">Live Support Online</span>
          </div>
        </div>
      </div>

      {/* Official Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Telegram */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              ✈️
            </div>
            <div>
              <div className="text-xs font-bold text-white">Telegram VIP Channel</div>
              <div className="text-[11px] text-slate-400">84,500+ Members</div>
            </div>
          </div>
          <button
            onClick={() => sound.playClick()}
            className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 text-xs font-bold hover:bg-sky-500/30 flex items-center gap-1"
          >
            <span>Join</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* WhatsApp */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              💬
            </div>
            <div>
              <div className="text-xs font-bold text-white">WhatsApp VIP Help</div>
              <div className="text-[11px] text-slate-400">Instant Response</div>
            </div>
          </div>
          <button
            onClick={() => sound.playClick()}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 flex items-center gap-1"
          >
            <span>Chat</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Email */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Email Support</div>
              <div className="text-[11px] text-slate-400">support@colorpred.vip</div>
            </div>
          </div>
          <button
            onClick={() => sound.playClick()}
            className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold hover:bg-purple-500/30"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Interactive 24/7 Live Chat Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">VIP Automated AI Assistant</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online & Ready
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Response Time: &lt; 2s</span>
        </div>

        {/* Message Feed */}
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div>{m.text}</div>
                <div className="text-[9px] text-slate-400 mt-1 text-right">{m.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न टाइप करें (उदा. डिपॉजिट, विड्रॉ, रेफर)...'
                : 'Type your question here (e.g. deposit, withdraw, refer)...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-white">
          {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-slate-900/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-teal-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                {isOpen && (
                  <div className="p-3.5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
