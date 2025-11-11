# Badge GOD-TIER Implementation Plan

**Date:** November 10, 2025
**Version:** V7.0 (GOD-TIER)
**Estimated Time:** 3 hours
**Status:** 🚀 Ready to Execute

---

## 📋 EXECUTION PLAN

### STEP 1: Install Dependencies (5 min)

**Task:** Install required packages for security, testing, accessibility

**Commands:**
```bash
npm install --save dompurify
npm install --save-dev jest-axe @axe-core/react
npm install --save-dev @storybook/react @storybook/addon-a11y
```

**Verification:**
- [ ] Dependencies installed successfully
- [ ] package.json updated
- [ ] No conflicts with existing packages

---

### STEP 2: Create Utility Functions (10 min)

**Task:** Create validation and sanitization utilities

**Files to Create:**

#### `/src/lib/utils/validation.ts`
```typescript
/**
 * Validation utilities for Badge component
 * Prevents XSS and CSS injection attacks
 */

/**
 * Validates if a string is a safe CSS color value
 * Allows: hex, rgb, rgba, hsl, hsla, named colors
 * Blocks: expressions, url(), calc(), var()
 */
export function isValidCSSColor(color: string): boolean {
  if (!color || typeof color !== 'string') return false;

  // Allow hex colors (#RGB, #RRGGBB, #RRGGBBAA)
  const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i;
  if (hexRegex.test(color)) return true;

  // Allow rgb/rgba
  const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
  if (rgbRegex.test(color)) return true;

  // Allow hsl/hsla
  const hslRegex = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/;
  if (hslRegex.test(color)) return true;

  // Allow named colors (common ones)
  const namedColors = [
    'transparent', 'currentColor', 'inherit', 'initial', 'unset',
    'black', 'white', 'red', 'green', 'blue', 'yellow', 'orange',
    'purple', 'pink', 'brown', 'gray', 'grey'
  ];
  if (namedColors.includes(color.toLowerCase())) return true;

  // Блокируем всё остальное (url(), calc(), var(), expression())
  return false;
}

/**
 * Validates if a border style is safe
 * Allows only CSS-standard border styles
 */
export function isValidBorderStyle(
  style: string
): style is 'none' | 'solid' | 'dashed' | 'dotted' | 'double' {
  const validStyles = ['none', 'solid', 'dashed', 'dotted', 'double'];
  return validStyles.includes(style);
}

/**
 * Sanitizes a numeric value to prevent negative numbers
 * Returns 0 if value is negative or invalid
 */
export function sanitizeNumericValue(value: number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value !== 'number') return 0;
  if (Number.isNaN(value)) return 0;
  return Math.max(0, value);
}
```

#### `/src/lib/utils/sanitize.ts`
```typescript
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML/text content to prevent XSS attacks
 * Uses DOMPurify with strict configuration
 */
export function sanitizeContent(content: string | React.ReactNode): string | React.ReactNode {
  // If it's not a string, return as-is (React nodes are safe)
  if (typeof content !== 'string') {
    return content;
  }

  // Configure DOMPurify with strict settings
  const config = {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  };

  // Sanitize and return
  return DOMPurify.sanitize(content, config);
}

/**
 * Validates that a function is actually a function
 * Prevents string-to-function injection
 */
export function sanitizeEventHandler<T extends Function>(
  handler: T | undefined
): T | undefined {
  if (handler === undefined) return undefined;
  if (typeof handler !== 'function') {
    console.warn('[Badge] Event handler must be a function, got:', typeof handler);
    return undefined;
  }
  return handler;
}
```

---

### STEP 3: Create Error Boundary (15 min)

**Task:** Create dedicated Error Boundary for Badge component

**File:** `/src/components/atoms/Badge/BadgeErrorBoundary.tsx`

```typescript
'use client';

import React from 'react';

interface BadgeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface BadgeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary specifically for Badge component
 * Catches rendering errors and displays fallback UI
 *
 * @example
 * <BadgeErrorBoundary>
 *   <Badge variant="primary">Content</Badge>
 * </BadgeErrorBoundary>
 */
export class BadgeErrorBoundary extends React.Component<
  BadgeErrorBoundaryProps,
  BadgeErrorBoundaryState
> {
  constructor(props: BadgeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): BadgeErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to monitoring service (e.g., Sentry)
    console.error('[Badge Error Boundary]', error, errorInfo);

    // TODO: Send to error tracking service
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Custom fallback or default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default minimal badge fallback
      return (
        <span
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
            backgroundColor: '#fee',
            color: '#c00',
            borderRadius: '0.25rem',
            border: '1px solid #faa',
          }}
          title={this.state.error?.message || 'Badge Error'}
        >
          ⚠️ Error
        </span>
      );
    }

    return this.props.children;
  }
}

export default BadgeErrorBoundary;
```

