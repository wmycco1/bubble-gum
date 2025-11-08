/**
 * Alert Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * Alert notification component composed of Icon, Text, Heading, and Button Atoms.
 * Uses AtomParameters for styling through Context API.
 *
 * @example Basic
 * ```tsx
 * <Alert variant="success" message="Operation completed!" />
 * <Alert variant="error" title="Error" message="Something went wrong" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg' }}>
 *   <Alert variant="info" message="Info message" />
 * </AtomProvider>
 * ```
 *
 * @example Dismissible
 * ```tsx
 * <Alert
 *   variant="warning"
 *   message="Please verify your email"
 *   dismissible
 *   onDismiss={() => console.log('dismissed')}
 * />
 * ```
 */

'use client';

import React, { useState } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { Heading } from '@/components/atoms/Heading';
import { Button } from '@/components/atoms/Button';
import type { AlertProps } from './Alert.types';
import styles from './Alert.module.css';

export const Alert: React.FC<AlertProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as AlertProps;

  // Destructure with defaults
  const {
    variant = 'info',
    title,
    message,
    dismissible = true,
    onDismiss,
    className = '',
    'data-testid': testId = 'alert',
    ...rest
  } = params;

  const [isVisible, setIsVisible] = useState(true);

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  // Get variant-specific configuration
  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          iconName: 'check-circle',
          iconColor: 'success' as const,
          containerClass: styles['alert--success'],
        };
      case 'warning':
        return {
          iconName: 'alert-triangle',
          iconColor: 'warning' as const,
          containerClass: styles['alert--warning'],
        };
      case 'error':
        return {
          iconName: 'x-circle',
          iconColor: 'error' as const,
          containerClass: styles['alert--error'],
        };
      default:
        return {
          iconName: 'info',
          iconColor: 'primary' as const,
          containerClass: styles['alert--info'],
        };
    }
  };

  const variantConfig = getVariantConfig();

  // Compute CSS classes
  const classes = [
    styles.alert,
    variantConfig.containerClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={classes}
      role="alert"
      data-testid={testId}
      {...validDOMProps}
    >
      {/* Icon */}
      <div className={styles['alert-icon']}>
        <Icon name={variantConfig.iconName} color={variantConfig.iconColor} size="md" />
      </div>

      {/* Content */}
      <div className={styles['alert-content']}>
        <AtomProvider value={{ size: 'sm' }}>
          {title && (
            <Heading level="h4" className={styles['alert-title']}>
              {title}
            </Heading>
          )}
          <Text className={styles['alert-message']}>
            {message}
          </Text>
        </AtomProvider>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={handleDismiss}
          className={styles['alert-dismiss']}
          aria-label="Dismiss alert"
          data-testid={`${testId}-dismiss`}
        >
          <Icon name="x" size="sm" />
        </button>
      )}
    </div>
  );
};

// Display name for React DevTools
Alert.displayName = 'Alert';

// Default export for convenience
export default Alert;
