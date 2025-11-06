// ═══════════════════════════════════════════════════════════════
// APPLY CUSTOM PROPS - Helper for applying custom styling properties
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Fix for custom properties not applying visually
// Purpose: Extract and apply all custom properties to component styles
// ═══════════════════════════════════════════════════════════════

import type { ComponentProps } from '@/lib/editor/types';

/**
 * Builds a comprehensive style object from component props
 * Includes: typography, filters, transitions, hover states, custom CSS
 */
export function buildStyleFromProps(props: ComponentProps): React.CSSProperties {
  const style: React.CSSProperties = {};

  // Typography Properties (PHASE 3)
  if (props.fontFamily) style.fontFamily = props.fontFamily;
  if (props.fontSize) style.fontSize = `${props.fontSize}px`;
  if (props.fontWeight) style.fontWeight = props.fontWeight;
  if (props.lineHeight) style.lineHeight = props.lineHeight;
  if (props.letterSpacing) style.letterSpacing = `${props.letterSpacing}px`;
  if (props.textDecoration) style.textDecoration = props.textDecoration;
  if (props.textTransform) style.textTransform = props.textTransform as React.CSSProperties['textTransform'];

  // Transition Properties (PHASE 4)
  if (props.transitionDuration || props.transitionTiming || props.transitionDelay) {
    const duration = props.transitionDuration ?? 300;
    const timing = props.transitionTiming ?? 'ease';
    const delay = props.transitionDelay ?? 0;
    style.transition = `all ${duration}ms ${timing} ${delay}ms`;
  }

  // Filter Properties (PHASE 4)
  const filters: string[] = [];
  if (props.filterBlur) filters.push(`blur(${props.filterBlur}px)`);
  if (props.filterBrightness !== undefined && props.filterBrightness !== 100) {
    filters.push(`brightness(${props.filterBrightness}%)`);
  }
  if (props.filterContrast !== undefined && props.filterContrast !== 100) {
    filters.push(`contrast(${props.filterContrast}%)`);
  }
  if (props.filterGrayscale) filters.push(`grayscale(${props.filterGrayscale}%)`);
  if (props.filterHueRotate) filters.push(`hue-rotate(${props.filterHueRotate}deg)`);
  if (props.filterInvert) filters.push(`invert(${props.filterInvert}%)`);
  if (props.filterSaturate !== undefined && props.filterSaturate !== 100) {
    filters.push(`saturate(${props.filterSaturate}%)`);
  }
  if (props.filterSepia) filters.push(`sepia(${props.filterSepia}%)`);
  if (filters.length > 0) {
    style.filter = filters.join(' ');
  }

  // Other Properties (PHASE 4)
  if (props.overflow) style.overflow = props.overflow;
  if (props.cursor) style.cursor = props.cursor;

  return style;
}

/**
 * Builds className string from component props
 * Includes: className, customTailwind
 */
export function buildClassNameFromProps(props: ComponentProps, baseClassName = ''): string {
  const classes: string[] = [];

  if (baseClassName) classes.push(baseClassName);
  if (props.className) classes.push(props.className);
  if (props.customTailwind) classes.push(props.customTailwind);

  return classes.filter(Boolean).join(' ');
}

/**
 * Parses custom CSS string into style object
 */
export function parseCustomCSS(customCSS: string): React.CSSProperties {
  if (!customCSS) return {};

  const style: Record<string, string> = {};

  // Remove comments
  let css = customCSS.replace(/\/\*[\s\S]*?\*\//g, '');

  // Split by semicolon and parse each declaration
  const declarations = css.split(';').filter(d => d.trim());

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s?.trim());
    if (property && value) {
      // Convert kebab-case to camelCase
      const camelProperty = property.replace(/-([a-z])/g, (_match, g) => g.toUpperCase());
      style[camelProperty] = value;
    }
  }

  return style as React.CSSProperties;
}

/**
 * Normalizes style object to avoid shorthand/longhand conflicts
 * React warns when mixing shorthand (border) with specific (borderBottomColor)
 */
function normalizeStyleConflicts(style: React.CSSProperties): React.CSSProperties {
  const normalized = { ...style };

  // If we have both border shorthand and specific border properties, remove shorthand
  const hasBorderShorthand = 'border' in normalized;
  const hasSpecificBorder =
    'borderTop' in normalized ||
    'borderRight' in normalized ||
    'borderBottom' in normalized ||
    'borderLeft' in normalized ||
    'borderTopColor' in normalized ||
    'borderRightColor' in normalized ||
    'borderBottomColor' in normalized ||
    'borderLeftColor' in normalized ||
    'borderTopWidth' in normalized ||
    'borderRightWidth' in normalized ||
    'borderBottomWidth' in normalized ||
    'borderLeftWidth' in normalized;

  if (hasBorderShorthand && hasSpecificBorder) {
    delete normalized.border;
  }

  return normalized;
}

/**
 * Merges all custom properties into a single style object
 * Priority: customCSS > component props > base style
 */
export function mergeAllStyles(
  baseStyle: React.CSSProperties,
  props: ComponentProps
): React.CSSProperties {
  const propsStyle = buildStyleFromProps(props);
  const customCSSStyle = props.customCSS ? parseCustomCSS(props.customCSS) : {};

  const merged = {
    ...baseStyle,
    ...propsStyle,
    ...customCSSStyle, // Custom CSS has highest priority
  };

  // Normalize to avoid React warnings about shorthand/longhand conflicts
  return normalizeStyleConflicts(merged);
}

/**
 * Applies hover state styles (for CSS-in-JS hover effects)
 * Note: For proper hover support, consider using CSS classes or styled-components
 */
export function buildHoverStyles(props: ComponentProps): string {
  const hoverRules: string[] = [];

  if (props.hoverBackgroundColor) {
    hoverRules.push(`background-color: ${props.hoverBackgroundColor}`);
  }
  if (props.hoverTextColor) {
    hoverRules.push(`color: ${props.hoverTextColor}`);
  }
  if (props.hoverScale && props.hoverScale !== 1) {
    hoverRules.push(`transform: scale(${props.hoverScale})`);
  }

  return hoverRules.join('; ');
}

/**
 * Generates CSS class for hover effects (to be used with style tag or CSS-in-JS)
 */
export function generateHoverClass(componentId: string, props: ComponentProps): string {
  const hoverStyles = buildHoverStyles(props);
  if (!hoverStyles) return '';

  return `
    .component-${componentId}:hover {
      ${hoverStyles};
    }
  `;
}
