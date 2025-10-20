import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from './CurrencyInput';
import { InfoTooltip } from './InfoTooltip';
import { Calculator } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';

interface FractionalToFullTimeTabProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  clearSalaryInputs: () => void;
}

export const FractionalToFullTimeTab: React.FC<FractionalToFullTimeTabProps> = ({
  inputs,
  updateInput,
  clearSalaryInputs
}) => {
  return (
    <Card className="section-bg shadow-sm border-border animate-fade-in">
      <CardHeader className="section-spacing">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          Fractional Rate
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your current or target fractional hourly rate to see the equivalent full-time salary.
        </p>
      </CardHeader>
      <CardContent className="section-spacing pt-0">
        <div className="max-w-md">
          <CurrencyInput 
            label={
              <div className="flex items-center gap-2">
                Fractional Hourly Rate
                <InfoTooltip content={
                  <>
                    Your <strong>current or target hourly rate</strong> for fractional work. This calculator will show you what full-time salary this rate is equivalent to, accounting for all the business costs and time factors.
                  </>
                } />
              </div>
            } 
            value={inputs.fractionalHourlyInput || 0} 
            onChange={value => {
              updateInput('fractionalHourlyInput')(value);
              if (value > 0) clearSalaryInputs();
            }} 
            helperText="Your fractional hourly rate" 
          />
        </div>
      </CardContent>
    </Card>
  );
};