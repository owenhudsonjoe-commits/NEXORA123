import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Plus,
  Send,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  LineChart as LineChartIcon,
  Search,
  CheckCircle2,
  Lock,
  Globe,
  Building2,
  Smartphone,
  Ban,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useBanking } from '../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../data/currencies';
import { BALANCE_TIMEFRAME_DATA } from '../data/mockData';
import { Transaction } from '../types';
import { RESTRICTED_COUNTRIES } from '../data/restrictedCountries';

interface DashboardScreenProps {
  onSelectTab: (tab: string) => void;
  onOpenSend: () => void;
  onOpenExchange: () => void;
  onOpenAddFunds: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSelectTab,
  onOpenSend,
  onOpenExchange,
  onOpenAddFunds,
  onSelectTransaction,
}) => {
  const {
    totalBalanceUSD,
    availableBalanceUSD,
    totalSavingsUSD,
    monthlySpendingUSD,
    monthlyIncomeUSD,
    wallets,
    transactions,
    recipients,
    cards,
    formatMoney,
    getExchangeRate,
    userProfile,
    appSettings,
    updateSettings,
    t,
  } = useBanking();

  // Local state for displaying in USD or other currencies on the fly
  const [displayCurrency, setDisplayCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR' | 'CAD'>('USD');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const chartData = BALANCE_TIMEFRAME_DATA[timeframe];

  const hideBalances = appSettings.hideBalances;
  const toggleHideBalances = () => {
    updateSettings({ hideBalances: !hideBalances });
  };

  const recentTransactions = transactions.slice(0, 5);

  // Conversion rate to the selected display currency
  const conversionRate = getExchangeRate('USD', displayCurrency);
  const displayedTotalBalance = totalBalanceUSD * conversionRate;

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Top Welcome & Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <span>{t('welcomeBack')},</span>
            <span className="font-bold text-black flex items-center gap-1.5">
              {userProfile.fullName}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-zinc-100 border border-zinc-200 text-black text-[10px] uppercase font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-black" />
              Verified Platinum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Account Dashboard
          </h1>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSend}
            id="dash-send-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send International
          </button>
          <button
            onClick={onOpenExchange}
            id="dash-exchange-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Repeat className="w-4 h-4 text-black" />
            Convert Currency
          </button>
          <button
            onClick={onOpenAddFunds}
            id="dash-topup-btn"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-50 text-black border border-zinc-300 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-black" />
            Deposit Funds
          </button>
        </div>
      </div>

      {/* Global Payment Network Banner */}
      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-black flex items-center gap-2">
              Worldwide Payment Network
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                All Countries Available
              </span>
            </div>
            <p className="text-zinc-600 text-[11px] mt-0.5">
              Instant outward payments enabled globally for all countries, including <strong>Pakistan 🇵🇰</strong> (Pakistani Banks, Easypaisa, JazzCash & all digital wallets supported).
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSend}
          className="shrink-0 text-black hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
        >
          Send Worldwide <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Account Balance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL BALANCE CARD */}
        <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-700">
              Total Liquidity
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleHideBalances}
                className="text-zinc-400 hover:text-black transition-colors"
                title="Toggle visibility"
              >
                {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Currency Switcher Buttons */}
          <div className="flex gap-1 mb-2">
            {(['USD', 'EUR', 'GBP', 'AED', 'SAR', 'CAD'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setDisplayCurrency(c)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  displayCurrency === c
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:text-black hover:bg-zinc-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="text-3xl sm:text-4xl font-black font-mono text-black tracking-tight">
            {hideBalances
              ? '••••••••'
              : formatMoney(displayedTotalBalance, displayCurrency)}
          </div>

          <div className="text-xs text-zinc-500 mt-2 flex flex-col gap-0.5">
            {displayCurrency !== 'USD' && (
              <span>
                Base Balance: <strong className="text-black font-mono">{formatMoney(totalBalanceUSD, 'USD')}</strong>
              </span>
            )}
            <span className="text-[11px] text-zinc-400 font-medium">
              Multi-Currency Vault • Zero Hold
            </span>
          </div>
        </div>

        {/* INTERNATIONAL PAYMENTS AVAILABLE */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-black flex items-center gap-1.5">
              <span>🌐</span> International Gateways
            </span>
            <Wallet className="w-4 h-4 text-black" />
          </div>
          <div className="text-2xl font-black font-mono text-black">
            Revolut & PayPal
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            Payoneer, Wise & Wire Active
          </div>
        </div>

        {/* INITIAL DEPOSIT STATUS */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-500">
              Account Deposit
            </span>
            <CheckCircle2 className="w-4 h-4 text-black" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-black">
            +$1,000.00
          </div>
          <div className="text-xs text-zinc-600 mt-2 font-medium">
            Deposited on July 7, 2026
          </div>
        </div>

        {/* SECURITY & IDENTITY STATUS */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
            <span className="font-bold uppercase tracking-wider text-[11px] text-zinc-500">
              Account Security
            </span>
            <ShieldCheck className="w-4 h-4 text-black" />
          </div>
          <div className="text-lg font-black text-black truncate">
            {userProfile.fullName}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-zinc-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
            <span>PIN Vault Active (PIN: 78800)</span>
          </div>
        </div>
      </div>

      {/* Multi-Currency Balances Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">
              Active Currency Balances
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('wallets')}
            className="text-xs text-black hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            Manage Wallets <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {wallets.slice(0, 4).map((w) => {
            const cur = GLOBAL_CURRENCIES.find((c) => c.code === w.currencyCode);
            return (
              <div
                key={w.id}
                onClick={() => onSelectTab('wallets')}
                className="p-4 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-black transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{cur?.flag || '🌐'}</span>
                  <span className="font-mono text-xs font-black text-black group-hover:underline">
                    {w.currencyCode}
                  </span>
                </div>
                <div className="text-base font-black font-mono text-black truncate">
                  {hideBalances ? '••••••' : formatMoney(w.balance, w.currencyCode)}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase truncate mt-1 font-medium">
                  {cur?.name || 'Currency'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Chart & International Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Trend Interactive Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-black">Balance Liquidity Trend</h3>
              <p className="text-xs text-zinc-500">Historical deposits and multicurrency balances</p>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs">
              {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-black text-white shadow-xs'
                      : 'text-zinc-600 hover:text-black'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart in High-Contrast Black & White */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceGradMono" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E4E7',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#000000',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Balance (USD)']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#000000"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#balanceGradMono)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* International Payment Providers Hub (1 col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-black flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-black" />
                International Banks & Wallets
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-black font-bold uppercase">
                Active
              </span>
            </div>

            <p className="text-[11px] text-zinc-500">
              Send payments instantly to supported global providers:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenSend}
                className="w-full p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                    R
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">Revolut</div>
                    <div className="text-[10px] text-zinc-500">Instant @Revtag & IBAN</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={onOpenSend}
                className="w-full p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">Payoneer</div>
                    <div className="text-[10px] text-zinc-500">Global Payment Service & Email</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={onOpenSend}
                className="w-full p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                    PP
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">PayPal</div>
                    <div className="text-[10px] text-zinc-500">Instant PayPal.Me & Payouts</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>

              <button
                type="button"
                onClick={onOpenSend}
                className="w-full p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-xs">
                    W
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">Wise</div>
                    <div className="text-[10px] text-zinc-500">Multi-Currency Bank Routing</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-black">Transaction History</h3>
              <p className="text-xs text-zinc-500">Account deposits, settlements and ledger</p>
            </div>
            <button
              onClick={() => onSelectTab('transactions')}
              className="text-zinc-600 hover:text-black text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
            >
              See All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-200">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isExch = tx.type === 'exchange';
              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isIncome
                          ? 'bg-zinc-100 text-black border border-zinc-200'
                          : isExch
                          ? 'bg-zinc-100 text-black border border-zinc-200'
                          : 'bg-black text-white'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-5 h-5 text-black" />
                      ) : isExch ? (
                        <Repeat className="w-5 h-5 text-black" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black">{tx.title}</h4>
                      <p className="text-[11px] text-zinc-500">{tx.recipientMerchant || tx.note}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-bold font-mono ${
                        isIncome
                          ? 'text-black'
                          : isExch
                          ? 'text-zinc-800'
                          : 'text-zinc-900'
                      }`}
                    >
                      {isIncome ? '+' : isExch ? '💱 ' : '-'}
                      {formatMoney(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-medium">
                      {new Date(tx.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Identity Verification Card */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-black">Account Profile</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-black font-mono font-bold">
              ID: NEX-7880
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5 text-xs">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Account Title</span>
              <span className="font-bold text-black">{userProfile.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Authorized Email</span>
              <span className="font-mono text-zinc-700">{userProfile.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Security PIN</span>
              <span className="font-mono text-black font-bold">••••• (Default: 78800)</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Corridor Policy</span>
              <span className="text-zinc-700 font-medium">All Countries Enabled (Worldwide & Pakistan 🇵🇰)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