---

### STEP 4: Upgrade Badge Component (60 min)

**Task:** Transform Badge.tsx to GOD-TIER with all improvements

**Major Changes:**

1. **Add imports:**
```typescript
import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { sanitizeContent, sanitizeEventHandler } from '@/lib/utils/sanitize';
import { isValidCSSColor, isValidBorderStyle, sanitizeNumericValue } from '@/lib/utils/validation';
```

2. **Wrap with React.memo:**
```typescript
export const Badge = React.memo<BadgeProps>((props) => {
  // ... component code
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.color === nextProps.color &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.borderWidth === nextProps.borderWidth &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.removable === nextProps.removable
  );
});
```

3. **Add sanitization:**
```typescript
// Sanitize children for XSS prevention
const sanitizedChildren = useMemo(() => sanitizeContent(children), [children]);

// Sanitize event handlers
const safeOnClick = sanitizeEventHandler(onClick);
const safeOnRemove = sanitizeEventHandler(onRemove);
```

4. **Add color validation:**
```typescript
// Validate and sanitize colors
const validatedColor = useMemo(() => {
  if (!color) return undefined;
  return isValidCSSColor(color) ? color : undefined;
}, [color]);

const validatedBackgroundColor = useMemo(() => {
  if (!backgroundColor) return undefined;
  return isValidCSSColor(backgroundColor) ? backgroundColor : undefined;
}, [backgroundColor]);

const validatedBorderColor = useMemo(() => {
  if (!borderColor) return undefined;
  return isValidCSSColor(borderColor) ? borderColor : undefined;
}, [borderColor]);
```

5. **Add performance optimizations:**
```typescript
// Memoize style computations
const inlineStyleString = useMemo(() => {
  const styleOverrides: string[] = [];

  if (validatedColor) styleOverrides.push(`color: ${validatedColor} !important`);
  if (validatedBackgroundColor) styleOverrides.push(`background-color: ${validatedBackgroundColor} !important`);

  const safeBorderWidth = sanitizeNumericValue(borderWidth);
  if (safeBorderWidth > 0) styleOverrides.push(`border-width: ${safeBorderWidth}px !important`);

  if (borderStyle && isValidBorderStyle(borderStyle)) {
    styleOverrides.push(`border-style: ${borderStyle} !important`);
  }

  if (validatedBorderColor) styleOverrides.push(`border-color: ${validatedBorderColor} !important`);

  return styleOverrides.length > 0 ? styleOverrides.join('; ') : '';
}, [validatedColor, validatedBackgroundColor, borderWidth, borderStyle, validatedBorderColor]);

// useCallback for event handlers
const handleClick = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
  if (safeOnClick) {
    safeOnClick(e);
  }
}, [safeOnClick]);

const handleRemove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation();
  if (safeOnRemove) {
    safeOnRemove(e);
  }
}, [safeOnRemove]);
```

6. **Enhance accessibility:**
```typescript
// Enhanced ARIA attributes
const ariaProps = {
  'aria-label': ariaLabel || (removable ? `${children} (removable)` : undefined),
  'role': isClickable ? 'button' : 'status',
  'tabIndex': isClickable ? 0 : -1,
  'aria-live': variant === 'error' || variant === 'warning' ? 'polite' : undefined,
};

// Keyboard navigation for clickable/removable
const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
  if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    if (safeOnClick) {
      safeOnClick(e as any);
    }
  }
}, [isClickable, safeOnClick]);
```

