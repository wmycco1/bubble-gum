/**
 * Responsive Visibility Utility
 *
 * Generates Tailwind CSS classes for device-specific visibility control.
 * Works for both production sites and React exports.
 *
 * Architecture:
 * - Editor Mode: Always renders + visual indicator overlay
 * - Production Mode: CSS-based hiding (Tailwind responsive classes)
 * - React Export: Same CSS classes in exported code
 *
 * Benefits:
 * - SEO friendly (content in DOM, hidden via CSS)
 * - Accessibility compliant
 * - No JavaScript required for visibility logic
 * - Clean export to React code
 */

export interface ResponsiveVisibilityProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

/**
 * Generates Tailwind responsive visibility classes
 *
 * Tailwind breakpoints:
 * - default (< 640px) = mobile
 * - sm (640px - 767px) = tablet
 * - md (768px - 1023px) = tablet
 * - lg (1024px+) = desktop
 *
 * @param visibility - Visibility settings per device
 * @returns Tailwind CSS class string
 */
export function getResponsiveVisibilityClasses(
  visibility: ResponsiveVisibilityProps
): string {
  const classes: string[] = [];

  // Mobile: < 640px (default breakpoint)
  if (visibility.hideOnMobile) {
    classes.push('max-sm:hidden');
  }

  // Tablet: 640px - 1023px (sm and md)
  // CRITICAL FIX: Tailwind is mobile-first!
  // sm:hidden means "hide on sm AND ABOVE" (includes desktop!)
  // To hide ONLY on tablet, we need: hide on sm+, but show back on lg
  if (visibility.hideOnTablet) {
    classes.push('sm:hidden'); // Hide on tablet (sm/md) and above
    if (!visibility.hideOnDesktop) {
      classes.push('lg:block'); // Show back on desktop if not hidden there
    }
  }

  // Desktop: 1024px+ (lg and above)
  if (visibility.hideOnDesktop) {
    classes.push('lg:hidden');
  }

  return classes.join(' ');
}

/**
 * Checks if component should be visually indicated as hidden in editor
 *
 * @param visibility - Visibility settings
 * @param currentDevice - Current device mode in editor
 * @returns true if component is hidden on current device
 */
export function isHiddenOnCurrentDevice(
  visibility: ResponsiveVisibilityProps,
  currentDevice: 'mobile' | 'tablet' | 'desktop'
): boolean {
  switch (currentDevice) {
    case 'mobile':
      return visibility.hideOnMobile ?? false;
    case 'tablet':
      return visibility.hideOnTablet ?? false;
    case 'desktop':
      return visibility.hideOnDesktop ?? false;
    default:
      return false;
  }
}

/**
 * Generates inline styles for editor visual indicator
 * Shows gray overlay when component is hidden on current device
 *
 * @param visibility - Visibility settings
 * @param currentDevice - Current device mode
 * @param isEditorMode - Whether we're in editor mode
 * @returns React CSSProperties or undefined
 */
export function getEditorVisibilityStyles(
  visibility: ResponsiveVisibilityProps,
  currentDevice: 'mobile' | 'tablet' | 'desktop',
  isEditorMode: boolean
): React.CSSProperties | undefined {
  if (!isEditorMode) return undefined;

  const isHidden = isHiddenOnCurrentDevice(visibility, currentDevice);

  if (!isHidden) return undefined;

  return {
    position: 'relative',
    opacity: 0.4,
    pointerEvents: 'none',
    filter: 'grayscale(100%)',
  };
}
