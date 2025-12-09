import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from './NumberInput';
import { InfoTooltip } from './InfoTooltip';
import { Settings, RotateCcw, ChevronDown, Globe, DollarSign, Clock, MapPin } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';
import { countryOptions } from '@/utils/countryDefaults';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
interface AssumptionsAccordionProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
  currentCountryLabel?: string;
  isDetectingLocation?: boolean;
}
export const AssumptionsAccordion: React.FC<AssumptionsAccordionProps> = ({
  inputs,
  updateInput,
  selectedCountry,
  onCountryChange,
  currentCountryLabel,
  isDetectingLocation = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Calculate working hours per year dynamically
  const workingDaysPerYear = 52 * 5 - ((inputs.vacationDays || 0) + (inputs.publicHolidays || 0) + (inputs.otherLeaveDays || 0) + (inputs.trainingDays || 0));
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
  return <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Assumptions & Refinements (Default Settings)</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  {isDetectingLocation ? "Detecting location..." : <>Current country setting: <span className="font-medium text-foreground">{currentCountryLabel || 'Global'}</span></>}
                </p>
              </div>
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
              <label className="text-xs text-muted-foreground">Select your country / primary market to auto-fill standard employer costs and holidays.<br /><br />If your country is not listed, please select the nearest equivalent region — edit freely to fit your circumstances.</label>
              <Select value={selectedCountry} onValueChange={onCountryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  {countryOptions.map(option => <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Two Column Summary - Overhead vs Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Overhead Percentage Column */}
            <div className="p-6 bg-muted/30 rounded-xl min-h-[140px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <DollarSign className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Overhead Cost</h4>
                  <p className="text-xs text-muted-foreground">Benefits & employer costs</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                {Math.round((inputs.overheadPct || 0.25) * 100)}%
              </div>
            </div>

            {/* Working Hours Column */}
            <div className="p-6 bg-muted/30 rounded-xl min-h-[140px]">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Annual Working Hours</h4>
                  <p className="text-xs text-muted-foreground">Updates as you adjust below</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mt-2">
                {workingHoursPerYear.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {workingDaysPerYear} days × {inputs.hoursPerDay || 8} hrs/day
              </p>
            </div>
          </div>

          {/* Two Column Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            
            {/* LEFT COLUMN - Overhead Parameters */}
            <div className="p-4 rounded-lg border border-border/50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <DollarSign className="h-4 w-4 text-foreground" />
                  Adjust Overhead Cost
                </div>

                <div className="space-y-3">
                  {/* Overhead Cost Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Overhead Cost</span>
                        <InfoTooltip content="The percentage added on top of your base compensation to cover benefits, taxes, equipment, and other employer costs. For example, 25% means your employer pays an additional $25 for every $100 in your salary." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.overheadPct || 0.25} onChange={updateInput('overheadPct')} min={0} max={2} step={0.01} suffix="%" compact />
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* Close left column */}

            {/* RIGHT COLUMN - Working Hours Parameters */}
            <div className="p-4 rounded-lg border border-border/50">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold mb-3">
                  <Clock className="h-4 w-4 text-foreground" />
                  Adjust Working Time
                </div>

                <div className="space-y-3">
                  {/* Hours per Day Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Hours per Day</span>
                        <InfoTooltip content="The number of billable hours you work per day. This is different from your total work hours - it only counts time you can directly bill to clients." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.hoursPerDay || 8} onChange={updateInput('hoursPerDay')} min={1} max={24} step={0.5} suffix="hrs" compact />
                    </div>
                  </div>

                  {/* Vacation Days Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Vacation Days</span>
                        <InfoTooltip content="Annual paid time off for vacations and personal days. These are days you don't work but still consider part of your employment year." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.vacationDays || 15} onChange={updateInput('vacationDays')} min={0} max={365} step={1} suffix="days" compact />
                    </div>
                  </div>

                  {/* Public Holidays Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Public Holidays</span>
                        <InfoTooltip content="Official public holidays when you typically don't work. This varies by country and region." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.publicHolidays || 10} onChange={updateInput('publicHolidays')} min={0} max={365} step={1} suffix="days" compact />
                    </div>
                  </div>

                  {/* Other Leave Days Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Other Leave Days</span>
                        <InfoTooltip content="Additional non-working days such as sick leave, personal days, or other scheduled time off throughout the year." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.otherLeaveDays || 5} onChange={updateInput('otherLeaveDays')} min={0} max={365} step={1} suffix="days" compact />
                    </div>
                  </div>

                  {/* Training Days Input */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm font-medium">Training Days</span>
                        <InfoTooltip content="Days dedicated to professional development, conferences, courses, or skill-building activities. These are important for maintaining your expertise but aren't billable." />
                      </div>
                    </div>
                    <div className="w-24">
                      <NumberInput value={inputs.trainingDays || 5} onChange={updateInput('trainingDays')} min={0} max={365} step={1} suffix="days" compact />
                    </div>
                  </div>
                </div>
              </div>
            </div> {/* Close right column */}
          </div> {/* Close grid */}

          {/* Reset Button */}
          <div className="pt-6 border-t border-border">
            <Button onClick={handleResetToDefaults} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default Values (Global)
            </Button>
          </div>
        </div> {/* Close main content div */}
      </CollapsibleContent>
    </Collapsible>;
};