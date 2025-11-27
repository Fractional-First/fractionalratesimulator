import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { InfoTooltip } from './InfoTooltip';
import { Activity, ChevronDown } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';
import { formatCurrencyDecimal } from '@/utils/calculator';
import { NumberInput } from './NumberInput';

interface UtilizationRateSectionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
}

export const UtilizationRateSection: React.FC<UtilizationRateSectionProps> = ({
  inputs,
  updateInput
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Detailed breakdown of non-billable time
  const [projectWork, setProjectWork] = React.useState(50); // Default 50%
  const [businessDev, setBusinessDev] = React.useState(20); // Default placeholder
  const [invoicingFinance, setInvoicingFinance] = React.useState(15); // Default placeholder
  const [adminNetworking, setAdminNetworking] = React.useState(15); // Default placeholder

  // Calculate total and update parent
  const totalPercentage = projectWork + businessDev + invoicingFinance + adminNetworking;
  const utilizationRate = projectWork / 100;
  
  React.useEffect(() => {
    const newNonBillable = 1 - utilizationRate;
    updateInput('nonBillablePct')(newNonBillable);
  }, [projectWork, utilizationRate]);

  // Calculate rates for display
  const calculateRate = (utilization: number) => {
    const workingDays = 52*5 - (
      (inputs.vacationDays || 21) + 
      (inputs.publicHolidays || 15) + 
      (inputs.otherLeaveDays || 10) + 
      (inputs.trainingDays || 4)
    );
    const totalComp = (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0);
    const annualCost = totalComp * (1 + (inputs.overheadPct || 0.25));
    const nominalHourly = annualCost / (Math.max(1, workingDays) * (inputs.hoursPerDay || 8));
    return nominalHourly / utilization; // Billing rate needed
  };

  const billingRate = calculateRate(utilizationRate);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Utilization Rate</h3>
              <p className="text-xs text-muted-foreground">Break down billable vs. non-billable hours</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="p-6 bg-card rounded-lg border border-border space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Allocate your working time across these categories. Your billing rate adjusts based on billable hours.
            </p>

            {/* Detailed Time Allocation */}
            <div className="space-y-4">
              <NumberInput
                label={
                  <div className="flex items-center gap-2">
                    Project Work (Billable Time)
                    <InfoTooltip content={
                      <>
                        The <strong>percentage of your working hours</strong> that are directly billable to clients. This is the time you can invoice.
                      </>
                    } />
                  </div>
                }
                value={projectWork}
                onChange={(val) => setProjectWork(val)}
                min={0}
                max={100}
                step={5}
                suffix="%"
                helperText="Time spent on client billable work"
              />

              <NumberInput
                label={
                  <div className="flex items-center gap-2">
                    Business Development
                    <InfoTooltip content={
                      <>
                        Time spent on <strong>sales, proposals, and winning new clients</strong>. Essential but not directly billable.
                      </>
                    } />
                  </div>
                }
                value={businessDev}
                onChange={(val) => setBusinessDev(val)}
                min={0}
                max={100}
                step={5}
                suffix="%"
                helperText="Sales, proposals, networking for new clients"
                className="[&_input]:placeholder:text-muted-foreground/50"
              />

              <NumberInput
                label={
                  <div className="flex items-center gap-2">
                    Invoicing & Finances
                    <InfoTooltip content={
                      <>
                        Time for <strong>billing, accounting, and financial management</strong>. Necessary overhead for running your business.
                      </>
                    } />
                  </div>
                }
                value={invoicingFinance}
                onChange={(val) => setInvoicingFinance(val)}
                min={0}
                max={100}
                step={5}
                suffix="%"
                helperText="Billing, accounting, financial admin"
                className="[&_input]:placeholder:text-muted-foreground/50"
              />

              <NumberInput
                label={
                  <div className="flex items-center gap-2">
                    Administration & Networking
                    <InfoTooltip content={
                      <>
                        Time for <strong>general admin, professional networking, and relationship building</strong>. Builds your pipeline but isn't billable.
                      </>
                    } />
                  </div>
                }
                value={adminNetworking}
                onChange={(val) => setAdminNetworking(val)}
                min={0}
                max={100}
                step={5}
                suffix="%"
                helperText="Admin tasks, networking, relationship building"
                className="[&_input]:placeholder:text-muted-foreground/50"
              />

              {/* Total Percentage Display */}
              <div className={`p-3 rounded-lg border ${totalPercentage === 100 ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/20'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total Allocation:</span>
                  <span className={`text-lg font-bold ${totalPercentage === 100 ? 'text-primary' : 'text-destructive'}`}>
                    {totalPercentage}%
                  </span>
                </div>
                {totalPercentage !== 100 && (
                  <p className="text-xs text-destructive mt-1">
                    Total should equal 100%. Current difference: {100 - totalPercentage > 0 ? '+' : ''}{100 - totalPercentage}%
                  </p>
                )}
              </div>
            </div>

            {/* Billing Rate */}
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  Billing Rate
                  <InfoTooltip content={
                    <>
                      The <strong>hourly rate you must charge</strong> clients to achieve your effective rate, given your {projectWork}% billable time allocation.
                    </>
                  } />
                </label>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrencyDecimal(billingRate)}
                  <span className="text-sm font-normal text-muted-foreground">/hr</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Book this rate with {projectWork}% utilization to achieve your target compensation
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Understanding Time Allocation</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Billable hours:</strong> Time directly spent on client work that you can invoice</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Non-billable time:</strong> Essential activities that don't generate direct revenue</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Realistic planning:</strong> Most fractional leaders achieve 50-70% billable time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};