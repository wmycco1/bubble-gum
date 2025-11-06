// ═══════════════════════════════════════════════════════════════
// SPACER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Extended Component Library
// Purpose: Empty space / divider with responsive height
// Features:
// - Fixed/responsive height
// - Optional divider line
// - Divider styles (solid, dashed, dotted)
// - Responsive breakpoints (mobile, tablet)
// - M3 advanced properties support
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

interface SpacerComponentProps {
  component: CanvasComponent;
}

export function SpacerComponent({ component }: SpacerComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const height = (props.height as string) || '2rem';
  const backgroundColor = (props.backgroundColor as string) || 'transparent';
  const showDivider = (props.showDivider as boolean) ?? false;
  const dividerStyle = (props.dividerStyle as string) || 'solid';
  const dividerColor = (props.dividerColor as string) || '#e2e8f0';
  const dividerThickness = (props.dividerThickness as number) || 1;
  const responsive = (props.responsive as boolean) ?? false;
  const mobileHeight = props.mobileHeight as string | undefined;
  const tabletHeight = props.tabletHeight as string | undefined;

  // Base styles
  const baseStyle: React.CSSProperties = {
    height,
    width: '100%',
    backgroundColor,
    position: 'relative',
  };

  // Divider styles
  if (showDivider) {
    baseStyle.borderTop = `${dividerThickness}px ${dividerStyle} ${dividerColor}`;
  }

  // Responsive height classes
  let responsiveClasses = '';
  if (responsive && mobileHeight) {
    responsiveClasses += ` mobile:h-[${mobileHeight}]`;
  }
  if (responsive && tabletHeight) {
    responsiveClasses += ` tablet:h-[${tabletHeight}]`;
  }

  // Build className
  const baseClassName = 'block' + responsiveClasses;
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );

  // Merge all styles
  const finalStyle = mergeAllStyles(
    { ...baseStyle, ...style } as React.CSSProperties,
    props
  );

  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
      aria-hidden="true"
    />
  );
}