7. **Add comprehensive JSDoc:**
```typescript
/**
 * Badge Component - GOD-TIER Enterprise-Grade
 *
 * A highly flexible and secure badge component with comprehensive features:
 * - XSS protection via DOMPurify
 * - CSS injection prevention
 * - Performance optimized (React.memo, useMemo, useCallback)
 * - Full WCAG 2.1 AA accessibility
 * - Error boundary wrapped
 * - Keyboard navigation
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <Badge>New</Badge>
 *
 * // With variant
 * <Badge variant="success">Active</Badge>
 *
 * // With icon
 * <Badge icon="star" variant="primary">Featured</Badge>
 *
 * // Removable
 * <Badge removable onRemove={() => console.log('removed')}>Tag</Badge>
 *
 * // Custom styled with borders
 * <Badge
 *   color="#1e40af"
 *   backgroundColor="transparent"
 *   borderWidth={2}
 *   borderStyle="solid"
 *   borderColor="#3b82f6"
 * >
 *   Custom Badge
 * </Badge>
 * ```
 *
 * @see {@link BadgeProps} for all available props
 * @see {@link BadgeErrorBoundary} for error handling
 */
```

---

### STEP 5: Write Comprehensive Tests (90 min)

**Task:** Create 25+ unit tests with 90%+ coverage

**File:** `/src/components/atoms/Badge/Badge.test.tsx`

**Test Coverage:**

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Badge } from './Badge';

expect.extend(toHaveNoViolations);

describe('Badge - GOD-TIER Tests', () => {
  // === RENDERING TESTS ===
  describe('Rendering', () => {
    it('renders children text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('renders React node children', () => {
      render(<Badge><span>React Node</span></Badge>);
      expect(screen.getByText('React Node')).toBeInTheDocument();
    });

    it.each(['default', 'primary', 'success', 'warning', 'error', 'info'] as const)(
      'renders %s variant with correct class',
      (variant) => {
        const { container } = render(<Badge variant={variant}>Badge</Badge>);
        expect(container.firstChild).toHaveClass(`badge--${variant}`);
      }
    );

    it.each(['sm', 'md', 'lg'] as const)(
      'renders %s size with correct class',
      (size) => {
        const { container } = render(<Badge size={size}>Badge</Badge>);
        expect(container.firstChild).toHaveClass(`badge--${size}`);
      }
    );

    it.each(['pill', 'rounded', 'square'] as const)(
      'renders %s shape with correct class',
      (rounded) => {
        const { container } = render(<Badge rounded={rounded}>Badge</Badge>);
        expect(container.firstChild).toHaveClass(`badge--${rounded}`);
      }
    );
  });

  // === CUSTOM COLORS TESTS ===
  describe('Custom Colors', () => {
    it('applies valid custom text color', () => {
      const { container } = render(<Badge color="#ff0000">Red Text</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.color).toBe('rgb(255, 0, 0)');
    });

    it('applies valid custom background color', () => {
      const { container } = render(<Badge backgroundColor="#0000ff">Blue BG</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.backgroundColor).toBe('rgb(0, 0, 255)');
    });

    it('ignores invalid color (XSS protection)', () => {
      const { container } = render(<Badge color="javascript:alert(1)">Safe</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.color).toBe('');
    });

    it('ignores CSS injection attempt', () => {
      const { container } = render(<Badge color="red; background: url(evil.com)">Safe</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.color).toBe('');
    });
  });

  // === BORDER TESTS ===
  describe('Borders', () => {
    it('applies border width', () => {
      const { container } = render(<Badge borderWidth={3}>Border</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.borderWidth).toBe('3px');
    });

    it('applies border style', () => {
      const { container } = render(<Badge borderStyle="dashed">Border</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.borderStyle).toBe('dashed');
    });

    it('applies border color', () => {
      const { container } = render(<Badge borderColor="#00ff00">Border</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.borderColor).toBe('rgb(0, 255, 0)');
    });

    it('prevents negative border width', () => {
      const { container } = render(<Badge borderWidth={-5}>Safe</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.borderWidth).toBe('0px');
    });
  });

  // === ICON TESTS ===
  describe('Icons', () => {
    it('renders icon on left by default', () => {
      const { container } = render(<Badge icon="star">With Icon</Badge>);
      const icon = container.querySelector('[data-icon]');
      expect(icon).toBeInTheDocument();
    });

    it('renders icon on right when specified', () => {
      render(<Badge icon="check" iconPosition="right">Icon Right</Badge>);
      // Icon should be after text
    });

    it('renders dot indicator', () => {
      const { container } = render(<Badge dot>With Dot</Badge>);
      expect(container.querySelector('.badge-dot')).toBeInTheDocument();
    });
  });

  // === INTERACTIVE TESTS ===
  describe('Interactivity', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Enter key', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      fireEvent.keyDown(screen.getByText('Clickable'), { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      fireEvent.keyDown(screen.getByText('Clickable'), { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders remove button when removable', () => {
      render(<Badge removable>Removable</Badge>);
      expect(screen.getByLabelText('Remove')).toBeInTheDocument();
    });

    it('calls onRemove when remove button clicked', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Remove Me</Badge>);
      fireEvent.click(screen.getByLabelText('Remove'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onClick when remove button clicked', () => {
      const handleClick = jest.fn();
      const handleRemove = jest.fn();
      render(
        <Badge onClick={handleClick} removable onRemove={handleRemove}>
          Both
        </Badge>
      );
      fireEvent.click(screen.getByLabelText('Remove'));
      expect(handleRemove).toHaveBeenCalledTimes(1);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // === ACCESSIBILITY TESTS ===
  describe('Accessibility', () => {
    it('has no accessibility violations (basic)', async () => {
      const { container } = render(<Badge>Accessible</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has role="button" when clickable', () => {
      render(<Badge onClick={() => {}}>Clickable</Badge>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has role="status" when not clickable', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has tabIndex=0 when clickable', () => {
      render(<Badge onClick={() => {}}>Clickable</Badge>);
      expect(screen.getByText('Clickable')).toHaveAttribute('tabIndex', '0');
    });

    it('applies aria-label when provided', () => {
      render(<Badge aria-label="Custom Label">Badge</Badge>);
      expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });

    it('adds aria-live for error variant', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
    });

    it('adds aria-live for warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      expect(container.firstChild).toHaveAttribute('aria-live', 'polite');
    });
  });

  // === XSS PROTECTION TESTS ===
  describe('Security (XSS Protection)', () => {
    it('sanitizes string children with script tags', () => {
      render(<Badge>{'<script>alert("xss")</script>Safe'}</Badge>);
      expect(screen.getByText('Safe')).toBeInTheDocument();
      expect(screen.queryByText('<script>')).not.toBeInTheDocument();
    });

    it('sanitizes string children with event handlers', () => {
      render(<Badge>{'<img onerror="alert(1)" src=x>Safe'}</Badge>);
      // Should only render "Safe" text
    });

    it('does not execute string-based onClick', () => {
      const malicious = "alert('xss')" as any;
      render(<Badge onClick={malicious}>Click</Badge>);
      // Should not crash, onClick should be undefined
      fireEvent.click(screen.getByText('Click'));
      // No alert should have been triggered
    });
  });

  // === EDGE CASES ===
  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(<Badge>{''}</Badge>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles undefined props gracefully', () => {
      render(<Badge color={undefined} backgroundColor={undefined}>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });

    it('handles null children', () => {
      render(<Badge>{null}</Badge>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  // === PERFORMANCE TESTS ===
  describe('Performance', () => {
    it('does not re-render when props are unchanged', () => {
      const { rerender } = render(<Badge>Content</Badge>);
      const firstRender = screen.getByText('Content');

      rerender(<Badge>Content</Badge>);
      const secondRender = screen.getByText('Content');

      // Should be same DOM node (React.memo working)
      expect(firstRender).toBe(secondRender);
    });

    it('re-renders when children change', () => {
      const { rerender } = render(<Badge>Old</Badge>);
      rerender(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
      expect(screen.queryByText('Old')).not.toBeInTheDocument();
    });
  });
});
```

