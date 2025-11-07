/**
 * Alert Component Types (Molecule)
 * God-Tier Development Protocol 2025
 */

import type { AtomParameters } from '@/types/parameters';

/**
 * Alert variants
 */
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Alert Props
 *
 * @example Basic usage
 * ```tsx
 * <Alert variant="success" message="Operation completed!" />
 * ```
 *
 * @example With title and dismissible
 * ```tsx
 * <Alert
 *   variant="error"
 *   title="Error"
 *   message="Something went wrong"
 *   dismissible
 *   onDismiss={() => console.log('dismissed')}
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Alert variant="info" message="Info message" />
 * </AtomProvider>
 * ```
 */
export interface AlertProps extends Partial<AtomParameters> {
  /**
   * Alert variant/severity
   * @default 'info'
   */
  variant?: AlertVariant;

  /**
   * Alert title (optional)
   */
  title?: string;

  /**
   * Alert message (required)
   */
  message: string;

  /**
   * Show dismiss button
   * @default true
   */
  dismissible?: boolean;

  /**
   * Callback when dismissed
   */
  onDismiss?: () => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'alert'
   */
  'data-testid'?: string;
}

/**
 * Alert component that supports Context API parameter inheritance
 */
export type AlertComponent = React.FC<AlertProps>;
