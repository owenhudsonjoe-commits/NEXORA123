import React, { useState } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Budget } from '../types';

export const BudgetingScreen: React.FC = () => {
  const { budgets, updateBudgetLimit, formatMoney } = useBanking();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [limitInput, setLimitInput] = useState<number>(1000);

  const totalBudget = budgets.reduce((acc, b) => acc + b.allocatedLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.currentSpent, 0);
  const overallPercentage = Math.round((totalSpent / totalBudget) * 100);

  const handleSave = (id: string) => {
    updateBudgetLimit(id, limitInput);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <PieChart className="w-4 h-4 text-black" /> Smart Budgeting & Guardrails
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Category Budgets
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Set intelligent category thresholds with automated overspend alerts
          </p>
        </div>
      </div>

      {/* Overall Progress Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Total Monthly Budget Utilization
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-black mt-1">
              {formatMoney(totalSpent, 'USD')}{' '}
              <span className="text-sm font-normal text-zinc-500 font-sans">
                / {formatMoney(totalBudget, 'USD')}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-sm font-bold font-mono px-3 py-1 rounded-full ${
                overallPercentage > 85
                  ? 'bg-zinc-100 text-black border border-zinc-300'
                  : 'bg-zinc-100 text-black border border-zinc-200'
              }`}
            >
              {overallPercentage}% Used
            </span>
          </div>
        </div>

        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 bg-black"
            style={{ width: `${Math.min(100, overallPercentage)}%` }}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const pct = Math.round((b.currentSpent / b.allocatedLimit) * 100);
          const isOver = b.currentSpent > b.allocatedLimit;

          return (
            <div
              key={b.id}
              className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                    <h3 className="font-bold text-black text-base">{b.category}</h3>
                  </div>
                  {isOver ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-300">
                      <AlertTriangle className="w-3 h-3 text-black" /> Over Budget
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-zinc-600">
                      {pct}%
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: isOver ? '#18181B' : b.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-bold text-black">
                      {formatMoney(b.currentSpent, b.currency)}
                    </span>
                    <span className="text-zinc-500">
                      Limit: {formatMoney(b.allocatedLimit, b.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Limit */}
              <div className="pt-2 border-t border-zinc-100">
                {editingId === b.id ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={limitInput}
                      onChange={(e) => setLimitInput(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-mono text-black focus:outline-none focus:border-black"
                    />
                    <button
                      onClick={() => handleSave(b.id)}
                      className="px-3 py-1 bg-black hover:bg-zinc-800 text-white font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(b.id);
                      setLimitInput(b.allocatedLimit);
                    }}
                    className="w-full py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Adjust Budget Limit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
