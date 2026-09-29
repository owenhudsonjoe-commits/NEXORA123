import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Send,
  Trash2,
  Globe,
  Sparkles,
  Building,
  Mail,
  CheckCircle2,
  X,
  AlertTriangle,
  Ban,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../data/currencies';
import { isCountryRestricted } from '../data/restrictedCountries';
import { Recipient } from '../types';

interface RecipientsScreenProps {
  onOpenSendToRecipient: (name: string, currency: string) => void;
}

export const RecipientsScreen: React.FC<RecipientsScreenProps> = ({
  onOpenSendToRecipient,
}) => {
  const { recipients, addRecipient, removeRecipient } = useBanking();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [restrictionError, setRestrictionError] = useState<string | null>(null);

  // New Recipient State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('Deutsche Bank AG');
  const [country, setCountry] = useState('Germany');
  const [currency, setCurrency] = useState('EUR');

  const filtered = recipients.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.country.toLowerCase().includes(search.toLowerCase()) ||
      r.currency.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && account) {
      addRecipient({
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@banking.net`,
        accountIdentifier: account,
        bankName: bank,
        country,
        currency,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      });
      setIsAddModalOpen(false);
      setName('');
      setAccount('');
    }
  };

  const handleInitiateSend = (recipientName: string, recipientCountry: string, recipientCurrency: string) => {
    if (isCountryRestricted(recipientCountry)) {
      setRestrictionError(
        `Corridor Restricted: Payments to ${recipientCountry} are currently unavailable under cross-border banking restrictions (7 restricted countries: Pakistan, India, China, Japan, Malaysia, Indonesia, and Brazil).`
      );
      return;
    }
    setRestrictionError(null);
    onOpenSendToRecipient(recipientName, recipientCurrency);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <Users className="w-4 h-4 text-black" /> Global Beneficiary Address Book
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Saved Recipients
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Manage verified contacts for 1-click international bank and wallet transfers
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Beneficiary
        </button>
      </div>

      {/* Restriction Alert Toast */}
      {restrictionError && (
        <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Ban className="w-5 h-5 text-black shrink-0" />
            <span>{restrictionError}</span>
          </div>
          <button
            onClick={() => setRestrictionError(null)}
            className="text-zinc-500 hover:text-black font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
        <input
          type="text"
          placeholder="Search by name, country, or currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
        />
      </div>

      {/* Recipients Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((rec) => {
          const restricted = isCountryRestricted(rec.country);
          return (
            <div
              key={rec.id}
              className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.avatar}
                      alt={rec.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-200 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-black text-sm">{rec.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-zinc-700" /> {rec.country}
                        {restricted && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-800 ml-1">
                            Restricted
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-black">
                    {rec.currency}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
                  <div className="text-[11px] text-zinc-500">
                    Bank: <strong className="text-black">{rec.bankName}</strong>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-700 truncate">
                    {rec.accountIdentifier}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => handleInitiateSend(rec.name, rec.country, rec.currency)}
                  className={`w-4/5 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                    restricted
                      ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                      : 'bg-black hover:bg-zinc-800 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> {restricted ? 'Unavailable' : 'Send Money'}
                </button>
                <button
                  onClick={() => removeRecipient(rec.id)}
                  className="w-1/5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black border border-zinc-200 flex items-center justify-center transition-colors cursor-pointer"
                  title="Remove beneficiary"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 p-6 text-black shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-black text-base">Add Beneficiary Contact</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Full Name / Legal Entity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carlos Santana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spain"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black cursor-pointer"
                  >
                    {GLOBAL_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Santander Bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ES91-4401-2901-4491"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono text-black focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm shadow-sm cursor-pointer"
              >
                Save Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
