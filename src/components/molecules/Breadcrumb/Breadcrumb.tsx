/**
 * Breadcrumb Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * Breadcrumb navigation component composed of Link, Icon, and Text Atoms.
 * Uses AtomParameters for styling through Context API.
 *
 * @example Basic
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { id: '1', label: 'Home', href: '/' },
 *     { id: '2', label: 'Products', href: '/products' },
 *     { id: '3', label: 'Category' }
 *   ]}
 * />
 * ```
 *
 * @example With custom separator
 * ```tsx
 * <Breadcrumb items={items} separator="arrow" />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <AtomProvider value={{ size: 'sm' }}>
 *   <Breadcrumb items={items} />
 * </AtomProvider>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Link } from '@/components/atoms/Link';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Icon } from '@/components/atoms/Icon';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Text } from '@/components/atoms/Text';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { BreadcrumbProps } from './Breadcrumb.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Breadcrumb.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as BreadcrumbProps;

  // Destructure with defaults
  const {
    items,
    separator = 'chevron',
    showHome = false,
    className = '',
    'data-testid': testId = 'breadcrumb',
    ...rest
  } = params;

  // Get separator icon name
  const getSeparatorIconName = () => {
    switch (separator) {
      case 'arrow':
        return 'arrow-right';
      case 'slash':
        return 'slash';
      default:
        return 'chevron-right';
    }
  };

  // Compute CSS classes
  const classes = [
    styles.breadcrumb,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!items || items.length === 0) {
    return null;
  }

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <nav
      className={classes}
      aria-label="Breadcrumb"
      data-testid={testId}
      {...validDOMProps}
    >
      <ol className={styles['breadcrumb-list']}>
        <AtomProvider value={{ size: 'sm' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={item.id}
                className={styles['breadcrumb-item']}
                data-testid={`${testId}-item-${item.id}`}
              >
                {/* Item content */}
                <span className={styles['breadcrumb-item-content']}>
                  {/* Home icon for first item */}
                  {isFirst && showHome && (
                    <Icon name="home" size="xs" className={styles['breadcrumb-home-icon']} />
                  )}

                  {/* Link or Text */}
                  {item.href ? (
                    <Link
                      href={item.href}
                      variant="default"
                      className={styles['breadcrumb-link']}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Text
                      as="span"
                      className={isLast ? styles['breadcrumb-current'] : styles['breadcrumb-text']}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </Text>
                  )}
                </span>

                {/* Separator */}
                {!isLast && (
                  <span
                    className={styles['breadcrumb-separator']}
                    aria-hidden="true"
                    data-testid={`${testId}-separator`}
                  >
                    {separator === 'slash' ? (
                      <Text as="span" className={styles['breadcrumb-separator-text']}>
                        /
                      </Text>
                    ) : (
                      <Icon name={getSeparatorIconName()} size="xs" color="muted" />
                    )}
                  </span>
                )}
              </li>
            );
          })}
        </AtomProvider>
      </ol>
    </nav>
  );
};

// Display name for React DevTools
Breadcrumb.displayName = 'Breadcrumb';

// Default export for convenience
export default Breadcrumb;
