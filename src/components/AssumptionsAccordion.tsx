import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from './NumberInput';
import { InfoTooltip } from './InfoTooltip';
import { Settings, RotateCcw, ChevronDown, Globe } from 'lucide-react';
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
              <p className="text-xs text-muted-foreground">Adjust calculation parameters</p>
            </div>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <div className="p-6 bg-card rounded-lg border border-border space-y-6">
          {/* Country Selector with Overhead Display */}
          <div className="space-y-4 pb-6 border-b border-border">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              Country Selection
            </div>
            <div className="space-y-3">
              <label className="text-xs text-muted-foreground">
                Select your country to pre-fill overhead costs and working days
              </label>
              <div className="flex gap-3 items-start">
                <Select value={selectedCountry} onValueChange={onCountryChange}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border z-50">
                    {countryOptions.map(option => <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-xs text-muted-foreground">Overhead</div>
                  <div className="text-sm font-bold text-primary">{Math.round((inputs.overheadPct || 0.25) * 100)}%</div>
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">
                  <strong>Country selection pre-fills:</strong> Overhead %, Vacation Days, and Public Holidays
                </p>
                <p className="text-xs text-muted-foreground">
                  All values can be fine-tuned below after selection
                </p>
              </div>
            </div>
          </div>

          {/* Assumptions Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-foreground border-b border-border pb-2">Assumptions</h4>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-0 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold w-[35%]">Parameter</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Value</TableHead>
                    <TableHead className="text-xs font-semibold w-[10%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Overhead Cost
                        <InfoTooltip content={<>
                            The <strong>typical extra cost</strong> that a business in your country pays on top of an employee's salary to employ someone. This includes benefits, insurance, payroll taxes, and other overhead expenses. For example, if your target salary is $100,000 and overhead is 25%, the organization's total cost to employ you would be $125,000. This represents the <strong>necessary business expense</strong> for professional services and sets the foundation for understanding your fractional rate as a professional services charge. Typically <strong>20-35%</strong> depending on country and benefits package.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.overheadPct || 0} onChange={updateInput('overheadPct')} min={0} max={1} step={0.05} suffix="%" compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {Math.round((inputs.overheadPct || 0) * 100)}%
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Hours per Day
                        <InfoTooltip content={<>
                            Your <strong>typical working hours</strong> per day when fully engaged. Most fractional leaders work <strong>6-8 hours</strong> per day to maintain effectiveness across multiple clients.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.hoursPerDay || 0} onChange={updateInput('hoursPerDay')} min={1} max={24} step={0.5} compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {inputs.hoursPerDay || 0} hrs
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Vacation Days
                        <InfoTooltip content={<>
                            <strong>Paid time off</strong> you plan to take annually. As a fractional leader, you control your schedule but should plan for rest and rejuvenation. Typical range is <strong>15-25 days</strong>.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.vacationDays || 0} onChange={updateInput('vacationDays')} min={0} max={365} compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {inputs.vacationDays || 0} days
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Public Holidays
                        <InfoTooltip content={<>
                            <strong>National and local holidays</strong> when you typically don't work. In the US, this is usually <strong>10-15 days</strong> including major holidays like Christmas, New Year's, and Thanksgiving.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.publicHolidays || 0} onChange={updateInput('publicHolidays')} min={0} max={365} compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {inputs.publicHolidays || 0} days
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Other Leave Days
                        <InfoTooltip content={<>
                            <strong>Sick days and personal leave</strong> you expect to take. Even healthy people should plan for <strong>5-15 days</strong> annually for illness, family emergencies, or personal matters.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.otherLeaveDays || 0} onChange={updateInput('otherLeaveDays')} min={0} max={365} compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {inputs.otherLeaveDays || 0} days
                    </TableCell>
                  </TableRow>

                  <TableRow className="border-0 hover:bg-muted/30">
                    <TableCell className="py-2 text-sm">
                      <div className="flex items-center gap-2">
                        Training Days
                        <InfoTooltip content={<>
                            <strong>Professional development time</strong> to stay current with industry trends and improve your skills. Successful fractional leaders invest <strong>3-10 days</strong> annually in learning and networking.
                          </>} />
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <NumberInput value={inputs.trainingDays || 0} onChange={updateInput('trainingDays')} min={0} max={365} compact />
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {inputs.trainingDays || 0} days
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleResetToDefaults} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>;
};