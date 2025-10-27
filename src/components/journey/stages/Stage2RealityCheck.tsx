import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, SkipForward } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrencyDecimal } from '@/utils/calculator';
import { NumberInput } from '@/components/NumberInput';

interface Stage2RealityCheckProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  onComplete: () => void;
  onEdit: () => void;
  onSkip: () => void;
}

export const Stage2RealityCheck: React.FC<Stage2RealityCheckProps> = ({
  isActive,
  status,
  inputs,
  results,
  updateInput,
  onComplete,
  onEdit,
  onSkip,
}) => {
  // Get time allocation percentages from inputs (decimals 0-1)
  const projectWorkPct = inputs.projectWorkPct ?? 0.6;
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  
  // Calculate total and non-billable percentage
  const totalPct = (projectWorkPct + bdPct + invoicingPct + adminPct) * 100;
  const nonBillablePct = (bdPct + invoicingPct + adminPct);

  const billingRate = results.nominalHourly / (1 - nonBillablePct);
  const gap = billingRate - results.nominalHourly;
  const gapPercentage = results.nominalHourly > 0 ? (gap / results.nominalHourly) * 100 : 0;

  const handleProjectWorkChange = (value: number) => {
    updateInput('projectWorkPct')(value);
  };

  const handleBdChange = (value: number) => {
    updateInput('bdPct')(value);
  };

  const handleInvoicingChange = (value: number) => {
    updateInput('invoicingPct')(value);
  };

  const handleAdminChange = (value: number) => {
    updateInput('adminPct')(value);
  };

  return (
    <JourneyStage
      stageNumber={2}
      title="The Reality Check"
      subtitle="Where does your time actually go?"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6">
        <div className="p-6 bg-muted/30 rounded-xl">
          <p className="text-sm text-muted-foreground mb-4">
            Fractional work isn't 100% billable. Adjust where your time goes to see the impact on your required billing rate.
          </p>

          <div className="space-y-4">
            <NumberInput
              label="Project Work (Billable Time)"
              value={projectWorkPct}
              onChange={handleProjectWorkChange}
              suffix="%"
              min={0}
              max={1}
              step={0.05}
              helperText="Percentage of time spent on client billable work"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <NumberInput
                  label="Business Development"
                  value={bdPct}
                  onChange={handleBdChange}
                  suffix="%"
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  label="Invoicing/Finances"
                  value={invoicingPct}
                  onChange={handleInvoicingChange}
                  suffix="%"
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="space-y-2">
                <NumberInput
                  label="Admin/Networking"
                  value={adminPct}
                  onChange={handleAdminChange}
                  suffix="%"
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
            </div>

            {/* Total validation */}
            <div className={`text-sm ${totalPct === 100 ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-400'}`}>
              Total: {totalPct.toFixed(0)}% {totalPct !== 100 && '(should equal 100%)'}
            </div>
          </div>
        </div>

        {/* Billing Rate Result */}
        <div className="p-6 bg-amber-500/10 rounded-xl border-2 border-amber-500/20 animate-fade-in">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Required Billing Rate
          </p>
          <div className="text-4xl font-bold text-amber-700 dark:text-amber-400 mb-2">
            {formatCurrencyDecimal(billingRate)}
            <span className="text-lg font-normal text-muted-foreground">/hr</span>
          </div>
          <p className="text-sm text-muted-foreground">
            What you need to charge clients to achieve your effective rate
          </p>
        </div>

        {/* Gap Visualization */}
        {gap > 0 && (
          <div className="p-6 bg-muted/50 rounded-xl border border-border animate-fade-in">
            <h4 className="text-sm font-semibold text-foreground mb-4">The Gap</h4>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Effective Rate</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrencyDecimal(results.nominalHourly)}
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-primary via-amber-400 to-red-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, gapPercentage + 50)}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Billing Rate</span>
                <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  {formatCurrencyDecimal(billingRate)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">
                Gap: {formatCurrencyDecimal(gap)}/hr ({gapPercentage.toFixed(0)}%)
              </p>
              <p className="text-xs text-muted-foreground">
                {gapPercentage < 25 && "Great utilization! Your non-billable time is well managed."}
                {gapPercentage >= 25 && gapPercentage < 50 && "Typical for fractional work. This is expected overhead."}
                {gapPercentage >= 50 && "Consider ways to increase billable time or reduce overhead."}
              </p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
          </div>
          <span>2 of 4 complete</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onComplete}
            size="lg"
            className="flex-1"
          >
            Fine-tune the details
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button
            onClick={onSkip}
            size="lg"
            variant="outline"
            className="sm:w-auto"
          >
            Skip to results
            <SkipForward className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </JourneyStage>
  );
};
