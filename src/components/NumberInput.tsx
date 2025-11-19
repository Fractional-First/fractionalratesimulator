
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  label?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  helperText?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  compact?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "0",
  className,
  helperText,
  suffix,
  min,
  max,
  step = 1,
  compact = false
}) => {
  const isPercentage = suffix === '%';
  
  // Convert decimal to percentage for display (0.25 -> 25)
  const numericValue = isPercentage ? value * 100 : value;
  const displayMin = isPercentage && min !== undefined ? min * 100 : min;
  const displayMax = isPercentage && max !== undefined ? max * 100 : max;
  const displayStep = isPercentage ? step * 100 : step;

  const [localValue, setLocalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (!isFocused) {
      // Only format when not focused
      const formatted = numericValue === 0 ? '0' : new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      }).format(numericValue);
      setLocalValue(formatted);
    }
  }, [numericValue, isFocused]);

  const displayValue = isFocused ? localValue : (numericValue === 0 ? '0' : new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(numericValue));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);
    
    // Allow empty string during editing
    if (rawValue === '' || rawValue === '.') {
      onChange(0);
      return;
    }
    
    const cleanedValue = rawValue.replace(/[^0-9.]/g, '');
    let inputValue = parseFloat(cleanedValue);
    
    if (isNaN(inputValue)) {
      onChange(0);
      return;
    }
    
    // Apply min/max constraints on display value
    if (displayMin !== undefined && inputValue < displayMin) inputValue = displayMin;
    if (displayMax !== undefined && inputValue > displayMax) inputValue = displayMax;
    
    // Convert percentage back to decimal for state (25 -> 0.25)
    const stateValue = isPercentage ? inputValue / 100 : inputValue;
    onChange(stateValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setLocalValue(numericValue === 0 ? '' : numericValue.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  if (compact) {
    return (
      <div className={cn("relative", className)}>
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "h-9 text-right transition-all duration-200 hover:border-primary/50 focus:border-primary border-border bg-background rounded-lg",
            suffix ? "pl-2 pr-10" : "px-2"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium pointer-events-none text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          type="text"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "h-12 text-right transition-all duration-200 hover:border-primary/50 focus:border-primary border-border bg-background touch-target rounded-xl",
            suffix ? "pl-4 pr-10" : "px-4"
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 currency-text text-sm font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p className="text-xs formula-text caption leading-relaxed">{helperText}</p>
      )}
    </div>
  );
};
