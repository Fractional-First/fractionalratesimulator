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
                <span className="sidebar-formula-text">Base Salary</span>
                <span className="sidebar-formula-text text-muted-foreground mx-1">+</span>
                <span className="sidebar-formula-text">Bonus</span>
                <span className="sidebar-formula-text text-muted-foreground mx-1">+</span>
                <span className="sidebar-formula-text">Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="sidebar-formula-text">Working Days in a Year</span>
                <span className="sidebar-formula-text text-muted-foreground mx-1">×</span>
                <span className="sidebar-formula-text">Hours Per Day</span>
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
                <span className="sidebar-formula-text">Base Salary</span>
                <span className="sidebar-formula-text text-muted-foreground">×</span>
                <span className="sidebar-formula-text">(1 + Overhead %)</span>
                <span className="sidebar-formula-text text-muted-foreground">+</span>
                <span className="sidebar-formula-text">Bonus</span>
                <span className="sidebar-formula-text text-muted-foreground">+</span>
                <span className="sidebar-formula-text">Equity</span>
              </div>
              
              {/* Divider */}
              <div className="w-full border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="sidebar-formula-text">Working Days in a Year</span>
                <span className="sidebar-formula-text text-muted-foreground mx-1">×</span>
                <span className="sidebar-formula-text">Hours Per Day</span>
              </div>
            </div>
          </div>
        );

      case 'working-hours':
        return (
          <div className={cn("bg-muted/40 rounded-lg p-2 border border-border/50", className)}>
            <div className="flex flex-col items-center space-y-1.5">
              {/* Days Calculation */}
              <div className="text-center flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
                <span className="sidebar-formula-text">((52 weeks x 5 days)</span>
                <span className="sidebar-formula-text text-muted-foreground">−</span>
                <span className="sidebar-formula-text">(Vacation</span>
                <span className="sidebar-formula-text text-muted-foreground">+</span>
                <span className="sidebar-formula-text">Holidays</span>
                <span className="sidebar-formula-text text-muted-foreground">+</span>
                <span className="sidebar-formula-text">Leave</span>
                <span className="sidebar-formula-text text-muted-foreground">+</span>
                <span className="sidebar-formula-text">Training days))</span>
              </div>
              
              {/* Multiply by hours */}
              <div className="text-center flex items-center justify-center gap-x-1">
                <span className="sidebar-formula-text text-muted-foreground">×</span>
                <span className="sidebar-formula-text">Hours per Day</span>
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
                <span className="sidebar-formula-text">Hourly Rate</span>
              </div>
              
              {/* Divider - 50% width */}
              <div className="w-1/2 border-t border-foreground/30" />
              
              {/* Denominator */}
              <div className="text-center py-1">
                <span className="sidebar-formula-text">Utilization Rate</span>
              </div>
              
              {/* Example */}
              <div className="text-center pt-2 border-t border-border/30 mt-2 w-full">
                <p className="sidebar-caption font-mono">
                  <span className="font-semibold">Example:</span> To earn $150/hr while working 60% of the time, you must bill the client $250/hr ($150 ÷ 0.60).
                </p>
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
