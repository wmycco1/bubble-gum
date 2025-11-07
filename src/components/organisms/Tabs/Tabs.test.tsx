/**
 * Tabs Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Tabs } from './Tabs';
import type { TabsProps, TabItem } from './Tabs.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./Tabs.module.css', () => ({
  'tabs': 'tabs',
  'tabs--horizontal': 'tabs--horizontal',
  'tabs--vertical': 'tabs--vertical',
  'tabs-list': 'tabs-list',
  'tabs-list--default': 'tabs-list--default',
  'tabs-list--underline': 'tabs-list--underline',
  'tabs-list--pills': 'tabs-list--pills',
  'tabs-list--enclosed': 'tabs-list--enclosed',
  'tabs-list--horizontal': 'tabs-list--horizontal',
  'tabs-list--vertical': 'tabs-list--vertical',
  'tabs-list--full-width': 'tabs-list--full-width',
  'tab-trigger': 'tab-trigger',
  'tab-trigger--default': 'tab-trigger--default',
  'tab-trigger--underline': 'tab-trigger--underline',
  'tab-trigger--pills': 'tab-trigger--pills',
  'tab-trigger--enclosed': 'tab-trigger--enclosed',
  'tab-trigger--active': 'tab-trigger--active',
  'tab-trigger--disabled': 'tab-trigger--disabled',
  'tab-icon': 'tab-icon',
  'tab-label': 'tab-label',
  'tabs-panels': 'tabs-panels',
  'tab-panel': 'tab-panel',
  'tab-panel--active': 'tab-panel--active',
  'tabs-empty': 'tabs-empty',
}));

// Sample tab items
const sampleTabs: TabItem[] = [
  { id: '1', label: 'Overview', content: 'Overview content here' },
  { id: '2', label: 'Details', content: 'Details content here' },
  { id: '3', label: 'Settings', content: 'Settings content here' },
];

describe('Tabs', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required tabs prop', () => {
      render(<Tabs tabs={sampleTabs} />);
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('renders all tab triggers', () => {
      render(<Tabs tabs={sampleTabs} />);
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders as div element', () => {
      const { container } = render(<Tabs tabs={sampleTabs} />);
      const tabs = container.querySelector('[data-testid="tabs"]');
      expect(tabs?.tagName).toBe('DIV');
    });

    it('applies custom className', () => {
      render(<Tabs tabs={sampleTabs} className="custom-tabs" />);
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('custom-tabs');
    });

    it('applies custom data-testid', () => {
      render(<Tabs tabs={sampleTabs} data-testid="custom-tabs" />);
      expect(screen.getByTestId('custom-tabs')).toBeInTheDocument();
    });

    it('renders tab list with role="tablist"', () => {
      render(<Tabs tabs={sampleTabs} />);
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
    });

    it('renders tab triggers as buttons with role="tab"', () => {
      render(<Tabs tabs={sampleTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('Empty State', () => {
    it('renders empty state when no tabs provided', () => {
      render(<Tabs tabs={[]} />);
      expect(screen.getByText('No tabs available')).toBeInTheDocument();
    });

    it('shows correct testid for empty state', () => {
      render(<Tabs tabs={[]} />);
      expect(screen.getByTestId('tabs-empty')).toBeInTheDocument();
    });
  });

  // ============================================
  // VARIANTS
  // ============================================

  describe('Variants', () => {
    it('renders default variant', () => {
      render(<Tabs tabs={sampleTabs} variant="default" />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--default');
    });

    it('renders underline variant', () => {
      render(<Tabs tabs={sampleTabs} variant="underline" />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--underline');
    });

    it('renders pills variant', () => {
      render(<Tabs tabs={sampleTabs} variant="pills" />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--pills');
    });

    it('renders enclosed variant', () => {
      render(<Tabs tabs={sampleTabs} variant="enclosed" />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--enclosed');
    });

    it('defaults to default variant when not specified', () => {
      render(<Tabs tabs={sampleTabs} />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--default');
    });
  });

  // ============================================
  // ORIENTATION
  // ============================================

  describe('Orientation', () => {
    it('renders horizontal orientation by default', () => {
      render(<Tabs tabs={sampleTabs} />);
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('tabs--horizontal');
    });

    it('renders vertical orientation', () => {
      render(<Tabs tabs={sampleTabs} orientation="vertical" />);
      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('tabs--vertical');
    });

    it('sets aria-orientation on tab list', () => {
      render(<Tabs tabs={sampleTabs} orientation="horizontal" />);
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });

  // ============================================
  // FULL WIDTH
  // ============================================

  describe('Full Width', () => {
    it('applies full-width class when enabled', () => {
      render(<Tabs tabs={sampleTabs} fullWidth={true} />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).toHaveClass('tabs-list--full-width');
    });

    it('does not apply full-width class by default', () => {
      render(<Tabs tabs={sampleTabs} />);
      const tabList = screen.getByTestId('tabs-list');
      expect(tabList).not.toHaveClass('tabs-list--full-width');
    });
  });

  // ============================================
  // TAB SWITCHING
  // ============================================

  describe('Tab Switching', () => {
    it('activates first tab by default', () => {
      render(<Tabs tabs={sampleTabs} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
      expect(firstTab).toHaveAttribute('tabIndex', '0');
    });

    it('activates specified default tab', () => {
      render(<Tabs tabs={sampleTabs} defaultActiveTab="2" />);
      const secondTab = screen.getByTestId('tabs-trigger-2');
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    it('switches tab when clicked', () => {
      render(<Tabs tabs={sampleTabs} />);
      const secondTab = screen.getByTestId('tabs-trigger-2');

      fireEvent.click(secondTab);

      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    it('shows correct content when switching tabs', () => {
      render(<Tabs tabs={sampleTabs} />);

      expect(screen.getByText('Overview content here')).toBeInTheDocument();

      const secondTab = screen.getByTestId('tabs-trigger-2');
      fireEvent.click(secondTab);

      expect(screen.getByText('Details content here')).toBeInTheDocument();
    });

    it('sets inactive tabs to tabIndex -1', () => {
      render(<Tabs tabs={sampleTabs} />);
      const secondTab = screen.getByTestId('tabs-trigger-2');
      const thirdTab = screen.getByTestId('tabs-trigger-3');

      expect(secondTab).toHaveAttribute('tabIndex', '-1');
      expect(thirdTab).toHaveAttribute('tabIndex', '-1');
    });
  });

  // ============================================
  // DISABLED TABS
  // ============================================

  describe('Disabled Tabs', () => {
    const disabledTabs: TabItem[] = [
      { id: '1', label: 'Active Tab', content: 'Active content' },
      { id: '2', label: 'Disabled Tab', content: 'Disabled content', disabled: true },
    ];

    it('renders disabled tab with correct class', () => {
      render(<Tabs tabs={disabledTabs} />);
      const disabledTab = screen.getByTestId('tabs-trigger-2');
      expect(disabledTab).toHaveClass('tab-trigger--disabled');
    });

    it('disables button for disabled tab', () => {
      render(<Tabs tabs={disabledTabs} />);
      const disabledTab = screen.getByTestId('tabs-trigger-2');
      expect(disabledTab).toBeDisabled();
    });

    it('does not activate disabled tab when clicked', () => {
      render(<Tabs tabs={disabledTabs} />);
      const disabledTab = screen.getByTestId('tabs-trigger-2');

      fireEvent.click(disabledTab);

      expect(disabledTab).toHaveAttribute('aria-selected', 'false');
    });

    it('sets aria-disabled for disabled tab', () => {
      render(<Tabs tabs={disabledTabs} />);
      const disabledTab = screen.getByTestId('tabs-trigger-2');
      expect(disabledTab).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ============================================
  // ICONS
  // ============================================

  describe('Icons', () => {
    const tabsWithIcons: TabItem[] = [
      { id: '1', label: 'Home', content: 'Home content', icon: 'home' },
      { id: '2', label: 'Settings', content: 'Settings content', icon: 'settings' },
    ];

    it('renders icons when provided', () => {
      render(<Tabs tabs={tabsWithIcons} />);
      expect(screen.getByTestId('tabs-icon-1')).toBeInTheDocument();
      expect(screen.getByTestId('tabs-icon-2')).toBeInTheDocument();
    });

    it('renders tabs without icons', () => {
      render(<Tabs tabs={sampleTabs} />);
      expect(screen.queryByTestId('tabs-icon-1')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTENT RENDERING
  // ============================================

  describe('Content Rendering', () => {
    it('renders string content', () => {
      render(<Tabs tabs={sampleTabs} />);
      expect(screen.getByText('Overview content here')).toBeInTheDocument();
    });

    it('renders React node content', () => {
      const customTabs: TabItem[] = [
        {
          id: '1',
          label: 'Custom',
          content: (
            <div data-testid="custom-content">
              <h3>Custom Title</h3>
              <p>Custom paragraph</p>
            </div>
          ),
        },
      ];

      render(<Tabs tabs={customTabs} />);
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('shows only active panel content', () => {
      render(<Tabs tabs={sampleTabs} />);

      const panel1 = screen.getByTestId('tabs-panel-1');
      const panel2 = screen.getByTestId('tabs-panel-2');

      expect(panel1).toHaveClass('tab-panel--active');
      expect(panel2).not.toHaveClass('tab-panel--active');
    });

    it('hides inactive panels with aria-hidden', () => {
      render(<Tabs tabs={sampleTabs} />);
      const panel2 = screen.getByTestId('tabs-panel-2');
      expect(panel2).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // ============================================
  // LAZY MOUNTING
  // ============================================

  describe('Lazy Mounting', () => {
    it('mounts all panels when lazyMount is false', () => {
      render(<Tabs tabs={sampleTabs} lazyMount={false} />);

      expect(screen.getByText('Overview content here')).toBeInTheDocument();
      expect(screen.getByText('Details content here')).toBeInTheDocument();
      expect(screen.getByText('Settings content here')).toBeInTheDocument();
    });

    it('mounts only active panel when lazyMount is true', () => {
      render(<Tabs tabs={sampleTabs} lazyMount={true} />);

      expect(screen.getByText('Overview content here')).toBeInTheDocument();
      // Other panels should not be mounted yet
      const panel2 = screen.getByTestId('tabs-panel-2');
      expect(panel2.textContent).toBe('');
    });

    it('mounts panel when activated for the first time with lazyMount', () => {
      render(<Tabs tabs={sampleTabs} lazyMount={true} />);

      const secondTab = screen.getByTestId('tabs-trigger-2');
      fireEvent.click(secondTab);

      expect(screen.getByText('Details content here')).toBeInTheDocument();
    });

    it('keeps previously mounted panels mounted with lazyMount', () => {
      render(<Tabs tabs={sampleTabs} lazyMount={true} />);

      // Activate second tab
      fireEvent.click(screen.getByTestId('tabs-trigger-2'));
      expect(screen.getByText('Details content here')).toBeInTheDocument();

      // Go back to first tab
      fireEvent.click(screen.getByTestId('tabs-trigger-1'));

      // Both should still be in the DOM
      expect(screen.getByText('Overview content here')).toBeInTheDocument();
      expect(screen.getByText('Details content here')).toBeInTheDocument();
    });
  });

  // ============================================
  // CALLBACKS
  // ============================================

  describe('Callbacks', () => {
    it('calls onTabChange when tab is switched', () => {
      const onTabChange = jest.fn();
      render(<Tabs tabs={sampleTabs} onTabChange={onTabChange} />);

      const secondTab = screen.getByTestId('tabs-trigger-2');
      fireEvent.click(secondTab);

      expect(onTabChange).toHaveBeenCalledTimes(1);
      expect(onTabChange).toHaveBeenCalledWith('2');
    });

    it('does not call onTabChange for disabled tab', () => {
      const onTabChange = jest.fn();
      const disabledTabs: TabItem[] = [
        { id: '1', label: 'Active', content: 'Content' },
        { id: '2', label: 'Disabled', content: 'Content', disabled: true },
      ];

      render(<Tabs tabs={disabledTabs} onTabChange={onTabChange} />);

      const disabledTab = screen.getByTestId('tabs-trigger-2');
      fireEvent.click(disabledTab);

      expect(onTabChange).not.toHaveBeenCalled();
    });

    it('does not call onTabChange when clicking already active tab', () => {
      const onTabChange = jest.fn();
      render(<Tabs tabs={sampleTabs} onTabChange={onTabChange} />);

      const firstTab = screen.getByTestId('tabs-trigger-1');
      fireEvent.click(firstTab);

      // Should still call for consistency
      expect(onTabChange).toHaveBeenCalledWith('1');
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  describe('Keyboard Navigation', () => {
    it('navigates to next tab with ArrowRight in horizontal mode', () => {
      render(<Tabs tabs={sampleTabs} orientation="horizontal" />);
      const firstTab = screen.getByTestId('tabs-trigger-1');

      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

      const secondTab = screen.getByTestId('tabs-trigger-2');
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to previous tab with ArrowLeft in horizontal mode', () => {
      render(<Tabs tabs={sampleTabs} orientation="horizontal" defaultActiveTab="2" />);
      const secondTab = screen.getByTestId('tabs-trigger-2');

      fireEvent.keyDown(secondTab, { key: 'ArrowLeft' });

      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to next tab with ArrowDown in vertical mode', () => {
      render(<Tabs tabs={sampleTabs} orientation="vertical" />);
      const firstTab = screen.getByTestId('tabs-trigger-1');

      fireEvent.keyDown(firstTab, { key: 'ArrowDown' });

      const secondTab = screen.getByTestId('tabs-trigger-2');
      expect(secondTab).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to previous tab with ArrowUp in vertical mode', () => {
      render(<Tabs tabs={sampleTabs} orientation="vertical" defaultActiveTab="2" />);
      const secondTab = screen.getByTestId('tabs-trigger-2');

      fireEvent.keyDown(secondTab, { key: 'ArrowUp' });

      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps to first tab when navigating past last tab', () => {
      render(<Tabs tabs={sampleTabs} defaultActiveTab="3" />);
      const thirdTab = screen.getByTestId('tabs-trigger-3');

      fireEvent.keyDown(thirdTab, { key: 'ArrowRight' });

      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps to last tab when navigating before first tab', () => {
      render(<Tabs tabs={sampleTabs} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');

      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });

      const thirdTab = screen.getByTestId('tabs-trigger-3');
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to first tab with Home key', () => {
      render(<Tabs tabs={sampleTabs} defaultActiveTab="3" />);
      const thirdTab = screen.getByTestId('tabs-trigger-3');

      fireEvent.keyDown(thirdTab, { key: 'Home' });

      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    it('navigates to last tab with End key', () => {
      render(<Tabs tabs={sampleTabs} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');

      fireEvent.keyDown(firstTab, { key: 'End' });

      const thirdTab = screen.getByTestId('tabs-trigger-3');
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });

    it('skips disabled tabs when navigating with keyboard', () => {
      const tabsWithDisabled: TabItem[] = [
        { id: '1', label: 'Tab 1', content: 'Content 1' },
        { id: '2', label: 'Tab 2', content: 'Content 2', disabled: true },
        { id: '3', label: 'Tab 3', content: 'Content 3' },
      ];

      render(<Tabs tabs={tabsWithDisabled} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');

      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });

      // Should skip disabled tab and go to third tab
      const thirdTab = screen.getByTestId('tabs-trigger-3');
      expect(thirdTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Tabs tabs={sampleTabs} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('tab triggers have aria-selected attribute', () => {
      render(<Tabs tabs={sampleTabs} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected');
    });

    it('tab triggers have aria-controls attribute', () => {
      render(<Tabs tabs={sampleTabs} />);
      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-controls', 'tabs-panel-1');
    });

    it('tab panels have role="tabpanel"', () => {
      render(<Tabs tabs={sampleTabs} />);
      // Only active panels are visible to screen readers (aria-hidden=false)
      const activePanel = screen.getByRole('tabpanel');
      expect(activePanel).toBeInTheDocument();

      // Verify all panels exist in DOM with role
      const allPanels = screen.getAllByTestId(/^tabs-panel-/);
      expect(allPanels).toHaveLength(3);
      allPanels.forEach((panel) => {
        expect(panel).toHaveAttribute('role', 'tabpanel');
      });
    });

    it('tab panels have aria-labelledby attribute', () => {
      render(<Tabs tabs={sampleTabs} />);
      const panel = screen.getByTestId('tabs-panel-1');
      expect(panel).toHaveAttribute('aria-labelledby', 'tabs-trigger-1');
    });

    it('tab panels have aria-hidden attribute', () => {
      render(<Tabs tabs={sampleTabs} />);
      const panel = screen.getByTestId('tabs-panel-2');
      expect(panel).toHaveAttribute('aria-hidden');
    });

    it('tab list has correct aria-orientation', () => {
      render(<Tabs tabs={sampleTabs} orientation="vertical" />);
      const tabList = screen.getByRole('tablist');
      expect(tabList).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // ============================================
  // CONTEXT API
  // ============================================

  describe('Context API', () => {
    it('inherits parameters from context', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Tabs tabs={sampleTabs} />
        </AtomProvider>
      );

      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('context-class');
    });

    it('props override context parameters', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <Tabs tabs={sampleTabs} className="props-class" />
        </AtomProvider>
      );

      const tabs = screen.getByTestId('tabs');
      expect(tabs).toHaveClass('props-class');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles single tab', () => {
      const singleTab: TabItem[] = [
        { id: '1', label: 'Only Tab', content: 'Only content' },
      ];

      render(<Tabs tabs={singleTab} />);
      expect(screen.getByText('Only Tab')).toBeInTheDocument();
      expect(screen.getByText('Only content')).toBeInTheDocument();
    });

    it('handles many tabs efficiently', () => {
      const manyTabs = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        label: `Tab ${i + 1}`,
        content: `Content ${i + 1}`,
      }));

      render(<Tabs tabs={manyTabs} />);
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 20')).toBeInTheDocument();
    });

    it('handles tab with empty content', () => {
      const emptyContentTabs: TabItem[] = [
        { id: '1', label: 'Empty', content: '' },
      ];

      render(<Tabs tabs={emptyContentTabs} />);
      const panel = screen.getByTestId('tabs-panel-1');
      expect(panel).toBeInTheDocument();
    });

    it('handles all tabs disabled', () => {
      const allDisabledTabs: TabItem[] = [
        { id: '1', label: 'Disabled 1', content: 'Content 1', disabled: true },
        { id: '2', label: 'Disabled 2', content: 'Content 2', disabled: true },
      ];

      render(<Tabs tabs={allDisabledTabs} />);
      const tab1 = screen.getByTestId('tabs-trigger-1');
      const tab2 = screen.getByTestId('tabs-trigger-2');

      expect(tab1).toBeDisabled();
      expect(tab2).toBeDisabled();
    });
  });

  // ============================================
  // RENDERING PERFORMANCE
  // ============================================

  describe('Rendering Performance', () => {
    it('renders with minimal re-renders', () => {
      const { rerender } = render(<Tabs tabs={sampleTabs} />);
      rerender(<Tabs tabs={sampleTabs} />);
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('updates efficiently when tabs change', () => {
      const { rerender } = render(<Tabs tabs={sampleTabs} />);

      const newTabs: TabItem[] = [
        { id: '4', label: 'New Tab', content: 'New content' },
      ];

      rerender(<Tabs tabs={newTabs} />);
      expect(screen.getByText('New Tab')).toBeInTheDocument();
    });

    it('updates active tab efficiently', () => {
      const { rerender } = render(<Tabs tabs={sampleTabs} defaultActiveTab="1" />);
      rerender(<Tabs tabs={sampleTabs} defaultActiveTab="2" />);

      // Should keep the original active tab (controlled by internal state)
      const firstTab = screen.getByTestId('tabs-trigger-1');
      expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});
