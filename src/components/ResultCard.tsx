
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  title: React.ReactNode;
  value: string;
  formula?: string;
  highlight?: boolean;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  formula,
  highlight = false,
  className
}) => {
  return (
    <Card className={cn(
      "p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-fade-in border-border",
      highlight 
        ? "teal-gradient text-white shadow-md" 
        : "section-bg hover:bg-card",
      className
    )}>
      <div className="space-y-3">
        <h4 className={cn(
          "text-sm font-medium caption",
          highlight ? "text-white/90" : "text-muted-foreground"
        )}>
          {title}
        </h4>
        <div className={cn(
          "text-2xl md:text-3xl font-bold",
          highlight ? "text-white" : "text-foreground"
        )}>
          {value}
        </div>
        {formula && (
          <p className={cn(
            "text-xs caption leading-relaxed",
            highlight ? "text-white/80" : "formula-text"
          )}>
            {formula}
          </p>
        )}
      </div>
    </Card>
  );
};
