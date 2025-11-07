/**
 * Tabs Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * A tabbed interface component for organizing content into separate panels.
 * Composed of Button, Text, and Icon atoms.
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
 *   tabs={tabsData}
 *   defaultActiveTab="overview"
 *   variant="pills"
 *   orientation="horizontal"
 *   fullWidth={true}
 *   lazyMount={true}
 *   onTabChange={(tabId) => console.log(tabId)}
 * />
 * ```
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import type { TabsProps, TabItem } from './Tabs.types';
import styles from './Tabs.module.css';

export const Tabs: React.FC<TabsProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as TabsProps;

  // Destructure with defaults
  const {
    tabs,
    defaultActiveTab,
    variant = 'default',
    orientation = 'horizontal',
    fullWidth = false,
    onTabChange,
    lazyMount = false,
    className = '',
    'data-testid': testId = 'tabs',
    style,
    ...rest
  } = params;

  // Determine default active tab
  const initialActiveTab = defaultActiveTab || tabs[0]?.id || '';

  // State for active tab
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);

  // Track which tabs have been mounted (for lazy mounting)
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(
    new Set(lazyMount ? [initialActiveTab] : tabs.map((tab) => tab.id))
  );

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string, disabled?: boolean) => {
      if (disabled) return;

      setActiveTab(tabId);
      onTabChange?.(tabId);

      // Add to mounted tabs if lazy mounting
      if (lazyMount) {
        setMountedTabs((prev) => new Set(prev).add(tabId));
      }
    },
    [onTabChange, lazyMount]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const enabledTabs = tabs.filter((tab) => !tab.disabled);
      const currentIndex = enabledTabs.findIndex((tab) => tab.id === tabs[index].id);

      let targetIndex = -1;

      // Arrow key navigation
      if (orientation === 'horizontal') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          targetIndex = (currentIndex + 1) % enabledTabs.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          targetIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        }
      } else {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (currentIndex + 1) % enabledTabs.length;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
        }
      }

      // Focus and activate the target tab
      if (targetIndex >= 0 && enabledTabs[targetIndex]) {
        const targetTab = enabledTabs[targetIndex];
        const targetButton = document.querySelector(
          `[data-tab-trigger="${targetTab.id}"]`
        ) as HTMLButtonElement;
        targetButton?.focus();
        handleTabChange(targetTab.id, targetTab.disabled);
      }

      // Home/End keys
      if (e.key === 'Home') {
        e.preventDefault();
        const firstTab = enabledTabs[0];
        if (firstTab) {
          const firstButton = document.querySelector(
            `[data-tab-trigger="${firstTab.id}"]`
          ) as HTMLButtonElement;
          firstButton?.focus();
          handleTabChange(firstTab.id, firstTab.disabled);
        }
      } else if (e.key === 'End') {
        e.preventDefault();
        const lastTab = enabledTabs[enabledTabs.length - 1];
        if (lastTab) {
          const lastButton = document.querySelector(
            `[data-tab-trigger="${lastTab.id}"]`
          ) as HTMLButtonElement;
          lastButton?.focus();
          handleTabChange(lastTab.id, lastTab.disabled);
        }
      }
    },
    [tabs, orientation, handleTabChange]
  );

  // Compute CSS classes
  const containerClasses = [
    styles['tabs'],
    styles[`tabs--${orientation}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tabListClasses = [
    styles['tabs-list'],
    styles[`tabs-list--${variant}`],
    styles[`tabs-list--${orientation}`],
    fullWidth && styles['tabs-list--full-width'],
  ]
    .filter(Boolean)
    .join(' ');

  // Find active tab content
  const activeTabData = useMemo(
    () => tabs.find((tab) => tab.id === activeTab),
    [tabs, activeTab]
  );

  // Empty state
  if (!tabs || tabs.length === 0) {
    return (
      <div className={styles['tabs-empty']} data-testid={`${testId}-empty`}>
        <Text align="center" color="muted">
          No tabs available
        </Text>
      </div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...rest}
    >
      {/* Tab List */}
      <div className={tabListClasses} role="tablist" aria-orientation={orientation} data-testid={`${testId}-list`}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${testId}-panel-${tab.id}`}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              className={[
                styles['tab-trigger'],
                styles[`tab-trigger--${variant}`],
                isActive && styles['tab-trigger--active'],
                tab.disabled && styles['tab-trigger--disabled'],
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleTabChange(tab.id, tab.disabled)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              data-tab-trigger={tab.id}
              data-testid={`${testId}-trigger-${tab.id}`}
            >
              {/* Icon */}
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size="sm"
                  color={isActive ? 'primary' : tab.disabled ? 'muted' : 'default'}
                  className={styles['tab-icon']}
                  data-testid={`${testId}-icon-${tab.id}`}
                />
              )}

              {/* Label */}
              <span className={styles['tab-label']} data-testid={`${testId}-label-${tab.id}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className={styles['tabs-panels']} data-testid={`${testId}-panels`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const shouldMount = !lazyMount || mountedTabs.has(tab.id);

          return (
            <div
              key={tab.id}
              id={`${testId}-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`${testId}-trigger-${tab.id}`}
              aria-hidden={!isActive}
              className={[
                styles['tab-panel'],
                isActive && styles['tab-panel--active'],
              ]
                .filter(Boolean)
                .join(' ')}
              data-testid={`${testId}-panel-${tab.id}`}
            >
              {shouldMount && (
                <AtomProvider value={{ align: 'left' }}>
                  {typeof tab.content === 'string' ? (
                    <Text size="sm" color="default" data-testid={`${testId}-content-${tab.id}`}>
                      {tab.content}
                    </Text>
                  ) : (
                    tab.content
                  )}
                </AtomProvider>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Display name for React DevTools
Tabs.displayName = 'Tabs';

// Default export for convenience
export default Tabs;
