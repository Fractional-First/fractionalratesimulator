import React from 'react';
import { DollarSign, Settings, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        definition: '(Base Salary + Annual Bonus + Annual Equity) ÷ (Working Days × Hours Per Day)'
      },
      {
        term: 'Fully Loaded Rate',
        definition: 'This is an estimate of cash compensation plus all other benefits, perks, equipment, and statutory rewards an employee receives per hour.'
      },
      {
        term: 'Formula',
        definition: '(Base Salary × (1 + Overhead %) + Bonus + Equity) ÷ (Working Days × Hours Per Day)'
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
        definition: '(52 weeks × 5 days) - (Vacation + Holidays + Leave + Training Days) = Annual Working Days'
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
        term: 'Required Billing Rate',
        definition: 'Hourly Rate ÷ Utilization Rate = Billing Rate needed to achieve target compensation'
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
    <div className="p-6 bg-muted/30 border border-border rounded-xl animate-fade-in">
      {/* Icon */}
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", content.bgClass)}>
        <Icon className={cn("w-6 h-6", content.colorClass)} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {content.description}
      </p>

      {/* Definitions - if available */}
      {content.definitions && content.definitions.length > 0 && (
        <div className="mt-4 space-y-3">
          {content.definitions.map((def, index) => (
            <div key={index} className="text-sm">
              {def.definition === '' ? (
                // Section header (no definition text)
                <h4 className="font-semibold text-foreground mt-4 mb-2 text-base">
                  {def.term}
                </h4>
              ) : (
                <>
                  <dt className="font-semibold text-foreground mb-1">
                    {def.term}
                  </dt>
                  <dd className={cn(
                    "text-muted-foreground leading-relaxed",
                    def.term === 'Formula' || def.term === 'Example' ? "font-mono text-xs bg-muted/50 p-2 rounded border border-border" : ""
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
