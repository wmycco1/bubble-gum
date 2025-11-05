// ═══════════════════════════════════════════════════════════════
// RESPONSIVE SYSTEM TESTS
// ═══════════════════════════════════════════════════════════════
// Tests for responsive breakpoint system and style resolution
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { getResponsiveStyles, BREAKPOINTS, type ComponentStyle, type Breakpoint } from '@/lib/editor/types';

describe('Responsive System', () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Breakpoint Constants
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('BREAKPOINTS', () => {
    it('should have correct breakpoint values', () => {
      expect(BREAKPOINTS.desktop.min).toBe(1024);
      expect(BREAKPOINTS.tablet.min).toBe(768);
      expect(BREAKPOINTS.mobile.min).toBe(0);
    });

    it('should have labels and icons', () => {
      expect(BREAKPOINTS.desktop.label).toBe('Desktop');
      expect(BREAKPOINTS.tablet.label).toBe('Tablet');
      expect(BREAKPOINTS.mobile.label).toBe('Mobile');

      expect(BREAKPOINTS.desktop.icon).toBeTruthy();
      expect(BREAKPOINTS.tablet.icon).toBeTruthy();
      expect(BREAKPOINTS.mobile.icon).toBeTruthy();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // getResponsiveStyles Function
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('getResponsiveStyles', () => {
    it('should return desktop styles unchanged', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        color: '#000000',
        padding: '1rem',
      };

      const resolved = getResponsiveStyles(style, 'desktop');

      expect(resolved.fontSize).toBe('1rem');
      expect(resolved.color).toBe('#000000');
      expect(resolved.padding).toBe('1rem');
    });

    it('should merge tablet overrides', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        color: '#000000',
        padding: '1rem',
        tablet: {
          fontSize: '0.875rem',
          padding: '0.75rem',
        },
      };

      const resolved = getResponsiveStyles(style, 'tablet');

      expect(resolved.fontSize).toBe('0.875rem'); // Overridden
      expect(resolved.color).toBe('#000000'); // Inherited
      expect(resolved.padding).toBe('0.75rem'); // Overridden
    });

    it('should merge mobile overrides with inheritance', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        color: '#000000',
        padding: '1rem',
        tablet: {
          fontSize: '0.875rem',
        },
        mobile: {
          padding: '0.5rem',
        },
      };

      const resolved = getResponsiveStyles(style, 'mobile');

      expect(resolved.fontSize).toBe('0.875rem'); // Inherited from tablet
      expect(resolved.color).toBe('#000000'); // Inherited from desktop
      expect(resolved.padding).toBe('0.5rem'); // Mobile override
    });

    it('should handle empty tablet/mobile objects', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        color: '#000000',
        tablet: {},
        mobile: {},
      };

      const tabletResolved = getResponsiveStyles(style, 'tablet');
      const mobileResolved = getResponsiveStyles(style, 'mobile');

      expect(tabletResolved.fontSize).toBe('1rem');
      expect(mobileResolved.fontSize).toBe('1rem');
    });

    it('should not include responsive keys in resolved styles', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        tablet: { fontSize: '0.875rem' },
        mobile: { fontSize: '0.75rem' },
      };

      const resolved = getResponsiveStyles(style, 'mobile');

      expect(resolved).not.toHaveProperty('tablet');
      expect(resolved).not.toHaveProperty('mobile');
    });

    it('should handle all breakpoint values', () => {
      const style: ComponentStyle = {
        fontSize: '1rem',
        tablet: { fontSize: '0.875rem' },
        mobile: { fontSize: '0.75rem' },
      };

      const breakpoints: Breakpoint[] = ['desktop', 'tablet', 'mobile'];

      breakpoints.forEach((breakpoint) => {
        const resolved = getResponsiveStyles(style, breakpoint);
        expect(resolved).toHaveProperty('fontSize');
        expect(typeof resolved.fontSize).toBe('string');
      });
    });

    it('should handle complex style inheritance', () => {
      const style: ComponentStyle = {
        // Desktop base
        fontSize: '1.5rem',
        fontWeight: '700',
        lineHeight: '1.2',
        margin: '2rem',
        padding: '2rem',
        color: '#000000',

        // Tablet overrides
        tablet: {
          fontSize: '1.25rem',
          margin: '1.5rem',
          padding: '1.5rem',
        },

        // Mobile overrides
        mobile: {
          fontSize: '1rem',
          margin: '1rem',
        },
      };

      // Desktop: all base styles
      const desktop = getResponsiveStyles(style, 'desktop');
      expect(desktop.fontSize).toBe('1.5rem');
      expect(desktop.fontWeight).toBe('700');
      expect(desktop.margin).toBe('2rem');
      expect(desktop.padding).toBe('2rem');

      // Tablet: override fontSize, margin, padding; inherit fontWeight, lineHeight, color
      const tablet = getResponsiveStyles(style, 'tablet');
      expect(tablet.fontSize).toBe('1.25rem');
      expect(tablet.fontWeight).toBe('700'); // Inherited
      expect(tablet.lineHeight).toBe('1.2'); // Inherited
      expect(tablet.margin).toBe('1.5rem');
      expect(tablet.padding).toBe('1.5rem');
      expect(tablet.color).toBe('#000000'); // Inherited

      // Mobile: override fontSize, margin; inherit padding from tablet; inherit others from desktop
      const mobile = getResponsiveStyles(style, 'mobile');
      expect(mobile.fontSize).toBe('1rem');
      expect(mobile.fontWeight).toBe('700'); // Inherited from desktop
      expect(mobile.lineHeight).toBe('1.2'); // Inherited from desktop
      expect(mobile.margin).toBe('1rem');
      expect(mobile.padding).toBe('1.5rem'); // Inherited from tablet
      expect(mobile.color).toBe('#000000'); // Inherited from desktop
    });
  });
});
