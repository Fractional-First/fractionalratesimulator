import React from 'react';
import { Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type JourneyStage, type StageStatus } from './JourneyContainer';

interface JourneyProgressProps {
  currentStage: JourneyStage;
  stageStatus: Record<JourneyStage, StageStatus>;
  onStageClick: (stage: JourneyStage) => void;
}

const stages: { id: JourneyStage; label: string; number: number }[] = [
  { id: 'foundation', label: 'Your Worth', number: 1 },
  { id: 'reality', label: 'Reality Check', number: 2 },
  { id: 'refinements', label: 'Fine Print', number: 3 },
  { id: 'solution', label: 'Path Forward', number: 4 },
];

export const JourneyProgress: React.FC<JourneyProgressProps> = ({
  currentStage,
  stageStatus,
  onStageClick,
}) => {
  return (
    <div className="w-full">
      {/* Desktop: Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {stages.map((stage, index) => {
          const status = stageStatus[stage.id];
          const isActive = currentStage === stage.id;
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';
          const isClickable = !isLocked && !isActive;

          return (
            <React.Fragment key={stage.id}>
              {/* Stage Circle */}
              <button
                onClick={() => isClickable && onStageClick(stage.id)}
                disabled={isLocked || isActive}
                className={cn(
                  "flex items-center gap-3 transition-all duration-200",
                  isClickable && "cursor-pointer hover:scale-105",
                  (isLocked || isActive) && "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    isActive && "border-primary bg-primary text-primary-foreground shadow-lg scale-110",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isLocked && "border-muted bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-bold">{stage.number}</span>
                  )}
                </div>
                <div className="text-left">
                  <div
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive && "text-primary",
                      isCompleted && "text-foreground",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    Stage {stage.number}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      isActive && "text-foreground",
                      isCompleted && "text-foreground",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    {stage.label}
                  </div>
                </div>
              </button>

              {/* Connecting Line */}
              {index < stages.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-border relative">
                  <div
                    className={cn(
                      "absolute inset-0 bg-primary transition-all duration-500",
                      stageStatus[stages[index + 1].id] !== 'locked' ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: Compact Dots */}
      <div className="flex md:hidden items-center justify-center gap-2">
        {stages.map((stage) => {
          const status = stageStatus[stage.id];
          const isActive = currentStage === stage.id;
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          return (
            <button
              key={stage.id}
              onClick={() => !isLocked && !isActive && onStageClick(stage.id)}
              disabled={isLocked || isActive}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200",
                isActive && "border-primary bg-primary text-primary-foreground scale-125",
                isCompleted && "border-primary bg-primary text-primary-foreground",
                isLocked && "border-muted bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : isLocked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <span className="text-xs font-bold">{stage.number}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
