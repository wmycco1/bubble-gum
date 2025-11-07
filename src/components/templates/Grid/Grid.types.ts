/**
 * Grid Component Types (Template)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Grid template component
 */

import type { GridParameters } from '@/types/parameters';

/**
 * Gap presets for Grid
 */
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive breakpoint configuration for Grid columns
 */
export interface GridResponsive {
  /**
   * Columns on mobile (default)
   */
  mobile?: number;

  /**
   * Columns on tablet (768px+)
   */
  tablet?: number;

  /**
   * Columns on desktop (1024px+)
   */
  desktop?: number;

  /**
   * Columns on wide screens (1280px+)
   */
  wide?: number;
}

/**
 * Grid Props
 *
 * A multi-column grid layout component with responsive column control
 *
 * @example Basic grid
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 *
 * @example Responsive grid
 * ```tsx
 * <Grid
 *   responsive={{ mobile: 1, tablet: 2, desktop: 3 }}
 *   gap="lg"
 * >
 *   <Card />
 *   <Card />
 *   <Card />
 * </Grid>
 * ```
 *
 * @example Custom column widths
 * ```tsx
 * <Grid columnWidths={['1fr', '2fr', '1fr']} gap="md">
 *   <Sidebar />
 *   <MainContent />
 *   <Aside />
 * </Grid>
 * ```
 */
export interface GridProps extends Partial<GridParameters> {
  /**
   * Number of columns (1-12)
   * @default 3
   */
  columns?: number;

  /**
   * Custom column widths (fr units, px, %, etc.)
   * Overrides columns prop
   *
   * @example ['1fr', '2fr', '1fr']
   * @example ['200px', '1fr', '200px']
   */
  columnWidths?: string[];

  /**
   * Gap between grid items
   * @default 'md'
   */
  gap?: GridGap;

  /**
   * Responsive column configuration
   * Overrides columns prop at breakpoints
   *
   * @example { mobile: 1, tablet: 2, desktop: 3 }
   */
  responsive?: GridResponsive;

  /**
   * Grid children (required)
   */
  children: React.ReactNode;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'grid'
   */
  'data-testid'?: string;

  /**
   * Polymorphic element type
   * @default 'div'
   */
  as?: 'div' | 'section' | 'article' | 'ul' | 'ol';
}

/**
 * Grid component that supports Context API parameter inheritance
 */
export type GridComponent = React.FC<GridProps>;
