import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useBanking } from '../context/BankingContext';
import {
  BALANCE_TIMEFRAME_DATA,
  CASHFLOW_MONTHLY_DATA,
  SPENDING_BY_CATEGORY_DATA,
  MERCHANT_BREAKDOWN_DATA,
  FINANCIAL_INSIGHTS,
} from '../data/mockData';

export const AnalyticsScreen: React.FC = () => {
  const { formatMoney, monthlySpendingUSD, monthlyIncomeUSD } = useBanking();
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-black" /> Financial Intelligence & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Analytics & Insights
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Deep financial telemetry, cashflow metrics, and spending categorization
          </p>
        </div>

        {/* Timeframe Controls */}
        <div className="flex p-1 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs">
          {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <span className="text-xs text-zinc-500 font-medium">Net Monthly Cashflow</span>
          <div className="text-2xl font-extrabold font-mono text-black mt-1">
            +{formatMoney(monthlyIncomeUSD - monthlySpendingUSD, 'USD')}
          </div>
          <span className="text-xs text-zinc-700 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-black" /> +24% vs preceding month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <span className="text-xs text-zinc-500 font-medium">Savings Rate</span>
          <div className="text-2xl font-extrabold font-mono text-black mt-1">
            41.2%
          </div>
          <span className="text-xs text-zinc-500 mt-2 block">
            Target is 35% (Exceeding goal!)
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm">
          <span className="text-xs text-zinc-500 font-medium">Largest Spending Category</span>
          <div className="text-xl font-bold text-black mt-1">
            Shopping & Retail
          </div>
          <span className="text-xs text-zinc-500 mt-2 block">
            $1,240.00 spent this cycle
          </span>
        </div>
      </div>

      {/* Monthly Cashflow In vs Out Bar Chart */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-black text-base">6-Month Income vs Outflow Trajectory</h3>
            <p className="text-xs text-zinc-500">Simulated monthly comparative cash movement</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-black">
              <span className="w-2.5 h-2.5 rounded-full bg-black" /> Income
            </span>
            <span className="flex items-center gap-1.5 text-zinc-600">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" /> Expense
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CASHFLOW_MONTHLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E4E4E7',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#000000',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Bar dataKey="income" fill="#18181B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#A1A1AA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie & Merchant Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-black text-base">Expenditure by Category</h3>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SPENDING_BY_CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SPENDING_BY_CATEGORY_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E4E4E7',
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: '#000000',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {SPENDING_BY_CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-zinc-600 truncate">{c.name}</span>
                <span className="font-bold font-mono text-black ml-auto">${c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-black text-base">Top Simulated Merchants</h3>

          <div className="space-y-3">
            {MERCHANT_BREAKDOWN_DATA.map((m) => (
              <div key={m.merchant} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-black">{m.merchant}</span>
                  <span className="font-mono text-zinc-700">${m.amount.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${(m.amount / 1200) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
