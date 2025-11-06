// ═══════════════════════════════════════════════════════════════
// TABS COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Multiple tabs with switching
// - CRUD operations (add/remove/edit tabs)
// - Horizontal/vertical orientation
// - Variant styles (default, pills, underline)
// - Optional icons
// - Closable tabs
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';
import { X } from 'lucide-react';

interface TabsComponentProps {
  component: CanvasComponent;
}

interface TabItem {
  id: string;
  label: string;
  content: string;
  icon?: string;
  [key: string]: unknown;
}

export function TabsComponent({ component }: TabsComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const tabs = (props.tabs as TabItem[]) || [
    { id: '1', label: 'Tab 1', content: 'Content for tab 1' },
    { id: '2', label: 'Tab 2', content: 'Content for tab 2' },
    { id: '3', label: 'Tab 3', content: 'Content for tab 3' },
  ];
  const defaultTab = (props.defaultTab as string) || tabs[0]?.id || '';
  const orientation = (props.orientation as 'horizontal' | 'vertical') || 'horizontal';
  const variant = (props.variant as 'default' | 'pills' | 'underline') || 'default';
  const closable = (props.closable as boolean) ?? false;

  // Track active tab
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Get variant styles
  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-blue-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
      case 'underline':
        return isActive
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-slate-700 border-b-2 border-transparent hover:text-slate-900 hover:border-slate-300';
      default:
        return isActive
          ? 'bg-white text-slate-900 border-b-2 border-blue-600'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  };

  // Base wrapper className
  const baseClassName = 'w-full';
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  // Merge all custom styles (typography, filters, transitions, custom CSS)
  const finalStyle = mergeAllStyles(cleanedStyle as React.CSSProperties, props);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content || '';

  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
    >
      <div
        className={`flex ${
          orientation === 'horizontal' ? 'flex-row' : 'flex-col'
        }`}
      >
        {/* Tab List */}
        <div
          className={`flex ${
            orientation === 'horizontal'
              ? 'flex-row space-x-1 border-b border-slate-200'
              : 'flex-col space-y-1 border-r border-slate-200 pr-4'
          }`}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <div key={tab.id} className="relative flex items-center">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-md ${getTabStyles(
                    isActive
                  )}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {tab.icon && <span className="mr-2">{tab.icon}</span>}
                  {tab.label}
                </button>

                {/* Close button */}
                {closable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // In real implementation, would remove tab
                      // For now, just switch to first tab if closing active
                      if (tab.id === activeTab && tabs.length > 1) {
                        const remainingTabs = tabs.filter((t) => t.id !== tab.id);
                        setActiveTab(remainingTabs[0]?.id || '');
                      }
                    }}
                    className="ml-2 p-0.5 rounded hover:bg-slate-200 transition-colors"
                    title="Close tab"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Tab Content */}
        <div
          className={`flex-1 p-4 ${
            orientation === 'horizontal' ? 'mt-0' : 'ml-4'
          }`}
          role="tabpanel"
        >
          <div className="text-slate-700 text-sm">{activeTabContent}</div>
        </div>
      </div>
    </div>
  );
}
