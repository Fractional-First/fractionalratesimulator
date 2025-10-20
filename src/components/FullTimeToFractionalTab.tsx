import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from './CurrencyInput';
import { InfoTooltip } from './InfoTooltip';
import { DollarSign } from 'lucide-react';
import { type Inputs } from '@/utils/calculator';

interface FullTimeToFractionalTabProps {
  inputs: Inputs;
  updateInput: (field: keyof Inputs) => (value: number) => void;
  clearFractionalInput: () => void;
}

export const FullTimeToFractionalTab: React.FC<FullTimeToFractionalTabProps> = ({
  inputs,
  updateInput,
  clearFractionalInput
}) => {
  return (
    <Card className="section-bg shadow-sm border-border animate-fade-in">
      <CardHeader className="section-spacing">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div className="p-2 bg-primary/10 rounded-xl">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          Full-time Compensation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your current or target full-time compensation to calculate equivalent fractional rates.
        </p>
      </CardHeader>
      <CardContent className="section-spacing pt-0">
        <div className="grid md:grid-cols-2 gap-6">
          <CurrencyInput 
            label={
              <div className="flex items-center gap-2">
                Base Salary
                <InfoTooltip content={
                  <>
                    Your <strong>fixed annual salary</strong> before bonuses or equity. This is your guaranteed base pay that forms the foundation of your compensation package.
                  </>
                } />
              </div>
            } 
            value={inputs.baseSalary || 0} 
            onChange={value => {
              updateInput('baseSalary')(value);
              if (value > 0) clearFractionalInput();
            }} 
            helperText="Annual base salary" 
          />
          <CurrencyInput 
            label={
              <div className="flex items-center gap-2">
                Annual Bonus
                <InfoTooltip content={
                  <>
                    Your <strong>expected yearly bonus</strong> based on performance or company results. Include only what you realistically expect to receive, typically <strong>10-30%</strong> of base salary.
                  </>
                } />
              </div>
            } 
            value={inputs.annualBonus || 0} 
            onChange={value => {
              updateInput('annualBonus')(value);
              if (value > 0) clearFractionalInput();
            }} 
            helperText="Expected annual bonus" 
          />
          <CurrencyInput 
            label={
              <div className="flex items-center gap-2">
                Annual Equity FMV
                <InfoTooltip content={
                  <>
                    The <strong>fair market value</strong> of stock options, RSUs, or other equity you receive annually. Use current market value, not exercise price for options.
                  </>
                } />
              </div>
            } 
            value={inputs.annualEquityFmv || 0} 
            onChange={value => {
              updateInput('annualEquityFmv')(value);
              if (value > 0) clearFractionalInput();
            }} 
            helperText="Fair market value of equity" 
          />
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg shadow-lg border-2 border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total Full-time Compensation</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(
                (inputs.baseSalary || 0) + (inputs.annualBonus || 0) + (inputs.annualEquityFmv || 0)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};