import React, { useState } from 'react';
import {
  PiggyBank,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Target,
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  TrendingUp,
  X,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { SavingsVault } from '../types';

export const SavingsScreen: React.FC = () => {
  const {
    savingsVaults,
    addSavingsVault,
    depositToVault,
    withdrawFromVault,
    totalSavingsUSD,
    formatMoney,
  } = useBanking();

  const [selectedVault, setSelectedVault] = useState<SavingsVault | null>(null);
  const [modalAction, setModalAction] = useState<'deposit' | 'withdraw' | 'create' | null>(null);
  const [amount, setAmount] = useState<number>(250);

  // New Vault Form states
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState<number>(5000);
  const [newTargetDate, setNewTargetDate] = useState('2027-01-01');
  const [newCategory, setNewCategory] = useState('Personal');

  const handleCreateVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newTarget > 0) {
      addSavingsVault({
        title: newTitle,
        targetAmount: newTarget,
        currency: 'USD',
        targetDate: newTargetDate,
        category: newCategory,
      });
      setModalAction(null);
      setNewTitle('');
    }
  };

  const handleDepositOrWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVault && amount > 0) {
      if (modalAction === 'deposit') {
        depositToVault(selectedVault.id, amount);
      } else if (modalAction === 'withdraw') {
        withdrawFromVault(selectedVault.id, amount);
      }
      setModalAction(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <PiggyBank className="w-4 h-4 text-black" /> Goal-Oriented Wealth Accumulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Savings Vaults & Goals
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Lock capital into high-yield vaults with automated round-ups and visual targets
          </p>
        </div>

        <button
          onClick={() => setModalAction('create')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Vault
        </button>
      </div>

      {/* Savings Summary Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Total Vaulted Balance
          </span>
          <div className="text-3xl font-extrabold font-mono text-black mt-1">
            {formatMoney(totalSavingsUSD, 'USD')}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Earning 4.85% APY compound daily yield
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
            <span className="text-zinc-500 block">Active Goals</span>
            <span className="text-base font-bold text-black font-mono">
              {savingsVaults.length} Vaults
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
            <span className="text-zinc-500 block">Est. Annual Yield</span>
            <span className="text-base font-bold text-black font-mono">
              +${(totalSavingsUSD * 0.0485).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {savingsVaults.map((vault) => {
          const progress = Math.min(
            100,
            Math.round((vault.currentAmount / vault.targetAmount) * 100)
          );

          return (
            <div
              key={vault.id}
              className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 hover:border-zinc-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold border border-zinc-200">
                    {vault.category}
                  </span>
                  <span className="text-xs text-black font-mono font-bold">
                    {progress}%
                  </span>
                </div>

                <h3 className="font-bold text-black text-base">{vault.title}</h3>
                <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Target: {vault.targetDate}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-black">
                      {formatMoney(vault.currentAmount, vault.currency)}
                    </span>
                    <span className="text-zinc-500">
                      of {formatMoney(vault.targetAmount, vault.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => {
                    setSelectedVault(vault);
                    setModalAction('deposit');
                  }}
                  className="py-2 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
                </button>
                <button
                  onClick={() => {
                    setSelectedVault(vault);
                    setModalAction('withdraw');
                  }}
                  className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700" /> Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Deposit / Withdraw */}
      {(modalAction === 'deposit' || modalAction === 'withdraw') && selectedVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-zinc-200 p-6 text-black shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-black text-base capitalize">
                {modalAction} {modalAction === 'deposit' ? 'to' : 'from'} Vault
              </h3>
              <button
                onClick={() => setModalAction(null)}
                className="p-1 rounded-lg bg-zinc-100 text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-zinc-600">
              Vault: <strong className="text-black">{selectedVault.title}</strong>
              <br />
              Current Balance: {formatMoney(selectedVault.currentAmount, selectedVault.currency)}
            </div>

            <form onSubmit={handleDepositOrWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Amount</label>
                <input
                  type="number"
                  min="10"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-lg font-bold font-mono text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalAction(null)}
                  className="w-1/2 py-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-medium hover:bg-zinc-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs cursor-pointer shadow-sm"
                >
                  Confirm {modalAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Vault */}
      {modalAction === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 p-6 text-black shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <h3 className="font-bold text-black text-base">Create New Savings Vault</h3>
              <button
                onClick={() => setModalAction(null)}
                className="p-1 rounded-lg bg-zinc-100 text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVault} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Goal Name / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dream House Fund"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Travel">Travel</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Investment">Investment</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm shadow-sm cursor-pointer"
              >
                Create Goal Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
