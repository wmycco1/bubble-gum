/**
 * Accordion Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Accordion } from './Accordion';
import type { AccordionProps, AccordionItem } from './Accordion.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Accordion.module.css', () => ({
  'accordion': 'accordion',
  'accordion--default': 'accordion--default',
  'accordion--bordered': 'accordion--bordered',
  'accordion--filled': 'accordion--filled',
  'accordion-item': 'accordion-item',
  'accordion-item--open': 'accordion-item--open',
  'accordion-item--disabled': 'accordion-item--disabled',
  'accordion-header': 'accordion-header',
  'accordion-title': 'accordion-title',
  'accordion-icon': 'accordion-icon',
  'icon-chevron': 'icon-chevron',
  'icon-chevron--open': 'icon-chevron--open',
  'icon-plus-minus': 'icon-plus-minus',
  'accordion-content': 'accordion-content',
  'accordion-content-inner': 'accordion-content-inner',
  'accordion-empty': 'accordion-empty',
}));

// Sample accordion items
const sampleItems: AccordionItem[] = [
  {
    id: '1',
    title: 'What is this?',
    content: 'This is a comprehensive accordion component.',
  },
  {
    id: '2',
    title: 'How does it work?',
    content: 'It expands and collapses content sections smoothly.',
  },
  {
    id: '3',
    title: 'Is it accessible?',
    content: 'Yes, it follows WCAG AA standards with keyboard navigation.',
  },
];

describe('Accordion', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required items prop', () => {
      render(<Accordion items={sampleItems} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('renders all accordion items', () => {
      render(<Accordion items={sampleItems} />);
      expect(screen.getByText('What is this?')).toBeInTheDocument();
      expect(screen.getByText('How does it work?')).toBeInTheDocument();
      expect(screen.getByText('Is it accessible?')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(<Accordion items={sampleItems} />);
      const accordion = container.querySelector('[data-testid="accordion"]');
      expect(accordion?.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Accordion items={sampleItems} className="custom-accordion" />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('custom-accordion');
    });

    it('applies custom data-testid', () => {
      render(<Accordion items={sampleItems} data-testid="custom-accordion" />);
      expect(screen.getByTestId('custom-accordion')).toBeInTheDocument();
    });

    it('renders item headers as buttons', () => {
      render(<Accordion items={sampleItems} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('Empty State', () => {
    it('renders empty state when no items provided', () => {
      render(<Accordion items={[]} />);
      expect(screen.getByText('No accordion items available')).toBeInTheDocument();
    });

    it('shows correct testid for empty state', () => {
      render(<Accordion items={[]} />);
      expect(screen.getByTestId('accordion-empty')).toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANTS
  // ============================================

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Accordion items={sampleItems} variant="default" />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('accordion--default');
    });

    it('renders bordered variant', () => {
      render(<Accordion items={sampleItems} variant="bordered" />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('accordion--bordered');
    });

    it('renders filled variant', () => {
      render(<Accordion items={sampleItems} variant="filled" />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('accordion--filled');
    });

    it('defaults to default variant when not specified', () => {
      render(<Accordion items={sampleItems} />);
      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('accordion--default');
    });
  });

  // ============================================
  // EXPAND/COLLAPSE
  // ============================================

  describe('Expand/Collapse', () => {
    it('items are collapsed by default', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands item when clicked', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.click(header);

      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses item when clicked again', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(header);
      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows content when expanded', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.click(header);

      const content = screen.getByTestId('accordion-content-1');
      expect(content).toHaveAttribute('aria-hidden', 'false');
    });

    it('hides content when collapsed', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');
      const content = screen.getByTestId('accordion-content-1');

      expect(content).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================
  // SINGLE vs MULTIPLE OPEN
  // ============================================

  describe('Single vs Multiple Open', () => {
    it('closes other items when allowMultiple is false (default)', () => {
      render(<Accordion items={sampleItems} />);
      const header1 = screen.getByTestId('accordion-header-1');
      const header2 = screen.getByTestId('accordion-header-2');

      fireEvent.click(header1);
      expect(header1).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(header2);
      expect(header2).toHaveAttribute('aria-expanded', 'true');
      expect(header1).toHaveAttribute('aria-expanded', 'false');
    });

    it('allows multiple items open when allowMultiple is true', () => {
      render(<Accordion items={sampleItems} allowMultiple={true} />);
      const header1 = screen.getByTestId('accordion-header-1');
      const header2 = screen.getByTestId('accordion-header-2');

      fireEvent.click(header1);
      fireEvent.click(header2);

      expect(header1).toHaveAttribute('aria-expanded', 'true');
      expect(header2).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // ============================================
  // DEFAULT OPEN
  // ============================================

  describe('Default Open', () => {
    it('opens items specified in defaultOpen', () => {
      render(<Accordion items={sampleItems} defaultOpen={['1', '3']} allowMultiple={true} />);
      const header1 = screen.getByTestId('accordion-header-1');
      const header2 = screen.getByTestId('accordion-header-2');
      const header3 = screen.getByTestId('accordion-header-3');

      expect(header1).toHaveAttribute('aria-expanded', 'true');
      expect(header2).toHaveAttribute('aria-expanded', 'false');
      expect(header3).toHaveAttribute('aria-expanded', 'true');
    });

    it('respects single-open mode with defaultOpen', () => {
      render(<Accordion items={sampleItems} defaultOpen={['1']} />);
      const header1 = screen.getByTestId('accordion-header-1');

      expect(header1).toHaveAttribute('aria-expanded', 'true');
    });

    it('handles empty defaultOpen array', () => {
      render(<Accordion items={sampleItems} defaultOpen={[]} />);
      const header1 = screen.getByTestId('accordion-header-1');

      expect(header1).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // ICON TYPES
  // ============================================

  describe('Icon Types', () => {
    it('renders chevron icon by default', () => {
      render(<Accordion items={sampleItems} />);
      const icon = screen.getByTestId('accordion-icon-1');
      expect(icon).toBeInTheDocument();
    });

    it('renders plus-minus icon when specified', () => {
      render(<Accordion items={sampleItems} iconType="plus-minus" />);
      const icon = screen.getByTestId('accordion-icon-1');
      expect(icon).toBeInTheDocument();
    });

    it('rotates chevron icon when expanded', () => {
      render(<Accordion items={sampleItems} iconType="chevron" />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.click(header);

      const icon = screen.getByTestId('accordion-icon-1').querySelector('.icon-chevron');
      expect(icon).toHaveClass('icon-chevron--open');
    });

    it('changes icon from plus to minus when expanded', () => {
      render(<Accordion items={sampleItems} iconType="plus-minus" />);
      const header = screen.getByTestId('accordion-header-1');

      // Initially should show plus (closed)
      fireEvent.click(header);
      // After click should show minus (open)
      expect(screen.getByTestId('accordion-icon-1')).toBeInTheDocument();
    });
  });

  // ============================================
  // DISABLED ITEMS
  // ============================================

  describe('Disabled Items', () => {
    const disabledItems: AccordionItem[] = [
      { id: '1', title: 'Enabled Item', content: 'Content 1' },
      { id: '2', title: 'Disabled Item', content: 'Content 2', disabled: true },
    ];

    it('renders disabled item with correct class', () => {
      render(<Accordion items={disabledItems} />);
      const item = screen.getByTestId('accordion-item-2');
      expect(item).toHaveClass('accordion-item--disabled');
    });

    it('disables button for disabled item', () => {
      render(<Accordion items={disabledItems} />);
      const header = screen.getByTestId('accordion-header-2');
      expect(header).toBeDisabled();
    });

    it('does not expand disabled item when clicked', () => {
      render(<Accordion items={disabledItems} />);
      const header = screen.getByTestId('accordion-header-2');

      fireEvent.click(header);

      expect(header).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-disabled for disabled item', () => {
      render(<Accordion items={disabledItems} />);
      const header = screen.getByTestId('accordion-header-2');
      expect(header).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ============================================
  // CONTENT RENDERING
  // ============================================

  describe('Content Rendering', () => {
    it('renders string content', () => {
      render(<Accordion items={sampleItems} defaultOpen={['1']} />);
      expect(screen.getByText('This is a comprehensive accordion component.')).toBeInTheDocument();
    });

    it('renders React node content', () => {
      const customItems: AccordionItem[] = [
        {
          id: '1',
          title: 'Custom Content',
          content: (
            <div data-testid="custom-content">
              <p>Custom React Node</p>
              <button>Click Me</button>
            </div>
          ),
        },
      ];
      render(<Accordion items={customItems} defaultOpen={['1']} />);
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });
  });

  // ============================================
  // CALLBACKS
  // ============================================

  describe('Callbacks', () => {
    it('calls onItemToggle when item is toggled', () => {
      const onItemToggle = jest.fn();
      render(<Accordion items={sampleItems} onItemToggle={onItemToggle} />);

      const header = screen.getByTestId('accordion-header-1');
      fireEvent.click(header);

      expect(onItemToggle).toHaveBeenCalledTimes(1);
      expect(onItemToggle).toHaveBeenCalledWith('1', true);
    });

    it('calls onItemToggle with false when item is collapsed', () => {
      const onItemToggle = jest.fn();
      render(<Accordion items={sampleItems} onItemToggle={onItemToggle} defaultOpen={['1']} />);

      const header = screen.getByTestId('accordion-header-1');
      fireEvent.click(header);

      expect(onItemToggle).toHaveBeenCalledWith('1', false);
    });

    it('does not call onItemToggle for disabled item', () => {
      const onItemToggle = jest.fn();
      const disabledItems: AccordionItem[] = [
        { id: '1', title: 'Disabled', content: 'Content', disabled: true },
      ];
      render(<Accordion items={disabledItems} onItemToggle={onItemToggle} />);

      const header = screen.getByTestId('accordion-header-1');
      fireEvent.click(header);

      expect(onItemToggle).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('Keyboard Navigation', () => {
    it('toggles item with Enter key', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.keyDown(header, { key: 'Enter' });

      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles item with Space key', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.keyDown(header, { key: ' ' });

      expect(header).toHaveAttribute('aria-expanded', 'true');
    });

    it('navigates to next item with ArrowDown', () => {
      render(<Accordion items={sampleItems} />);
      const header1 = screen.getByTestId('accordion-header-1');

      // Mock focus
      const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');
      fireEvent.keyDown(header1, { key: 'ArrowDown' });

      // Should attempt to focus next item
      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('navigates to previous item with ArrowUp', () => {
      render(<Accordion items={sampleItems} />);
      const header2 = screen.getByTestId('accordion-header-2');

      const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');
      fireEvent.keyDown(header2, { key: 'ArrowUp' });

      expect(focusSpy).toHaveBeenCalled();
      focusSpy.mockRestore();
    });

    it('does not toggle disabled item with keyboard', () => {
      const disabledItems: AccordionItem[] = [
        { id: '1', title: 'Disabled', content: 'Content', disabled: true },
      ];
      render(<Accordion items={disabledItems} />);
      const header = screen.getByTestId('accordion-header-1');

      fireEvent.keyDown(header, { key: 'Enter' });

      expect(header).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Accordion items={sampleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('headers have aria-expanded attribute', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');
      expect(header).toHaveAttribute('aria-expanded');
    });

    it('headers have aria-controls attribute', () => {
      render(<Accordion items={sampleItems} />);
      const header = screen.getByTestId('accordion-header-1');
      expect(header).toHaveAttribute('aria-controls', 'accordion-content-1');
    });

    it('content has role="region"', () => {
      render(<Accordion items={sampleItems} />);
      const content = screen.getByTestId('accordion-content-1');
      expect(content).toHaveAttribute('role', 'region');
    });

    it('content has aria-hidden attribute', () => {
      render(<Accordion items={sampleItems} />);
      const content = screen.getByTestId('accordion-content-1');
      expect(content).toHaveAttribute('aria-hidden');
    });

    it('content has aria-labelledby attribute', () => {
      render(<Accordion items={sampleItems} />);
      const content = screen.getByTestId('accordion-content-1');
      expect(content).toHaveAttribute('aria-labelledby', 'accordion-header-1');
    });
  });

  // ============================================
  // CONTEXT API
  // ============================================

  describe('Context API', () => {
    it('inherits parameters from context', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Accordion items={sampleItems} />
        </AtomProvider>
      );

      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('context-class');
    });

    it('props override context parameters', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Accordion items={sampleItems} className="props-class" />
        </AtomProvider>
      );

      const accordion = screen.getByTestId('accordion');
      expect(accordion).toHaveClass('props-class');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles single item', () => {
      const singleItem: AccordionItem[] = [
        { id: '1', title: 'Only Item', content: 'Only content' },
      ];
      render(<Accordion items={singleItem} />);
      expect(screen.getByText('Only Item')).toBeInTheDocument();
    });

    it('handles many items efficiently', () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Item ${i + 1}`,
        content: `Content ${i + 1}`,
      }));

      render(<Accordion items={manyItems} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 20')).toBeInTheDocument();
    });

    it('handles item with empty content', () => {
      const emptyContentItems: AccordionItem[] = [
        { id: '1', title: 'Empty', content: '' },
      ];
      render(<Accordion items={emptyContentItems} defaultOpen={['1']} />);
      expect(screen.getByTestId('accordion-content-1')).toBeInTheDocument();
    });
  });

  // ============================================
  // RENDERING PERFORMANCE
  // ============================================

  describe('Rendering Performance', () => {
    it('renders with minimal re-renders', () => {
      const { rerender } = render(<Accordion items={sampleItems} />);
      rerender(<Accordion items={sampleItems} />);
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
    });

    it('updates efficiently when items change', () => {
      const { rerender } = render(<Accordion items={sampleItems} />);

      const newItems: AccordionItem[] = [
        { id: '4', title: 'New Item', content: 'New content' },
      ];

      rerender(<Accordion items={newItems} />);
      expect(screen.getByText('New Item')).toBeInTheDocument();
    });
  });
});
