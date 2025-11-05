// ═══════════════════════════════════════════════════════════════
// BADGE COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Badge variants (default, primary, success, warning, error)
// - Size variants (sm, md, lg)
// - Optional dot indicator
// - Optional pulse animation
// - Inline or standalone display
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface BadgeComponentProps {
  component: CanvasComponent;
}

export function BadgeComponent({ component }: BadgeComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const text = (props.text as string) || 'Badge';
  const variant = (props.variant as 'default' | 'primary' | 'success' | 'warning' | 'error') || 'default';
  const size = (props.size as 'sm' | 'md' | 'lg') || 'md';
  const dot = (props.dot as boolean) ?? false;
  const pulse = (props.pulse as boolean) ?? false;

  // Variant colors
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-200 text-slate-900';
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'lg':
        return 'text-base px-4 py-1.5';
      default:
        return 'text-sm px-3 py-1';
    }
  };

  // Dot color
  const getDotColor = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-400';
      case 'success':
        return 'bg-green-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-slate-400';
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const dotColor = getDotColor();

  // Base wrapper className
  const baseClassName = `inline-flex items-center gap-1.5 font-medium rounded-full ${variantStyles} ${sizeStyles}`;
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <span className={wrapperClassName} style={style as React.CSSProperties}>
      {/* Dot Indicator */}
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>
      )}

      {/* Text */}
      {text}
    </span>
  );
}
