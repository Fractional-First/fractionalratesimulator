import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from './NumberInput';
import { InfoTooltip } from './InfoTooltip';
import { Settings, RotateCcw, ChevronDown, Globe } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';
import { countryOptions } from '@/utils/countryDefaults';

interface AssumptionsAccordionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

export const AssumptionsAccordion: React.FC<AssumptionsAccordionProps> = ({
  inputs,
  updateInput,
  selectedCountry,
  onCountryChange
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleResetToDefaults = () => {
    updateInput('overheadPct')(0.25);
    updateInput('hoursPerDay')(8);
    updateInput('vacationDays')(21);
    updateInput('publicHolidays')(15);
    updateInput('otherLeaveDays')(10);
    updateInput('trainingDays')(4);
    updateInput('nonBillablePct')(0.40);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Assumptions & Refinements (Default Settings)</h3>
              <p className="text-xs text-muted-foreground">Adjust calculation parameters</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="p-6 bg-card rounded-lg border border-border space-y-6">
          {/* Country Selector */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              Country Selection
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                Select your country to pre-fill overhead costs and working days
              </label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Values below can be manually adjusted as needed
              </p>
            </div>
          </div>

          {/* Segment 1: Overhead Benefit Costs (Numerator) */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Overhead Benefit Costs (Numerator components)
            </h4>
            <div className="grid gap-6">
              <NumberInput
              label={
                <div className="flex items-center gap-2">
                  Overhead Cost
                  <InfoTooltip content={
                    <>
                      Your <strong>business operating costs</strong> as a percentage of revenue. Includes health insurance, retirement contributions, taxes, and other benefits you'll pay as an independent contractor. Typically <strong>20-35%</strong>.
                    </>
                  } />
                </div>
              } 
              value={inputs.overheadPct || 0} 
              onChange={updateInput('overheadPct')} 
              min={0} 
              max={1} 
              step={0.05} 
              suffix="%" 
              helperText="Business overhead (0-100%)" 
            />
            </div>
          </div>

          {/* Segment 2: Number of Working Days per Annum (Denominator) */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">
              Number of Working Days per Annum (Denominator components)
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <NumberInput
              label={
                <div className="flex items-center gap-2">
                  Hours per Day
                  <InfoTooltip content={
                    <>
                      Your <strong>typical working hours</strong> per day when fully engaged. Most fractional leaders work <strong>6-8 hours</strong> per day to maintain effectiveness across multiple clients.
                    </>
                  } />
                </div>
              } 
              value={inputs.hoursPerDay || 0} 
              onChange={updateInput('hoursPerDay')} 
              min={1} 
              max={24} 
              helperText="Working hours per day" 
            />
            <NumberInput 
              label={
                <div className="flex items-center gap-2">
                  Vacation Days
                  <InfoTooltip content={
                    <>
                      <strong>Paid time off</strong> you plan to take annually. As a fractional leader, you control your schedule but should plan for rest and rejuvenation. Typical range is <strong>15-25 days</strong>.
                    </>
                  } />
                </div>
              } 
              value={inputs.vacationDays || 0} 
              onChange={updateInput('vacationDays')} 
              min={0} 
              max={365} 
              helperText="Annual vacation days" 
            />
            <NumberInput 
              label={
                <div className="flex items-center gap-2">
                  Public Holidays
                  <InfoTooltip content={
                    <>
                      <strong>National and local holidays</strong> when you typically don't work. In the US, this is usually <strong>10-15 days</strong> including major holidays like Christmas, New Year's, and Thanksgiving.
                    </>
                  } />
                </div>
              } 
              value={inputs.publicHolidays || 0} 
              onChange={updateInput('publicHolidays')} 
              min={0} 
              max={365} 
              helperText="Public holiday days" 
            />
            <NumberInput 
              label={
                <div className="flex items-center gap-2">
                  Other Leave Days
                  <InfoTooltip content={
                    <>
                      <strong>Sick days and personal leave</strong> you expect to take. Even healthy people should plan for <strong>5-15 days</strong> annually for illness, family emergencies, or personal matters.
                    </>
                  } />
                </div>
              } 
              value={inputs.otherLeaveDays || 0} 
              onChange={updateInput('otherLeaveDays')} 
              min={0} 
              max={365} 
              helperText="Sick/personal leave days" 
            />
            <NumberInput 
              label={
                <div className="flex items-center gap-2">
                  Training Days
                  <InfoTooltip content={
                    <>
                      <strong>Professional development time</strong> to stay current with industry trends and improve your skills. Successful fractional leaders invest <strong>3-10 days</strong> annually in learning and networking.
                    </>
                  } />
                </div>
              } 
              value={inputs.trainingDays || 0} 
              onChange={updateInput('trainingDays')} 
              min={0} 
              max={365} 
              helperText="Professional development days" 
            />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};