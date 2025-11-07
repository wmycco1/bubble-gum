/**
 * TextEditor Component Types (Organism)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for TextEditor organism component
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * TextEditor Props
 *
 * @description Rich text editor component
 * @composition Textarea + formatting buttons
 *
 * @example
 * ```tsx
 * <TextEditor
 *   // Add your props here
 * />
 * ```
 */
export interface TextEditorProps extends OrganismParameters {
  /**
   * Component data (customize based on needs)
   */
  data?: Record<string, any>;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'text-editor'
   */
  'data-testid'?: string;
}

/**
 * TextEditor component that supports Context API parameter inheritance
 */
export type TextEditorComponent = React.FC<TextEditorProps>;
