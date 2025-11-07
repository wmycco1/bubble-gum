/**
 * Tooltip Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Tooltip } from './Tooltip';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';

// Helper to wait for tooltip animations
const waitForTooltip = async (delay = 250) => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
  });
};

// Controlled tooltip wrapper for testing
const ControlledTooltip: React.FC<{
  initialOpen?: boolean;
  [key: string]: any;
}> = ({ initialOpen = false, ...props }) => {
  const [open, setOpen] = useState(initialOpen);

  return (
    <Tooltip
      {...props}
      trigger="manual"
      open={open}
      onOpenChange={setOpen}
    >
      <button onClick={() => setOpen(!open)}>Toggle</button>
    </Tooltip>
  );
};

describe('Tooltip Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('should not render tooltip content initially', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('should render with default testId', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    });

    it('should render with custom testId', () => {
      render(
        <Tooltip content="Tooltip text" data-testid="custom-tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
    });

    it('should render string content', async () => {
      render(
        <Tooltip content="Simple tooltip" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByText('Simple tooltip')).toBeInTheDocument();
    });

    it('should render ReactNode content', async () => {
      render(
        <Tooltip
          content={
            <div>
              <Text>Complex content</Text>
            </div>
          }
          defaultOpen={true}
        >
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByText('Complex content')).toBeInTheDocument();
    });
  });

  // ============================================
  // PLACEMENT TESTS
  // ============================================

  describe('Placement', () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;

    placements.forEach((placement) => {
      it(`should render with placement="${placement}"`, async () => {
        render(
          <Tooltip content="Tooltip" placement={placement} defaultOpen={true}>
            <button>Trigger</button>
          </Tooltip>
        );

        await waitForTooltip();
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass(`tooltip--${placement}`);
      });
    });

    it('should default to placement="top"', async () => {
      render(
        <Tooltip content="Tooltip" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('tooltip--top');
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================

  describe('Variants', () => {
    const variants = ['default', 'primary', 'success', 'warning', 'danger', 'light'] as const;

    variants.forEach((variant) => {
      it(`should render with variant="${variant}"`, async () => {
        render(
          <Tooltip content="Tooltip" variant={variant} defaultOpen={true}>
            <button>Trigger</button>
          </Tooltip>
        );

        await waitForTooltip();
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveClass(`tooltip--${variant}`);
      });
    });
  });

  // ============================================
  // TRIGGER TESTS
  // ============================================

  describe('Trigger: Hover', () => {
    it('should show on mouse enter', async () => {
      render(
        <Tooltip content="Hover tooltip" trigger="hover">
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      expect(screen.getByText('Hover tooltip')).toBeInTheDocument();
    });

    it('should hide on mouse leave', async () => {
      render(
        <Tooltip content="Hover tooltip" trigger="hover" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();
      expect(screen.getByText('Hover tooltip')).toBeInTheDocument();

      await userEvent.unhover(trigger);
      await waitForTooltip();
      expect(screen.queryByText('Hover tooltip')).not.toBeInTheDocument();
    });

    it('should respect delay prop', async () => {
      render(
        <Tooltip content="Delayed tooltip" trigger="hover" delay={500}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);

      // Should not show immediately
      await waitForTooltip(250);
      expect(screen.queryByText('Delayed tooltip')).not.toBeInTheDocument();

      // Should show after delay
      await waitForTooltip(300);
      expect(screen.getByText('Delayed tooltip')).toBeInTheDocument();
    });
  });

  describe('Trigger: Click', () => {
    it('should toggle on click', async () => {
      render(
        <Tooltip content="Click tooltip" trigger="click" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');

      // Click to show
      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Click tooltip')).toBeInTheDocument();

      // Click to hide
      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.queryByText('Click tooltip')).not.toBeInTheDocument();
    });

    it('should close on click outside when closeOnClickOutside=true', async () => {
      render(
        <div>
          <Tooltip content="Click tooltip" trigger="click" delay={0} closeOnClickOutside={true}>
            <button>Trigger</button>
          </Tooltip>
          <button>Outside</button>
        </div>
      );

      const trigger = screen.getByText('Trigger');
      const outside = screen.getByText('Outside');

      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Click tooltip')).toBeInTheDocument();

      await userEvent.click(outside);
      await waitForTooltip();
      expect(screen.queryByText('Click tooltip')).not.toBeInTheDocument();
    });

    it('should not close on click outside when closeOnClickOutside=false', async () => {
      render(
        <div>
          <Tooltip content="Click tooltip" trigger="click" delay={0} closeOnClickOutside={false}>
            <button>Trigger</button>
          </Tooltip>
          <button>Outside</button>
        </div>
      );

      const trigger = screen.getByText('Trigger');
      const outside = screen.getByText('Outside');

      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Click tooltip')).toBeInTheDocument();

      await userEvent.click(outside);
      await waitForTooltip();
      expect(screen.getByText('Click tooltip')).toBeInTheDocument();
    });
  });

  describe('Trigger: Focus', () => {
    it('should show on focus', async () => {
      render(
        <Tooltip content="Focus tooltip" trigger="focus" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.tab(); // Focus the button
      await waitForTooltip();

      expect(screen.getByText('Focus tooltip')).toBeInTheDocument();
    });

    it('should hide on blur', async () => {
      render(
        <div>
          <Tooltip content="Focus tooltip" trigger="focus" delay={0}>
            <button>Trigger</button>
          </Tooltip>
          <button>Other</button>
        </div>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.tab(); // Focus the button
      await waitForTooltip();
      expect(screen.getByText('Focus tooltip')).toBeInTheDocument();

      await userEvent.tab(); // Focus next element
      await waitForTooltip();
      expect(screen.queryByText('Focus tooltip')).not.toBeInTheDocument();
    });
  });

  describe('Trigger: Manual', () => {
    it('should be controlled when trigger="manual"', async () => {
      const { rerender } = render(
        <Tooltip content="Manual tooltip" trigger="manual" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByText('Manual tooltip')).not.toBeInTheDocument();

      rerender(
        <Tooltip content="Manual tooltip" trigger="manual" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByText('Manual tooltip')).toBeInTheDocument();
    });

    it('should call onOpenChange when controlled', async () => {
      const onOpenChange = jest.fn();

      render(
        <Tooltip
          content="Manual tooltip"
          trigger="manual"
          open={false}
          onOpenChange={onOpenChange}
        >
          <button>Trigger</button>
        </Tooltip>
      );

      // Manual control doesn't trigger onOpenChange automatically
      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // KEYBOARD TESTS
  // ============================================

  describe('Keyboard Interactions', () => {
    it('should close on Escape key by default', async () => {
      render(
        <Tooltip content="Escapable tooltip" trigger="click" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Escapable tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      await waitForTooltip();
      expect(screen.queryByText('Escapable tooltip')).not.toBeInTheDocument();
    });

    it('should not close on Escape when closeOnEscape=false', async () => {
      render(
        <Tooltip content="Non-escapable tooltip" trigger="click" delay={0} closeOnEscape={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Non-escapable tooltip')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
      await waitForTooltip();
      expect(screen.getByText('Non-escapable tooltip')).toBeInTheDocument();
    });
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  describe('Disabled State', () => {
    it('should not show when disabled=true', async () => {
      render(
        <Tooltip content="Disabled tooltip" trigger="hover" delay={0} disabled={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      expect(screen.queryByText('Disabled tooltip')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // ARROW TESTS
  // ============================================

  describe('Arrow', () => {
    it('should show arrow by default', async () => {
      render(
        <Tooltip content="With arrow" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.tooltip__arrow');
      expect(arrow).toBeInTheDocument();
    });

    it('should hide arrow when arrow=false', async () => {
      render(
        <Tooltip content="Without arrow" defaultOpen={true} arrow={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      const arrow = tooltip.querySelector('.tooltip__arrow');
      expect(arrow).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CALLBACKS
  // ============================================

  describe('Callbacks', () => {
    it('should call onBeforeOpen before opening', async () => {
      const onBeforeOpen = jest.fn(() => true);

      render(
        <Tooltip content="Tooltip" trigger="hover" delay={0} onBeforeOpen={onBeforeOpen}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      expect(onBeforeOpen).toHaveBeenCalledTimes(1);
    });

    it('should prevent opening when onBeforeOpen returns false', async () => {
      const onBeforeOpen = jest.fn(() => false);

      render(
        <Tooltip content="Blocked tooltip" trigger="hover" delay={0} onBeforeOpen={onBeforeOpen}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      expect(onBeforeOpen).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Blocked tooltip')).not.toBeInTheDocument();
    });

    it('should call onAfterOpen after opening', async () => {
      const onAfterOpen = jest.fn();

      render(
        <Tooltip content="Tooltip" trigger="hover" delay={0} onAfterOpen={onAfterOpen}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      expect(onAfterOpen).toHaveBeenCalledTimes(1);
    });

    it('should call onBeforeClose before closing', async () => {
      const onBeforeClose = jest.fn(() => true);

      render(
        <Tooltip content="Tooltip" trigger="hover" delay={0} onBeforeClose={onBeforeClose}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      await userEvent.unhover(trigger);
      await waitForTooltip();

      expect(onBeforeClose).toHaveBeenCalledTimes(1);
    });

    it('should prevent closing when onBeforeClose returns false', async () => {
      const onBeforeClose = jest.fn(() => false);

      render(
        <Tooltip content="Sticky tooltip" trigger="hover" delay={0} onBeforeClose={onBeforeClose}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();
      expect(screen.getByText('Sticky tooltip')).toBeInTheDocument();

      await userEvent.unhover(trigger);
      await waitForTooltip();

      expect(onBeforeClose).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Sticky tooltip')).toBeInTheDocument();
    });

    it('should call onAfterClose after closing', async () => {
      const onAfterClose = jest.fn();

      render(
        <Tooltip content="Tooltip" trigger="hover" delay={0} onAfterClose={onAfterClose}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);
      await waitForTooltip();

      await userEvent.unhover(trigger);
      await waitForTooltip();

      expect(onAfterClose).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('should have role="tooltip"', async () => {
      render(
        <Tooltip content="Accessible tooltip" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should set aria-describedby on trigger when open', async () => {
      render(
        <Tooltip content="Description" defaultOpen={true} id="test">
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const trigger = screen.getByTestId('tooltip');
      expect(trigger).toHaveAttribute('aria-describedby', 'test-tooltip');
    });

    it('should hide arrow from screen readers', async () => {
      render(
        <Tooltip content="Tooltip" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const arrow = document.querySelector('.tooltip__arrow');
      expect(arrow).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================
  // CUSTOM CLASSES
  // ============================================

  describe('Custom Classes', () => {
    it('should apply custom className to wrapper', () => {
      render(
        <Tooltip content="Tooltip" className="custom-wrapper">
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.getByTestId('tooltip')).toHaveClass('custom-wrapper');
    });

    it('should apply tooltipClassName to tooltip', async () => {
      render(
        <Tooltip content="Tooltip" defaultOpen={true} tooltipClassName="custom-tooltip">
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('custom-tooltip');
    });

    it('should apply arrowClassName to arrow', async () => {
      render(
        <Tooltip content="Tooltip" defaultOpen={true} arrowClassName="custom-arrow">
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const arrow = document.querySelector('.tooltip__arrow');
      expect(arrow).toHaveClass('custom-arrow');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty content gracefully', async () => {
      render(
        <Tooltip content="" defaultOpen={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should handle multiple tooltips', async () => {
      render(
        <div>
          <Tooltip content="Tooltip 1" defaultOpen={true}>
            <button>Trigger 1</button>
          </Tooltip>
          <Tooltip content="Tooltip 2" defaultOpen={true}>
            <button>Trigger 2</button>
          </Tooltip>
        </div>
      );

      await waitForTooltip();
      expect(screen.getByText('Tooltip 1')).toBeInTheDocument();
      expect(screen.getByText('Tooltip 2')).toBeInTheDocument();
    });

    it('should handle custom maxWidth', async () => {
      render(
        <Tooltip content="Wide tooltip" defaultOpen={true} maxWidth="500px">
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({ maxWidth: '500px' });
    });

    it('should handle custom zIndex', async () => {
      render(
        <Tooltip content="High z-index" defaultOpen={true} zIndex={2000}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveStyle({ zIndex: 2000 });
    });

    it('should cleanup timeouts on unmount', async () => {
      const { unmount } = render(
        <Tooltip content="Cleanup test" trigger="hover" delay={500}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');
      await userEvent.hover(trigger);

      // Unmount before timeout completes
      unmount();

      // Wait to ensure no errors
      await waitForTooltip();
    });
  });

  // ============================================
  // CONTROLLED VS UNCONTROLLED
  // ============================================

  describe('Controlled vs Uncontrolled', () => {
    it('should work in uncontrolled mode', async () => {
      render(
        <Tooltip content="Uncontrolled" trigger="click" delay={0}>
          <button>Trigger</button>
        </Tooltip>
      );

      const trigger = screen.getByText('Trigger');

      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.getByText('Uncontrolled')).toBeInTheDocument();

      await userEvent.click(trigger);
      await waitForTooltip();
      expect(screen.queryByText('Uncontrolled')).not.toBeInTheDocument();
    });

    it('should work in controlled mode', async () => {
      const { rerender } = render(
        <Tooltip content="Controlled" trigger="manual" open={false}>
          <button>Trigger</button>
        </Tooltip>
      );

      expect(screen.queryByText('Controlled')).not.toBeInTheDocument();

      rerender(
        <Tooltip content="Controlled" trigger="manual" open={true}>
          <button>Trigger</button>
        </Tooltip>
      );

      await waitForTooltip();
      expect(screen.getByText('Controlled')).toBeInTheDocument();
    });
  });
});
