/**
 * Templates - Central Export
 * God-Tier Development Protocol 2025
 *
 * Template components are page-level layout structures that compose
 * Organisms, Molecules, and Atoms. They define the overall page structure
 * but don't contain specific content.
 *
 * Atomic Design Hierarchy:
 * Pages → Templates → Organisms → Molecules → Atoms
 */

// Container Template
export { Container, default as ContainerDefault } from './Container';
export type {
  ContainerProps,
  ContainerComponent,
  ContainerMaxWidth,
  ContainerPadding,
} from './Container';

// Section Template
export { Section, default as SectionDefault } from './Section';
export type {
  SectionProps,
  SectionComponent,
  SectionBackground,
  SectionPadding,
} from './Section';

// Grid Template
export { Grid, default as GridDefault } from './Grid';
export type {
  GridProps,
  GridComponent,
  GridGap,
  GridResponsive,
} from './Grid';

// Layout Template
export { Layout, default as LayoutDefault } from './Layout';
export type {
  LayoutProps,
  LayoutComponent,
  SidebarPosition,
} from './Layout';

/**
 * Template Inventory (4 components)
 *
 * 1. Container - Max-width wrapper with responsive padding
 * 2. Section - Content section with background and padding
 * 3. Grid - Multi-column grid layout with responsive columns
 * 4. Layout - Page-level layout (header, footer, sidebar, main)
 */
