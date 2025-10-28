import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles } from 'lucide-react';
import { JourneyStage } from '../JourneyStage';
import { type StageStatus } from '../JourneyContainer';
import { type Inputs, type Results, formatCurrency, formatCurrencyDecimal } from '@/utils/calculator';
import { type JourneyStage as JourneyStageType } from '../JourneyContainer';

interface Stage4SolutionProps {
  isActive: boolean;
  status: StageStatus;
  inputs: Inputs;
  results: Results;
  onEditStage: (stage: JourneyStageType) => void;
  onReset: () => void;
}

export const Stage4Solution: React.FC<Stage4SolutionProps> = ({
  isActive,
  status,
  inputs,
  results,
  onEditStage,
  onReset,
}) => {
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  const nonBillablePct = bdPct + invoicingPct + adminPct;
  
  const billingRate = results.nominalHourly / (1 - nonBillablePct);

  return (
    <JourneyStage
      stageNumber={4}
      title="Your Path Forward"
      subtitle="Your complete fractional rate breakdown"
      status={status}
      isActive={isActive}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 bg-primary/10 rounded-xl border border-primary/20">
            <p className="text-xs font-medium text-muted-foreground mb-2">Effective Rate</p>
            <p className="text-3xl font-bold text-primary mb-1">
              {formatCurrencyDecimal(results.nominalHourly)}
              <span className="text-sm font-normal text-muted-foreground">/hr</span>
            </p>
            <p className="text-xs text-muted-foreground">Your take-home hourly rate</p>
          </div>

          <div className="p-6 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <p className="text-xs font-medium text-muted-foreground mb-2">Billing Rate</p>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">
              {formatCurrencyDecimal(billingRate)}
              <span className="text-sm font-normal text-muted-foreground">/hr</span>
            </p>
            <p className="text-xs text-muted-foreground">What you charge clients</p>
          </div>

          <div className="p-6 bg-muted/30 rounded-xl border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Annual Target</p>
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(results.annualCostIncludingOH)}
            </p>
            <p className="text-xs text-muted-foreground">Equivalent full-time comp</p>
          </div>
        </div>


        {/* Completion Badge */}
        <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-primary">
            Calculation Complete! All stages reviewed.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1"
            asChild
          >
            <a href="https://fractionalfirst.com" target="_blank" rel="noopener noreferrer">
              Talk to Fractional First
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
          >
            Start Over
          </Button>
        </div>
      </div>
    </JourneyStage>
  );
};
