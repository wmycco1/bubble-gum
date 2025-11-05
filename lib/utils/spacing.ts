// ═══════════════════════════════════════════════════════════════
// SPACING UTILITIES (SMART VERSION)
// ═══════════════════════════════════════════════════════════════
// Utilities for handling margin/padding with Tailwind + inline styles
// Problem: Tailwind classes (px-6, py-4) conflict with inline styles
// Solution: Remove ONLY conflicting Tailwind classes, keep others
// Example: User sets marginTop → remove only mt-*, keep mr-*, mb-*, ml-*
// ═══════════════════════════════════════════════════════════════

import type { ComponentStyle } from '@/lib/editor/types';

/**
 * Get which spacing properties are set by the user
 * Returns object with flags for each spacing property
 */
function getSetSpacingProperties(style: ComponentStyle): {
  margin: boolean;
  marginTop: boolean;
  marginRight: boolean;
  marginBottom: boolean;
  marginLeft: boolean;
  padding: boolean;
  paddingTop: boolean;
  paddingRight: boolean;
  paddingBottom: boolean;
  paddingLeft: boolean;
} {
  const props = {
    margin: false,
    marginTop: false,
    marginRight: false,
    marginBottom: false,
    marginLeft: false,
    padding: false,
    paddingTop: false,
    paddingRight: false,
    paddingBottom: false,
    paddingLeft: false,
  };

  // Check base styles
  if (style.margin) props.margin = true;
  if (style.marginTop) props.marginTop = true;
  if (style.marginRight) props.marginRight = true;
  if (style.marginBottom) props.marginBottom = true;
  if (style.marginLeft) props.marginLeft = true;
  if (style.padding) props.padding = true;
  if (style.paddingTop) props.paddingTop = true;
  if (style.paddingRight) props.paddingRight = true;
  if (style.paddingBottom) props.paddingBottom = true;
  if (style.paddingLeft) props.paddingLeft = true;

  // Check responsive overrides
  if (style.tablet) {
    if (style.tablet.margin) props.margin = true;
    if (style.tablet.marginTop) props.marginTop = true;
    if (style.tablet.marginRight) props.marginRight = true;
    if (style.tablet.marginBottom) props.marginBottom = true;
    if (style.tablet.marginLeft) props.marginLeft = true;
    if (style.tablet.padding) props.padding = true;
    if (style.tablet.paddingTop) props.paddingTop = true;
    if (style.tablet.paddingRight) props.paddingRight = true;
    if (style.tablet.paddingBottom) props.paddingBottom = true;
    if (style.tablet.paddingLeft) props.paddingLeft = true;
  }

  if (style.mobile) {
    if (style.mobile.margin) props.margin = true;
    if (style.mobile.marginTop) props.marginTop = true;
    if (style.mobile.marginRight) props.marginRight = true;
    if (style.mobile.marginBottom) props.marginBottom = true;
    if (style.mobile.marginLeft) props.marginLeft = true;
    if (style.mobile.padding) props.padding = true;
    if (style.mobile.paddingTop) props.paddingTop = true;
    if (style.mobile.paddingRight) props.paddingRight = true;
    if (style.mobile.paddingBottom) props.paddingBottom = true;
    if (style.mobile.paddingLeft) props.paddingLeft = true;
  }

  return props;
}

/**
 * Remove ONLY conflicting Tailwind spacing classes
 * Smart removal: only removes classes that conflict with user-set values
 */
export function removeConflictingSpacingClasses(
  className: string,
  style: ComponentStyle
): string {
  const setProps = getSetSpacingProperties(style);

  return className
    .split(' ')
    .filter((cls) => {
      // PADDING
      // If user set padding (all sides), remove all padding classes
      if (setProps.padding) {
        if (/^p-\d+$/.test(cls)) return false;
        if (/^px-\d+$/.test(cls)) return false;
        if (/^py-\d+$/.test(cls)) return false;
        if (/^pt-\d+$/.test(cls)) return false;
        if (/^pr-\d+$/.test(cls)) return false;
        if (/^pb-\d+$/.test(cls)) return false;
        if (/^pl-\d+$/.test(cls)) return false;
      } else {
        // Otherwise, remove only specific sides that user set
        if (setProps.paddingTop && /^(py-\d+|pt-\d+)$/.test(cls)) return false;
        if (setProps.paddingRight && /^(px-\d+|pr-\d+)$/.test(cls)) return false;
        if (setProps.paddingBottom && /^(py-\d+|pb-\d+)$/.test(cls)) return false;
        if (setProps.paddingLeft && /^(px-\d+|pl-\d+)$/.test(cls)) return false;
      }

      // MARGIN
      // If user set margin (all sides), remove all margin classes
      if (setProps.margin) {
        if (/^-?m-\d+$/.test(cls)) return false;
        if (/^-?mx-\d+$/.test(cls)) return false;
        if (/^-?my-\d+$/.test(cls)) return false;
        if (/^-?mt-\d+$/.test(cls)) return false;
        if (/^-?mr-\d+$/.test(cls)) return false;
        if (/^-?mb-\d+$/.test(cls)) return false;
        if (/^-?ml-\d+$/.test(cls)) return false;
      } else {
        // Otherwise, remove only specific sides that user set
        if (setProps.marginTop && /^-?(my-\d+|mt-\d+)$/.test(cls)) return false;
        if (setProps.marginRight && /^-?(mx-\d+|mr-\d+)$/.test(cls)) return false;
        if (setProps.marginBottom && /^-?(my-\d+|mb-\d+)$/.test(cls)) return false;
        if (setProps.marginLeft && /^-?(mx-\d+|ml-\d+)$/.test(cls)) return false;
      }

      return true;
    })
    .join(' ');
}

/**
 * Check if component has ANY custom spacing values set
 */
export function hasCustomSpacing(style: ComponentStyle): boolean {
  const props = getSetSpacingProperties(style);
  return Object.values(props).some((val) => val);
}

/**
 * Merge className with smart spacing handling
 * Removes ONLY conflicting Tailwind classes, keeps the rest
 */
export function mergeClassNameWithSpacing(
  baseClassName: string,
  style: ComponentStyle
): string {
  if (hasCustomSpacing(style)) {
    return removeConflictingSpacingClasses(baseClassName, style);
  }
  return baseClassName;
}

/**
 * Clean up style object to avoid React borderRadius conflicts
 * React doesn't allow mixing shorthand (borderRadius) with longhand properties
 * (borderTopLeftRadius, etc.) in the same style object
 *
 * Strategy:
 * - If borderRadius (shorthand) is set, remove all individual corner properties
 * - If any individual corner is set, keep them and remove borderRadius
 */
export function cleanBorderRadiusStyle(
  style: Record<string, unknown>
): Record<string, unknown> {
  const cleaned = { ...style };

  const hasShorthand = 'borderRadius' in cleaned && cleaned.borderRadius != null;
  const hasIndividual =
    ('borderTopLeftRadius' in cleaned && cleaned.borderTopLeftRadius != null) ||
    ('borderTopRightRadius' in cleaned && cleaned.borderTopRightRadius != null) ||
    ('borderBottomLeftRadius' in cleaned && cleaned.borderBottomLeftRadius != null) ||
    ('borderBottomRightRadius' in cleaned && cleaned.borderBottomRightRadius != null);

  // If BOTH are present (conflict), prefer individual corners and remove shorthand
  if (hasShorthand && hasIndividual) {
    delete cleaned.borderRadius;
  }

  return cleaned;
}
