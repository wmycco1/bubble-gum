/**
 * IconBox Types
 * God-Tier Development Protocol 2025
 *
 * Type-safe props for IconBox Molecule component
 */

import type { ReactNode } from 'react';
import type { IconColor, IconSize } from '@/components/atoms/Icon/Icon.types';
import type { HeadingLevel, HeadingColor } from '@/components/atoms/Heading/Heading.types';
import type { TextSize, TextColor } from '@/components/atoms/Text/Text.types';

/**
 * IconBox alignment variants
 */
export type IconBoxAlign = 'left' | 'center' | 'right';

/**
 * IconBox layout variants
 */
export type IconBoxLayout = 'vertical' | 'horizontal';

/**
 * IconBox size variants
 */
export type IconBoxSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * IconBox component props
 *
 * Molecule component that composes Icon, Heading, and Text atoms
 * to create feature boxes, benefit cards, and informational blocks.
 *
 * @example Basic usage
 * ```tsx
 * <IconBox
 *   icon="check"
 *   heading="Fast Performance"
 *   description="Lightning-fast load times and smooth interactions"
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <IconBox
 *   icon="shield"
 *   heading="Secure & Safe"
 *   description="Enterprise-grade security"
 *   iconColor="primary"
 *   iconSize="lg"
 *   align="center"
 * />
 * ```
 *
 * @example Horizontal layout
 * ```tsx
 * <IconBox
 *   icon="star"
 *   heading="Premium Features"
 *   description="Access all advanced features"
 *   layout="horizontal"
 *   iconColor="warning"
 * />
 * ```
 */
export interface IconBoxProps {
  /**
   * Icon name/identifier
   * @required
   */
  icon: string;

  /**
   * Feature heading/title
   * @required
   */
  heading: string;

  /**
   * Feature description
   * Optional text content explaining the feature
   */
  description?: string;

  /**
   * Content alignment
   * @default 'left'
   */
  align?: IconBoxAlign;

  /**
   * Layout direction
   * @default 'vertical'
   */
  layout?: IconBoxLayout;

  /**
   * Size variant
   * @default 'md'
   */
  size?: IconBoxSize;

  /**
   * Icon color variant
   * @default 'primary'
   */
  iconColor?: IconColor;

  /**
   * Icon size
   * @default 'md'
   */
  iconSize?: IconSize;

  /**
   * Heading level (semantic HTML)
   * @default 'h3'
   */
  headingLevel?: HeadingLevel;

  /**
   * Heading color variant
   * @default 'default'
   */
  headingColor?: HeadingColor;

  /**
   * Description text size
   * @default 'md'
   */
  textSize?: TextSize;

  /**
   * Description text color
   * @default 'muted'
   */
  textColor?: TextColor;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * ID attribute
   */
  id?: string;

  /**
   * Accessibility label
   */
  'aria-label'?: string;

  /**
   * Accessibility description
   */
  'aria-describedby'?: string;

  /**
   * Test ID for testing
   * @default 'iconbox'
   */
  'data-testid'?: string;

  /**
   * Custom children (replaces description if provided)
   * Allows for more complex content
   */
  children?: ReactNode;

  /**
   * Click handler (makes the entire box clickable)
   */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Hover effect
   * @default false
   */
  hoverable?: boolean;

  /**
   * Show background
   * @default false
   */
  showBackground?: boolean;

  /**
   * Show border
   * @default false
   */
  showBorder?: boolean;
}

/**
 * IconBox component type
 */
export type IconBoxComponent = React.FC<IconBoxProps>;
