// ═══════════════════════════════════════════════════════════════
// PROGRESS BAR COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Horizontal progress bar (0-100%)
// - Label display
// - Value display (optional)
// - Variant colors (default, success, warning, error)
// - Size variants (sm, md, lg)
// - Animated progress
// - Striped pattern (optional)
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';

interface ProgressComponentProps {
  component: CanvasComponent;
}

export function ProgressComponent({ component }: ProgressComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const value = Math.min(100, Math.max(0, (props.value as number) ?? 50)); // Clamp 0-100
  const label = (props.label as string) || '';
  const showValue = (props.showValue as boolean) ?? true;
  const variant = (props.variant as 'default' | 'success' | 'warning' | 'error') || 'default';
  const size = (props.size as 'sm' | 'md' | 'lg') || 'md';
  const animated = (props.animated as boolean) ?? true;
  const striped = (props.striped as boolean) ?? false;

  // Variant colors
  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  // Size heights
  const getSizeHeight = () => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const variantColor = getVariantColor();
  const sizeHeight = getSizeHeight();

  // Base wrapper className
  const baseClassName = 'w-full';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  return (
    <div className={wrapperClassName} style={cleanedStyle as React.CSSProperties}>
      {/* Label and Value */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-slate-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-slate-600">{value}%</span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={`w-full ${sizeHeight} bg-slate-200 rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Progress Bar Fill */}
        <div
          className={`${sizeHeight} ${variantColor} rounded-full transition-all duration-300 ease-out ${
            animated ? 'transition-all' : ''
          } ${
            striped
              ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:2rem_2rem] animate-[slide_1s_linear_infinite]'
              : ''
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
