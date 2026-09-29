import React from 'react';
import {
  LayoutDashboard,
  WalletCards,
  CreditCard,
  SendHorizontal,
  Users,
  Repeat,
  BarChart3,
  PiggyBank,
  PieChart,
  Receipt,
  ShieldCheck,
  LifeBuoy,
  Settings,
  TrendingUp,
  Crown,
  Lock,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useBanking } from '../../context/BankingContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSend: () => void;
  onOpenExchange: () => void;
  onOpenUpgrade?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSend,
  onOpenExchange,
}) => {
  const { userProfile, logout, t } = useBanking();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'wallets', label: 'Multi-Currency', icon: WalletCards, badge: '30+' },
    { id: 'cards', label: 'Cards', icon: CreditCard, badge: null },
    { id: 'transfers', label: 'Payments', icon: SendHorizontal, badge: null },
    { id: 'recipients', label: 'Recipients', icon: Users, badge: null },
    { id: 'exchange', label: 'Exchange', icon: Repeat, badge: 'Live' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'savings', label: 'Savings Vaults', icon: PiggyBank, badge: null },
    { id: 'budget', label: 'Budgeting', icon: PieChart, badge: null },
    { id: 'subscriptions', label: 'Subscriptions', icon: Receipt, badge: '5' },
    { id: 'transactions', label: 'Activity', icon: TrendingUp, badge: null },
    { id: 'security', label: 'Security Center', icon: ShieldCheck, badge: '92%' },
    { id: 'support', label: 'Support', icon: LifeBuoy, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-zinc-200 min-h-screen sticky top-0 py-6 px-4 select-none text-zinc-900">
      {/* Brand Logo */}
      <div className="px-3 mb-6">
        <Logo size="md" />
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
          Menu
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              id={`sidebar-link-${item.id}`}
              className={`px-4 py-3 rounded-xl flex items-center justify-between font-medium cursor-pointer transition-colors ${
                isActive
                  ? 'bg-black text-white font-bold shadow-xs'
                  : 'text-zinc-600 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-white' : 'text-zinc-500'
                  }`}
                />
                <span className="text-xs">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Membership Plan Tier Card & Quick Lock */}
      <div className="p-2 mt-4 space-y-2">
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
              Membership
            </p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono font-bold">
              Active
            </span>
          </div>
          <p className="text-sm font-bold mb-3 text-black">
            Nexora {userProfile.tier === 'ELITE' ? 'Elite' : userProfile.tier === 'PREMIUM' ? 'Premier' : 'Private Wealth'}
          </p>
          <button
            onClick={() => onSelectTab('settings')}
            className="w-full py-2 bg-black hover:bg-zinc-800 text-xs rounded-lg transition-colors font-medium text-white cursor-pointer"
          >
            Manage Tier
          </button>
        </div>

        {/* Lock Banking App Action */}
        <button
          onClick={() => logout()}
          id="sidebar-lock-btn"
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black text-xs font-medium transition-all cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5 text-zinc-700" />
          <span>Lock Banking App</span>
        </button>
      </div>

      <div className="p-3 pt-4 border-t border-zinc-200">
        <p className="text-[10px] text-zinc-500 leading-tight font-medium uppercase text-center flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>256-Bit Encrypted • Verified</span>
        </p>
      </div>
    </aside>
  );
};

