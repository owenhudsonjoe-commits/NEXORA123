export interface RestrictedCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  reason: string;
  isExplicitlyRequested?: boolean;
}

export interface AvailableCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  region: string;
}

// All restricted countries list is cleared - all countries are available
export const RESTRICTED_COUNTRIES: RestrictedCountry[] = [];

// Available countries worldwide, with Pakistan and all global destinations supported
export const AVAILABLE_COUNTRIES: AvailableCountry[] = [
  // SOUTH ASIA / ASIA
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', region: 'Asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', currency: 'CNY', region: 'Asia' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', region: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', currency: 'KRW', region: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', currency: 'SGD', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'MYR', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', currency: 'IDR', region: 'Asia' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', currency: 'THB', region: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', currency: 'VND', region: 'Asia' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', currency: 'LKR', region: 'Asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', currency: 'NPR', region: 'Asia' },

  // MIDDLE EAST
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', region: 'Middle East' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', region: 'Middle East' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', currency: 'QAR', region: 'Middle East' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', currency: 'KWD', region: 'Middle East' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', region: 'Middle East' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', currency: 'OMR', region: 'Middle East' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', currency: 'TRY', region: 'Middle East' },

  // NORTH & SOUTH AMERICAS
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', region: 'Americas' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', region: 'Americas' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', region: 'Europe' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', region: 'Americas' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', currency: 'BRL', region: 'Americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', region: 'Americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', region: 'Americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', region: 'Americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', currency: 'PEN', region: 'Americas' },

  // EUROPE
  { code: 'DE', name: 'Germany', flag: '🇩🇪', currency: 'EUR', region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', currency: 'EUR', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', currency: 'EUR', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', currency: 'EUR', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', currency: 'EUR', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', currency: 'CHF', region: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', currency: 'SEK', region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', currency: 'NOK', region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', currency: 'DKK', region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', currency: 'PLN', region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', currency: 'EUR', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', currency: 'EUR', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', currency: 'EUR', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: 'EUR', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', currency: 'CZK', region: 'Europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', currency: 'HUF', region: 'Europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', currency: 'RON', region: 'Europe' },

  // OCEANIA
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', currency: 'NZD', region: 'Oceania' },

  // AFRICA
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', region: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', currency: 'EGP', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', region: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', currency: 'MAD', region: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', region: 'Africa' },
];

/**
 * Checks if a country is in the restricted list.
 * All countries and Pakistan are available for payments worldwide.
 */
export function isCountryRestricted(_query: string | undefined | null): boolean {
  // All countries are available and supported worldwide
  return false;
}

/**
 * Returns country details
 */
export function getRestrictedCountry(_query: string | undefined | null): RestrictedCountry | undefined {
  return undefined;
}
