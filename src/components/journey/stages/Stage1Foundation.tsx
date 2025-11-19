import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results } from '@/utils/calculator';
import { CurrencyInput } from '@/components/CurrencyInput';
import { formatCurrencyDecimal } from '@/utils/calculator';
import { AssumptionsAccordion } from '@/components/AssumptionsAccordion';
import { countryDefaults } from '@/utils/countryDefaults';

interface Stage1FoundationProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  onComplete: () => void;
  onEdit: () => void;
}

export const Stage1Foundation: React.FC<Stage1FoundationProps> = ({
  isActive,
  status,
  inputs,
  results,
  updateInput,
  onComplete,
  onEdit,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('US');

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const defaults = countryDefaults[countryCode] || countryDefaults['OTHER'];
    updateInput('overheadPct')(defaults.overheadPct);
    updateInput('hoursPerDay')(defaults.hoursPerDay);
    updateInput('vacationDays')(defaults.vacationDays);
    updateInput('publicHolidays')(defaults.publicHolidays);
    updateInput('otherLeaveDays')(defaults.otherLeaveDays);
    updateInput('trainingDays')(defaults.trainingDays);
  };

  const hasFullTimeInputs = (inputs.baseSalary || 0) > 0;
  const canProceed = hasFullTimeInputs;

  return (
    <JourneyStage
      stageNumber={1}
      title="Establishing Your Rate"
      subtitle="Enter your full-time compensation as an anchor to calculate your equivalent hourly rate"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6 mt-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <CurrencyInput
              label="Base Salary"
              value={inputs.baseSalary || 0}
              onChange={updateInput('baseSalary')}
              placeholder="150000"
            />
            <CurrencyInput
              label="Annual Bonus"
              value={inputs.annualBonus || 0}
              onChange={updateInput('annualBonus')}
              placeholder="30000"
            />
            <CurrencyInput
              label="Annual Equity (FMV)"
              value={inputs.annualEquityFmv || 0}
              onChange={updateInput('annualEquityFmv')}
              placeholder="20000"
              helperText="Fair Market Value of equity grants vesting this year"
            />
          </div>

          {hasFullTimeInputs && (
            <>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                {/* Your Effective Rate */}
                <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Your Effective Rate
                  </p>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatCurrencyDecimal(results.directHourly)}
                    <span className="text-lg font-normal text-muted-foreground">/hr</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You make an equivalent of {formatCurrencyDecimal(results.directHourly)}/hour in direct compensation.
                  </p>
                </div>

                {/* Fully-Loaded Rate */}
                <div className="p-6 bg-purple-500/10 rounded-xl border-2 border-purple-500/20">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Fully-Loaded Rate
                  </p>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {formatCurrencyDecimal(results.fullyLoadedHourly)}
                    <span className="text-lg font-normal text-muted-foreground">/hr</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You make {formatCurrencyDecimal(results.fullyLoadedHourly)}/hour in direct compensation plus benefits and other overhead paid by your employer. This is the true cost of employing you.
                  </p>
                </div>
              </div>

              <div className="mt-6 animate-fade-in">
                <AssumptionsAccordion
                  inputs={inputs}
                  updateInput={updateInput}
                  selectedCountry={selectedCountry}
                  onCountryChange={handleCountryChange}
                />
              </div>
            </>
          )}
        </div>

        {canProceed && (
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full md:w-auto animate-fade-in"
          >
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </JourneyStage>
  );
};
