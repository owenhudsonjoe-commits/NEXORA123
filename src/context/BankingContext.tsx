import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Wallet,
  Transaction,
  Recipient,
  PaymentCard,
  SavingsVault,
  Budget,
  Subscription,
  AppNotification,
  SecurityState,
  UserProfile,
  AppSettings,
  CardStyle,
  MembershipTier,
  KYCStatus,
} from '../types';
import { GLOBAL_CURRENCIES } from '../data/currencies';
import { APP_TRANSLATIONS } from '../data/translations';
import {
  INITIAL_USER_PROFILE,
  INITIAL_APP_SETTINGS,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_RECIPIENTS,
  INITIAL_CARDS,
  INITIAL_SAVINGS_VAULTS,
  INITIAL_BUDGETS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SECURITY_STATE,
} from '../data/mockData';
import { isCountryRestricted, getRestrictedCountry } from '../data/restrictedCountries';

interface SendMoneyParams {
  recipientName: string;
  recipientAccount: string;
  recipientCountry: string;
  recipientCurrency: string;
  amount: number;
  sourceCurrency: string;
  note?: string;
  transferType: 'internal' | 'international' | 'scheduled' | 'recurring';
  fee: number;
  provider?: string;
}

interface ExchangeParams {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
}

interface BankingContextType {
  // State
  isAuthenticated: boolean;
  userProfile: UserProfile;
  appSettings: AppSettings;
  wallets: Wallet[];
  transactions: Transaction[];
  recipients: Recipient[];
  cards: PaymentCard[];
  savingsVaults: SavingsVault[];
  budgets: Budget[];
  subscriptions: Subscription[];
  notifications: AppNotification[];
  securityState: SecurityState;
  
  // Computed values
  totalBalanceUSD: number;
  availableBalanceUSD: number;
  totalSavingsUSD: number;
  totalInvestmentsUSD: number;
  monthlySpendingUSD: number;
  monthlyIncomeUSD: number;
  unreadNotificationsCount: number;
  activeCurrency: string;
  currentLanguage: string;
  t: (key: string) => string;

  // Actions
  setActiveCurrency: (currencyCode: string) => void;
  login: (email?: string, password?: string) => void;
  logout: () => void;
  register: (data: Partial<UserProfile>) => void;
  quickDemoLogin: () => void;
  submitKYC: (details: { photoUrl?: string; documentType?: string; address?: string }) => void;
  
  sendMoney: (params: SendMoneyParams) => { success: boolean; transaction: Transaction; error?: string };
  exchangeCurrencies: (params: ExchangeParams) => { success: boolean; transaction?: Transaction; error?: string };
  addDemoFunds: (currencyCode: string, amount: number) => void;
  addWallet: (currencyCode: string) => boolean;
  removeWallet: (currencyCode: string) => void;
  toggleWalletFavorite: (currencyCode: string) => void;
  
  createVault: (vault: Omit<SavingsVault, 'id' | 'currentAmount'>) => void;
  depositToVault: (vaultId: string, amount: number) => { success: boolean; error?: string };
  withdrawFromVault: (vaultId: string, amount: number) => { success: boolean; error?: string };
  
  toggleCardFreeze: (cardId: string) => void;
  updateCardSettings: (cardId: string, updates: Partial<PaymentCard>) => void;
  updateCardPin: (cardId: string, newPin: string) => void;
  setCardStyle: (cardId: string, style: CardStyle) => void;
  
  addRecipient: (recipient: Omit<Recipient, 'id'>) => void;
  toggleRecipientFavorite: (id: string) => void;
  deleteRecipient: (id: string) => void;
  
  updateBudget: (id: string, newLimit: number) => void;
  cancelSubscription: (id: string) => void;
  resumeSubscription: (id: string) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  upgradeTier: (tier: MembershipTier) => void;
  
  toggleTwoFactor: () => void;
  toggleBiometrics: () => void;
  revokeDevice: (deviceId: string) => void;
  
  resetToDemoDefaults: () => void;
  getExchangeRate: (fromCode: string, toCode: string) => number;
  formatMoney: (amount: number, currencyCode?: string) => string;
  triggerConfetti: () => void;
}

const BankingContext = createContext<BankingContextType | null>(null);

