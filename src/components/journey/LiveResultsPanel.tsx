import React, { useState } from 'react';
import { TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Inputs, type Results, formatCurrency, formatCurrencyDecimal } from '@/utils/calculator';
import { type JourneyStage } from './JourneyContainer';
import { Switch } from '@/components/ui/switch';
interface LiveResultsPanelProps {
  inputs: Inputs;
  results: Results;
  completedStages: JourneyStage[];
  hasFoundationInputs: boolean;
}
export const LiveResultsPanel: React.FC<LiveResultsPanelProps> = ({
  inputs,
  results,
  completedStages,
  hasFoundationInputs
}) => {
  const [showFullyLoaded, setShowFullyLoaded] = useState(false);
  const showEffectiveRate = hasFoundationInputs;
  const showBillingRate = completedStages.includes('reality');
  const showFullBreakdown = completedStages.includes('refinements');

  // Calculate non-billable percentage from time allocation (decimals 0-1)
  const bdPct = inputs.bdPct ?? 0.15;
  const invoicingPct = inputs.invoicingPct ?? 0.10;
  const adminPct = inputs.adminPct ?? 0.15;
  const nonBillablePct = bdPct + invoicingPct + adminPct;

  // Use direct or fully loaded rates based on toggle
  const displayHourly = showFullyLoaded ? results.fullyLoadedHourly : results.directHourly;
  const displayDaily = showFullyLoaded ? results.fullyLoadedDaily : results.directDaily;
  const displayEffectiveHourly = showFullyLoaded ? results.fullyLoadedEffectiveHourly : results.directEffectiveHourly;
  const billingRate = displayHourly / (1 - nonBillablePct);
  const gap = billingRate - displayHourly;
  const gapPercentage = displayHourly > 0 ? gap / displayHourly * 100 : 0;
  return <div className="sticky top-24 space-y-4">
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Live Results
        </h3>

        {/* Toggle between Direct and Fully Loaded */}
        {showEffectiveRate && <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">
                  {showFullyLoaded ? 'Show Fully Loaded Rate' : 'Show Effective Rate'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {showFullyLoaded ? 'Includes overhead & benefits' : 'Your direct compensation'}
                </p>
              </div>
              <Switch checked={showFullyLoaded} onCheckedChange={setShowFullyLoaded} />
            </div>
          </div>}

        <div className="space-y-4">
          {/* Stage 1: Effective Rate */}
          {showEffectiveRate && <div className="animate-fade-in">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {showFullyLoaded ? 'Fully Loaded Rate' : 'Your Effective Rate'}
                </p>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrencyDecimal(displayHourly)}
                  <span className="text-sm font-normal text-muted-foreground">/hr</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {showFullyLoaded ? 'Total cost to organization including overhead' : 'Your personal compensation equivalent'}
                </p>
              </div>
            </div>}

          {/* Stage 2: Billing Rate + Gap */}
          {showBillingRate && <div className="animate-fade-in space-y-3">
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Required Billing Rate
                </p>
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                  {formatCurrencyDecimal(billingRate)}
                  <span className="text-sm font-normal text-muted-foreground">/hr</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Your Effective Rate</p>
              </div>

              {/* Gap Visualization */}
              {gap > 0 && <div className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      The Gap:
                    </span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(gap)}/hr
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                    <div className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-500" style={{
                width: `${Math.min(100, gapPercentage)}%`
              }} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {gapPercentage < 25 && "Great utilization!"}
                    {gapPercentage >= 25 && gapPercentage < 50 && "Typical for fractional work"}
                    {gapPercentage >= 50 && "Consider ways to increase billable time"}
                  </p>
                </div>}
            </div>}

          {/* Stage 3: Full Breakdown */}
          {showFullBreakdown && <div className="animate-fade-in space-y-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(displayDaily)}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(showFullyLoaded ? results.monthlyCostIncludingOH : results.monthlyComp)}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Working Days/Year</p>
                <p className="text-lg font-bold text-foreground">
                  {results.workingDaysPerYear} days
                </p>
              </div>
            </div>}

          {/* Empty State */}
          {!showEffectiveRate && <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Enter your compensation to see results
              </p>
            </div>}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ArrowUpRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              {!showEffectiveRate && "Start by entering your full-time salary or fractional rate"}
              {showEffectiveRate && !showBillingRate && "See how non-billable time affects your required rate"}
              {showBillingRate && !showFullBreakdown && "Fine-tune with country-specific defaults and risk tolerance"}
              {showFullBreakdown && "Review your complete breakdown and explore the Fractional First solution"}
            </p>
          </div>
        </div>
      </div>
    </div>;
};