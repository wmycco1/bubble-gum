// ═══════════════════════════════════════════════════════════════
// CSS ↔ COMPONENT PARAMETERS BIDIRECTIONAL SYNC UTILITY
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Enterprise-Grade Parameter Synchronization
// Purpose: Keep CSS custom styles in sync with component parameters
//
// Features:
// - CSS → Parameters: Parse CSS and update component props
// - Parameters → CSS: Generate CSS from component props
// - Smart mapping: CSS properties ↔ Component parameter names
// - Unit conversion: px, rem, em, % → numbers
// - Bidirectional sync for: typography, spacing, colors, sizing
// ═══════════════════════════════════════════════════════════════

import { parseCSS } from './css-to-tailwind';

/**
 * CSS property to Component parameter mapping
 * Maps CSS property names to component prop names
 */
const CSS_TO_PARAM_MAP: Record<string, string> = {
  // Typography
  'font-size': 'fontSize',
  'font-size-unit': 'fontSizeUnit', // ✨ Unit for font-size (handled specially)
  'font-weight': 'fontWeight',
  'font-family': 'fontFamily',
  'line-height': 'lineHeight',
  'letter-spacing': 'letterSpacing',
  'text-align': 'textAlign',
  'text-transform': 'textTransform',
  'text-decoration': 'textDecoration',
  'color': 'color',

  // Spacing
  'margin': 'margin',
  'margin-top': 'marginTop',
  'margin-right': 'marginRight',
  'margin-bottom': 'marginBottom',
  'margin-left': 'marginLeft',
  'padding': 'padding',
  'padding-top': 'paddingTop',
  'padding-right': 'paddingRight',
  'padding-bottom': 'paddingBottom',
  'padding-left': 'paddingLeft',

  // Sizing
  'width': 'width',
  'height': 'height',
  'min-width': 'minWidth',
  'min-height': 'minHeight',
  'max-width': 'maxWidth',
  'max-height': 'maxHeight',

  // Colors
  'background-color': 'backgroundColor',
  'border-color': 'borderColor',

  // Border
  'border-width': 'borderWidth',
  'border-style': 'borderStyle',
  'border-radius': 'borderRadius',
  'border-top-left-radius': 'borderTopLeftRadius',
  'border-top-right-radius': 'borderTopRightRadius',
  'border-bottom-right-radius': 'borderBottomRightRadius',
  'border-bottom-left-radius': 'borderBottomLeftRadius',

  // Display & Layout
  'display': 'display',
  'position': 'position',
  'flex-direction': 'flexDirection',
  'justify-content': 'justifyContent',
  'align-items': 'alignItems',
  'gap': 'gap',

  // Effects
  'opacity': 'opacity',
  'box-shadow': 'boxShadow',
  'text-shadow': 'textShadow',
  'transform': 'transform',
};

/**
 * Reverse mapping: Component parameter to CSS property
 */
const PARAM_TO_CSS_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CSS_TO_PARAM_MAP).map(([css, param]) => [param, css])
);

/**
 * Extract numeric value from CSS unit string
 *
 * @param value - CSS value (e.g., "16px", "1.5rem", "100%")
 * @param allowedUnits - Array of allowed units (default: ['px'])
 * @returns Numeric value or original string
 *
 * @example
 * extractNumericValue("16px") // 16
 * extractNumericValue("1.5rem") // "1.5rem" (non-px unit, return as string)
 * extractNumericValue("auto") // "auto"
 */
function extractNumericValue(value: string, allowedUnits: string[] = ['px']): number | string {
  // Try to extract number from string like "16px", "1.5rem", etc.
  const match = value.match(/^(-?\d+\.?\d*)(px|rem|em|%|vh|vw)?$/);
  if (match) {
    const numValue = parseFloat(match[1]);
    const unit = match[2] || 'px'; // Default to px if no unit specified

    // ✨ FIX: Only extract numeric value if unit is allowed
    // For spacing (padding/margin), only px is supported in parameters
    // Other units (rem, em, %, vh, vw) should stay in Custom CSS only
    if (allowedUnits.includes(unit)) {
      return numValue;
    }

    // Return original string if unit is not allowed (keeps "70rem" as is)
    return value;
  }

  // Return original string if no numeric extraction possible
  return value;
}

/**
 * Convert CSS value to component parameter value
 * Handles unit conversion and type coercion
 *
 * @param cssProperty - CSS property name
 * @param cssValue - CSS value
 * @returns Component parameter value
 */