const STORAGE_KEYS = {
  AUTH: 'ayesha_portal_auth_v13',
  PROFILE: 'ayesha_portal_profile_v13',
  SETTINGS: 'ayesha_portal_settings_v13',
  WALLETS: 'ayesha_portal_wallets_v13',
  TRANSACTIONS: 'ayesha_portal_txs_v13',
  RECIPIENTS: 'ayesha_portal_recipients_v13',
  CARDS: 'ayesha_portal_cards_v13',
  SAVINGS: 'ayesha_portal_savings_v13',
  BUDGETS: 'ayesha_portal_budgets_v13',
  SUBSCRIPTIONS: 'ayesha_portal_subs_v13',
  NOTIFICATIONS: 'ayesha_portal_notifs_v13',
  SECURITY: 'ayesha_portal_security_v13',
};

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults (require PIN code on open)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved !== null ? JSON.parse(saved) : false;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_APP_SETTINGS, ...parsed, theme: 'light' };
      } catch (e) {
        return INITIAL_APP_SETTINGS;
      }
    }
    return INITIAL_APP_SETTINGS;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLETS);
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
    return saved ? JSON.parse(saved) : INITIAL_RECIPIENTS;
  });

  const [cards, setCards] = useState<PaymentCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [savingsVaults, setSavingsVaults] = useState<SavingsVault[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_VAULTS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [securityState, setSecurityState] = useState<SecurityState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_STATE;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(recipients));
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(savingsVaults));
  }, [savingsVaults]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(securityState));
  }, [securityState]);

  // Rate Helper
  const getExchangeRate = (fromCode: string, toCode: string): number => {
    if (fromCode === toCode) return 1.0;
    const fromCur = GLOBAL_CURRENCIES.find((c) => c.code === fromCode);
    const toCur = GLOBAL_CURRENCIES.find((c) => c.code === toCode);
    if (!fromCur || !toCur) return 1.0;
    return toCur.rateAgainstUSD / fromCur.rateAgainstUSD;
  };

  // Format money helper
  const formatMoney = (amount: number, currencyCode = 'USD'): string => {
    const cur = GLOBAL_CURRENCIES.find((c) => c.code === currencyCode);
    const symbol = cur ? cur.symbol : '$';
    const decimals = cur ? cur.decimals : 2;

    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    if (amount < 0) {
      return `-${symbol}${formatted}`;
    }
    return `${symbol}${formatted}`;
  };

  // Translation helper
  const t = (key: string): string => {
    const lang = appSettings.language || 'en';
    const dict = APP_TRANSLATIONS[lang] || APP_TRANSLATIONS['en'];
    // @ts-ignore
    return dict[key] || APP_TRANSLATIONS['en'][key] || key;
  };

  // Confetti helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#6366F1', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  };

  const setActiveCurrency = (code: string) => {
    setAppSettings((prev) => ({ ...prev, defaultCurrency: code }));
  };

  // Computed Totals in USD
  const totalSavingsUSD = useMemo(() => {
    return savingsVaults.reduce((acc, vault) => {
      const rate = getExchangeRate(vault.currency, 'USD');
      return acc + vault.currentAmount * rate;
    }, 0);
  }, [savingsVaults]);

  const totalInvestmentsUSD = 0.0;

  const usdWallet = wallets.find((w) => w.currencyCode === 'USD');
  const availableBalanceUSD = usdWallet ? usdWallet.balance : 3016.91;
  const totalBalanceUSD = availableBalanceUSD + totalSavingsUSD;

  const monthlySpendingUSD = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((acc, t) => {
        const rate = getExchangeRate(t.currency, 'USD');
        return acc + t.amount * rate;
      }, 0);
  }, [transactions]);

  const monthlyIncomeUSD = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((acc, t) => {
        const rate = getExchangeRate(t.currency, 'USD');
        return acc + t.amount * rate;
      }, 0);
  }, [transactions]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  // Auth Handlers
  const login = (email = 'ayeshabaloxh455@gmail.com') => {
    setUserProfile((prev) => ({
      ...prev,
      fullName: 'Ayesha Khan',
      email: email || 'ayeshabaloxh455@gmail.com',
      country: 'Pakistan',
      kycStatus: 'verified',
    }));
    setIsAuthenticated(true);
    addNotification({
      title: 'Welcome Back, Ayesha',
      description: 'Signed in to your private banking portal.',
      type: 'security',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const register = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...data,
      fullName: data.fullName || 'Ayesha Khan',
      email: data.email || 'ayeshabaloxh455@gmail.com',
      country: 'Pakistan',
      accountNumber: 'PK-NEX-7880-9721-001',
      kycStatus: 'verified',
    }));
    setIsAuthenticated(true);
    triggerConfetti();
  };

  const quickDemoLogin = () => {
    setUserProfile(INITIAL_USER_PROFILE);
    setIsAuthenticated(true);
    triggerConfetti();
  };

  const submitKYC = (details: { photoUrl?: string; documentType?: string; address?: string }) => {
    setUserProfile((prev) => ({
      ...prev,
      kycStatus: 'verified',
      idDocumentUploaded: true,
      address: details.address || prev.address,
    }));
    addNotification({
      title: 'Identity Verification Complete',
      description: 'Your Pakistani CNIC identity is fully verified with SBP/Raast status.',
      type: 'security',
    });
    triggerConfetti();
  };

  // Transaction Handler: Send Money
  const sendMoney = (params: SendMoneyParams) => {
    const {
      recipientName,
      recipientAccount,
      recipientCountry,
      recipientCurrency,
      amount,
      sourceCurrency,
      note,
      fee = 0,
      provider,
    } = params;

    // Regulatory Compliance & Sanctions Check: Block restricted countries
    if (isCountryRestricted(recipientCountry) || isCountryRestricted(provider)) {
      const countryDetail = getRestrictedCountry(recipientCountry) || getRestrictedCountry(provider);
      const name = countryDetail?.name || recipientCountry || 'this destination';
      return {
        success: false,
        transaction: null as any,
        error: `Send payment to ${name} is currently unavailable due to international regulatory compliance and banking sanctions.`,
      };
    }

    const sourceWallet = wallets.find((w) => w.currencyCode === sourceCurrency);
    if (!sourceWallet || sourceWallet.balance < amount + fee) {
      return {
        success: false,
        transaction: null as any,
        error: `Insufficient ${sourceCurrency} balance. Available: ${formatMoney(sourceWallet?.balance || 0, sourceCurrency)}`,
      };
    }

    const deductedAmount = amount + fee;
    const pkrRate = getExchangeRate('USD', 'PKR');

    // Deduct from balance
    setWallets((prevWallets) =>
      prevWallets.map((w) => {
        if (w.currencyCode === sourceCurrency) {
          return {
            ...w,
            balance: Math.max(0, Number((w.balance - deductedAmount).toFixed(2))),
          };
        }
        // Keep PKR mirror balance synchronized
        if (sourceCurrency === 'USD' && w.currencyCode === 'PKR') {
          return {
            ...w,
            balance: Math.max(0, Number((w.balance - deductedAmount * pkrRate).toFixed(2))),
          };
        }
        if (sourceCurrency === 'PKR' && w.currencyCode === 'USD') {
          return {
            ...w,
            balance: Math.max(0, Number((w.balance - deductedAmount / pkrRate).toFixed(2))),
          };
        }
        return w;
      })
    );

    // Create completed Transaction
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = new Date().toISOString();
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${randomHex}`,
      referenceId: `NEX-20260906-${randomHex}`,
      title: `Transfer to ${recipientName}`,
      recipientMerchant: `${recipientName}${provider ? ` (${provider})` : ''}`,
      category: 'Transfer',
      amount: amount,
      currency: sourceCurrency,
      type: 'expense',
      status: 'completed',
      timestamp: timestamp,
      fee: fee,
      note: note || `Outward transfer to ${recipientName} via ${provider || recipientCountry}`,
      counterpartyAccount: recipientAccount,
      recipientCountry: recipientCountry,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: `Transfer Sent: -${formatMoney(amount, sourceCurrency)}`,
      description: `Successfully sent ${formatMoney(amount, sourceCurrency)} to ${recipientName} via ${provider || recipientCountry}.`,
      type: 'payment',
    });

    triggerConfetti();

    return {
      success: true,
      transaction: newTx,
    };
  };

  // Transaction Handler: Exchange Currencies
  const exchangeCurrencies = (params: ExchangeParams) => {
    const { fromCurrency, toCurrency, fromAmount } = params;
    if (fromCurrency === toCurrency) {
      return { success: false, error: 'Source and destination currencies cannot be identical.' };
    }

    const sourceWallet = wallets.find((w) => w.currencyCode === fromCurrency);
    if (!sourceWallet || sourceWallet.balance < fromAmount) {
      return { success: false, error: `Insufficient ${fromCurrency} balance.` };
    }

    const rate = getExchangeRate(fromCurrency, toCurrency);
    const toAmount = fromAmount * rate;
    const fee = 0; // Free for Ayesha Khan

    // Update wallets
    setWallets((prev) => {
      let destExists = prev.some((w) => w.currencyCode === toCurrency);
      let updated = prev.map((w) => {
        if (w.currencyCode === fromCurrency) {
          return { ...w, balance: Math.max(0, w.balance - fromAmount) };
        }
        if (w.currencyCode === toCurrency) {
          return { ...w, balance: w.balance + toAmount };
        }
        return w;
      });

      if (!destExists) {
        updated.push({
          id: `w_${toCurrency.toLowerCase()}`,
          currencyCode: toCurrency,
          balance: toAmount,
          isFavorite: false,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
        });
      }
      return updated;
    });

    const ref = `FX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: ref,
      title: `Exchange ${fromCurrency} → ${toCurrency}`,
      recipientMerchant: 'Instant FX Conversion',
      category: 'Exchange',
      amount: fromAmount,
      currency: fromCurrency,
      type: 'exchange',
      status: 'completed',
      timestamp: new Date().toISOString(),
      fee: fee,
      exchangeDetails: {
        fromCurrency,
        toCurrency,
        fromAmount,
        toAmount,
        rate,
      },
      note: `Converted ${formatMoney(fromAmount, fromCurrency)} to ${formatMoney(toAmount, toCurrency)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: 'Currency Exchange Complete',
      description: `Exchanged ${formatMoney(fromAmount, fromCurrency)} for ${formatMoney(toAmount, toCurrency)}.`,
      type: 'exchange',
    });

    triggerConfetti();
    return { success: true, transaction: newTx };
  };

  // Add funds
  const addDemoFunds = (currencyCode: string, amount: number) => {
    setWallets((prev) => {
      const exists = prev.some((w) => w.currencyCode === currencyCode);
      if (exists) {
        return prev.map((w) =>
          w.currencyCode === currencyCode ? { ...w, balance: w.balance + amount } : w
        );
      }
      return [
        ...prev,
        {
          id: `w_${currencyCode.toLowerCase()}`,
          currencyCode,
          balance: amount,
          isFavorite: false,
          isActive: true,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ];
    });

    const ref = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      referenceId: ref,
      title: `Deposit (${currencyCode})`,
      recipientMerchant: 'Direct Funds Deposit',
      category: 'Deposit',
      amount: amount,
      currency: currencyCode,
      type: 'income',
      status: 'completed',
      timestamp: new Date().toISOString(),
      fee: 0,
      note: 'Account deposit credited',
    };

    setTransactions((prev) => [newTx, ...prev]);

    addNotification({
      title: 'Funds Credited',
      description: `Added ${formatMoney(amount, currencyCode)} to your ${currencyCode} wallet.`,
      type: 'payment',
    });

    triggerConfetti();
  };

  // Wallet Management
  const addWallet = (currencyCode: string): boolean => {
    if (wallets.some((w) => w.currencyCode === currencyCode)) {
      return false;
    }
    const newWallet: Wallet = {
      id: `w_${currencyCode.toLowerCase()}`,
      currencyCode,
      balance: 0,
      isFavorite: false,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWallets((prev) => [...prev, newWallet]);
    addNotification({
      title: 'New Wallet Activated',
      description: `Your ${currencyCode} wallet is ready for transfers.`,
      type: 'payment',
    });
    return true;
  };

  const removeWallet = (currencyCode: string) => {
    setWallets((prev) => prev.filter((w) => w.currencyCode !== currencyCode));
  };

  const toggleWalletFavorite = (currencyCode: string) => {
    setWallets((prev) =>
      prev.map((w) =>
        w.currencyCode === currencyCode ? { ...w, isFavorite: !w.isFavorite } : w
      )
    );
  };

  // Savings Vaults
  const createVault = (vault: Omit<SavingsVault, 'id' | 'currentAmount'>) => {
    const newVault: SavingsVault = {
      ...vault,
      id: `v_${Date.now()}`,
      currentAmount: 0,
    };
    setSavingsVaults((prev) => [...prev, newVault]);
  };

  const depositToVault = (vaultId: string, amount: number) => {
    const vault = savingsVaults.find((v) => v.id === vaultId);
    if (!vault) return { success: false, error: 'Vault not found' };

    const sourceWallet = wallets.find((w) => w.currencyCode === vault.currency) || wallets[0];
    if (!sourceWallet || sourceWallet.balance < amount) {
      return { success: false, error: `Insufficient funds in ${sourceWallet.currencyCode} wallet.` };
    }

    setWallets((prev) =>
      prev.map((w) =>
        w.id === sourceWallet.id ? { ...w, balance: Math.max(0, w.balance - amount) } : w
      )
    );

    setSavingsVaults((prev) =>
      prev.map((v) =>
        v.id === vaultId ? { ...v, currentAmount: v.currentAmount + amount } : v
      )
    );

    triggerConfetti();
    return { success: true };
  };

  const withdrawFromVault = (vaultId: string, amount: number) => {
    const vault = savingsVaults.find((v) => v.id === vaultId);
    if (!vault) return { success: false, error: 'Vault not found' };
    if (vault.currentAmount < amount) {
      return { success: false, error: 'Cannot withdraw more than current vault balance.' };
    }

    setSavingsVaults((prev) =>
      prev.map((v) =>
        v.id === vaultId ? { ...v, currentAmount: v.currentAmount - amount } : v
      )
    );

    setWallets((prev) =>
      prev.map((w) =>
        w.currencyCode === vault.currency ? { ...w, balance: w.balance + amount } : w
      )
    );

    return { success: true };
  };

  // Card Controls
  const toggleCardFreeze = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const nextState = !c.isFrozen;
          return { ...c, isFrozen: nextState };
        }
        return c;
      })
    );
  };

  const updateCardSettings = (cardId: string, updates: Partial<PaymentCard>) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
    );
  };

  const updateCardPin = (cardId: string, newPin: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, pinMasked: newPin } : c))
    );
  };

  const setCardStyle = (cardId: string, style: CardStyle) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, style } : c))
    );
  };

  // Recipient Management
  const addRecipient = (recipient: Omit<Recipient, 'id'>) => {
    const newRecipient: Recipient = {
      ...recipient,
      id: `rec_${Date.now()}`,
    };
    setRecipients((prev) => [newRecipient, ...prev]);
    triggerConfetti();
  };

  const toggleRecipientFavorite = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const deleteRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  // Budget & Subscriptions
  const updateBudget = (id: string, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, limit: newLimit } : b))
    );
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s))
    );
  };

  const resumeSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s))
    );
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>
  ) => {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Profile & Settings
  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...updates }));
  };

  const upgradeTier = (tier: MembershipTier) => {
    setUserProfile((prev) => ({ ...prev, tier }));
    triggerConfetti();
  };

  const toggleTwoFactor = () => {
    setSecurityState((prev) => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
  };

  const toggleBiometrics = () => {
    setSecurityState((prev) => ({ ...prev, biometricEnabled: !prev.biometricEnabled }));
  };

  const revokeDevice = (deviceId: string) => {
    setSecurityState((prev) => ({
      ...prev,
      activeDevices: prev.activeDevices.filter((d) => d.id !== deviceId),
    }));
  };

  const resetToDemoDefaults = () => {
    localStorage.clear();
    setUserProfile(INITIAL_USER_PROFILE);
    setAppSettings(INITIAL_APP_SETTINGS);
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setRecipients(INITIAL_RECIPIENTS);
    setCards(INITIAL_CARDS);
    setSavingsVaults(INITIAL_SAVINGS_VAULTS);
    setBudgets(INITIAL_BUDGETS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSecurityState(INITIAL_SECURITY_STATE);
    setIsAuthenticated(true);
  };

  return (
    <BankingContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        appSettings,
        wallets,
        transactions,
        recipients,
        cards,
        savingsVaults,
        budgets,
        subscriptions,
        notifications,
        securityState,
        totalBalanceUSD,
        availableBalanceUSD,
        totalSavingsUSD,
        totalInvestmentsUSD,
        monthlySpendingUSD,
        monthlyIncomeUSD,
        unreadNotificationsCount,
        activeCurrency: appSettings.defaultCurrency || 'USD',
        currentLanguage: appSettings.language,
        t,
        setActiveCurrency,
        login,
        logout,
        register,
        quickDemoLogin,
        submitKYC,
        sendMoney,
        exchangeCurrencies,
        addDemoFunds,
        addWallet,
        removeWallet,
        toggleWalletFavorite,
        createVault,
        depositToVault,
        withdrawFromVault,
        toggleCardFreeze,
        updateCardSettings,
        updateCardPin,
        setCardStyle,
        addRecipient,
        toggleRecipientFavorite,
        deleteRecipient,
        updateBudget,
        cancelSubscription,
        resumeSubscription,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateProfile,
        updateSettings,
        upgradeTier,
        toggleTwoFactor,
        toggleBiometrics,
        revokeDevice,
        resetToDemoDefaults,
        getExchangeRate,
        formatMoney,
        triggerConfetti,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
