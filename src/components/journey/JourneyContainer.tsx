import React, { useState, useEffect, useRef } from 'react';
import { type Inputs, compute } from '@/utils/calculator';
import { JourneyProgress } from './JourneyProgress';
import { JourneySidebar } from './JourneySidebar';
import { Stage1Foundation } from './stages/Stage1Foundation';
import { Stage2RealityCheck } from './stages/Stage2RealityCheck';
import { Stage4Solution } from './stages/Stage4Solution';

export type JourneyStage = 'foundation' | 'reality' | 'solution';
export type StageStatus = 'locked' | 'active' | 'completed';

interface JourneyState {
  currentStage: JourneyStage;
  stageStatus: Record<JourneyStage, StageStatus>;
  inputs: Inputs;
  visitedStages: Set<JourneyStage>;
}

const STORAGE_KEY = 'fractional-journey-state';

export const JourneyContainer: React.FC = () => {
  const foundationRef = useRef<HTMLDivElement>(null);
  const realityRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  
  // Refs for segment detection
  const establishingRateRef = useRef<HTMLDivElement>(null);
  const assumptionsRef = useRef<HTMLDivElement>(null);
  const utilizationRef = useRef<HTMLDivElement>(null);
  const pathForwardRef = useRef<HTMLDivElement>(null);
  
  const [activeSegment, setActiveSegment] = useState<'establishing-rate' | 'assumptions' | 'utilization' | 'path-forward'>('establishing-rate');
  
  // Track all intersecting segments with their intersection data
  const intersectingSegmentsRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());
  
  // Track scroll direction for better segment detection
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');
  
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

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirectionRef.current = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
      lastScrollYRef.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for segment detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -40% 0px', // Wider active zone (50% instead of 25%)
      threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) // 0, 0.05, 0.1, ... 1.0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Update the map of intersecting segments
      entries.forEach((entry) => {
        const segmentId = entry.target.getAttribute('data-segment');
        if (!segmentId) return;
        
        if (entry.isIntersecting) {
          intersectingSegmentsRef.current.set(segmentId, entry);
        } else {
          intersectingSegmentsRef.current.delete(segmentId);
        }
      });
      
      // Determine which segment should be active
      if (intersectingSegmentsRef.current.size > 0) {
        const segmentOrder = ['establishing-rate', 'assumptions', 'utilization', 'path-forward'];
        const scrollDirection = scrollDirectionRef.current;
        
        // Find the best segment based on position, visibility, and scroll direction
        let bestSegment: string | null = null;
        let bestScore = -Infinity;
        
        intersectingSegmentsRef.current.forEach((entry, segmentId) => {
          const rect = entry.boundingClientRect;
          const intersectionRatio = entry.intersectionRatio;
          
          // Calculate distance from ideal viewing position
          const idealTop = 150;
          const distanceFromIdeal = Math.abs(rect.top - idealTop);
          
          // Base scores
          const positionScore = Math.max(0, 500 - distanceFromIdeal);
          const visibilityScore = intersectionRatio * 1000;
          
          // Priority system: when scrolling down, later segments should strongly override earlier ones
          const orderIndex = segmentOrder.indexOf(segmentId);
          let directionBonus = 0;
          
          if (orderIndex >= 0) {
            // When scrolling down, aggressively favor later segments to prevent jumping back
            if (scrollDirection === 'down') {
              directionBonus = orderIndex * 500; // Much stronger bonus for later segments
            } else {
              // When scrolling up, favor earlier segments but less aggressively
              directionBonus = (segmentOrder.length - orderIndex) * 200;
            }
          }
          
          // Special handling: if assumptions is visible and we're past the rate cards, 
          // assumptions should always win over establishing-rate
          if (segmentId === 'assumptions' && intersectingSegmentsRef.current.has('establishing-rate')) {
            const assumptionsRect = entry.boundingClientRect;
            // If assumptions section is meaningfully visible (not just sticky cards), boost it heavily
            if (assumptionsRect.height > 100 && intersectionRatio > 0.1) {
              directionBonus += 2000; // Massive boost to ensure it takes priority
            }
          }
          
          const totalScore = positionScore + visibilityScore + directionBonus;
          
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestSegment = segmentId;
          }
        });
        
        if (bestSegment) {
          setActiveSegment(bestSegment as 'establishing-rate' | 'assumptions' | 'utilization' | 'path-forward');
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const refs = [
      { ref: establishingRateRef, id: 'establishing-rate' },
      { ref: assumptionsRef, id: 'assumptions' },
      { ref: utilizationRef, id: 'utilization' },
      { ref: pathForwardRef, id: 'path-forward' }
    ];

    refs.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

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

    // Scroll to the appropriate stage when navigating, accounting for sticky header
    setTimeout(() => {
      const stageRefs = {
        foundation: foundationRef,
        reality: realityRef,
        solution: solutionRef
      };
      
      const targetRef = stageRefs[stage]?.current;
      if (targetRef) {
        const headerOffset = 100; // Height of sticky header + some padding
        const elementPosition = targetRef.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const completeStage = (stage: JourneyStage) => {
    setJourneyState(prev => {
      const newStatus = { ...prev.stageStatus };
      newStatus[stage] = 'completed';
      
      // Unlock next stage
      const stages: JourneyStage[] = ['foundation', 'reality', 'solution'];
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
          <div className="flex-1 space-y-6 lg:max-w-3xl">
            {/* Disclaimer */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <strong>Note:</strong> Your results are only as good as your inputs. This calculator provides estimates based on the data you provide.
              </p>
            </div>

      <div ref={foundationRef}>
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
          establishingRateRef={establishingRateRef}
          assumptionsRef={assumptionsRef}
        />
      </div>

            <div ref={realityRef}>
              <Stage2RealityCheck
                isActive={journeyState.currentStage === 'reality'}
                status={journeyState.stageStatus.reality}
                inputs={journeyState.inputs}
                results={results}
                updateInput={updateInput}
                onComplete={() => {
                  completeStage('reality');
                  goToStage('solution');
                }}
                onEdit={() => goToStage('reality')}
                utilizationRef={utilizationRef}
              />
            </div>

            <div ref={solutionRef}>
              <Stage4Solution
                isActive={journeyState.currentStage === 'solution'}
                status={journeyState.stageStatus.solution}
                inputs={journeyState.inputs}
                results={results}
                onEditStage={goToStage}
                onReset={resetJourney}
                pathForwardRef={pathForwardRef}
              />
            </div>
          </div>

          {/* Right: Contextual Sidebar */}
          <div className="hidden lg:block lg:w-96 xl:w-[28rem]">
            <div className="sticky top-24">
              <JourneySidebar activeSegment={activeSegment} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
