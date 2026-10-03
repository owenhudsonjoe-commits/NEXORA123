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
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_ayesha_78800',
  fullName: 'Ayesha Khan',
  email: 'ayeshabaloxh455@gmail.com',
  phone: '+92 300 7880099',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  country: 'Pakistan',
  address: 'Gulberg III, Lahore, Punjab, Pakistan',
  preferredCurrency: 'USD',
  language: 'en',
  timezone: 'Asia/Karachi (PKT +05:00)',
  tier: 'platinum',
  kycStatus: 'verified',
  idDocumentUploaded: true,
  accountNumber: 'PK-NEX-7880-9721-001',
};

export const INITIAL_APP_SETTINGS: AppSettings = {
  theme: 'light',
  defaultCurrency: 'USD',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  activityVisibility: true,
  marketingPreferences: false,
  hideBalances: false,
  hapticFeedback: true,
};

// Multi-currency Wallets: $5,999.91 USD (Rs 1,670,674.94 PKR equivalent with +$2,983 USD deposit by eSports web development PayPal 777)
export const INITIAL_WALLETS: Wallet[] = [
  { id: 'w_usd', currencyCode: 'USD', balance: 5999.91, isFavorite: true, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_pkr', currencyCode: 'PKR', balance: 1670674.94, isFavorite: true, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_eur', currencyCode: 'EUR', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_gbp', currencyCode: 'GBP', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_aed', currencyCode: 'AED', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_sar', currencyCode: 'SAR', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_cad', currencyCode: 'CAD', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_chf', currencyCode: 'CHF', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
  { id: 'w_jpy', currencyCode: 'JPY', balance: 0.00, isFavorite: false, isActive: true, createdAt: '2026-07-07' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_esports_web_paypal_2983',
    referenceId: 'PAYPAL-20261003-7772983',
    title: 'Inward Payment Received',
    recipientMerchant: 'eSports web development (PayPal 777)',
    category: 'Transfer',
    amount: 2983.00,
    currency: 'USD',
    type: 'income',
    status: 'completed',
    timestamp: '2026-10-03T10:30:00Z',
    fee: 0.00,
    note: 'Inward payment received from eSports web development via PayPal 777',
    counterpartyAccount: 'PayPal 777',
    recipientCountry: 'United States',
  },
  {
    id: 'tx_esports_web_paypal_436',
    referenceId: 'PAYPAL-20260905-777436',
    title: 'Inward Payment Received',
    recipientMerchant: 'eSports web development (PayPal 777)',
    category: 'Transfer',
    amount: 436.00,
    currency: 'USD',
    type: 'income',
    status: 'completed',
    timestamp: '2026-09-05T10:45:00Z',
    fee: 0.00,
    note: 'Inward payment received from eSports web development via PayPal 777',
    counterpartyAccount: 'PayPal 777',
    recipientCountry: 'United States',
  },
  {
    id: 'tx_umair_hayat_nbp_48k',
    referenceId: 'NBP-20260829-048000',
    title: 'Inward Transfer Received',
    recipientMerchant: 'Umair Hayat (NBP)',
    category: 'Transfer',
    amount: 48000.00,
    currency: 'PKR',
    type: 'income',
    status: 'completed',
    timestamp: '2026-08-29T09:15:00Z',
    fee: 0.00,
    note: 'Inward interbank transfer from Umair Hayat via National Bank of Pakistan (NBP) A/C 1**8791**',
    counterpartyAccount: 'NBP 1**8791**',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_umair_hayat_nbp_100k_4',
    referenceId: 'NBP-20260829-100004',
    title: 'Inward Transfer Received',
    recipientMerchant: 'Umair Hayat (NBP)',
    category: 'Transfer',
    amount: 100000.00,
    currency: 'PKR',
    type: 'income',
    status: 'completed',
    timestamp: '2026-08-29T08:55:00Z',
    fee: 0.00,
    note: 'Inward interbank transfer from Umair Hayat via National Bank of Pakistan (NBP) A/C 1**8791**',
    counterpartyAccount: 'NBP 1**8791**',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_umair_hayat_nbp_100k_3',
    referenceId: 'NBP-20260829-100003',
    title: 'Inward Transfer Received',
    recipientMerchant: 'Umair Hayat (NBP)',
    category: 'Transfer',
    amount: 100000.00,
    currency: 'PKR',
    type: 'income',
    status: 'completed',
    timestamp: '2026-08-29T08:50:00Z',
    fee: 0.00,
    note: 'Inward interbank transfer from Umair Hayat via National Bank of Pakistan (NBP) A/C 1**8791**',
    counterpartyAccount: 'NBP 1**8791**',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_umair_hayat_nbp_100k_2',
    referenceId: 'NBP-20260829-100002',
    title: 'Inward Transfer Received',
    recipientMerchant: 'Umair Hayat (NBP)',
    category: 'Transfer',
    amount: 100000.00,
    currency: 'PKR',
    type: 'income',
    status: 'completed',
    timestamp: '2026-08-29T08:45:00Z',
    fee: 0.00,
    note: 'Inward interbank transfer from Umair Hayat via National Bank of Pakistan (NBP) A/C 1**8791**',
    counterpartyAccount: 'NBP 1**8791**',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_umair_hayat_nbp_100k',
    referenceId: 'NBP-20260829-100000',
    title: 'Inward Transfer Received',
    recipientMerchant: 'Umair Hayat (NBP)',
    category: 'Transfer',
    amount: 100000.00,
    currency: 'PKR',
    type: 'income',
    status: 'completed',
    timestamp: '2026-08-29T08:15:00Z',
    fee: 0.00,
    note: 'Inward interbank transfer from Umair Hayat via National Bank of Pakistan (NBP) A/C 1**8791**',
    counterpartyAccount: 'NBP 1**8791**',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_deposit_july7_2026',
    referenceId: 'DEP-20260707-1000',
    title: 'Account Deposit',
    recipientMerchant: 'International Wire Transfer',
    category: 'Deposit',
    amount: 1000.00,
    currency: 'USD',
    type: 'income',
    status: 'completed',
    timestamp: '2026-07-07T10:30:00Z',
    fee: 0.00,
    note: 'Funds Deposit credited to Ayesha Khan on July 7, 2026',
    counterpartyAccount: 'WIRE-US-PK-78800',
    recipientCountry: 'Pakistan',
  },
  {
    id: 'tx_acc_maintenance',
    referenceId: 'FEE-20260707-0028',
    title: 'Security & Wallet Activation',
    recipientMerchant: 'Global Payment Gateway',
    category: 'Fees',
    amount: 28.00,
    currency: 'USD',
    type: 'expense',
    status: 'completed',
    timestamp: '2026-07-07T10:35:00Z',
    fee: 0.00,
    note: 'One-time secure multi-currency account setup',
    counterpartyAccount: 'SYS-NEXORA-SECURE',
  }
];

// All recipients cleared as requested
export const INITIAL_RECIPIENTS: Recipient[] = [];

export const INITIAL_CARDS: PaymentCard[] = [
  {
    id: 'card_ayesha_virtual_1',
    holderName: 'AYESHA KHAN',
    cardNumberMasked: '5412 •••• •••• 7880',
    expiryDate: '07/30',
    cvv: '788',
    isFrozen: false,
    style: 'black',
    type: 'virtual',
    spendingLimit: 2000,
    currentSpent: 28.00,
    pinMasked: '78800',
    onlinePaymentsEnabled: true,
    internationalPaymentsEnabled: true,
    contactlessEnabled: true,
    currency: 'USD',
    cardNetwork: 'Mastercard',
  },
  {
    id: 'card_ayesha_physical_1',
    holderName: 'AYESHA KHAN',
    cardNumberMasked: '4242 •••• •••• 9721',
    expiryDate: '12/29',
    cvv: '972',
    isFrozen: false,
    style: 'metallic',
    type: 'physical',
    spendingLimit: 5000,
    currentSpent: 0.00,
    pinMasked: '78800',
    onlinePaymentsEnabled: true,
    internationalPaymentsEnabled: true,
    contactlessEnabled: true,
    currency: 'USD',
    cardNetwork: 'VISA',
  },
];

export const INITIAL_SAVINGS_VAULTS: SavingsVault[] = [];

export const INITIAL_BUDGETS: Budget[] = [];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_esports_paypal_2983',
    title: 'Inward Payment: +$2,983.00 USD',
    description: '$2,983.00 USD received from eSports web development via PayPal 777.',
    timestamp: 'Just now',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_esports_paypal_436',
    title: 'Inward Payment: +$436.00 USD',
    description: '$436.00 USD received from eSports web development via PayPal 777.',
    timestamp: 'September 5, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_umair_nbp_48k',
    title: 'Inward Transfer: +Rs 48,000.00',
    description: 'Rs 48,000 credited from Umair Hayat via National Bank of Pakistan (NBP A/C 1**8791**).',
    timestamp: 'August 29, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_umair_nbp_4',
    title: 'Inward Transfer: +Rs 100,000.00',
    description: 'Rs 100,000 credited from Umair Hayat via National Bank of Pakistan (NBP A/C 1**8791**).',
    timestamp: 'August 29, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_umair_nbp_3',
    title: 'Inward Transfer: +Rs 100,000.00',
    description: 'Rs 100,000 credited from Umair Hayat via National Bank of Pakistan (NBP A/C 1**8791**).',
    timestamp: 'August 29, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_umair_nbp_2',
    title: 'Inward Transfer: +Rs 100,000.00',
    description: 'Rs 100,000 credited from Umair Hayat via National Bank of Pakistan (NBP A/C 1**8791**).',
    timestamp: 'August 29, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_umair_nbp',
    title: 'Inward Transfer: +Rs 100,000.00',
    description: 'Rs 100,000 credited from Umair Hayat via National Bank of Pakistan (NBP A/C 1**8791**).',
    timestamp: 'August 29, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_1',
    title: 'Deposit Received',
    description: '+$1,000.00 USD was successfully credited to your main account on July 7, 2026.',
    timestamp: 'July 7, 2026',
    type: 'payment',
    isRead: false,
  },
  {
    id: 'notif_2',
    title: 'Account Verified for Ayesha Khan',
    description: 'Your Pakistani identity and mobile wallet capabilities (Easypaisa, JazzCash, Raast) are active.',
    timestamp: 'July 7, 2026',
    type: 'security',
    isRead: false,
  },
];

