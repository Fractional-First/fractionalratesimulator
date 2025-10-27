
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
  
  // Time allocation breakdown (all in percentage 0-100, should sum to 100)
  projectWorkPct?: number;       // Billable time percentage
  bdPct?: number;                // Business development percentage
  invoicingPct?: number;         // Invoicing/finances percentage
  adminPct?: number;             // Admin/networking percentage
  
  nonBillablePct?: number;       // F20/G20 (0.30) - calculated from above
  riskTolerancePct?: number;     // F23/G23 (0.50)
};

export type Results = {
  totalAnnualCompInput: number;
  workingDaysPerYear: number;
  totalAnnualComp: number;
  annualCostIncludingOH: number;
  monthlyComp: number;
  monthlyCostIncludingOH: number;
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
    projectWorkPct: state.projectWorkPct ?? 60,
    bdPct: state.bdPct ?? 15,
    invoicingPct: state.invoicingPct ?? 10,
    adminPct: state.adminPct ?? 15,
    riskTolerancePct: state.riskTolerancePct ?? 0.50,
    fractionalHourlyInput: state.fractionalHourlyInput ?? 0,
  };

  // Calculate nonBillablePct from time allocation (convert from percentage to decimal)
  const nonBillablePct = (s.bdPct + s.invoicingPct + s.adminPct) / 100;

  const workingDaysPerYear = 52*5 - (s.vacationDays + s.publicHolidays + s.otherLeaveDays + s.trainingDays);

  const totalAnnualCompInput = (s.baseSalary + s.annualBonus + s.annualEquityFmv) || 0;

  const usingFractional = s.fractionalHourlyInput > 0 && totalAnnualCompInput === 0;

  const annualCostIncludingOH = usingFractional
    ? s.fractionalHourlyInput * workingDaysPerYear * s.hoursPerDay
    : (totalAnnualCompInput > 0
        ? s.baseSalary * (1 + s.overheadPct) + s.annualBonus + s.annualEquityFmv
        : 0);

  const totalAnnualComp =
    totalAnnualCompInput > 0
      ? totalAnnualCompInput
      : (annualCostIncludingOH > 0 ? (annualCostIncludingOH / (1 + s.overheadPct)) : 0);

  const annualCostInclOHFinal =
    annualCostIncludingOH > 0 ? annualCostIncludingOH : totalAnnualComp * (1 + s.overheadPct);

  const nominalHourly = annualCostInclOHFinal / (Math.max(1, workingDaysPerYear) * s.hoursPerDay);
  const nominalDaily = nominalHourly * s.hoursPerDay;
  const effectiveHourly = nominalHourly * (1 - nonBillablePct);
  const riskAdjustedHourly = effectiveHourly / s.riskTolerancePct;

  return {
    totalAnnualCompInput,
    workingDaysPerYear,
    totalAnnualComp,
    annualCostIncludingOH: annualCostInclOHFinal,
    monthlyComp: totalAnnualComp / 12,
    monthlyCostIncludingOH: annualCostInclOHFinal / 12,
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
