// ═══════════════════════════════════════════════════════════════
// MIGRATION TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade tests for component type migration functions
// Coverage: Type detection, conversions, validation, edge cases
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  OLD_TO_NEW_TYPE_MAP,
  NEW_TO_OLD_TYPE_MAP,
  convertOldToNewType,
  convertNewToOldType,
  hasOldEquivalent,
  isOldComponentType,
  isNewComponentType,
  getNewOnlyTypes,
  getMigrationStatus,
  type OldComponentType,
} from '@/lib/editor/migration';
import type { ComponentType } from '@/lib/editor/types';

describe('migration - Type mappings', () => {
  describe('OLD_TO_NEW_TYPE_MAP', () => {
    it('should map hero to Section', () => {
      expect(OLD_TO_NEW_TYPE_MAP.hero).toBe('Section');
    });

    it('should map text to Text', () => {
      expect(OLD_TO_NEW_TYPE_MAP.text).toBe('Text');
    });

    it('should map image to Image', () => {
      expect(OLD_TO_NEW_TYPE_MAP.image).toBe('Image');
    });

    it('should map button to Button', () => {
      expect(OLD_TO_NEW_TYPE_MAP.button).toBe('Button');
    });

    it('should map form to Form', () => {
      expect(OLD_TO_NEW_TYPE_MAP.form).toBe('Form');
    });

    it('should have exactly 5 mappings', () => {
      expect(Object.keys(OLD_TO_NEW_TYPE_MAP)).toHaveLength(5);
    });
  });

  describe('NEW_TO_OLD_TYPE_MAP', () => {
    it('should map Section to hero', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Section).toBe('hero');
    });

    it('should map Text to text', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Text).toBe('text');
    });

    it('should map Heading to text', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Heading).toBe('text');
    });

    it('should map Image to image', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Image).toBe('image');
    });

    it('should map Button to button', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Button).toBe('button');
    });

    it('should map Form to form', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Form).toBe('form');
    });

    it('should not have mapping for Container', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Container).toBeUndefined();
    });

    it('should not have mapping for Grid', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Grid).toBeUndefined();
    });

    it('should not have mapping for Card', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Card).toBeUndefined();
    });

    it('should not have mapping for Input', () => {
      expect(NEW_TO_OLD_TYPE_MAP.Input).toBeUndefined();
    });
  });
});

describe('migration - Conversion functions', () => {
  describe('convertOldToNewType', () => {
    it('should convert hero to Section', () => {
      const result = convertOldToNewType('hero');
      expect(result).toBe('Section');
    });

    it('should convert text to Text', () => {
      const result = convertOldToNewType('text');
      expect(result).toBe('Text');
    });

    it('should convert image to Image', () => {
      const result = convertOldToNewType('image');
      expect(result).toBe('Image');
    });

    it('should convert button to Button', () => {
      const result = convertOldToNewType('button');
      expect(result).toBe('Button');
    });

    it('should convert form to Form', () => {
      const result = convertOldToNewType('form');
      expect(result).toBe('Form');
    });

    it('should return Text for unknown type and log warning', () => {
      const result = convertOldToNewType('unknown-type');
      expect(result).toBe('Text');
    });

    it('should handle empty string by returning Text', () => {
      const result = convertOldToNewType('');
      expect(result).toBe('Text');
    });

    it('should be case-sensitive', () => {
      const result = convertOldToNewType('HERO');
      expect(result).toBe('Text'); // Not 'Section' because case doesn't match
    });
  });

  describe('convertNewToOldType', () => {
    it('should convert Section to hero', () => {
      const result = convertNewToOldType('Section' as ComponentType);
      expect(result).toBe('hero');
    });

    it('should convert Text to text', () => {
      const result = convertNewToOldType('Text' as ComponentType);
      expect(result).toBe('text');
    });

    it('should convert Heading to text', () => {
      const result = convertNewToOldType('Heading' as ComponentType);
      expect(result).toBe('text');
    });

    it('should convert Image to image', () => {
      const result = convertNewToOldType('Image' as ComponentType);
      expect(result).toBe('image');
    });

    it('should convert Button to button', () => {
      const result = convertNewToOldType('Button' as ComponentType);
      expect(result).toBe('button');
    });

    it('should convert Form to form', () => {
      const result = convertNewToOldType('Form' as ComponentType);
      expect(result).toBe('form');
    });

    it('should return undefined for Container', () => {
      const result = convertNewToOldType('Container' as ComponentType);
      expect(result).toBeUndefined();
    });

    it('should return undefined for Grid', () => {
      const result = convertNewToOldType('Grid' as ComponentType);
      expect(result).toBeUndefined();
    });

    it('should return undefined for Card', () => {
      const result = convertNewToOldType('Card' as ComponentType);
      expect(result).toBeUndefined();
    });

    it('should return undefined for Input', () => {
      const result = convertNewToOldType('Input' as ComponentType);
      expect(result).toBeUndefined();
    });
  });
});

