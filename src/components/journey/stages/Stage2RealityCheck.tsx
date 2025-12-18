import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrencyDecimal } from '@/utils/calculator';
import { NumberInput } from '@/components/NumberInput';
import { InfoTooltip } from '@/components/InfoTooltip';
import { MobileSidebarContent } from '../MobileSidebarContent';

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
        {/* Mobile Sidebar Content */}
        <MobileSidebarContent segment="utilization" />
        
        {/* Educational Context */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-foreground font-medium mb-2">
            Why Utilization Rate Matters
          </p>
          <p className="text-sm text-muted-foreground">
            In a fractional model, you are the CEO, the product, and the sales team. The time you spend on business development and operations is essential, but it isn&apos;t billable.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            <strong>The Reality:</strong> Most fractional leaders start with 30-60% utilization rate. To maintain your income, your billable hours must subsidize this behind-the-scenes work.
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
                    Billable Project Work / Utilization Rate
                    <InfoTooltip content={
                      <>
                        The <strong>percentage of your working hours</strong> that are directly billable to clients. This is the core metric that determines your billing rate.
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumberInput
                  label={
                    <>
                      Business Development / Networking{' '}
                      <span className="inline-flex align-middle"><InfoTooltip content="Time spent on sales, proposals, and winning new clients" /></span>
                    </>
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
                    <>
                      Finance & Billing{' '}
                      <span className="inline-flex align-middle"><InfoTooltip content="Billing, accounting, and financial management" /></span>
                    </>
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
                    <>
                      Business Operations{' '}
                      <span className="inline-flex align-middle"><InfoTooltip content="General admin and relationship building" /></span>
                    </>
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

        {/* Required Billing Rate - Two Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {/* Green Card - Take-home Rate Based */}
          <div className="p-6 bg-primary/10 rounded-xl border-2 border-primary/20">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Benchmarked Billing Rate<br />(Full-time Cash Compensation Based)
            </p>
            <div className="text-4xl font-bold text-primary mb-3">
              {formatCurrencyDecimal(results.directHourly / projectWorkPct)}
              <span className="text-lg font-normal text-muted-foreground">/hr</span>
            </div>
            <p className="text-sm text-muted-foreground">
              At {utilizationRate.toFixed(0)}% utilization rate, you would need to bill {formatCurrencyDecimal(results.directHourly / projectWorkPct)}/hr in order to achieve an equivalent of your full-time annual cash compensation pay. This means at a billing rate of {formatCurrencyDecimal(results.directHourly / projectWorkPct)}/hr, you are making an effective hourly rate of {formatCurrencyDecimal(results.directHourly)}/hr.
            </p>
          </div>

          {/* Purple Card - Fully-loaded Rate Based */}
          <div className="p-6 bg-purple-500/10 rounded-xl border-2 border-purple-500/20">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Benchmarked Billing Rate<br />(Full-time Cash + Benefits Compensation Based)
            </p>
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-3">
              {formatCurrencyDecimal(results.fullyLoadedHourly / projectWorkPct)}
              <span className="text-lg font-normal text-muted-foreground">/hr</span>
            </div>
            <p className="text-sm text-muted-foreground">
              At {utilizationRate.toFixed(0)}% utilization rate, you would need to bill {formatCurrencyDecimal(results.fullyLoadedHourly / projectWorkPct)}/hr in order to achieve an equivalent of your full-time annual cash + benefits pay. This means at a billing rate of {formatCurrencyDecimal(results.fullyLoadedHourly / projectWorkPct)}/hr, you are making an effective hourly rate of {formatCurrencyDecimal(results.fullyLoadedHourly)}/hr.
            </p>
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
