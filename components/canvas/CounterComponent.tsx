// ═══════════════════════════════════════════════════════════════
// COUNTER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Increment/decrement buttons
// - Keyboard support (up/down arrows)
// - Min/max boundaries with validation
// - Custom step values
// - Number formatting (number, currency, percentage)
// - Prefix/suffix support
// - Size variants
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';
import { Plus, Minus } from 'lucide-react';

interface CounterComponentProps {
  component: CanvasComponent;
}

export function CounterComponent({ component }: CounterComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const label = (props.label as string) || '';
  const initialValue = (props.value as number) ?? 0;
  const min = (props.min as number) ?? 0;
  const max = (props.max as number) ?? 100;
  const step = (props.step as number) ?? 1;
  const format = (props.format as 'number' | 'currency' | 'percentage') || 'number';
  const prefix = (props.prefix as string) || '';
  const suffix = (props.suffix as string) || '';
  const size = (props.size as 'sm' | 'md' | 'lg') || 'md';

  // Local state for counter value
  const [value, setValue] = useState<number>(initialValue);

  // Sync with prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Format value based on format type
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return String(val);
    }
  };

  // Increment with validation
  const increment = () => {
    setValue((prev) => Math.min(prev + step, max));
  };

  // Decrement with validation
  const decrement = () => {
    setValue((prev) => Math.max(prev - step, min));
  };

  // Keyboard support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
  };

  // Size-based styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'w-6 h-6',
          icon: 'w-3 h-3',
          value: 'text-base px-3',
          label: 'text-xs',
        };
      case 'lg':
        return {
          button: 'w-10 h-10',
          icon: 'w-5 h-5',
          value: 'text-xl px-6',
          label: 'text-base',
        };
      default:
        return {
          button: 'w-8 h-8',
          icon: 'w-4 h-4',
          value: 'text-lg px-4',
          label: 'text-sm',
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Base wrapper className
  const baseClassName = 'inline-flex flex-col items-center gap-2';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  const isMinReached = value <= min;
  const isMaxReached = value >= max;

  return (
    <div className={wrapperClassName} style={cleanedStyle as React.CSSProperties}>
      {/* Label */}
      {label && (
        <label className={`font-medium text-slate-700 ${sizeStyles.label}`}>
          {label}
        </label>
      )}

      {/* Counter Controls */}
      <div
        className="inline-flex items-center gap-2 border border-slate-300 rounded-lg bg-white"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="spinbutton"
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
      >
        {/* Decrement Button */}
        <button
          onClick={decrement}
          disabled={isMinReached}
          className={`flex items-center justify-center ${sizeStyles.button} text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg`}
          aria-label="Decrement"
        >
          <Minus className={sizeStyles.icon} />
        </button>

        {/* Value Display */}
        <div className={`font-semibold text-slate-900 ${sizeStyles.value} select-none`}>
          {prefix}
          {formatValue(value)}
          {suffix}
        </div>

        {/* Increment Button */}
        <button
          onClick={increment}
          disabled={isMaxReached}
          className={`flex items-center justify-center ${sizeStyles.button} text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg`}
          aria-label="Increment"
        >
          <Plus className={sizeStyles.icon} />
        </button>
      </div>

      {/* Min/Max Info */}
      <div className="text-xs text-slate-500">
        {min} - {max}
      </div>
    </div>
  );
}
