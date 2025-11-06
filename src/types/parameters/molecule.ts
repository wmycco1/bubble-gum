/**
 * Molecule Parameters
 * God-Tier Development Protocol 2025
 *
 * Molecule components: Alert, IconBox, Progress, Modal, Tooltip, etc.
 * Responsible for: Simple UI patterns, visual feedback, basic interactions
 */

import { BaseParameters } from './base';
import {
  ResponsiveValue,
  ResponsiveSpacing,
  ColorValue,
  FontWeight,
  TextAlign,
  AnimationType,
  ComponentVariant,
  AlertVariant,
  SizePreset,
} from './utils';

/**
 * MoleculeParameters
 *
 * Molecule-level components are simple combinations of 2-5 atoms.
 * They focus on typography, colors, spacing (limited), and basic interactions.
 *
 * @example
 * <Alert
 *   title="Success"
 *   message="Your changes have been saved"
 *   variant="success"
 *   dismissible={true}
 * />
 */
export interface MoleculeParameters extends BaseParameters {
  // ============================================
  // TYPOGRAPHY (PRIMARY)
  // ============================================

  /**
   * Title text
   */
  title?: string;

  /**
   * Main text content
   */
  text?: string;

  /**
   * Label text
   */
  label?: string;

  /**
   * Message text
   */
  message?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * Font size
   */
  fontSize?: ResponsiveValue<number | string>;

  /**
   * Font weight
   */
  fontWeight?: FontWeight;

  /**
   * Text alignment
   */
  textAlign?: TextAlign;

  /**
   * Text color
   */
  color?: ColorValue;

  /**
   * Text transform
   */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  /**
   * Line height
   */
  lineHeight?: ResponsiveValue<number | string>;

  /**
   * Letter spacing
   */
  letterSpacing?: ResponsiveValue<number | string>;

  // ============================================
  // COLORS & BACKGROUNDS (SECONDARY)
  // ============================================

  /**
   * Background color
   */
  backgroundColor?: ColorValue;

  /**
   * Border color
   */
  borderColor?: ColorValue;

  /**
   * Icon color
   */
  iconColor?: ColorValue;

  /**
   * Accent color (for highlights, badges, etc.)
   */
  accentColor?: ColorValue;

  // ============================================
  // LAYOUT & SPACING (LIMITED)
  // ============================================

  /**
   * Size preset
   */
  size?: SizePreset;

  /**
   * Padding
   */
  padding?: ResponsiveSpacing;

  /**
   * Width
   */
  width?: ResponsiveValue<string | number>;

  /**
   * Height
   */
  height?: ResponsiveValue<string | number>;

  /**
   * Max width
   */
  maxWidth?: ResponsiveValue<string | number>;

  /**
   * Gap (for molecules with multiple children)
   */
  gap?: ResponsiveValue<{ value: number; unit: string }>;

  // ============================================
  // INTERACTIONS & ANIMATIONS (SECONDARY)
  // ============================================

  /**
   * Animation type
   */
  animation?: AnimationType;

  /**
   * Animation duration (ms)
   */
  duration?: number;

  /**
   * Animation delay (ms)
   */
  delay?: number;

  /**
   * Dismissible (can be closed)
   */
  dismissible?: boolean;

  /**
   * Dismiss handler
   */
  onDismiss?: () => void;

  /**
   * Close handler (alternative to onDismiss)
   */
  onClose?: () => void;

  /**
   * Open state (for modals, tooltips)
   */
  open?: boolean;

  /**
   * Toggle open state
   */
  onToggle?: () => void;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Active state
   */
  active?: boolean;

  // ============================================
  // BORDERS & EFFECTS (SECONDARY)
  // ============================================

  /**
   * Component variant (styling preset)
   */
  variant?: ComponentVariant | AlertVariant | string;

  /**
   * Border radius
   */
  borderRadius?: ResponsiveValue<string | number>;

  /**
   * Border width
   */
  borderWidth?: ResponsiveValue<number>;

  /**
   * Border style
   */
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  /**
   * Shadow preset
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Opacity
   */
  opacity?: number;

  // ============================================
  // ICON-RELATED (for IconBox, etc.)
  // ============================================

  /**
   * Icon name/identifier
   */
  icon?: string;

