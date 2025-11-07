/**
 * Tooltip Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * An accessible tooltip with positioning, triggers, and Portal rendering.
 * Supports hover, click, focus, and manual control.
 *
 * @example Basic
 * ```tsx
 * <Tooltip content="Click to edit">
 *   <Button text="Edit" />
 * </Tooltip>
 * ```
 *
 * @example With placement
 * ```tsx
 * <Tooltip content="Helpful information" placement="right">
 *   <Icon name="info" />
 * </Tooltip>
 * ```
 *
 * @example Controlled
 * ```tsx
 * <Tooltip
 *   content="Controlled tooltip"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   trigger="manual"
 * >
 *   <span>Hover me</span>
 * </Tooltip>
 * ```
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useMoleculeContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Text } from '@/components/atoms/Text';
import type { TooltipProps, TooltipPosition } from './Tooltip.types';
import styles from './Tooltip.module.css';

export const Tooltip: React.FC<TooltipProps> = (props) => {
  // Get inherited parameters from Molecule context
  const contextParams = useMoleculeContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as TooltipProps;

  // Destructure with defaults
  const {
    content,
    children,
    placement = 'top',
    trigger = 'hover',
    variant = 'default',
    arrow = true,
    delay = 200,
    hideDelay = 0,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    maxWidth = '250px',
    offset = 8,
    zIndex = 1000,
    animationDuration = 150,
    interactive = false,
    followCursor = false,
    tooltipClassName = '',
    wrapperClassName = '',
    arrowClassName = '',
    portalTarget,
    preventOverflow = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    onBeforeOpen,
    onAfterOpen,
    onBeforeClose,
    onAfterClose,
    as: Component = 'div',
    className = '',
    'data-testid': testId = 'tooltip',
    id,
    ...rest
  } = params;

  // State
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    placement,
  });
  const [isMounted, setIsMounted] = useState(false);

  // Determine if controlled or uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  // Refs
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const cursorPosition = useRef({ x: 0, y: 0 });

  // Track if component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Set open state (handles both controlled and uncontrolled)
  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (disabled) return;

      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  // Calculate tooltip position
  const calculatePosition = useCallback((): TooltipPosition => {
    if (!triggerRef.current || !tooltipRef.current) {
      return { top: 0, left: 0, placement };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let finalPlacement = placement;
    let top = 0;
    let left = 0;

    // Follow cursor mode
    if (followCursor) {
      top = cursorPosition.current.y + offset;
      left = cursorPosition.current.x + offset;
      finalPlacement = 'top';
    } else {
      // Calculate position based on placement
      switch (placement) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - offset;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;

        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;

        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - offset;
          break;

        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + offset;
          break;
      }

      // Prevent overflow
      if (preventOverflow) {
        // Check if tooltip goes off screen and adjust
        if (left < 0) {
          left = offset;
        } else if (left + tooltipRect.width > viewport.width) {
          left = viewport.width - tooltipRect.width - offset;
        }

        if (top < 0) {
          top = offset;
          if (placement === 'top') {
            finalPlacement = 'bottom';
          }
        } else if (top + tooltipRect.height > viewport.height) {
          top = viewport.height - tooltipRect.height - offset;
          if (placement === 'bottom') {
            finalPlacement = 'top';
          }
        }
      }
    }

    return { top, left, placement: finalPlacement };
  }, [placement, offset, preventOverflow, followCursor]);

  // Update position when tooltip is shown
  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const newPosition = calculatePosition();
      setPosition(newPosition);
    }
  }, [isOpen, calculatePosition]);

  // Handle show with delay
  const handleShow = useCallback(() => {
    if (disabled) return;

    // Call before open callback
    if (onBeforeOpen && onBeforeOpen() === false) {
      return;
    }

    // Clear any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    // Show with delay
    showTimeoutRef.current = setTimeout(() => {
      setOpen(true);
      onAfterOpen?.();
    }, delay);
  }, [disabled, onBeforeOpen, onAfterOpen, setOpen, delay]);

  // Handle hide with delay
  const handleHide = useCallback(() => {
    if (disabled) return;

    // Call before close callback
    if (onBeforeClose && onBeforeClose() === false) {
      return;
    }

    // Clear any pending show
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    // Hide with delay
    hideTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      onAfterClose?.();
    }, hideDelay);
  }, [disabled, onBeforeClose, onAfterClose, setOpen, hideDelay]);

  // Handle toggle (for click trigger)
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleHide();
    } else {
      handleShow();
    }
  }, [isOpen, handleShow, handleHide]);

  // Handle mouse move (for follow cursor)
  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (followCursor) {
        cursorPosition.current = { x: event.clientX, y: event.clientY };
        if (isOpen && tooltipRef.current) {
          const newPosition = calculatePosition();
          setPosition(newPosition);
        }
      }
    },
    [followCursor, isOpen, calculatePosition]
  );

  // Get event handlers based on trigger type
  const getTriggerHandlers = () => {
    if (trigger === 'manual') {
      return {};
    }

    const handlers: any = {};

    if (trigger === 'hover') {
      handlers.onMouseEnter = handleShow;
      handlers.onMouseLeave = handleHide;
      if (followCursor) {
        handlers.onMouseMove = handleMouseMove;
      }
    }

    if (trigger === 'click') {
      handlers.onClick = handleToggle;
    }

    if (trigger === 'focus') {
      handlers.onFocus = handleShow;
      handlers.onBlur = handleHide;
    }

    return handlers;
  };

  // Get tooltip handlers (for interactive tooltips)
  const getTooltipHandlers = () => {
    if (!interactive || trigger !== 'hover') {
      return {};
    }

    return {
      onMouseEnter: () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = undefined;
        }
      },
      onMouseLeave: handleHide,
    };
  };

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleHide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, handleHide]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen || trigger !== 'click' || !closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        handleHide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, trigger, closeOnClickOutside, handleHide]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Compute CSS classes
  const wrapperClasses = [
    styles.tooltip__wrapper,
    wrapperClassName,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipClasses = [
    styles.tooltip,
    styles[`tooltip--${variant}`],
    styles[`tooltip--${position.placement}`],
    isOpen && styles['tooltip--open'],
    tooltipClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const arrowClasses = [
    styles.tooltip__arrow,
    styles[`tooltip__arrow--${position.placement}`],
    arrowClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Render tooltip content
  const tooltipContent = isOpen && isMounted && (
    <div
      ref={tooltipRef}
      className={tooltipClasses}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        maxWidth,
        zIndex,
      }}
      role="tooltip"
      data-testid={`${testId}-content`}
      id={id ? `${id}-tooltip` : undefined}
      {...getTooltipHandlers()}
    >
      <div className={styles.tooltip__inner}>
        {typeof content === 'string' ? (
          <Text size="sm" className={styles.tooltip__text}>
            {content}
          </Text>
        ) : (
          content
        )}
      </div>

      {arrow && <div className={arrowClasses} aria-hidden="true" />}
    </div>
  );

  // Render through portal
  const target = portalTarget || (typeof document !== 'undefined' ? document.body : null);

  return (
    <>
      <Component
        ref={triggerRef as any}
        className={wrapperClasses}
        data-testid={testId}
        aria-describedby={isOpen && id ? `${id}-tooltip` : undefined}
        {...getTriggerHandlers()}
        {...rest}
      >
        {children}
      </Component>

      {target && createPortal(tooltipContent, target)}
    </>
  );
};

// Display name for React DevTools
Tooltip.displayName = 'Tooltip';

// Default export for convenience
export default Tooltip;
