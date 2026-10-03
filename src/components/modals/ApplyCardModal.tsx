import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Lock,
  MapPin,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  Wifi,
  Copy,
  Check,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CardStyle, CardApplication } from '../../types';
import { AVAILABLE_COUNTRIES } from '../../data/restrictedCountries';

interface ApplyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyCardModal: React.FC<ApplyCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { userProfile, applyForAtmMastercard, hasAppliedForCard, cardApplication } = useBanking();

  // Form State prefilled with user details
  const [fullName, setFullName] = useState(userProfile.fullName || 'Ayesha Khan');
  const [cardName, setCardName] = useState((userProfile.fullName || 'Ayesha Khan').toUpperCase());
  const [cardStyle, setCardStyle] = useState<CardStyle>('metallic');
  const [streetAddress, setStreetAddress] = useState('House 42, Street 8, Block G');
  const [apartment, setApartment] = useState('Suite 302, Floor 3');
  const [city, setCity] = useState('Lahore');
  const [stateProvince, setStateProvince] = useState('Punjab');
  const [postalCode, setPostalCode] = useState('54000');
  const [country, setCountry] = useState(userProfile.country || 'Pakistan');
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phone || '+92 300 7880099');
  const [pin, setPin] = useState('7890');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<CardApplication | null>(cardApplication);
  const [isSuccessView, setIsSuccessView] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const app = applyForAtmMastercard({
        fullName,
        cardName,
        cardStyle,
        streetAddress,
        apartment,
        city,
        stateProvince,
        postalCode,
        country,
        phoneNumber,
        pin,
      });

      setSubmittedApp(app);
      setIsSubmitting(false);
      setIsSuccessView(true);
      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  const handleCopyTracking = (tracking: string) => {
    navigator.clipboard?.writeText(tracking);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const cardStyleColors: Record<CardStyle, { bg: string; text: string; border: string; label: string }> = {
    black: {
      bg: 'linear-gradient(135deg, #18181B 0%, #09090B 100%)',
      text: 'text-zinc-100',
      border: 'border-zinc-700',
      label: 'Obsidian Black',
    },
    metallic: {
      bg: 'linear-gradient(135deg, #27272A 0%, #18181B 100%)',
      text: 'text-zinc-100',
      border: 'border-zinc-600',
      label: 'Titanium Metallic',
    },
    gradient: {
      bg: 'linear-gradient(135deg, #4338CA 0%, #312E81 50%, #1E1B4B 100%)',
      text: 'text-white',
      border: 'border-indigo-400/40',
      label: 'Indigo Aurora',
    },
    'minimal-white': {
      bg: 'linear-gradient(135deg, #F4F4F5 0%, #E4E4E7 100%)',
      text: 'text-zinc-900',
      border: 'border-zinc-300',
      label: 'Minimal White',
    },
  };

  const activeStyle = cardStyleColors[cardStyle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh] text-zinc-900"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-sm">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
                Order Nexora ATM Mastercard
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase">
                  1 - 2 Day Delivery
                </span>
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Physical ATM Debit card with worldwide zero-fee withdrawals
              </p>
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
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {!isSuccessView ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Delivery Speed Highlight Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
                <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                    <span>Guaranteed Express Delivery: 1 to 2 Days</span>
                    <span className="text-[10px] bg-amber-200/80 px-2 py-0.2 rounded-full font-bold">Free Priority</span>
                  </div>
                  <p className="text-amber-800 mt-0.5">
                    Your physical ATM Mastercard is manufactured and dispatched via priority courier. You will receive it at your doorstep within 1 to 2 business days.
                  </p>
                </div>
              </div>

              {/* CARD PREVIEW */}
              <div>
                <label className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
                  Card Preview & Finish
                </label>
                <div
                  className={`relative aspect-[1.8/1] w-full max-w-sm mx-auto rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-hidden border ${activeStyle.border}`}
                  style={{ background: activeStyle.bg }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono text-sm font-extrabold tracking-wider ${activeStyle.text}`}>
                      NEXORA
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        ATM Debit
                      </span>
                      <Wifi className={`w-4 h-4 ${activeStyle.text} opacity-80`} />
                    </div>
                  </div>

                  {/* EMV Chip */}
                  <div className="w-9 h-7 rounded-sm bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300 shadow-xs my-1 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 border border-amber-700/30 rounded-xs" />
                  </div>

                  <div>
                    <div className={`font-mono text-base font-bold tracking-widest ${activeStyle.text}`}>
                      5412 •••• •••• 9721
                    </div>
                    <div className="flex items-end justify-between mt-2 text-xs">
                      <div>
                        <span className={`text-[8px] uppercase tracking-wider block opacity-70 ${activeStyle.text}`}>
                          Cardholder
                        </span>
                        <span className={`font-semibold font-mono text-xs tracking-wider ${activeStyle.text}`}>
                          {cardName || 'AYESHA KHAN'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {/* Mastercard Circles */}
                        <div className="w-6 h-6 rounded-full bg-red-500 opacity-90"></div>
                        <div className="w-6 h-6 rounded-full bg-amber-400 opacity-90 -ml-3"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Style Selector */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {(['black', 'metallic', 'gradient', 'minimal-white'] as CardStyle[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCardStyle(s)}
                      className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all cursor-pointer ${
                        cardStyle === s
                          ? 'border-black bg-zinc-100 font-bold shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      {cardStyleColors[s].label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD CUSTOMIZATION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Cardholder Name (Embossed on Plastic) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="e.g. AYESHA KHAN"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold uppercase text-black focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Create 4-Digit ATM PIN *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••"
                      className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono tracking-widest font-bold text-black focus:outline-none focus:border-black text-center"
                    />
                  </div>
                </div>
              </div>

              {/* DELIVERY ADDRESS SECTION */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-black" />
                    Delivery Street Address Details
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-medium">Doorstep Courier Dispatch</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                      Street Address / House / Flat *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House 42, Street 8, Block G, Gulberg III"
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Apartment / Suite / Floor (Optional)
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        placeholder="e.g. Apt 3B, 3rd Floor"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lahore / Karachi / Islamabad"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateProvince}
                        onChange={(e) => setStateProvince(e.target.value)}
                        placeholder="e.g. Punjab / Sindh"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Postal / ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 54000"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                        Country *
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-2.5 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black cursor-pointer"
                      >
                        {AVAILABLE_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-zinc-600 mb-0.5">
                      Recipient Mobile Phone (Courier SMS & Call Tracking) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Application Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      <span>Dispatching Application to Express Logistics...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Submit Application & Order ATM Mastercard</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-zinc-500 text-center mt-2">
                  Zero issuance fee • Delivered within 1 to 2 business days • Contactless enabled
                </p>
              </div>
            </form>
          ) : (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="space-y-6 py-4 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-md">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Application Submitted Successfully
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Application Submitted!
                </h2>

                {/* PROMINENT REQUESTED BANNER */}
                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 max-w-lg mx-auto shadow-sm">
                  <div className="text-base sm:text-lg font-black flex items-center justify-center gap-2">
                    <span>🎉</span>
                    <span>You will get ATM in 1 to 2 days!</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    Your physical ATM Mastercard has been created and prepared for priority shipment. You will get your ATM card delivered to your address within 1 to 2 days.
                  </p>
                </div>
              </div>

              {/* Delivery Receipt Details */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2.5 max-w-lg mx-auto font-mono text-zinc-900">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Tracking Reference:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyTracking(submittedApp?.trackingNumber || '')}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-zinc-200 text-xs"
                  >
                    {submittedApp?.trackingNumber}
                    {copiedTracking ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Estimated Delivery:</span>
                  <span className="font-extrabold text-emerald-800 font-sans flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{submittedApp?.estimatedDelivery}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Courier Service:</span>
                  <span className="font-bold text-zinc-900 font-sans">{submittedApp?.courier}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Cardholder:</span>
                  <span className="font-bold text-black">{submittedApp?.cardName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Delivery Address:</span>
                  <span className="font-medium text-right text-zinc-800 max-w-[60%] truncate font-sans">
                    {submittedApp?.streetAddress}, {submittedApp?.city}, {submittedApp?.country}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Courier Contact Phone:</span>
                  <span className="font-bold text-black">{submittedApp?.phoneNumber}</span>
                </div>

                <div className="flex justify-between items-center pt-1 bg-white px-3 py-2 rounded-xl border border-zinc-200">
                  <span className="text-zinc-600 font-sans font-medium">ATM Withdrawal PIN:</span>
                  <span className="font-mono font-black text-black">
                    •••• (Saved securely)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="max-w-lg mx-auto space-y-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Done & View in Card Section
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
