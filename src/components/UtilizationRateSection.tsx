import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { InfoTooltip } from './InfoTooltip';
import { Activity, ChevronDown } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';
import { formatCurrencyDecimal } from '@/utils/calculator';

interface UtilizationRateSectionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
}

export const UtilizationRateSection: React.FC<UtilizationRateSectionProps> = ({
  inputs,
  updateInput
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Convert nonBillablePct to utilizationRate (utilization = 1 - nonBillable)
  const utilizationRate = 1 - (inputs.nonBillablePct || 0.30);
  
  const handleUtilizationChange = (value: number[]) => {
    // Convert utilization rate back to nonBillablePct
    const newUtilization = value[0];
    const newNonBillable = 1 - newUtilization;
    updateInput('nonBillablePct')(newNonBillable);
  };

  // Calculate rates for comparison
  const calculateRate = (utilization: number) => {
    const workingDays = 52*5 - (
      (inputs.vacationDays || 21) + 
      (inputs.publicHolidays || 15) + 
      (inputs.otherLeaveDays || 10) + 
      (inputs.trainingDays || 4)
    );
    const totalComp = (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0);
    const annualCost = totalComp * (1 + (inputs.overheadPct || 0.25));
    const nominalHourly = annualCost / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
    return nominalHourly * utilization;
  };

  const currentEffectiveHourly = calculateRate(utilizationRate);
  const rate60 = calculateRate(0.60);
  const rate85 = calculateRate(0.85);
  const improvementPercent = ((rate85 - rate60) / rate60 * 100);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Utilization Rate</h3>
              <p className="text-xs text-muted-foreground">Understand how billable hours impact your effective rate</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="p-6 bg-card rounded-lg border border-border space-y-6">
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                Target Utilization Rate
                <InfoTooltip content={
                  <>
                    The <strong>percentage of your working hours that are billable</strong> to clients. Higher utilization means more of your time generates revenue. Typical fractional leaders achieve <strong>60-85% utilization</strong>, with the remaining time spent on business development, proposals, and administration.
                  </>
                } />
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{Math.round(utilizationRate * 100)}%</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((1 - utilizationRate) * 100)}% non-billable time
                  </span>
                </div>
                <Slider
                  value={[utilizationRate]}
                  onValueChange={handleUtilizationChange}
                  min={0.40}
                  max={0.95}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>40%</span>
                  <span>95%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust to see how different utilization rates affect your minimum required hourly rate
              </p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  Minimum Hourly Rate at {Math.round(utilizationRate * 100)}% Utilization
                  <InfoTooltip content={
                    <>
                      Your <strong>minimum billable rate</strong> needed to achieve your target compensation at this utilization level. This accounts for the time you can't bill to clients.
                    </>
                  } />
                </label>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrencyDecimal(currentEffectiveHourly)}
                </div>
                <p className="text-xs text-muted-foreground">
                  This is your effective hourly rate after accounting for non-billable time
                </p>
              </div>
            </div>

            {/* Visual Impact Section */}
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium text-foreground mb-3">Utilization Impact</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground">At 60% utilization</div>
                    <div className="text-lg font-semibold text-foreground">{formatCurrencyDecimal(rate60)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">Baseline</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <div>
                    <div className="text-xs text-muted-foreground">At 85% utilization</div>
                    <div className="text-lg font-semibold text-primary">{formatCurrencyDecimal(rate85)}</div>
                  </div>
                  <div className="text-xs font-medium text-primary">
                    +{improvementPercent.toFixed(0)}% improvement
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Increasing your utilization from 60% to 85% improves your effective hourly rate by <strong>{improvementPercent.toFixed(0)}%</strong>, meaning you can earn more even at the same nominal rate.
              </p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Understanding Utilization</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Billable hours:</strong> Time directly spent on client work that you can invoice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Non-billable time:</strong> Business development, proposals, networking, admin work</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Higher utilization:</strong> More revenue per hour worked, but requires strong pipeline</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Sustainable target:</strong> Most fractional leaders maintain 60-75% long-term</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};