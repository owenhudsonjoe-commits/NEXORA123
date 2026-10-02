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

// Exactly 1 country: Pakistan
export const RESTRICTED_COUNTRIES: RestrictedCountry[] = [
  {
    code: 'PK',
    name: 'Pakistan',
    flag: '🇵🇰',
    currency: 'PKR',
    reason: 'Corridor monitored under cross-border banking regulations and SBP / FATF compliance directives.',
    isExplicitlyRequested: true,
  },
];

// Exactly 1 country: Pakistan
export const AVAILABLE_COUNTRIES: AvailableCountry[] = [
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', region: 'South Asia' },
];

/**
 * Checks if a country is in the restricted/unsupported list.
 * The 1 configured corridor (Pakistan) is fully supported and enabled.
 */
export function isCountryRestricted(query: string | undefined | null): boolean {
  if (!query) return false;
  const normalized = query.trim().toLowerCase();

  // Common spelling variants
  const aliasMap: Record<string, string> = {
    pak: 'pakistan',
  };

  const lookup = aliasMap[normalized] || normalized;

  // The 1 country (Pakistan) is the fully supported corridor
  const isOneCountry = AVAILABLE_COUNTRIES.some(
    (c) =>
      c.code.toLowerCase() === lookup ||
      c.name.toLowerCase() === lookup ||
      lookup.includes(c.name.toLowerCase()) ||
      c.name.toLowerCase().includes(lookup)
  );

  return !isOneCountry;
}

/**
 * Returns the country details from the 1 configured corridor
 */
export function getRestrictedCountry(query: string | undefined | null): RestrictedCountry | undefined {
  if (!query) return undefined;
  const normalized = query.trim().toLowerCase();

  const aliasMap: Record<string, string> = {
    pak: 'pakistan',
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