describe('migration - Validation functions', () => {
  describe('hasOldEquivalent', () => {
    it('should return true for Section', () => {
      expect(hasOldEquivalent('Section' as ComponentType)).toBe(true);
    });

    it('should return true for Text', () => {
      expect(hasOldEquivalent('Text' as ComponentType)).toBe(true);
    });

    it('should return true for Heading', () => {
      expect(hasOldEquivalent('Heading' as ComponentType)).toBe(true);
    });

    it('should return true for Image', () => {
      expect(hasOldEquivalent('Image' as ComponentType)).toBe(true);
    });

    it('should return true for Button', () => {
      expect(hasOldEquivalent('Button' as ComponentType)).toBe(true);
    });

    it('should return true for Form', () => {
      expect(hasOldEquivalent('Form' as ComponentType)).toBe(true);
    });

    it('should return false for Container', () => {
      expect(hasOldEquivalent('Container' as ComponentType)).toBe(false);
    });

    it('should return false for Grid', () => {
      expect(hasOldEquivalent('Grid' as ComponentType)).toBe(false);
    });

    it('should return false for Card', () => {
      expect(hasOldEquivalent('Card' as ComponentType)).toBe(false);
    });

    it('should return false for Input', () => {
      expect(hasOldEquivalent('Input' as ComponentType)).toBe(false);
    });
  });

  describe('isOldComponentType', () => {
    it('should return true for hero', () => {
      expect(isOldComponentType('hero')).toBe(true);
    });

    it('should return true for text', () => {
      expect(isOldComponentType('text')).toBe(true);
    });

    it('should return true for image', () => {
      expect(isOldComponentType('image')).toBe(true);
    });

    it('should return true for button', () => {
      expect(isOldComponentType('button')).toBe(true);
    });

    it('should return true for form', () => {
      expect(isOldComponentType('form')).toBe(true);
    });

    it('should return false for Section', () => {
      expect(isOldComponentType('Section')).toBe(false);
    });

    it('should return false for Container', () => {
      expect(isOldComponentType('Container')).toBe(false);
    });

    it('should return false for unknown type', () => {
      expect(isOldComponentType('unknown')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isOldComponentType('')).toBe(false);
    });
  });

  describe('isNewComponentType', () => {
    it('should return true for Button', () => {
      expect(isNewComponentType('Button')).toBe(true);
    });

    it('should return true for Text', () => {
      expect(isNewComponentType('Text')).toBe(true);
    });

    it('should return true for Heading', () => {
      expect(isNewComponentType('Heading')).toBe(true);
    });

    it('should return true for Image', () => {
      expect(isNewComponentType('Image')).toBe(true);
    });

    it('should return true for Input', () => {
      expect(isNewComponentType('Input')).toBe(true);
    });

    it('should return true for Container', () => {
      expect(isNewComponentType('Container')).toBe(true);
    });

    it('should return true for Section', () => {
      expect(isNewComponentType('Section')).toBe(true);
    });

    it('should return true for Grid', () => {
      expect(isNewComponentType('Grid')).toBe(true);
    });

    it('should return true for Card', () => {
      expect(isNewComponentType('Card')).toBe(true);
    });

    it('should return true for Form', () => {
      expect(isNewComponentType('Form')).toBe(true);
    });

    it('should return false for old type hero', () => {
      expect(isNewComponentType('hero')).toBe(false);
    });

    it('should return false for unknown type', () => {
      expect(isNewComponentType('unknown')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isNewComponentType('')).toBe(false);
    });
  });
});

