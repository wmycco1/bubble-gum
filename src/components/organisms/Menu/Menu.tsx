/**
 * Menu Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Accessible navigation menu with nested submenu support.
 * Composed of Link and Icon atoms.
 *
 * @example Basic horizontal menu
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Home', href: '/' },
 *   { id: '2', label: 'About', href: '/about' }
 * ];
 * <Menu items={items} orientation="horizontal" />
 * ```
 *
 * @example Nested vertical menu
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Products', children: [
 *     { id: '1-1', label: 'Category 1', href: '/cat1' }
 *   ]}
 * ];
 * <Menu items={items} orientation="vertical" variant="bordered" />
 * ```
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Link } from '@/components/atoms/Link';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Icon } from '@/components/atoms/Icon';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { MenuProps, MenuItem } from './Menu.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Menu.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Menu: React.FC<MenuProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as MenuProps;

  // Destructure with defaults
  const {
    items,
    orientation = 'horizontal',
    variant = 'default',
    activeItemId,
    onItemClick,
    onSubmenuToggle,
    allowMultipleOpen = false,
    defaultOpenIds = [],
    collapseOnClick = false,
    showIcons = true,
    showSubmenuIndicators = true,
    className = '',
    'data-testid': testId = 'menu',
    ...rest
  } = params;

  // Track which submenus are open
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(
    new Set(defaultOpenIds)
  );

  // Track focus for keyboard navigation
  const menuRef = useRef<HTMLElement>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Flatten items for keyboard navigation
  const flattenItems = (items: MenuItem[]): MenuItem[] => {
    const flat: MenuItem[] = [];
    const traverse = (items: MenuItem[]) => {
      items.forEach((item) => {
        flat.push(item);
        if (item.children && openSubmenus.has(item.id)) {
          traverse(item.children);
        }
      });
    };
    traverse(items);
    return flat;
  };

  const flatItems = flattenItems(items);

  // Toggle submenu
  const toggleSubmenu = useCallback(
    (itemId: string, event?: React.MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      setOpenSubmenus((prev) => {
        const next = new Set(prev);
        const isOpen = next.has(itemId);

        if (isOpen) {
          next.delete(itemId);
        } else {
          if (!allowMultipleOpen) {
            // Close all others
            next.clear();
          }
          next.add(itemId);
        }

        // Call callback
        if (onSubmenuToggle) {
          onSubmenuToggle(itemId, !isOpen);
        }

        return next;
      });
    },
    [allowMultipleOpen, onSubmenuToggle]
  );

  // Handle item click
  const handleItemClick = useCallback(
    (item: MenuItem, event: React.MouseEvent) => {
      if (item.disabled) {
        event.preventDefault();
        return;
      }

      // If has children, toggle submenu
      if (item.children && item.children.length > 0) {
        toggleSubmenu(item.id, event);
        return;
      }

      // Call click handler
      if (onItemClick) {
        onItemClick(item, event);
      }

      // Collapse menu if configured
      if (collapseOnClick) {
        setOpenSubmenus(new Set());
      }
    },
    [onItemClick, collapseOnClick, toggleSubmenu]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;

      if (key === 'ArrowDown' || key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = Math.min(focusedIndex + 1, flatItems.length - 1);
        setFocusedIndex(nextIndex);
      } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = Math.max(focusedIndex - 1, 0);
        setFocusedIndex(prevIndex);
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
          const item = flatItems[focusedIndex];
          const linkElement = menuRef.current?.querySelector(
            `[data-menu-item-id="${item.id}"]`
          ) as HTMLAnchorElement;
          if (linkElement) {
            linkElement.click();
          }
        }
      } else if (key === 'Escape') {
        // Close all submenus
        setOpenSubmenus(new Set());
        setFocusedIndex(-1);
      }
    },
    [focusedIndex, flatItems]
  );

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < flatItems.length) {
      const item = flatItems[focusedIndex];
      const linkElement = menuRef.current?.querySelector(
        `[data-menu-item-id="${item.id}"]`
      ) as HTMLAnchorElement;
      if (linkElement) {
        linkElement.focus();
      }
    }
  }, [focusedIndex, flatItems]);

  // Render menu item (recursive)
  const renderMenuItem = (item: MenuItem, level: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenus.has(item.id);
    const isActive = activeItemId === item.id;

    const itemClasses = [
      styles['menu-item'],
      isActive && styles['menu-item--active'],
      item.disabled && styles['menu-item--disabled'],
      hasChildren && styles['menu-item--has-children'],
      hasChildren && isOpen && styles['menu-item--open'],
      level > 0 && styles[`menu-item--level-${level}`],
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <li key={item.id} className={itemClasses} role="none">
        {hasChildren ? (
          // Item with children - button for accessibility
          <button
            className={styles['menu-item-button']}
            onClick={(e) => handleItemClick(item, e as any)}
            disabled={item.disabled}
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-current={isActive ? 'page' : undefined}
            data-menu-item-id={item.id}
            data-testid={`${testId}-item-${item.id}`}
          >
            {showIcons && item.icon && (
              <Icon
                name={item.icon}
                size="sm"
                aria-hidden="true"
                className={styles['menu-item-icon']}
              />
            )}
            <span className={styles['menu-item-label']}>{item.label}</span>
            {showSubmenuIndicators && (
              <Icon
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size="sm"
                aria-hidden="true"
                className={styles['menu-item-indicator']}
              />
            )}
          </button>
        ) : (
          // Regular link item
          <Link
            href={item.href || '#'}
            className={styles['menu-item-link']}
            onClick={(e) => handleItemClick(item, e as any)}
            disabled={item.disabled}
            aria-current={isActive ? 'page' : undefined}
            data-menu-item-id={item.id}
            data-testid={`${testId}-item-${item.id}`}
          >
            {showIcons && item.icon && (
              <Icon
                name={item.icon}
                size="sm"
                aria-hidden="true"
                className={styles['menu-item-icon']}
              />
            )}
            <span className={styles['menu-item-label']}>{item.label}</span>
          </Link>
        )}

        {/* Submenu */}
        {hasChildren && isOpen && (
          <ul
            className={styles['menu-submenu']}
            role="menu"
            aria-label={`${item.label} submenu`}
          >
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  // Compute CSS classes
  const classes = [
    styles.menu,
    styles[`menu--${orientation}`],
    styles[`menu--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <nav
      ref={menuRef}
      className={classes}
      data-testid={testId}
      onKeyDown={handleKeyDown}
      {...validDOMProps}
    >
      <ul className={styles['menu-list']} role="menubar" aria-orientation={orientation}>
        <AtomProvider value={{ size: 'sm' }}>
          {items.map((item) => renderMenuItem(item, 0))}
        </AtomProvider>
      </ul>
    </nav>
  );
};

// Display name for React DevTools
Menu.displayName = 'Menu';

// Default export for convenience
export default Menu;
