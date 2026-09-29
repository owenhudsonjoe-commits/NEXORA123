import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { DemoHeaderBanner, DemoFooterBadge } from './components/common/DemoNotice';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';

// Screens
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { WalletsScreen } from './screens/WalletsScreen';
import { CardsScreen } from './screens/CardsScreen';
import { TransfersScreen } from './screens/TransfersScreen';
import { ExchangeScreen } from './screens/ExchangeScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { SavingsScreen } from './screens/SavingsScreen';
import { BudgetingScreen } from './screens/BudgetingScreen';
import { SubscriptionsScreen } from './screens/SubscriptionsScreen';
import { RecipientsScreen } from './screens/RecipientsScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { SecurityScreen } from './screens/SecurityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupportScreen } from './screens/SupportScreen';

// Modals
import { SendMoneyModal } from './components/modals/SendMoneyModal';
import { ExchangeModal } from './components/modals/ExchangeModal';
import { AddFundsModal } from './components/modals/AddFundsModal';
import { KYCModal } from './components/modals/KYCModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { Transaction } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, appSettings } = useBanking();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Modal context props
  const [sendRecipientName, setSendRecipientName] = useState<string | undefined>(undefined);
  const [sendDefaultCurrency, setSendDefaultCurrency] = useState<string | undefined>(undefined);
  const [exchangeFrom, setExchangeFrom] = useState<string>('USD');
  const [exchangeTo, setExchangeTo] = useState<string>('EUR');
  const [addFundsCurrency, setAddFundsCurrency] = useState<string>('USD');

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if (e.key.toLowerCase() === 's' && !isSendOpen) {
        setSendRecipientName(undefined);
        setIsSendOpen(true);
      } else if (e.key.toLowerCase() === 'e' && !isExchangeOpen) {
        setIsExchangeOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSendOpen, isExchangeOpen]);

  // Open Handlers
  const handleOpenSendWithRecipient = (name: string, currency: string) => {
    setSendRecipientName(name);
    setSendDefaultCurrency(currency);
    setIsSendOpen(true);
  };

  const handleOpenSendWithCurrency = (currency: string) => {
    setSendRecipientName(undefined);
    setSendDefaultCurrency(currency);
    setIsSendOpen(true);
  };

  const handleOpenExchangeWithCurrency = (currency: string) => {
    setExchangeFrom(currency);
    setExchangeTo(currency === 'USD' ? 'EUR' : 'USD');
    setIsExchangeOpen(true);
  };

  const handleOpenAddFundsWithCurrency = (currency: string) => {
    setAddFundsCurrency(currency);
    setIsAddFundsOpen(true);
  };

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-white text-zinc-950 transition-colors duration-200"
    >
      {/* Top Disclaimer Banner */}
      <DemoHeaderBanner />

      {/* Main App Container with Sidebar & Header */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSend={() => {
            setSendRecipientName(undefined);
            setIsSendOpen(true);
          }}
          onOpenExchange={() => setIsExchangeOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {/* Top Sticky Navbar */}
          <Navbar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenSend={() => {
              setSendRecipientName(undefined);
              setIsSendOpen(true);
            }}
            onOpenExchange={() => setIsExchangeOpen(true)}
            onOpenAddFunds={() => setIsAddFundsOpen(true)}
            onOpenKYC={() => setIsKYCOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Dynamic Screen View */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {currentTab === 'dashboard' && (
                  <DashboardScreen
                    onSelectTab={setCurrentTab}
                    onOpenSend={() => {
                      setSendRecipientName(undefined);
                      setIsSendOpen(true);
                    }}
                    onOpenExchange={() => setIsExchangeOpen(true)}
                    onOpenAddFunds={() => setIsAddFundsOpen(true)}
                    onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  />
                )}

                {currentTab === 'wallets' && (
                  <WalletsScreen
                    onOpenSendWithCurrency={handleOpenSendWithCurrency}
                    onOpenExchangeWithCurrency={handleOpenExchangeWithCurrency}
                    onOpenAddFundsWithCurrency={handleOpenAddFundsWithCurrency}
                    onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  />
                )}

                {currentTab === 'cards' && (
                  <CardsScreen
                    onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  />
                )}

                {currentTab === 'transfers' && (
                  <TransfersScreen
                    onOpenSend={() => {
                      setSendRecipientName(undefined);
                      setIsSendOpen(true);
                    }}
                    onOpenSendToRecipient={handleOpenSendWithRecipient}
                    onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  />
                )}

                {currentTab === 'recipients' && (
                  <RecipientsScreen
                    onOpenSendToRecipient={handleOpenSendWithRecipient}
                  />
                )}

                {currentTab === 'exchange' && (
                  <ExchangeScreen
                    onOpenExchangeModalWithPair={(from, to) => {
                      setExchangeFrom(from);
                      setExchangeTo(to);
                      setIsExchangeOpen(true);
                    }}
                  />
                )}

                {currentTab === 'analytics' && <AnalyticsScreen />}

                {currentTab === 'savings' && <SavingsScreen />}

                {currentTab === 'budget' && <BudgetingScreen />}

                {currentTab === 'subscriptions' && <SubscriptionsScreen />}

                {currentTab === 'transactions' && (
                  <TransactionsScreen
                    onSelectTransaction={(tx) => setSelectedTransaction(tx)}
                  />
                )}

                {currentTab === 'security' && <SecurityScreen />}

                {currentTab === 'settings' && <SettingsScreen />}

                {currentTab === 'support' && <SupportScreen />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Footer */}
      <DemoFooterBadge />

      {/* Modals */}
      <SendMoneyModal
        isOpen={isSendOpen}
        onClose={() => setIsSendOpen(false)}
        defaultRecipientName={sendRecipientName}
        defaultCurrency={sendDefaultCurrency}
      />

      <ExchangeModal
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        initialFrom={exchangeFrom}
        initialTo={exchangeTo}
      />

      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={() => setIsAddFundsOpen(false)}
        defaultCurrency={addFundsCurrency}
      />

      <KYCModal isOpen={isKYCOpen} onClose={() => setIsKYCOpen(false)} />

      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <MainAppContent />
    </BankingProvider>
  );
}
