import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrencyDecimal } from '@/utils/calculator';
import { NumberInput } from '@/components/NumberInput';
import { InfoTooltip } from '@/components/InfoTooltip';

interface Stage2RealityCheckProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  onComplete: () => void;
  onEdit: () => void;
}

export const Stage2RealityCheck: React.FC<Stage2RealityCheckProps> = ({
  isActive,
  status,
  inputs,
  results,
  updateInput,
  onComplete,
  onEdit,
}) => {

  // Get time allocation percentages from inputs (decimals 0-1)
  const projectWorkPct = inputs.projectWorkPct ?? 0.6;
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  
  // Calculate utilization rate (project work percentage)
  const utilizationRate = projectWorkPct * 100;
  const nonBillablePct = (bdPct + invoicingPct + adminPct);
  
  // Calculate total and billing rate
  const totalPct = (projectWorkPct + bdPct + invoicingPct + adminPct) * 100;
  const billingRate = results.directHourly / projectWorkPct;
  const effectiveRate = results.directHourly;
  
  // Calculate Rate Gap as a multiple
  const rateMultiple = billingRate / effectiveRate;
  const rateGapPercentage = ((billingRate - effectiveRate) / effectiveRate) * 100;
  
  // Determine efficiency level and color
  const getEfficiencyLevel = () => {
    if (utilizationRate >= 75) return { level: 'excellent', color: 'green', icon: CheckCircle2 };
    if (utilizationRate >= 60) return { level: 'good', color: 'yellow', icon: TrendingUp };
    return { level: 'needs-improvement', color: 'red', icon: AlertTriangle };
  };
  
  const efficiency = getEfficiencyLevel();

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
      title="Understanding Utilization"
      subtitle="How billable time affects what you need to charge"
      status={status}
      isActive={isActive}
      onEdit={onEdit}
    >
      <div className="space-y-6 mt-6">
        {/* Educational Context */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-foreground font-medium mb-2">
            Why Utilization Rate Matters
          </p>
          <p className="text-sm text-muted-foreground">
            Fractional work isn't 100% billable. You need time for business development, invoicing, and administration. 
            <strong> Most new fractional leaders start around 50% billable time</strong> as they build their client base.
          </p>
        </div>

        {/* Time Allocation Section */}
        <div className="p-6 bg-muted/30 rounded-xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            How You Spend Your Time
          </h3>
          
          <div className="space-y-4">
            {/* Project Work / Utilization Rate */}
            <div className="space-y-2">
              <NumberInput
                label={
                  <div className="flex items-center gap-2">
                    Project Work / Utilization Rate
                    <InfoTooltip content={
                      <>
                        The <strong>percentage of your working hours</strong> that are directly billable to clients. This is the core metric that determines your required billing rate.
                      </>
                    } />
                  </div>
                }
                value={projectWorkPct}
                onChange={handleProjectWorkChange}
                suffix="%"
                min={0}
                max={1}
                step={0.05}
              />
            </div>

            {/* Non-billable Time Breakdown */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">Non-Billable Time Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <NumberInput
                  label={
                    <div className="flex items-center gap-2">
                      Business Development
                      <InfoTooltip content="Time spent on sales, proposals, and winning new clients" />
                    </div>
                  }
                  value={bdPct}
                  onChange={handleBdChange}
                  suffix="%"
                  min={0}
                  max={1}
                  step={0.05}
                />
                <NumberInput
                  label={
                    <div className="flex items-center gap-2">
                      Invoicing/Finances
                      <InfoTooltip content="Billing, accounting, and financial management" />
                    </div>
                  }
                  value={invoicingPct}
                  onChange={handleInvoicingChange}
                  suffix="%"
                  min={0}
                  max={1}
                  step={0.05}
                />
                <NumberInput
                  label={
                    <div className="flex items-center gap-2">
                      Admin/Networking
                      <InfoTooltip content="General admin and relationship building" />
                    </div>
                  }
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

        {/* Required Billing Rate */}
        <div className="p-6 bg-amber-500/10 rounded-xl border-2 border-amber-500/20 animate-fade-in">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            What You Need to Charge Clients
          </p>
          <div className="text-4xl font-bold text-amber-700 dark:text-amber-400 mb-2">
            {formatCurrencyDecimal(billingRate)}
            <span className="text-lg font-normal text-muted-foreground">/hr</span>
          </div>
          <p className="text-sm text-muted-foreground">
            To achieve your effective rate at {utilizationRate.toFixed(0)}% utilization
          </p>
        </div>

        {/* Rate Gap / Efficiency Visualization */}
        <div className={`p-6 rounded-xl border-2 animate-fade-in ${
          efficiency.color === 'red' ? 'bg-red-500/10 border-red-500/30' :
          efficiency.color === 'yellow' ? 'bg-amber-500/10 border-amber-500/30' :
          'bg-green-500/10 border-green-500/30'
        }`}>
          <div className="flex items-start gap-3 mb-4">
            {React.createElement(efficiency.icon, { 
              className: `w-6 h-6 flex-shrink-0 ${
                efficiency.color === 'red' ? 'text-red-600 dark:text-red-400' :
                efficiency.color === 'yellow' ? 'text-amber-600 dark:text-amber-400' :
                'text-green-600 dark:text-green-400'
              }`
            })}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Rate Gap</h4>
              <p className="text-xs text-muted-foreground">
                The difference between your effective rate and what you must charge
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Your Effective Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrencyDecimal(effectiveRate)}
              </p>
            </div>
            <div className="p-4 bg-background/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Required Billing Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrencyDecimal(billingRate)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-background/70 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Rate Multiple:</span>
              <span className={`text-2xl font-bold ${
                efficiency.color === 'red' ? 'text-red-600 dark:text-red-400' :
                efficiency.color === 'yellow' ? 'text-amber-600 dark:text-amber-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {rateMultiple.toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Gap Percentage:</span>
              <span className={`text-lg font-semibold ${
                efficiency.color === 'red' ? 'text-red-600 dark:text-red-400' :
                efficiency.color === 'yellow' ? 'text-amber-600 dark:text-amber-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                +{rateGapPercentage.toFixed(0)}%
              </span>
            </div>
          </div>

          {/* Efficiency Status Message */}
          <div className="mt-4 p-3 bg-background/70 rounded-lg">
            <p className={`text-sm font-medium ${
              efficiency.color === 'red' ? 'text-red-600 dark:text-red-400' :
              efficiency.color === 'yellow' ? 'text-amber-600 dark:text-amber-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {efficiency.level === 'excellent' && '✓ Excellent utilization! You have great efficiency.'}
              {efficiency.level === 'good' && '✓ Good utilization. Typical for established fractional professionals.'}
              {efficiency.level === 'needs-improvement' && '⚠ Low utilization detected'}
            </p>
            {efficiency.level === 'needs-improvement' && (
              <p className="text-sm text-muted-foreground mt-2">
                <strong>We recommend that you find ways to increase your utilization rate.</strong> 
                Consider focusing more time on billable client work or exploring solutions to help you secure more consistent engagements.
              </p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-muted"></div>
          </div>
          <span>2 of 3 complete</span>
        </div>

        {/* Action Button */}
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full md:w-auto"
        >
          See path forward
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </JourneyStage>
  );
};
