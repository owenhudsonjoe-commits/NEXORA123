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

// Exactly 2 countries: Pakistan, India
export const RESTRICTED_COUNTRIES: RestrictedCountry[] = [
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    reason: 'Corridor monitored under cross-border banking regulations and SBP / FATF compliance directives.',
    isExplicitlyRequested: true,
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    reason: 'Outward payments subject to Foreign Exchange Management Act (FEMA) & cross-border AML limits.',
    isExplicitlyRequested: true,
  },
];

// Exactly 2 countries: Pakistan, India
export const AVAILABLE_COUNTRIES: AvailableCountry[] = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', region: 'South Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', region: 'South Asia' },
];

/**
 * Checks if a country is in the restricted/unsupported list.
 * The 2 configured corridors (Pakistan, India)
 * are fully supported and enabled.
 */
export function isCountryRestricted(query: string | undefined | null): boolean {
  if (!query) return false;
  const normalized = query.trim().toLowerCase();

  // Common spelling variants
  const aliasMap: Record<string, string> = {
    pak: 'pakistan',
    ind: 'india',
    insia: 'india',
  };

  const lookup = aliasMap[normalized] || normalized;

  // The 2 countries are fully supported corridors
  const isOneOfTwo = AVAILABLE_COUNTRIES.some(
    (c) =>
      c.code.toLowerCase() === lookup ||
      c.name.toLowerCase() === lookup ||
      lookup.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(lookup)
  );

  return !isOneOfTwo;
}

/**
 * Returns the country details from the 2 configured corridors
 */
export function getRestrictedCountry(query: string | undefined | null): RestrictedCountry | undefined {
  if (!query) return undefined;
  const normalized = query.trim().toLowerCase();

  const aliasMap: Record<string, string> = {
    pak: 'pakistan',
    ind: 'india',
    insia: 'india',
  };

  const lookup = aliasMap[normalized] || normalized;

  return RESTRICTED_COUNTRIES.find(
    (c) =>
      c.code.toLowerCase() === lookup ||
      c.name.toLowerCase() === lookup ||
      lookup.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(lookup)
  );
}
