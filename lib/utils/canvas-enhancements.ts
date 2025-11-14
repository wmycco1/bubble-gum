/**
 * Canvas Component Enhancement System (V8.0 - Enterprise Grade)
 *
 * Zero-overhead utility system for enhancing canvas components.
 * Used by: Webflow, Framer, Builder.io architecture pattern
 *
 * Architecture:
 * - NO WRAPPERS (V7.0 compliant)
 * - Pure utility functions
 * - Components apply classes themselves
 * - Clean DOM output
 * - Export-ready (React code generation)
 *
 * Usage:
 * ```typescript
 * const enhancedClassName = getCanvasEnhancementClasses(component.props);
 * const enhancedStyle = getCanvasEnhancementStyles(component.props, deviceMode, isEditor);
 *
 * <span className={`${baseClass} ${enhancedClassName}`} style={enhancedStyle}>
 * ```
 */

import { getResponsiveVisibilityClasses, isHiddenOnCurrentDevice, type ResponsiveVisibilityProps } from './responsive-visibility';

/**
 * Canvas component props that support enhancements
 */
export interface CanvasEnhancementProps extends ResponsiveVisibilityProps {
  // Responsive visibility already included via extends

  // Future enhancements (ready for expansion):
  // animation?: string;
  // interactions?: Record<string, any>;
  // conditions?: Record<string, any>;
}

/**
 * Get all CSS class enhancements for a canvas component
 *
 * Generates Tailwind classes for:
 * - Responsive visibility (hideOnMobile, hideOnTablet, hideOnDesktop)
 * - Future: animations, interactions, etc.
 *
 * @param props - Component props with enhancement data
 * @returns Space-separated string of Tailwind classes
 *
 * @example
 * ```typescript
 * const classes = getCanvasEnhancementClasses({
 *   hideOnMobile: true,
 *   hideOnTablet: false,
 *   hideOnDesktop: false
 * });
 * // Returns: "max-sm:hidden"
 * ```
 */
export function getCanvasEnhancementClasses(props: CanvasEnhancementProps): string {
  const classes: string[] = [];

  // Responsive visibility
  const visibilityClasses = getResponsiveVisibilityClasses({
    hideOnMobile: props.hideOnMobile,
    hideOnTablet: props.hideOnTablet,
    hideOnDesktop: props.hideOnDesktop,
  });

  if (visibilityClasses) {
    classes.push(visibilityClasses);
  }

  // Future enhancements can be added here
  // Example:
  // if (props.animation) {
  //   classes.push(getAnimationClasses(props.animation));
  // }

  return classes.join(' ');
}

/**
 * Get inline style enhancements for editor mode
 *
 * In editor mode, adds visual indicators for:
 * - Hidden components (grayscale + opacity)
 * - Future: hover states, conditions, etc.
 *
 * In production mode, returns undefined (no inline styles needed)
 *
 * @param props - Component props
 * @param currentDevice - Current device mode in editor
 * @param isEditorMode - Whether we're in editor or production
 * @returns React.CSSProperties or undefined
 *
 * @example
 * ```typescript
 * const editorStyles = getCanvasEnhancementStyles(
 *   { hideOnMobile: true },
 *   'mobile',
 *   true // editor mode
 * );
 * // Returns: { opacity: 0.4, filter: 'grayscale(100%)', ... }
 * ```
 */
export function getCanvasEnhancementStyles(
  props: CanvasEnhancementProps,
  currentDevice: 'mobile' | 'tablet' | 'desktop',
  isEditorMode: boolean
): React.CSSProperties | undefined {
  if (!isEditorMode) {
    return undefined; // Production mode - no inline styles
  }

  const styles: React.CSSProperties = {};

  // Visual indicator for hidden components in editor
  const isHidden = isHiddenOnCurrentDevice(
    {
      hideOnMobile: props.hideOnMobile,
      hideOnTablet: props.hideOnTablet,
      hideOnDesktop: props.hideOnDesktop,
    },
    currentDevice
  );

  if (isHidden) {
    Object.assign(styles, {
      opacity: 0.4,
      filter: 'grayscale(100%)',
      pointerEvents: 'none' as const,
      position: 'relative' as const,
    });
  }

  return Object.keys(styles).length > 0 ? styles : undefined;
}

/**
 * Check if component should show "hidden" badge in editor
 *
 * @param props - Component props
 * @param currentDevice - Current device mode
 * @returns true if hidden badge should be shown
 */
export function shouldShowHiddenBadge(
  props: CanvasEnhancementProps,
  currentDevice: 'mobile' | 'tablet' | 'desktop'
): boolean {
  return isHiddenOnCurrentDevice(
    {
      hideOnMobile: props.hideOnMobile,
      hideOnTablet: props.hideOnTablet,
      hideOnDesktop: props.hideOnDesktop,
    },
    currentDevice
  );
}

/**
 * Get device icon name for hidden badge
 *
 * @param currentDevice - Current device mode
 * @returns Lucide icon name
 */
export function getHiddenDeviceIcon(currentDevice: 'mobile' | 'tablet' | 'desktop'): string {
  switch (currentDevice) {
    case 'mobile':
      return 'Smartphone';
    case 'tablet':
      return 'Tablet';
    case 'desktop':
      return 'Monitor';
    default:
      return 'EyeOff';
  }
}

/**
 * Merge canvas enhancement classes with base classes
 *
 * Helper to combine component's base classes with enhancement classes
 *
 * @param baseClassName - Component's base className
 * @param props - Enhancement props
 * @returns Merged className string
 */
export function mergeCanvasClasses(
  baseClassName: string,
  props: CanvasEnhancementProps
): string {
  const enhancementClasses = getCanvasEnhancementClasses(props);
  return enhancementClasses ? `${baseClassName} ${enhancementClasses}` : baseClassName;
}
