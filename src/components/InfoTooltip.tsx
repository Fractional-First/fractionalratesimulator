
import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface InfoTooltipProps {
  content: React.ReactNode;
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className={`inline-flex items-center justify-center ${className}`}>
          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help transition-colors" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs z-50">
        <div className="text-sm leading-relaxed">{content}</div>
      </TooltipContent>
    </Tooltip>
  );
};
