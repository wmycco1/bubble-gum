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
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';
import { generateShadow } from '@/lib/utils/validation';
import { mergeCanvasClasses, getCanvasEnhancementStyles } from '@/lib/utils/canvas-enhancements';
import { useMemo } from 'react';

interface BadgeComponentProps {
  component: CanvasComponent;
  /** Canvas context for editor enhancements (optional - for standalone use) */
  canvasContext?: {
    deviceMode: 'mobile' | 'tablet' | 'desktop';
    isEditorMode: boolean;
  };
}

export function BadgeComponent({ component, canvasContext }: BadgeComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const text = (props.text as string) || 'Badge';
  const variant = (props.variant as 'default' | 'primary' | 'success' | 'warning' | 'error') || 'default';
  const size = (props.size as 'sm' | 'md' | 'lg') || 'md';
  const dot = (props.dot as boolean) ?? false;
  const pulse = (props.pulse as boolean) ?? false;

  // Generate boxShadow from shadow parameters (V7.1)
  const boxShadow = useMemo(() => {
    const shadow = props.shadow as 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'custom' | undefined;
    if (!shadow || shadow === 'none') return undefined;

    // Get color with fallback to black if not set
    const shadowColor = (props.shadowColor as string | undefined) || '#000000';

    console.log('[BadgeComponent] Shadow params:', {
      shadow,
      shadowColor,
      propsColor: props.shadowColor,
      opacity: props.shadowOpacity,
    });

    const result = generateShadow(
      shadow,
      shadow === 'custom' ? {
        offsetX: props.shadowOffsetX as number | undefined,
        offsetY: props.shadowOffsetY as number | undefined,
        blur: props.shadowBlur as number | undefined,
        spread: props.shadowSpread as number | undefined,
        color: shadowColor,
      } : {
        // For presets, pass color to allow custom colored shadows
        color: shadowColor,
      },
      props.shadowOpacity as number | undefined
    );

    console.log('[BadgeComponent] Generated boxShadow:', result);
    return result;
  }, [props.shadow, props.shadowColor, props.shadowOffsetX, props.shadowOffsetY, props.shadowBlur, props.shadowSpread, props.shadowOpacity]);

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
  const spacedClassName = mergeClassNameWithSpacing(baseClassName, style);

  // V8.0: Apply canvas enhancements (responsive visibility, etc.)
  const wrapperClassName = mergeCanvasClasses(spacedClassName, {
    hideOnMobile: props.hideOnMobile as boolean | undefined,
    hideOnTablet: props.hideOnTablet as boolean | undefined,
    hideOnDesktop: props.hideOnDesktop as boolean | undefined,
  });

  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  // V8.0: Get editor enhancement styles (hidden indicator)
  const editorStyles = canvasContext
    ? getCanvasEnhancementStyles(
        {
          hideOnMobile: props.hideOnMobile as boolean | undefined,
          hideOnTablet: props.hideOnTablet as boolean | undefined,
          hideOnDesktop: props.hideOnDesktop as boolean | undefined,
        },
        canvasContext.deviceMode,
        canvasContext.isEditorMode
      )
    : undefined;

  // Merge generated boxShadow with style and editor enhancements
  const finalStyle = {
    ...cleanedStyle,
    ...(boxShadow && { boxShadow }),
    ...editorStyles,
  } as React.CSSProperties;

  return (
    <span className={wrapperClassName} style={finalStyle}>
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
