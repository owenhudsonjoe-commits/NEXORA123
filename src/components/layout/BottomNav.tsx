import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  SendHorizontal,
  Repeat,
  User,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { t } = useBanking();

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'transfers', label: 'Payments', icon: SendHorizontal },
    { id: 'exchange', label: 'Exchange', icon: Repeat },
    { id: 'settings', label: 'Profile', icon: User },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-2 py-1.5 flex items-center justify-around shadow-sm"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isActive
                ? 'text-black font-bold'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
