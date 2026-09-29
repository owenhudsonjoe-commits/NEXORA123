import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Camera,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, submitKYC } = useBanking();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [photoSelected, setPhotoSelected] = useState<string | null>(userProfile.avatar);
  const [docType, setDocType] = useState('Passport');
  const [docUploaded, setDocUploaded] = useState(true);
  const [address, setAddress] = useState(userProfile.address);
  const [postalCode, setPostalCode] = useState('94107');
  const [city, setCity] = useState('San Francisco');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      submitKYC({
        photoUrl: photoSelected || undefined,
        documentType: docType,
        address: `${address}, ${city} ${postalCode}`,
      });
      setStep(4);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 text-black overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-black text-base">Identity Verification (KYC Simulation)</h3>
                <p className="text-xs text-zinc-500">Unlock borderless multi-currency limits</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="my-5">
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
              <span>Step {step} of 3</span>
              <span className="font-semibold text-black">
                {step === 1 && '1. Selfie Verification'}
                {step === 2 && '2. Identity Document'}
                {step === 3 && '3. Proof of Address'}
                {step === 4 && 'Status: Verified'}
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: PHOTO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center p-6 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                <div className="relative w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-black/20 shadow-md">
                  <img
                    src={photoSelected || userProfile.avatar}
                    alt="Selfie"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-black">Live Liveness Check</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                  Hold your camera at eye level with good lighting.
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setPhotoSelected(
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                      )
                    }
                    className="text-xs px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-black hover:bg-zinc-100 cursor-pointer"
                  >
                    Capture Photo
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
              >
                Continue to Step 2
              </button>
            </div>
          )}

          {/* STEP 2: ID DOCUMENT */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  Document Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Passport', 'National ID', "Driver's License"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDocType(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        docType === t
                          ? 'bg-black border-black text-white font-bold'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50 text-center">
                <UploadCloud className="w-10 h-10 text-black mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-black">
                  {docType} Upload
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  High-resolution document scan accepted (PDF, JPG, PNG)
                </p>
                <span className="inline-block mt-3 px-2.5 py-1 rounded bg-zinc-100 text-black text-[11px] font-mono border border-zinc-200">
                  GOV_ID_VALIDATED.PDF
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-black text-sm hover:bg-zinc-200 font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-colors cursor-pointer shadow-sm"
                >
                  Continue to Step 3
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ADDRESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Street Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-xl bg-zinc-100 border border-zinc-200 text-black text-sm hover:bg-zinc-200 font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSimulateSubmit}
                  disabled={isProcessing}
                  className="w-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
                >
                  {isProcessing ? (
                    'Processing Automated Verification...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Submit Verification
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-black">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-black">KYC Verification Approved</h3>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto">
                Your account is now verified with Tier-3 limitless multi-currency wallets, instant SWIFT transfers, and virtual cards.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Return to Dashboard
              </button>
            </div>
          )}

          {/* Compliance Disclaimer */}
          <div className="mt-4 pt-3 border-t border-zinc-100 text-[10px] text-zinc-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
            <span>End-to-End Encrypted • Bank-Grade Security & Privacy Compliance</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
