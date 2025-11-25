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
  utilizationRef: React.RefObject<HTMLDivElement>;
}

export const Stage2RealityCheck: React.FC<Stage2RealityCheckProps> = ({
  isActive,
  status,
  inputs,
  results,
  updateInput,
  onComplete,
  onEdit,
  utilizationRef,
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
      <div className="space-y-6 mt-6" ref={utilizationRef} data-segment="utilization">
        {/* Educational Context */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-foreground font-medium mb-2">
            Why Utilization Rate Matters
          </p>
          <p className="text-sm text-muted-foreground">
            Fractional work isn&apos;t typically 100% billable. You need time for business development, invoicing, and administration. Most new fractional leaders start with 30-60% utilization rate as they build their client base.
          </p>
        </div>

        {/* Time Allocation Section */}
        <div className="p-6 bg-muted/30 rounded-xl">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            How You Spend Your Working Time
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
            Billing Rate
          </p>
          <div className="text-4xl font-bold text-amber-700 dark:text-amber-400 mb-2">
            {formatCurrencyDecimal(billingRate)}
            <span className="text-lg font-normal text-muted-foreground">/hr</span>
          </div>
          <p className="text-sm text-muted-foreground">
            To achieve your effective rate at {utilizationRate.toFixed(0)}% utilization
          </p>
        </div>

        {/* Utilization Impact Comparison */}
        <div className="p-6 bg-muted/30 rounded-xl border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Utilization Impact on Your Rate
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 100% Utilization - Theoretical */}
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                100% Utilization (Unrealistic)
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-muted-foreground">Direct compensation</div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrencyDecimal(results.directHourly)}<span className="text-sm font-normal">/hr</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fully-loaded rate</div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrencyDecimal(results.fullyLoadedHourly)}<span className="text-sm font-normal">/hr</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Theoretical baseline</p>
            </div>

            {/* Current Utilization - Realistic */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {utilizationRate.toFixed(0)}% Utilization (Your Current Rate)
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-muted-foreground">Direct compensation</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrencyDecimal(results.directHourly / projectWorkPct)}<span className="text-sm font-normal">/hr</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Fully-loaded rate</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrencyDecimal(results.fullyLoadedHourly / projectWorkPct)}<span className="text-sm font-normal">/hr</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Based on your time allocation</p>
            </div>
          </div>

          {/* Realistic Utilization Guidelines */}
          <div className="p-4 bg-background rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              What's a Realistic Utilization Rate?
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">40–60%:</span>
                <span className="text-muted-foreground">Acceptable for new fractional leaders</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">60–70%:</span>
                <span className="text-muted-foreground">Good utilization rate</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">70–85%:</span>
                <span className="text-muted-foreground">Great utilization rate</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground min-w-[80px]">85%+:</span>
                <span className="text-muted-foreground">It depends—excellent if you've outsourced pipeline development, but risky if pipeline development is neglected</span>
              </div>
            </div>
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
