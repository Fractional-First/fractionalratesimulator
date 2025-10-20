
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CurrencyInputProps {
  label: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  helperText?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "0",
  className,
  helperText
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(inputValue) || 0;
    onChange(numericValue);
  };

  const formatNumber = (num: number): string => {
    if (num === 0) return '';
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(num);
  };

  const displayValue = formatNumber(value);

  return (
    <div className={cn("space-y-3", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 currency-text text-sm font-medium">
          $
        </span>
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-8 pr-4 h-12 text-right transition-all duration-200 hover:border-primary/50 focus:border-primary border-border bg-background touch-target rounded-xl"
        />
      </div>
      {helperText && (
        <p className="text-xs formula-text caption leading-relaxed">{helperText}</p>
      )}
    </div>
  );
};
