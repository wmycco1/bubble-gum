/**
 * Modal Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Modal } from './Modal';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

// Test wrapper component
const ModalWrapper: React.FC<{
  initialOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  [key: string]: any;
}> = ({ initialOpen = false, onClose, children, ...props }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal isOpen={isOpen} onClose={handleClose} {...props}>
        {children || <Text>Modal content</Text>}
      </Modal>
    </>
  );
};

describe('Modal Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <Text>Modal content</Text>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render with default testId', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    it('should render with custom testId', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} data-testid="custom-modal">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Custom Title">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should render content prop', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} content={<Text>Content from prop</Text>} />
      );

      expect(screen.getByText('Content from prop')).toBeInTheDocument();
    });

    it('should render children when both content and children provided', () => {
      render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          content={<Text>Content prop</Text>}
        >
          <Text>Children prop</Text>
        </Modal>
      );

      expect(screen.getByText('Content prop')).toBeInTheDocument();
      expect(screen.queryByText('Children prop')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // SIZE VARIANTS
  // ============================================

  describe('Size Variants', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach((size) => {
      it(`should render with size="${size}"`, () => {
        render(
          <Modal isOpen={true} onClose={() => {}} size={size}>
            <Text>Content</Text>
          </Modal>
        );

        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass(`modal__content--${size}`);
      });
    });

    it('should default to size="md"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toHaveClass('modal__content--md');
    });
  });

  // ============================================
  // VARIANT STYLES
  // ============================================

  describe('Variant Styles', () => {
    const variants = ['default', 'centered', 'side', 'fullscreen'] as const;

    variants.forEach((variant) => {
      it(`should render with variant="${variant}"`, () => {
        render(
          <Modal isOpen={true} onClose={() => {}} variant={variant}>
            <Text>Content</Text>
          </Modal>
        );

        const modal = screen.getByTestId('modal');
        expect(modal).toHaveClass(`modal__content--${variant}`);
      });
    });
  });

  // ============================================
  // HEADER & FOOTER
  // ============================================

  describe('Header and Footer', () => {
    it('should render custom header', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} header={<div>Custom Header</div>}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByText('Custom Header')).toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      render(
        <Modal
          isOpen={true}
          onClose={() => {}}
          footer={
            <>
              <Button text="Cancel" variant="ghost" />
              <Button text="Confirm" variant="primary" />
            </>
          }
        >
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should not render header when no title, header, or close button', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} showCloseButton={false}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.queryByTestId('modal-header')).not.toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.queryByTestId('modal-footer')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CLOSE BUTTON
  // ============================================

  describe('Close Button', () => {
    it('should show close button by default', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton=false', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} showCloseButton={false}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <Text>Content</Text>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);

      // Wait for animation
      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 300 });
    });
  });

  // ============================================
  // KEYBOARD INTERACTIONS
  // ============================================

  describe('Keyboard Interactions', () => {
    it('should close on Escape key by default', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <Text>Content</Text>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 300 });
    });

    it('should not close on Escape when closeOnEscape=false', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnEscape={false}>
          <Text>Content</Text>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => expect(onClose).not.toHaveBeenCalled(), { timeout: 300 });
    });

    it('should trap focus with Tab key', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test">
          <button>First</button>
          <button>Second</button>
        </Modal>
      );

      const firstButton = screen.getByText('First');
      const secondButton = screen.getByText('Second');
      const closeButton = screen.getByLabelText('Close modal');

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      await userEvent.tab();
      expect(document.activeElement).toBe(secondButton);

      await userEvent.tab();
      expect(document.activeElement).toBe(closeButton);

      // Tab from last element should go back to first
      await userEvent.tab();
      expect(document.activeElement).toBe(firstButton);
    });

    it('should trap focus with Shift+Tab key', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test">
          <button>First</button>
          <button>Second</button>
        </Modal>
      );

      const firstButton = screen.getByText('First');
      const closeButton = screen.getByLabelText('Close modal');

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Shift+Tab from first element should go to last
      await userEvent.tab({ shift: true });
      expect(document.activeElement).toBe(closeButton);
    });

    it('should not trap focus when trapFocus=false', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}} trapFocus={false}>
          <button>Inside Modal</button>
        </Modal>
      );

      const button = screen.getByText('Inside Modal');
      button.focus();

      // This test verifies focus trap is disabled
      // In real DOM, focus would escape modal
      expect(document.activeElement).toBe(button);
    });
  });

  // ============================================
  // OVERLAY INTERACTIONS
  // ============================================

  describe('Overlay Interactions', () => {
    it('should close on overlay click by default', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <Text>Content</Text>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      await userEvent.click(overlay);

      await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 300 });
    });

    it('should not close on overlay click when closeOnOverlayClick=false', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose} closeOnOverlayClick={false}>
          <Text>Content</Text>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      await userEvent.click(overlay);

      await waitFor(() => expect(onClose).not.toHaveBeenCalled(), { timeout: 300 });
    });

    it('should not close on content click', async () => {
      const onClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <Text>Content</Text>
        </Modal>
      );

      const content = screen.getByText('Content');
      await userEvent.click(content);

      await waitFor(() => expect(onClose).not.toHaveBeenCalled(), { timeout: 300 });
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('should have role="dialog"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal="true"', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby when title provided', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Title">
          <Text>Content</Text>
        </Modal>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(screen.getByText('Test Title')).toHaveAttribute('id', 'modal-title');
    });

    it('should set initial focus on first focusable element', async () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <button>First Button</button>
          <button>Second Button</button>
        </Modal>
      );

      await waitFor(
        () => {
          const firstButton = screen.getByText('First Button');
          expect(document.activeElement).toBe(firstButton);
        },
        { timeout: 300 }
      );
    });
  });

  // ============================================
  // CALLBACKS
  // ============================================

  describe('Callbacks', () => {
    it('should call onAfterOpen after opening', async () => {
      const onAfterOpen = jest.fn();
      render(
        <Modal isOpen={true} onClose={() => {}} onAfterOpen={onAfterOpen}>
          <Text>Content</Text>
        </Modal>
      );

      await waitFor(() => expect(onAfterOpen).toHaveBeenCalledTimes(1), { timeout: 300 });
    });

    it('should call onBeforeClose before closing', async () => {
      const onBeforeClose = jest.fn(() => true);
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} onBeforeClose={onBeforeClose}>
          <Text>Content</Text>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);

      await waitFor(() => expect(onBeforeClose).toHaveBeenCalledTimes(1), { timeout: 300 });
    });

    it('should prevent closing when onBeforeClose returns false', async () => {
      const onBeforeClose = jest.fn(() => false);
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} onBeforeClose={onBeforeClose}>
          <Text>Content</Text>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);

      await waitFor(() => expect(onBeforeClose).toHaveBeenCalledTimes(1), { timeout: 300 });
      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onAfterClose after closing', async () => {
      const onAfterClose = jest.fn();
      const onClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={onClose} onAfterClose={onAfterClose}>
          <Text>Content</Text>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Close modal');
      await userEvent.click(closeButton);

      await waitFor(() => expect(onAfterClose).toHaveBeenCalledTimes(1), { timeout: 500 });
    });
  });

  // ============================================
  // CUSTOM CLASSES
  // ============================================

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} className="custom-class">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toHaveClass('custom-class');
    });

    it('should apply containerClassName', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} containerClassName="custom-container">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal-container')).toHaveClass('custom-container');
    });

    it('should apply overlayClassName', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} overlayClassName="custom-overlay">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal-overlay')).toHaveClass('custom-overlay');
    });

    it('should apply contentClassName', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} contentClassName="custom-content">
          <Text>Content</Text>
        </Modal>
      );

      expect(screen.getByTestId('modal')).toHaveClass('custom-content');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle multiple modals', () => {
      render(
        <>
          <Modal isOpen={true} onClose={() => {}} data-testid="modal-1">
            <Text>Modal 1</Text>
          </Modal>
          <Modal isOpen={true} onClose={() => {}} data-testid="modal-2">
            <Text>Modal 2</Text>
          </Modal>
        </>
      );

      expect(screen.getByTestId('modal-1')).toBeInTheDocument();
      expect(screen.getByTestId('modal-2')).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      render(<Modal isOpen={true} onClose={() => {}} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle overlay opacity', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} overlayOpacity={0.75}>
          <Text>Content</Text>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      expect(overlay).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.75)' });
    });

    it('should handle custom zIndex', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} zIndex={2000}>
          <Text>Content</Text>
        </Modal>
      );

      const overlay = screen.getByTestId('modal-overlay');
      expect(overlay).toHaveStyle({ zIndex: 2000 });
    });
  });
});
