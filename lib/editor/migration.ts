// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - COMPONENT TYPE MIGRATION MAPPER
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Purpose: Map OLD component types to NEW component types
// Note: Used for database backward compatibility and migration
// ═══════════════════════════════════════════════════════════════

import type { ComponentType } from './types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OLD System Types (Database Format)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * OLD component types used in database (lowercase)
 * @deprecated Use ComponentType from lib/editor/types.ts instead
 */
export type OldComponentType = 'hero' | 'text' | 'image' | 'button' | 'form';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Migration Mappings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Maps OLD database types to NEW editor types
 *
 * Migration Notes:
 * - 'hero' → 'Section': Hero is now a Section component with special props
 * - Other types have 1:1 mapping with capitalization
 *
 * @example
 * ```typescript
 * const newType = OLD_TO_NEW_TYPE_MAP['hero']; // 'Section'
 * ```
 */
export const OLD_TO_NEW_TYPE_MAP: Record<OldComponentType, ComponentType> = {
  hero: 'Section',      // Hero is now Section with special styling
  text: 'Text',         // Text component (includes headings via variant)
  image: 'Image',       // Image component
  button: 'Button',     // Button component
  form: 'Form',         // Form component
} as const;

/**
 * Maps NEW editor types to OLD database types (reverse mapping)
 *
 * Note: Only includes types that have OLD equivalents
 * New types (Container, Grid, Card, Input) don't have OLD equivalents
 *
 * @example
 * ```typescript
 * const oldType = NEW_TO_OLD_TYPE_MAP['Section']; // 'hero'
 * ```
 */
export const NEW_TO_OLD_TYPE_MAP: Partial<Record<ComponentType, OldComponentType>> = {
  Section: 'hero',
  Text: 'text',
  Heading: 'text',      // Heading is stored as text with variant
  Image: 'image',
  Button: 'button',
  Form: 'form',
  // Container, Grid, Card, Input don't have OLD equivalents
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper Functions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Convert OLD database type to NEW editor type
 *
 * @param oldType - OLD lowercase type from database
 * @returns NEW PascalCase type for editor
 *
 * @example
 * ```typescript
 * const newType = convertOldToNewType('hero'); // 'Section'
 * ```
 */
export function convertOldToNewType(oldType: string): ComponentType {
  if (oldType in OLD_TO_NEW_TYPE_MAP) {
    return OLD_TO_NEW_TYPE_MAP[oldType as OldComponentType];
  }

  console.warn(`Unknown OLD component type: ${oldType}, defaulting to 'Text'`);
  return 'Text';
}

/**
 * Convert NEW editor type to OLD database type
 *
 * @param newType - NEW PascalCase type from editor
 * @returns OLD lowercase type for database, or undefined if no mapping exists
 *
 * @example
 * ```typescript
 * const oldType = convertNewToOldType('Section'); // 'hero'
 * const noMapping = convertNewToOldType('Container'); // undefined
 * ```
 */
export function convertNewToOldType(newType: ComponentType): OldComponentType | undefined {
  return NEW_TO_OLD_TYPE_MAP[newType];
}

/**
 * Check if a NEW component type has an OLD equivalent in database
 *
 * @param newType - NEW PascalCase type from editor
 * @returns true if type can be saved to database, false otherwise
 *
 * @example
 * ```typescript
 * hasOldEquivalent('Section'); // true (maps to 'hero')
 * hasOldEquivalent('Container'); // false (new type, no DB mapping)
 * ```
 */
export function hasOldEquivalent(newType: ComponentType): boolean {
  return newType in NEW_TO_OLD_TYPE_MAP;
}

/**
 * Check if a type string is a valid OLD component type
 *
 * @param type - Type string to check
 * @returns true if valid OLD type, false otherwise
 */
export function isOldComponentType(type: string): type is OldComponentType {
  return type in OLD_TO_NEW_TYPE_MAP;
}

/**
 * Check if a type string is a valid NEW component type
 *
 * @param type - Type string to check
 * @returns true if valid NEW type, false otherwise
 */
export function isNewComponentType(type: string): type is ComponentType {
  const validTypes: ComponentType[] = [
    'Button', 'Text', 'Heading', 'Image', 'Input',
    'Container', 'Section', 'Grid', 'Card', 'Form'
  ];
  return validTypes.includes(type as ComponentType);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Migration Status
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get list of NEW component types that don't have OLD equivalents
 * These types can be used in editor but won't persist to database yet
 */
export function getNewOnlyTypes(): ComponentType[] {
  const allTypes: ComponentType[] = [
    'Button', 'Text', 'Heading', 'Image', 'Input',
    'Container', 'Section', 'Grid', 'Card', 'Form'
  ];

  return allTypes.filter(type => !hasOldEquivalent(type));
}

/**
 * Get migration status summary
 * Useful for logging and debugging
 */
export function getMigrationStatus() {
  return {
    oldTypes: Object.keys(OLD_TO_NEW_TYPE_MAP),
    newTypes: ['Button', 'Text', 'Heading', 'Image', 'Input', 'Container', 'Section', 'Grid', 'Card', 'Form'],
    mappedTypes: Object.keys(NEW_TO_OLD_TYPE_MAP),
    newOnlyTypes: getNewOnlyTypes(),
    totalOldTypes: 5,
    totalNewTypes: 10,
    mappedCount: Object.keys(NEW_TO_OLD_TYPE_MAP).length,
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Console Debug Helper
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Make migration status available in browser console for debugging
  (window as Record<string, unknown>).__BUBBLE_GUM_MIGRATION__ = {
    status: getMigrationStatus(),
    convertOldToNew: convertOldToNewType,
    convertNewToOld: convertNewToOldType,
    hasOldEquivalent,
  };
}
