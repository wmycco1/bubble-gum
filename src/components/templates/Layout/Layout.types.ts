/**
 * Layout Component Types (Template)
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Layout template component
 */

import type { TemplateParameters } from '@/types/parameters';

/**
 * Sidebar position
 */
export type SidebarPosition = 'left' | 'right';

/**
 * Layout Props
 *
 * A page-level layout component with header, footer, sidebar, and main content areas
 *
 * @example Basic layout
 * ```tsx
 * <Layout
 *   header={<Header />}
 *   footer={<Footer />}
 * >
 *   <MainContent />
 * </Layout>
 * ```
 *
 * @example Layout with sidebar
 * ```tsx
 * <Layout
 *   header={<Header />}
 *   sidebar={<Sidebar />}
 *   sidebarPosition="left"
 *   footer={<Footer />}
 * >
 *   <Article />
 * </Layout>
 * ```
 *
 * @example Sticky header layout
 * ```tsx
 * <Layout
 *   header={<Navbar />}
 *   stickyHeader={true}
 *   fullHeight={true}
 * >
 *   <Content />
 * </Layout>
 * ```
 */
export interface LayoutProps extends Partial<TemplateParameters> {
  /**
   * Header content (navbar, etc.)
   */
  header?: React.ReactNode;

  /**
   * Footer content
   */
  footer?: React.ReactNode;

  /**
   * Sidebar content
   */
  sidebar?: React.ReactNode;

  /**
   * Sidebar position
   * @default 'left'
   */
  sidebarPosition?: SidebarPosition;

  /**
   * Make header sticky (fixed to top)
   * @default false
   */
  stickyHeader?: boolean;

  /**
   * Make footer sticky (fixed to bottom)
   * @default false
   */
  stickyFooter?: boolean;

  /**
   * Full viewport height layout
   * @default false
   */
  fullHeight?: boolean;

  /**
   * Sidebar width (CSS value)
   * @default '250px'
   */
  sidebarWidth?: string;

  /**
   * Main content (required)
   */
  children: React.ReactNode;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Test ID for testing
   * @default 'layout'
   */
  'data-testid'?: string;
}

/**
 * Layout component that supports Context API parameter inheritance
 */
export type LayoutComponent = React.FC<LayoutProps>;
