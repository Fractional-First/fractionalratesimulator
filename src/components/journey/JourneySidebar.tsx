import React from 'react';
import { DollarSign, Settings, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormulaVisual, FormulaType } from './FormulaVisual';

export type SegmentType = 'establishing-rate' | 'assumptions' | 'utilization' | 'path-forward';

interface SegmentContent {
  title: string;
  description: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  definitions?: Array<{
    term: string;
    definition: string;
    formulaType?: FormulaType;
  }>;
}

const segmentContent: Record<SegmentType, SegmentContent> = {
  'establishing-rate': {
    title: 'Establishing Your Rate',
    description: 'We start with a (rather arbitrary) anchor: A full-time compensation package you may have earned or may consider to be reflective of your earning power.',
    icon: DollarSign,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    definitions: [
      {
        term: 'Take-home Rate',
        definition: 'Your total earnings divided by the number of hours worked across the same period.'
      },
      {
        term: 'Formula',
        definition: '',
        formulaType: 'take-home-rate'
      },
      {
        term: 'Fully Loaded Rate',
        definition: 'This is an estimate of cash compensation plus all other benefits, perks, equipment, and statutory rewards an employee receives per hour.'
      },
      {
        term: 'Formula',
        definition: '',
        formulaType: 'fully-loaded-rate'
      }
    ]
  },
  'assumptions': {
    title: 'Assumptions & Refinements',
    description: 'We reveal estimated "overhead" costs in your market to demonstrate the fully loaded costs, including benefits, perks, equipment, etc., that your employer would pay to retain you. This number could also be interpreted as your full-time compensation.',
    icon: Settings,
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-500/10',
    definitions: [
      {
        term: 'Overhead Cost Impact',
        definition: 'Overhead % represents additional costs beyond direct compensation (benefits, equipment, office space, etc.)'
      },
      {
        term: 'Working Hours Calculation',
        definition: '',
        formulaType: 'working-hours'
      }
    ]
  },
  'utilization': {
    title: 'Understanding Utilization',
    description: 'We also reveal the effects of utilization rates (the proportion of your time spent on billable hours) on your effective hourly rate.',
    icon: PieChart,
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-500/10',
    definitions: [
      {
        term: 'Utilization Rate (%)',
        definition: 'The percentage of your available working hours that you spend on billable work.'
      },
      {
        term: 'Billing Rate',
        definition: 'Billing Rate needed to achieve target compensation'
      },
      {
        term: 'Formula',
        definition: '',
        formulaType: 'billing-rate'
      },
      {
        term: 'Example',
        definition: 'At 60% utilization, a $150/hr target requires billing $250/hr ($150 ÷ 0.60)'
      },
      {
        term: "What's a Realistic Utilization Rate?",
        definition: ''
      },
      {
        term: '40–60%',
        definition: 'Acceptable for new fractional leaders'
      },
      {
        term: '60–70%',
        definition: 'Good utilization rate'
      },
      {
        term: '70–85%',
        definition: 'Great utilization rate'
      },
      {
        term: '85%+',
        definition: "It depends—excellent if you've outsourced pipeline development, but risky if pipeline development is neglected"
      }
    ]
  },
  'path-forward': {
    title: 'Your Path Forward',
    description: 'Based on your inputs, we help you understand what comes next in building a sustainable fractional practice.',
    icon: ArrowRight,
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-500/10'
  }
};

interface JourneySidebarProps {
  activeSegment: SegmentType;
}

export const JourneySidebar: React.FC<JourneySidebarProps> = ({ activeSegment }) => {
  const content = segmentContent[activeSegment];
  const Icon = content.icon;

  return (
    <div className="p-4 bg-muted/30 border border-border rounded-xl animate-fade-in max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", content.bgClass)}>
        <Icon className={cn("w-5 h-5", content.colorClass)} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {content.description}
      </p>

      {/* Definitions - if available */}
      {content.definitions && content.definitions.length > 0 && (
        <div className="mt-3 space-y-2">
          {content.definitions.map((def, index) => (
            <div key={index} className="text-xs">
              {def.definition === '' && !def.formulaType ? (
                // Section header (no definition text, no formula)
                <h4 className="font-semibold text-foreground mt-3 mb-1.5 text-sm">
                  {def.term}
                </h4>
              ) : def.formulaType ? (
                // Formula visualization
                <>
                  <dt className="font-semibold text-foreground mb-1.5 text-xs">
                    {def.term}
                  </dt>
                  <FormulaVisual type={def.formulaType} />
                </>
              ) : (
                // Regular definition
                <>
                  <dt className="font-semibold text-foreground mb-0.5 text-xs">
                    {def.term}
                  </dt>
                  <dd className={cn(
                    "text-muted-foreground leading-relaxed text-xs",
                    def.term === 'Example' ? "font-mono text-[10px] bg-muted/50 p-1.5 rounded border border-border" : ""
                  )}>
                    {def.definition}
                  </dd>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
