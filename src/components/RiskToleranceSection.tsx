import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from './InfoTooltip';
import { TrendingUp, ChevronDown, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';

interface RiskToleranceSectionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
}

const riskToleranceOptions = [
  { value: 1.0, label: "Low Risk: Very comfortable with income gaps (0% premium)" },
  { value: 0.8, label: "Low-Medium Risk: Comfortable with some uncertainty (25% premium)" },
  { value: 0.67, label: "Medium Risk: Somewhat comfortable (50% premium)" },
  { value: 0.57, label: "Medium-High Risk: Need more stability (75% premium)" },
  { value: 0.5, label: "High Risk: Require steady income (100% premium)" }
];

const getWarningLevel = (percentIncrease: number): {
  level: 'green' | 'yellow' | 'red';
  message: string;
  icon: React.ReactNode;
  badgeClasses: string;
  messageClasses: string;
} => {
  if (percentIncrease <= 25) {
    return {
      level: 'green',
      message: 'Healthy Risk Level: Your risk adjustment is modest and typically acceptable in fractional markets.',
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
      badgeClasses: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
      messageClasses: 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
    };
  } else if (percentIncrease <= 75) {
    return {
      level: 'yellow',
      message: 'Elevated Risk Premium: This risk level adds significant markup. Consider if market rates support this premium.',
      icon: <AlertTriangle className="w-3 h-3 mr-1" />,
      badgeClasses: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      messageClasses: 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
    };
  } else {
    return {
      level: 'red',
      message: 'High Risk-Adjusted Rate: This risk level may require a market rate that signals unsuitability for fractional work.',
      icon: <AlertCircle className="w-3 h-3 mr-1" />,
      badgeClasses: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
      messageClasses: 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
    };
  }
};

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
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> This risk-adjusted rate is theoretical and helps you understand how risk tolerance affects pricing decisions. Market rates may differ based on industry, experience, and demand.
            </p>
          </div>

          {/* Educational Note */}
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
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Your Selection</h4>
                <div className="text-lg font-semibold text-primary">
                  {riskToleranceOptions.find(opt => opt.value === (inputs.riskTolerancePct || 0.5))?.label}
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                      Risk-Adjusted Billing Rate
                      <InfoTooltip content={
                        <>
                          A <strong>conceptual rate</strong> that factors in income volatility risk. This helps you understand risk aversion impact but may not reflect actual market rates. Use as a reference point, not a pricing target.
                        </>
                      } />
                    </label>
                    {(() => {
                      const workingDays = 52*5 - (
                        (inputs.vacationDays || 21) + 
                        (inputs.publicHolidays || 15) + 
                        (inputs.otherLeaveDays || 10) + 
                        (inputs.trainingDays || 4)
                      );
                      const totalComp = (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0);
                      const directHourly = totalComp / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
                      const riskAdjustedRate = directHourly / (inputs.riskTolerancePct || 0.50);
                      const percentageIncrease = ((riskAdjustedRate - directHourly) / directHourly) * 100;
                      const warning = getWarningLevel(percentageIncrease);
                      
                      return (
                        <>
                          <Badge className={`${warning.badgeClasses} border`}>
                            {warning.icon}
                            {Math.round(percentageIncrease)}% over base
                          </Badge>
                        </>
                      );
                    })()}
                  </div>
                  
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
                        const directHourly = totalComp / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
                        return directHourly / (inputs.riskTolerancePct || 0.50);
                      })()
                    )}
                    <span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </div>
                  
                  {(() => {
                    const workingDays = 52*5 - (
                      (inputs.vacationDays || 21) + 
                      (inputs.publicHolidays || 15) + 
                      (inputs.otherLeaveDays || 10) + 
                      (inputs.trainingDays || 4)
                    );
                    const totalComp = (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0);
                    const directHourly = totalComp / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
                    const riskAdjustedRate = directHourly / (inputs.riskTolerancePct || 0.50);
                    const percentageIncrease = ((riskAdjustedRate - directHourly) / directHourly) * 100;
                    const warning = getWarningLevel(percentageIncrease);
                    
                    return (
                      <div className={`p-3 rounded-lg border ${warning.messageClasses}`}>
                        <p className="text-xs">
                          {warning.message}
                        </p>
                      </div>
                    );
                  })()}
                  
                  <p className="text-xs text-muted-foreground">
                    Conceptual rate for understanding risk impact
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
