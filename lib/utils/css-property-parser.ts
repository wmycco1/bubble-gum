// ═══════════════════════════════════════════════════════════════
// CSS PROPERTY PARSER - Extract Structured Data from CSS
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Bidirectional Custom CSS ↔ Native Properties Sync
// Purpose: Parse CSS strings to extract individual property values
// Use case: When user types "border: 2px solid red" → extract width=2, style=solid, color=red
// Features:
// - Parse border shorthand to individual properties
// - Parse box-shadow to structured data
// - Parse text-shadow to structured data
// - Parse transform to individual transforms
// - Parse filters to individual filter functions
// - Parse typography properties
// - Bidirectional sync support
// ═══════════════════════════════════════════════════════════════

import { parseCustomCSS } from './apply-custom-props';

/**
 * Border property values
 */
export interface BorderValues {
  topWidth: number;
  rightWidth: number;
  bottomWidth: number;
  leftWidth: number;
  topStyle: string;
  rightStyle: string;
  bottomStyle: string;
  leftStyle: string;
  topColor: string;
  rightColor: string;
  bottomColor: string;
  leftColor: string;
}

/**
 * Box shadow values
 */
export interface BoxShadowValues {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

/**
 * Text shadow values
 */
export interface TextShadowValues {
  x: number;
  y: number;
  blur: number;
  color: string;
}

/**
 * Transform values
 */
export interface TransformValues {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  skewX: number;
  skewY: number;
}

/**
 * Typography values
 */
export interface TypographyValues {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: string;
  letterSpacing?: number;
  textDecoration?: string;
  textTransform?: string;
}

/**
 * Parse border shorthand to individual properties
 * Examples:
 * - "2px solid red" → { width: 2, style: 'solid', color: 'red' }
 * - "1px dashed #3b82f6" → { width: 1, style: 'dashed', color: '#3b82f6' }
 */
function parseBorderShorthand(value: string): { width: number; style: string; color: string } | null {
  if (!value || value === 'none') return null;

  const parts = value.trim().split(/\s+/);
  let width = 0;
  let style = 'solid';
  let color = '#000000';

  for (const part of parts) {
    // Check if it's a width (ends with px, rem, em, etc.)
    if (/^\d+(\.\d+)?(px|rem|em|pt)$/.test(part)) {
      width = parseFloat(part);
    }
    // Check if it's a style
    else if (['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(part)) {
      style = part;
    }
    // Otherwise, it's probably a color
    else {
      color = part;
    }
  }

  return { width, style, color };
}

/**
 * Extract border properties from CSS string
 * Supports both shorthand and longhand properties
 */
export function extractBorderFromCSS(cssString: string): Partial<BorderValues> | null {
  const cssObj = parseCustomCSS(cssString);
  const borderValues: Partial<BorderValues> = {};

  // Check for shorthand border property
  if (cssObj.border) {
    const parsed = parseBorderShorthand(cssObj.border as string);
    if (parsed) {
      // Apply to all sides
      borderValues.topWidth = parsed.width;
      borderValues.rightWidth = parsed.width;
      borderValues.bottomWidth = parsed.width;
      borderValues.leftWidth = parsed.width;
      borderValues.topStyle = parsed.style;
      borderValues.rightStyle = parsed.style;
      borderValues.bottomStyle = parsed.style;
      borderValues.leftStyle = parsed.style;
      borderValues.topColor = parsed.color;
      borderValues.rightColor = parsed.color;
      borderValues.bottomColor = parsed.color;
      borderValues.leftColor = parsed.color;
    }
  }

  // Check for individual side shorthands
  if (cssObj.borderTop) {
    const parsed = parseBorderShorthand(cssObj.borderTop as string);
    if (parsed) {
      borderValues.topWidth = parsed.width;
      borderValues.topStyle = parsed.style;
      borderValues.topColor = parsed.color;
    }
  }
  if (cssObj.borderRight) {
    const parsed = parseBorderShorthand(cssObj.borderRight as string);
    if (parsed) {
      borderValues.rightWidth = parsed.width;
      borderValues.rightStyle = parsed.style;
      borderValues.rightColor = parsed.color;
    }
  }
  if (cssObj.borderBottom) {
    const parsed = parseBorderShorthand(cssObj.borderBottom as string);
    if (parsed) {
      borderValues.bottomWidth = parsed.width;
      borderValues.bottomStyle = parsed.style;
      borderValues.bottomColor = parsed.color;
    }
  }
  if (cssObj.borderLeft) {
    const parsed = parseBorderShorthand(cssObj.borderLeft as string);
    if (parsed) {
      borderValues.leftWidth = parsed.width;
      borderValues.leftStyle = parsed.style;
      borderValues.leftColor = parsed.color;
    }
  }

  // Check for individual longhand properties (override shorthands)
  if (cssObj.borderTopWidth) borderValues.topWidth = parseFloat(cssObj.borderTopWidth as string);
  if (cssObj.borderRightWidth) borderValues.rightWidth = parseFloat(cssObj.borderRightWidth as string);
  if (cssObj.borderBottomWidth) borderValues.bottomWidth = parseFloat(cssObj.borderBottomWidth as string);
  if (cssObj.borderLeftWidth) borderValues.leftWidth = parseFloat(cssObj.borderLeftWidth as string);

  if (cssObj.borderTopStyle) borderValues.topStyle = cssObj.borderTopStyle as string;
  if (cssObj.borderRightStyle) borderValues.rightStyle = cssObj.borderRightStyle as string;
  if (cssObj.borderBottomStyle) borderValues.bottomStyle = cssObj.borderBottomStyle as string;
  if (cssObj.borderLeftStyle) borderValues.leftStyle = cssObj.borderLeftStyle as string;

  if (cssObj.borderTopColor) borderValues.topColor = cssObj.borderTopColor as string;
  if (cssObj.borderRightColor) borderValues.rightColor = cssObj.borderRightColor as string;
  if (cssObj.borderBottomColor) borderValues.bottomColor = cssObj.borderBottomColor as string;
  if (cssObj.borderLeftColor) borderValues.leftColor = cssObj.borderLeftColor as string;

  return Object.keys(borderValues).length > 0 ? borderValues : null;
}

/**
 * Extract box-shadow from CSS string
 * Example: "0 4px 6px rgba(0, 0, 0, 0.1)" → { x: 0, y: 4, blur: 6, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false }
 */
export function extractBoxShadowFromCSS(cssString: string): BoxShadowValues | null {
  const cssObj = parseCustomCSS(cssString);
  const boxShadow = cssObj.boxShadow as string;

  if (!boxShadow || boxShadow === 'none') return null;

  const inset = boxShadow.includes('inset');
  const cleanShadow = boxShadow.replace('inset', '').trim();

  // Parse shadow values
  // Format: x y blur spread color
  const regex = /^(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)?\s*(.+)?$/;
  const match = cleanShadow.match(regex);

  if (!match) {
    // Try without spread
    const regex2 = /^(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s*(.+)?$/;
    const match2 = cleanShadow.match(regex2);

    if (!match2) return null;

    return {
      x: parseFloat(match2[1]),
      y: parseFloat(match2[2]),
      blur: parseFloat(match2[3]),
      spread: 0,
      color: match2[4] || 'rgba(0, 0, 0, 0.1)',
      inset,
    };
  }

  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    blur: parseFloat(match[3]),
    spread: match[4] ? parseFloat(match[4]) : 0,
    color: match[5] || 'rgba(0, 0, 0, 0.1)',
    inset,
  };
}

/**
 * Extract text-shadow from CSS string
 * Example: "2px 2px 4px rgba(0, 0, 0, 0.5)" → { x: 2, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.5)' }
 */
export function extractTextShadowFromCSS(cssString: string): TextShadowValues | null {
  const cssObj = parseCustomCSS(cssString);
  const textShadow = cssObj.textShadow as string;

  if (!textShadow || textShadow === 'none') return null;

  // Format: x y blur color
  const regex = /^(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s+(-?\d+(?:\.\d+)?(?:px|rem|em)?)\s*(.+)?$/;
  const match = textShadow.match(regex);

  if (!match) return null;

  return {
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    blur: parseFloat(match[3]),
    color: match[4] || 'rgba(0, 0, 0, 0.5)',
  };
}

/**
 * Extract transform from CSS string
 * Example: "translateX(10px) translateY(20px) rotate(45deg) scale(1.5)" → structured data
 */
export function extractTransformFromCSS(cssString: string): Partial<TransformValues> | null {
  const cssObj = parseCustomCSS(cssString);
  const transform = cssObj.transform as string;

  if (!transform || transform === 'none') return null;

  const transformValues: Partial<TransformValues> = {};

  // Extract translateX
  const translateXMatch = transform.match(/translateX\((-?\d+(?:\.\d+)?)(px|rem|em|%)?\)/);
  if (translateXMatch) transformValues.translateX = parseFloat(translateXMatch[1]);

  // Extract translateY
  const translateYMatch = transform.match(/translateY\((-?\d+(?:\.\d+)?)(px|rem|em|%)?\)/);
  if (translateYMatch) transformValues.translateY = parseFloat(translateYMatch[1]);

  // Extract scaleX
  const scaleXMatch = transform.match(/scaleX\((-?\d+(?:\.\d+)?)\)/);
  if (scaleXMatch) transformValues.scaleX = parseFloat(scaleXMatch[1]);

  // Extract scaleY
  const scaleYMatch = transform.match(/scaleY\((-?\d+(?:\.\d+)?)\)/);
  if (scaleYMatch) transformValues.scaleY = parseFloat(scaleYMatch[1]);

  // Extract scale (both X and Y)
  const scaleMatch = transform.match(/scale\((-?\d+(?:\.\d+)?)\)/);
  if (scaleMatch) {
    transformValues.scaleX = parseFloat(scaleMatch[1]);
    transformValues.scaleY = parseFloat(scaleMatch[1]);
  }

  // Extract rotate
  const rotateMatch = transform.match(/rotate\((-?\d+(?:\.\d+)?)(deg|rad|turn)?\)/);
  if (rotateMatch) transformValues.rotate = parseFloat(rotateMatch[1]);

  // Extract skewX
  const skewXMatch = transform.match(/skewX\((-?\d+(?:\.\d+)?)(deg|rad|turn)?\)/);
  if (skewXMatch) transformValues.skewX = parseFloat(skewXMatch[1]);

  // Extract skewY
  const skewYMatch = transform.match(/skewY\((-?\d+(?:\.\d+)?)(deg|rad|turn)?\)/);
  if (skewYMatch) transformValues.skewY = parseFloat(skewYMatch[1]);

  return Object.keys(transformValues).length > 0 ? transformValues : null;
}

/**
 * Extract typography from CSS string
 */
export function extractTypographyFromCSS(cssString: string): Partial<TypographyValues> | null {
  const cssObj = parseCustomCSS(cssString);
  const typography: Partial<TypographyValues> = {};

  if (cssObj.fontFamily) typography.fontFamily = cssObj.fontFamily as string;
  if (cssObj.fontSize) typography.fontSize = parseFloat(cssObj.fontSize as string);
  if (cssObj.fontWeight) typography.fontWeight = cssObj.fontWeight as string;
  if (cssObj.lineHeight) typography.lineHeight = cssObj.lineHeight as string;
  if (cssObj.letterSpacing) typography.letterSpacing = parseFloat(cssObj.letterSpacing as string);
  if (cssObj.textDecoration) typography.textDecoration = cssObj.textDecoration as string;
  if (cssObj.textTransform) typography.textTransform = cssObj.textTransform as string;

  return Object.keys(typography).length > 0 ? typography : null;
}

/**
 * Extract opacity from CSS string
 */
export function extractOpacityFromCSS(cssString: string): number | null {
  const cssObj = parseCustomCSS(cssString);
  if (cssObj.opacity) {
    return parseFloat(cssObj.opacity as string);
  }
  return null;
}

/**
 * Extract z-index from CSS string
 */
export function extractZIndexFromCSS(cssString: string): number | null {
  const cssObj = parseCustomCSS(cssString);
  if (cssObj.zIndex) {
    return parseInt(cssObj.zIndex as string, 10);
  }
  return null;
}

/**
 * Main parser function - extracts ALL properties from CSS
 */
export interface ParsedCSSProperties {
  border?: Partial<BorderValues>;
  boxShadow?: BoxShadowValues;
  textShadow?: TextShadowValues;
  transform?: Partial<TransformValues>;
  typography?: Partial<TypographyValues>;
  opacity?: number;
  zIndex?: number;
}

export function parseAllCSSProperties(cssString: string): ParsedCSSProperties {
  return {
    border: extractBorderFromCSS(cssString) || undefined,
    boxShadow: extractBoxShadowFromCSS(cssString) || undefined,
    textShadow: extractTextShadowFromCSS(cssString) || undefined,
    transform: extractTransformFromCSS(cssString) || undefined,
    typography: extractTypographyFromCSS(cssString) || undefined,
    opacity: extractOpacityFromCSS(cssString) || undefined,
    zIndex: extractZIndexFromCSS(cssString) || undefined,
  };
}
