import React from 'react';
import { Check, Lock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type StageStatus } from './JourneyContainer';

interface JourneyStageProps {
  stageNumber: number;
  title: string;
  subtitle: string;
  status: StageStatus;
  isActive: boolean;
  children: React.ReactNode;
  onEdit?: () => void;
}

export const JourneyStage: React.FC<JourneyStageProps> = ({
  stageNumber,
  title,
  subtitle,
  status,
  isActive,
  children,
  onEdit,
}) => {
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 transition-all duration-300",
        isActive && "border-primary shadow-lg",
        isCompleted && "border-border bg-muted/30",
        isLocked && "border-border bg-muted/10 opacity-60"
      )}
    >
      {/* Stage Header */}
      <div
        className={cn(
          "p-6 cursor-pointer transition-colors",
          isActive && "bg-primary/5",
          isCompleted && "hover:bg-muted/50",
          !isActive && !isLocked && onEdit && "hover:bg-muted/30"
        )}
        onClick={() => {
          if (isCompleted && onEdit) {
            onEdit();
          }
        }}
      >
        <div className="flex items-start gap-4">
          {/* Stage Icon */}
          <div
            className={cn(
              "flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all",
              isActive && "border-primary bg-primary text-primary-foreground",
              isCompleted && "border-primary bg-primary text-primary-foreground",
              isLocked && "border-muted bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <Check className="w-6 h-6" />
            ) : isLocked ? (
              <Lock className="w-5 h-5" />
            ) : (
              <span className="text-xl font-bold">{stageNumber}</span>
            )}
          </div>

          {/* Stage Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              {isCompleted && (
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full whitespace-nowrap">
                  Completed ✓
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {/* Expand/Collapse Indicator */}
          {isCompleted && !isActive && (
            <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 rotate-180" />
          )}
        </div>
      </div>

      {/* Stage Content */}
      {(isActive || !isCompleted) && (
        <div
          className={cn(
            "px-6 pb-6 animate-fade-in",
            isLocked && "pointer-events-none"
          )}
        >
          {children}
        </div>
      )}

      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl">
          <div className="text-center p-6">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              Complete previous stages to unlock
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