  /**
   * Icon type
   */
  iconType?: 'solid' | 'outline' | 'duotone';

  /**
   * Icon size
   */
  iconSize?: number | string;

  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';

  // ============================================
  // PROGRESS-RELATED
  // ============================================

  /**
   * Progress value (0-100)
   */
  value?: number;

  /**
   * Progress max value
   */
  max?: number;

  /**
   * Progress min value
   */
  min?: number;

  /**
   * Show value as text
   */
  showValue?: boolean;

  /**
   * Progress bar color
   */
  progressColor?: ColorValue;

  /**
   * Progress bar background
   */
  progressBackground?: ColorValue;

  /**
   * Indeterminate state (loading without specific progress)
   */
  indeterminate?: boolean;

  // ============================================
  // ALERT-RELATED
  // ============================================

  /**
   * Alert variant (type)
   */
  alertVariant?: AlertVariant;

  /**
   * Show icon in alert
   */
  showIcon?: boolean;

  /**
   * Auto-dismiss after timeout
   */
  autoDismiss?: boolean;

  /**
   * Auto-dismiss timeout (ms)
   */
  autoDismissTimeout?: number;

  // ============================================
  // TOOLTIP/POPOVER-RELATED
  // ============================================

  /**
   * Tooltip content
   */
  tooltip?: string;

  /**
   * Tooltip placement
   */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';

  /**
   * Tooltip trigger
   */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';

  /**
   * Tooltip delay (ms)
   */
  tooltipDelay?: number;

  /**
   * Arrow enabled (for popover/tooltip)
   */
  arrow?: boolean;

  // ============================================
  // MODAL-RELATED
  // ============================================

  /**
   * Modal title
   */
  modalTitle?: string;

  /**
   * Modal size
   */
  modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Close on overlay click
   */
  closeOnOverlayClick?: boolean;

  /**
   * Close on escape key
   */
  closeOnEscape?: boolean;

  /**
   * Show close button
   */
  showCloseButton?: boolean;

  /**
   * Overlay opacity
   */
  overlayOpacity?: number;

  /**
   * Prevent body scroll when open
   */
  preventBodyScroll?: boolean;

  // ============================================
  // BADGE-RELATED
  // ============================================

  /**
   * Badge dot (small indicator)
   */
  dot?: boolean;

  /**
   * Badge pulse animation
   */
  pulse?: boolean;

  /**
   * Badge position (relative to parent)
   */
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  // ============================================
  // COUNTER-RELATED
  // ============================================

  /**
   * Counter start value
   */
  start?: number;

  /**
   * Counter end value
   */
  end?: number;

  /**
   * Counter duration (ms)
   */
  counterDuration?: number;

  /**
   * Counter prefix
   */
  prefix?: string;

  /**
   * Counter suffix
   */
  suffix?: string;

  /**
   * Decimal places
   */
  decimals?: number;

  /**
   * Separator for thousands
   */
  separator?: string;

  // ============================================
  // BREADCRUMB-RELATED
  // ============================================

  /**
   * Breadcrumb items
   */
  items?: Array<{ label: string; href?: string }>;

  /**
   * Breadcrumb separator
   */
  separator?: string | React.ReactNode;

  // ============================================
  // RATING-RELATED
  // ============================================

  /**
   * Rating value (e.g., 1-5)
   */
  rating?: number;

  /**
   * Max rating
   */
  maxRating?: number;

  /**
   * Read-only (can't be changed)
   */
  readOnly?: boolean;

  /**
   * Rating change handler
   */
  onRatingChange?: (rating: number) => void;

  /**
   * Half-star support
   */
  allowHalf?: boolean;

  /**
   * Star color
   */
  starColor?: ColorValue;

  /**
   * Empty star color
   */
  emptyStarColor?: ColorValue;

  // ============================================
  // TOGGLE-RELATED
  // ============================================

  /**
   * Toggle checked state
   */
  checked?: boolean;

  /**
   * Toggle change handler
   */
  onToggleChange?: (checked: boolean) => void;

  /**
   * Toggle size
   */
  toggleSize?: 'sm' | 'md' | 'lg';

  /**
   * Toggle color (when checked)
   */
  toggleColor?: ColorValue;
}