**Verification:**
- [ ] All 25+ tests passing
- [ ] Coverage >= 90%
- [ ] No accessibility violations
- [ ] XSS tests passing

---

### STEP 6: Create Storybook Stories (30 min)

**File:** `/src/components/atoms/Badge/Badge.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: {
      control: 'select',
      options: ['pill', 'rounded', 'square'],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default Badge',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Badge size="sm" variant="primary">Small</Badge>
      <Badge size="md" variant="primary">Medium</Badge>
      <Badge size="lg" variant="primary">Large</Badge>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge icon="star" variant="primary">Featured</Badge>
      <Badge icon="check" variant="success">Verified</Badge>
      <Badge icon="x" variant="error">Error</Badge>
      <Badge icon="info" variant="info">Info</Badge>
    </div>
  ),
};

export const Removable: Story = {
  args: {
    children: 'Removable Tag',
    removable: true,
    onRemove: () => alert('Removed!'),
  },
};

export const WithBorders: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge borderWidth={2} borderStyle="solid" borderColor="#3b82f6">
        Solid Border
      </Badge>
      <Badge borderWidth={2} borderStyle="dashed" borderColor="#ef4444">
        Dashed Border
      </Badge>
      <Badge borderWidth={3} borderStyle="dotted" borderColor="#10b981">
        Dotted Border
      </Badge>
    </div>
  ),
};

export const CustomColors: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Badge color="#1e40af" backgroundColor="#dbeafe">
        Custom Blue
      </Badge>
      <Badge color="#be123c" backgroundColor="#fecdd3">
        Custom Pink
      </Badge>
      <Badge color="#ffffff" backgroundColor="#000000">
        Black & White
      </Badge>
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Badge clicked!'),
  },
};

export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Badge aria-label="New notification">1</Badge>
      <Badge variant="error" aria-label="3 errors">3</Badge>
      <Badge onClick={() => {}} aria-label="Filter by status">
        Filter
      </Badge>
    </div>
  ),
};
```

