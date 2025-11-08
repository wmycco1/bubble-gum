/**
 * Accordion Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * An expandable/collapsible accordion component for organizing content.
 * Composed of Button, Heading, Text, and Icon atoms.
 *
 * @example Basic accordion
 * ```tsx
 * <Accordion
 *   items={[
 *     { id: '1', title: 'Question 1', content: 'Answer 1' },
 *     { id: '2', title: 'Question 2', content: 'Answer 2' }
 *   ]}
 * />
 * ```
 *
 * @example Full-featured accordion
 * ```tsx
 * <Accordion
 *   items={faqItems}
 *   allowMultiple={true}
 *   defaultOpen={['1']}
 *   variant="bordered"
 *   iconType="plus-minus"
 *   onItemToggle={(itemId, isOpen) => console.log(itemId, isOpen)}
 * />
 * ```
 */

'use client';

import React, { useState, useCallback } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useAtomContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Icon } from '@/components/atoms/Icon';
import type { AccordionProps, AccordionItem } from './Accordion.types';
import styles from './Accordion.module.css';

export const Accordion: React.FC<AccordionProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useAtomContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as AccordionProps;

  // Destructure with defaults
  const {
    items,
    allowMultiple = false,
    defaultOpen = [],
    variant = 'default',
    iconType = 'chevron',
    onItemToggle,
    className = '',
    'data-testid': testId = 'accordion',
    style,
    ...rest
  } = params;

  // State for tracking open items
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  // Handle item toggle
  const handleToggle = useCallback(
    (itemId: string, disabled?: boolean) => {
      if (disabled) return;

      setOpenItems((prev) => {
        const newSet = new Set(prev);
        const isCurrentlyOpen = newSet.has(itemId);

        if (isCurrentlyOpen) {
          newSet.delete(itemId);
        } else {
          // If not allowing multiple, close all other items
          if (!allowMultiple) {
            newSet.clear();
          }
          newSet.add(itemId);
        }

        // Call onItemToggle callback
        onItemToggle?.(itemId, !isCurrentlyOpen);

        return newSet;
      });
    },
    [allowMultiple, onItemToggle]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, itemId: string, disabled?: boolean) => {
      if (disabled) return;

      // Enter or Space to toggle
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle(itemId, disabled);
      }

      // Arrow keys for navigation
      const currentIndex = items.findIndex((item) => item.id === itemId);
      let targetIndex = -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = currentIndex + 1;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = currentIndex - 1;
      }

      // Focus the target item
      if (targetIndex >= 0 && targetIndex < items.length) {
        const targetButton = document.querySelector(
          `[data-accordion-item="${items[targetIndex].id}"]`
        ) as HTMLButtonElement;
        targetButton?.focus();
      }
    },
    [items, handleToggle]
  );

  // Compute CSS classes
  const containerClasses = [
    styles['accordion'],
    styles[`accordion--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div className={styles['accordion-empty']} data-testid={`${testId}-empty`}>
        <Text align="center" color="muted">
          No accordion items available
        </Text>
      </div>
    );
  }

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <div
      className={containerClasses}
      style={style as React.CSSProperties}
      data-testid={testId}
      {...validDOMProps}
    >
      {items.map((item, index) => {
        const isOpen = openItems.has(item.id);
        const itemClasses = [
          styles['accordion-item'],
          isOpen && styles['accordion-item--open'],
          item.disabled && styles['accordion-item--disabled'],
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={item.id} className={itemClasses} data-testid={`${testId}-item-${item.id}`}>
            {/* Header/Trigger Button */}
            <button
              className={styles['accordion-header']}
              onClick={() => handleToggle(item.id, item.disabled)}
              onKeyDown={(e) => handleKeyDown(e, item.id, item.disabled)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`${testId}-content-${item.id}`}
              aria-disabled={item.disabled}
              data-accordion-item={item.id}
              data-testid={`${testId}-header-${item.id}`}
            >
              {/* Title */}
              <AtomProvider value={{ align: 'left' }}>
                <Heading
                  level="h3"
                  className={styles['accordion-title']}
                  data-testid={`${testId}-title-${item.id}`}
                >
                  {item.title}
                </Heading>
              </AtomProvider>

              {/* Icon */}
              <div className={styles['accordion-icon']} data-testid={`${testId}-icon-${item.id}`}>
                {iconType === 'chevron' ? (
                  <Icon
                    name="chevron-down"
                    size="sm"
                    color={item.disabled ? 'muted' : 'default'}
                    className={`${styles['icon-chevron']} ${isOpen ? styles['icon-chevron--open'] : ''}`}
                  />
                ) : (
                  <Icon
                    name={isOpen ? 'minus' : 'plus'}
                    size="sm"
                    color={item.disabled ? 'muted' : 'default'}
                    className={styles['icon-plus-minus']}
                  />
                )}
              </div>
            </button>

            {/* Content Panel */}
            <div
              id={`${testId}-content-${item.id}`}
              className={styles['accordion-content']}
              role="region"
              aria-labelledby={`${testId}-header-${item.id}`}
              aria-hidden={!isOpen}
              data-testid={`${testId}-content-${item.id}`}
            >
              <div className={styles['accordion-content-inner']}>
                {typeof item.content === 'string' ? (
                  <AtomProvider value={{ align: 'left' }}>
                    <Text
                      size="sm"
                      color="default"
                      data-testid={`${testId}-text-${item.id}`}
                    >
                      {item.content}
                    </Text>
                  </AtomProvider>
                ) : (
                  item.content
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Display name for React DevTools
Accordion.displayName = 'Accordion';

// Default export for convenience
export default Accordion;
