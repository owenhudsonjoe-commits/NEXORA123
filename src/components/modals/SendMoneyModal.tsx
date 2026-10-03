import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  User,
  Globe,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Share2,
  Download,
  CreditCard,
  Layers,
  Sparkles,
  Info,
  Smartphone,
  Building2,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Lock,
  Loader2,
  Calendar,
  CalendarClock,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  Ban,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { GLOBAL_CURRENCIES } from '../../data/currencies';
import { Transaction } from '../../types';
import {
  AVAILABLE_COUNTRIES,
  RESTRICTED_COUNTRIES,
  isCountryRestricted,
  getRestrictedCountry,
  AvailableCountry,
  RestrictedCountry,
} from '../../data/restrictedCountries';
import { ApplyCardModal } from './ApplyCardModal';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipientName?: string;
  defaultCurrency?: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  shortName?: string;
  category: 'pakistan_wallet' | 'pakistan_bank' | 'international_bank' | 'wallet' | 'wire';
  badge: string;
  logoText: string;
  description: string;
  accountLabel: string;
  placeholder: string;
  flag?: string;
}

// Complete list of Pakistani Wallets, Pakistani Banks, and International Rails
export const INTERNATIONAL_PAYMENT_PROVIDERS: PaymentProvider[] = [
  // PAKISTANI MOBILE & DIGITAL WALLETS (ALL WALLETS: Easypaisa, JazzCash, SadaPay, NayaPay, UPaisa, Zindigi, Raast, Finja, PayMax, HBL Konnect, UBL Omni, Alfa Wallet, Digitt+, Careem Pay)
  {
    id: 'easypaisa',
    name: 'Easypaisa (Telenor Microfinance Bank)',
    shortName: 'Easypaisa',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'EP',
    flag: '🇵🇰',
    description: 'Instant payout to Easypaisa account number (03XXXXXXXXX)',
    accountLabel: 'Easypaisa Mobile Account Number (03XXXXXXXXX)',
    placeholder: 'e.g. 0345 1234567 or 0300 9876543',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash (Mobilink Microfinance Bank)',
    shortName: 'JazzCash',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'JC',
    flag: '🇵🇰',
    description: 'Instant payout to JazzCash mobile wallet number (03XXXXXXXXX)',
    accountLabel: 'JazzCash Mobile Account Number (03XXXXXXXXX)',
    placeholder: 'e.g. 0300 1234567 or 0321 7654321',
  },
  {
    id: 'sadapay',
    name: 'SadaPay (Digital EMI Wallet)',
    shortName: 'SadaPay',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'SADA',
    flag: '🇵🇰',
    description: 'Instant transfer to SadaPay registered mobile number or IBAN',
    accountLabel: 'SadaPay Mobile Number / IBAN',
    placeholder: 'e.g. 0300 1234567 or PK36 SADA 0000 1234 5678',
  },
  {
    id: 'nayapay',
    name: 'NayaPay (Digital EMI Wallet)',
    shortName: 'NayaPay',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'NAYA',
    flag: '🇵🇰',
    description: 'Instant transfer to NayaPay User Tag (@tag) or mobile number',
    accountLabel: 'NayaPay Tag (@username) / Mobile Number',
    placeholder: 'e.g. @nayapay_id or 0300 1234567',
  },
  {
    id: 'upaisa',
    name: 'UPaisa (U Microfinance Bank)',
    shortName: 'UPaisa',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'UP',
    flag: '🇵🇰',
    description: 'Instant transfer to Ufone UPaisa mobile account (03XXXXXXXXX)',
    accountLabel: 'UPaisa Mobile Account Number',
    placeholder: 'e.g. 0333 1234567',
  },
  {
    id: 'zindigi',
    name: 'Zindigi (Powered by JS Bank)',
    shortName: 'Zindigi',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'ZIND',
    flag: '🇵🇰',
    description: 'Instant payout to Zindigi digital account or mobile number',
    accountLabel: 'Zindigi Account / Mobile Number',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'hbl_konnect',
    name: 'HBL Konnect (Branchless Mobile Wallet)',
    shortName: 'HBL Konnect',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'KNCT',
    flag: '🇵🇰',
    description: 'Instant payout to HBL Konnect registered mobile account',
    accountLabel: 'HBL Konnect Mobile Account Number',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'ubl_omni',
    name: 'UBL Omni (Branchless Mobile Wallet)',
    shortName: 'UBL Omni',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'OMNI',
    flag: '🇵🇰',
    description: 'Instant payout to UBL Omni mobile account number',
    accountLabel: 'UBL Omni Mobile Account Number',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'alfa_wallet',
    name: 'Alfa Wallet (Bank Alfalah Mobile Wallet)',
    shortName: 'Alfa Wallet',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'ALFA',
    flag: '🇵🇰',
    description: 'Instant payout to Bank Alfalah Alfa digital wallet account',
    accountLabel: 'Alfa Wallet Mobile Number / Account',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'finja',
    name: 'Finja (Digital EMI Wallet)',
    shortName: 'Finja',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'FNJA',
    flag: '🇵🇰',
    description: 'Instant payout to Finja registered mobile wallet account',
    accountLabel: 'Finja Mobile Wallet Number',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'paymax',
    name: 'PayMax (Zong Microfinance)',
    shortName: 'PayMax',
    category: 'pakistan_wallet',
    badge: 'Mobile Wallet',
    logoText: 'PMAX',
    flag: '🇵🇰',
    description: 'Instant payout to Zong PayMax mobile account',
    accountLabel: 'PayMax Mobile Account Number',
    placeholder: 'e.g. 0312 1234567',
  },
  {
    id: 'digitt_plus',
    name: 'Digitt+ (AFT Agri & EMI Wallet)',
    shortName: 'Digitt+',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'DGTT',
    flag: '🇵🇰',
    description: 'Instant transfer to Digitt+ digital wallet account',
    accountLabel: 'Digitt+ Account Number / Mobile',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'careem_pay',
    name: 'Careem Pay Pakistan (Wallet)',
    shortName: 'Careem Pay',
    category: 'pakistan_wallet',
    badge: 'Digital Wallet',
    logoText: 'CRMP',
    flag: '🇵🇰',
    description: 'Instant transfer to Careem Pay wallet balance',
    accountLabel: 'Careem Pay Registered Mobile Number',
    placeholder: 'e.g. 0300 1234567',
  },
  {
    id: 'raast',
    name: 'Raast SBP Instant Pay',
    shortName: 'Raast SBP',
    category: 'pakistan_wallet',
    badge: 'State Bank Rail',
    logoText: 'RAAST',
    flag: '🇵🇰',
    description: 'Direct State Bank of Pakistan Raast instant interbank clearing',
    accountLabel: 'Raast ID (Linked Mobile Number or Raast IBAN)',
    placeholder: 'e.g. 03001234567 or PK80 MEZN 0001 2345 6789 0101',
  },

  // ALL PAKISTANI COMMERCIAL, ISLAMIC, PROVINCIAL & MICROFINANCE BANKS
  {
    id: 'meezan_bank',
    name: 'Meezan Bank Limited',
    shortName: 'Meezan',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'MEZN',
    flag: '🇵🇰',
    description: 'Direct settlement to Meezan Bank 24-digit IBAN or account',
    accountLabel: 'Meezan Bank Account Number / IBAN',
    placeholder: 'e.g. PK36 MEZN 0001 2345 6789 0101',
  },
  {
    id: 'hbl_bank',
    name: 'Habib Bank Limited (HBL)',
    shortName: 'HBL',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'HBL',
    flag: '🇵🇰',
    description: 'Direct settlement to HBL account or 24-digit IBAN',
    accountLabel: 'HBL Account Number / IBAN',
    placeholder: 'e.g. PK72 HABB 0001 2345 6789 0101',
  },
  {
    id: 'ubl_bank',
    name: 'United Bank Limited (UBL)',
    shortName: 'UBL',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'UBL',
    flag: '🇵🇰',
    description: 'Direct settlement to UBL Digital account or IBAN',
    accountLabel: 'UBL Account Number / IBAN',
    placeholder: 'e.g. PK21 UNIL 0001 2345 6789 0101',
  },
  {
    id: 'mcb_bank',
    name: 'MCB Bank Limited',
    shortName: 'MCB',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'MCB',
    flag: '🇵🇰',
    description: 'Direct settlement to MCB Live account or IBAN',
    accountLabel: 'MCB Account Number / IBAN',
    placeholder: 'e.g. PK40 MUCB 0001 2345 6789 0101',
  },
  {
    id: 'alfalah_bank',
    name: 'Bank Alfalah',
    shortName: 'Alfalah',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'BAFL',
    flag: '🇵🇰',
    description: 'Direct transfer to Bank Alfalah Alfa account or IBAN',
    accountLabel: 'Bank Alfalah Account Number / IBAN',
    placeholder: 'e.g. PK56 ALFH 0001 2345 6789 0101',
  },
  {
    id: 'abl_bank',
    name: 'Allied Bank Limited (ABL)',
    shortName: 'ABL',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'ABL',
    flag: '🇵🇰',
    description: 'Direct settlement to Allied Bank MyABL account or IBAN',
    accountLabel: 'Allied Bank Account Number / IBAN',
    placeholder: 'e.g. PK34 ABPA 0001 2345 6789 0101',
  },
  {
    id: 'nbp_bank',
    name: 'National Bank of Pakistan (NBP)',
    shortName: 'NBP',
    category: 'pakistan_bank',
    badge: 'Public Bank',
    logoText: 'NBP',
    flag: '🇵🇰',
    description: 'Direct settlement to NBP account or 24-digit IBAN',
    accountLabel: 'National Bank Account Number / IBAN',
    placeholder: 'e.g. PK12 NBPA 0001 2345 6789 0101',
  },
  {
    id: 'scb_bank',
    name: 'Standard Chartered Bank Pakistan',
    shortName: 'Standard Chartered',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'SCB',
    flag: '🇵🇰',
    description: 'Direct clearing via Standard Chartered Pakistan IBAN',
    accountLabel: 'Standard Chartered Account / IBAN',
    placeholder: 'e.g. PK90 SCBL 0001 2345 6789 0101',
  },
  {
    id: 'faysal_bank',
    name: 'Faysal Bank Limited (Islamic)',
    shortName: 'Faysal Bank',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'FAYS',
    flag: '🇵🇰',
    description: 'Direct settlement to Faysal Islamic banking account or IBAN',
    accountLabel: 'Faysal Bank Account Number / IBAN',
    placeholder: 'e.g. PK50 FAYS 0001 2345 6789 0101',
  },
  {
    id: 'askari_bank',
    name: 'Askari Bank Limited',
    shortName: 'Askari Bank',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'AKBL',
    flag: '🇵🇰',
    description: 'Direct settlement to Askari Bank digital account or IBAN',
    accountLabel: 'Askari Bank Account Number / IBAN',
    placeholder: 'e.g. PK88 ASKI 0001 2345 6789 0101',
  },
  {
    id: 'bop_bank',
    name: 'The Bank of Punjab (BOP)',
    shortName: 'Bank of Punjab',
    category: 'pakistan_bank',
    badge: 'Provincial Bank',
    logoText: 'BOP',
    flag: '🇵🇰',
    description: 'Direct transfer to Bank of Punjab digiBOP account or IBAN',
    accountLabel: 'Bank of Punjab Account / IBAN',
    placeholder: 'e.g. PK19 BPUN 0001 2345 6789 0101',
  },
  {
    id: 'bank_al_habib',
    name: 'Bank AL Habib Limited',
    shortName: 'Bank AL Habib',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'BAHL',
    flag: '🇵🇰',
    description: 'Direct settlement to Bank AL Habib account or IBAN',
    accountLabel: 'Bank AL Habib Account Number / IBAN',
    placeholder: 'e.g. PK04 BAHL 0001 2345 6789 0101',
  },
  {
    id: 'js_bank',
    name: 'JS Bank Limited',
    shortName: 'JS Bank',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'JSBL',
    flag: '🇵🇰',
    description: 'Direct settlement to JS Bank account or 24-digit IBAN',
    accountLabel: 'JS Bank Account Number / IBAN',
    placeholder: 'e.g. PK44 JSBL 0001 2345 6789 0101',
  },
  {
    id: 'soneri_bank',
    name: 'Soneri Bank Limited',
    shortName: 'Soneri Bank',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'SNBL',
    flag: '🇵🇰',
    description: 'Direct settlement to Soneri Bank account or IBAN',
    accountLabel: 'Soneri Bank Account Number / IBAN',
    placeholder: 'e.g. PK78 SNBL 0001 2345 6789 0101',
  },
  {
    id: 'dib_bank',
    name: 'Dubai Islamic Bank Pakistan',
    shortName: 'Dubai Islamic',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'DIB',
    flag: '🇵🇰',
    description: 'Direct settlement to Dubai Islamic Bank Pakistan IBAN',
    accountLabel: 'Dubai Islamic Bank Account / IBAN',
    placeholder: 'e.g. PK16 DUBA 0001 2345 6789 0101',
  },
  {
    id: 'bankislami',
    name: 'BankIslami Pakistan Limited',
    shortName: 'BankIslami',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'BIPL',
    flag: '🇵🇰',
    description: 'Direct settlement to BankIslami account or 24-digit IBAN',
    accountLabel: 'BankIslami Account Number / IBAN',
    placeholder: 'e.g. PK22 BKIP 0001 2345 6789 0101',
  },
  {
    id: 'habib_metro',
    name: 'Habib Metropolitan Bank',
    shortName: 'Habib Metro',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'HMB',
    flag: '🇵🇰',
    description: 'Direct settlement to Habib Metro account or IBAN',
    accountLabel: 'Habib Metro Account Number / IBAN',
    placeholder: 'e.g. PK62 HMBL 0001 2345 6789 0101',
  },
  {
    id: 'al_baraka',
    name: 'Al Baraka Bank (Pakistan)',
    shortName: 'Al Baraka',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'ABPA',
    flag: '🇵🇰',
    description: 'Direct settlement to Al Baraka Islamic banking IBAN',
    accountLabel: 'Al Baraka Bank Account / IBAN',
    placeholder: 'e.g. PK30 ALBK 0001 2345 6789 0101',
  },
  {
    id: 'bok_bank',
    name: 'The Bank of Khyber (BOK)',
    shortName: 'Bank of Khyber',
    category: 'pakistan_bank',
    badge: 'Provincial Bank',
    logoText: 'BOK',
    flag: '🇵🇰',
    description: 'Direct settlement to Bank of Khyber account or IBAN',
    accountLabel: 'Bank of Khyber Account / IBAN',
    placeholder: 'e.g. PK55 BOKY 0001 2345 6789 0101',
  },
  {
    id: 'sindh_bank',
    name: 'Sindh Bank Limited',
    shortName: 'Sindh Bank',
    category: 'pakistan_bank',
    badge: 'Provincial Bank',
    logoText: 'SIND',
    flag: '🇵🇰',
    description: 'Direct transfer to Sindh Bank account or 24-digit IBAN',
    accountLabel: 'Sindh Bank Account Number / IBAN',
    placeholder: 'e.g. PK49 SNDH 0001 2345 6789 0101',
  },
  {
    id: 'silkbank',
    name: 'Silkbank Limited',
    shortName: 'Silkbank',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'SILK',
    flag: '🇵🇰',
    description: 'Direct settlement to Silkbank account or 24-digit IBAN',
    accountLabel: 'Silkbank Account Number / IBAN',
    placeholder: 'e.g. PK39 SILK 0001 2345 6789 0101',
  },
  {
    id: 'samba_bank',
    name: 'Samba Bank Limited',
    shortName: 'Samba Bank',
    category: 'pakistan_bank',
    badge: 'Commercial Bank',
    logoText: 'SAMB',
    flag: '🇵🇰',
    description: 'Direct settlement to Samba Bank Pakistan IBAN',
    accountLabel: 'Samba Bank Account Number / IBAN',
    placeholder: 'e.g. PK11 SAMB 0001 2345 6789 0101',
  },
  {
    id: 'fwbl_bank',
    name: 'First Women Bank Limited (FWBL)',
    shortName: 'First Women Bank',
    category: 'pakistan_bank',
    badge: 'Public Bank',
    logoText: 'FWBL',
    flag: '🇵🇰',
    description: 'Direct settlement to First Women Bank account or IBAN',
    accountLabel: 'First Women Bank Account / IBAN',
    placeholder: 'e.g. PK25 FWBL 0001 2345 6789 0101',
  },
  {
    id: 'ztbl_bank',
    name: 'Zarai Taraqiati Bank Limited (ZTBL)',
    shortName: 'ZTBL',
    category: 'pakistan_bank',
    badge: 'Public Bank',
    logoText: 'ZTBL',
    flag: '🇵🇰',
    description: 'Direct settlement to ZTBL agricultural development account',
    accountLabel: 'ZTBL Account Number / IBAN',
    placeholder: 'e.g. PK82 ZARI 0001 2345 6789 0101',
  },
  {
    id: 'bml_bank',
    name: 'Bank Makramah Limited (BML / Summit)',
    shortName: 'Bank Makramah',
    category: 'pakistan_bank',
    badge: 'Islamic Bank',
    logoText: 'BML',
    flag: '🇵🇰',
    description: 'Direct settlement to Bank Makramah account or IBAN',
    accountLabel: 'Bank Makramah Account / IBAN',
    placeholder: 'e.g. PK66 SMBL 0001 2345 6789 0101',
  },
  {
    id: 'mmbl_bank',
    name: 'Mobilink Microfinance Bank Limited',
    shortName: 'Mobilink Bank',
    category: 'pakistan_bank',
    badge: 'Microfinance',
    logoText: 'MMBL',
    flag: '🇵🇰',
    description: 'Direct settlement to Mobilink Microfinance Bank account or IBAN',
    accountLabel: 'Mobilink Bank Account / IBAN',
    placeholder: 'e.g. PK77 MMBL 0001 2345 6789 0101',
  },
  {
    id: 'tmb_bank',
    name: 'Telenor Microfinance Bank Limited',
    shortName: 'Telenor Bank',
    category: 'pakistan_bank',
    badge: 'Microfinance',
    logoText: 'TMB',
    flag: '🇵🇰',
    description: 'Direct settlement to Telenor Microfinance Bank account or IBAN',
    accountLabel: 'Telenor Bank Account / IBAN',
    placeholder: 'e.g. PK83 TMBL 0001 2345 6789 0101',
  },
  {
    id: 'kmbl_bank',
    name: 'Khushhali Microfinance Bank Limited',
    shortName: 'Khushhali Bank',
    category: 'pakistan_bank',
    badge: 'Microfinance',
    logoText: 'KMBL',
    flag: '🇵🇰',
    description: 'Direct settlement to Khushhali Microfinance Bank account',
    accountLabel: 'Khushhali Bank Account / IBAN',
    placeholder: 'e.g. PK92 KMBL 0001 2345 6789 0101',
  },
  {
    id: 'nrsp_bank',
    name: 'NRSP Microfinance Bank Limited',
    shortName: 'NRSP Bank',
    category: 'pakistan_bank',
    badge: 'Microfinance',
    logoText: 'NRSP',
    flag: '🇵🇰',
    description: 'Direct settlement to NRSP Microfinance Bank account',
    accountLabel: 'NRSP Bank Account / IBAN',
    placeholder: 'e.g. PK95 NRSP 0001 2345 6789 0101',
  },
  {
    id: 'all_1link_banks',
    name: 'All Other Pakistani 1Link Banks',
    shortName: '1Link Banks',
    category: 'pakistan_bank',
    badge: '1Link Network',
    logoText: '🏛️',
    flag: '🇵🇰',
    description: 'Settlement to all 40+ member banks & microfinance institutions on 1Link',
    accountLabel: 'Bank Name & 24-Digit IBAN',
    placeholder: 'e.g. Bank Name - PK34 ABPA 0001 2345 6789 0101',
  },

  // INTERNATIONAL RAILS
  {
    id: 'revolut',
    name: 'Revolut',
    shortName: 'Revolut',
    category: 'international_bank',
    badge: 'Digital Bank',
    logoText: 'R',
    description: 'Instant transfer via Revtag (@username), phone, or IBAN',
    accountLabel: 'Revolut Revtag (@username) or IBAN',
    placeholder: '@alex.revolut or GB29 REVO 0099 1234 5678',
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    shortName: 'Payoneer',
    category: 'international_bank',
    badge: 'Global Payout',
    logoText: 'P',
    description: 'Payoneer Account ID, registered email or Global Payment Service',
    accountLabel: 'Payoneer Registered Email / Account ID',
    placeholder: 'beneficiary@payoneer-client.com or ID: 8849201',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    shortName: 'PayPal',
    category: 'wallet',
    badge: 'Instant Transfer',
    logoText: 'PP',
    description: 'Direct PayPal.Me link, PayPal balance, or registered email',
    accountLabel: 'PayPal Email / PayPal.Me Handle',
    placeholder: 'paypal.me/recipient or recipient@domain.com',
  },
  {
    id: 'wise',
    name: 'Wise (TransferWise)',
    shortName: 'Wise',
    category: 'international_bank',
    badge: 'Multi-Currency',
    logoText: 'W',
    description: 'Zero-markup borderless payout via Wise multi-currency routing',
    accountLabel: 'Wise Tag / Email / Local Account Number',
    placeholder: 'user@wise.com or routing number',
  },
  {
    id: 'bank_wire',
    name: 'Direct Bank Wire (SWIFT / SEPA)',
    shortName: 'SWIFT Wire',
    category: 'wire',
    badge: 'Commercial Bank',
    logoText: '🌐',
    description: 'Direct international clearing via SWIFT/BIC & national IBAN',
    accountLabel: 'Account Number / 24-Digit IBAN',
    placeholder: 'US03 9928 0019 2819 0029 or DE89...',
  },
];

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  defaultRecipientName,
  defaultCurrency,
}) => {
  const {
    wallets,
    sendMoney,
    formatMoney,
    getExchangeRate,
    userProfile,
    hasAppliedForCard,
  } = useBanking();

  const [step, setStep] = useState<'form' | 'confirm' | 'processing' | 'success'>('form');
  const [isApplyCardOpen, setIsApplyCardOpen] = useState(false);

  // Country Selection (Default to Pakistan, all global countries available)
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('PK');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [countrySearch, setCountrySearch] = useState('');

  // Payment Provider / Wallet Selection (Default to Easypaisa)
  const [selectedProviderId, setSelectedProviderId] = useState<string>('easypaisa');
  const [providerCategory, setProviderCategory] = useState<'all' | 'pakistan_wallet' | 'pakistan_bank' | 'international'>('all');
  const [providerSearch, setProviderSearch] = useState<string>('');

  // Form Fields
  const [recipientName, setRecipientName] = useState(defaultRecipientName || '');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState<number>(100);
  const [currencyMode, setCurrencyMode] = useState<string>('USD');
  const [note, setNote] = useState('Invoice / International Transfer');
  const [purpose, setPurpose] = useState('Services / Commercial');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Security PIN and processing states
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [processingSecondsLeft, setProcessingSecondsLeft] = useState(4);

  const usdWallet = wallets.find((w) => w.currencyCode === 'USD') || wallets[0];

  // Resolve selected country object
  const activeAvailableCountry = AVAILABLE_COUNTRIES.find((c) => c.code === selectedCountryCode);
  const isSelectedCountryRestricted = false;

  const currentCountryObj = activeAvailableCountry || AVAILABLE_COUNTRIES[0];
  const activeProvider = INTERNATIONAL_PAYMENT_PROVIDERS.find((p) => p.id === selectedProviderId) || INTERNATIONAL_PAYMENT_PROVIDERS[0];

  // 5-Second Processing Effect before displaying payment pending screen
  useEffect(() => {
    if (step !== 'processing') return;

    const TOTAL_MS = 4500;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / TOTAL_MS) * 100));
      setProgressPercent(progress);

      const secLeft = Math.max(0, Math.ceil((TOTAL_MS - elapsed) / 1000));
      setProcessingSecondsLeft(secLeft);

      if (elapsed >= TOTAL_MS) {
        clearInterval(interval);
        // Execute transfer in banking context
        const result = sendMoney({
          recipientName,
          recipientAccount,
          recipientCountry: currentCountryObj.name,
          recipientCurrency: currentCountryObj.currency,
          amount: Number(amount.toFixed(2)),
          sourceCurrency: 'USD',
          note: `${activeProvider.name} - ${purpose} (${note})`,
          transferType: 'international',
          fee: 0.0,
          provider: activeProvider.name,
        });

        if (result.success && result.transaction) {
          setCompletedTx(result.transaction);
          setStep('success');
        } else {
          setErrorMessage(result.error || 'Transfer could not be processed. Please check your balance.');
          setStep('form');
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    step,
    recipientName,
    recipientAccount,
    currentCountryObj,
    amount,
    activeProvider,
    purpose,
    note,
    sendMoney,
  ]);

  if (!isOpen) return null;

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient / beneficiary account title.');
      return;
    }
    if (!recipientAccount.trim()) {
      setErrorMessage(`Please enter recipient account info for ${activeProvider.name}.`);
      return;
    }
    if (amount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }
    if (!usdWallet || usdWallet.balance < amount) {
      setErrorMessage(
        `Insufficient balance. You have ${formatMoney(usdWallet?.balance || 0, 'USD')} available.`
      );
      return;
    }

    setStep('confirm');
  };

  const handleExecuteTransfer = () => {
    if (!securityPin || securityPin.trim().length < 4) {
      setPinError('Security PIN is required to authorize payment (Default PIN: 78800).');
      return;
    }

    setPinError(null);
    setProgressPercent(0);
    setProcessingSecondsLeft(4);
    setStep('processing');
  };

  const handleCopyRef = () => {
    if (completedTx?.referenceId) {
      navigator.clipboard.writeText(completedTx.referenceId);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleCopyFullReceipt = () => {
    if (!completedTx) return;
    const text = [
      '------------------------------------------------',
      '        NEXORA INTERNATIONAL TRANSACTION RECORD ',
      '------------------------------------------------',
      `Reference ID:    ${completedTx.referenceId}`,
      `Status:          PENDING (Your payment will be sent shortly)`,
      `Date & Time:     ${new Date(completedTx.timestamp).toLocaleString()}`,
      `Sender:          ${userProfile.fullName} (${userProfile.email})`,
      `Beneficiary:     ${recipientName}`,
      `Account / ID:    ${recipientAccount}`,
      `Provider:        ${activeProvider.name}`,
      `Destination:     ${currentCountryObj.name} (${currentCountryObj.currency})`,
      `Amount Sent:     $${completedTx.amount.toFixed(2)} USD`,
      `Transfer Fee:    $0.00 USD (Zero Fee)`,
      `Remaining Bal:   ${formatMoney(usdWallet.balance, 'USD')}`,
      '------------------------------------------------',
      'Your payment will be sent to you shortly.',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const handleCloseAndReset = () => {
    setStep('form');
    setErrorMessage(null);
    setSecurityPin('');
    onClose();
  };

  // Filtered countries for the modal across all regions
  const filteredAvailable = AVAILABLE_COUNTRIES.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.currency.toLowerCase().includes(countrySearch.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Filtered payment providers (Pakistani Wallets, Pakistani Banks, International)
  const filteredProviders = INTERNATIONAL_PAYMENT_PROVIDERS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
      p.accountLabel.toLowerCase().includes(providerSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(providerSearch.toLowerCase()) ||
      p.badge.toLowerCase().includes(providerSearch.toLowerCase());
    if (!matchesSearch) return false;
    if (providerCategory === 'all') return true;
    if (providerCategory === 'pakistan_wallet') return p.category === 'pakistan_wallet';
    if (providerCategory === 'pakistan_bank') return p.category === 'pakistan_bank';
    if (providerCategory === 'international') {
      return p.category === 'international_bank' || p.category === 'wallet' || p.category === 'wire';
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh] text-zinc-900"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-sm">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-black tracking-tight flex items-center gap-2">
                Send Money Worldwide
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase">
                  All Countries Enabled
                </span>
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Global payout via Pakistani Banks, Revolut, Payoneer, PayPal & International Banks
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseAndReset}
            className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: FORM */}
          {step === 'form' && (
            <form onSubmit={handleProceedToConfirm} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
                  <Ban className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* 1. Payment Method: Pakistani Wallets, Pakistani Banks & Global Rails */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                    <span>1. Payment Method & Wallet / Bank</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      Easypaisa • JazzCash • Banks
                    </span>
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {filteredProviders.length} Available
                  </span>
                </div>

                {/* Category Filter Chips for Payment Methods */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2 text-xs">
                  {[
                    { id: 'all', label: 'All Methods' },
                    { id: 'pakistan_wallet', label: '🇵🇰 Pakistani Wallets (Easypaisa, JazzCash...)' },
                    { id: 'pakistan_bank', label: '🇵🇰 Pakistani Banks (1Link / Raast)' },
                    { id: 'international', label: '🌐 International Rails' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setProviderCategory(cat.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                        providerCategory === cat.id
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Provider Search */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search method (e.g. Easypaisa, JazzCash, SadaPay, Meezan, HBL)..."
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                  />
                  {providerSearch && (
                    <button
                      type="button"
                      onClick={() => setProviderSearch('')}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-zinc-200 rounded-2xl bg-zinc-50/60">
                  {filteredProviders.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 py-6 text-center text-xs text-zinc-400">
                      No payment method matches "{providerSearch}".
                    </div>
                  ) : (
                    filteredProviders.map((p) => {
                      const isSelected = selectedProviderId === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedProviderId(p.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-black text-white border-black shadow-md ring-2 ring-black/10'
                              : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-7 h-7 rounded-xl text-[10px] font-black flex items-center justify-center font-mono ${
                                  isSelected
                                    ? 'bg-white text-black'
                                    : p.category === 'pakistan_wallet'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                    : 'bg-zinc-100 text-zinc-900 border border-zinc-200'
                                }`}
                              >
                                {p.logoText}
                              </span>
                              <div>
                                <span className="text-xs font-bold flex items-center gap-1">
                                  {p.name}
                                  {p.flag && <span className="text-sm">{p.flag}</span>}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-zinc-800 text-white border border-zinc-700'
                                  : p.category === 'pakistan_wallet'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                              }`}
                            >
                              {p.badge}
                            </span>
                          </div>
                          <p
                            className={`text-[10px] leading-tight line-clamp-1 ${
                              isSelected ? 'text-zinc-300' : 'text-zinc-500'
                            }`}
                          >
                            {p.description}
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 2. Destination Country & Worldwide Payment Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
                    <span>2. Destination Country</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white font-bold">
                      All Countries Available
                    </span>
                  </label>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {AVAILABLE_COUNTRIES.length} Global Corridors
                  </span>
                </div>

                {/* Region Filter Buttons */}
                <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-2 text-xs">
                  {['All', 'Asia', 'Middle East', 'Americas', 'Europe', 'Oceania', 'Africa'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRegion(r)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                        selectedRegion === r
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {r === 'Asia' ? 'Asia (incl. Pakistan 🇵🇰)' : r}
                    </button>
                  ))}
                </div>

                {/* Country Search Bar */}
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search any country (e.g. Pakistan, United States, United Kingdom, UAE)..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black"
                  />
                  {countrySearch && (
                    <button
                      type="button"
                      onClick={() => setCountrySearch('')}
                      className="absolute right-2.5 top-2 text-zinc-400 hover:text-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Country Pills Grid (All Countries Available) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto p-1.5 border border-zinc-200 rounded-2xl bg-zinc-50/70">
                  {filteredAvailable.length === 0 ? (
                    <div className="col-span-2 sm:col-span-3 py-6 text-center text-xs text-zinc-400">
                      No country matches "{countrySearch}". Try searching another name or currency.
                    </div>
                  ) : (
                    filteredAvailable.map((c) => {
                      const isSelected = selectedCountryCode === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setSelectedCountryCode(c.code)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                            isSelected
                              ? 'bg-black text-white border-black font-bold shadow-md ring-2 ring-black/20'
                              : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-400 hover:bg-zinc-50'
                          }`}
                        >
                          <span className="text-2xl">{c.flag}</span>
                          <span className="text-xs truncate max-w-full font-semibold">{c.name}</span>
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] font-mono font-bold ${
                                isSelected ? 'text-zinc-200' : 'text-zinc-500'
                              }`}
                            >
                              {c.currency}
                            </span>
                            <span
                              className={`text-[8px] px-1 py-0.2 rounded font-mono ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              Active
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Selected Country Info Banner */}
                <div className="mt-2.5 p-3 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{currentCountryObj.flag}</span>
                    <div>
                      <div className="font-bold text-black text-[11px] flex items-center gap-1.5">
                        <span>Selected Country: {currentCountryObj.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-black text-white font-mono font-bold">
                          {currentCountryObj.currency}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        {currentCountryObj.region} • Global Settlement Corridor Available
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                    Payment Available
                  </span>
                </div>
              </div>

              {/* 3. Beneficiary & Account Information */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-black uppercase tracking-wider">
                  3. Recipient Information ({activeProvider.name})
                </label>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Beneficiary Account Title / Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      disabled={isSelectedCountryRestricted}
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Johnathan Miller, Maria Santos"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    {activeProvider.accountLabel}
                  </label>
                  <div className="relative">
                    {activeProvider.category === 'wire' ? (
                      <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    )}
                    <input
                      type="text"
                      required
                      disabled={isSelectedCountryRestricted}
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder={activeProvider.placeholder}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm font-mono text-black placeholder-zinc-400 focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Transfer Amount & Available Balance */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">
                    4. Transfer Amount (USD)
                  </span>
                  <div className="text-[11px] text-zinc-500 font-medium">
                    Available Balance:{' '}
                    <span className="font-bold text-black font-mono">
                      {formatMoney(usdWallet.balance, 'USD')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-2.5 text-zinc-400 font-mono font-bold text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      disabled={isSelectedCountryRestricted}
                      value={amount || ''}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-lg font-black font-mono text-black focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex gap-1.5">
                    {[50, 100, 250, 500].map((v) => (
                      <button
                        key={v}
                        type="button"
                        disabled={isSelectedCountryRestricted}
                        onClick={() => setAmount(v)}
                        className="px-2.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-mono font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        ${v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purpose & Reference Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Purpose of Payment
                  </label>
                  <select
                    value={purpose}
                    disabled={isSelectedCountryRestricted}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed"
                  >
                    <option value="Services / Commercial">Services / Commercial</option>
                    <option value="Family Support">Family Support</option>
                    <option value="Software / IT Services">Software / IT Services</option>
                    <option value="Consulting / Freelance">Consulting / Freelance</option>
                    <option value="Education / Tuition">Education / Tuition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 mb-1">
                    Reference / Memo (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isSelectedCountryRestricted}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Monthly project payout"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black focus:outline-none focus:border-black disabled:bg-zinc-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Summary Pill */}
              <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>
                    Transfer Fee: <strong className="text-black font-mono font-bold">$0.00 Free</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-black" />
                  <span>Instant Settlement</span>
                </div>
              </div>

              {/* Continue Button */}
              {isSelectedCountryRestricted ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 rounded-2xl bg-zinc-200 text-zinc-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Payments to {currentCountryObj.name} are Unavailable</span>
                  </button>
                  <p className="text-[11px] text-center text-zinc-500 font-medium">
                    Please switch to an approved destination (e.g. United States, United Kingdom, Eurozone) to proceed.
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  id="send-proceed-confirm-btn"
                  className="w-full py-3.5 rounded-2xl bg-black hover:bg-zinc-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review & Authorize Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>
          )}

          {/* STEP 2: CONFIRM */}
          {step === 'confirm' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Confirm International Transfer
                </div>
                <div className="text-3xl font-black font-mono text-black">
                  ${amount.toFixed(2)} USD
                </div>
                <div className="text-xs font-semibold text-zinc-600">
                  Via {activeProvider.name} • {currentCountryObj.flag} {currentCountryObj.name}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 divide-y divide-zinc-200 text-xs space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-zinc-500">Sender Account:</span>
                  <span className="font-bold text-black">{userProfile.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Beneficiary Title:</span>
                  <span className="font-bold text-black">{recipientName}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Provider & Network:</span>
                  <span className="font-bold text-black flex items-center gap-1.5">
                    {activeProvider.name} ({activeProvider.badge})
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Account / Handle:</span>
                  <span className="font-mono font-bold text-zinc-900">{recipientAccount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Destination:</span>
                  <span className="font-bold text-zinc-900">
                    {currentCountryObj.flag} {currentCountryObj.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-500">Purpose:</span>
                  <span className="text-zinc-800">{purpose}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-500">Transfer Fee:</span>
                  <span className="font-bold text-black font-mono">$0.00 (Zero Fee)</span>
                </div>
              </div>

              {/* Security PIN Authorization Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black block">
                        Enter Transaction Security PIN
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Enter your 5-digit PIN to release funds
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSecurityPin('78800');
                      setPinError(null);
                    }}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-black border border-zinc-200 transition-colors cursor-pointer font-bold"
                  >
                    Default PIN: 78800
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={securityPin}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setSecurityPin(clean);
                      if (pinError) setPinError(null);
                    }}
                    placeholder="•••••"
                    id="send-transaction-pin-input"
                    className="w-full bg-white border border-zinc-300 focus:border-black rounded-xl py-3 px-4 text-center tracking-[0.6em] text-xl font-mono text-black placeholder-zinc-400 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Masked Dot Indicators */}
                <div className="flex justify-center items-center gap-3 pt-0.5">
                  {[0, 1, 2, 3, 4].map((idx) => {
                    const isFilled = idx < securityPin.length;
                    return (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          isFilled
                            ? 'bg-black ring-4 ring-zinc-200 scale-110 shadow-xs'
                            : 'bg-zinc-200 border border-zinc-300'
                        }`}
                      />
                    );
                  })}
                </div>

                {pinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{pinError}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs border border-zinc-200 transition-colors cursor-pointer"
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  id="confirm-execute-transfer-btn"
                  className="flex-1 py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authorize & Send ${amount.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING STATE */}
          {step === 'processing' && (
            <div className="py-8 px-2 sm:px-4 text-center space-y-6" id="transfer-processing-screen">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-zinc-300 border-t-black animate-spin"></div>
                <div className="relative w-14 h-14 rounded-full bg-black flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Settling Cross-Border Payout • {processingSecondsLeft}s</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                  Sending ${amount.toFixed(2)} USD
                </h3>
                <p className="text-xs text-zinc-500">
                  To <strong className="text-black">{recipientName}</strong> via{' '}
                  <strong className="text-black">{activeProvider.name}</strong>
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 max-w-md mx-auto">
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
                  <div
                    className="bg-black h-full rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Authorizing</span>
                  <span className="font-bold text-black">{progressPercent}%</span>
                  <span>Generating Voucher</span>
                </div>
              </div>

              {/* Verification Steps */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  <span className="text-zinc-800 font-medium">Compliance & Sanctions Verified</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {progressPercent >= 50 ? (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  ) : (
                    <Loader2 className="w-4 h-4 text-zinc-400 animate-spin shrink-0" />
                  )}
                  <span className={progressPercent >= 50 ? 'text-zinc-800 font-medium' : 'text-zinc-500'}>
                    Connecting to {activeProvider.name} Switch
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {progressPercent >= 90 ? (
                    <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-zinc-300 shrink-0"></div>
                  )}
                  <span className={progressPercent >= 90 ? 'text-zinc-800 font-bold' : 'text-zinc-400'}>
                    Generating Cryptographic Receipt...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESSFULLY SENT VIEW & ATM MASTERCARD BANNER */}
          {step === 'success' && completedTx && (
            <div className="space-y-5 py-2 text-center" id="transfer-success-card">
              {/* Glowing Green Success Badge */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 border-t-emerald-500 animate-spin"></div>
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-md">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Payment Successfully Sent</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Payment Successfully Sent!
                </h2>

                <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 max-w-lg mx-auto shadow-sm">
                  <div className="text-sm sm:text-base font-extrabold flex items-center justify-center gap-2">
                    <span>✅</span>
                    <span>Your transfer of ${completedTx.amount.toFixed(2)} USD to {recipientName} has been processed and sent successfully.</span>
                  </div>
                </div>
              </div>

              {/* Itemized Transaction Details */}
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-2.5 max-w-lg mx-auto font-mono text-zinc-900">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Transaction Reference:</span>
                  <button
                    type="button"
                    onClick={handleCopyRef}
                    className="flex items-center gap-1 font-bold text-black hover:underline cursor-pointer bg-white px-2 py-0.5 rounded border border-zinc-200 text-xs"
                  >
                    {completedTx.referenceId}
                    {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Transaction Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px] flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Payment Sent • Success</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Amount Deducted:</span>
                  <span className="font-extrabold text-black text-sm">
                    ${completedTx.amount.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Beneficiary Name:</span>
                  <span className="font-bold text-black font-sans">{recipientName}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Destination Country:</span>
                  <span className="font-bold text-black font-sans flex items-center gap-1.5">
                    <span>{currentCountryObj.flag}</span>
                    <span>{currentCountryObj.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">({currentCountryObj.currency})</span>
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Payment Network / Rail:</span>
                  <span className="font-bold text-black font-sans">{activeProvider.name}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Account / ID:</span>
                  <span className="font-bold text-black">{recipientAccount}</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500 font-sans">Transfer Fee:</span>
                  <span className="font-bold text-emerald-700 font-sans">$0.00 USD (Zero Fee)</span>
                </div>

                <div className="flex justify-between items-center pt-1 bg-white px-3 py-2 rounded-xl border border-zinc-200">
                  <span className="text-zinc-600 font-sans font-medium">Remaining Total Balance:</span>
                  <span className="font-black text-black text-sm">
                    {formatMoney(usdWallet.balance, 'USD')}
                  </span>
                </div>
              </div>

              {/* REQUESTED: ATM MASTERCARD BANNER CARD (Get your Mastercard within 1 to 2 days) */}
              {/* CONDITION: DON'T SHOW BANNER WHEN USER SUBMITTED THE APPLICATION OF CARD */}
              {!hasAppliedForCard && (
                <div
                  onClick={() => setIsApplyCardOpen(true)}
                  className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white border-2 border-amber-500/70 shadow-xl cursor-pointer hover:border-amber-400 transition-all group relative overflow-hidden text-left max-w-lg mx-auto"
                >
                  {/* Background ambient glow */}
                  <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-3.5">
                      {/* Mini realistic card graphic */}
                      <div className="w-14 h-9 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 border border-amber-500/40 p-1.5 flex flex-col justify-between shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <div className="flex justify-between items-center">
                          <span className="text-[6px] font-mono font-bold text-amber-400">ATM MC</span>
                          <div className="flex">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-90"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-90 -ml-1"></div>
                          </div>
                        </div>
                        <div className="text-[6px] font-mono text-zinc-400">•••• 9721</div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
                            Get your Mastercard within 1 to 2 days
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold font-mono uppercase">
                            1-2 Days
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                          Free express delivery to your address. Worldwide ATM cash withdrawals, zero foreign transaction markups, and contactless chip.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsApplyCardOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shrink-0 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Apply for Card</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="max-w-lg mx-auto space-y-2.5">
                <button
                  type="button"
                  onClick={handleCopyFullReceipt}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold text-xs border border-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedReceipt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Transaction Record Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-black" />
                      <span>Copy Transaction Details</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  id="done-pending-btn"
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Done & Return to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* APPLICATION MODAL POPUP */}
          <ApplyCardModal
            isOpen={isApplyCardOpen}
            onClose={() => setIsApplyCardOpen(false)}
          />
        </div>
      </motion.div>
    </div>
  );
};
