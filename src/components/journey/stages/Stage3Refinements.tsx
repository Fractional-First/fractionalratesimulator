import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs } from '@/utils/calculator';
import { AssumptionsAccordion } from '@/components/AssumptionsAccordion';
import { RiskToleranceSection } from '@/components/RiskToleranceSection';
import { countryDefaults } from '@/utils/countryDefaults';

interface Stage3RefinementsProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  onComplete: () => void;
  onEdit: () => void;
}

export const Stage3Refinements: React.FC<Stage3RefinementsProps> = ({
  isActive,
  status,
  inputs,
  updateInput,
  onComplete,
  onEdit,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('US');

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const defaults = countryDefaults[countryCode] || countryDefaults['OTHER'];
    updateInput('overheadPct')(defaults.overheadPct);
    updateInput('vacationDays')(defaults.vacationDays);
    updateInput('publicHolidays')(defaults.publicHolidays);
  };

  return (
    <JourneyStage
      stageNumber={3}
      title="The Fine Print"
      subtitle="Adjust for your specific situation"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6">
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">
            Every situation is unique. These defaults work for most people, but you can adjust them to match your specific circumstances and risk tolerance.
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Optional but recommended for accurate results
          </p>
        </div>

        {/* Assumptions Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Country & Working Conditions</h4>
          <AssumptionsAccordion
            inputs={inputs}
            updateInput={updateInput}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
          />
        </div>

        {/* Risk Tolerance Section */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Risk Tolerance</h4>
          <RiskToleranceSection
            inputs={inputs}
            updateInput={updateInput}
          />
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
          </div>
          <span>3 of 4 complete</span>
        </div>

        {/* Continue Button */}
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full md:w-auto"
        >
          See my complete picture
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </JourneyStage>
  );
};
