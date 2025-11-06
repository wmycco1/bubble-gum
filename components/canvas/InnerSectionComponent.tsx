// ═══════════════════════════════════════════════════════════════
// INNER SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Extended Component Library
// Purpose: Nested layout container for inner sections
// Features:
// - Max width control
// - Background (color/image/gradient)
// - Padding/margin controls
// - Border radius & shadow
// - M3 advanced properties support
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';

interface InnerSectionComponentProps {
  component: CanvasComponent;
  children?: React.ReactNode;
}

export function InnerSectionComponent({ component, children }: InnerSectionComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const maxWidth = (props.maxWidth as string) || '1200px';
  const padding = (props.padding as string) || '2rem';
  const backgroundColor = (props.backgroundColor as string) || 'transparent';
  const backgroundImage = props.backgroundImage as string | undefined;
  const backgroundSize = (props.backgroundSize as string) || 'cover';
  const backgroundPosition = (props.backgroundPosition as string) || 'center';
  const backgroundRepeat = (props.backgroundRepeat as string) || 'no-repeat';
  const minHeight = props.minHeight as string | undefined;

  // Base styles
  const baseStyle: React.CSSProperties = {
    maxWidth,
    margin: '0 auto',
    padding,
    backgroundColor,
    minHeight,
  };

  // Background image styles
  if (backgroundImage) {
    baseStyle.backgroundImage = `url(${backgroundImage})`;
    baseStyle.backgroundSize = backgroundSize;
    baseStyle.backgroundPosition = backgroundPosition;
    baseStyle.backgroundRepeat = backgroundRepeat;
  }

  // Build className with custom props
  const baseClassName = 'w-full';
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );

  // Clean and merge styles
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);
  const finalStyle = mergeAllStyles(
    { ...baseStyle, ...cleanedStyle } as React.CSSProperties,
    props
  );

  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
    >
      {children}
    </div>
  );
}
