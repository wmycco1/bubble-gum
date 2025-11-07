/**
 * Tooltip Component Types
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Tooltip component (Molecule level)
 */

import type { MoleculeParameters } from '@/types/parameters';

/**
 * Tooltip placement positions
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * Tooltip trigger types
 */
export type TooltipTrigger = 'hover' | 'click' | 'focus' | 'manual';

/**
 * Tooltip visual variants
 */
export type TooltipVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'light';

/**
 * Tooltip-specific parameters
 * Extends MoleculeParameters with Tooltip-specific props
 *
 * @example
 * ```tsx
 * <Tooltip content="Click to edit" placement="top">
 *   <Button text="Edit" />
 * </Tooltip>
 * ```
 */
export interface TooltipProps extends MoleculeParameters {
  /**
   * Tooltip content (required)
   * Text or ReactNode to display in tooltip
   */
  content: React.ReactNode;

  /**
   * Trigger element (required)
   * Element that triggers the tooltip
   */
  children: React.ReactNode;

  /**
   * Tooltip placement
   * Position relative to trigger element
   * @default 'top'
   */
  placement?: TooltipPlacement;

  /**
   * Trigger type
   * How the tooltip is activated
   * @default 'hover'
   */
  trigger?: TooltipTrigger;

  /**
   * Tooltip variant
   * Visual style of the tooltip
   * @default 'default'
   */
  variant?: TooltipVariant;

  /**
   * Show arrow
   * Display arrow pointing to trigger
   * @default true
   */
  arrow?: boolean;

  /**
   * Delay before showing (ms)
   * @default 200
   */
  delay?: number;

  /**
   * Delay before hiding (ms)
   * @default 0
   */
  hideDelay?: number;

  /**
   * Open state (controlled mode)
   * When provided, tooltip becomes controlled
   */
  open?: boolean;

  /**
   * Default open state (uncontrolled mode)
   * Initial open state
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Open change handler
   * Called when tooltip open state changes
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Disabled state
   * When true, tooltip won't show
   * @default false
   */
  disabled?: boolean;

  /**
   * Max width
   * Maximum width of tooltip content
   * @default '250px'
   */
  maxWidth?: string | number;

  /**
   * Offset from trigger
   * Distance between tooltip and trigger in pixels
   * @default 8
   */
  offset?: number;

  /**
   * Z-index
   * Stacking order
   * @default 1000
   */
  zIndex?: number;

  /**
   * Animation duration (ms)
   * @default 150
   */
  animationDuration?: number;

  /**
   * Keep tooltip open on hover
   * Useful for interactive tooltips
   * @default false
   */
  interactive?: boolean;

  /**
   * Follow cursor
   * Tooltip follows mouse cursor
   * @default false
   */
  followCursor?: boolean;

  /**
   * Custom class for tooltip container
   */
  tooltipClassName?: string;

  /**
   * Custom class for trigger wrapper
   */
  wrapperClassName?: string;

  /**
   * Custom class for arrow
   */
  arrowClassName?: string;

  /**
   * Portal target
   * DOM element to render tooltip into
   * @default document.body
   */
  portalTarget?: HTMLElement;

  /**
   * Prevent tooltip from overflowing viewport
   * Automatically adjusts placement to stay in viewport
   * @default true
   */
  preventOverflow?: boolean;

  /**
   * Close on click outside
   * Only applies to click trigger
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Close on escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Before open callback
   * Called before tooltip opens, can prevent opening by returning false
   */
  onBeforeOpen?: () => boolean;

  /**
   * After open callback
   * Called after tooltip has opened
   */
  onAfterOpen?: () => void;

  /**
   * Before close callback
   * Called before tooltip closes, can prevent closing by returning false
   */
  onBeforeClose?: () => boolean;

  /**
   * After close callback
   * Called after tooltip has closed
   */
  onAfterClose?: () => void;

  /**
   * As prop for wrapper element
   * @default 'div'
   */
  as?: 'div' | 'span' | 'button';
}

/**
 * Tooltip context type
 * Provides tooltip state to child components
 */
export interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  placement: TooltipPlacement;
  variant: TooltipVariant;
}

/**
 * Tooltip position coordinates
 */
export interface TooltipPosition {
  top: number;
  left: number;
  placement: TooltipPlacement;
}