function cssValueToParamValue(cssProperty: string, cssValue: string): any {
  const paramName = CSS_TO_PARAM_MAP[cssProperty];
  if (!paramName) return cssValue;

  // Font weight: convert "bold"/"normal" to numeric
  if (paramName === 'fontWeight') {
    const weightMap: Record<string, number> = {
      'normal': 400,
      'bold': 700,
      'lighter': 300,
      'bolder': 800,
    };
    return weightMap[cssValue] || parseInt(cssValue) || cssValue;
  }

  // Spacing properties: extract numeric value (px only!)
  // ✨ FIX: Only px units are supported in parameters for spacing
  // Other units (rem, em, %, vh, vw) should stay in Custom CSS only
  if (paramName.includes('margin') || paramName.includes('padding') || paramName.includes('gap')) {
    return extractNumericValue(cssValue, ['px']); // Only px allowed
  }

  // Font size: extract numeric value (handled specially in syncCSSToParameters)
  // This is a fallback for cases where fontSize is not parsed with unit
  if (paramName === 'fontSize') {
    return extractNumericValue(cssValue, ['px']); // Fallback: only px
  }

  // Letter spacing: extract numeric value (px only!)
  if (paramName === 'letterSpacing') {
    return extractNumericValue(cssValue, ['px']); // Only px allowed
  }

  // Opacity: CSS uses 0-1, but OpacityControl expects 0-100
  if (paramName === 'opacity') {
    const opacity = parseFloat(cssValue);
    // ✨ FIX: Protect against NaN from invalid CSS
    if (isNaN(opacity)) {
      console.warn(`⚠️ Invalid opacity value: "${cssValue}", skipping`);
      return undefined; // Skip invalid values
    }

    // ✨ FIX: Convert CSS opacity (0-1) to parameter value (0-100 %)
    // CSS: opacity: 0.5 → Parameter: 50
    // CSS: opacity: 1 → Parameter: 100
    return Math.round(opacity * 100);
  }

  // Border radius: extract numeric value (px only!)
  if (paramName.includes('borderRadius') || paramName.includes('Radius')) {
    return extractNumericValue(cssValue, ['px']); // Only px allowed
  }

  // Border width: extract numeric value (px only!)
  if (paramName === 'borderWidth') {
    return extractNumericValue(cssValue, ['px']); // Only px allowed
  }

  // Default: return as-is
  return cssValue;
}

/**
 * Convert component parameter value to CSS value
 *
 * @param paramName - Component parameter name
 * @param paramValue - Parameter value
 * @returns CSS value string
 */
function paramValueToCssValue(paramName: string, paramValue: any): string {
  if (paramValue === null || paramValue === undefined) {
    return '';
  }

  // Number values: add px unit for spacing/sizing
  if (typeof paramValue === 'number') {
    if (
      paramName.includes('margin') ||
      paramName.includes('padding') ||
      paramName === 'fontSize' ||
      paramName === 'letterSpacing' ||
      paramName === 'gap' ||
      paramName === 'width' ||
      paramName === 'height' ||
      paramName.includes('Radius')
    ) {
      return `${paramValue}px`;
    }

    // Opacity: convert from parameter (0-100%) to CSS (0-1)
    if (paramName === 'opacity') {
      const cssOpacity = paramValue / 100; // Convert 100 → 1.0, 50 → 0.5
      return String(cssOpacity);
    }
  }

  // Font weight: ensure numeric or keyword
  if (paramName === 'fontWeight') {
    return String(paramValue);
  }

  // Default: convert to string
  return String(paramValue);
}

/**
 * Sync CSS to component parameters
 * Extracts values from CSS and updates component props
 *
 * @param cssString - CSS string (e.g., "font-size: 16px; color: blue;")
 * @param currentParams - Current component parameters
 * @returns Updated parameters object
 *
 * @example
 * const params = syncCSSToParameters("font-size: 16px; padding: 12px;", {});
 * // Returns: { fontSize: 16, padding: 12 }
 */
