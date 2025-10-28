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
  const currentUtilization = ((1 - nonBillablePct) * 100).toFixed(0);
  
  // Fractional First improvement scenario
  const improvedUtilization = 0.75; // 75% average billable time with Fractional First
  const fractionalFirstRevShare = 0.30; // 30% revenue share to Fractional First

  // Annual working hours
  const annualHours = results.workingDaysPerYear * (inputs.hoursPerDay || 8);

  // BEFORE: Going solo at current rate and current utilization
  const soloAnnualEarnings = billingRate * annualHours * (1 - nonBillablePct);

  // AFTER: With Fractional First - same rate to clients, more billable hours, minus their cut
  const fractionalFirstGrossEarnings = billingRate * annualHours * improvedUtilization;
  const fractionalFirstNetEarnings = fractionalFirstGrossEarnings * (1 - fractionalFirstRevShare);

  // NET BENEFIT
  const netBenefit = fractionalFirstNetEarnings - soloAnnualEarnings;
  const netHourlyAfterRevShare = billingRate * (1 - fractionalFirstRevShare);

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

        {/* Fractional First Value Proposition */}
        <div className="p-6 bg-gradient-to-br from-teal-500/10 to-primary/10 rounded-xl border-2 border-teal-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-bold text-foreground">How Fractional First Helps You</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Fractional First handles business development, client matching, and admin tasks for a 30% revenue share. Even after their cut, you earn MORE because you spend 75% of your time on billable work instead of {currentUtilization}.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* BEFORE: Typical Independent */}
            <div className="p-5 bg-background/80 rounded-lg border border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">Typical Independent</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Billing rate</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrencyDecimal(billingRate)}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Billable time</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                    {currentUtilization}%
                  </p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Annual earnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(soloAnnualEarnings)}
                  </p>
                </div>
              </div>
            </div>

            {/* AFTER: With Fractional First */}
            <div className="p-5 bg-teal-500/10 rounded-lg border-2 border-teal-500/30">
              <p className="text-xs font-medium text-teal-700 dark:text-teal-400 mb-3">With Fractional First</p>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Billing rate (to clients)</p>
                  <p className="text-xl font-bold text-foreground">
                    {formatCurrencyDecimal(billingRate)}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Billable time</p>
                  <p className="text-xl font-bold text-teal-700 dark:text-teal-400">
                    75%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your net rate (after 30% share)</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrencyDecimal(netHourlyAfterRevShare)}<span className="text-sm font-normal text-muted-foreground">/hr</span>
                  </p>
                </div>
                <div className="pt-3 border-t border-teal-500/20">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Annual earnings</p>
                  <p className="text-2xl font-bold text-teal-700 dark:text-teal-400">
                    {formatCurrency(fractionalFirstNetEarnings)}
                  </p>
                  <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-2">
                    +{formatCurrency(netBenefit)} more per year
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-3">What Fractional First handles for you:</p>
            <ul className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-teal-600 dark:text-teal-400">✓</span>
                Business development & lead generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600 dark:text-teal-400">✓</span>
                Client matching & qualification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600 dark:text-teal-400">✓</span>
                Contract negotiation & legal support
              </li>
              <li className="flex items-center gap-2">
                <span className="text-teal-600 dark:text-teal-400">✓</span>
                Invoicing & payment processing
              </li>
            </ul>
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
