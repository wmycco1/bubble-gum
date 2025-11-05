// ═══════════════════════════════════════════════════════════════
// SPACING UTILITIES
// ═══════════════════════════════════════════════════════════════
// Utilities for handling margin/padding with Tailwind + inline styles
// Problem: Tailwind classes (px-6, py-4) conflict with inline styles
// Solution: Remove Tailwind spacing classes when custom values are set
// ═══════════════════════════════════════════════════════════════

import type { ComponentStyle } from '@/lib/editor/types';

/**
 * Remove Tailwind spacing classes from className string
 * Removes: p-*, px-*, py-*, pt-*, pr-*, pb-*, pl-*, m-*, mx-*, my-*, mt-*, mr-*, mb-*, ml-*
 */
export function removeSpacingClasses(className: string): string {
  return className
    .split(' ')
    .filter((cls) => {
      // Remove padding classes
      if (/^p-\d+$/.test(cls)) return false; // p-4, p-6, etc.
      if (/^px-\d+$/.test(cls)) return false; // px-4, px-6
      if (/^py-\d+$/.test(cls)) return false; // py-4, py-6
      if (/^pt-\d+$/.test(cls)) return false; // pt-4
      if (/^pr-\d+$/.test(cls)) return false; // pr-4
      if (/^pb-\d+$/.test(cls)) return false; // pb-4
      if (/^pl-\d+$/.test(cls)) return false; // pl-4

      // Remove margin classes
      if (/^m-\d+$/.test(cls)) return false; // m-4
      if (/^mx-\d+$/.test(cls)) return false; // mx-4
      if (/^my-\d+$/.test(cls)) return false; // my-4
      if (/^mt-\d+$/.test(cls)) return false; // mt-4
      if (/^mr-\d+$/.test(cls)) return false; // mr-4
      if (/^mb-\d+$/.test(cls)) return false; // mb-4
      if (/^ml-\d+$/.test(cls)) return false; // ml-4

      // Remove negative margins
      if (/^-m/.test(cls)) return false; // -mt-4, -ml-2, etc.

      return true;
    })
    .join(' ');
}

/**
 * Check if component has custom spacing values set
 */
export function hasCustomSpacing(style: ComponentStyle): boolean {
  const spacingProps = [
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  ];

  // Check base styles
  for (const prop of spacingProps) {
    if (style[prop as keyof ComponentStyle]) return true;
  }

  // Check responsive overrides
  if (style.tablet) {
    for (const prop of spacingProps) {
      const tabletProp = prop as 'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' | 'padding' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
      if (style.tablet[tabletProp]) return true;
    }
  }

  if (style.mobile) {
    for (const prop of spacingProps) {
      const mobileProp = prop as 'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' | 'padding' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft';
      if (style.mobile[mobileProp]) return true;
    }
  }

  return false;
}

/**
 * Merge className with spacing handling
 * If custom spacing is set, remove Tailwind spacing classes
 */
export function mergeClassNameWithSpacing(
  baseClassName: string,
  style: ComponentStyle
): string {
  if (hasCustomSpacing(style)) {
    return removeSpacingClasses(baseClassName);
  }
  return baseClassName;
}
