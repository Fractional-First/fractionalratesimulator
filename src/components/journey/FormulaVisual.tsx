import React from 'react';
import { cn } from '@/lib/utils';

export type FormulaType = 'take-home-rate' | 'fully-loaded-rate' | 'working-hours' | 'billing-rate';

interface FormulaVisualProps {
  type: FormulaType;
  className?: string;
}

export const FormulaVisual: React.FC<FormulaVisualProps> = ({ type, className }) => {
  const renderFormula = () => {
    switch (type) {
      case 'take-home-rate':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-4 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-2">
              {/* Numerator */}
              <div className="text-center py-2">
                <span className="text-sm font-medium text-foreground">Base Salary</span>
                <span className="text-muted-foreground mx-1.5">+</span>
                <span className="text-sm font-medium text-foreground">Annual Bonus</span>
                <span className="text-muted-foreground mx-1.5">+</span>
                <span className="text-sm font-medium text-foreground">Annual Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-2">
                <span className="text-sm font-medium text-foreground">Working Days</span>
                <span className="text-muted-foreground mx-1.5">×</span>
                <span className="text-sm font-medium text-foreground">Hours Per Day</span>
              </div>
            </div>
          </div>
        );

      case 'fully-loaded-rate':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-4 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-2">
              {/* Numerator */}
              <div className="text-center py-2 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
                <span className="text-sm font-medium text-foreground">Base Salary</span>
                <span className="text-muted-foreground">×</span>
                <span className="text-sm font-medium text-foreground">(1 + Overhead %)</span>
                <span className="text-muted-foreground">+</span>
                <span className="text-sm font-medium text-foreground">Bonus</span>
                <span className="text-muted-foreground">+</span>
                <span className="text-sm font-medium text-foreground">Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-2">
                <span className="text-sm font-medium text-foreground">Working Days</span>
                <span className="text-muted-foreground mx-1.5">×</span>
                <span className="text-sm font-medium text-foreground">Hours Per Day</span>
              </div>
            </div>
          </div>
        );

      case 'working-hours':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-4 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-3">
              {/* Calculation */}
              <div className="text-center flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm">
                <span className="font-medium text-foreground">(52 weeks × 5 days)</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-medium text-foreground">Vacation</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-medium text-foreground">Holidays</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-medium text-foreground">Leave</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-medium text-foreground">Training</span>
              </div>
              
              {/* Arrow */}
              <div className="text-muted-foreground text-lg">↓</div>
              
              {/* Result */}
              <div className="text-center">
                <span className="text-sm font-semibold text-foreground">Annual Working Days</span>
              </div>
            </div>
          </div>
        );

      case 'billing-rate':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-4 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-2">
              {/* Numerator */}
              <div className="text-center py-2">
                <span className="text-sm font-medium text-foreground">Hourly Rate</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-2">
                <span className="text-sm font-medium text-foreground">Utilization Rate</span>
              </div>
              
              {/* Result */}
              <div className="text-center pt-2 text-sm font-semibold text-foreground">
                = Billing Rate
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderFormula();
};
