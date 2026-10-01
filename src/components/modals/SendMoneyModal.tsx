import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  User,
  Globe,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Share2,
  Download,
  CreditCard,
  Layers,
  Sparkles,
  Info,
  Smartphone,
  Building2,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Loader2,
  Calendar,
  CalendarClock,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Ban,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../../data/currencies';
import { Transaction } from '../../types';
import {
  AVAILABLE_COUNTRIES,
  RESTRICTED_COUNTRIES,
  isCountryRestricted,
  getRestrictedCountry,
  AvailableCountry,
  RestrictedCountry,
} from '../../data/restrictedCountries';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipientName?: string;
  defaultCurrency?: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  category: 'international_bank' | 'wallet' | 'wire';
  badge: string;
  logoText: string;
  description: string;
  accountLabel: string;
  placeholder: string;
}

// International Banks and Payment Services requested by user
export const INTERNATIONAL_PAYMENT_PROVIDERS: PaymentProvider[] = [
  {
    id: 'revolut',
    name: 'Revolut',
    category: 'international_bank',
    badge: 'Digital Bank',
    logoText: 'R',
    description: 'Instant transfer via Revtag (@username), phone, or IBAN',
    accountLabel: 'Revolut Revtag (@username) or IBAN',
    placeholder: '@alex.revolut or GB29 REVO 0099 1234 5678',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    category: 'international_bank',
    badge: 'Global Payout',
    logoText: 'P',
    description: 'Payoneer Account ID, registered email or Global Payment Service',
    accountLabel: 'Payoneer Registered Email / Account ID',
    placeholder: 'beneficiary@payoneer-client.com or ID: 8849201',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    category: 'wallet',
    badge: 'Instant Transfer',
    logoText: 'PP',
    description: 'Direct PayPal.Me link, PayPal balance, or registered email',
    accountLabel: 'PayPal Email / PayPal.Me Handle',
    placeholder: 'paypal.me/recipient or recipient@domain.com',
  },
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    category: 'international_bank',
    badge: 'Multi-Currency',
    logoText: 'W',
    description: 'Zero-markup borderless payout via Wise multi-currency routing',
    accountLabel: 'Wise Tag / Email / Local Account Number',
    placeholder: 'user@wise.com or routing number',
  },
  {
    id: 'bank_wire',
    name: 'Direct Bank Wire (SWIFT / SEPA)',
    category: 'wire',
    badge: 'Commercial Bank',
    logoText: '🏛️',
    description: 'Direct international clearing via SWIFT/BIC & national IBAN',
    accountLabel: 'Account Number / 24-Digit IBAN',
    placeholder: 'US03 9928 0019 2819 0029 or DE89...',
  },
];

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  defaultRecipientName,
  defaultCurrency,
}) => {
  const {
    wallets,
    sendMoney,
    formatMoney,
    getExchangeRate,
    userProfile,
  } = useBanking();

  const [step, setStep] = useState<'form' | 'confirm' | 'processing' | 'success'>('form');

  // Country Selection (Default to Pakistan - 1 of 7 configured corridors)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('PK');
  const [countryTab, setCountryTab] = useState<'available' | 'restricted'>('available');
  const [countrySearch, setCountrySearch] = useState('');

  // Payment Provider Selection
  const [selectedProviderId, setSelectedProviderId] = useState<string>('revolut');

  // Form Fields
  const [recipientName, setRecipientName] = useState(defaultRecipientName || '');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState<number>(100);
  const [currencyMode, setCurrencyMode] = useState<string>('USD');
  const [note, setNote] = useState('Invoice / International Transfer');
  const [purpose, setPurpose] = useState('Services / Commercial');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Security PIN and processing states
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [processingSecondsLeft, setProcessingSecondsLeft] = useState(4);

  const usdWallet = wallets.find((w) => w.currencyCode === 'USD') || wallets[0];

  // Resolve selected country object
  const activeAvailableCountry = AVAILABLE_COUNTRIES.find((c) => c.code === selectedCountryCode);
  const activeRestrictedCountry = RESTRICTED_COUNTRIES.find((c) => c.code === selectedCountryCode);
  const isSelectedCountryRestricted = isCountryRestricted(selectedCountryCode) || !!activeRestrictedCountry;

  const currentCountryObj = activeAvailableCountry || activeRestrictedCountry || AVAILABLE_COUNTRIES[0];
  const activeProvider = INTERNATIONAL_PAYMENT_PROVIDERS.find((p) => p.id === selectedProviderId) || INTERNATIONAL_PAYMENT_PROVIDERS[0];

  // 5-Second Processing Effect before displaying payment receipt
  useEffect(() => {
    if (step !== 'processing') return;

    const TOTAL_MS = 4500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgressPercent(progress);

      const secLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
      setProcessingSecondsLeft(secLeft);

      if (elapsed >= TOTAL_MS) {
        clearInterval(interval);
        // Execute transfer in banking context
        const result = sendMoney({
          recipientName,
          recipientAccount,
          recipientCountry: currentCountryObj.name,
          recipientCurrency: currentCountryObj.currency,
          amount: Number(amount.toFixed(2)),
          sourceCurrency: 'USD',
          note: `${activeProvider.name} - ${purpose} (${note})`,
          transferType: 'international',
          fee: 0.0,
          provider: activeProvider.name,
        });

        if (result.success && result.transaction) {
          setCompletedTx(result.transaction);
          setStep('success');
        } else {
          setErrorMessage(result.error || 'Transfer could not be processed. Please check compliance restrictions.');
          setStep('form');
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    step,
    recipientName,
    recipientAccount,
    currentCountryObj,
    amount,
    activeProvider,
    purpose,
    note,
    sendMoney,
  ]);

  if (!isOpen) return null;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict compliance block for corridors outside the 2 configured territories
    if (isSelectedCountryRestricted) {
      setErrorMessage(
        `⛔ Outward Payments Unavailable: Transfers are restricted to the 2 configured corridors: Pakistan and India.`
      );
      return;
    }

    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient / beneficiary account title.');
      return;
    }
    if (!recipientAccount.trim()) {
      setErrorMessage(`Please enter recipient account info for ${activeProvider.name}.`);
      return;
    }
    if (amount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    if (!usdWallet || usdWallet.balance < amount) {
      setErrorMessage(
        `Insufficient balance. You have ${formatMoney(usdWallet?.balance || 0, 'USD')} available.`
      );
      return;
    }

    setStep('confirm');
  };

  const handleExecuteTransfer = () => {
    if (!securityPin || securityPin.trim().length < 4) {
      setPinError('Security PIN is required to authorize payment (Default PIN: 78800).');
      return;
    }

    setPinError(null);
    setProgressPercent(0);
    setProcessingSecondsLeft(4);
    setStep('processing');
  };

  const handleCopyRef = () => {
    if (completedTx?.referenceId) {
      navigator.clipboard.writeText(completedTx.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCopyFullReceipt = () => {
    if (!completedTx) return;
    const text = [
      '------------------------------------------------',
      '        NEXORA INTERNATIONAL SETTLEMENT RECEIPT ',
      '------------------------------------------------',
      `Reference ID:    ${completedTx.referenceId}`,
      `Status:          COMPLETED & SETTLED`,
      `Date & Time:     ${new Date(completedTx.timestamp).toLocaleString()}`,
      `Sender:          ${userProfile.fullName} (${userProfile.email})`,
      `Beneficiary:     ${recipientName}`,
      `Account / ID:    ${recipientAccount}`,
      `Provider:        ${activeProvider.name}`,
      `Destination:     ${currentCountryObj.name} (${currentCountryObj.currency})`,
      `Amount Sent:     $${completedTx.amount.toFixed(2)} USD`,
      `Transfer Fee:    $0.00 USD (Zero Fee)`,
      `Remaining Bal:   ${formatMoney(usdWallet.balance, 'USD')}`,
      '------------------------------------------------',
      'Authorized under Nexora International Banking Protocol',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const handleDownloadScreenshot = () => {
    if (!completedTx) return;
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 800;
      canvas.height = 1080;

      const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      // Crisp White Canvas with Black Accents
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Status Bar at top
      ctx.fillStyle = '#71717A';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('09:41', 50, 40);
      ctx.textAlign = 'right';
      ctx.fillText('5G • 100% 🔋', 750, 40);
      ctx.textAlign = 'left';

      // Digital Card Voucher (High contrast black border)
      ctx.fillStyle = '#FAFAFA';
      drawRoundRect(40, 60, 720, 970, 24);
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Brand Header
      ctx.fillStyle = '#000000';
      ctx.font = '900 28px sans-serif';
      ctx.fillText('NEXORA', 75, 120);

      ctx.fillStyle = '#18181B';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('• VERIFIED TRANSACTION', 725, 115);
      ctx.textAlign = 'left';

      // Divider
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(75, 145);
      ctx.lineTo(725, 145);
      ctx.stroke();

      // Checkmark Circle Badge
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(400, 220, 44, 0, Math.PI * 2);
      ctx.fill();

      // Checkmark tick
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(384, 220);
      ctx.lineTo(396, 232);
      ctx.lineTo(418, 206);
      ctx.stroke();

      // Heading
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Payment Successfully Dispatched', 400, 300);

      // Amount
      ctx.fillStyle = '#000000';
      ctx.font = '900 48px monospace';
      ctx.fillText(`$${completedTx.amount.toFixed(2)} USD`, 400, 360);

      // Details Box
      const boxY = 405;
      ctx.fillStyle = '#FFFFFF';
      drawRoundRect(75, boxY, 650, 440, 16);
      ctx.fill();
      ctx.strokeStyle = '#E4E4E7';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'left';
      const items = [
        ['Transaction Reference', completedTx.referenceId],
        ['Payment Timestamp', new Date(completedTx.timestamp).toLocaleString()],
        ['Sender Account', `${userProfile.fullName}`],
        ['Beneficiary Name', recipientName],
        ['Payment Provider', activeProvider.name],
        ['Recipient Account/Handle', recipientAccount],
        ['Destination Territory', `${currentCountryObj.flag} ${currentCountryObj.name}`],
        ['Transfer Fee', '$0.00 USD (Zero Fee)'],
        ['Settlement Status', 'Settled & Completed'],
      ];

      let rowY = boxY + 44;
      items.forEach(([lbl, val]) => {
        ctx.fillStyle = '#71717A';
        ctx.font = '13px sans-serif';
        ctx.fillText(lbl, 100, rowY);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(val, 700, rowY);
        ctx.textAlign = 'left';

        rowY += 44;
      });

      // Bottom Watermark
      ctx.fillStyle = '#71717A';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('End-to-End Cryptographically Signed • 256-Bit SSL Secured', 400, 990);

      // Download trigger
      const link = document.createElement('a');
      link.download = `Nexora_Receipt_${completedTx.referenceId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export payment screenshot', err);
    }
  };

  const handleCloseAndReset = () => {
    setStep('form');
    setErrorMessage(null);
    setSecurityPin('');
    onClose();
  };

  // Filtered countries for the modal
  const filteredAvailable = AVAILABLE_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredRestricted = RESTRICTED_COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh] text-zinc-900"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
                Send Money
                {isSelectedCountryRestricted && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold uppercase">
                    Restricted Destination
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                International transfers via Revolut, Payoneer, PayPal & Global Banks
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleProceedToConfirm} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
                  <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* 1. International Payment Provider Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">
                    1. Select International Bank / Provider
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    Revolut, Payoneer, PayPal supported
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INTERNATIONAL_PAYMENT_PROVIDERS.map((p) => {
                    const isSelected = selectedProviderId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProviderId(p.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md ring-2 ring-black/10'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                                isSelected ? 'bg-white text-black' : 'bg-zinc-200 text-zinc-900'
                              }`}
                            >
                              {p.logoText}
                            </span>
                            <span className="text-xs font-bold">{p.name}</span>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                              isSelected
                                ? 'bg-zinc-800 text-white border border-zinc-700'
                                : 'bg-zinc-200 text-zinc-800 border border-zinc-300'
                            }`}
                          >
                            {p.badge}
                          </span>
                        </div>
                        <p
                          className={`text-[10px] leading-tight ${
                            isSelected ? 'text-zinc-300' : 'text-zinc-500'
                          }`}
                        >
                          {p.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Destination Country & Corridor Status (2 Corridors) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                    <span>2. Destination Corridor</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white font-bold">
                      2 Corridors
                    </span>
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {AVAILABLE_COUNTRIES.length} Configured Regions
                  </span>
                </div>

                {/* Country Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search 2 corridors (Pakistan, India)..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                  />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Country Pills Grid (Strictly 2 Countries) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1.5 border border-zinc-200 rounded-2xl bg-zinc-50/70">
                  {filteredAvailable.length === 0 ? (
                    <div className="col-span-2 py-4 text-center text-xs text-zinc-400">
                      No country matches your search within the 2 configured corridors.
                    </div>
                  ) : (
                    filteredAvailable.map((c) => {
                      const isSelected = selectedCountryCode === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setSelectedCountryCode(c.code)}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-black text-white border-black font-bold shadow-md ring-2 ring-black/20'
                              : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="text-3xl">{c.flag}</span>
                          <span className="text-xs truncate max-w-full font-semibold">{c.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isSelected ? 'text-zinc-200' : 'text-zinc-500'
                              }`}
                            >
                              {c.currency}
                            </span>
                            <span
                              className={`text-[8px] px-1.5 py-0.5 rounded font-mono ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              Active
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Selected Corridor Info Banner */}
                <div className="mt-2.5 p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{currentCountryObj.flag}</span>
                    <div>
                      <div className="font-bold text-black text-[11px] flex items-center gap-1.5">
                        <span>Selected Corridor: {currentCountryObj.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black text-white font-mono font-bold">
                          {currentCountryObj.currency}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Configured corridor (1 of 2: Pakistan, India)
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    Compliant Route
                  </span>
                </div>
              </div>

              {/* 3. Beneficiary & Account Information */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  3. Recipient Information ({activeProvider.name})
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Beneficiary Account Title / Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      disabled={isSelectedCountryRestricted}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Johnathan Miller, Maria Santos"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    {activeProvider.accountLabel}
                  </label>
                  <div className="relative">
                    {activeProvider.category === 'wire' ? (
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    )}
                    <input
                      type="text"
                      required
                      disabled={isSelectedCountryRestricted}
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder={activeProvider.placeholder}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-black placeholder-zinc-400 focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Transfer Amount & Available Balance */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    4. Transfer Amount (USD)
                  </span>
                  <div className="text-[11px] text-zinc-500 font-medium">
                    Available Balance:{' '}
                    <span className="font-bold text-black font-mono">
                      {formatMoney(usdWallet.balance, 'USD')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-2.5 text-zinc-400 font-mono font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      disabled={isSelectedCountryRestricted}
                      value={amount || ''}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-lg font-black font-mono text-black focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex gap-1.5">
                    {[50, 100, 250, 500].map((v) => (
                      <button
                        key={v}
                        type="button"
                        disabled={isSelectedCountryRestricted}
                        onClick={() => setAmount(v)}
                        className="px-2.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purpose & Reference Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Purpose of Payment
                  </label>
                  <select
                    value={purpose}
                    disabled={isSelectedCountryRestricted}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed"
                  >
                    <option value="Services / Commercial">Services / Commercial</option>
                    <option value="Family Support">Family Support</option>
                    <option value="Software / IT Services">Software / IT Services</option>
                    <option value="Consulting / Freelance">Consulting / Freelance</option>
                    <option value="Education / Tuition">Education / Tuition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Reference / Memo (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isSelectedCountryRestricted}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Monthly project payout"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>
                    Transfer Fee: <strong className="text-black font-mono font-bold">$0.00 Free</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-black" />
                  <span>Instant Settlement</span>
                </div>
              </div>

              {/* Continue Button */}
              {isSelectedCountryRestricted ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 rounded-2xl bg-zinc-200 text-zinc-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Payments to {currentCountryObj.name} are Unavailable</span>
                  </button>
                  <p className="text-[11px] text-center text-zinc-500 font-medium">
                    Please switch to an approved destination (e.g. United States, United Kingdom, Eurozone) to proceed.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  id="send-proceed-confirm-btn"
                  className="w-full py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review & Authorize Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>
          )}

          {/* STEP 2: CONFIRM */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Confirm International Transfer
                </div>
                <div className="text-3xl font-black font-mono text-black">
                  ${amount.toFixed(2)} USD
                </div>
                <div className="text-xs font-semibold text-zinc-600">
                  Via {activeProvider.name} • {currentCountryObj.flag} {currentCountryObj.name}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 divide-y divide-zinc-200 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-zinc-500">Sender Account:</span>
                  <span className="font-bold text-black">{userProfile.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Beneficiary Title:</span>
                  <span className="font-bold text-black">{recipientName}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Provider & Network:</span>
                  <span className="font-bold text-black flex items-center gap-1.5">
                    {activeProvider.name} ({activeProvider.badge})
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Account / Handle:</span>
                  <span className="font-mono font-bold text-zinc-900">{recipientAccount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Destination:</span>
                  <span className="font-bold text-zinc-900">
                    {currentCountryObj.flag} {currentCountryObj.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Purpose:</span>
                  <span className="text-zinc-800">{purpose}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500">Transfer Fee:</span>
                  <span className="font-bold text-black font-mono">$0.00 (Zero Fee)</span>
                </div>
              </div>

              {/* Security PIN Authorization Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black block">
                        Enter Transaction Security PIN
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Enter your 5-digit PIN to release funds
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSecurityPin('78800');
                      setPinError(null);
                    }}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-black border border-zinc-200 transition-colors cursor-pointer font-bold"
                  >
                    Default PIN: 78800
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setSecurityPin(clean);
                      if (pinError) setPinError(null);
                    }}
                    placeholder="•••••"
                    id="send-transaction-pin-input"
                    className="w-full bg-white border border-zinc-300 focus:border-black rounded-xl py-3 px-4 text-center tracking-[0.6em] text-xl font-mono text-black placeholder-zinc-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Masked Dot Indicators */}
                <div className="flex justify-center items-center gap-3 pt-0.5">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isFilled = idx < securityPin.length;
                    return (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          isFilled
                            ? 'bg-black ring-4 ring-zinc-200 scale-110 shadow-xs'
                            : 'bg-zinc-200 border border-zinc-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {pinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{pinError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs border border-zinc-200 transition-colors cursor-pointer"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  id="confirm-execute-transfer-btn"
                  className="flex-1 py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Send ${amount.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 'processing' && (
            <div className="py-8 px-2 sm:px-4 text-center space-y-6" id="transfer-processing-screen">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-300 border-t-black animate-spin"></div>
                <div className="relative w-14 h-14 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Settling Cross-Border Payout • {processingSecondsLeft}s</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                  Sending ${amount.toFixed(2)} USD
                </h3>
                <p className="text-xs text-zinc-500">
                  To <strong className="text-black">{recipientName}</strong> via{' '}
                  <strong className="text-black">{activeProvider.name}</strong>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Authorizing</span>
                  <span className="font-bold text-black">{progressPercent}%</span>
                  <span>Generating Voucher</span>
                </div>
              </div>

              {/* Verification Steps */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span className="text-zinc-800 font-medium">Compliance & Sanctions Verified</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {progressPercent >= 50 ? (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-zinc-400 animate-spin shrink-0" />
                  )}
                  <span className={progressPercent >= 50 ? 'text-zinc-800 font-medium' : 'text-zinc-500'}>
                    Connecting to {activeProvider.name} Switch
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {progressPercent >= 90 ? (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"></div>
                  )}
                  <span className={progressPercent >= 90 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}>
                    Generating Cryptographic Receipt...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && completedTx && (
            <div className="space-y-5 py-1">
              <div
                id="transfer-receipt-screenshot-card"
                className="relative rounded-3xl bg-zinc-50 border-2 border-zinc-200 p-5 sm:p-6 shadow-xl text-left overflow-hidden text-black"
              >
                {/* Simulated Notch */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-black">09:41</span>
                    <span>•</span>
                    <span className="text-black font-semibold">Live Settlement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[10px] text-black font-bold">
                      5G
                    </span>
                    <span>100% 🔋</span>
                  </div>
                </div>

                {/* Voucher Header */}
                <div className="pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white font-black text-sm">
                      N
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-black tracking-wide">NEXORA</h4>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                        Official Payment Voucher
                      </span>
                    </div>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-zinc-200 border border-zinc-300 text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-black" /> Completed
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center py-4 space-y-1">
                  <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider block pt-2">
                    Payment Successfully Sent!
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-black font-mono tracking-tight">
                    ${completedTx.amount.toFixed(2)}{' '}
                    <span className="text-base font-bold text-zinc-500">USD</span>
                  </div>
                </div>

                {/* Details */}
                <div className="border-t border-dashed border-zinc-300 my-2 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Transaction ID:</span>
                    <button
                      type="button"
                      onClick={handleCopyRef}
                      className="flex items-center gap-1 font-mono font-bold text-black hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-zinc-200"
                    >
                      {completedTx.referenceId}
                      {copiedRef ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Beneficiary Name:</span>
                    <span className="font-bold text-black text-sm">{recipientName}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Payment Provider:</span>
                    <span className="font-bold text-black">
                      {activeProvider.name} ({activeProvider.badge})
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Account / Handle:</span>
                    <span className="font-mono font-bold text-black">{recipientAccount}</span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Destination:</span>
                    <span className="font-bold text-black">
                      {currentCountryObj.flag} {currentCountryObj.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-zinc-500">Transfer Fee:</span>
                    <span className="font-bold text-black font-mono">$0.00 USD (Zero Fee)</span>
                  </div>

                  <div className="flex justify-between items-center py-2 bg-white px-3 rounded-xl border border-zinc-200 mt-2">
                    <span className="text-zinc-600 font-medium">Remaining Total Balance:</span>
                    <span className="font-mono font-black text-black text-sm">
                      {formatMoney(usdWallet.balance, 'USD')}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-200 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-black shrink-0" />
                  <span>Verified Transfer • Secured by Nexora Global Clearing Network</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadScreenshot}
                    id="download-screenshot-btn"
                    className="flex-1 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Screenshot (PNG)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyFullReceipt}
                    id="copy-receipt-btn"
                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs border border-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedReceipt ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span>Receipt Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 text-black" />
                        <span>Copy Receipt Text</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  id="done-receipt-btn"
                  className="w-full py-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-black font-bold text-xs border border-zinc-200 transition-colors cursor-pointer text-center"
                >
                  Done & Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
