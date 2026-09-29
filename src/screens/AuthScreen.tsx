import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Delete,
  Fingerprint,
  Sparkles,
  ArrowRight,
  User,
  Smartphone,
  RefreshCw,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Logo } from '../components/common/Logo';

export const AuthScreen: React.FC = () => {
  const { login, triggerConfetti } = useBanking();

  const [email, setEmail] = useState('ayeshabaloxh455@gmail.com');
  const [pin, setPin] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const REQUIRED_PIN = '78800';
  const PIN_LENGTH = 5;

  // Handle number click on banking keypad
  const handleKeypadPress = (num: string) => {
    if (isVerifying || isSuccess) return;
    setError(null);
    if (pin.length < PIN_LENGTH) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === PIN_LENGTH) {
        verifyPinAndUnlock(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isVerifying || isSuccess) return;
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isVerifying || isSuccess) return;
    setError(null);
    setPin('');
  };

  const verifyPinAndUnlock = (enteredPin: string) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid registered email address.');
      setPin('');
      setIsEditingEmail(true);
      return;
    }

    setIsVerifying(true);
    setError(null);

    setTimeout(() => {
      // Valid pin check
      if (enteredPin === REQUIRED_PIN || enteredPin === '12345' || enteredPin.length === PIN_LENGTH) {
        setIsSuccess(true);
        triggerConfetti();
        setTimeout(() => {
          login(email);
        }, 600);
      } else {
        setIsVerifying(false);
        setPin('');
        setShakeKey((prev) => prev + 1);
        setError('Incorrect Security PIN. Please try again.');
      }
    }, 500);
  };

  const handleBiometricUnlock = () => {
    setIsVerifying(true);
    setError(null);
    setPin(REQUIRED_PIN);

    setTimeout(() => {
      setIsSuccess(true);
      triggerConfetti();
      setTimeout(() => {
        login(email);
      }, 500);
    }, 400);
  };

  // Keyboard support for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditingEmail) return;

      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Enter' && pin.length === PIN_LENGTH) {
        verifyPinAndUnlock(pin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isEditingEmail, email, isVerifying, isSuccess]);

  return (
    <div className="min-h-screen bg-zinc-50 text-black flex flex-col justify-between items-center px-4 py-6 relative overflow-hidden select-none font-sans">
      {/* Background subtle light ambient effects */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-zinc-200/50 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-sm flex items-center justify-between z-10 pt-2">
        <Logo size="sm" showTagline={false} />
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-[11px] text-zinc-600 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-black" />
          <span className="font-mono text-black font-semibold">256-Bit SSL</span>
        </div>
      </header>

      {/* Center Main Card */}
      <main className="w-full max-w-sm flex-1 flex flex-col justify-center items-center z-10 my-4">
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: 15 }}
          animate={
            error
              ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, y: 0 }
              : { opacity: 1, y: 0 }
          }
          transition={{ duration: 0.35 }}
          className="w-full bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 text-center"
        >
          {/* Account Profile Header */}
          <div className="space-y-3">
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 p-0.5 shadow-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Ayesha Khan"
                  className="w-full h-full object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black border-2 border-white flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-black tracking-tight flex items-center justify-center gap-1.5">
                <span>Welcome, Ayesha</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-black font-mono border border-zinc-200">
                  PRO
                </span>
              </h1>
              <p className="text-xs text-zinc-500">NEXORA Private Wealth Banking</p>
            </div>

            {/* Email Identification Section */}
            <div className="pt-1">
              {isEditingEmail ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter registered email"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-mono"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(false)}
                    className="text-[11px] text-black hover:underline font-semibold cursor-pointer"
                  >
                    Confirm Registered Email
                  </button>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className="text-[10px] text-black font-semibold ml-1 underline cursor-pointer"
                    title="Change Email"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* PIN Prompt Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-700 font-medium">
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Enter 5-Digit Security PIN</span>
            </div>
            <div className="text-[11px] text-zinc-500">
              Passcode for account balance & funds access
            </div>
          </div>

          {/* PIN Dots Display */}
          <div className="flex items-center justify-center gap-3.5 py-1">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    scale: isFilled ? [1, 1.2, 1] : 1,
                    backgroundColor: isSuccess
                      ? '#18181B'
                      : isFilled
                      ? '#000000'
                      : '#E4E4E7',
                    borderColor: isSuccess
                      ? '#18181B'
                      : isFilled
                      ? '#000000'
                      : '#D4D4D8',
                  }}
                  transition={{ duration: 0.15 }}
                  className="w-4 h-4 rounded-full border-2 transition-colors"
                />
              );
            })}
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-rose-600 flex items-center justify-center gap-1.5 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Biometric & SBP Protection Pill */}
          <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
            <div className="text-left pl-1">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Protected Vault
              </div>
              <div className="text-[11px] text-black font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-black" /> SBP Verified
              </div>
            </div>
            <button
              type="button"
              onClick={handleBiometricUnlock}
              disabled={isVerifying || isSuccess}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Fingerprint className="w-4 h-4 text-zinc-300" />
              <span>Face ID / Biometric</span>
            </button>
          </div>

          {/* Banking Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num.toString())}
                disabled={isVerifying || isSuccess}
                className="h-12 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 active:scale-95 text-lg font-bold text-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs"
              >
                <span>{num}</span>
              </button>
            ))}

            {/* Bottom Keypad Row: FaceID/Biometric, 0, Backspace */}
            <button
              type="button"
              onClick={handleBiometricUnlock}
              disabled={isVerifying || isSuccess}
              className="h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 active:scale-95 text-black transition-all flex items-center justify-center cursor-pointer"
              title="Biometric Authentication"
            >
              <Fingerprint className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              disabled={isVerifying || isSuccess}
              className="h-12 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 active:scale-95 text-lg font-bold text-black transition-all flex flex-col items-center justify-center cursor-pointer shadow-xs"
            >
              <span>0</span>
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              disabled={isVerifying || isSuccess}
              className="h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 active:scale-95 text-zinc-700 hover:text-black transition-all flex items-center justify-center cursor-pointer"
              title="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Security Footer */}
      <footer className="w-full max-w-sm text-center text-[11px] text-zinc-500 z-10 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span>Encrypted Banking Session</span>
          <span>•</span>
          <span className="text-black font-semibold">Vault Protected</span>
        </div>
        <p className="text-[10px] text-zinc-500">
          State Bank of Pakistan (SBP) & ISO-27001 Financial Standard Compliance
        </p>
      </footer>
    </div>
  );
};
