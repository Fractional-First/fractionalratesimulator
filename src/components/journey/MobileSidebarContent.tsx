import React from 'react';
import { DollarSign, Settings, PieChart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormulaVisual, FormulaType } from './FormulaVisual';
import { type SegmentType } from './JourneySidebar';

interface SegmentContent {
  title: string;
  description: string | string[];
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
    description: "We start by anchoring to the market value of a full-time role. This allows us to calculate your Price Anchor — the true economic cost a company pays for your expertise before you even send your first invoice.",
    icon: DollarSign,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    definitions: [
      {
        term: 'Cash-Equivalent Rate',
        definition: 'This is the simple hourly translation of your paycheck — your total earnings divided by the number of hours worked annually. This represents your earnings as an employee, but it ignores the added costs you absorb as a solopreneur.'
      },
      {
        term: 'Formula',
        definition: '',
        formulaType: 'take-home-rate'
      },
      {
        term: 'Equivalent Cash + Benefits Compensation Rate',
        definition: 'This is the total cost a company actually incurs to employ you — your total earnings divided by the number of hours worked annually. This accounts for benefits, taxes, insurance, and equipment. As a fractional leader, you must cover these costs yourself.'
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
        definition: 'Employers typically pay an extra % on top of salary for insurance, taxes, and benefits. As a Fractional Leader, you need to bake this into your rate.'
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
    description: 'Your billable hours must cover your non-billable time. As utilization drops, your hourly rate must rise to maintain the same income.',
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
        definition: 'The billing rate needed to achieve your target compensation.'
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
          { range: '40–60%', description: 'Ramp-up Phase: Normal for leaders building their initial pipeline.' },
          { range: '60–70%', description: 'The Sweet Spot: Sustainable balance between delivery and growth.' },
          { range: '70–85%', description: 'High Efficiency: Strong revenue, with little room for error.' },
          { range: '85%+', description: 'It depends — sustainable only if you outsource your business development.' }
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

interface MobileSidebarContentProps {
  segment: SegmentType;
  className?: string;
}

export const MobileSidebarContent: React.FC<MobileSidebarContentProps> = ({ segment, className }) => {
  const content = segmentContent[segment];
  const Icon = content.icon;

  return (
    <div className={cn("lg:hidden p-4 bg-muted/30 border border-border rounded-xl mb-6", className)}>
      {/* Goal - shown above title if present */}
      {content.goal && (
        <p className="sidebar-body mb-5">
          <strong className="text-foreground">The Goal:</strong> {content.goal}
        </p>
      )}

      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", content.bgClass)}>
        <Icon className={cn("w-5 h-5", content.colorClass)} />
      </div>

      {/* Title */}
      <h3 className="sidebar-title mb-3">
        {content.title}
      </h3>

      {/* Description */}
      {Array.isArray(content.description) ? (
        <div className="space-y-4">
          {content.description.map((paragraph, index) => (
            <p key={index} className="sidebar-body">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="sidebar-body">
          {content.description}
        </p>
      )}

      {/* Definitions - if available */}
      {content.definitions && content.definitions.length > 0 && (
        <div className="mt-5 space-y-4">
          {content.definitions.map((def, index) => (
            <div key={index} className={cn(
              def.term === 'Equivalent Cash + Benefits Compensation Rate' && 'mt-6'
            )}>
              {def.definition === '' && !def.formulaType && !def.tableData ? (
                // Section header (no definition text, no formula, no table)
                <h4 className="sidebar-section-header mt-3 mb-1.5">
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
                  <h4 className="sidebar-section-header mb-2">
                    {def.term}
                  </h4>
                  <div className="overflow-hidden rounded-md border border-border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="sidebar-table-header px-2 py-1.5">Rate</th>
                          <th className="sidebar-table-header px-2 py-1.5">Assessment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {def.tableData.map((row, rowIndex) => (
                          <tr key={rowIndex} className={cn(
                            "border-b border-border last:border-0",
                            rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30"
                          )}>
                            <td className="sidebar-term px-2 py-1.5 whitespace-nowrap">{row.range}</td>
                            <td className="sidebar-body px-2 py-1.5">{row.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Regular definition
                <>
                  <dt className="sidebar-term mb-0.5">
                    {def.term}
                  </dt>
                  <dd className={cn(
                    "sidebar-body",
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
