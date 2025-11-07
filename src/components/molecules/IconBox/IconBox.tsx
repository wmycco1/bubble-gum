/**
 * IconBox Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A molecule component that composes Icon, Heading, and Text atoms
 * to create feature boxes, benefit cards, and informational blocks.
 *
 * @example Basic usage
 * ```tsx
 * <IconBox
 *   icon="check"
 *   heading="Fast Performance"
 *   description="Lightning-fast load times"
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <MoleculeProvider value={{ size: 'lg', iconColor: 'primary' }}>
 *   <IconBox icon="shield" heading="Secure" description="Enterprise security" />
 * </MoleculeProvider>
 * ```
 */

import React from 'react';
import { useMoleculeContext, mergeParameters } from '@/context/parameters/ParameterContext';
import { Icon } from '@/components/atoms/Icon';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import type { IconBoxProps } from './IconBox.types';
import styles from './IconBox.module.css';

export const IconBox: React.FC<IconBoxProps> = (props) => {
  // Get inherited parameters from Molecule context
  const contextParams = useMoleculeContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as IconBoxProps;

  // Destructure with defaults
  const {
    icon,
    heading,
    description,
    align = 'left',
    layout = 'vertical',
    size = 'md',
    iconColor = 'primary',
    iconSize = 'md',
    headingLevel = 'h3',
    headingColor = 'default',
    textSize = 'md',
    textColor = 'muted',
    className = '',
    id,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'data-testid': testId = 'iconbox',
    children,
    onClick,
    hoverable = false,
    showBackground = false,
    showBorder = false,
  } = params;

  // Compute CSS classes
  const classes = [
    styles.iconbox,
    styles[`iconbox--${align}`],
    styles[`iconbox--${layout}`],
    styles[`iconbox--${size}`],
    hoverable && styles['iconbox--hoverable'],
    showBackground && styles['iconbox--background'],
    showBorder && styles['iconbox--border'],
    onClick && styles['iconbox--clickable'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine if component is interactive
  const isInteractive = !!onClick;

  // Handle click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Handle keyboard navigation (Enter/Space for clickable boxes)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  return (
    <div
      id={id}
      className={classes}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
    >
      {/* Icon */}
      <div className={styles.iconbox__icon} data-testid={`${testId}-icon`}>
        <Icon
          name={icon}
          color={iconColor}
          size={iconSize}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className={styles.iconbox__content} data-testid={`${testId}-content`}>
        {/* Heading */}
        <div className={styles.iconbox__heading}>
          <Heading
            level={headingLevel}
            align={align}
            color={headingColor}
            data-testid={`${testId}-heading`}
          >
            {heading}
          </Heading>
        </div>

        {/* Description or Children */}
        {children ? (
          <div className={styles.iconbox__children}>{children}</div>
        ) : description ? (
          <div className={styles.iconbox__description}>
            <Text
              size={textSize}
              color={textColor}
              align={align}
              data-testid={`${testId}-description`}
            >
              {description}
            </Text>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Display name for React DevTools
IconBox.displayName = 'IconBox';

// Default export for convenience
export default IconBox;
