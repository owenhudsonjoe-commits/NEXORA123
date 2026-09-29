import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Sparkles,
  Send,
  PlusCircle,
  Repeat,
  X,
  Check,
  Globe,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useBanking } from '../../context/BankingContext';
import { AVAILABLE_LANGUAGES } from '../../data/translations';
import { GLOBAL_CURRENCIES } from '../../data/currencies';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSend: () => void;
  onOpenExchange: () => void;
  onOpenAddFunds: () => void;
  onOpenKYC: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSend,
  onOpenExchange,
  onOpenAddFunds,
  onOpenKYC,
  searchQuery,
  onSearchChange,
}) => {
  const {
    userProfile,
    appSettings,
    updateSettings,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    logout,
    formatMoney,
    totalBalanceUSD,
    t,
  } = useBanking();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const toggleTheme = () => {
    updateSettings({
      theme: appSettings.theme === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-200 px-4 lg:px-8 py-3 transition-colors text-zinc-900">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand logo (mobile visible, desktop sidebar has it too) */}
        <div className="flex items-center gap-4 lg:hidden">
          <Logo size="sm" showTagline={false} />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick action buttons on Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenSend}
            id="nav-quick-send-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {t('send')}
          </button>
          <button
            onClick={onOpenExchange}
            id="nav-quick-exchange-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Repeat className="w-3.5 h-3.5 text-zinc-700" />
            {t('exchange')}
          </button>
          <button
            onClick={onOpenAddFunds}
            id="nav-quick-add-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-700" />
            {t('addMoney')}
          </button>
        </div>

        {/* Right tools: Theme, Language, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black transition-colors cursor-pointer"
            title={`Switch to ${appSettings.theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {appSettings.theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs text-zinc-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-zinc-600" />
              <span className="uppercase font-mono font-semibold">
                {appSettings.language}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-zinc-200 shadow-xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400">
                  Select Language
                </div>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      updateSettings({ language: lang.code });
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
                      appSettings.language === lang.code
                        ? 'bg-zinc-100 text-black font-bold'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span>
                      {lang.flag} {lang.name}
                    </span>
                    {appSettings.language === lang.code && (
                      <Check className="w-3 h-3 text-black" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Lock Banking Session Button */}
          <button
            onClick={() => logout()}
            id="nav-lock-app-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 hover:text-black text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Lock Banking Session (Enter PIN to reopen)"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-700" />
            <span className="hidden sm:inline">Lock App</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              id="notifications-bell-btn"
              className="relative p-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-black transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-black text-sm">{t('notifications')}</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 font-semibold">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-zinc-600 hover:text-black font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto my-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-zinc-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`py-2.5 px-2 rounded-lg cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-zinc-50' : 'hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5
                            className={`text-xs font-semibold ${
                              !n.isRead ? 'text-black font-bold' : 'text-zinc-700'
                            }`}
                          >
                            {n.title}
                          </h5>
                          <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                          {n.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              id="user-profile-menu-btn"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.fullName}
                className="w-6 h-6 rounded-full object-cover border border-zinc-300"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:block text-left text-xs">
                <span className="font-bold text-black block leading-tight">
                  {userProfile.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono uppercase font-bold">
                  {userProfile.tier}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-3 z-50 text-zinc-900">
                <div className="flex items-center gap-3 p-2 bg-zinc-50 border border-zinc-200 rounded-xl mb-2">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-black">{userProfile.fullName}</div>
                    <div className="text-[11px] text-zinc-500 truncate max-w-[140px]">
                      {userProfile.email}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] text-emerald-700 uppercase font-bold">
                        KYC Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      onSelectTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium"
                  >
                    <User className="w-4 h-4 text-zinc-500" />
                    Profile & Settings
                  </button>
                  <button
                    onClick={() => {
                      onOpenKYC();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    KYC Compliance Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('security');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-black font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                    Security Center
                  </button>

                  <div className="pt-2 mt-2 border-t border-zinc-200 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-800 hover:bg-zinc-100 font-semibold cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-zinc-700" />
                      Lock Banking Session
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
