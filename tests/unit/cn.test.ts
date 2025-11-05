// ═══════════════════════════════════════════════════════════════
// CN UTILITY TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade tests for className utility function
// Coverage: String merging, conditionals, arrays, Tailwind conflicts
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn utility function', () => {
  describe('Basic className merging', () => {
    it('should merge multiple className strings', () => {
      const result = cn('foo', 'bar', 'baz');
      expect(result).toBe('foo bar baz');
    });

    it('should handle single className', () => {
      const result = cn('single-class');
      expect(result).toBe('single-class');
    });

    it('should handle empty strings', () => {
      const result = cn('foo', '', 'bar');
      expect(result).toBe('foo bar');
    });

    it('should handle undefined and null values', () => {
      const result = cn('foo', undefined, 'bar', null, 'baz');
      expect(result).toBe('foo bar baz');
    });
  });

  describe('Conditional className merging', () => {
    it('should handle boolean conditions', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base', isActive && 'active', isDisabled && 'disabled');
      expect(result).toBe('base active');
    });

    it('should handle object syntax with conditions', () => {
      const result = cn({
        'base-class': true,
        'active': true,
        'disabled': false,
        'selected': false,
      });
      expect(result).toBe('base-class active');
    });

    it('should handle mixed string and conditional', () => {
      const isPrimary = true;
      const result = cn('btn', isPrimary ? 'btn-primary' : 'btn-secondary');
      expect(result).toBe('btn btn-primary');
    });
  });

  describe('Array className merging', () => {
    it('should handle array of classNames', () => {
      const result = cn(['foo', 'bar', 'baz']);
      expect(result).toBe('foo bar baz');
    });

    it('should handle nested arrays', () => {
      const result = cn('base', ['foo', 'bar'], ['baz']);
      expect(result).toBe('base foo bar baz');
    });

    it('should handle array with conditionals', () => {
      const isActive = true;
      const result = cn(['base', isActive && 'active', false && 'disabled']);
      expect(result).toBe('base active');
    });
  });

  describe('Tailwind CSS class merging', () => {
    it('should merge conflicting Tailwind classes - last wins', () => {
      const result = cn('px-4', 'px-6');
      expect(result).toBe('px-6');
    });

    it('should merge conflicting background colors', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('should merge conflicting text sizes', () => {
      const result = cn('text-sm', 'text-lg', 'text-xl');
      expect(result).toBe('text-xl');
    });

    it('should keep non-conflicting Tailwind classes', () => {
      const result = cn('px-4', 'py-2', 'text-white', 'bg-blue-500');
      expect(result).toBe('px-4 py-2 text-white bg-blue-500');
    });

    it('should merge conflicting responsive classes', () => {
      const result = cn('md:px-4', 'md:px-6');
      expect(result).toBe('md:px-6');
    });

    it('should merge conflicting hover states', () => {
      const result = cn('hover:bg-red-500', 'hover:bg-blue-500');
      expect(result).toBe('hover:bg-blue-500');
    });
  });

  describe('Complex real-world scenarios', () => {
    it('should handle button component with variants', () => {
      const variant: 'primary' | 'secondary' = 'primary';
      const size: 'sm' | 'lg' = 'lg';
      const disabled = false;

      const result = cn(
        'btn',
        'font-semibold',
        'transition-colors',
        (variant as string) === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : '',
        (variant as string) === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : '',
        (size as string) === 'sm' ? 'px-3 py-1 text-sm' : '',
        (size as string) === 'lg' ? 'px-6 py-3 text-lg' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      );

      expect(result).toContain('btn');
      expect(result).toContain('font-semibold');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('px-6 py-3 text-lg');
      expect(result).not.toContain('opacity-50');
    });

    it('should handle card component with conditional states', () => {
      const isHovered = true;
      const isSelected = false;

      const result = cn(
        'card',
        'rounded-lg',
        'border',
        'p-4',
        isHovered && 'shadow-lg scale-105',
        isSelected && 'border-blue-500 ring-2 ring-blue-200'
      );

      expect(result).toContain('card');
      expect(result).toContain('shadow-lg scale-105');
      expect(result).not.toContain('ring-2');
    });

    it('should handle form input with validation states', () => {
      const hasError = true;
      const isFocused = false;

      const result = cn(
        'input',
        'w-full',
        'px-3 py-2',
        'border rounded',
        hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500',
        isFocused && 'ring-2'
      );

      expect(result).toContain('border-red-500');
      expect(result).toContain('focus:ring-red-500');
      expect(result).not.toContain('ring-2');
    });

    it('should handle empty input gracefully', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle all falsy values', () => {
      const result = cn(false, null, undefined, 0, '', NaN);
      // clsx filters out false, null, undefined, and empty strings
      // Only 0 and NaN are treated as strings (though NaN is filtered)
      expect(result).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle duplicate classes', () => {
      const result = cn('foo', 'bar', 'foo', 'baz');
      // cn doesn't deduplicate non-conflicting classes, maintains order
      expect(result).toBe('foo bar foo baz');
    });

    it('should handle extremely long className strings', () => {
      const longClass = 'a'.repeat(1000);
      const result = cn(longClass, 'short');
      expect(result).toContain('short');
      expect(result.length).toBeGreaterThan(1000);
    });

    it('should handle special characters in class names', () => {
      const result = cn('foo-bar', 'baz_qux', 'test:hover', 'md:test');
      expect(result).toBe('foo-bar baz_qux test:hover md:test');
    });
  });
});
