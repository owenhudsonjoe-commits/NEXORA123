import React, { useState } from 'react';
import {
  Settings,
  User,
  Crown,
  Globe,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Bell,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Lock,
  LogOut,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { AVAILABLE_LANGUAGES } from '../data/translations';
import { GLOBAL_CURRENCIES } from '../data/currencies';
import { MembershipTier } from '../types';

export const SettingsScreen: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    appSettings,
    updateSettings,
    setMembershipTier,
    logout,
    formatMoney,
    t,
  } = useBanking();

  // Profile Form States
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phoneNumber);
  const [address, setAddress] = useState(userProfile.address);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      phoneNumber: phone,
      address,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const membershipTiers: {
    id: MembershipTier;
    name: string;
    price: string;
    description: string;
    features: string[];
    accent: string;
    bg: string;
  }[] = [
    {
      id: 'standard',
      name: 'Standard Tier',
      price: 'Free',
      description: 'Core multi-currency banking essentials',
      features: [
        'Up to 5 Multi-currency accounts',
        'Standard FX conversion fee (0.3%)',
        '1 Virtual Visa debit card',
        'Standard customer support',
      ],
      accent: 'text-zinc-900',
      bg: 'border-zinc-200 bg-white',
    },
    {
      id: 'premium',
      name: 'Premium Tier',
      price: '$12.99 / mo',
      description: 'Borderless power user with zero-markup FX',
      features: [
        'Unlimited 30+ Currency Wallets',
        '0.00% Zero-Markup Interbank FX',
        'Unlimited Virtual & Metal Cards',
        'Higher ATM free limits ($2,000/mo)',
        '24/7 Concierge Support',
      ],
      accent: 'text-black',
      bg: 'border-zinc-300 bg-zinc-50',
    },
    {
      id: 'metal',
      name: 'Black Elite Tier',
      price: '$29.99 / mo',
      description: 'The pinnacle of private fintech prestige',
      features: [
        '18g Solid Obsidian Metal Card',
        'Worldwide Airport Lounge Access (LoungeKey)',
        '1.5% Cashback in Bitcoin or Gold',
        'Dedicated Private Banker Concierge',
        'Comprehensive Global Travel Insurance',
      ],
      accent: 'text-white',
      bg: 'border-black bg-black text-white',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <Settings className="w-4 h-4 text-black" /> Account Customization & Preferences
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Settings & Membership
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Configure personal credentials, appearance, localized language, and membership tier
          </p>
        </div>
      </div>

      {/* ACCOUNT AUTHENTICATION & SECURITY PIN STATUS BANNER */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-black"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-black">{userProfile.fullName}</h3>
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-black text-[10px] uppercase font-mono font-bold border border-zinc-200">
                {userProfile.tier}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">{userProfile.email}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-black">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-black" /> 5-Digit PIN Configured
              </span>
              <span className="flex items-center gap-1 text-zinc-700">
                <Fingerprint className="w-3.5 h-3.5 text-black" /> Biometrics Enabled
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => logout()}
            id="settings-lock-session-btn"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Lock Banking App</span>
          </button>

          <button
            type="button"
            onClick={() => logout()}
            id="settings-logout-btn"
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-semibold transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* MEMBERSHIP TIER SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black flex items-center gap-2">
              <Crown className="w-5 h-5 text-black" />
              Membership Tiers & Benefits
            </h2>
            <p className="text-xs text-zinc-600">Upgrade or switch tier benefits instantly</p>
          </div>
          <span className="text-xs text-black font-semibold">
            Active: <span className="uppercase font-mono font-bold">{userProfile.tier}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {membershipTiers.map((tier) => {
            const isCurrent = userProfile.tier === tier.id;
            const isMetal = tier.id === 'metal';

            return (
              <div
                key={tier.id}
                className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${
                  tier.bg
                } ${isCurrent ? 'ring-2 ring-black ring-offset-2 ring-offset-white' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-extrabold text-base ${tier.accent}`}>{tier.name}</h3>
                    {isCurrent && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${
                        isMetal 
                          ? 'bg-zinc-800 text-white border-zinc-700' 
                          : 'bg-zinc-100 text-black border-zinc-300'
                      }`}>
                        Current Plan
                      </span>
                    )}
                  </div>
                  <div className={`text-2xl font-black font-mono mb-2 ${isMetal ? 'text-white' : 'text-black'}`}>
                    {tier.price}
                  </div>
                  <p className={`text-xs mb-4 ${isMetal ? 'text-zinc-300' : 'text-zinc-600'}`}>{tier.description}</p>

                  <div className={`space-y-2 pt-2 border-t text-xs ${isMetal ? 'border-zinc-800' : 'border-zinc-200'}`}>
                    {tier.features.map((feat) => (
                      <div key={feat} className={`flex items-start gap-2 ${isMetal ? 'text-zinc-200' : 'text-zinc-700'}`}>
                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isMetal ? 'text-white' : 'text-black'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`pt-6 mt-4 border-t ${isMetal ? 'border-zinc-800' : 'border-zinc-200'}`}>
                  <button
                    onClick={() => setMembershipTier(tier.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      isCurrent
                        ? isMetal
                          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default'
                          : 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-default'
                        : isMetal
                        ? 'bg-white hover:bg-zinc-100 text-black shadow-sm'
                        : 'bg-black hover:bg-zinc-800 text-white shadow-sm'
                    }`}
                  >
                    {isCurrent ? 'Active Plan' : `Switch to ${tier.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROFILE FORM & APP PREFERENCES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="font-bold text-black text-base flex items-center gap-2">
              <User className="w-4 h-4 text-black" />
              Personal Profile
            </h3>
            {isSaved && (
              <span className="text-xs text-black font-semibold">Changes Saved!</span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-black focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-sm"
            >
              Update Profile Details
            </button>
          </form>
        </div>

        {/* Regional & App Preferences */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-black text-base flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Globe className="w-4 h-4 text-black" />
            Regional & Display Preferences
          </h3>

          <div className="space-y-4 text-xs">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <div>
                <h4 className="font-semibold text-black">Visual Interface Theme</h4>
                <p className="text-zinc-500 text-[11px]">Dark obsidian mode vs crisp light mode</p>
              </div>
              <button
                onClick={() =>
                  updateSettings({
                    theme: appSettings.theme === 'dark' ? 'light' : 'dark',
                  })
                }
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-black cursor-pointer"
              >
                {appSettings.theme === 'dark' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-black" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-black" /> Light Mode
                  </>
                )}
              </button>
            </div>

            {/* Language Picker */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <div>
                <h4 className="font-semibold text-black">Application Language</h4>
                <p className="text-zinc-500 text-[11px]">Supports English, Spanish, Arabic, Japanese, etc.</p>
              </div>
              <select
                value={appSettings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-black font-medium focus:outline-none focus:border-black cursor-pointer"
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Default Display Currency */}
            <div className="flex items-center justify-between py-2 border-b border-zinc-100">
              <div>
                <h4 className="font-semibold text-black">Primary Reporting Currency</h4>
                <p className="text-zinc-500 text-[11px]">Aggregates all net-worth charts</p>
              </div>
              <select
                value={appSettings.defaultCurrency}
                onChange={(e) => updateSettings({ defaultCurrency: e.target.value })}
                className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-black font-medium focus:outline-none focus:border-black cursor-pointer"
              >
                {GLOBAL_CURRENCIES.slice(0, 10).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy: Hide balances */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-semibold text-black">Privacy Mode (Mask Balances)</h4>
                <p className="text-zinc-500 text-[11px]">Hide numbers from shoulder surfers</p>
              </div>
              <input
                type="checkbox"
                checked={appSettings.hideBalances}
                onChange={(e) => updateSettings({ hideBalances: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-50 border-zinc-300 text-black cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
