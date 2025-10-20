export interface CountryDefaults {
  overheadPct: number; // as decimal (e.g., 0.25 = 25%)
  vacationDays: number;
  publicHolidays: number;
}

export const countryDefaults: Record<string, CountryDefaults> = {
  'US': {
    overheadPct: 0.25,
    vacationDays: 15,
    publicHolidays: 10,
  },
  'CA': {
    overheadPct: 0.28,
    vacationDays: 15,
    publicHolidays: 9,
  },
  'MX': {
    overheadPct: 0.22,
    vacationDays: 12,
    publicHolidays: 8,
  },
  'GB': {
    overheadPct: 0.26,
    vacationDays: 28,
    publicHolidays: 8,
  },
  'DE': {
    overheadPct: 0.30,
    vacationDays: 30,
    publicHolidays: 10,
  },
  'FR': {
    overheadPct: 0.32,
    vacationDays: 30,
    publicHolidays: 11,
  },
  'NL': {
    overheadPct: 0.28,
    vacationDays: 25,
    publicHolidays: 8,
  },
  'ES': {
    overheadPct: 0.27,
    vacationDays: 30,
    publicHolidays: 14,
  },
  'SE': {
    overheadPct: 0.35,
    vacationDays: 25,
    publicHolidays: 13,
  },
  'CH': {
    overheadPct: 0.24,
    vacationDays: 25,
    publicHolidays: 9,
  },
  'SG': {
    overheadPct: 0.20,
    vacationDays: 14,
    publicHolidays: 11,
  },
  'JP': {
    overheadPct: 0.26,
    vacationDays: 10,
    publicHolidays: 16,
  },
  'AU': {
    overheadPct: 0.25,
    vacationDays: 20,
    publicHolidays: 11,
  },
  'IN': {
    overheadPct: 0.18,
    vacationDays: 12,
    publicHolidays: 12,
  },
  'PH': {
    overheadPct: 0.16,
    vacationDays: 10,
    publicHolidays: 12,
  },
  'BR': {
    overheadPct: 0.28,
    vacationDays: 30,
    publicHolidays: 12,
  },
  'AR': {
    overheadPct: 0.25,
    vacationDays: 14,
    publicHolidays: 14,
  },
  'CL': {
    overheadPct: 0.23,
    vacationDays: 15,
    publicHolidays: 15,
  },
  'ZA': {
    overheadPct: 0.22,
    vacationDays: 15,
    publicHolidays: 12,
  },
  'KE': {
    overheadPct: 0.18,
    vacationDays: 21,
    publicHolidays: 11,
  },
  'AE': {
    overheadPct: 0.15,
    vacationDays: 30,
    publicHolidays: 13,
  },
  'OTHER': {
    overheadPct: 0.25,
    vacationDays: 21,
    publicHolidays: 15,
  },
};

export const countryOptions = [
  { value: 'AR', label: 'Argentina' },
  { value: 'AU', label: 'Australia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CA', label: 'Canada' },
  { value: 'CL', label: 'Chile' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MX', label: 'Mexico' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'PH', label: 'Philippines' },
  { value: 'SG', label: 'Singapore' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'ES', label: 'Spain' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AE', label: 'UAE' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'OTHER', label: 'Other' },
];
