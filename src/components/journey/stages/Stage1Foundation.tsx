import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results } from '@/utils/calculator';
import { CurrencyInput } from '@/components/CurrencyInput';
import { formatCurrencyDecimal } from '@/utils/calculator';

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
  const [activeTab, setActiveTab] = useState<'fulltime' | 'fractional'>('fulltime');

  const hasFullTimeInputs = (inputs.baseSalary || 0) > 0;
  const hasFractionalInputs = (inputs.fractionalHourlyInput || 0) > 0;
  const canProceed = hasFullTimeInputs || hasFractionalInputs;

  return (
    <JourneyStage
      stageNumber={1}
      title="What You're Worth"
      subtitle="Let's start with what you know - your current compensation"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'fulltime' | 'fractional')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="fulltime">Full-time → Fractional</TabsTrigger>
            <TabsTrigger value="fractional">Fractional → Full-time</TabsTrigger>
          </TabsList>

          <TabsContent value="fulltime" className="space-y-4">
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
              <div className="mt-6 p-6 bg-primary/10 rounded-xl border-2 border-primary/20 animate-fade-in">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Your Effective Rate
                </p>
                <div className="text-4xl font-bold text-primary mb-2">
                  {formatCurrencyDecimal(results.nominalHourly)}
                  <span className="text-lg font-normal text-muted-foreground">/hr</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This is your apples-to-apples hourly comparison rate
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="fractional" className="space-y-4">
            <div className="space-y-4">
              <CurrencyInput
                label="Target Fractional Hourly Rate"
                value={inputs.fractionalHourlyInput || 0}
                onChange={updateInput('fractionalHourlyInput')}
                placeholder="150"
                helperText="Your target hourly rate as a fractional professional"
              />

              {hasFractionalInputs && (
                <div className="mt-6 p-6 bg-primary/10 rounded-xl border-2 border-primary/20 animate-fade-in">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Your Effective Rate
                  </p>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {formatCurrencyDecimal(results.nominalHourly)}
                    <span className="text-lg font-normal text-muted-foreground">/hr</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is your baseline hourly rate
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {canProceed && (
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full md:w-auto animate-fade-in"
          >
            Continue to Reality Check
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>
    </JourneyStage>
  );
};
