/**
 * Layout Component (Template)
 * God-Tier Development Protocol 2025
 *
 * A page-level layout component with header, footer, sidebar, and main content areas.
 * Uses semantic HTML5 structure for accessibility.
 *
 * @example Basic layout
 * ```tsx
 * <Layout header={<Header />} footer={<Footer />}>
 *   <MainContent />
 * </Layout>
 * ```
 *
 * @example Layout with sidebar
 * ```tsx
 * <Layout
 *   header={<Navbar />}
 *   sidebar={<Sidebar />}
 *   sidebarPosition="left"
 *   footer={<Footer />}
 * >
 *   <Article />
 * </Layout>
 * ```
 */

'use client';

import React from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import {
  useTemplateContext,
  mergeParameters,
  TemplateProvider,
} from '@/context/parameters/ParameterContext';
import type { LayoutProps } from './Layout.types';
import styles from './Layout.module.css';

export const Layout: React.FC<LayoutProps> = (props) => {
  // Get inherited parameters from context
  const contextParams = useTemplateContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as LayoutProps;

  // Destructure with defaults
  const {
    header,
    footer,
    sidebar,
    sidebarPosition = 'left',
    stickyHeader = false,
    stickyFooter = false,
    fullHeight = false,
    sidebarWidth = '250px',
    children,
    className = '',
    'data-testid': testId = 'layout',
    style,
    ...rest
  } = params;

  // Compute CSS classes
  const layoutClasses = [
    styles.layout,
    fullHeight && styles['layout--full-height'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const headerClasses = [
    styles['layout-header'],
    stickyHeader && styles['layout-header--sticky'],
  ]
    .filter(Boolean)
    .join(' ');

  const footerClasses = [
    styles['layout-footer'],
    stickyFooter && styles['layout-footer--sticky'],
  ]
    .filter(Boolean)
    .join(' ');

  const bodyClasses = [
    styles['layout-body'],
    sidebar && styles['layout-body--with-sidebar'],
    sidebar && sidebarPosition === 'left' && styles['layout-body--sidebar-left'],
    sidebar && sidebarPosition === 'right' && styles['layout-body--sidebar-right'],
  ]
    .filter(Boolean)
    .join(' ');

  // Compute sidebar styles
  const sidebarStyles: React.CSSProperties = sidebar
    ? {
        width: sidebarWidth,
        flexShrink: 0,
      }
    : {};

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <TemplateProvider value={params}>
      <div
        className={layoutClasses}
        style={style as React.CSSProperties}
        data-testid={testId}
        {...validDOMProps}
      >
        {/* Header */}
        {header && (
          <header className={headerClasses} data-testid={`${testId}-header`}>
            {header}
          </header>
        )}

        {/* Body (Main + Sidebar) */}
        <div className={bodyClasses} data-testid={`${testId}-body`}>
          {/* Sidebar (left position) */}
          {sidebar && sidebarPosition === 'left' && (
            <aside
              className={styles['layout-sidebar']}
              style={sidebarStyles}
              data-testid={`${testId}-sidebar`}
            >
              {sidebar}
            </aside>
          )}

          {/* Main Content */}
          <main className={styles['layout-main']} data-testid={`${testId}-main`}>
            {children}
          </main>

          {/* Sidebar (right position) */}
          {sidebar && sidebarPosition === 'right' && (
            <aside
              className={styles['layout-sidebar']}
              style={sidebarStyles}
              data-testid={`${testId}-sidebar`}
            >
              {sidebar}
            </aside>
          )}
        </div>

        {/* Footer */}
        {footer && (
          <footer className={footerClasses} data-testid={`${testId}-footer`}>
            {footer}
          </footer>
        )}
      </div>
    </TemplateProvider>
  );
};

// Display name for React DevTools
Layout.displayName = 'Layout';

// Default export for convenience
export default Layout;
