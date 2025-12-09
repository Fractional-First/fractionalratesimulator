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
          <div className={cn("bg-muted/40 rounded-lg p-2 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-1">
              {/* Numerator */}
              <div className="text-center py-1">
                <span className="text-xs font-medium text-foreground">Base Salary</span>
                <span className="text-muted-foreground mx-1">+</span>
                <span className="text-xs font-medium text-foreground">Bonus</span>
                <span className="text-muted-foreground mx-1">+</span>
                <span className="text-xs font-medium text-foreground">Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="text-xs font-medium text-foreground">Working Days in a Year</span>
                <span className="text-muted-foreground mx-1">×</span>
                <span className="text-xs font-medium text-foreground">Hours Per Day</span>
              </div>
            </div>
          </div>
        );

      case 'fully-loaded-rate':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-2 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-1">
              {/* Numerator */}
              <div className="text-center py-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
                <span className="text-xs font-medium text-foreground">Base Salary</span>
                <span className="text-muted-foreground">×</span>
                <span className="text-xs font-medium text-foreground">(1 + Overhead %)</span>
                <span className="text-muted-foreground">+</span>
                <span className="text-xs font-medium text-foreground">Bonus</span>
                <span className="text-muted-foreground">+</span>
                <span className="text-xs font-medium text-foreground">Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="text-xs font-medium text-foreground">Working Days in a Year</span>
                <span className="text-muted-foreground mx-1">×</span>
                <span className="text-xs font-medium text-foreground">Hours Per Day</span>
              </div>
            </div>
          </div>
        );

      case 'working-hours':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-2 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-1.5">
              {/* Days Calculation */}
              <div className="text-center flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 text-xs">
                <span className="font-medium text-foreground">((52 weeks x 5 days)</span>
                <span className="text-muted-foreground">−</span>
                <span className="font-medium text-foreground">(Vacation</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-medium text-foreground">Holidays</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-medium text-foreground">Leave</span>
                <span className="text-muted-foreground">+</span>
                <span className="font-medium text-foreground">Training days))</span>
              </div>
              
              {/* Multiply by hours */}
              <div className="text-center flex items-center justify-center gap-x-1 text-xs">
                <span className="text-muted-foreground">×</span>
                <span className="font-medium text-foreground">Hours per Day</span>
              </div>
            </div>
          </div>
        );

      case 'billing-rate':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-2 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-1">
              {/* Numerator */}
              <div className="text-center py-1">
                <span className="text-xs font-medium text-foreground">Hourly Rate</span>
              </div>
              
              {/* Divider - 50% width */}
              <div className="w-1/2 border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="text-xs font-medium text-foreground">Utilization Rate</span>
              </div>
              
              {/* Example */}
              <div className="text-center pt-2 border-t border-border/30 mt-2 w-full">
                <div className="text-[10px] text-muted-foreground font-mono">
                  <span className="font-semibold">Example:</span> At 60% utilization, a $150/hr target requires billing $250/hr ($150 ÷ 0.60)
                </div>
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
