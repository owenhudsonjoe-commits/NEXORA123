import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Repeat,
  ArrowDownUp,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Landmark,
  Send,
  Check,
  Globe,
  AlertCircle,
  Copy,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GLOBAL_CURRENCIES, POPULAR_EXCHANGE_PAIRS } from '../../data/currencies';
import { ALL_PAKISTANI_BANKS } from '../../data/pakistaniBanks';
import { Transaction } from '../../types';
import { isCountryRestricted } from '../../data/restrictedCountries';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFrom?: string;
  initialTo?: string;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  initialFrom = 'USD',
  initialTo = 'EUR',
}) => {
  const {
    wallets,
    totalBalanceUSD,
    exchangeCurrencies,
    sendMoney,
    getExchangeRate,
    formatMoney,
    userProfile,
  } = useBanking();

  // Mode: Pakistani Banks Transfer vs Currency Swap
  const [activeTab, setActiveTab] = useState<'pakistan_banks' | 'currency_swap'>('pakistan_banks');

  // Pakistani Banks State
  const [pkStep, setPkStep] = useState<'form' | 'pin' | 'processing' | 'success'>('form');
  const [selectedBankId, setSelectedBankId] = useState<string>('meezan');
  const [pkAmount, setPkAmount] = useState<number>(100);
  const [pkAmountMode, setPkAmountMode] = useState<'USD' | 'PKR'>('USD');
  const [recipientName, setRecipientName] = useState('Muhammad Ali Khan');
  const [accountNumber, setAccountNumber] = useState('PK36 MEZN 0001 2345 6789 0101');
  const [pkError, setPkError] = useState<string | null>(null);
  const [securityPin, setSecurityPin] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingSecondsLeft, setProcessingSecondsLeft] = useState(5);
  const [processingStageText, setProcessingStageText] = useState('Verifying Security PIN & Authorization...');
  const [completedPkTx, setCompletedPkTx] = useState<{
    referenceId: string;
    usdAmount: number;
    pkrAmount: number;
    bankName: string;
    recipientName: string;
    accountNumber: string;
  } | null>(null);

  // Currency Swap State
  const [fromCode, setFromCode] = useState(initialFrom);
  const [toCode, setToCode] = useState(initialTo);
  const [fromAmount, setFromAmount] = useState<number>(500);
  const [isSwapSuccess, setIsSwapSuccess] = useState(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  const usdWallet = wallets.find((w) => w.currencyCode === 'USD') || wallets[0];
  const usdToPkrRate = getExchangeRate('USD', 'PKR'); // 278.45
  const selectedBank =
    ALL_PAKISTANI_BANKS.find((b) => b.id === selectedBankId) || ALL_PAKISTANI_BANKS[0];

  const calculatedUsd =
    pkAmountMode === 'USD' ? pkAmount : pkAmount / usdToPkrRate;
  const calculatedPkr =
    pkAmountMode === 'USD' ? pkAmount * usdToPkrRate : pkAmount;

  // 5-second countdown timer before transfer
  useEffect(() => {
    if (pkStep !== 'processing') return;

    const TOTAL_MS = 5000; // Exactly 5 seconds before transfer
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProcessingProgress(progress);

      const secLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
      setProcessingSecondsLeft(secLeft);

      if (elapsed < 1400) {
        setProcessingStageText('Verifying Security PIN & Authorization...');
      } else if (elapsed < 2700) {
        setProcessingStageText('Connecting to State Bank of Pakistan (SBP) Raast Gateway...');
      } else if (elapsed < 4000) {
        setProcessingStageText('Locking FX Rate & Cutting Total Balance...');
      } else {
        setProcessingStageText('Finalizing 1Link PRISM Instant Settlement...');
      }

      if (elapsed >= TOTAL_MS) {
        clearInterval(interval);
        // Call sendMoney to cut the amount from total balance
        const result = sendMoney({
          recipientName: recipientName.trim(),
          recipientAccount: accountNumber.trim(),
          recipientCountry: 'Pakistan',
          recipientCurrency: 'PKR',
          amount: Number(calculatedUsd.toFixed(2)),
          sourceCurrency: 'USD',
          note: `${selectedBank.name} - Instant Exchange & Bank Transfer`,
          transferType: 'international',
          fee: 0.0,
          provider: selectedBank.name,
        });

        if (result.success && result.transaction) {
          setCompletedPkTx({
            referenceId: result.transaction.referenceId,
            usdAmount: calculatedUsd,
            pkrAmount: calculatedPkr,
            bankName: selectedBank.name,
            recipientName: recipientName.trim(),
            accountNumber: accountNumber.trim(),
          });
          setPkStep('success');
        } else {
          setPkError(result.error || 'Transfer failed. Please check your balance.');
          setPkStep('form');
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    pkStep,
    recipientName,
    accountNumber,
    calculatedUsd,
    calculatedPkr,
    selectedBank,
    sendMoney,
  ]);

  if (!isOpen) return null;

  // Swap calculations
  const fromWallet = wallets.find((w) => w.currencyCode === fromCode);
  const swapRate = getExchangeRate(fromCode, toCode);
  const toAmount = fromAmount * swapRate;
  const feePercent = userProfile.tier === 'premium' ? 0.0 : 0.3;
  const feeAmount = fromAmount * (feePercent / 100);

  const handleSwapCurrencies = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  const handleQuickPairSelect = (from: string, to: string) => {
    setFromCode(from);
    setToCode(to);
  };

  // Step 1: Submit form -> validates and asks for PIN
  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setPkError(null);

    if (isCountryRestricted('Pakistan')) {
      setPkError('Sending payments to Pakistan is currently unavailable due to international regulatory compliance restrictions.');
      return;
    }

    if (calculatedUsd <= 0) {
      setPkError('Please write a valid transfer amount.');
      return;
    }

    if (!recipientName.trim()) {
      setPkError('Please enter recipient account title.');
      return;
    }

    if (!accountNumber.trim()) {
      setPkError('Please enter recipient account number or IBAN.');
      return;
    }

    if (!usdWallet || usdWallet.balance < calculatedUsd) {
      setPkError(
        `Insufficient balance. Available: ${formatMoney(usdWallet?.balance || 0, 'USD')}.`
      );
      return;
    }

    setSecurityPin('');
    setPinError(null);
    setPkStep('pin');
  };

  // Step 2: Authorize PIN -> starts 5-second countdown
  const handleAuthorizePin = () => {
    if (!securityPin || securityPin.trim().length < 4) {
      setPinError('Security PIN is required (Default PIN: 78800).');
      return;
    }

    setPinError(null);
    setProcessingProgress(0);
    setProcessingSecondsLeft(5);
    setProcessingStageText('Verifying Security PIN & Authorization...');
    setPkStep('processing');
  };

  // Submit Currency Swap
  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setSwapError(null);

    if (fromAmount <= 0) {
      setSwapError('Please enter a valid exchange amount.');
      return;
    }

    if (!fromWallet || fromWallet.balance < fromAmount) {
      setSwapError(
        `Insufficient ${fromCode} balance. You have ${formatMoney(
          fromWallet?.balance || 0,
          fromCode
        )}.`
      );
      return;
    }

    const result = exchangeCurrencies({
      fromCurrency: fromCode,
      toCurrency: toCode,
      fromAmount,
    });

    if (result.success) {
      setCompletedTx(result.transaction || null);
      setIsSwapSuccess(true);
    } else {
      setSwapError(result.error || 'Exchange failed');
    }
  };

  const handleModalClose = () => {
    setPkStep('form');
    setIsSwapSuccess(false);
    setPkError(null);
    setSwapError(null);
    setSecurityPin('');
    setPinError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 text-black max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-base">Exchange Center</h3>
                <p className="text-xs text-zinc-500">Pakistani bank payouts & FX swap</p>
              </div>
            </div>
            <button
              onClick={handleModalClose}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200 mt-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pakistan_banks');
                setPkStep('form');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pakistan_banks'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <span>🇵🇰</span>
              <span>Pakistani Banks</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('currency_swap');
                setIsSwapSuccess(false);
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'currency_swap'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Currency Swap</span>
            </button>
          </div>

          {/* TAB 1: PAKISTANI BANKS TRANSFER */}
          {activeTab === 'pakistan_banks' && (
            <div className="mt-4">
              {/* COMPLIANCE RESTRICTION NOTICE */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 mb-4">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>Regulatory Notice: Outward Remittance Unavailable</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Sending payments and outward remittances to Pakistan are currently unavailable due to statutory international regulatory restrictions. You can continue using currency swaps across verified multi-currency wallets.
                </p>
              </div>

              {/* STEP 1: FORM INPUTS */}
              {pkStep === 'form' && (
                <form onSubmit={handleProceedToPin} className="space-y-4">
                  {pkError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{pkError}</span>
                    </div>
                  )}

                  {/* SELECT PAKISTANI BANK & WALLET (SHOW ALL BANKS & WALLETS) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Select Pakistani Bank or Wallet (All {ALL_PAKISTANI_BANKS.length} Banks & Wallets) *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBankId}
                        onChange={(e) => setSelectedBankId(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl py-2.5 px-3.5 text-xs font-bold text-black outline-none cursor-pointer"
                      >
                        <optgroup label="📱 Pakistani Mobile & Digital Wallets">
                          {ALL_PAKISTANI_BANKS.filter((b) => b.category === 'Digital & Wallets').map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.code})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="⭐ Popular Pakistani Commercial & Islamic Banks">
                          {ALL_PAKISTANI_BANKS.filter((b) => b.popular && b.category !== 'Digital & Wallets').map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.code}) - {b.category}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🏛️ All Other Pakistani Commercial & Islamic Banks">
                          {ALL_PAKISTANI_BANKS.filter((b) => !b.popular && (b.category === 'Major Commercial' || b.category === 'Islamic Banking')).map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.code}) - {b.category}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="🏦 Public & Provincial Banks">
                          {ALL_PAKISTANI_BANKS.filter((b) => b.category === 'Public / Provincial').map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.code}) - {b.category}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      Easypaisa • JazzCash • 1Link & SBP Raast Instant Settlement
                    </span>
                  </div>

                  {/* WRITE AMOUNT INPUT */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span className="font-semibold text-zinc-800">Write Amount *</span>
                      <span>
                        Total Balance:{' '}
                        <strong className="text-black font-mono">
                          {formatMoney(totalBalanceUSD, 'USD')}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-zinc-500 font-bold">
                          {pkAmountMode === 'USD' ? '$' : 'Rs'}
                        </span>
                        <input
                          type="number"
                          step="any"
                          min="1"
                          required
                          value={pkAmount || ''}
                          onChange={(e) => setPkAmount(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full bg-white border border-zinc-200 focus:border-black rounded-xl py-2.5 pl-7 pr-3 text-xl font-bold font-mono text-black outline-none"
                        />
                      </div>

                      <div className="flex rounded-xl bg-zinc-200 p-0.5 border border-zinc-300 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPkAmountMode('USD')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pkAmountMode === 'USD'
                              ? 'bg-black text-white'
                              : 'text-zinc-600 hover:text-black'
                          }`}
                        >
                          USD
                        </button>
                        <button
                          type="button"
                          onClick={() => setPkAmountMode('PKR')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pkAmountMode === 'PKR'
                              ? 'bg-black text-white'
                              : 'text-zinc-600 hover:text-black'
                          }`}
                        >
                          PKR
                        </button>
                      </div>
                    </div>

                    {/* Converted Value Indicator */}
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-200">
                      <span className="text-zinc-500">Recipient Receives:</span>
                      <span className="font-mono font-bold text-black">
                        Rs {Math.round(calculatedPkr).toLocaleString()} PKR (1 USD = {usdToPkrRate.toFixed(2)} PKR)
                      </span>
                    </div>
                  </div>

                  {/* BENEFICIARY DETAILS */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-700 font-medium">
                        Beneficiary Account Title (Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Muhammad Ali"
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl py-2 px-3 text-xs text-black outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-zinc-700 font-medium">
                        Account Number / IBAN *
                      </label>
                      <input
                        type="text"
                        required
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="PK36 MEZN 0001 2345 6789 0101"
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl py-2 px-3 text-xs text-black font-mono outline-none"
                      />
                    </div>
                  </div>

                  {/* Balance Deduction Notice */}
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] space-y-1">
                    <div className="flex justify-between text-zinc-700">
                      <span>Cut from Total Balance:</span>
                      <strong className="text-black font-mono">-${calculatedUsd.toFixed(2)} USD</strong>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Network Fee:</span>
                      <span className="text-black font-bold">$0.00 (Zero Fee)</span>
                    </div>
                  </div>

                  {/* SEND TRANSFER BUTTON */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-emerald-400" />
                    <span>Send Payment to {selectedBank.shortName} (${calculatedUsd.toFixed(2)} USD)</span>
                  </button>
                </form>
              )}

              {/* STEP 2: ASK FOR PIN */}
              {pkStep === 'pin' && (
                <div className="space-y-4 py-1">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-100">
                    <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-black text-sm">Security PIN Required</h4>
                      <p className="text-[11px] text-zinc-500">Authorize Pakistani Bank Transfer</p>
                    </div>
                  </div>

                  {/* Summary Pill */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Transfer Amount:</span>
                      <strong className="text-black">${calculatedUsd.toFixed(2)} USD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Recipient Gets:</span>
                      <strong className="text-black">Rs {Math.round(calculatedPkr).toLocaleString()} PKR</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Destination:</span>
                      <span className="text-zinc-800">{selectedBank.name} ({selectedBank.code})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Beneficiary:</span>
                      <span className="text-zinc-800">{recipientName}</span>
                    </div>
                  </div>

                  {pinError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{pinError}</span>
                    </div>
                  )}

                  {/* PIN Input */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-700">
                      Enter 5-digit Transaction PIN *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPinText ? 'text' : 'password'}
                        autoFocus
                        maxLength={6}
                        value={securityPin}
                        onChange={(e) => {
                          setSecurityPin(e.target.value);
                          setPinError(null);
                        }}
                        placeholder="•••••"
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-black rounded-xl py-2.5 pl-10 pr-10 text-center font-mono text-xl tracking-widest text-black outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAuthorizePin();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPinText(!showPinText)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black cursor-pointer"
                      >
                        {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-500">Default PIN: 78800</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSecurityPin('78800');
                          setPinError(null);
                        }}
                        className="text-[11px] text-black hover:underline font-medium cursor-pointer"
                      >
                        Auto-fill 78800
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>After authorizing, a 5-second security verification will run before cutting total balance.</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPkStep('form')}
                      className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleAuthorizePin}
                      className="flex-1 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Transfer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: TAKE 5 SEC BEFORE TRANSFER (COUNTDOWN & PROGRESS) */}
              {pkStep === 'processing' && (
                <div className="py-6 px-4 space-y-5 text-center">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-zinc-200"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * processingProgress) / 100}
                        strokeLinecap="round"
                        className="text-black transition-all duration-75"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black font-mono text-black">
                        {processingSecondsLeft}s
                      </span>
                      <span className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                        Delay
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-black text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Taking 5 sec before transfer</span>
                    </div>
                    <h3 className="text-lg font-black text-black">
                      Authorizing Pakistani Bank Transfer
                    </h3>
                    <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                      Sending <strong className="text-black">${calculatedUsd.toFixed(2)} USD</strong> (Rs {Math.round(calculatedPkr).toLocaleString()} PKR) to{' '}
                      <strong className="text-black">{selectedBank.name}</strong>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2 text-left">
                    <div className="flex items-center justify-between text-zinc-600 text-[11px]">
                      <span>Clearing Progress:</span>
                      <span className="font-mono text-black font-bold">{processingProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-black h-full transition-all duration-75"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-black font-medium text-xs pt-1">
                      <Loader2 className="w-4 h-4 animate-spin shrink-0 text-black" />
                      <span>{processingStageText}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setPkStep('form')}
                      className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-bold text-black transition-colors cursor-pointer"
                    >
                      Cancel Transfer
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PENDING TRANSACTION VIEW (No screenshot, shows pending status) */}
              {pkStep === 'success' && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mx-auto text-amber-600 shadow-sm">
                    <Clock className="w-9 h-9 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                      <span>Pending Transaction</span>
                    </div>

                    <h3 className="text-xl font-black text-black">Pending Transaction</h3>

                    {/* PROMINENT REQUESTED BANNER */}
                    <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs sm:text-sm font-extrabold shadow-sm">
                      ⏳ Pending transaction: Your payment will be sent to you shortly
                    </div>
                    <p className="text-xs text-zinc-600">
                      Amount has been deducted from your total balance and queued. Settlement will be dispatched shortly to {completedPkTx?.bankName}.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Reference:</span>
                      <span className="font-bold text-black">{completedPkTx?.referenceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Amount Deducted:</span>
                      <span className="font-bold text-black">-${completedPkTx?.usdAmount.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Converted PKR:</span>
                      <span className="font-bold text-black">
                        Rs {Math.round(completedPkTx?.pkrAmount || 0).toLocaleString()} PKR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Destination Bank:</span>
                      <span className="text-zinc-900">{completedPkTx?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 font-sans">Beneficiary:</span>
                      <span className="text-zinc-900">{completedPkTx?.recipientName}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-200">
                      <span className="text-zinc-600 font-sans">New Total Balance:</span>
                      <span className="font-bold text-black font-mono">
                        {formatMoney(totalBalanceUSD, 'USD')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPkStep('form');
                        setCompletedPkTx(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs transition-colors cursor-pointer"
                    >
                      Make Another
                    </button>
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="flex-1 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURRENCY SWAP */}
          {activeTab === 'currency_swap' && (
            <div className="mt-4">
              {/* Quick Popular Pairs */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 mb-1.5 uppercase tracking-wider">
                  Popular Pairs
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {POPULAR_EXCHANGE_PAIRS.slice(0, 4).map((p) => (
                    <button
                      key={`${p.from}-${p.to}`}
                      type="button"
                      onClick={() => handleQuickPairSelect(p.from, p.to)}
                      className={`shrink-0 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                        fromCode === p.from && toCode === p.to
                          ? 'bg-black border-black text-white font-bold'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-black hover:bg-zinc-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {swapError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{swapError}</span>
                </div>
              )}

              {!isSwapSuccess ? (
                <form onSubmit={handleExecuteSwap} className="mt-4 space-y-4">
                  {/* SOURCE CARD */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span>You Sell</span>
                      <span>
                        Balance:{' '}
                        <strong className="text-black">
                          {formatMoney(fromWallet?.balance || 0, fromCode)}
                        </strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        step="any"
                        min="1"
                        required
                        value={fromAmount}
                        onChange={(e) => setFromAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-2xl font-bold font-mono text-black focus:outline-none"
                      />
                      <select
                        value={fromCode}
                        onChange={(e) => setFromCode(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                      >
                        {GLOBAL_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* SWAP BUTTON */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <button
                      type="button"
                      onClick={handleSwapCurrencies}
                      className="p-2.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-black shadow-sm transition-transform hover:scale-110 cursor-pointer"
                    >
                      <ArrowDownUp className="w-4 h-4" />
                    </button>
                  </div>

                  {/* DESTINATION CARD */}
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span>You Receive (Estimated)</span>
                      <span className="text-black font-medium">
                        1 {fromCode} = {swapRate.toFixed(4)} {toCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-full text-2xl font-bold font-mono text-black truncate">
                        {toAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <select
                        value={toCode}
                        onChange={(e) => setToCode(e.target.value)}
                        className="bg-white border border-zinc-200 rounded-xl px-3 py-1.5 text-sm font-bold text-black focus:outline-none focus:border-black cursor-pointer"
                      >
                        {GLOBAL_CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                  >
                    Execute Exchange
                  </button>
                </form>
              ) : (
                <div className="mt-4 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-black">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">Currencies Swapped Successfully</h3>
                    <p className="text-xs text-zinc-600 mt-1">
                      Exchanged {formatMoney(fromAmount, fromCode)} for{' '}
                      <strong className="text-black font-mono">
                        {formatMoney(toAmount, toCode)}
                      </strong>
                    </p>
                  </div>

                  <button
                    onClick={handleModalClose}
                    className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Return
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
