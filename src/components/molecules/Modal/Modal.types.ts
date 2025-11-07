/**
 * Modal Component Types
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Modal component (Molecule level)
 */

import type { MoleculeParameters } from '@/types/parameters';

/**
 * Modal size variants
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal visual variants
 */
export type ModalVariant = 'default' | 'centered' | 'side' | 'fullscreen';

/**
 * Modal-specific parameters
 * Extends MoleculeParameters with Modal-specific props
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={true}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <Text>Are you sure you want to continue?</Text>
 * </Modal>
 * ```
 */
export interface ModalProps extends MoleculeParameters {
  /**
   * Modal open state (required)
   * Controls whether the modal is visible
   */
  isOpen: boolean;

  /**
   * Close handler (required)
   * Called when modal should close (escape key, overlay click, close button)
   */
  onClose: () => void;

  /**
   * Modal title
   * Displayed in the header section
   */
  title?: string;

  /**
   * Modal content
   * Main content area (can also use children)
   */
  content?: React.ReactNode;

  /**
   * Modal size
   * Controls the width of the modal dialog
   * @default 'md'
   */
  size?: ModalSize;

  /**
   * Modal variant
   * Determines the modal's positioning and style
   * @default 'default'
   */
  variant?: ModalVariant;

  /**
   * Show close button
   * When true, displays an X button in the header
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close on overlay click
   * When true, clicking the backdrop closes the modal
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   * When true, pressing Escape closes the modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Prevent body scroll
   * When true, prevents scrolling the page behind the modal
   * @default true
   */
  preventBodyScroll?: boolean;

  /**
   * Modal header content
   * Custom header to replace default title
   */
  header?: React.ReactNode;

  /**
   * Modal footer content
   * Actions, buttons, or custom footer content
   */
  footer?: React.ReactNode;

  /**
   * Overlay opacity
   * Controls the darkness of the backdrop
   * @default 0.5
   */
  overlayOpacity?: number;

  /**
   * Z-index for modal
   * Controls stacking order
   * @default 1000
   */
  zIndex?: number;

  /**
   * Animation duration
   * Duration of entrance/exit animations in milliseconds
   * @default 200
   */
  animationDuration?: number;

  /**
   * Initial focus element
   * CSS selector for element to focus when modal opens
   */
  initialFocus?: string;

  /**
   * Return focus on close
   * When true, returns focus to trigger element after closing
   * @default true
   */
  returnFocus?: boolean;

  /**
   * Trap focus within modal
   * When true, prevents tabbing outside modal
   * @default true
   */
  trapFocus?: boolean;

  /**
   * Custom class for modal container
   */
  containerClassName?: string;

  /**
   * Custom class for modal content
   */
  contentClassName?: string;

  /**
   * Custom class for overlay
   */
  overlayClassName?: string;

  /**
   * Children elements
   * Modal content (alternative to content prop)
   */
  children?: React.ReactNode;

  /**
   * Portal target
   * DOM element to render modal into
   * @default document.body
   */
  portalTarget?: HTMLElement;

  /**
   * Before close callback
   * Called before modal closes, can prevent closing by returning false
   */
  onBeforeClose?: () => boolean | Promise<boolean>;

  /**
   * After close callback
   * Called after modal has closed and animation completed
   */
  onAfterClose?: () => void;

  /**
   * After open callback
   * Called after modal has opened and animation completed
   */
  onAfterOpen?: () => void;
}

/**
 * Modal context type
 * Provides modal state to child components
 */
export interface ModalContextValue {
  isOpen: boolean;
  onClose: () => void;
  size: ModalSize;
  variant: ModalVariant;
}
