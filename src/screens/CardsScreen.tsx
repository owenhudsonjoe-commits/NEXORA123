import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sliders,
  Shield,
  Globe,
  Wifi,
  ShoppingBag,
  Sparkles,
  Key,
  Copy,
  ChevronRight,
  TrendingUp,
  PieChart as PieChartIcon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { CardStyle, PaymentCard, Transaction } from '../types';
import { SPENDING_BY_CATEGORY_DATA } from '../data/mockData';

interface CardsScreenProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const CardsScreen: React.FC<CardsScreenProps> = ({ onSelectTransaction }) => {
  const {
    cards,
    toggleCardFreeze,
    updateCardSettings,
    updateCardPin,
    setCardStyle,
    formatMoney,
    transactions,
  } = useBanking();

  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [showCvv, setShowCvv] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('7890');
  const [isPinChanged, setIsPinChanged] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const cardTransactions = transactions.filter((t) => t.isCardTransaction);

  const cardStylesMap: Record<CardStyle, { bg: string; text: string; border: string; label: string }> = {
    black: {
      bg: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)',
      text: 'text-zinc-100',
      border: 'border-zinc-700',
      label: 'Obsidian Black',
    },
    metallic: {
      bg: 'linear-gradient(135deg, #27272A 0%, #18181B 100%)',
      text: 'text-zinc-100',
      border: 'border-zinc-600/50',
      label: 'Titanium Metallic',
    },
    gradient: {
      bg: 'linear-gradient(135deg, #4338CA 0%, #312E81 50%, #1E1B4B 100%)',
      text: 'text-white',
      border: 'border-indigo-400/40',
      label: 'Indigo Aurora',
    },
    'minimal-white': {
      bg: 'linear-gradient(135deg, #F4F4F5 0%, #E4E4E7 100%)',
      text: 'text-zinc-900',
      border: 'border-zinc-300',
      label: 'Minimal White',
    },
  };

  const currentStyleConfig = selectedCard
    ? cardStylesMap[selectedCard.style]
    : cardStylesMap.black;

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(selectedCard.cardNumberMasked);
    alert('Masked card number copied to clipboard!');
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCard) {
      updateCardPin(selectedCard.id, newPin);
      setIsPinChanged(true);
      setTimeout(() => {
        setIsPinChanged(false);
        setShowPinModal(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-black" /> Smart Payment Cards
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Virtual & Physical Cards
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Instant freeze, customized aesthetics, contactless simulation, and security controls
          </p>
        </div>

        {/* Card Selector Pills */}
        <div className="flex gap-2">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCardId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedCard.id === c.id
                  ? 'bg-black border-black text-white shadow-xs'
                  : 'bg-white border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-50'
              }`}
            >
              {c.type === 'virtual' ? '⚡ Virtual' : '💳 Physical'} ({c.cardNumberMasked.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column: Card Visual & Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: 3D-styled animated Card & Theme picker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* THE CARD */}
          <motion.div
            key={`${selectedCard.id}-${selectedCard.style}`}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`relative aspect-[1.586/1] w-full rounded-2xl p-6 shadow-xl flex flex-col justify-between overflow-hidden border ${
              currentStyleConfig.border
            } ${selectedCard.isFrozen ? 'grayscale opacity-75' : ''}`}
            style={{ background: currentStyleConfig.bg }}
          >
            {/* Hologram shine simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-40 pointer-events-none" />

            {/* Frozen Overlay */}
            {selectedCard.isFrozen && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-rose-400 z-20 font-bold text-sm">
                <Lock className="w-8 h-8 mb-1 animate-bounce" />
                CARD TEMPORARILY FROZEN
              </div>
            )}

            {/* Card Header */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm font-extrabold tracking-wider ${currentStyleConfig.text}`}>
                  NEXORA
                </span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold border ${
                    selectedCard.style === 'minimal-white'
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {selectedCard.type}
                </span>
              </div>
              <Wifi className={`w-5 h-5 ${currentStyleConfig.text} opacity-80`} />
            </div>

            {/* EMV Chip placeholder */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-xs my-2 flex items-center justify-center opacity-90">
              <div className="w-4/5 h-4/5 border border-amber-700/40 rounded-xs" />
            </div>

            {/* Card Number */}
            <div className="z-10 flex items-center justify-between">
              <span className={`font-mono text-lg sm:text-xl font-bold tracking-widest ${currentStyleConfig.text}`}>
                {selectedCard.cardNumberMasked}
              </span>
              <button
                onClick={handleCopyCard}
                className="opacity-70 hover:opacity-100 p-1 text-zinc-300 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            {/* Card Footer Details */}
            <div className="flex items-end justify-between z-10 text-xs">
              <div>
                <span className={`text-[9px] uppercase tracking-wider block opacity-70 ${currentStyleConfig.text}`}>
                  Cardholder Name
                </span>
                <span className={`font-semibold font-mono tracking-wide ${currentStyleConfig.text}`}>
                  {selectedCard.holderName}
                </span>
              </div>

              <div>
                <span className={`text-[9px] uppercase tracking-wider block opacity-70 ${currentStyleConfig.text}`}>
                  Expires
                </span>
                <span className={`font-mono font-semibold ${currentStyleConfig.text}`}>
                  {selectedCard.expiryDate}
                </span>
              </div>

              <div>
                <span className={`text-[9px] uppercase tracking-wider block opacity-70 ${currentStyleConfig.text}`}>
                  CVV
                </span>
                <span className={`font-mono font-semibold ${currentStyleConfig.text}`}>
                  {showCvv ? selectedCard.cvv : '•••'}
                </span>
              </div>

              {/* Card Brand */}
              <div className={`font-bold italic text-sm tracking-wider ${currentStyleConfig.text}`}>
                {selectedCard.cardNetwork}
              </div>
            </div>
          </motion.div>

          {/* Quick Reveal / Freeze Toolbar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setShowCvv(!showCvv)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium transition-colors cursor-pointer shadow-xs"
            >
              {showCvv ? <EyeOff className="w-4 h-4 text-black" /> : <Eye className="w-4 h-4 text-black" />}
              {showCvv ? 'Hide CVV' : 'Reveal CVV'}
            </button>

            <button
              onClick={() => toggleCardFreeze(selectedCard.id)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
                selectedCard.isFrozen
                  ? 'bg-black hover:bg-zinc-800 text-white border-black'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-black border-zinc-300'
              }`}
            >
              {selectedCard.isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {selectedCard.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}
            </button>
          </div>

          {/* Card Design Customizer */}
          <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black uppercase tracking-wider">
                Card Finishes
              </span>
              <span className="text-zinc-600 font-mono">{currentStyleConfig.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['black', 'metallic', 'gradient', 'minimal-white'] as CardStyle[]).map((st) => (
                <button
                  key={st}
                  onClick={() => setCardStyle(selectedCard.id, st)}
                  className={`h-10 rounded-xl border transition-all cursor-pointer ${
                    selectedCard.style === st
                      ? 'ring-2 ring-black ring-offset-2 ring-offset-white border-black'
                      : 'border-zinc-300 opacity-70 hover:opacity-100'
                  }`}
                  style={{ background: cardStylesMap[st].bg }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Security Controls, PIN manager, Spending limits (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Spending Limit Slider */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-black">Monthly Spending Limit</h3>
                <p className="text-xs text-zinc-600">
                  Current spent: {formatMoney(selectedCard.currentSpent, selectedCard.currency)}
                </p>
              </div>
              <span className="text-base font-extrabold font-mono text-black">
                {formatMoney(selectedCard.spendingLimit, selectedCard.currency)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={selectedCard.spendingLimit}
              onChange={(e) =>
                updateCardSettings(selectedCard.id, {
                  spendingLimit: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
            />

            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>$1,000</span>
              <span>$10,000</span>
              <span>$20,000</span>
            </div>
          </div>

          {/* Toggle Security Controls Grid */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-black">Security & Channel Controls</h3>

            <div className="divide-y divide-zinc-100">
              {/* Online Payments */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-100 text-black">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Online Transactions</div>
                    <div className="text-[11px] text-zinc-500">E-commerce and online recurring charges</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.onlinePaymentsEnabled}
                  onChange={(e) =>
                    updateCardSettings(selectedCard.id, {
                      onlinePaymentsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded bg-white border-zinc-300 text-black focus:ring-0 cursor-pointer accent-black"
                />
              </div>

              {/* International Payments */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-100 text-black">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">International Payments</div>
                    <div className="text-[11px] text-zinc-500">Cross-border and foreign currency charges</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.internationalPaymentsEnabled}
                  onChange={(e) =>
                    updateCardSettings(selectedCard.id, {
                      internationalPaymentsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded bg-white border-zinc-300 text-black focus:ring-0 cursor-pointer accent-black"
                />
              </div>

              {/* Contactless */}
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-zinc-100 text-black">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-black">Contactless (NFC) Tap</div>
                    <div className="text-[11px] text-zinc-500">Apple Pay, Google Pay & Physical NFC tap</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedCard.contactlessEnabled}
                  onChange={(e) =>
                    updateCardSettings(selectedCard.id, {
                      contactlessEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded bg-white border-zinc-300 text-black focus:ring-0 cursor-pointer accent-black"
                />
              </div>
            </div>

            {/* PIN Manager Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowPinModal(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Key className="w-4 h-4 text-black" />
                Manage Card PIN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Spending Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Transactions */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black">Recent Card Transactions</h3>
            <span className="text-xs text-zinc-500 font-mono">•••• {selectedCard.cardNumberMasked.slice(-4)}</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {cardTransactions.slice(0, 4).map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 flex items-center justify-between hover:bg-zinc-50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-100 text-black">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">{tx.recipientMerchant}</div>
                    <div className="text-[11px] text-zinc-500">
                      {new Date(tx.timestamp).toLocaleDateString()} • {tx.category}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold font-mono text-black">
                  -{formatMoney(tx.amount, tx.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-black">Card Spending by Category</h3>

          <div className="space-y-3">
            {SPENDING_BY_CATEGORY_DATA.slice(0, 4).map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-600">{item.name}</span>
                  <span className="font-bold font-mono text-black">
                    {formatMoney(item.value, 'USD')}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.value / 1200) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-zinc-200 p-6 text-black shadow-2xl space-y-4">
            <h3 className="font-bold text-black text-base">Card Security PIN</h3>
            <p className="text-xs text-zinc-600">
              Set or view the 4-digit PIN for physical ATM and point-of-sale terminals.
            </p>

            <form onSubmit={handleSavePin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-2xl font-mono tracking-widest text-black focus:outline-none focus:border-black"
                />
              </div>

              {isPinChanged && (
                <div className="text-xs text-emerald-600 text-center font-semibold">
                  PIN updated successfully!
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs cursor-pointer"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
