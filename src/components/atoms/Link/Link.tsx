/**
 * Link Component (Atom)
 * God-Tier Development Protocol 2025
 *
 * Accessible link component with Context API support.
 * Uses AtomParameters for styling and behavior through Context API.
 *
 * @example Basic
 * ```tsx
 * <Link href="/about">About Us</Link>
 * <Link href="/contact" size="lg" variant="primary">Contact</Link>
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
 *   <Link href="/home">Home</Link>
 *   <Link href="/about">About</Link>
 * </AtomProvider>
 * ```
 *
 * @example External link
 * ```tsx
 * <Link href="https://example.com" external>
 *   External Site
 * </Link>
 * ```
 */

'use client';

import React from 'react';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { LinkProps } from './Link.types';
import styles from './Link.module.css';

export const Link: React.FC<LinkProps> = (props) => {
  // Get inherited parameters from Atom context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as LinkProps;

  // Destructure with defaults
  const {
    href,
    children,
    size = 'md',
    variant = 'default',
    external = false,
    showIcon = external,
    disabled = false,
    className = '',
    'data-testid': testId = 'link',
    onClick,
    ...rest
  } = params;

  // Compute CSS classes (using CSS modules)
  const classes = [
    styles.link,
    styles[`link--${size}`],
    styles[`link--${variant}`],
    disabled && styles['link--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // External link attributes
  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  // Handle disabled state
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <a
      href={disabled ? undefined : href}
      className={classes}
      data-testid={testId}
      aria-disabled={disabled}
      onClick={handleClick}
      {...externalProps}
      {...rest}
    >
      {children}
      {showIcon && (
        <svg
          className={styles['link-icon']}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10.5 1.5H6.5M10.5 1.5V5.5M10.5 1.5L5.5 6.5M9.5 7V9.5C9.5 10.0523 9.05228 10.5 8.5 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V3.5C1.5 2.94772 1.94772 2.5 2.5 2.5H5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
};

// Display name for React DevTools
Link.displayName = 'Link';

// Default export for convenience
export default Link;
