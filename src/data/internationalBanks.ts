export interface InternationalPaymentProvider {
  id: string;
  name: string;
  shortName: string;
  code: string;
  type: 'fintech_wallet' | 'digital_neobank' | 'global_bank';
  category: 'Global Fintech' | 'Neobanks' | 'Global Commercial';
  color: string;
  accentColor: string;
  badge: string;
  supportedCurrencies: string[];
  defaultCurrency: string;
  accountLabel: string;
  accountPlaceholder: string;
  exampleId: string;
  popular?: boolean;
  description: string;
  processingNetwork: string;
  clearingTime: string;
}

export const ALL_INTERNATIONAL_PROVIDERS: InternationalPaymentProvider[] = [
  // 1. REVOLUT
  {
    id: 'revolut',
    name: 'Revolut',
    shortName: 'Revolut',
    code: 'REV',
    type: 'digital_neobank',
    category: 'Neobanks',
    color: 'from-blue-600 to-cyan-500',
    accentColor: '#0075FF',
    badge: 'Instant Revtag / IBAN',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY'],
    defaultCurrency: 'USD',
    accountLabel: 'Revolut @Revtag, Phone, or IBAN',
    accountPlaceholder: '@ayesha_khan or GB82 REVO 0099 1234 5678 90',
    exampleId: '@ayesha_khan',
    popular: true,
    description: 'Instant peer-to-peer payout via Revtag or multi-currency European IBAN.',
    processingNetwork: 'Revolut P2P / SEPA Instant',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 2. PAYONEER
  {
    id: 'payoneer',
    name: 'Payoneer',
    shortName: 'Payoneer',
    code: 'PAYO',
    type: 'fintech_wallet',
    category: 'Global Fintech',
    color: 'from-orange-500 to-amber-600',
    accentColor: '#FF4800',
    badge: 'Global Payouts & Freelance',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
    defaultCurrency: 'USD',
    accountLabel: 'Payoneer Registered Email or Customer ID',
    accountPlaceholder: 'freelancer@payoneer.com or PAYO-991204',
    exampleId: 'ayeshabaloxh455@gmail.com',
    popular: true,
    description: 'Global contractor, freelance marketplace & business cross-border payout.',
    processingNetwork: 'Payoneer Global Payout Network',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 3. PAYPAL
  {
    id: 'paypal',
    name: 'PayPal',
    shortName: 'PayPal',
    code: 'PP',
    type: 'fintech_wallet',
    category: 'Global Fintech',
    color: 'from-blue-700 to-sky-500',
    accentColor: '#003087',
    badge: 'Worldwide Digital Wallet',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    defaultCurrency: 'USD',
    accountLabel: 'PayPal Email, Phone, or PayPal.Me link',
    accountPlaceholder: 'recipient@paypal.com or paypal.me/username',
    exampleId: 'ayeshabaloxh455@gmail.com',
    popular: true,
    description: 'Send directly to any PayPal account or PayPal.Me link worldwide.',
    processingNetwork: 'PayPal Digital P2P Rails',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 4. WISE
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    shortName: 'Wise',
    code: 'WISE',
    type: 'digital_neobank',
    category: 'Neobanks',
    color: 'from-emerald-500 to-teal-600',
    accentColor: '#9FE870',
    badge: 'Real Mid-Market Rate',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF'],
    defaultCurrency: 'USD',
    accountLabel: 'Wise Account Email or Multi-Currency IBAN',
    accountPlaceholder: 'user@wise.com or BE68 5390 0754 7034',
    exampleId: 'ayesha.khan@wise.com',
    popular: true,
    description: 'Direct payout to Wise borderless multi-currency account.',
    processingNetwork: 'Wise Local Clearing Network',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 5. CASH APP
  {
    id: 'cashapp',
    name: 'Cash App',
    shortName: 'Cash App',
    code: 'CASH',
    type: 'fintech_wallet',
    category: 'Global Fintech',
    color: 'from-emerald-600 to-green-500',
    accentColor: '#00D632',
    badge: '$Cashtag Instant',
    supportedCurrencies: ['USD', 'GBP'],
    defaultCurrency: 'USD',
    accountLabel: 'Cash App $Cashtag or Registered Email',
    accountPlaceholder: '$AyeshaKhan or phone number',
    exampleId: '$AyeshaKhan',
    popular: true,
    description: 'Direct P2P transfer via $Cashtag to US & UK users.',
    processingNetwork: 'Block / Cash App Network',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 6. JPMORGAN CHASE
  {
    id: 'chase',
    name: 'JPMorgan Chase Bank (USA)',
    shortName: 'Chase',
    code: 'CHASE',
    type: 'global_bank',
    category: 'Global Commercial',
    color: 'from-blue-900 to-blue-700',
    accentColor: '#117ACA',
    badge: 'ACH / Fedwire Direct',
    supportedCurrencies: ['USD'],
    defaultCurrency: 'USD',
    accountLabel: 'Routing Number (9-digits) & Account Number',
    accountPlaceholder: '021000021 / 987654321',
    exampleId: '021000021 / 987654321',
    popular: true,
    description: 'Direct Federal Reserve wire & ACH transfer to Chase accounts.',
    processingNetwork: 'Fedwire / The Clearing House RTP',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 7. BARCLAYS UK
  {
    id: 'barclays',
    name: 'Barclays Bank UK',
    shortName: 'Barclays',
    code: 'BARC',
    type: 'global_bank',
    category: 'Global Commercial',
    color: 'from-sky-700 to-cyan-800',
    accentColor: '#00AEEF',
    badge: 'Faster Payments (FPS)',
    supportedCurrencies: ['GBP', 'EUR'],
    defaultCurrency: 'GBP',
    accountLabel: 'UK Sort Code (6-digit) & Account Number (8-digit)',
    accountPlaceholder: '20-00-00 / 12345678',
    exampleId: '20-04-15 / 88992211',
    popular: true,
    description: 'Instant UK Faster Payments Service (FPS) to Barclays account holders.',
    processingNetwork: 'UK Faster Payments / CHAPS',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 8. HSBC GLOBAL
  {
    id: 'hsbc',
    name: 'HSBC Global Banking',
    shortName: 'HSBC',
    code: 'HSBC',
    type: 'global_bank',
    category: 'Global Commercial',
    color: 'from-red-600 to-rose-800',
    accentColor: '#DB0011',
    badge: 'Global SWIFT & IBAN',
    supportedCurrencies: ['USD', 'GBP', 'EUR', 'AED', 'SGD', 'CAD'],
    defaultCurrency: 'USD',
    accountLabel: 'Global IBAN / SWIFT BIC & Account Number',
    accountPlaceholder: 'GB29 MIDL 4005 1512 3456 78',
    exampleId: 'GB29 MIDL 4005 1512 3456 78',
    popular: true,
    description: 'Worldwide premier cross-border settlement with HSBC global network.',
    processingNetwork: 'HSBC Global Liquidity Engine / SWIFT',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 9. N26 BANK
  {
    id: 'n26',
    name: 'N26 The Mobile Bank (EU)',
    shortName: 'N26',
    code: 'N26',
    type: 'digital_neobank',
    category: 'Neobanks',
    color: 'from-teal-600 to-emerald-700',
    accentColor: '#36A18B',
    badge: 'SEPA Instant Credit (EUR)',
    supportedCurrencies: ['EUR'],
    defaultCurrency: 'EUR',
    accountLabel: 'European IBAN (DE / ES / IT / FR)',
    accountPlaceholder: 'DE89 1001 1001 2612 3456 78',
    exampleId: 'DE89 1001 1001 2612 3456 78',
    popular: false,
    description: 'Instant euro payouts via European Central Bank TARGET Instant Payment Settlement.',
    processingNetwork: 'SEPA Instant Credit Transfer',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 10. MONZO BANK
  {
    id: 'monzo',
    name: 'Monzo Bank UK',
    shortName: 'Monzo',
    code: 'MNZO',
    type: 'digital_neobank',
    category: 'Neobanks',
    color: 'from-rose-500 to-pink-600',
    accentColor: '#FF3366',
    badge: 'Monzo.me & UK FPS',
    supportedCurrencies: ['GBP'],
    defaultCurrency: 'GBP',
    accountLabel: 'Sort Code (04-00-04) & Account No or Monzo.me',
    accountPlaceholder: '04-00-04 / 12345678 or monzo.me/name',
    exampleId: '04-00-04 / 99112233',
    popular: false,
    description: 'UK app-based digital neobank with instant push notifications and payments.',
    processingNetwork: 'UK FPS Rails',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 11. STRIPE PAYOUTS
  {
    id: 'stripe',
    name: 'Stripe Direct / Connect',
    shortName: 'Stripe',
    code: 'STRP',
    type: 'fintech_wallet',
    category: 'Global Fintech',
    color: 'from-indigo-600 to-violet-700',
    accentColor: '#635BFF',
    badge: 'Instant Card & Merchant Rails',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    defaultCurrency: 'USD',
    accountLabel: 'Connected Account ID (acct_...) or Email',
    accountPlaceholder: 'acct_1N4m92K... or payout@company.com',
    exampleId: 'acct_1N9284KLSMX001',
    popular: false,
    description: 'Instant settlement for developers, SaaS businesses, and global platforms.',
    processingNetwork: 'Stripe Instant Payouts Engine',
    clearingTime: 'Instant (5-sec clearance)',
  },

  // 12. SKRILL
  {
    id: 'skrill',
    name: 'Skrill Global Wallet',
    shortName: 'Skrill',
    code: 'SKRL',
    type: 'fintech_wallet',
    category: 'Global Fintech',
    color: 'from-fuchsia-700 to-purple-800',
    accentColor: '#811345',
    badge: 'Digital Wallet',
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    defaultCurrency: 'USD',
    accountLabel: 'Registered Skrill Email Address',
    accountPlaceholder: 'user@domain.com',
    exampleId: 'ayeshabaloxh455@gmail.com',
    popular: false,
    description: 'Fast digital wallet payments and international remittances.',
    processingNetwork: 'Paysafe Clearing Rails',
    clearingTime: 'Instant (5-sec clearance)',
  },
];