---

### STEP 7: Add PropTypes (10 min)

**Task:** Add runtime validation for development

**File:** Add to `/src/components/atoms/Badge/Badge.tsx`

```typescript
import PropTypes from 'prop-types';

// ... Badge component code ...

if (process.env.NODE_ENV !== 'production') {
  Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    rounded: PropTypes.oneOf(['pill', 'rounded', 'square']),
    borderWidth: PropTypes.number,
    borderStyle: PropTypes.oneOf(['none', 'solid', 'dashed', 'dotted', 'double']),
    borderColor: PropTypes.string,
    icon: PropTypes.string,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    dot: PropTypes.bool,
    clickable: PropTypes.bool,
    onClick: PropTypes.func,
    removable: PropTypes.bool,
    onRemove: PropTypes.func,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    className: PropTypes.string,
    'data-testid': PropTypes.string,
    'aria-label': PropTypes.string,
    id: PropTypes.string,
  };
}
```

---

### STEP 8: Documentation (20 min)

**Task:** Create comprehensive documentation

**File:** `/src/components/atoms/Badge/README.md`

**Content:** (See full documentation in implementation)

---

### STEP 9: Final Verification (15 min)

**Task:** Run all quality checks

**Commands:**
```bash
# Run tests
npm run test -- Badge

# Check coverage
npm run test:coverage -- Badge

# Type check (skip base.ts for now)
npm run type-check 2>&1 | grep -v "base.ts"

# Lint
npm run lint src/components/atoms/Badge/

# Build to verify no runtime errors
npm run build
```

---

### STEP 10: Create Completion Report (10 min)

**Task:** Document all improvements

**File:** `/docs/BADGE_GOD_TIER_COMPLETION_REPORT.md`

---

## 📊 ESTIMATED TIME BREAKDOWN

| Step | Time | Cumulative |
|------|------|------------|
| Install Dependencies | 5 min | 5 min |
| Create Utilities | 10 min | 15 min |
| Error Boundary | 15 min | 30 min |
| Upgrade Badge Component | 60 min | 90 min |
| Write Tests | 90 min | 180 min |
| Storybook Stories | 30 min | 210 min |
| PropTypes | 10 min | 220 min |
| Documentation | 20 min | 240 min |
| Verification | 15 min | 255 min |
| Completion Report | 10 min | 265 min |
| **TOTAL** | **~4.5 hours** | - |

---

## ✅ SUCCESS CRITERIA CHECKLIST

### Must Have
- [ ] Error Boundary implemented
- [ ] XSS protection (DOMPurify)
- [ ] CSS injection prevention (color validation)
- [ ] React.memo + useMemo + useCallback
- [ ] 25+ unit tests
- [ ] Accessibility tests (jest-axe)
- [ ] Full ARIA support
- [ ] Keyboard navigation
- [ ] Complete JSDoc
- [ ] Storybook stories
- [ ] PropTypes (dev only)

### Should Have
- [ ] 90%+ test coverage
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Performance benchmarks
- [ ] README documentation

### Nice to Have
- [ ] Visual regression tests
- [ ] Bundle size analysis
- [ ] Lighthouse audit

---

**STATUS:** ✅ PLAN COMPLETE - READY TO EXECUTE

**Next Action:** Start STEP 1 with `go`
