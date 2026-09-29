export type CurrencyRegion = 'Americas' | 'Europe' | 'Asia' | 'Oceania' | 'Africa';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  region: CurrencyRegion;
  rateAgainstUSD: number; // 1 USD = X Currency
  decimals: number;
  country: string;
}

export interface Wallet {
  id: string;
  currencyCode: string;
  balance: number;
  isFavorite: boolean;
  isActive: boolean;
  createdAt: string;
}

export type TransactionCategory =
  | 'Salary'
  | 'Deposit'
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Entertainment'
  | 'Bills'
  | 'Fees'
  | 'Travel'
  | 'Healthcare'
  | 'Education'
  | 'Subscriptions'
  | 'Exchange'
  | 'Investment'
  | 'Savings'
  | 'Transfer'
  | 'Other';

export type TransactionStatus = 'completed' | 'pending' | 'scheduled' | 'failed' | 'cancelled';
export type TransactionType = 'income' | 'expense' | 'transfer' | 'exchange';

export interface Transaction {
  id: string;
  referenceId: string;
  title: string;
  recipientMerchant: string;
  category: TransactionCategory;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
  fee: number;
  note?: string;
  counterpartyAccount?: string;
  recipientCountry?: string;
  recipientAvatar?: string;
  isCardTransaction?: boolean;
  cardLast4?: string;
  exchangeDetails?: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: number;
    toAmount: number;
    rate: number;
  };
}

export interface Recipient {
  id: string;
  name: string;
  accountIdentifier: string; // IBAN, Account No, or Tag
  country: string;
  countryCode: string;
  currency: string;
  avatar: string;
  isFavorite: boolean;
  category: 'Personal' | 'Business' | 'Family' | 'Frequent';
  lastTransferDate?: string;
  bankName?: string;
}

export type CardStyle = 'black' | 'metallic' | 'gradient' | 'minimal-white';
export type CardType = 'virtual' | 'physical';

export interface PaymentCard {
  id: string;
  holderName: string;
  cardNumberMasked: string; // e.g. "4532 •••• •••• 8829"
  expiryDate: string;
  cvv: string;
  isFrozen: boolean;
  style: CardStyle;
  type: CardType;
  spendingLimit: number;
  currentSpent: number;
  pinMasked: string;
  onlinePaymentsEnabled: boolean;
  internationalPaymentsEnabled: boolean;
  contactlessEnabled: boolean;
  currency: string;
  cardNetwork: 'VISA' | 'Mastercard';
}

export interface SavingsVault {
  id: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  currency: string;
  targetDate: string;
  monthlyContribution: number;
  category: string;
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  currency: string;
  period: 'monthly' | 'weekly';
  alertThreshold: number; // percentage, e.g. 80
}

export interface Subscription {
  id: string;
  name: string;
  provider: string;
  logo: string;
  cost: number;
  currency: string;
  billingCycle: 'Monthly' | 'Yearly';
  nextPaymentDate: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
  plan: string;
}

export type NotificationType =
  | 'payment'
  | 'transfer'
  | 'card'
  | 'exchange'
  | 'security'
  | 'budget'
  | 'subscription';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
}

export interface DeviceSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  browser: string;
}

export interface SecurityState {
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  securityScore: number;
  activeDevices: DeviceSession[];
  lastPasswordChange: string;
  autoLockMinutes: number;
}

export type MembershipTier = 'standard' | 'plus' | 'premium' | 'metal' | 'platinum';
export type KYCStatus = 'verified' | 'pending' | 'review';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  country: string;
  address: string;
  preferredCurrency: string;
  language: string;
  timezone: string;
  tier: MembershipTier;
  kycStatus: KYCStatus;
  idDocumentUploaded?: boolean;
  accountNumber: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  defaultCurrency: string;
  language: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  activityVisibility: boolean;
  marketingPreferences: boolean;
  hideBalances: boolean;
  hapticFeedback: boolean;
}
