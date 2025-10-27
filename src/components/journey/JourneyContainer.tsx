import React, { useState, useEffect } from 'react';
import { type Inputs, compute } from '@/utils/calculator';
import { JourneyProgress } from './JourneyProgress';
import { Stage1Foundation } from './stages/Stage1Foundation';
import { Stage2RealityCheck } from './stages/Stage2RealityCheck';
import { Stage3Refinements } from './stages/Stage3Refinements';
import { Stage4Solution } from './stages/Stage4Solution';
import { LiveResultsPanel } from './LiveResultsPanel';

export type JourneyStage = 'foundation' | 'reality' | 'refinements' | 'solution';
export type StageStatus = 'locked' | 'active' | 'completed';

interface JourneyState {
  currentStage: JourneyStage;
  stageStatus: Record<JourneyStage, StageStatus>;
  inputs: Inputs;
  visitedStages: Set<JourneyStage>;
}

const STORAGE_KEY = 'fractional-journey-state';

export const JourneyContainer: React.FC = () => {
  const [journeyState, setJourneyState] = useState<JourneyState>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          visitedStages: new Set(parsed.visitedStages || ['foundation'])
        };
      } catch {
        // Fall through to default
      }
    }
    
    return {
      currentStage: 'foundation',
      stageStatus: {
        foundation: 'active',
        reality: 'locked',
        refinements: 'locked',
        solution: 'locked'
      },
      inputs: {},
      visitedStages: new Set(['foundation'])
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    const toStore = {
      ...journeyState,
      visitedStages: Array.from(journeyState.visitedStages)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [journeyState]);

  const updateInput = (field: keyof Inputs) => (value: number) => {
    setJourneyState(prev => ({
      ...prev,
      inputs: { ...prev.inputs, [field]: value }
    }));
  };

  const goToStage = (stage: JourneyStage) => {
    setJourneyState(prev => {
      const newVisited = new Set(prev.visitedStages);
      newVisited.add(stage);
      
      return {
        ...prev,
        currentStage: stage,
        visitedStages: newVisited
      };
    });
  };

  const completeStage = (stage: JourneyStage) => {
    setJourneyState(prev => {
      const newStatus = { ...prev.stageStatus };
      newStatus[stage] = 'completed';
      
      // Unlock next stage
      const stages: JourneyStage[] = ['foundation', 'reality', 'refinements', 'solution'];
      const currentIndex = stages.indexOf(stage);
      if (currentIndex < stages.length - 1) {
        const nextStage = stages[currentIndex + 1];
        if (newStatus[nextStage] === 'locked') {
          newStatus[nextStage] = 'active';
        }
      }
      
      return {
        ...prev,
        stageStatus: newStatus
      };
    });
  };

  const unlockAllStages = () => {
    setJourneyState(prev => ({
      ...prev,
      stageStatus: {
        foundation: prev.stageStatus.foundation,
        reality: 'active',
        refinements: 'active',
        solution: 'active'
      }
    }));
  };

  const resetJourney = () => {
    setJourneyState({
      currentStage: 'foundation',
      stageStatus: {
        foundation: 'active',
        reality: 'locked',
        refinements: 'locked',
        solution: 'locked'
      },
      inputs: {},
      visitedStages: new Set(['foundation'])
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const results = compute(journeyState.inputs);
  const hasFoundationInputs = (journeyState.inputs.baseSalary || 0) > 0 || 
                               (journeyState.inputs.fractionalHourlyInput || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <JourneyProgress
            currentStage={journeyState.currentStage}
            stageStatus={journeyState.stageStatus}
            onStageClick={goToStage}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Journey Stages */}
          <div className="flex-1 space-y-6">
            {/* Disclaimer */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> Your results are only as good as your inputs. This calculator provides estimates based on the data you provide.
              </p>
            </div>

      <Stage1Foundation
        isActive={journeyState.currentStage === 'foundation'}
        status={journeyState.stageStatus.foundation}
        inputs={journeyState.inputs}
        results={results}
        updateInput={updateInput}
        onComplete={() => {
          completeStage('foundation');
          goToStage('reality');
        }}
        onEdit={() => goToStage('foundation')}
      />

            <Stage2RealityCheck
              isActive={journeyState.currentStage === 'reality'}
              status={journeyState.stageStatus.reality}
              inputs={journeyState.inputs}
              results={results}
              updateInput={updateInput}
              onComplete={() => {
                completeStage('reality');
                goToStage('refinements');
              }}
              onEdit={() => goToStage('reality')}
              onSkip={() => {
                unlockAllStages();
                goToStage('solution');
              }}
            />

            <Stage3Refinements
              isActive={journeyState.currentStage === 'refinements'}
              status={journeyState.stageStatus.refinements}
              inputs={journeyState.inputs}
              updateInput={updateInput}
              onComplete={() => {
                completeStage('refinements');
                goToStage('solution');
              }}
              onEdit={() => goToStage('refinements')}
            />

            <Stage4Solution
              isActive={journeyState.currentStage === 'solution'}
              status={journeyState.stageStatus.solution}
              inputs={journeyState.inputs}
              results={results}
              onEditStage={goToStage}
              onReset={resetJourney}
            />
          </div>

          {/* Right: Live Results Panel (Desktop) */}
          <div className="hidden lg:block lg:w-80 xl:w-96">
            <LiveResultsPanel
              inputs={journeyState.inputs}
              results={results}
              completedStages={Object.entries(journeyState.stageStatus)
                .filter(([_, status]) => status === 'completed')
                .map(([stage]) => stage as JourneyStage)}
              hasFoundationInputs={hasFoundationInputs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
