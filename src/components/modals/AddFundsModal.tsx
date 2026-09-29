import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PlusCircle, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../../data/currencies';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCurrency?: string;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  defaultCurrency = 'USD',
}) => {
  const { addDemoFunds, wallets, formatMoney } = useBanking();
  const [currency, setCurrency] = useState(defaultCurrency);
  const [amount, setAmount] = useState<number>(1000);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0) {
      addDemoFunds(currency, amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 text-black"
        >
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-base">Deposit Funds</h3>
                <p className="text-xs text-zinc-500">Instant balance top-up</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleDeposit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Target Wallet</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold text-black focus:outline-none focus:border-black cursor-pointer"
              >
                {GLOBAL_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Amount to Add</label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-4 pr-16 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xl font-bold font-mono text-black focus:outline-none focus:border-black"
                />
                <span className="absolute right-3.5 top-3 text-xs font-bold text-black font-mono">
                  {currency}
                </span>
              </div>
            </div>

            {/* Quick chips */}
            <div className="grid grid-cols-4 gap-2">
              {[250, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-black border-black text-white'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-200'
                  }`}
                >
                  +{val}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>Instant Bank Transfer & Card Settlement Guaranteed</span>
            </div>

            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              {isSuccess ? 'Funds Credited Successfully!' : 'Confirm Deposit'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
