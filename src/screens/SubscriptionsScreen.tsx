import React from 'react';
import {
  Receipt,
  PauseCircle,
  PlayCircle,
  XCircle,
  Calendar,
  CreditCard,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const SubscriptionsScreen: React.FC = () => {
  const { subscriptions, toggleSubscriptionPause, cancelSubscription, formatMoney } =
    useBanking();

  const totalMonthly = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <Receipt className="w-4 h-4 text-black" /> Recurring Expense Tracker
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Subscriptions & Recurring Bills
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Monitor SaaS, entertainment, and recurring merchant commitments in one dashboard
          </p>
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Total Monthly Recurring Commitments
          </span>
          <div className="text-3xl font-extrabold font-mono text-black mt-1">
            {formatMoney(totalMonthly, 'USD')}
            <span className="text-xs text-zinc-500 font-normal font-sans ml-1">/ month</span>
          </div>
          <p className="text-xs text-zinc-700 mt-1">
            {subscriptions.filter((s) => s.status === 'active').length} active services billed
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
          <div className="font-semibold text-black mb-0.5">Automated Cancellation Simulator</div>
          <p className="text-zinc-500 text-[11px]">
            Instantly pause or simulate merchant revocation without leaving the app.
          </p>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const isActive = sub.status === 'active';
          const isPaused = sub.status === 'paused';
          const isCancelled = sub.status === 'cancelled';

          return (
            <div
              key={sub.id}
              className={`p-5 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${
                isCancelled
                  ? 'bg-zinc-50 border-zinc-200 opacity-60'
                  : isPaused
                  ? 'bg-white border-zinc-300'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={sub.logo}
                      alt={sub.name}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-bold text-black text-sm">{sub.name}</h4>
                      <span className="text-[11px] text-zinc-500">{sub.category}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-zinc-100 text-black border border-zinc-300'
                        : isPaused
                        ? 'bg-zinc-100 text-zinc-600 border border-zinc-300'
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="space-y-1.5 py-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Price:</span>
                    <span className="font-bold font-mono text-black">
                      {formatMoney(sub.amount, sub.currency)} / {sub.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Next Renewal:</span>
                    <span className="font-mono text-zinc-700">{sub.nextBillingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Card Billed:</span>
                    <span className="font-mono text-zinc-700">•••• {sub.cardLast4}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 mt-2">
                <button
                  onClick={() => toggleSubscriptionPause(sub.id)}
                  disabled={isCancelled}
                  className="py-1.5 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-black" /> Resume
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5 text-zinc-700" /> Pause
                    </>
                  )}
                </button>

                <button
                  onClick={() => cancelSubscription(sub.id)}
                  disabled={isCancelled}
                  className="py-1.5 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-black border border-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
