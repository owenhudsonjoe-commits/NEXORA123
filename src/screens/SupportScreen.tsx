import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

export const SupportScreen: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [messages, setMessages] = useState<
    { id: string; sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello Ayesha! I am your NEXORA Banking Concierge. How can I assist you with your multi-currency wallets, Pakistani payment rails, security locks, or transfers today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const newMsg = {
      id: Date.now().toString(),
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let botReply =
        "Thank you for contacting NEXORA Client Support. Your account is fully protected under multi-tiered security protocols.";

      const lower = userText.toLowerCase();
      if (lower.includes('transfer') || lower.includes('send') || lower.includes('remittance') || lower.includes('pay')) {
        botReply =
          'Outward transfers and remittances are fully operational. You can send funds globally and directly to Pakistani wallets (Easypaisa, JazzCash, UPaisa, SadaPay) or Pakistani banks with instant delivery and zero fees.';
      } else if (lower.includes('card') || lower.includes('freeze') || lower.includes('pin')) {
        botReply =
          'You can manage and freeze your virtual and physical cards, set spending limits, or update your security PIN directly from the Cards tab.';
      } else if (lower.includes('exchange') || lower.includes('rate') || lower.includes('pkr') || lower.includes('fee')) {
        botReply =
          'NEXORA provides institutional interbank mid-market exchange rates with 0% markup for Platinum accounts across USD, PKR, EUR, GBP, AED, and 30+ currencies.';
      } else if (lower.includes('pakistan') || lower.includes('easypaisa') || lower.includes('jazzcash') || lower.includes('nayapay')) {
        botReply =
          'NEXORA directly supports Pakistan local wallets including Easypaisa, JazzCash, SadaPay, NayaPay, UPaisa, and all 1Link banking institutions in PKR.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <LifeBuoy className="w-4 h-4 text-black" /> 24/7 Client Advisory & Assistance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Support Center & AI Concierge
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Instant AI concierge guidance, comprehensive FAQs, and compliance documentation
          </p>
        </div>
      </div>

      {/* 2-Column: Interactive AI Concierge Chat + FAQ Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Simulated AI Chat (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-sm">AI Concierge</h3>
                <span className="flex items-center gap-1 text-[11px] text-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                  Online • Verified Support Officer
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 text-black flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-black text-white font-medium rounded-tr-xs'
                      : 'bg-zinc-100 text-zinc-900 border border-zinc-200 rounded-tl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 ${
                      m.sender === 'user' ? 'text-zinc-300 text-right' : 'text-zinc-500'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-xs text-zinc-500 flex items-center gap-2 italic">
                <Bot className="w-4 h-4 text-black animate-spin" />
                Concierge is typing response...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-zinc-100">
            <input
              type="text"
              placeholder="Ask anything about wallets, FX rates, or cards..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* FAQ Accordion & Direct Channels (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <h3 className="font-bold text-black text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-black" />
              Frequently Asked Questions
            </h3>

            <div className="divide-y divide-zinc-100">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.q} className="py-3">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left text-xs font-bold text-black hover:text-zinc-700 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-black shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-xs text-zinc-700 mt-2 leading-relaxed pl-2 border-l-2 border-black">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Contact Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1 text-xs">
              <div className="flex items-center gap-2 text-black font-bold">
                <Mail className="w-4 h-4" /> Email Support
              </div>
              <p className="text-[11px] text-zinc-600">concierge@bankportal.com</p>
              <span className="text-[10px] text-zinc-400">Response &lt; 15 mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-1 text-xs">
              <div className="flex items-center gap-2 text-black font-bold">
                <Phone className="w-4 h-4" /> Global Hotline
              </div>
              <p className="text-[11px] text-zinc-600">+1 (800) 555-0199</p>
              <span className="text-[10px] text-zinc-400">24/7 Priority Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
