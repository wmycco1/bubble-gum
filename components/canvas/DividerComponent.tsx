// ═══════════════════════════════════════════════════════════════
// DIVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Horizontal/vertical orientation
// - Variant styles (solid, dashed, dotted)
// - Customizable thickness and color
// - Spacing control
// - Optional label with positioning
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface DividerComponentProps {
  component: CanvasComponent;
}

export function DividerComponent({ component }: DividerComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const orientation = (props.orientation as 'horizontal' | 'vertical') || 'horizontal';
  const variant = (props.variant as 'solid' | 'dashed' | 'dotted') || 'solid';
  const thickness = (props.thickness as number) ?? 1;
  const color = (props.color as string) || '#CBD5E1'; // slate-300
  const spacing = (props.spacing as string) || '1rem';
  const label = (props.label as string) || '';
  const labelPosition = (props.labelPosition as 'left' | 'center' | 'right') || 'center';

  // Border style based on variant
  const borderStyle = variant === 'solid' ? 'solid' : variant === 'dashed' ? 'dashed' : 'dotted';

  // Base styles
  const dividerStyles: React.CSSProperties = {
    ...(orientation === 'horizontal'
      ? {
          borderTop: `${thickness}px ${borderStyle} ${color}`,
          marginTop: spacing,
          marginBottom: spacing,
        }
      : {
          borderLeft: `${thickness}px ${borderStyle} ${color}`,
          marginLeft: spacing,
          marginRight: spacing,
          minHeight: '3rem',
        }),
  };

  // Base wrapper className
  const baseClassName = orientation === 'horizontal' ? 'w-full' : 'h-full';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  // With label
  if (label) {
    const justifyClass =
      labelPosition === 'left'
        ? 'justify-start'
        : labelPosition === 'right'
        ? 'justify-end'
        : 'justify-center';

    if (orientation === 'horizontal') {
      return (
        <div
          className={`${wrapperClassName} flex items-center ${justifyClass} gap-4`}
          style={style as React.CSSProperties}
        >
          {labelPosition !== 'left' && (
            <div className="flex-1" style={dividerStyles} />
          )}
          <span className="text-sm text-slate-600 whitespace-nowrap">{label}</span>
          {labelPosition !== 'right' && (
            <div className="flex-1" style={dividerStyles} />
          )}
        </div>
      );
    }

    // Vertical with label
    return (
      <div
        className={`${wrapperClassName} flex flex-col items-center ${justifyClass} gap-4`}
        style={style as React.CSSProperties}
      >
        {labelPosition !== 'left' && (
          <div className="flex-1" style={dividerStyles} />
        )}
        <span className="text-sm text-slate-600 whitespace-nowrap">{label}</span>
        {labelPosition !== 'right' && (
          <div className="flex-1" style={dividerStyles} />
        )}
      </div>
    );
  }

  // Without label
  return (
    <div
      className={wrapperClassName}
      style={{
        ...(style as React.CSSProperties),
        ...dividerStyles,
      }}
      role="separator"
    />
  );
}
