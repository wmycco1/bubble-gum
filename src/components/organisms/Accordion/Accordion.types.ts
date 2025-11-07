/**
 * Accordion Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Accordion organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Accordion variant styles
 */
export type AccordionVariant = 'default' | 'bordered' | 'filled';

/**
 * Icon type for expand/collapse indicator
 */
export type AccordionIconType = 'chevron' | 'plus-minus';

/**
 * Individual accordion item configuration
 */
export interface AccordionItem {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Item title/header
   */
  title: string;

  /**
   * Item content (text or React nodes)
   */
  content: string | React.ReactNode;

  /**
   * Whether this item is disabled
   */
  disabled?: boolean;
}

/**
 * Accordion Props
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
 *   items={[
 *     { id: '1', title: 'What is this?', content: 'Detailed answer here' },
 *     { id: '2', title: 'How does it work?', content: <CustomComponent /> },
 *     { id: '3', title: 'Pricing', content: 'Pricing details', disabled: true }
 *   ]}
 *   allowMultiple={true}
 *   defaultOpen={['1']}
 *   variant="bordered"
 *   iconType="plus-minus"
 *   onItemToggle={(itemId, isOpen) => console.log(itemId, isOpen)}
 * />
 * ```
 */
export interface AccordionProps extends OrganismParameters {
  /**
   * Array of accordion items (required)
   */
  items: AccordionItem[];

  /**
   * Allow multiple items to be open simultaneously
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Array of item IDs that should be open by default
   * @default []
   */
  defaultOpen?: string[];

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: AccordionVariant;

  /**
   * Icon type for expand/collapse indicator
   * @default 'chevron'
   */
  iconType?: AccordionIconType;

  /**
   * Callback when item is toggled
   * @param itemId - ID of the toggled item
   * @param isOpen - New open state
   */
  onItemToggle?: (itemId: string, isOpen: boolean) => void;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'accordion'
   */
  'data-testid'?: string;
}

/**
 * Accordion component that supports Context API parameter inheritance
 */
export type AccordionComponent = React.FC<AccordionProps>;
