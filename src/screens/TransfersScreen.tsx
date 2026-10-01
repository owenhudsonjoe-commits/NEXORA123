import React, { useState } from 'react';
import {
  Send,
  Globe,
  Clock,
  Repeat,
  Users,
  Search,
  Plus,
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Lock,
  Ban,
  ChevronRight,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Transaction } from '../types';
import { RESTRICTED_COUNTRIES } from '../data/restrictedCountries';

interface TransfersScreenProps {
  onOpenSend: () => void;
  onOpenSendToRecipient: (name: string, currency: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransfersScreen: React.FC<TransfersScreenProps> = ({
  onOpenSend,
  onOpenSendToRecipient,
  onSelectTransaction,
}) => {
  const {
    recipients,
    transactions,
    scheduledTransfers,
    cancelScheduledTransfer,
    formatMoney,
  } = useBanking();

  const [activeTab, setActiveTab] = useState<'recent' | 'scheduled' | 'recipients'>('recent');
  const [recipientSearch, setRecipientSearch] = useState('');

  const filteredRecipients = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.country.toLowerCase().includes(recipientSearch.toLowerCase()) ||
      r.currency.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  const transferTransactions = transactions.filter(
    (t) => t.type === 'transfer' || t.type === 'expense'
  );

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-bold mb-1 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-black" /> International Payments & Global Wires
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Payments & Transfers
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Instant transfers via Revolut, Payoneer, PayPal, Wise, and SWIFT wires
          </p>
        </div>

        <button
          onClick={onOpenSend}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Initiate New Transfer
        </button>
      </div>

      {/* 2 Configured Corridors Notice */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-black flex items-center gap-2">
              Cross-Border Monitored Corridors
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-mono font-bold">
                2 Active Corridors
              </span>
            </div>
            <p className="text-zinc-600 text-[11px] mt-0.5">
              Available corridors: <strong>Pakistan 🇵🇰 and India 🇮🇳</strong> (2 monitored jurisdictions).
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSend}
          className="shrink-0 text-black hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
        >
          Open Transfer Portal <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Recipient Avatars Carousel */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-black uppercase tracking-wider">
            Quick Pay Contacts
          </h3>
          <span className="text-xs text-zinc-500 font-medium">{recipients.length} saved</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 pt-1">
          {/* New contact trigger */}
          <button
            onClick={onOpenSend}
            className="flex flex-col items-center justify-center shrink-0 w-20 h-24 rounded-2xl border-2 border-dashed border-zinc-200 hover:border-black bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-1.5 border border-zinc-200 shadow-xs">
              <Plus className="w-5 h-5 text-black" />
            </div>
            <span className="text-[11px] font-bold">New</span>
          </button>

          {recipients.map((rec) => (
            <button
              key={rec.id}
              onClick={() => onOpenSendToRecipient(rec.name, rec.currency)}
              className="flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-2xl border border-zinc-200 bg-white hover:border-black p-2 text-center transition-all group cursor-pointer shadow-xs"
            >
              <div className="relative mb-1.5">
                <img
                  src={rec.avatar}
                  alt={rec.name}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 group-hover:border-black transition-colors"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 text-xs">
                  {rec.currency === 'EUR' ? '🇪🇺' : rec.currency === 'GBP' ? '🇬🇧' : '🌐'}
                </span>
              </div>
              <span className="text-xs font-bold text-black truncate max-w-full block leading-tight">
                {rec.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {rec.currency}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 pb-2">
        {[
          { id: 'recent', label: 'Recent Transfer History', icon: Send },
          { id: 'scheduled', label: 'Scheduled Orders', icon: Calendar },
          { id: 'recipients', label: 'Saved Beneficiaries', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: RECENT TRANSFERS */}
      {activeTab === 'recent' && (
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black">Completed Transfers</h3>
            <span className="text-xs text-zinc-500 font-medium">{transferTransactions.length} records</span>
          </div>

          <div className="divide-y divide-zinc-200">
            {transferTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 px-2 flex items-center justify-between hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-black">
                    <Send className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">{tx.recipientMerchant}</div>
                    <div className="text-[11px] text-zinc-500">
                      Ref: <span className="font-mono">{tx.referenceId}</span> •{' '}
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black font-mono text-black">
                    -{formatMoney(tx.amount, tx.currency)}
                  </div>
                  <div className="text-[10px] text-black uppercase font-bold">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SCHEDULED TRANSFERS */}
      {activeTab === 'scheduled' && (
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-black">Automated Standing Orders</h3>
              <p className="text-xs text-zinc-500">Recurring payouts, invoices or multi-currency wires</p>
            </div>
            <button
              onClick={onOpenSend}
              className="text-xs px-3 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold cursor-pointer"
            >
              + Add Schedule
            </button>
          </div>

          <div className="divide-y divide-zinc-200">
            {scheduledTransfers.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500 font-medium">
                No active scheduled transfers.
              </div>
            ) : (
              scheduledTransfers.map((st) => (
                <div
                  key={st.id}
                  className="py-3 px-2 flex items-center justify-between hover:bg-zinc-50 rounded-xl"
                >
                  <div className="text-xs font-bold text-black">{st.recipientName}</div>
                  <div className="text-xs font-mono font-bold text-black">${st.amount}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RECIPIENTS DIRECTORY */}
      {activeTab === 'recipients' && (
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-black">Saved Beneficiary Directory</h3>
            <button
              onClick={onOpenSend}
              className="text-xs px-3 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 font-bold cursor-pointer"
            >
              + New Beneficiary
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecipients.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={rec.avatar}
                    alt={rec.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-black">{rec.name}</h4>
                    <p className="text-[11px] text-zinc-500">{rec.bankName} • {rec.country}</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenSendToRecipient(rec.name, rec.currency)}
                  className="px-3 py-1.5 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold cursor-pointer"
                >
                  Pay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
