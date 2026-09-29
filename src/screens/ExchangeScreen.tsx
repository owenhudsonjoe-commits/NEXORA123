import React, { useState, useEffect } from 'react';
import {
  Repeat,
  ArrowDownUp,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Clock,
  Globe,
  DollarSign,
  Layers,
  Building2,
  Landmark,
  Search,
  Check,
  Copy,
  Send,
  ArrowRight,
  AlertCircle,
  Download,
  Share2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  X,
  Loader2,
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
import { GLOBAL_CURRENCIES, POPULAR_EXCHANGE_PAIRS } from '../data/currencies';
import { ALL_PAKISTANI_BANKS, PakistaniBank } from '../data/pakistaniBanks';
import { ALL_INTERNATIONAL_PROVIDERS, InternationalPaymentProvider } from '../data/internationalBanks';
import { FX_HISTORICAL_DATA } from '../data/mockData';

interface ExchangeScreenProps {
  onOpenExchangeModalWithPair?: (from: string, to: string) => void;
}

export const ExchangeScreen: React.FC<ExchangeScreenProps> = ({
  onOpenExchangeModalWithPair,
}) => {
  const {
    wallets,
    totalBalanceUSD,
    getExchangeRate,
    exchangeCurrencies,
    sendMoney,
    formatMoney,
    userProfile,
  } = useBanking();

  // Mode: International Banks/Fintech vs Global Currency Swap vs Restricted Corridor
  const [activeTab, setActiveTab] = useState<'international_banks' | 'currency_swap' | 'pakistan_banks'>('international_banks');

  // Pakistani Banks Exchange & Transfer State
  const [selectedBankId, setSelectedBankId] = useState<string>('meezan');
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [bankCategoryFilter, setBankCategoryFilter] = useState<string>('all');
  const [pkTransferAmount, setPkTransferAmount] = useState<number>(100);
  const [pkAmountMode, setPkAmountMode] = useState<'USD' | 'PKR'>('USD');
  const [recipientName, setRecipientName] = useState('Muhammad Ali Khan');
  const [accountNumber, setAccountNumber] = useState('PK36 MEZN 0001 2345 6789 0101');
  const [transferNote, setTransferNote] = useState('Exchange & Family Remittance');
  const [pkError, setPkError] = useState<string | null>(null);
  const [pkSuccess, setPkSuccess] = useState(false);
  const [completedTransfer, setCompletedTransfer] = useState<{
    referenceId: string;
    usdAmount: number;
    pkrAmount: number;
    bankName: string;
    recipientName: string;
    accountNumber: string;
    timestamp: string;
    balanceAfter: number;
  } | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // International Banks & Providers State (Revolut, Payoneer, PayPal, Wise, Chase, etc.)
  const [selectedIntlId, setSelectedIntlId] = useState<string>('revolut');
  const [intlSearchQuery, setIntlSearchQuery] = useState('');
  const [intlCategoryFilter, setIntlCategoryFilter] = useState<string>('all');
  const [intlTransferAmount, setIntlTransferAmount] = useState<number>(100);
  const [intlAmountMode, setIntlAmountMode] = useState<'USD' | 'TARGET'>('USD');
  const [intlCurrency, setIntlCurrency] = useState<string>('USD');
  const [intlRecipientName, setIntlRecipientName] = useState('Sarah Jenkins');
  const [intlAccountIdentifier, setIntlAccountIdentifier] = useState('@sarah_revolut');
  const [intlNote, setIntlNote] = useState('Consulting Payout / Remittance');
  const [intlError, setIntlError] = useState<string | null>(null);
  const [intlSuccess, setIntlSuccess] = useState(false);
  const [completedIntlTransfer, setCompletedIntlTransfer] = useState<{
    referenceId: string;
    usdAmount: number;
    receivedAmount: number;
    targetCurrency: string;
    providerName: string;
    providerCode: string;
    recipientName: string;
    accountIdentifier: string;
    timestamp: string;
    balanceAfter: number;
    network: string;
  } | null>(null);
  const [isProcessingIntl, setIsProcessingIntl] = useState(false);
  const [intlSecondsLeft, setIntlSecondsLeft] = useState(5);
  const [intlProgress, setIntlProgress] = useState(0);
  const [intlStageText, setIntlStageText] = useState('Verifying Security PIN & Authorization Token...');

  // Security PIN and 5-Sec Processing State
  const [pinTransferType, setPinTransferType] = useState<'pakistan' | 'international'>('pakistan');
  const [showPinModal, setShowPinModal] = useState(false);
  const [securityPin, setSecurityPin] = useState('');
  const [showPinText, setShowPinText] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [transferSecondsLeft, setTransferSecondsLeft] = useState(5);
  const [transferProgress, setTransferProgress] = useState(0);
  const [processingStageText, setProcessingStageText] = useState('Verifying Security PIN & Authorization Token...');

  // Global Currency Swap State
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [swapAmount, setSwapAmount] = useState<number>(1000);
  const [isSwapSuccess, setIsSwapSuccess] = useState(false);
  const [swapError, setSwapError] = useState<string | null>(null);

  const usdWallet = wallets.find((w) => w.currencyCode === 'USD') || wallets[0];
  const usdToPkrRate = getExchangeRate('USD', 'PKR'); // ~278.45

  // Pakistani Banks filtering
  const filteredBanks = ALL_PAKISTANI_BANKS.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      b.shortName.toLowerCase().includes(bankSearchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearchQuery.toLowerCase());
    const matchesCategory =
      bankCategoryFilter === 'all' || b.category === bankCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedBank =
    ALL_PAKISTANI_BANKS.find((b) => b.id === selectedBankId) || ALL_PAKISTANI_BANKS[0];

  // International Providers filtering
  const filteredIntlProviders = ALL_INTERNATIONAL_PROVIDERS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(intlSearchQuery.toLowerCase()) ||
      p.shortName.toLowerCase().includes(intlSearchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(intlSearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(intlSearchQuery.toLowerCase());
    const matchesCategory =
      intlCategoryFilter === 'all' || p.category === intlCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedIntlProvider =
    ALL_INTERNATIONAL_PROVIDERS.find((p) => p.id === selectedIntlId) ||
    ALL_INTERNATIONAL_PROVIDERS[0];

  // Converted amounts for Pakistani Transfer
  const calculatedUsdAmount =
    pkAmountMode === 'USD' ? pkTransferAmount : pkTransferAmount / usdToPkrRate;
  const calculatedPkrAmount =
    pkAmountMode === 'USD' ? pkTransferAmount * usdToPkrRate : pkTransferAmount;

  // Converted amounts for International Transfer
  const targetFxRate = getExchangeRate('USD', intlCurrency);
  const calculatedIntlUsd =
    intlAmountMode === 'USD'
      ? intlTransferAmount
      : intlTransferAmount / (targetFxRate || 1);
  const calculatedIntlTarget =
    intlAmountMode === 'USD'
      ? intlTransferAmount * (targetFxRate || 1)
      : intlTransferAmount;

  // Swap Calculations
  const fromWallet = wallets.find((w) => w.currencyCode === fromCurrency);
  const swapRate = getExchangeRate(fromCurrency, toCurrency);
  const swapReceivedAmount = swapAmount * swapRate;
  const traditionalBankMarkupFee = swapAmount * 0.035;
  const nexoraFee = userProfile.tier === 'premium' ? 0.0 : swapAmount * 0.003;
  const userSavings = traditionalBankMarkupFee - nexoraFee;

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // When changing international provider, update default currency & placeholder
  const handleSelectIntlProvider = (provider: InternationalPaymentProvider) => {
    setSelectedIntlId(provider.id);
    setIntlCurrency(provider.defaultCurrency);
    if (!intlAccountIdentifier || intlAccountIdentifier.startsWith('@') || intlAccountIdentifier.includes('@') || intlAccountIdentifier.includes('/')) {
      setIntlAccountIdentifier(provider.exampleId);
    }
  };

  // 5-Second Processing Countdown before executing transfer
  useEffect(() => {
    if (!isProcessingTransfer) return;

    const TOTAL_MS = 5000; // Exactly 5 seconds before transfer
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setTransferProgress(progress);

      const secLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
      setTransferSecondsLeft(secLeft);

      if (elapsed < 1400) {
        setProcessingStageText('Verifying Security PIN & Authorization Token...');
      } else if (elapsed < 2700) {
        setProcessingStageText('Connecting to State Bank of Pakistan (SBP) Raast Gateway...');
      } else if (elapsed < 4000) {
        setProcessingStageText('Locking Interbank FX Rate & Cutting Total Balance...');
      } else {
        setProcessingStageText('Finalizing 1Link PRISM Instant Settlement...');
      }

      if (elapsed >= TOTAL_MS) {
        clearInterval(interval);
        // Execute the transfer in the banking context (cuts from USD wallet & total balance)
        const result = sendMoney({
          recipientName: recipientName.trim(),
          recipientAccount: accountNumber.trim(),
          recipientCountry: 'Pakistan',
          recipientCurrency: 'PKR',
          amount: Number(calculatedUsdAmount.toFixed(2)),
          sourceCurrency: 'USD',
          note: `${selectedBank.name} - ${transferNote}`,
          transferType: 'international',
          fee: 0.0,
          provider: selectedBank.name,
        });

        if (result.success && result.transaction) {
          setCompletedTransfer({
            referenceId: result.transaction.referenceId,
            usdAmount: calculatedUsdAmount,
            pkrAmount: calculatedPkrAmount,
            bankName: selectedBank.name,
            recipientName: recipientName.trim(),
            accountNumber: accountNumber.trim(),
            timestamp: new Date().toISOString(),
            balanceAfter: Math.max(0, usdWallet.balance - calculatedUsdAmount),
          });
          setIsProcessingTransfer(false);
          setPkSuccess(true);
        } else {
          setIsProcessingTransfer(false);
          setPkError(result.error || 'Transfer could not be completed. Please check your balance.');
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    isProcessingTransfer,
    calculatedUsdAmount,
    calculatedPkrAmount,
    selectedBank,
    recipientName,
    accountNumber,
    transferNote,
    usdWallet,
    sendMoney,
  ]);

  // Step 1: User clicks "Send Transfer" to Pakistani Bank -> Validates and asks for PIN
  const handleInitiatePakistanTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setPkError(null);

    if (calculatedUsdAmount <= 0) {
      setPkError('Please enter a valid transfer amount.');
      return;
    }

    if (!recipientName.trim()) {
      setPkError('Please enter beneficiary name / account holder title.');
      return;
    }

    if (!accountNumber.trim()) {
      setPkError(`Please enter recipient's account number or IBAN for ${selectedBank.name}.`);
      return;
    }

    if (!usdWallet || usdWallet.balance < calculatedUsdAmount) {
      setPkError(
        `Insufficient balance. Available: ${formatMoney(usdWallet?.balance || 0, 'USD')}. Required: $${calculatedUsdAmount.toFixed(2)} USD.`
      );
      return;
    }

    // Valid -> Prompt PIN
    setPinTransferType('pakistan');
    setSecurityPin('');
    setPinError(null);
    setShowPinModal(true);
  };

  // International Banks Transfer: Step 1 -> Validates form, then asks for PIN
  const handleInitiateIntlTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIntlError(null);

    if (calculatedIntlUsd <= 0) {
      setIntlError('Please enter a valid transfer amount.');
      return;
    }

    if (!intlRecipientName.trim()) {
      setIntlError('Please enter beneficiary name / account holder title.');
      return;
    }

    if (!intlAccountIdentifier.trim()) {
      setIntlError(`Please enter recipient's ${selectedIntlProvider.accountLabel}.`);
      return;
    }

    if (!usdWallet || usdWallet.balance < calculatedIntlUsd) {
      setIntlError(
        `Insufficient balance. Available: ${formatMoney(usdWallet?.balance || 0, 'USD')}. Required: $${calculatedIntlUsd.toFixed(2)} USD.`
      );
      return;
    }

    // Valid -> Prompt PIN
    setPinTransferType('international');
    setSecurityPin('');
    setPinError(null);
    setShowPinModal(true);
  };

  // 5-Second Processing Countdown for International Banks (Revolut, Payoneer, PayPal, etc.)
  useEffect(() => {
    if (!isProcessingIntl) return;

    const TOTAL_MS = 5000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setIntlProgress(progress);

      const secLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
      setIntlSecondsLeft(secLeft);

      if (elapsed < 1400) {
        setIntlStageText('Verifying Security PIN & Anti-Fraud Clearance...');
      } else if (elapsed < 2700) {
        setIntlStageText(`Connecting to ${selectedIntlProvider.name} Gateway (${selectedIntlProvider.processingNetwork})...`);
      } else if (elapsed < 4000) {
        setIntlStageText('Locking Real-time FX Rates & Deducting Total Balance...');
      } else {
        setIntlStageText(`Finalizing ${selectedIntlProvider.shortName} Instant Settlement...`);
      }

      if (elapsed >= TOTAL_MS) {
        clearInterval(interval);
        // Deduct from USD wallet & balance via sendMoney
        const result = sendMoney({
          recipientName: intlRecipientName.trim(),
          recipientAccount: intlAccountIdentifier.trim(),
          recipientCountry: 'International',
          recipientCurrency: intlCurrency,
          amount: Number(calculatedIntlUsd.toFixed(2)),
          sourceCurrency: 'USD',
          note: `${selectedIntlProvider.name} - ${intlNote}`,
          transferType: 'international',
          fee: 0.0,
          provider: selectedIntlProvider.name,
        });

        if (result.success && result.transaction) {
          setCompletedIntlTransfer({
            referenceId: result.transaction.referenceId,
            usdAmount: calculatedIntlUsd,
            receivedAmount: calculatedIntlTarget,
            targetCurrency: intlCurrency,
            providerName: selectedIntlProvider.name,
            providerCode: selectedIntlProvider.code,
            recipientName: intlRecipientName.trim(),
            accountIdentifier: intlAccountIdentifier.trim(),
            timestamp: new Date().toISOString(),
            balanceAfter: Math.max(0, usdWallet.balance - calculatedIntlUsd),
            network: selectedIntlProvider.processingNetwork,
          });
          setIsProcessingIntl(false);
          setIntlSuccess(true);
        } else {
          setIsProcessingIntl(false);
          setIntlError(result.error || 'Transfer could not be completed. Please check your balance.');
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    isProcessingIntl,
    calculatedIntlUsd,
    calculatedIntlTarget,
    intlCurrency,
    selectedIntlProvider,
    intlRecipientName,
    intlAccountIdentifier,
    intlNote,
    usdWallet,
    sendMoney,
  ]);

  // Step 2: User confirms PIN -> Closes PIN modal and starts 5-second countdown
  const handleConfirmPinAndStartTransfer = () => {
    if (!securityPin || securityPin.trim().length < 4) {
      setPinError('Security PIN is required (Default PIN: 78800).');
      return;
    }

    setPinError(null);
    setShowPinModal(false);

    if (pinTransferType === 'pakistan') {
      setTransferProgress(0);
      setTransferSecondsLeft(5);
      setProcessingStageText('Verifying Security PIN & Authorization Token...');
      setIsProcessingTransfer(true);
    } else {
      setIntlProgress(0);
      setIntlSecondsLeft(5);
      setIntlStageText('Verifying Security PIN & Anti-Fraud Clearance...');
      setIsProcessingIntl(true);
    }
  };

  // Cancel 5-second countdown if user aborts
  const handleCancelTransferCountdown = () => {
    setIsProcessingTransfer(false);
    setTransferProgress(0);
    setTransferSecondsLeft(5);
  };

  const handleCancelIntlCountdown = () => {
    setIsProcessingIntl(false);
    setIntlProgress(0);
    setIntlSecondsLeft(5);
  };

  const handleCopyIntlReceipt = () => {
    if (!completedIntlTransfer) return;
    const text = `NEXORA INTERNATIONAL PAYMENT RECEIPT
Status: Transfer Completed (You will get this payment shortly)
Reference: ${completedIntlTransfer.referenceId}
Amount Sent: $${completedIntlTransfer.usdAmount.toFixed(2)} USD
Payout Equivalent: ${completedIntlTransfer.receivedAmount.toFixed(2)} ${completedIntlTransfer.targetCurrency}
Destination: ${completedIntlTransfer.providerName}
Beneficiary: ${completedIntlTransfer.recipientName}
Account/Handle: ${completedIntlTransfer.accountIdentifier}
Date: ${new Date(completedIntlTransfer.timestamp).toLocaleString()}
Network: ${completedIntlTransfer.network}`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  // Handle Global Currency Swap
  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setSwapError(null);
    if (swapAmount <= 0) {
      setSwapError('Please enter a valid conversion amount.');
      return;
    }
    if (!fromWallet || fromWallet.balance < swapAmount) {
      setSwapError(
        `Insufficient ${fromCurrency} balance. You currently hold ${formatMoney(
          fromWallet?.balance || 0,
          fromCurrency
        )}.`
      );
      return;
    }

    const res = exchangeCurrencies({
      fromCurrency,
      toCurrency,
      fromAmount: swapAmount,
    });

    if (res.success) {
      setIsSwapSuccess(true);
      setTimeout(() => setIsSwapSuccess(false), 2500);
    } else {
      setSwapError(res.error || 'Exchange failed');
    }
  };

  const handleCopyTransferReceipt = () => {
    if (!completedTransfer) return;
    const text = `NEXORA EXCHANGE TRANSFER RECEIPT
Status: Transfer Completed (You will get this payment shortly)
Reference: ${completedTransfer.referenceId}
Amount: $${completedTransfer.usdAmount.toFixed(2)} USD (Rs ${Math.round(completedTransfer.pkrAmount).toLocaleString()} PKR)
Destination: ${completedTransfer.bankName}
Beneficiary: ${completedTransfer.recipientName}
Account/IBAN: ${completedTransfer.accountNumber}
Date: ${new Date(completedTransfer.timestamp).toLocaleString()}
Network: 1Link PRISM / State Bank of Pakistan Raast Direct`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1 uppercase tracking-wider">
            <Repeat className="w-4 h-4" /> Global FX & Interbank Exchange Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Exchange Center
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interbank rate conversions and direct Pakistani bank transfers with zero fees
          </p>
        </div>

        {/* Live Total Balance Indicator */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-right">
            <span className="text-[10px] text-zinc-400 block">Total Balance Available</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {formatMoney(totalBalanceUSD, 'USD')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>1 USD = {usdToPkrRate.toFixed(2)} PKR</span>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex border-b border-zinc-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActiveTab('international_banks');
            setIntlSuccess(false);
          }}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'international_banks'
              ? 'border-black text-black bg-zinc-100 rounded-t-xl'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <span className="text-base">🌍</span>
          <span>International Banks & Wallets</span>
          <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-bold">
            Revolut • Payoneer • PayPal
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('currency_swap')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'currency_swap'
              ? 'border-black text-black bg-zinc-100 rounded-t-xl'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <Globe className="w-4 h-4 text-black" />
          <span>Global Currency Swap</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('pakistan_banks');
            setPkSuccess(false);
          }}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'pakistan_banks'
              ? 'border-black text-black bg-zinc-100 rounded-t-xl'
              : 'border-transparent text-zinc-500 hover:text-black'
          }`}
        >
          <span className="text-base">🇵🇰</span>
          <span>Pakistani Corridor</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
            Active SBP / 1Link
          </span>
        </button>
      </div>

      {/* TAB 1: PAKISTANI BANKS */}
      {activeTab === 'pakistan_banks' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 text-zinc-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-black shrink-0" />
            <div>
              <span className="font-bold block text-sm">Regulatory Corridor Compliance Notice</span>
              Direct settlement to Pakistani banks via State Bank of Pakistan (SBP) & 1Link. Monitored corridors (3 total): Pakistan 🇵🇰, India 🇮🇳, and China 🇨🇳.
            </div>
          </div>
          {!pkSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: TRANSFER FORM (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                      🇵🇰
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Exchange & Send to Pakistani Bank</h3>
                      <p className="text-xs text-zinc-400">Direct settlement via State Bank of Pakistan (SBP) & 1Link</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    0% Exchange Fee
                  </span>
                </div>

                {pkError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{pkError}</span>
                  </div>
                )}

                {isProcessingTransfer ? (
                  <div className="py-6 px-4 space-y-6 text-center">
                    {/* 5-second countdown progress circle */}
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-zinc-800"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * transferProgress) / 100}
                          strokeLinecap="round"
                          className="text-emerald-400 transition-all duration-75"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black font-mono text-white">
                          {transferSecondsLeft}s
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          Delay
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>Taking 5 sec before transfer</span>
                      </div>
                      <h3 className="text-xl font-black text-white">
                        Clearing Interbank Transfer
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        Security PIN verified. Sending{' '}
                        <strong className="text-white">${calculatedUsdAmount.toFixed(2)} USD</strong> (Rs {Math.round(calculatedPkrAmount).toLocaleString()} PKR) to{' '}
                        <strong className="text-emerald-400">{selectedBank.name}</strong>.
                      </p>
                    </div>

                    {/* Live Progress Bar & Stage */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2.5 text-left">
                      <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                        <span>Interbank Clearing Status:</span>
                        <span className="font-mono text-emerald-400 font-bold">{transferProgress}% Complete</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-75"
                          style={{ width: `${transferProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-indigo-300 font-medium text-xs pt-1">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-indigo-400" />
                        <span>{processingStageText}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleCancelTransferCountdown}
                        className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Cancel Transfer
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInitiatePakistanTransfer} className="space-y-5">
                    {/* WRITE AMOUNT INPUT */}
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-300 uppercase tracking-wider">
                          Write Amount to Transfer
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400">
                            Total Balance:{' '}
                            <strong className="text-emerald-400 font-mono">
                              {formatMoney(totalBalanceUSD, 'USD')}
                            </strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-zinc-400 font-bold text-lg">
                            {pkAmountMode === 'USD' ? '$' : 'Rs'}
                          </span>
                          <input
                            type="number"
                            step="any"
                            min="1"
                            required
                            value={pkTransferAmount || ''}
                            onChange={(e) => setPkTransferAmount(parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            id="pakistan-transfer-amount-input"
                            className="w-full bg-zinc-950 border border-zinc-750 focus:border-indigo-500 rounded-xl py-3 pl-8 pr-4 text-2xl font-bold font-mono text-white outline-none"
                          />
                        </div>

                        {/* Currency Toggle Buttons */}
                        <div className="flex rounded-xl bg-zinc-800 p-1 border border-zinc-700 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPkAmountMode('USD')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              pkAmountMode === 'USD'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            USD ($)
                          </button>
                          <button
                            type="button"
                            onClick={() => setPkAmountMode('PKR')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              pkAmountMode === 'PKR'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            PKR (Rs)
                          </button>
                        </div>
                      </div>

                      {/* Live FX Calculation Callout */}
                      <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-zinc-400 block text-[11px]">Converted Interbank Value:</span>
                          <span className="font-mono font-bold text-white text-sm">
                            {pkAmountMode === 'USD' ? (
                              <>
                                ≈ <strong className="text-emerald-400">Rs {Math.round(calculatedPkrAmount).toLocaleString()} PKR</strong>
                              </>
                            ) : (
                              <>
                                ≈ <strong className="text-indigo-300">${calculatedUsdAmount.toFixed(2)} USD</strong> deducted from total balance
                              </>
                            )}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block">Guaranteed Rate</span>
                          <span className="font-mono text-xs text-indigo-300 font-semibold">
                            1 USD = {usdToPkrRate.toFixed(2)} PKR
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* SELECTED BANK DISPLAY */}
                    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-300 uppercase tracking-wider">
                          Destination Pakistani Bank
                        </span>
                        <span className="text-indigo-400 font-medium text-[11px]">
                          Choose from 27 banks on the right →
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-zinc-950 border border-indigo-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {selectedBank.code}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center gap-2">
                              {selectedBank.name}
                              <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-normal border border-zinc-700">
                                {selectedBank.category}
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400 font-mono">
                              Bank Code: {selectedBank.code} • 1Link & Raast Instant Transfer
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                            Active Bank
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BENEFICIARY DETAILS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">
                          Beneficiary Account Title (Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. Muhammad Ali"
                          id="recipient-name-input"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-zinc-300">
                          Account Number / IBAN *
                        </label>
                        <input
                          type="text"
                          required
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          placeholder="e.g. PK36 MEZN 0001 2345 6789 0101"
                          id="recipient-account-input"
                          className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl py-2.5 px-3.5 text-xs text-white font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Payment Reference / Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={transferNote}
                        onChange={(e) => setTransferNote(e.target.value)}
                        placeholder="e.g. Family maintenance, invoice settlement"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl py-2.5 px-3.5 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Summary Callout */}
                    <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-1.5">
                      <div className="flex justify-between text-zinc-300">
                        <span>Deduction from Total Balance:</span>
                        <strong className="text-white font-mono">
                          ${calculatedUsdAmount.toFixed(2)} USD
                        </strong>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Recipient Receives in PKR:</span>
                        <strong className="text-emerald-400 font-mono font-bold">
                          Rs {Math.round(calculatedPkrAmount).toLocaleString()} PKR
                        </strong>
                      </div>
                      <div className="flex justify-between text-zinc-400 text-[11px] pt-1 border-t border-zinc-800">
                        <span>Remaining Balance After Transfer:</span>
                        <span className="font-mono text-zinc-300">
                          ${Math.max(0, totalBalanceUSD - calculatedUsdAmount).toFixed(2)} USD
                        </span>
                      </div>
                    </div>

                    {/* SEND TRANSFER BUTTON */}
                    <button
                      type="submit"
                      id="send-transfer-button"
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        Send Transfer (${calculatedUsdAmount.toFixed(2)} USD to {selectedBank.shortName})
                      </span>
                    </button>
                  </form>
                )}
              </div>

              {/* RIGHT COLUMN: SHOW ALL PAKISTANI BANKS (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-sm">All Pakistani Banks ({ALL_PAKISTANI_BANKS.length})</h3>
                  </div>
                  <span className="text-[11px] text-zinc-400">Click bank to select</span>
                </div>

                {/* Bank Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bankSearchQuery}
                    onChange={(e) => setBankSearchQuery(e.target.value)}
                    placeholder="Search Pakistani banks (e.g. Meezan, HBL, UBL)..."
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white outline-none placeholder-zinc-500"
                  />
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                  {['all', 'Major Commercial', 'Islamic Banking', 'Digital & Wallets', 'Public / Provincial'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBankCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 text-[11px] transition-all cursor-pointer ${
                        bankCategoryFilter === cat
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>

                {/* Scrollable Grid of All Pakistani Banks */}
                <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredBanks.map((bank) => {
                    const isSelected = bank.id === selectedBankId;
                    return (
                      <div
                        key={bank.id}
                        onClick={() => setSelectedBankId(bank.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 ring-1 ring-indigo-500 shadow-md'
                            : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bank.color} flex items-center justify-center text-white font-mono font-black text-xs shrink-0 shadow-sm`}
                          >
                            {bank.code.slice(0, 4)}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white flex items-center gap-1.5">
                              {bank.name}
                              {bank.popular && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                                  Popular
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono">
                              {bank.category} • Code: {bank.code}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredBanks.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      No Pakistani bank matches "{bankSearchQuery}".
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TRANSFER COMPLETED VIEW (REQUESTED) */
            <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0D0D0D] border-2 border-emerald-500/40 shadow-2xl space-y-6 text-center">
              {/* Glowing Success Badge */}
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-11 h-11 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5" /> Transfer Authorized & Cleared
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Transfer Completed!
                </h2>

                {/* PROMINENT REQUESTED BANNER */}
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm sm:text-base font-extrabold max-w-lg mx-auto shadow-inner">
                  🎉 You will get this payment shortly
                </div>

                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  The amount has been deducted from your total balance and dispatched via the State Bank of Pakistan interbank clearing network.
                </p>
              </div>

              {/* Itemized Transfer Receipt */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-left text-xs space-y-2.5 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Transaction Reference:</span>
                  <span className="font-bold text-indigo-400">{completedTransfer?.referenceId}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Amount Cut from Total Balance:</span>
                  <span className="font-extrabold text-white text-sm">
                    -${completedTransfer?.usdAmount.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Converted Payout (PKR):</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    Rs {Math.round(completedTransfer?.pkrAmount || 0).toLocaleString()} PKR
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Destination Bank:</span>
                  <span className="font-bold text-zinc-200">{completedTransfer?.bankName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Beneficiary:</span>
                  <span className="font-bold text-zinc-200">{completedTransfer?.recipientName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Account / IBAN:</span>
                  <span className="text-zinc-300">{completedTransfer?.accountNumber}</span>
                </div>

                <div className="flex justify-between items-center pt-1 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 font-sans font-medium">New Total Balance:</span>
                  <span className="font-extrabold text-indigo-300 text-sm">
                    {formatMoney(totalBalanceUSD, 'USD')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCopyTransferReceipt}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedReceipt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Receipt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-400" />
                      <span>Copy Transfer Receipt</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPkSuccess(false);
                    setCompletedTransfer(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Make Another Transfer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INTERNATIONAL BANKS & WALLETS (Revolut, Payoneer, PayPal, etc.) */}
      {activeTab === 'international_banks' && (
        <div className="space-y-6">
          {!intlSuccess ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: TRANSFER FORM (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      🌍
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">International Payments & Neo-Banks</h3>
                      <p className="text-xs text-zinc-400">Direct payouts via Revolut, Payoneer, PayPal, Wise, and Global Commercial Banks</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    0% Platform Fee
                  </span>
                </div>

                {intlError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{intlError}</span>
                  </div>
                )}

                {isProcessingIntl ? (
                  <div className="py-6 px-4 space-y-6 text-center">
                    {/* 5-second countdown progress circle */}
                    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="6"
                          className="text-zinc-800"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          stroke="currentColor"
                          strokeWidth="6"
                          strokeDasharray={264}
                          strokeDashoffset={264 - (264 * intlProgress) / 100}
                          strokeLinecap="round"
                          className="text-blue-400 transition-all duration-75"
                          fill="transparent"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black font-mono text-white">
                          {intlSecondsLeft}s
                        </span>
                        <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          Delay
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        Processing International Transfer...
                      </h4>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        {intlStageText}
                      </p>
                    </div>

                    {/* Stage Visualizer */}
                    <div className="max-w-md mx-auto p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-left text-xs">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Cleared Delay:</span>
                        <span className="font-mono font-bold text-blue-400">{intlProgress}% Complete</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-75 rounded-full"
                          style={{ width: `${intlProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                        <span>PIN Authorization</span>
                        <span>{selectedIntlProvider.name} Clearing</span>
                        <span>Balance Deduction</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelIntlCountdown}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
                    >
                      Cancel Transfer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInitiateIntlTransfer} className="space-y-4">
                    {/* Step 1: Provider Category Selector & Search */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          1. Select International Bank or Payout Service
                        </label>
                        <div className="flex items-center gap-1">
                          {(['all', 'Global Fintech', 'Neobanks', 'Global Commercial'] as const).map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setIntlCategoryFilter(cat)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
                                intlCategoryFilter === cat
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {cat === 'all' ? 'All' : cat === 'Global Fintech' ? 'PayPal & Fintech' : cat === 'Neobanks' ? 'Revolut & Neobanks' : 'Global Banks'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search Provider */}
                      <div className="relative mb-2.5">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={intlSearchQuery}
                          onChange={(e) => setIntlSearchQuery(e.target.value)}
                          placeholder="Search Revolut, Payoneer, PayPal, Wise, Chase..."
                          className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Providers Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                        {filteredIntlProviders.map((p) => {
                          const isSelected = selectedIntlId === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectIntlProvider(p)}
                              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 relative overflow-hidden ${
                                isSelected
                                  ? 'bg-gradient-to-br from-blue-950/40 to-zinc-900 border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-600/10'
                                  : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
                                    {p.code.substring(0, 3)}
                                  </div>
                                  <span className="text-xs font-bold text-white truncate">
                                    {p.shortName}
                                  </span>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 truncate">
                                {p.badge}
                              </p>
                              {p.popular && (
                                <span className="absolute -top-1 -right-1 bg-amber-500/20 text-amber-300 text-[8px] font-mono px-1.5 py-0.5 rounded-bl-lg font-bold border-b border-l border-amber-500/30">
                                  POPULAR
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Beneficiary Details */}
                    <div className="space-y-3 pt-1">
                      <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                        2. Beneficiary Details ({selectedIntlProvider.name})
                      </label>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                          Beneficiary Full Name / Account Holder
                        </label>
                        <input
                          type="text"
                          required
                          value={intlRecipientName}
                          onChange={(e) => setIntlRecipientName(e.target.value)}
                          placeholder="e.g. Alex Rivera, John Smith"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-zinc-400 mb-1 flex items-center justify-between">
                          <span>{selectedIntlProvider.accountLabel} *</span>
                          <span className="text-[10px] text-blue-400 font-mono">
                            {selectedIntlProvider.badge}
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={intlAccountIdentifier}
                          onChange={(e) => setIntlAccountIdentifier(e.target.value)}
                          placeholder={selectedIntlProvider.accountPlaceholder}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Step 3: Amount & Currency Selection */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          3. Transfer Amount
                        </span>
                        <div className="text-[11px] text-zinc-400">
                          Available USD:{' '}
                          <span className="font-bold text-white font-mono">
                            {formatMoney(usdWallet.balance, 'USD')}
                          </span>
                        </div>
                      </div>

                      {/* Currency Mode & Target Currency selection */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex p-1 rounded-xl bg-zinc-800 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => setIntlAmountMode('USD')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              intlAmountMode === 'USD'
                                ? 'bg-blue-600 text-white'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Send in USD ($)
                          </button>
                          <button
                            type="button"
                            onClick={() => setIntlAmountMode('TARGET')}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              intlAmountMode === 'TARGET'
                                ? 'bg-cyan-600 text-white'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            Receive in {intlCurrency}
                          </button>
                        </div>

                        {/* Supported Currencies Picker */}
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <span>Target Currency:</span>
                          <select
                            value={intlCurrency}
                            onChange={(e) => setIntlCurrency(e.target.value)}
                            className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-xs font-bold text-white cursor-pointer focus:outline-none focus:border-blue-500"
                          >
                            {selectedIntlProvider.supportedCurrencies.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-2 text-zinc-400 font-mono font-bold text-sm">
                            {intlAmountMode === 'USD' ? '$' : intlCurrency}
                          </span>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            value={intlTransferAmount || ''}
                            onChange={(e) => setIntlTransferAmount(Number(e.target.value))}
                            className="w-full pl-9 pr-3.5 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm sm:text-base font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        {/* Quick Presets */}
                        <div className="flex gap-1.5">
                          {[50, 100, 250, 500].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setIntlTransferAmount(preset)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono font-semibold text-zinc-300 transition-colors"
                            >
                              ${preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conversion readout */}
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">
                          {intlAmountMode === 'USD'
                            ? `Beneficiary Receives (${selectedIntlProvider.shortName}):`
                            : 'USD Balance Deducted:'}
                        </span>
                        <div className="font-mono font-bold text-right">
                          {intlAmountMode === 'USD' ? (
                            <span className="text-blue-400">
                              {calculatedIntlTarget.toFixed(2)} {intlCurrency}
                            </span>
                          ) : (
                            <span className="text-white">
                              ${calculatedIntlUsd.toFixed(2)} USD
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Reference Note */}
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Transfer Purpose / Remittance Note
                      </label>
                      <input
                        type="text"
                        value={intlNote}
                        onChange={(e) => setIntlNote(e.target.value)}
                        placeholder="e.g. Freelance Consulting Payout, Software Services"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send ${calculatedIntlUsd.toFixed(2)} USD via {selectedIntlProvider.name}</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>

                    <p className="text-center text-[10px] text-zinc-500">
                      Protected by 5-digit Transaction PIN authorization and 5-second instant security clearance.
                    </p>
                  </form>
                )}
              </div>

              {/* RIGHT COLUMN: PROVIDER OVERVIEW & SPECS (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Active Provider Card */}
                <div className="p-5 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedIntlProvider.color} flex items-center justify-center text-sm font-black text-white shadow-md`}>
                        {selectedIntlProvider.code}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {selectedIntlProvider.name}
                        </h4>
                        <span className="text-[10px] text-blue-400 font-medium">
                          {selectedIntlProvider.category}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
                      {selectedIntlProvider.clearingTime}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedIntlProvider.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Payment Rails:</span>
                      <span className="text-zinc-200 font-semibold font-mono text-[11px]">{selectedIntlProvider.processingNetwork}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Supported Currencies:</span>
                      <span className="text-zinc-200 font-mono text-[11px]">
                        {selectedIntlProvider.supportedCurrencies.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Transfer Fee:</span>
                      <span className="text-emerald-400 font-bold">$0.00 USD (Zero Fee)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Live Rate (USD to {intlCurrency}):</span>
                      <span className="text-blue-400 font-mono font-bold">
                        1 USD = {targetFxRate.toFixed(4)} {intlCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Popular International Rails Info */}
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Global Payout Guarantees</span>
                  </div>
                  <ul className="text-zinc-400 space-y-1.5 text-[11px] list-disc list-inside">
                    <li><strong className="text-zinc-300">Revolut:</strong> Direct transfer to @Revtag handles or European SEPA IBANs</li>
                    <li><strong className="text-zinc-300">Payoneer:</strong> Payout to freelancer email accounts or global receiving IDs</li>
                    <li><strong className="text-zinc-300">PayPal:</strong> Instant push to verified PayPal accounts worldwide</li>
                    <li><strong className="text-zinc-300">Wise & Global Banks:</strong> Mid-market FX conversion with instant local rail routing</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* INTERNATIONAL SUCCESS VIEW */
            <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-2xl space-y-6 animate-in fade-in duration-300">
              {/* SUCCESS BANNER */}
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-300 uppercase tracking-wide">
                    Transfer Completed! You will get this payment shortly
                  </h3>
                  <p className="text-xs text-emerald-400/90">
                    Payment successfully authorized and routed to {completedIntlTransfer?.providerName}.
                  </p>
                </div>
              </div>

              {/* Receipt Breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Transaction Reference:</span>
                  <span className="font-mono font-bold text-blue-400">{completedIntlTransfer?.referenceId}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Deducted USD Balance:</span>
                  <span className="font-mono font-bold text-white text-sm">
                    ${completedIntlTransfer?.usdAmount.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Payout Amount:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {completedIntlTransfer?.receivedAmount.toFixed(2)} {completedIntlTransfer?.targetCurrency}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Payout Destination:</span>
                  <span className="font-bold text-zinc-200">{completedIntlTransfer?.providerName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Beneficiary:</span>
                  <span className="font-bold text-zinc-200">{completedIntlTransfer?.recipientName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Account / Handle:</span>
                  <span className="font-mono text-zinc-300">{completedIntlTransfer?.accountIdentifier}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Clearing Network:</span>
                  <span className="text-zinc-300 font-mono text-[11px]">{completedIntlTransfer?.network}</span>
                </div>

                <div className="flex justify-between items-center pt-1 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800">
                  <span className="text-zinc-400 font-sans font-medium">New Total Balance:</span>
                  <span className="font-extrabold text-blue-300 text-sm">
                    {formatMoney(totalBalanceUSD, 'USD')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleCopyIntlReceipt}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedReceipt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Receipt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-blue-400" />
                      <span>Copy Payment Receipt</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIntlSuccess(false);
                    setCompletedIntlTransfer(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Repeat className="w-4 h-4" />
                  <span>Make Another Transfer</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GLOBAL CURRENCY SWAP */}
      {activeTab === 'currency_swap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CONVERSION PANEL (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-bold text-white text-base">Instant Currency Swap</h3>
              <span className="text-xs font-mono text-indigo-400 font-bold">
                1 {fromCurrency} = {swapRate.toFixed(4)} {toCurrency}
              </span>
            </div>

            {swapError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {swapError}
              </div>
            )}

            {isSwapSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Conversion executed instantly at guaranteed rate!</span>
              </div>
            )}

            <form onSubmit={handleExecuteSwap} className="space-y-4">
              {/* SELL INPUT */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>You Convert (Sell)</span>
                  <span>
                    Available:{' '}
                    <strong className="text-zinc-200">
                      {formatMoney(fromWallet?.balance || 0, fromCurrency)}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent text-2xl font-bold font-mono text-white focus:outline-none"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {GLOBAL_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SWAP FLIPPER */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-indigo-400 shadow-md transition-transform hover:rotate-180 cursor-pointer"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
              </div>

              {/* RECEIVE PREVIEW */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>You Receive (Estimated)</span>
                  <span className="text-indigo-400 font-medium">Interbank Mid-Market Rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-full text-2xl font-bold font-mono text-indigo-400 truncate">
                    {swapReceivedAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none cursor-pointer"
                  >
                    {GLOBAL_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Savings Callout */}
              <div className="p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-xs space-y-1">
                <div className="flex justify-between font-semibold text-indigo-300">
                  <span>Traditional Bank Hidden Markups:</span>
                  <span className="line-through text-zinc-400">
                    {formatMoney(traditionalBankMarkupFee, fromCurrency)}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold">
                  <span>NEXORA Zero-Markup Savings:</span>
                  <span className="text-indigo-400">+{formatMoney(userSavings, fromCurrency)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Confirm Currency Exchange
              </button>
            </form>
          </div>

          {/* HISTORICAL CHART & PAIRS MATRIX (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Rate Trend Chart */}
            <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">
                    {fromCurrency} to {toCurrency} Historical Rate Trend (30 Days)
                  </h3>
                  <p className="text-xs text-zinc-400">Real-time interbank rate analytics</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-indigo-400 font-semibold">+1.8% past 30d</span>
                </div>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      FX_HISTORICAL_DATA[`${fromCurrency}/${toCurrency}`] ||
                      FX_HISTORICAL_DATA['USD/EUR'] || [
                        { date: 'Aug 1', rate: swapRate * 0.98 },
                        { date: 'Aug 8', rate: swapRate * 0.99 },
                        { date: 'Aug 15', rate: swapRate * 1.01 },
                        { date: 'Aug 22', rate: swapRate * 0.995 },
                        { date: 'Aug 28', rate: swapRate },
                      ]
                    }
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fxGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
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
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0D0D0D',
                        borderColor: '#27272A',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#FFF',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#6366F1"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#fxGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Popular Pairs Grid */}
            <div className="p-6 rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base">Popular Global FX Pairs</h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {POPULAR_EXCHANGE_PAIRS.map((pair) => {
                  const pRate = getExchangeRate(pair.from, pair.to);
                  return (
                    <button
                      key={`${pair.from}-${pair.to}`}
                      onClick={() => {
                        setFromCurrency(pair.from);
                        setToCurrency(pair.to);
                      }}
                      className="p-3 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-300 group-hover:text-indigo-400">
                        <span>{pair.label}</span>
                        <span className="text-[10px] text-indigo-400">+0.2%</span>
                      </div>
                      <div className="text-sm font-extrabold font-mono text-white mt-1">
                        {pRate.toFixed(4)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY PIN AUTHORIZATION MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0D0D0D] border border-zinc-800 shadow-2xl p-6 text-zinc-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Security PIN Required</h3>
                  <p className="text-xs text-zinc-400">
                    {pinTransferType === 'pakistan'
                      ? 'Authorize Pakistani Bank Transfer'
                      : `Authorize ${selectedIntlProvider.name} Payment`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transfer Summary Pill */}
            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5">
              {pinTransferType === 'pakistan' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Transfer Amount:</span>
                    <strong className="text-white font-mono">
                      ${calculatedUsdAmount.toFixed(2)} USD (Rs {Math.round(calculatedPkrAmount).toLocaleString()} PKR)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Recipient Bank:</span>
                    <span className="text-zinc-200 font-medium">{selectedBank.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Beneficiary:</span>
                    <span className="text-zinc-200">{recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Account / IBAN:</span>
                    <span className="font-mono text-zinc-300">{accountNumber}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Transfer Amount:</span>
                    <strong className="text-white font-mono">
                      ${calculatedIntlUsd.toFixed(2)} USD (≈ {calculatedIntlTarget.toFixed(2)} {intlCurrency})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Destination Service:</span>
                    <span className="text-blue-400 font-medium">{selectedIntlProvider.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Beneficiary:</span>
                    <span className="text-zinc-200">{intlRecipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{selectedIntlProvider.accountLabel}:</span>
                    <span className="font-mono text-zinc-300">{intlAccountIdentifier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Settlement Network:</span>
                    <span className="text-zinc-400 font-mono text-[11px]">{selectedIntlProvider.processingNetwork}</span>
                  </div>
                </>
              )}
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{pinError}</span>
              </div>
            )}

            {/* PIN Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-300">
                Enter 5-digit Transaction PIN *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-indigo-500 rounded-xl py-3 pl-10 pr-10 text-center font-mono text-xl tracking-widest text-white outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmPinAndStartTransfer();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPinText(!showPinText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  {showPinText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick Fill Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-500">Default PIN: 78800</span>
                <button
                  type="button"
                  onClick={() => {
                    setSecurityPin('78800');
                    setPinError(null);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                >
                  Auto-fill 78800
                </button>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              <span>After authorizing, a 5-second security verification will run before cutting the total balance and issuing payment.</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPinAndStartTransfer}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize Transfer</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
