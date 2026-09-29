import React, { useState, useMemo } from 'react';
import {
  Wallet as WalletIcon,
  Search,
  Star,
  Plus,
  Trash2,
  Send,
  Repeat,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Calculator,
  Check,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../data/currencies';
import { Currency, CurrencyRegion, Transaction } from '../types';

interface WalletsScreenProps {
  onOpenSendWithCurrency: (currency: string) => void;
  onOpenExchangeWithCurrency: (currency: string) => void;
  onOpenAddFundsWithCurrency: (currency: string) => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const WalletsScreen: React.FC<WalletsScreenProps> = ({
  onOpenSendWithCurrency,
  onOpenExchangeWithCurrency,
  onOpenAddFundsWithCurrency,
  onSelectTransaction,
}) => {
  const {
    wallets,
    addWallet,
    removeWallet,
    toggleWalletFavorite,
    formatMoney,
    getExchangeRate,
    transactions,
  } = useBanking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedWalletCode, setSelectedWalletCode] = useState<string>('USD');

  // Calculator states
  const [calcAmount, setCalcAmount] = useState<number>(1000);
  const [calcFrom, setCalcFrom] = useState('USD');
  const [calcTo, setCalcTo] = useState('EUR');

  const regions: (CurrencyRegion | 'All')[] = [
    'All',
    'Americas',
    'Europe',
    'Asia',
    'Oceania',
    'Africa',
  ];

  // Active wallets list
  const activeCurrencies = useMemo(() => {
    return GLOBAL_CURRENCIES.filter((c) =>
      wallets.some((w) => w.currencyCode === c.code)
    );
  }, [wallets]);

  // Filtered currencies
  const filteredCurrencies = useMemo(() => {
    return GLOBAL_CURRENCIES.filter((cur) => {
      const matchesSearch =
        cur.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cur.country.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'All' || cur.region === selectedRegion;

      const wallet = wallets.find((w) => w.currencyCode === cur.code);
      const matchesFavorite = !onlyFavorites || (wallet && wallet.isFavorite);

      return matchesSearch && matchesRegion && matchesFavorite;
    });
  }, [searchQuery, selectedRegion, onlyFavorites, wallets]);

  // Selected wallet object
  const selectedWallet = wallets.find((w) => w.currencyCode === selectedWalletCode) || wallets[0];
  const selectedCurrencyInfo = GLOBAL_CURRENCIES.find(
    (c) => c.code === (selectedWallet ? selectedWallet.currencyCode : 'USD')
  );

  // Calculator calculation
  const calcRate = getExchangeRate(calcFrom, calcTo);
  const calcResult = calcAmount * calcRate;

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-bold mb-1 uppercase tracking-wider">
            <Globe className="w-4 h-4 text-black" /> Multi-Currency Treasury
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Currency Wallets & Accounts
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Hold, convert, and transact in major global currencies with zero borders
          </p>
        </div>

        {/* Total Currencies Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
            <span className="text-zinc-500">Active Wallets:</span>{' '}
            <strong className="text-black font-mono font-bold">{wallets.length}</strong>
            <span className="text-zinc-400 mx-1.5">/</span>
            <span className="text-zinc-500">Supported:</span>{' '}
            <strong className="text-black font-mono font-bold">{GLOBAL_CURRENCIES.length}</strong>
          </div>
        </div>
      </div>

      {/* Interactive Currency Converter Calculator Widget */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-black flex items-center gap-2">
            <Calculator className="w-4 h-4 text-black" />
            Live Currency Conversion Calculator
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">
            1 {calcFrom} = <span className="text-black font-bold">{calcRate.toFixed(4)}</span> {calcTo}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* FROM AMOUNT & CURRENCY */}
          <div className="md:col-span-5 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
            <input
              type="number"
              value={calcAmount}
              onChange={(e) => setCalcAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent font-mono text-base font-bold text-black focus:outline-none"
            />
            <select
              value={calcFrom}
              onChange={(e) => setCalcFrom(e.target.value)}
              className="bg-white border border-zinc-200 text-xs font-bold text-black rounded-lg px-2 py-1 focus:outline-none"
            >
              {GLOBAL_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              onClick={() => {
                const temp = calcFrom;
                setCalcFrom(calcTo);
                setCalcTo(temp);
              }}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-200 transition-transform hover:rotate-180 cursor-pointer"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* TO RESULT & CURRENCY */}
          <div className="md:col-span-5 flex items-center bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
            <div className="w-full font-mono text-base font-bold text-black truncate">
              {calcResult.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <select
              value={calcTo}
              onChange={(e) => setCalcTo(e.target.value)}
              className="bg-white border border-zinc-200 text-xs font-bold text-black rounded-lg px-2 py-1 focus:outline-none"
            >
              {GLOBAL_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Wallet Details & Management Bar */}
      {selectedWallet && selectedCurrencyInfo && (
        <div className="p-6 rounded-3xl bg-white border-2 border-black shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-4xl">{selectedCurrencyInfo.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-black">
                    {selectedCurrencyInfo.name} ({selectedCurrencyInfo.code})
                  </h2>
                  <button
                    onClick={() => toggleWalletFavorite(selectedCurrencyInfo.code)}
                    className="text-amber-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        selectedWallet.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-zinc-300'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-zinc-500">
                  {selectedCurrencyInfo.country} • Region: {selectedCurrencyInfo.region} • Peg: 1 USD ={' '}
                  {selectedCurrencyInfo.rateAgainstUSD} {selectedCurrencyInfo.code}
                </p>
              </div>
            </div>

            {/* Big Wallet Balance */}
            <div className="text-right">
              <div className="text-xs uppercase text-zinc-500 font-bold tracking-wider">
                Current Wallet Balance
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-black">
                {formatMoney(selectedWallet.balance, selectedWallet.currencyCode)}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for this specific wallet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => onOpenSendWithCurrency(selectedWallet.currencyCode)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send {selectedWallet.currencyCode}
            </button>
            <button
              onClick={() => onOpenExchangeWithCurrency(selectedWallet.currencyCode)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-black border border-zinc-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <Repeat className="w-4 h-4 text-black" />
              Exchange to/from
            </button>
            <button
              onClick={() => onOpenAddFundsWithCurrency(selectedWallet.currencyCode)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-black border border-zinc-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              Add Funds
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  `NEXORA-IBAN-${selectedWallet.currencyCode}-8842-1920-4491`
                );
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-black border border-zinc-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 text-black" />
              Receive Details
            </button>
          </div>
        </div>
      )}

      {/* Search & Region Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search currency, code, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Favorite filter toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
              onlyFavorites
                ? 'bg-black text-white border-black'
                : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-black'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white text-white' : ''}`} />
            Favorites Only
          </button>
        </div>
      </div>

      {/* Grid of Global Currencies */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCurrencies.map((cur) => {
          const wallet = wallets.find((w) => w.currencyCode === cur.code);
          const isActivated = !!wallet;
          const isSelected = selectedWalletCode === cur.code;

          return (
            <div
              key={cur.code}
              onClick={() => {
                if (isActivated) {
                  setSelectedWalletCode(cur.code);
                }
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-zinc-50 border-2 border-black shadow-md'
                  : isActivated
                  ? 'bg-white border-zinc-200 hover:border-zinc-400'
                  : 'bg-zinc-50/70 border-zinc-200 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cur.flag}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-black text-sm">{cur.code}</h4>
                      <span className="text-[10px] text-zinc-500 font-medium">
                        {cur.symbol}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate max-w-[120px]">
                      {cur.name}
                    </p>
                  </div>
                </div>

                {isActivated ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWalletFavorite(cur.code);
                    }}
                    className="text-zinc-300 hover:text-amber-500 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        wallet?.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addWallet(cur.code);
                      setSelectedWalletCode(cur.code);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-black text-white hover:bg-zinc-800 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                )}
              </div>

              {isActivated ? (
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
                    Wallet Balance
                  </div>
                  <div className="text-lg font-black font-mono text-black">
                    {formatMoney(wallet.balance, wallet.currencyCode)}
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-xs text-zinc-400 italic">
                  Not activated yet • Click Add to open wallet
                </div>
              )}

              <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                <span>1 USD = {cur.rateAgainstUSD} {cur.code}</span>
                <span className="uppercase">{cur.region}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
