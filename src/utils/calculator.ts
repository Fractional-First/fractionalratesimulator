
export type Inputs = {
  baseSalary?: number;           // B5
  annualBonus?: number;          // B6
  annualEquityFmv?: number;      // B8
  fractionalHourlyInput?: number;// B11 (optional inverse flow)

  overheadPct?: number;          // B28 (0.25)
  hoursPerDay?: number;          // B29 (8)
  vacationDays?: number;         // B30 (21)
  publicHolidays?: number;       // B31 (15)
  otherLeaveDays?: number;       // B32 (10)
  trainingDays?: number;         // B33 (4)
  
  // Time allocation breakdown (decimals 0-1, should sum to 1)
  projectWorkPct?: number;       // Billable time percentage (e.g., 0.6)
  bdPct?: number;                // Business development percentage (e.g., 0.15)
  invoicingPct?: number;         // Invoicing/finances percentage (e.g., 0.10)
  adminPct?: number;             // Admin/networking percentage (e.g., 0.15)
  
  // Deprecated: computed from breakdown above if provided
  nonBillablePct?: number;       // If set, used as fallback (0.30)
  riskTolerancePct?: number;     // F23/G23 (0.50)
};

export type Results = {
  totalAnnualCompInput: number;
  workingDaysPerYear: number;
  totalAnnualComp: number;
  annualCostIncludingOH: number;
  monthlyComp: number;
  monthlyCostIncludingOH: number;
  // Direct rates (personal compensation only, no overhead)
  directHourly: number;
  directDaily: number;
  directEffectiveHourly: number;
  // Fully loaded rates (includes overhead)
  fullyLoadedHourly: number;
  fullyLoadedDaily: number;
  fullyLoadedEffectiveHourly: number;
  // Legacy fields for backward compatibility
  nominalHourly: number;
  nominalDaily: number;
  effectiveHourly: number;
  riskAdjustedHourly: number;
};

export function compute(state: Inputs): Results {
  const s = {
    baseSalary: state.baseSalary ?? 0,
    annualBonus: state.annualBonus ?? 0,
    annualEquityFmv: state.annualEquityFmv ?? 0,
    overheadPct: state.overheadPct ?? 0.25,
    hoursPerDay: state.hoursPerDay ?? 8,
    vacationDays: state.vacationDays ?? 21,
    publicHolidays: state.publicHolidays ?? 15,
    otherLeaveDays: state.otherLeaveDays ?? 10,
    trainingDays: state.trainingDays ?? 4,
    projectWorkPct: state.projectWorkPct ?? 0.6,
    bdPct: state.bdPct ?? 0.15,
    invoicingPct: state.invoicingPct ?? 0.10,
    adminPct: state.adminPct ?? 0.15,
    riskTolerancePct: state.riskTolerancePct ?? 0.50,
    fractionalHourlyInput: state.fractionalHourlyInput ?? 0,
  };

  // Calculate nonBillablePct from time allocation (already decimal 0-1)
  const nonBillablePct = (s.bdPct + s.invoicingPct + s.adminPct);

  const workingDaysPerYear = 52*5 - (s.vacationDays + s.publicHolidays + s.otherLeaveDays + s.trainingDays);

  const totalAnnualCompInput = (s.baseSalary + s.annualBonus + s.annualEquityFmv) || 0;

  const usingFractional = s.fractionalHourlyInput > 0 && totalAnnualCompInput === 0;

  // Total annual compensation (direct, no overhead)
  const totalAnnualComp = usingFractional
    ? s.fractionalHourlyInput * workingDaysPerYear * s.hoursPerDay
    : totalAnnualCompInput;

  // Annual cost including overhead (for organization)
  const annualCostIncludingOH = s.baseSalary * (1 + s.overheadPct) + s.annualBonus + s.annualEquityFmv;

  // DIRECT RATES (personal compensation, no overhead)
  const directHourly = totalAnnualComp / (Math.max(1, workingDaysPerYear) * s.hoursPerDay);
  const directDaily = directHourly * s.hoursPerDay;
  const directEffectiveHourly = directHourly * (1 - nonBillablePct);

  // FULLY LOADED RATES (includes overhead for organization cost)
  const fullyLoadedHourly = annualCostIncludingOH / (Math.max(1, workingDaysPerYear) * s.hoursPerDay);
  const fullyLoadedDaily = fullyLoadedHourly * s.hoursPerDay;
  const fullyLoadedEffectiveHourly = fullyLoadedHourly * (1 - nonBillablePct);

  // Risk-adjusted rate (based on direct effective rate)
  const riskAdjustedHourly = directEffectiveHourly / s.riskTolerancePct;

  // Legacy fields for backward compatibility (use direct rates)
  const nominalHourly = directHourly;
  const nominalDaily = directDaily;
  const effectiveHourly = directEffectiveHourly;

  return {
    totalAnnualCompInput,
    workingDaysPerYear,
    totalAnnualComp,
    annualCostIncludingOH,
    monthlyComp: totalAnnualComp / 12,
    monthlyCostIncludingOH: annualCostIncludingOH / 12,
    directHourly,
    directDaily,
    directEffectiveHourly,
    fullyLoadedHourly,
    fullyLoadedDaily,
    fullyLoadedEffectiveHourly,
    nominalHourly,
    nominalDaily,
    effectiveHourly,
    riskAdjustedHourly,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyDecimal(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