export const INITIAL_SECURITY_STATE: SecurityState = {
  twoFactorEnabled: true,
  biometricEnabled: true,
  securityScore: 100,
  lastPasswordChange: '2026-07-07',
  autoLockMinutes: 5,
  activeDevices: [
    {
      id: 'dev_1',
      device: 'iPhone 16 Pro (Ayesha)',
      location: 'Lahore, Punjab, Pakistan',
      ipAddress: '39.40.112.94 (Encrypted)',
      lastActive: 'Active Now',
      isCurrent: true,
      browser: 'Mobile Banking Portal',
    },
  ],
};

export const BALANCE_TIMEFRAME_DATA = {
  '1D': [
    { time: '00:00', balance: 972 },
    { time: '04:00', balance: 972 },
    { time: '08:00', balance: 972 },
    { time: '12:00', balance: 972 },
    { time: '16:00', balance: 972 },
    { time: '20:00', balance: 972 },
  ],
  '1W': [
    { time: 'Mon', balance: 972, income: 0, expense: 0 },
    { time: 'Tue', balance: 972, income: 0, expense: 0 },
    { time: 'Wed', balance: 972, income: 0, expense: 0 },
    { time: 'Thu', balance: 972, income: 0, expense: 0 },
    { time: 'Fri', balance: 972, income: 0, expense: 0 },
    { time: 'Sat', balance: 972, income: 0, expense: 0 },
    { time: 'Sun', balance: 972, income: 0, expense: 0 },
  ],
  '1M': [
    { time: 'July 7', balance: 972, income: 1000, expense: 28 },
    { time: 'July 15', balance: 972, income: 0, expense: 0 },
    { time: 'July 25', balance: 972, income: 0, expense: 0 },
    { time: 'Aug 5', balance: 972, income: 0, expense: 0 },
    { time: 'Aug 28', balance: 972, income: 0, expense: 0 },
  ],
  '1Y': [
    { time: 'Jan', balance: 0, income: 0, expense: 0 },
    { time: 'Mar', balance: 0, income: 0, expense: 0 },
    { time: 'May', balance: 0, income: 0, expense: 0 },
    { time: 'Jul', balance: 972, income: 1000, expense: 28 },
    { time: 'Aug', balance: 972, income: 0, expense: 0 },
  ],
};

