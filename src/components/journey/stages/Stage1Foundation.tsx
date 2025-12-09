import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results } from '@/utils/calculator';
import { CurrencyInput } from '@/components/CurrencyInput';
import { formatCurrencyDecimal } from '@/utils/calculator';
import { AssumptionsAccordion } from '@/components/AssumptionsAccordion';
import { countryDefaults, countryOptions } from '@/utils/countryDefaults';

interface Stage1FoundationProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  onComplete: () => void;
  onEdit: () => void;
  assumptionsRef: React.RefObject<HTMLDivElement>;
}

export const Stage1Foundation: React.FC<Stage1FoundationProps> = ({
  isActive,
  status,
  inputs,
  results,
  updateInput,
  onComplete,
  onEdit,
  assumptionsRef,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('GLOBAL');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      setIsDetectingLocation(true);
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        
        // Check if detected country is in our list
        const countryExists = countryOptions.some(opt => opt.value === countryCode);
        if (countryExists) {
          handleCountryChange(countryCode);
        } else {
          // Keep GLOBAL as default if country not found
          setSelectedCountry('GLOBAL');
        }
      } catch (error) {
        // Silently fail and keep GLOBAL as default
        console.log('Location detection not available, using Global defaults');
      } finally {
        setIsDetectingLocation(false);
      }
    };

    detectLocation();
  }, []);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const defaults = countryDefaults[countryCode] || countryDefaults['GLOBAL'];
    updateInput('overheadPct')(defaults.overheadPct);
    updateInput('hoursPerDay')(defaults.hoursPerDay);
    updateInput('vacationDays')(defaults.vacationDays);
    updateInput('publicHolidays')(defaults.publicHolidays);
    updateInput('otherLeaveDays')(defaults.otherLeaveDays);
    updateInput('trainingDays')(defaults.trainingDays);
  };

  const getCurrentCountryLabel = () => {
    return countryOptions.find(opt => opt.value === selectedCountry)?.label || 'Global';
  };

  const hasFullTimeInputs = (inputs.baseSalary || 0) > 0;
  const canProceed = hasFullTimeInputs;

  return (
    <JourneyStage
      stageNumber={1}
      title="Benchmarking Your Rate"
      subtitle="Enter your full-time compensation as an anchor to calculate your equivalent hourly rate"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6 mt-6">
        {/* Input Fields Section */}
        <div className="space-y-4">
          <div className="grid gap-4">
            <CurrencyInput
              label="Base Salary"
              value={inputs.baseSalary || 0}
              onChange={updateInput('baseSalary')}
              placeholder="enter your base salary"
            />
            <CurrencyInput
              label="Annual Bonus"
              value={inputs.annualBonus || 0}
              onChange={updateInput('annualBonus')}
              placeholder="enter your annual bonus"
            />
            <CurrencyInput
              label="Annual Equity (FMV)"
              value={inputs.annualEquityFmv || 0}
              onChange={updateInput('annualEquityFmv')}
              placeholder="enter your annual equity"
              helperText="Fair Market Value of equity grants vesting this year"
            />
          </div>

          {/* Assumptions Section - Now above rate cards */}
          {hasFullTimeInputs && (
            <div className="animate-fade-in">
              <div ref={assumptionsRef} data-segment="assumptions" />
              <AssumptionsAccordion
                inputs={inputs}
                updateInput={updateInput}
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
                currentCountryLabel={getCurrentCountryLabel()}
                isDetectingLocation={isDetectingLocation}
              />
            </div>
          )}

          {hasFullTimeInputs && (
            <>
              {/* Sticky Rate Cards Container */}
              <div className="sticky top-16 md:top-20 z-10 pb-4 mb-6 transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  {/* Your Effective Rate */}
                  <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Your Take-home Rate
                    </p>
                    <div className="text-4xl font-bold text-primary mb-2">
                      {formatCurrencyDecimal(results.directHourly)}
                      <span className="text-lg font-normal text-muted-foreground">/hr</span>
                    </div>
                    <div className="text-lg font-semibold text-primary/80 mb-3">
                      {formatCurrencyDecimal(results.totalAnnualComp)}
                      <span className="text-sm font-normal text-muted-foreground">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      As a full-time employee, you make an equivalent of {formatCurrencyDecimal(results.directHourly)}/hour in direct compensation.
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
                    <div className="text-lg font-semibold text-purple-600/80 dark:text-purple-400/80 mb-3">
                      {formatCurrencyDecimal(results.annualCostIncludingOH)}
                      <span className="text-sm font-normal text-muted-foreground">/year</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      As a full-time employee, you make {formatCurrencyDecimal(results.fullyLoadedHourly)}/hour in direct compensation and indirect compensation plus benefits and other overhead paid by your employer. This is the true cost of employing you.
                    </p>
                  </div>
                </div>
                
                {/* Calculation Footnote */}
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  These rate calculations are affected by the assumptions above.
                </p>
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
