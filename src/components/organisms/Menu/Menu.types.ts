/**
 * Menu Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Menu organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Menu item structure (recursive for nested menus)
 */
export interface MenuItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Link URL (optional)
   */
  href?: string;

  /**
   * Icon name (optional)
   */
  icon?: string;

  /**
   * Nested child menu items (for submenus)
   */
  children?: MenuItem[];

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Custom data attributes
   */
  data?: Record<string, any>;
}

/**
 * Menu orientation
 */
export type MenuOrientation = 'horizontal' | 'vertical';

/**
 * Menu variant
 */
export type MenuVariant = 'default' | 'minimal' | 'bordered' | 'pills';

/**
 * Menu Props
 *
 * @example Basic horizontal menu
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Home', href: '/' },
 *   { id: '2', label: 'About', href: '/about' },
 *   { id: '3', label: 'Contact', href: '/contact' }
 * ];
 * <Menu items={items} orientation="horizontal" />
 * ```
 *
 * @example Nested menu with submenus
 * ```tsx
 * const items = [
 *   { id: '1', label: 'Products', children: [
 *     { id: '1-1', label: 'Category 1', href: '/products/cat1' },
 *     { id: '1-2', label: 'Category 2', href: '/products/cat2' }
 *   ]},
 *   { id: '2', label: 'Services', href: '/services' }
 * ];
 * <Menu items={items} orientation="vertical" variant="bordered" />
 * ```
 *
 * @example With active item and click handler
 * ```tsx
 * <Menu
 *   items={items}
 *   activeItemId="2"
 *   onItemClick={(item) => console.log('Clicked:', item.label)}
 * />
 * ```
 */
export interface MenuProps extends OrganismParameters {
  /**
   * Menu items (required)
   * Array of menu items, can be nested for submenus
   */
  items: MenuItem[];

  /**
   * Menu orientation
   * @default 'horizontal'
   */
  orientation?: MenuOrientation;

  /**
   * Menu variant
   * @default 'default'
   */
  variant?: MenuVariant;

  /**
   * Active item ID (for current page/selection)
   * Highlights the active menu item
   */
  activeItemId?: string;

  /**
   * Item click handler
   * Called when a menu item is clicked (not called for disabled items)
   */
  onItemClick?: (item: MenuItem, event: React.MouseEvent) => void;

  /**
   * Submenu open/close handler
   * Called when a submenu is expanded or collapsed
   */
  onSubmenuToggle?: (itemId: string, isOpen: boolean) => void;

  /**
   * Allow multiple submenus open at once
   * @default false (accordion behavior)
   */
  allowMultipleOpen?: boolean;

  /**
   * Default open submenu IDs
   * Array of item IDs that should be open by default
   */
  defaultOpenIds?: string[];

  /**
   * Collapse on item click (for mobile)
   * @default false
   */
  collapseOnClick?: boolean;

  /**
   * Show icons for menu items
   * @default true
   */
  showIcons?: boolean;

  /**
   * Show submenu indicators (arrows/chevrons)
   * @default true
   */
  showSubmenuIndicators?: boolean;

  /**
   * Custom CSS class for menu container
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'menu'
   */
  'data-testid'?: string;
}

/**
 * Menu component that supports Context API parameter inheritance
 */
export type MenuComponent = React.FC<MenuProps>;
