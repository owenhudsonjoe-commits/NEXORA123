import React from 'react';
import {
  ShieldCheck,
  Fingerprint,
  Smartphone,
  Key,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const SecurityScreen: React.FC = () => {
  const { appSettings, updateSettings, userProfile } = useBanking();

  const activeSessions = [
    {
      id: 'sess-1',
      device: 'Chrome Browser (Web Portal)',
      browser: 'Chrome 128.0 (Windows / Android)',
      ip: '182.188.42.19 (Lahore, Pakistan)',
      current: true,
      lastActive: 'Active Now (Fully Verified & Trusted Device)',
    },
    {
      id: 'sess-2',
      device: 'Samsung Galaxy S24 Ultra',
      browser: 'NEXORA Mobile App v4.2',
      ip: '39.40.112.55 (Karachi, Pakistan)',
      current: false,
      lastActive: 'Yesterday',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-black font-semibold mb-1 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-black" /> Defense-in-Depth Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Security & Compliance Dashboard
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">
            Biometric credentials, 2FA security keys, device auditing, and end-to-end safeguards
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-black text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>Security Health: 98% (Optimal)</span>
        </div>
      </div>

      {/* Transfer System Status & Regulatory Banner */}
      <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-300 flex items-start gap-3.5 text-xs text-black">
        <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-black">International Regulatory Compliance Notice</span>
          <span className="text-zinc-700">
            Outward transfer services and cross-border settlement rails are fully operational for all countries worldwide, including Pakistan 🇵🇰. All transactions are protected by 256-bit encryption.
          </span>
        </div>
      </div>

      {/* Security Health Score Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Account Security Status
            </span>
            <div className="text-2xl font-bold text-black mt-1 flex items-center gap-2">
              <span>Tier-3 Bank Grade Protection</span>
            </div>
            <p className="text-xs text-zinc-600 mt-1">
              Zero-knowledge client encryption and biometric hardware keys enabled.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-zinc-200 border-t-black flex items-center justify-center font-extrabold font-mono text-lg text-black">
              98%
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings & Biometrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Authentication Channels */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-black text-base">Authentication Guardrails</h3>

          <div className="divide-y divide-zinc-100">
            {/* Biometrics */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-black">
                  <Fingerprint className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Biometric Login</h4>
                  <p className="text-[11px] text-zinc-500">FaceID / TouchID instant unlock</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={appSettings.biometricsEnabled}
                onChange={(e) => updateSettings({ biometricsEnabled: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-50 border-zinc-300 text-black cursor-pointer accent-black"
              />
            </div>

            {/* 2FA */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-black">
                  <Smartphone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-zinc-500">Require OTP for wire transfers &gt; $1,000</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={appSettings.twoFactorEnabled}
                onChange={(e) => updateSettings({ twoFactorEnabled: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-50 border-zinc-300 text-black cursor-pointer accent-black"
              />
            </div>

            {/* Login Alerts */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 text-black">
                  <Key className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">New Device Alerts</h4>
                  <p className="text-[11px] text-zinc-500">Instant notification on unknown IP logins</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={appSettings.loginAlertsEnabled}
                onChange={(e) => updateSettings({ loginAlertsEnabled: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-50 border-zinc-300 text-black cursor-pointer accent-black"
              />
            </div>
          </div>
        </div>

        {/* KYC Verification Status */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
          <h3 className="font-bold text-black text-base">KYC Compliance Status</h3>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                TIER 3 FULLY VERIFIED
              </span>
              <CheckCircle2 className="w-4 h-4 text-black" />
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              National ID and biometric proof of residence verified for Ayesha Khan. Multi-currency limits are unlocked.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
              <span>Account Holder:</span>
              <span className="font-semibold text-black">Ayesha Khan</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
              <span>Document Type:</span>
              <span className="font-semibold text-black">Passport / National ID</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
              <span>Jurisdiction:</span>
              <span className="font-semibold text-black">Global Non-Restricted Hub</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-zinc-100 text-zinc-600">
              <span>Risk Level:</span>
              <span className="font-semibold text-black">Low (0.00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-black text-base">Active Logged-In Sessions</h3>
          <button
            onClick={() => {}}
            className="text-xs text-zinc-700 hover:text-black hover:underline font-semibold cursor-pointer"
          >
            Log Out All Other Devices
          </button>
        </div>

        <div className="divide-y divide-zinc-100">
          {activeSessions.map((s) => (
            <div key={s.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-black">
                  <Laptop className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-black">{s.device}</h4>
                    {s.current && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-zinc-100 text-black font-semibold border border-zinc-300">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {s.browser} • <span className="font-mono text-zinc-400">{s.ip}</span>
                  </p>
                </div>
              </div>

              <span className="text-xs text-zinc-500 font-mono">{s.lastActive}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
