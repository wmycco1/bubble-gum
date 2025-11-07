/**
 * Tabs Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Tabs organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Tabs variant styles
 */
export type TabsVariant = 'default' | 'underline' | 'pills' | 'enclosed';

/**
 * Tabs orientation
 */
export type TabsOrientation = 'horizontal' | 'vertical';

/**
 * Individual tab item configuration
 */
export interface TabItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Tab label text
   */
  label: string;

  /**
   * Tab content (text or React nodes)
   */
  content: React.ReactNode;

  /**
   * Optional icon name
   */
  icon?: string;

  /**
   * Whether this tab is disabled
   */
  disabled?: boolean;
}

/**
 * Tabs Props
 *
 * @example Basic tabs
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: '1', label: 'Tab 1', content: 'Content 1' },
 *     { id: '2', label: 'Tab 2', content: 'Content 2' }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured tabs
 * ```tsx
 * <Tabs
 *   tabs={[
 *     { id: '1', label: 'Overview', content: <OverviewPanel />, icon: 'home' },
 *     { id: '2', label: 'Settings', content: <SettingsPanel />, icon: 'settings' },
 *     { id: '3', label: 'Disabled', content: 'Hidden', disabled: true }
 *   ]}
 *   defaultActiveTab="1"
 *   variant="pills"
 *   orientation="horizontal"
 *   fullWidth={true}
 *   lazyMount={true}
 *   onTabChange={(tabId) => console.log('Active tab:', tabId)}
 * />
 * ```
 */
export interface TabsProps extends OrganismParameters {
  /**
   * Array of tab items (required)
   */
  tabs: TabItem[];

  /**
   * Default active tab ID
   * @default First tab ID
   */
  defaultActiveTab?: string;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: TabsVariant;

  /**
   * Orientation of tabs
   * @default 'horizontal'
   */
  orientation?: TabsOrientation;

  /**
   * Make tabs span full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Callback when active tab changes
   * @param tabId - ID of the newly active tab
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Only mount tab content when first activated (performance optimization)
   * @default false
   */
  lazyMount?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'tabs'
   */
  'data-testid'?: string;
}

/**
 * Tabs component that supports Context API parameter inheritance
 */
export type TabsComponent = React.FC<TabsProps>;