export const SPENDING_BY_CATEGORY_DATA = [
  { name: 'Direct Deposit', value: 1000.00, color: '#10B981', icon: 'ArrowDownLeft' },
  { name: 'Account Activation', value: 28.00, color: '#6366F1', icon: 'ShieldCheck' },
];

export const FINANCIAL_INSIGHTS = [
  {
    id: 'ins_1',
    title: 'Inward Payments & Transfers Received',
    text: '+$2,983.00 USD received from eSports web development (PayPal 777). Current available: $5,999.91 USD (Rs 1,670,675 PKR).',
    type: 'positive',
    icon: 'Sparkles',
  },
  {
    id: 'ins_2',
    title: 'Instant Remittance Active',
    text: 'Outward transfers to Pakistani wallets (Easypaisa, JazzCash, UPaisa, 1Link banks) and global destinations are active with 0% fee.',
    type: 'positive',
    icon: 'Globe',
  },
];

export const CASHFLOW_MONTHLY_DATA = [
  { month: 'Jul 2026', income: 1000, expense: 28 },
  { month: 'Aug 2026', income: 0, expense: 0 },
];

export const MERCHANT_BREAKDOWN_DATA = [
  { merchant: 'International Wire Deposit', amount: 1000.0, count: 1 },
];

export const FX_HISTORICAL_DATA: Record<string, { date: string; rate: number }[]> = {
  'USD/PKR': [
    { date: 'Aug 1', rate: 278.2 },
    { date: 'Aug 5', rate: 278.4 },
    { date: 'Aug 10', rate: 278.3 },
    { date: 'Aug 15', rate: 278.5 },
    { date: 'Aug 20', rate: 278.4 },
    { date: 'Aug 25', rate: 278.6 },
    { date: 'Aug 28', rate: 278.45 },
  ],
  'USD/EUR': [
    { date: 'Aug 1', rate: 0.915 },
    { date: 'Aug 5', rate: 0.918 },
    { date: 'Aug 10', rate: 0.914 },
    { date: 'Aug 15', rate: 0.922 },
    { date: 'Aug 20', rate: 0.920 },
    { date: 'Aug 25', rate: 0.925 },
    { date: 'Aug 28', rate: 0.923 },
  ],
};

export const FAQ_ITEMS = [
  {
    q: 'How do I send money to Pakistani wallets?',
    a: 'Click "Send Money", choose Pakistan, and select from Easypaisa, JazzCash, UPaisa, SadaPay, NayaPay, or any Pakistani Bank. Transfers are processed instantly.',
  },
  {
    q: 'How do I view my balance in PKR (Pakistani Rupee)?',
    a: 'Use the currency switcher in the dashboard header or on the balance card to instantly view your multi-currency balance converted to PKR (Rs 840,058) at the live exchange rate.',
  },
  {
    q: 'How is account access secured?',
    a: 'Your account is secured with email verification and a 5-digit encrypted Security PIN along with Biometric Face ID authentication.',
  },
];
