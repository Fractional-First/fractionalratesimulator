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
        definition: 'Your total earnings divided by the number of hours worked across the same period. This is Total earnings / Total billable + nonbillable hours worked.'
      },
      {
        term: 'Fully Loaded Rate',
        definition: 'This is an estimate of cash compensation plus all other benefits, perks, equipment, and statutory rewards an employee receives per hour. This is computed by dividing the fully loaded costs - usually expressed as a certain % above-and-beyond the cash compensation - by the number of hours worked in a year.'
      }
    ]
  },
  'assumptions': {
    title: 'Assumptions & Refinements',
    description: 'We reveal estimated "overhead" costs in your market to demonstrate the fully loaded costs, including benefits, perks, equipment, etc., that your employer would pay to retain you. This number could also be interpreted as your full-time compensation.',
    icon: Settings,
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-500/10'
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
        definition: 'The rate you (as a fractional leader) charge per hour/day, whether it\'s explicit or whether it\'s implicit as part of a package. In the case where it\'s implicit, it may not even be visible to the client.'
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
              <dt className="font-semibold text-foreground mb-1">
                {def.term}
              </dt>
              <dd className="text-muted-foreground leading-relaxed">
                {def.definition}
              </dd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