export function syncCSSToParameters(
  cssString: string,
  currentParams: Record<string, any> = {}
): Record<string, any> {
  if (!cssString || !cssString.trim()) {
    return currentParams;
  }

  // Parse CSS string to object
  const cssObject = parseCSS(cssString);

  // Convert CSS properties to component parameters
  const updatedParams: Record<string, any> = { ...currentParams };

  for (const [cssProperty, cssValue] of Object.entries(cssObject)) {
    // ✨ Special handling for font-size: extract both value AND unit
    if (cssProperty === 'font-size' && cssValue) {
      const match = String(cssValue).match(/^(-?\d+\.?\d*)(px|rem|em|%|vh|vw)?$/);
      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2] || 'px';

        // Set both fontSize (numeric value) and fontSizeUnit (unit string)
        updatedParams['fontSize'] = value;
        updatedParams['fontSizeUnit'] = unit;

        console.log(`🔄 CSS Sync: font-size: ${cssValue} → fontSize: ${value}, fontSizeUnit: ${unit}`);
      }
      continue; // Skip normal processing for font-size
    }

    // ✨ Special handling for box-shadow: extract shadow parameters
    if (cssProperty === 'box-shadow' && cssValue) {
      // Parse box-shadow: offsetX offsetY blur spread color
      // Example: "70px 110px 10px 5px #000000" or "0 4px 6px rgba(0,0,0,0.1)"
      const shadowStr = String(cssValue);

      // Match: offsetX offsetY [blur] [spread] [color]
      const match = shadowStr.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?(?:\s+(-?\d+(?:\.\d+)?)(px|rem|em)?)?\s*(.*)$/);

      if (match) {
        const offsetX = parseFloat(match[1]);
        const offsetY = parseFloat(match[3]);
        const blur = match[5] ? parseFloat(match[5]) : 0;
        const spread = match[7] ? parseFloat(match[7]) : 0;
        const color = match[9] ? match[9].trim() : '#000000';

        // Set shadow parameters (custom mode)
        updatedParams['shadow'] = 'custom';
        updatedParams['shadowOffsetX'] = offsetX;
        updatedParams['shadowOffsetY'] = offsetY;
        updatedParams['shadowBlur'] = blur;
        updatedParams['shadowSpread'] = spread;
        updatedParams['shadowColor'] = color;

        console.log(`🔄 CSS Sync: box-shadow: ${cssValue} → shadow=custom, offsetX=${offsetX}, offsetY=${offsetY}, blur=${blur}, spread=${spread}, color=${color}`);
      }
      continue; // Skip normal processing for box-shadow
    }

    const paramName = CSS_TO_PARAM_MAP[cssProperty];

    if (paramName && cssValue) {
      // Convert CSS value to appropriate parameter value
      const paramValue = cssValueToParamValue(cssProperty, String(cssValue));

      // ✨ FIX: Only add valid values (skip undefined/NaN)
      if (paramValue !== undefined && paramValue !== null) {
        // ✨ FIX: Skip string values for numeric parameters (e.g., "70rem" for paddingTop)
        // These non-px units should stay in Custom CSS only, not sync to parameters
        if (typeof paramValue === 'string' &&
            (paramName.includes('padding') || paramName.includes('margin') ||
             paramName.includes('Radius') || paramName.includes('Width') ||
             paramName.includes('Height') || paramName === 'letterSpacing' ||
             paramName === 'gap' || paramName === 'fontSize')) {
          console.warn(`⚠️ CSS Sync: Skipping non-px value for ${paramName}: ${paramValue} (only px supported in parameters)`);
          continue; // Skip this parameter
        }

        updatedParams[paramName] = paramValue;
      }
    }
  }

  return updatedParams;
}

/**
 * Sync component parameters to CSS
 * Generates CSS from component parameters
 *
 * @param params - Component parameters
 * @param existingCSS - Existing CSS string to merge with
 * @returns CSS string
 *
 * @example
 * const css = syncParametersToCSS({ fontSize: 16, padding: 12 });
 * // Returns: "font-size: 16px;\npadding: 12px;"
 */
