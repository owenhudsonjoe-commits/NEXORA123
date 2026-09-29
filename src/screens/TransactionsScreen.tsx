import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Download,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Repeat,
  Calendar,
  Layers,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Transaction } from '../types';
import { GLOBAL_CURRENCIES } from '../data/currencies';

interface TransactionsScreenProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  onSelectTransaction,
}) => {
  const { transactions, formatMoney } = useBanking();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');

  const categories = [
    'all',
    'Salary',
    'Shopping',
    'Dining',
    'Cloud Infrastructure',
    'Streaming & Entertainment',
    'Travel & Transport',
    'Investment',
    'Transfer',
    'Exchange',
  ];

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        tx.title.toLowerCase().includes(search.toLowerCase()) ||
        tx.recipientMerchant.toLowerCase().includes(search.toLowerCase()) ||
        tx.referenceId.toLowerCase().includes(search.toLowerCase()) ||
        (tx.note && tx.note.toLowerCase().includes(search.toLowerCase()));

      const matchType = selectedType === 'all' || tx.type === selectedType;
      const matchCat =
        selectedCategory === 'all' || tx.category === selectedCategory;
      const matchCur =
        selectedCurrency === 'all' || tx.currency === selectedCurrency;

      return matchSearch && matchType && matchCat && matchCur;
    });
  }, [transactions, search, selectedType, selectedCategory, selectedCurrency]);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Reference,Date,Title,Merchant,Category,Amount,Currency,Type,Status\n';
    filtered.forEach((t) => {
      csvContent += `"${t.referenceId}","${t.timestamp}","${t.title}","${t.recipientMerchant}","${t.category}","${t.amount}","${t.currency}","${t.type}","${t.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXORA_Transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-bold mb-1 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-black" /> Comprehensive Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Verified ledger statements with real-time tracking and multi-dimensional filtering
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4 text-white" />
          Export Statement (CSV)
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reference, merchant, note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            >
              <option value="all">All Types</option>
              <option value="income">Income (+)</option>
              <option value="expense">Expense (-)</option>
              <option value="transfer">Transfers</option>
              <option value="exchange">FX Exchanges</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Filter */}
          <div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
            >
              <option value="all">All Currencies</option>
              {GLOBAL_CURRENCIES.slice(0, 15).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-xs text-zinc-500">
          <span className="font-bold">Showing {filtered.length} entries</span>
          <span>Click any entry to view full receipt & details</span>
        </div>

        <div className="divide-y divide-zinc-200">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 font-medium">
              No transactions match your search filters
            </div>
          ) : (
            filtered.map((tx) => {
              const isIncome = tx.type === 'income';
              const isExch = tx.type === 'exchange';

              return (
                <div
                  key={tx.id}
                  onClick={() => onSelectTransaction(tx)}
                  className="py-3.5 px-2 flex items-center justify-between hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
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
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-black group-hover:underline transition-colors">
                          {tx.title}
                        </h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 font-bold">
                          {tx.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {tx.recipientMerchant} •{' '}
                        <span className="font-mono text-zinc-600">{tx.referenceId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div
                        className={`text-xs font-black font-mono ${
                          isIncome
                            ? 'text-black'
                            : isExch
                            ? 'text-zinc-800'
                            : 'text-black'
                        }`}
                      >
                        {isIncome ? '+' : isExch ? '💱 ' : '-'}
                        {formatMoney(tx.amount, tx.currency)}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
