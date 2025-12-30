
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
  const [localValue, setLocalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasInteracted, setHasInteracted] = React.useState(false);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formattedValue = value === 0 ? (hasInteracted ? '0' : '') : formatNumber(value);

  React.useEffect(() => {
    if (!isFocused) setLocalValue(formattedValue);
  }, [formattedValue, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setHasInteracted(true);
    setLocalValue(rawValue);

    if (rawValue === '' || rawValue === '.') {
      onChange(0);
      return;
    }

    const cleanedValue = rawValue.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(cleanedValue);

    if (Number.isNaN(numericValue)) {
      onChange(0);
      return;
    }

    onChange(numericValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLocalValue(value === 0 && !hasInteracted ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

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
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