export function syncParametersToCSS(
  params: Record<string, any>,
  existingCSS: string = ''
): string {
  // Parse existing CSS to preserve properties not in params
  const existingCSSObject = parseCSS(existingCSS);

  // Convert parameters to CSS properties
  const cssProperties: string[] = [];

  // Track which params we've processed
  const processedParams = new Set<string>();

  // ✨ NEW: Check if Advanced mode is used for spacing (individual sides set)
  const hasIndividualPadding = params.paddingTop !== undefined || params.paddingRight !== undefined ||
                                params.paddingBottom !== undefined || params.paddingLeft !== undefined;
  const hasIndividualMargin = params.marginTop !== undefined || params.marginRight !== undefined ||
                               params.marginBottom !== undefined || params.marginLeft !== undefined;

  for (const [paramName, paramValue] of Object.entries(params)) {
    // Skip fontSizeUnit - it's handled with fontSize
    if (paramName === 'fontSizeUnit') {
      processedParams.add(paramName);
      continue;
    }

    // Skip shadow sub-params - they're handled with shadow='custom'
    if (paramName === 'shadowOffsetX' || paramName === 'shadowOffsetY' ||
        paramName === 'shadowBlur' || paramName === 'shadowSpread' ||
        paramName === 'shadowColor') {
      processedParams.add(paramName);
      continue;
    }

    // ✨ NEW: Skip general padding if Advanced mode (individual sides) is used
    if (paramName === 'padding' && hasIndividualPadding) {
      processedParams.add(paramName);
      console.log('🔄 Params Sync: Skipping general padding (Advanced mode with individual sides detected)');
      continue;
    }

    // ✨ NEW: Skip general margin if Advanced mode (individual sides) is used
    if (paramName === 'margin' && hasIndividualMargin) {
      processedParams.add(paramName);
      console.log('🔄 Params Sync: Skipping general margin (Advanced mode with individual sides detected)');
      continue;
    }

    // ✨ Special handling for fontSize: use fontSizeUnit if available
    if (paramName === 'fontSize' && paramValue !== null && paramValue !== undefined) {
      const unit = params.fontSizeUnit || 'px';
      cssProperties.push(`font-size: ${paramValue}${unit};`);

      // Remove from existing CSS (we're replacing it)
      delete existingCSSObject['font-size'];

      console.log(`🔄 Params Sync: fontSize: ${paramValue}, fontSizeUnit: ${unit} → font-size: ${paramValue}${unit}`);
      processedParams.add(paramName);
      continue;
    }

    // ✨ Special handling for shadow='custom': generate box-shadow CSS
    if (paramName === 'shadow' && paramValue === 'custom') {
      const offsetX = params.shadowOffsetX ?? 0;
      const offsetY = params.shadowOffsetY ?? 0;
      const blur = params.shadowBlur ?? 0;
      const spread = params.shadowSpread ?? 0;
      const color = params.shadowColor || '#000000';

      const boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;
      cssProperties.push(`box-shadow: ${boxShadow};`);

      // Remove from existing CSS (we're replacing it)
      delete existingCSSObject['box-shadow'];

      console.log(`🔄 Params Sync: shadow=custom (offsetX=${offsetX}, offsetY=${offsetY}, blur=${blur}, spread=${spread}, color=${color}) → box-shadow: ${boxShadow}`);
      processedParams.add(paramName);
      continue;
    }

    const cssProperty = PARAM_TO_CSS_MAP[paramName];

    if (cssProperty && paramValue !== null && paramValue !== undefined) {
      const cssValue = paramValueToCssValue(paramName, paramValue);
      if (cssValue) {
        cssProperties.push(`${cssProperty}: ${cssValue};`);

        // Remove from existing CSS (we're replacing it)
        delete existingCSSObject[cssProperty];
      }
    }
    processedParams.add(paramName);
  }

  // Add back existing CSS properties that weren't overridden
  for (const [cssProperty, cssValue] of Object.entries(existingCSSObject)) {
    if (cssValue) {
      cssProperties.push(`${cssProperty}: ${cssValue};`);
    }
  }

  return cssProperties.join('\n');
}

/**
 * Get list of synced parameter names
 * Returns parameter names that can be synced from CSS
 *
 * @returns Array of parameter names
 */
export function getSyncedParameterNames(): string[] {
  const baseParams = Object.values(CSS_TO_PARAM_MAP);

  // Add shadow parameters (not in CSS_TO_PARAM_MAP because they're composite)
  const shadowParams = ['shadow', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowSpread', 'shadowColor'];

  return [...baseParams, ...shadowParams];
}

/**
 * Check if parameter can be synced
 *
 * @param paramName - Parameter name
 * @returns true if parameter can be synced
 */
export function isParameterSyncable(paramName: string): boolean {
  return Object.values(CSS_TO_PARAM_MAP).includes(paramName);
}

/**
 * Extract specific parameter from CSS
 *
 * @param cssString - CSS string
 * @param paramName - Parameter name to extract
 * @returns Parameter value or undefined
 */
export function extractParameterFromCSS(cssString: string, paramName: string): any {
  const cssProperty = PARAM_TO_CSS_MAP[paramName];
  if (!cssProperty) return undefined;

  const cssObject = parseCSS(cssString);
  const cssValue = cssObject[cssProperty];

  if (!cssValue) return undefined;

  return cssValueToParamValue(cssProperty, String(cssValue));
}
