import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InfoTooltip } from './InfoTooltip';
import { TrendingUp, ChevronDown } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';

interface RiskToleranceSectionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
}

const riskToleranceOptions = [
  { value: 1.0, label: "Very comfortable with income gaps (0% premium)" },
  { value: 0.8, label: "Comfortable with some uncertainty (25% premium)" },
  { value: 0.67, label: "Somewhat comfortable (50% premium)" },
  { value: 0.57, label: "Need more stability (75% premium)" },
  { value: 0.5, label: "Require steady income (100% premium)" }
];

export const RiskToleranceSection: React.FC<RiskToleranceSectionProps> = ({
  inputs,
  updateInput
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleRiskToleranceChange = (value: string) => {
    updateInput('riskTolerancePct')(parseFloat(value));
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Risk Tolerance</h3>
              <p className="text-xs text-muted-foreground">For those who want to understand risk impact</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="p-6 bg-card rounded-lg border border-border space-y-6">
          {/* Educational Note - Moved to top */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Understanding Risk in Fractional Work</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Income gaps:</strong> Time between projects when you're not earning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Variable utilization:</strong> Not all weeks are billable weeks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Market volatility:</strong> Economic conditions affect demand for fractional talent</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span><strong>Risk premium:</strong> Higher rates compensate for these uncertainties</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                Your Risk Tolerance Level
                <InfoTooltip content={
                  <>
                    Your <strong>comfort level with income uncertainty</strong> in fractional work. Lower risk tolerance means you charge a higher premium to compensate for potential gaps between projects and income volatility. This adjusts your rate to account for the inherent unpredictability of fractional engagements.
                  </>
                } />
              </label>
              <Select 
                value={(inputs.riskTolerancePct || 0.5).toString()} 
                onValueChange={handleRiskToleranceChange}
              >
                <SelectTrigger className="h-12 bg-background border-border">
                  <SelectValue placeholder="Select risk tolerance" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {riskToleranceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How comfortable are you with income volatility and gaps between projects?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Your Selection</h4>
                <div className="text-lg font-semibold text-primary">
                  {riskToleranceOptions.find(opt => opt.value === (inputs.riskTolerancePct || 0.5))?.label}
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                    Risk-Adjusted Billing Rate
                    <InfoTooltip content={
                      <>
                        A <strong>conceptual rate</strong> that factors in income volatility risk. This helps you understand risk aversion impact but may not reflect actual market rates. Use as a reference point, not a pricing target.
                      </>
                    } />
                  </label>
                  <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(
                      (() => {
                        const workingDays = 52*5 - (
                          (inputs.vacationDays || 21) + 
                          (inputs.publicHolidays || 15) + 
                          (inputs.otherLeaveDays || 10) + 
                          (inputs.trainingDays || 4)
                        );
                        const totalComp = (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0);
                        const annualCost = totalComp * (1 + (inputs.overheadPct || 0.25));
                        const nominalHourly = annualCost / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
                        const billingRate = nominalHourly / (1 - (inputs.nonBillablePct || 0.30));
                        return billingRate / (inputs.riskTolerancePct || 0.50);
                      })()
                    )}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Conceptual rate for understanding risk impact
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> This risk-adjusted rate is theoretical and helps you understand how risk tolerance affects pricing decisions. Market rates may differ based on industry, experience, and demand.
              </p>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
