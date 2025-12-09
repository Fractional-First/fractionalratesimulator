import React from 'react';
import { DollarSign, Settings, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormulaVisual, FormulaType } from './FormulaVisual';

export type SegmentType = 'establishing-rate' | 'assumptions' | 'utilization' | 'path-forward';

interface SegmentContent {
  title: string;
  description: string;
  goal?: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  definitions?: Array<{
    term: string;
    definition: string;
    formulaType?: FormulaType;
    tableData?: Array<{ range: string; description: string }>;
  }>;
}

const segmentContent: Record<SegmentType, SegmentContent> = {
  'establishing-rate': {
    title: 'Benchmarking Your Rate',
    goal: 'We aren\'t here to dictate your market price or hand you a single "magic number." Instead, this tool provides a directional stress-test for your business model. Use it to explore the financial mechanics of your next chapter and see how the right pricing strategy unlocks long-term freedom.',
    description: 'We start by anchoring to the market value of a full-time role. This allows us to calculate your Price Anchor — the true economic cost a company pays for your expertise before you even send your first invoice.',
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
        term: 'Overhead Cost',
        definition: 'Overhead % represents additional costs beyond direct compensation (benefits, equipment, office space, etc.)'
      },
      {
        term: 'Annual Working Hours',
        definition: 'Total working hours available per year after accounting for vacation, holidays, and other leave.'
      },
      {
        term: 'Formula',
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
        term: "What's a Realistic Utilization Rate?",
        definition: '',
        tableData: [
          { range: '40–60%', description: 'Acceptable for new fractional leaders' },
          { range: '60–70%', description: 'Good utilization rate' },
          { range: '70–85%', description: 'Great utilization rate' },
          { range: '85%+', description: "It depends—excellent if you've outsourced pipeline development, but risky if pipeline development is neglected" }
        ]
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
    <div className="p-4 bg-muted/30 border border-border rounded-xl max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div key={activeSegment} className="animate-fade-in">
        {/* Goal - shown above title if present */}
        {content.goal && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            <strong>The Goal:</strong> {content.goal}
          </p>
        )}

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
                {def.definition === '' && !def.formulaType && !def.tableData ? (
                  // Section header (no definition text, no formula, no table)
                  <h4 className="font-semibold text-foreground mt-3 mb-1.5 text-sm">
                    {def.term}
                  </h4>
                ) : def.formulaType ? (
                  // Formula visualization - no label, just the visual
                  <div className="mt-1.5">
                    <FormulaVisual type={def.formulaType} />
                  </div>
                ) : def.tableData ? (
                  // Table display
                  <div className="mt-1.5">
                    <h4 className="font-semibold text-foreground mb-2 text-sm">
                      {def.term}
                    </h4>
                    <div className="overflow-hidden rounded-md border border-border">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="px-2 py-1.5 text-left font-semibold text-foreground">Rate</th>
                            <th className="px-2 py-1.5 text-left font-semibold text-foreground">Assessment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {def.tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={cn(
                              "border-b border-border last:border-0",
                              rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30"
                            )}>
                              <td className="px-2 py-1.5 font-medium text-foreground whitespace-nowrap">{row.range}</td>
                              <td className="px-2 py-1.5 text-muted-foreground leading-relaxed">{row.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
    </div>
  );
};
