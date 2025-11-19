import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from './NumberInput';
import { InfoTooltip } from './InfoTooltip';
import { Settings, RotateCcw, ChevronDown, Globe, DollarSign, Clock } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';
import { countryOptions } from '@/utils/countryDefaults';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
  
  // Calculate working hours per year dynamically
  const workingDaysPerYear = 52 * 5 - (
    (inputs.vacationDays || 0) + 
    (inputs.publicHolidays || 0) + 
    (inputs.otherLeaveDays || 0) + 
    (inputs.trainingDays || 0)
  );
  const workingHoursPerYear = workingDaysPerYear * (inputs.hoursPerDay || 8);
  
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
          <div className="space-y-4 pb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              Country Selection
            </div>
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground">Select your country to pre-fill overhead costs and working days.</label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {countryOptions.map(option => 
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two Column Summary - Overhead vs Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overhead Percentage Column */}
            <div className="p-5 bg-primary/5 rounded-xl border-2 border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Overhead Cost</h4>
                  <p className="text-xs text-muted-foreground">Benefits & employer costs</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {Math.round((inputs.overheadPct || 0.25) * 100)}%
              </div>
            </div>

            {/* Working Hours Column */}
            <div className="p-5 bg-purple-500/5 rounded-xl border-2 border-purple-500/20 md:translate-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Annual Working Hours</h4>
                  <p className="text-xs text-muted-foreground">Updates as you adjust below</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {workingHoursPerYear.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {workingDaysPerYear} days × {inputs.hoursPerDay || 8} hrs/day
              </p>
            </div>
          </div>

          {/* Two Column Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            {/* LEFT COLUMN - Overhead Parameters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <DollarSign className="h-4 w-4 text-primary" />
                Adjust Overhead Cost
              </div>
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                {/* Overhead Cost Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Overhead Cost</span>
                      <InfoTooltip content={
                        <>
                          The <strong>typical extra cost</strong> that a business in your country pays on top of an employee's salary to employ someone. This includes benefits, insurance, payroll taxes, and other overhead expenses. For example, if your target salary is $100,000 and overhead is 25%, the organization's total cost to employ you would be $125,000. This represents the <strong>necessary business expense</strong> for professional services and sets the foundation for understanding your fractional rate as a professional services charge. Typically <strong>20-35%</strong> depending on country and benefits package.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.overheadPct || 0.25}
                      onChange={updateInput('overheadPct')}
                      min={0}
                      max={1}
                      step={0.01}
                      suffix="%"
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {Math.round((inputs.overheadPct || 0.25) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Working Hours Parameters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Adjust Working Time
              </div>
              <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20 space-y-3">
                
                {/* Hours per Day Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Hours per Day</span>
                      <InfoTooltip content={
                        <>
                          Your <strong>typical working hours</strong> per day when fully engaged. Most fractional leaders work <strong>6-8 hours</strong> per day to maintain effectiveness across multiple clients.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.hoursPerDay || 8}
                      onChange={updateInput('hoursPerDay')}
                      min={1}
                      max={24}
                      step={0.5}
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {inputs.hoursPerDay || 8} hrs
                    </span>
                  </div>
                </div>

                {/* Vacation Days Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Vacation Days</span>
                      <InfoTooltip content={
                        <>
                          Annual <strong>paid vacation days</strong> you plan to take. In many countries, this is <strong>20-25 days</strong> per year, separate from public holidays.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.vacationDays || 21}
                      onChange={updateInput('vacationDays')}
                      min={0}
                      max={365}
                      step={1}
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {inputs.vacationDays || 21} days
                    </span>
                  </div>
                </div>

                {/* Public Holidays Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Public Holidays</span>
                      <InfoTooltip content={
                        <>
                          <strong>Official public holidays</strong> in your country. Typically <strong>10-15 days</strong> per year, varying by region and country.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.publicHolidays || 15}
                      onChange={updateInput('publicHolidays')}
                      min={0}
                      max={365}
                      step={1}
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {inputs.publicHolidays || 15} days
                    </span>
                  </div>
                </div>

                {/* Other Leave Days Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Other Leave Days</span>
                      <InfoTooltip content={
                        <>
                          <strong>Sick leave, personal days</strong>, and other unplanned time off. Budget <strong>5-10 days</strong> per year for health and personal matters.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.otherLeaveDays || 10}
                      onChange={updateInput('otherLeaveDays')}
                      min={0}
                      max={365}
                      step={1}
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {inputs.otherLeaveDays || 10} days
                    </span>
                  </div>
                </div>

                {/* Training Days Input */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm font-medium">Training Days</span>
                      <InfoTooltip content={
                        <>
                          <strong>Professional development and training</strong> days. Fractional leaders typically invest <strong>3-5 days</strong> per year in learning and skill development.
                        </>
                      } />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberInput
                      value={inputs.trainingDays || 4}
                      onChange={updateInput('trainingDays')}
                      min={0}
                      max={365}
                      step={1}
                      compact
                    />
                    <span className="text-xs text-muted-foreground min-w-[50px]">
                      {inputs.trainingDays || 4} days
                    </span>
                  </div>
                </div>

              </div>
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
              Reset to Default (Global)
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
