// ═══════════════════════════════════════════════════════════════
// ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Multiple accordion items with expand/collapse
// - CRUD operations (add/remove/edit items)
// - Smooth animations
// - Single or multiple open panels
// - Variant styles (default, bordered, filled)
// - Customizable icons
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { ChevronDown, Plus, Minus } from 'lucide-react';

interface AccordionComponentProps {
  component: CanvasComponent;
}

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export function AccordionComponent({ component }: AccordionComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const items = (props.items as AccordionItem[]) || [
    { id: '1', title: 'Accordion Item 1', content: 'Content for item 1' },
    { id: '2', title: 'Accordion Item 2', content: 'Content for item 2' },
    { id: '3', title: 'Accordion Item 3', content: 'Content for item 3' },
  ];
  const allowMultiple = (props.allowMultiple as boolean) ?? false;
  const defaultOpen = (props.defaultOpen as string[]) || [];
  const variant = (props.variant as 'default' | 'bordered' | 'filled') || 'default';
  const iconType = (props.iconType as 'chevron' | 'plus-minus') || 'chevron';

  // Track which panels are open
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(defaultOpen));

  const togglePanel = (itemId: string) => {
    setOpenPanels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return {
          container: 'border border-slate-200 rounded-lg overflow-hidden',
          item: 'border-b border-slate-200 last:border-b-0',
          header: 'bg-white hover:bg-slate-50',
        };
      case 'filled':
        return {
          container: 'space-y-2',
          item: 'rounded-lg overflow-hidden',
          header: 'bg-slate-100 hover:bg-slate-200',
        };
      default:
        return {
          container: 'space-y-1',
          item: 'rounded-md overflow-hidden border border-slate-200',
          header: 'bg-white hover:bg-slate-50',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Base wrapper className
  const baseClassName = 'w-full';
  const wrapperClassName = mergeClassNameWithSpacing(
    `${baseClassName} ${variantStyles.container}`,
    style
  );

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      {items.map((item) => {
        const isOpen = openPanels.has(item.id);

        return (
          <div key={item.id} className={variantStyles.item}>
            {/* Header */}
            <button
              onClick={() => togglePanel(item.id)}
              className={`w-full flex items-center justify-between p-4 text-left transition-colors ${variantStyles.header}`}
              aria-expanded={isOpen}
            >
              <span className="font-medium text-slate-900">{item.title}</span>

              {/* Icon */}
              <span className="text-slate-600 transition-transform duration-200">
                {iconType === 'chevron' ? (
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                ) : (
                  <>
                    {isOpen ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </>
                )}
              </span>
            </button>

            {/* Content */}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                isOpen ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="p-4 pt-0 text-slate-700 text-sm">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
