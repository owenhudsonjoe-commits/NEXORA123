import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Zap,
  Loader2,
  Sparkles,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface LinkMeezanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkMeezanModal: React.FC<LinkMeezanModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    linkedMeezanIban,
    isMeezanLinked,
    linkMeezanBank,
    unlinkMeezanBank,
  } = useBanking();

  const [ibanInput, setIbanInput] = useState(linkedMeezanIban || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIbanInput(linkedMeezanIban || '');
      setErrorMessage(null);
      setIsConnecting(false);
      setIsSuccess(false);
    }
  }, [isOpen, linkedMeezanIban]);

  if (!isOpen) return null;

  const handleFillSample = () => {
    setIbanInput('PK36 MEZN 0001 2345 6789 0101');
    setErrorMessage(null);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const clean = ibanInput.replace(/\s+/g, '').toUpperCase();
    if (!clean) {
      setErrorMessage('Please give your Meezan IBAN to connect.');
      return;
    }

    if (!clean.startsWith('PK') && !clean.includes('MEZN') && clean.length < 16) {
      setErrorMessage('Please enter a valid Meezan Bank IBAN (e.g. PK36 MEZN 0001 2345 6789 0101).');
      return;
    }

    setIsConnecting(true);

    // Simulate SBP Raast & Meezan Core Banking linking verification
    setTimeout(() => {
      setIsConnecting(false);
      const res = linkMeezanBank(ibanInput.trim());
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.error || 'Failed to connect Meezan Bank IBAN.');
      }
    }, 1200);
  };

  const handleUnlink = () => {
    unlinkMeezanBank();
    setIbanInput('');
    setIsSuccess(false);
  };

  const handleCopyIban = () => {
    if (linkedMeezanIban) {
      navigator.clipboard.writeText(linkedMeezanIban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden my-6 relative text-zinc-900"
      >
        {/* Header with Meezan Bank Partnership Branding */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 bg-gradient-to-r from-zinc-50 via-emerald-50/40 to-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-white flex items-center justify-center shadow-md border border-emerald-800">
              <span className="font-serif font-black text-xs text-emerald-300">MEZN</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Official Banking Affiliate
                </span>
                <span className="text-[11px] text-zinc-500 font-medium">SBP & 1Link Verified</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-black tracking-tight mt-0.5">
                Nexora is affiliated with Meezan Bank
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Partnership Trust Banner */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Nexora is affiliated with Meezan Bank Limited</strong> to provide certified Islamic banking, Raast instant interbank settlements, and seamless multi-currency disbursements across Pakistan.
            </p>
          </div>

          {/* Already Linked State */}
          {isMeezanLinked && !isSuccess ? (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                      Meezan Bank Account Connected
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-mono text-[10px] font-bold">
                    Active & Verified
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1">
                  <div className="text-[10px] text-zinc-500 uppercase font-semibold">Connected Meezan IBAN</div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-black tracking-wide">
                      {linkedMeezanIban}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyIban}
                      className="p-1 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                      title="Copy IBAN"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-emerald-900/80 pt-1">
                  <span>Account Holder: <strong>{userProfile.fullName}</strong></span>
                  <span>Network: <strong>Raast Instant P2P</strong></span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={handleUnlink}
                  className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            /* Success State after Linking */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-md border-2 border-emerald-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-black">Meezan Bank Account Connected</h4>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                  Your Meezan Bank IBAN has been verified and securely linked with your Nexora profile.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left font-mono text-xs space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between text-zinc-500 font-sans">
                  <span>Bank:</span>
                  <span className="text-black font-bold">Meezan Bank Limited</span>
                </div>
                <div className="flex justify-between text-zinc-500 font-sans">
                  <span>Title:</span>
                  <span className="text-black font-bold">{userProfile.fullName}</span>
                </div>
                <div className="flex justify-between text-zinc-500 font-sans">
                  <span>IBAN:</span>
                  <span className="text-emerald-700 font-bold">{ibanInput.trim()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          ) : (
            /* Input Form: "Give your Meezan IBAN to connect" */
            <form onSubmit={handleConnect} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Explicit User Prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-black text-black uppercase tracking-wide flex items-center gap-2">
                    <span>Give your Meezan IBAN to connect</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleFillSample}
                    className="text-[10px] font-mono font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    Use Sample IBAN
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500">
                  Please enter your 24-character Meezan Bank International Bank Account Number (IBAN) starting with <span className="font-mono font-bold text-zinc-800">PK36 MEZN...</span>
                </p>

                <div className="relative">
                  <Landmark className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={ibanInput}
                    onChange={(e) => {
                      setIbanInput(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="e.g. PK36 MEZN 0001 2345 6789 0101"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-300 focus:border-black rounded-xl text-xs sm:text-sm font-mono font-bold text-black placeholder-zinc-400 outline-none transition-colors uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* Account Holder Verified Tag */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Account Title:</span>
                <span className="font-bold text-black flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {userProfile.fullName}
                </span>
              </div>

              {/* Connect Button */}
              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3.5 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
                    <span>Verifying Meezan IBAN with SBP Raast...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Connect Meezan Bank Account</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Protected by State Bank of Pakistan (SBP) Raast Interoperability Rails</span>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