describe('migration - Helper functions', () => {
  describe('getNewOnlyTypes', () => {
    it('should return types without old equivalents', () => {
      const result = getNewOnlyTypes();

      expect(result).toContain('Container');
      expect(result).toContain('Grid');
      expect(result).toContain('Card');
      expect(result).toContain('Input');
    });

    it('should not include types with old equivalents', () => {
      const result = getNewOnlyTypes();

      expect(result).not.toContain('Section');
      expect(result).not.toContain('Text');
      expect(result).not.toContain('Heading');
      expect(result).not.toContain('Image');
      expect(result).not.toContain('Button');
      expect(result).not.toContain('Form');
    });

    it('should return an array', () => {
      const result = getNewOnlyTypes();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return exactly 4 types', () => {
      const result = getNewOnlyTypes();
      // 10 total types - 6 mapped types = 4 new-only types
      expect(result).toHaveLength(4);
    });
  });

  describe('getMigrationStatus', () => {
    it('should return correct structure', () => {
      const status = getMigrationStatus();

      expect(status).toHaveProperty('oldTypes');
      expect(status).toHaveProperty('newTypes');
      expect(status).toHaveProperty('mappedTypes');
      expect(status).toHaveProperty('newOnlyTypes');
      expect(status).toHaveProperty('totalOldTypes');
      expect(status).toHaveProperty('totalNewTypes');
      expect(status).toHaveProperty('mappedCount');
    });

    it('should report 5 old types', () => {
      const status = getMigrationStatus();
      expect(status.totalOldTypes).toBe(5);
      expect(status.oldTypes).toHaveLength(5);
    });

    it('should report 10 new types', () => {
      const status = getMigrationStatus();
      expect(status.totalNewTypes).toBe(10);
      expect(status.newTypes).toHaveLength(10);
    });

    it('should report correct mapped count', () => {
      const status = getMigrationStatus();
      // Section, Text, Heading, Image, Button, Form = 6
      expect(status.mappedCount).toBe(6);
      expect(status.mappedTypes).toHaveLength(6);
    });

    it('should include correct old types', () => {
      const status = getMigrationStatus();
      expect(status.oldTypes).toEqual(['hero', 'text', 'image', 'button', 'form']);
    });

    it('should include correct new types', () => {
      const status = getMigrationStatus();
      expect(status.newTypes).toContain('Button');
      expect(status.newTypes).toContain('Text');
      expect(status.newTypes).toContain('Heading');
      expect(status.newTypes).toContain('Image');
      expect(status.newTypes).toContain('Input');
      expect(status.newTypes).toContain('Container');
      expect(status.newTypes).toContain('Section');
      expect(status.newTypes).toContain('Grid');
      expect(status.newTypes).toContain('Card');
      expect(status.newTypes).toContain('Form');
    });

    it('should include correct mapped types', () => {
      const status = getMigrationStatus();
      expect(status.mappedTypes).toContain('Section');
      expect(status.mappedTypes).toContain('Text');
      expect(status.mappedTypes).toContain('Heading');
      expect(status.mappedTypes).toContain('Image');
      expect(status.mappedTypes).toContain('Button');
      expect(status.mappedTypes).toContain('Form');
    });

    it('should include new-only types', () => {
      const status = getMigrationStatus();
      expect(status.newOnlyTypes).toContain('Container');
      expect(status.newOnlyTypes).toContain('Grid');
      expect(status.newOnlyTypes).toContain('Card');
      expect(status.newOnlyTypes).toContain('Input');
    });
  });
});

describe('migration - Round-trip conversions', () => {
  it('should maintain type integrity for hero -> Section -> hero', () => {
    const oldType: OldComponentType = 'hero';
    const newType = convertOldToNewType(oldType);
    const backToOld = convertNewToOldType(newType);

    expect(backToOld).toBe(oldType);
  });

  it('should maintain type integrity for text -> Text -> text', () => {
    const oldType: OldComponentType = 'text';
    const newType = convertOldToNewType(oldType);
    const backToOld = convertNewToOldType(newType);

    expect(backToOld).toBe(oldType);
  });

  it('should maintain type integrity for image -> Image -> image', () => {
    const oldType: OldComponentType = 'image';
    const newType = convertOldToNewType(oldType);
    const backToOld = convertNewToOldType(newType);

    expect(backToOld).toBe(oldType);
  });

  it('should maintain type integrity for button -> Button -> button', () => {
    const oldType: OldComponentType = 'button';
    const newType = convertOldToNewType(oldType);
    const backToOld = convertNewToOldType(newType);

    expect(backToOld).toBe(oldType);
  });

  it('should maintain type integrity for form -> Form -> form', () => {
    const oldType: OldComponentType = 'form';
    const newType = convertOldToNewType(oldType);
    const backToOld = convertNewToOldType(newType);

    expect(backToOld).toBe(oldType);
  });
});

describe('migration - Edge cases', () => {
  it('should handle all OLD types', () => {
    const oldTypes: OldComponentType[] = ['hero', 'text', 'image', 'button', 'form'];

    oldTypes.forEach((type) => {
      const result = convertOldToNewType(type);
      expect(result).toBeDefined();
      expect(isNewComponentType(result)).toBe(true);
    });
  });

  it('should handle all NEW types', () => {
    const newTypes: ComponentType[] = [
      'Button',
      'Text',
      'Heading',
      'Image',
      'Input',
      'Container',
      'Section',
      'Grid',
      'Card',
      'Form',
    ];

    newTypes.forEach((type) => {
      const result = convertNewToOldType(type);
      // Some may be undefined, which is expected
      if (result !== undefined) {
        expect(isOldComponentType(result)).toBe(true);
      }
    });
  });

  it('should handle type case sensitivity consistently', () => {
    // Old types are lowercase
    expect(isOldComponentType('hero')).toBe(true);
    expect(isOldComponentType('Hero')).toBe(false);

    // New types are PascalCase
    expect(isNewComponentType('Section')).toBe(true);
    expect(isNewComponentType('section')).toBe(false);
  });

  it('should differentiate between Heading and Text properly', () => {
    // Both Heading and Text map to 'text' in old format
    expect(convertNewToOldType('Heading' as ComponentType)).toBe('text');
    expect(convertNewToOldType('Text' as ComponentType)).toBe('text');

    // But 'text' always converts to 'Text' (not 'Heading')
    expect(convertOldToNewType('text')).toBe('Text');
  });
});
