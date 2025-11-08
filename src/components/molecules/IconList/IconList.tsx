/**
 * IconList Component (Molecule)
 * God-Tier Development Protocol 2025
 *
 * A list of items with icons, commonly used for features, benefits, or specs.
 *
 * @example Basic
 * ```tsx
 * <IconList
 *   items={[
 *     { id: '1', text: 'Fast performance' },
 *     { id: '2', text: 'Easy to use' },
 *     { id: '3', text: 'Secure by default' }
 *   ]}
 * />
 * ```
 *
 * @example Custom icons
 * ```tsx
 * <IconList
 *   items={[
 *     { id: '1', icon: '🚀', text: 'Blazing fast' },
 *     { id: '2', icon: '🔒', text: 'Secure' },
 *     { id: '3', icon: '💎', text: 'Premium quality' }
 *   ]}
 * />
 * ```
 *
 * @example With links
 * ```tsx
 * <IconList
 *   items={[
 *     { id: '1', text: 'Documentation', href: '/docs' },
 *     { id: '2', text: 'API Reference', href: '/api' }
 *   ]}
 * />
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters } from '@/context/parameters/ParameterContext';
import type { IconListProps, IconListItem } from './IconList.types';
import styles from './IconList.module.css';

export const IconList: React.FC<IconListProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as IconListProps;

  // Destructure with defaults
  const {
    items = [],
    defaultIcon = '✓',
    iconPosition = 'left',
    spacing = 'default',
    iconColor,
    textColor,
    className = '',
    style,
    'data-testid': testId = 'icon-list',
    'aria-label': ariaLabel,
    ...rest
  } = params;

  // Compute CSS classes
  const listClasses = [
    styles['icon-list'],
    styles[`icon-list--${spacing}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const itemClasses = [
    styles['icon-list__item'],
    styles[`icon-list__item--${iconPosition}`],
  ]
    .filter(Boolean)
    .join(' ');

  const iconClasses = [
    styles['icon-list__icon'],
    styles[`icon-list__icon--${iconPosition}`],
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props
  const validDOMProps = getValidDOMProps(rest);

  // Render icon (string or ReactNode)
  const renderIcon = (item: IconListItem) => {
    const icon = item.icon || defaultIcon;

    if (typeof icon === 'string') {
      return (
        <span
          className={iconClasses}
          style={{ color: iconColor }}
          aria-hidden="true"
        >
          {icon}
        </span>
      );
    }

    return (
      <span className={iconClasses} style={{ color: iconColor }}>
        {icon}
      </span>
    );
  };

  // Render text (with or without link)
  const renderText = (item: IconListItem) => {
    const textStyle: React.CSSProperties = textColor ? { color: textColor } : {};

    if (item.href) {
      return (
        <a
          href={item.href}
          className={`${styles['icon-list__text']} ${styles['icon-list__link']}`}
          style={textStyle}
        >
          {item.text}
        </a>
      );
    }

    return (
      <span className={styles['icon-list__text']} style={textStyle}>
        {item.text}
      </span>
    );
  };

  return (
    <ul
      className={listClasses}
      style={style}
      data-testid={testId}
      aria-label={ariaLabel}
      {...validDOMProps}
    >
      {items.map((item) => (
        <li key={item.id} className={itemClasses}>
          {renderIcon(item)}
          {renderText(item)}
        </li>
      ))}
    </ul>
  );
};

// Display name for React DevTools
IconList.displayName = 'IconList';

// Default export for convenience
export default IconList;
