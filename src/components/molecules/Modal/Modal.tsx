/**
 * Modal Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * An accessible modal dialog with overlay, focus trap, and keyboard navigation.
 * Renders using React Portal to escape DOM hierarchy.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <Text>Are you sure you want to continue?</Text>
 * </Modal>
 * ```
 *
 * @example With custom footer
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Delete Item"
 *   footer={
 *     <>
 *       <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *       <Button variant="danger" onClick={handleDelete}>Delete</Button>
 *     </>
 *   }
 * >
 *   <Text>This action cannot be undone.</Text>
 * </Modal>
 * ```
 */

'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { createPortal } from 'react-dom';
import { useMoleculeContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import type { ModalProps } from './Modal.types';
import styles from './Modal.module.css';

export const Modal: React.FC<ModalProps> = (props) => {
  // Get inherited parameters from Molecule context
  const contextParams = useMoleculeContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as ModalProps;

  // Destructure with defaults
  const {
    isOpen,
    onClose,
    title,
    content,
    children,
    size = 'md',
    variant = 'default',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    preventBodyScroll = true,
    header,
    footer,
    overlayOpacity = 0.5,
    zIndex = 1000,
    animationDuration = 200,
    initialFocus,
    returnFocus = true,
    trapFocus = true,
    containerClassName = '',
    contentClassName = '',
    overlayClassName = '',
    portalTarget,
    onBeforeClose,
    onAfterClose,
    onAfterOpen,
    className = '',
    'data-testid': testId = 'modal',
    id,
    ...rest
  } = params;

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Track if component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle body scroll prevention
  useEffect(() => {
    if (!isOpen || !preventBodyScroll) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Get scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, preventBodyScroll]);

  // Handle focus management
  useEffect(() => {
    if (!isOpen) return;

    // Store previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Set initial focus
    const focusElement = () => {
      if (initialFocus) {
        const element = modalRef.current?.querySelector(initialFocus) as HTMLElement;
        element?.focus();
      } else {
        // Focus first focusable element or modal itself
        const firstFocusable = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus() || modalRef.current?.focus();
      }

      // Call after open callback
      setIsAnimating(false);
      onAfterOpen?.();
    };

    setIsAnimating(true);
    setTimeout(focusElement, animationDuration);

    return () => {
      // Return focus to previous element
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, initialFocus, returnFocus, animationDuration, onAfterOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape]); // handleClose excluded to avoid dependency

  // Focus trap
  useEffect(() => {
    if (!isOpen || !trapFocus || !modalRef.current) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen, trapFocus]);

  // Handle close with before/after callbacks
  const handleClose = useCallback(async () => {
    // Call before close callback
    if (onBeforeClose) {
      const shouldClose = await onBeforeClose();
      if (shouldClose === false) return;
    }

    setIsAnimating(true);

    // Wait for animation
    setTimeout(() => {
      onClose();
      onAfterClose?.();
      setIsAnimating(false);
    }, animationDuration);
  }, [onClose, onBeforeClose, onAfterClose, animationDuration]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        handleClose();
      }
    },
    [closeOnOverlayClick, handleClose]
  );

  // Don't render if not open
  if (!isOpen) return null;

  // Don't render on server
  if (!isMounted) return null;

  // Compute CSS classes
  const overlayClasses = [
    styles.modal__overlay,
    styles[`modal__overlay--${variant}`],
    overlayClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles.modal__container,
    styles[`modal__container--${variant}`],
    containerClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const contentClasses = [
    styles.modal__content,
    styles[`modal__content--${size}`],
    styles[`modal__content--${variant}`],
    isAnimating && styles['modal__content--animating'],
    contentClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  // Render modal content
  const modalContent = (
    <div
      className={overlayClasses}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
        zIndex,
      }}
      onClick={handleOverlayClick}
      data-testid={`${testId}-overlay`}
    >
      <div className={containerClasses} data-testid={`${testId}-container`}>
        <div
          ref={modalRef}
          className={contentClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? `${testId}-title` : undefined}
          data-testid={testId}
          id={id}
          tabIndex={-1}
          {...validDOMProps}
        >
          {/* Header */}
          {(title || header || showCloseButton) && (
            <div className={styles.modal__header} data-testid={`${testId}-header`}>
              {header || (
                <>
                  {title && (
                    <Heading
                      level="h2"
                      className={styles.modal__title}
                      id={`${testId}-title`}
                      data-testid={`${testId}-title`}
                    >
                      {title}
                    </Heading>
                  )}
                </>
              )}

              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className={styles.modal__close}
                  aria-label="Close modal"
                  data-testid={`${testId}-close-button`}
                  text=""
                  leftIcon={<Icon name="x" size="md" aria-hidden={true} />}
                />
              )}
            </div>
          )}

          {/* Body */}
          <div className={styles.modal__body} data-testid={`${testId}-body`}>
            {content || children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={styles.modal__footer} data-testid={`${testId}-footer`}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render through portal
  const target = portalTarget || (typeof document !== 'undefined' ? document.body : null);
  return target ? createPortal(modalContent, target) : null;
};

// Display name for React DevTools
Modal.displayName = 'Modal';

// Default export for convenience
export default Modal;
