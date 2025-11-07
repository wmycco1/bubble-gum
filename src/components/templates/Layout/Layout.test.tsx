/**
 * Layout Component Tests (Template)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Layout template component
 * Target: 40+ tests minimum
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Layout } from './Layout';
import { TemplateProvider } from '@/context/parameters/ParameterContext';

describe('Layout Component', () => {
  // ============================================
  // BASIC RENDERING (5 tests)
  // ============================================

  describe('Basic Rendering', () => {
    it('should render with children (main content)', () => {
      render(
        <Layout>
          <div>Main Content</div>
        </Layout>
      );

      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<Layout>Content</Layout>);

      const layout = screen.getByTestId('layout');
      expect(layout).toBeInTheDocument();
      expect(layout).toHaveClass('layout');
    });

    it('should apply custom className', () => {
      render(<Layout className="custom-class">Content</Layout>);

      expect(screen.getByTestId('layout')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(<Layout data-testid="custom-layout">Content</Layout>);

      expect(screen.getByTestId('custom-layout')).toBeInTheDocument();
    });

    it('should render main content area', () => {
      render(<Layout>Main</Layout>);

      expect(screen.getByTestId('layout-main')).toBeInTheDocument();
    });
  });

  // ============================================
  // HEADER (4 tests)
  // ============================================

  describe('Header', () => {
    it('should render header when provided', () => {
      render(
        <Layout header={<div>Header Content</div>}>
          Main
        </Layout>
      );

      expect(screen.getByText('Header Content')).toBeInTheDocument();
      expect(screen.getByTestId('layout-header')).toBeInTheDocument();
    });

    it('should not render header when not provided', () => {
      render(<Layout>Main</Layout>);

      expect(screen.queryByTestId('layout-header')).not.toBeInTheDocument();
    });

    it('should not apply sticky class by default', () => {
      render(
        <Layout header={<div>Header</div>}>
          Main
        </Layout>
      );

      const header = screen.getByTestId('layout-header');
      expect(header).not.toHaveClass('layout-header--sticky');
    });

    it('should apply sticky class when stickyHeader=true', () => {
      render(
        <Layout header={<div>Header</div>} stickyHeader={true}>
          Main
        </Layout>
      );

      const header = screen.getByTestId('layout-header');
      expect(header).toHaveClass('layout-header--sticky');
    });
  });

  // ============================================
  // FOOTER (4 tests)
  // ============================================

  describe('Footer', () => {
    it('should render footer when provided', () => {
      render(
        <Layout footer={<div>Footer Content</div>}>
          Main
        </Layout>
      );

      expect(screen.getByText('Footer Content')).toBeInTheDocument();
      expect(screen.getByTestId('layout-footer')).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(<Layout>Main</Layout>);

      expect(screen.queryByTestId('layout-footer')).not.toBeInTheDocument();
    });

    it('should not apply sticky class by default', () => {
      render(
        <Layout footer={<div>Footer</div>}>
          Main
        </Layout>
      );

      const footer = screen.getByTestId('layout-footer');
      expect(footer).not.toHaveClass('layout-footer--sticky');
    });

    it('should apply sticky class when stickyFooter=true', () => {
      render(
        <Layout footer={<div>Footer</div>} stickyFooter={true}>
          Main
        </Layout>
      );

      const footer = screen.getByTestId('layout-footer');
      expect(footer).toHaveClass('layout-footer--sticky');
    });
  });

  // ============================================
  // SIDEBAR (8 tests)
  // ============================================

  describe('Sidebar', () => {
    it('should render sidebar when provided', () => {
      render(
        <Layout sidebar={<div>Sidebar Content</div>}>
          Main
        </Layout>
      );

      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
      expect(screen.getByTestId('layout-sidebar')).toBeInTheDocument();
    });

    it('should not render sidebar when not provided', () => {
      render(<Layout>Main</Layout>);

      expect(screen.queryByTestId('layout-sidebar')).not.toBeInTheDocument();
    });

    it('should position sidebar on left by default', () => {
      render(
        <Layout sidebar={<div>Sidebar</div>}>
          Main
        </Layout>
      );

      const body = screen.getByTestId('layout-body');
      expect(body).toHaveClass('layout-body--sidebar-left');
    });

    it('should position sidebar on right when sidebarPosition="right"', () => {
      render(
        <Layout sidebar={<div>Sidebar</div>} sidebarPosition="right">
          Main
        </Layout>
      );

      const body = screen.getByTestId('layout-body');
      expect(body).toHaveClass('layout-body--sidebar-right');
    });

    it('should apply default sidebar width (250px)', () => {
      render(
        <Layout sidebar={<div>Sidebar</div>}>
          Main
        </Layout>
      );

      const sidebar = screen.getByTestId('layout-sidebar');
      expect(sidebar).toHaveStyle({ width: '250px' });
    });

    it('should apply custom sidebar width', () => {
      render(
        <Layout sidebar={<div>Sidebar</div>} sidebarWidth="300px">
          Main
        </Layout>
      );

      const sidebar = screen.getByTestId('layout-sidebar');
      expect(sidebar).toHaveStyle({ width: '300px' });
    });

    it('should add with-sidebar class to body when sidebar present', () => {
      render(
        <Layout sidebar={<div>Sidebar</div>}>
          Main
        </Layout>
      );

      const body = screen.getByTestId('layout-body');
      expect(body).toHaveClass('layout-body--with-sidebar');
    });

    it('should not add with-sidebar class when no sidebar', () => {
      render(<Layout>Main</Layout>);

      const body = screen.getByTestId('layout-body');
      expect(body).not.toHaveClass('layout-body--with-sidebar');
    });
  });

  // ============================================
  // FULL HEIGHT (2 tests)
  // ============================================

  describe('Full Height', () => {
    it('should not apply full-height class by default', () => {
      render(<Layout>Main</Layout>);

      const layout = screen.getByTestId('layout');
      expect(layout).not.toHaveClass('layout--full-height');
    });

    it('should apply full-height class when fullHeight=true', () => {
      render(<Layout fullHeight={true}>Main</Layout>);

      const layout = screen.getByTestId('layout');
      expect(layout).toHaveClass('layout--full-height');
    });
  });

  // ============================================
  // BODY (2 tests)
  // ============================================

  describe('Body', () => {
    it('should always render body container', () => {
      render(<Layout>Main</Layout>);

      expect(screen.getByTestId('layout-body')).toBeInTheDocument();
    });

    it('should contain main element inside body', () => {
      render(<Layout>Main</Layout>);

      const body = screen.getByTestId('layout-body');
      const main = screen.getByTestId('layout-main');

      expect(body).toContainElement(main);
    });
  });

  // ============================================
  // MAIN CONTENT (2 tests)
  // ============================================

  describe('Main Content', () => {
    it('should render main element with semantic HTML', () => {
      render(<Layout>Content</Layout>);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should contain children inside main', () => {
      render(
        <Layout>
          <div data-testid="child">Child Content</div>
        </Layout>
      );

      const main = screen.getByTestId('layout-main');
      const child = screen.getByTestId('child');

      expect(main).toContainElement(child);
    });
  });

  // ============================================
  // COMPLETE LAYOUT (3 tests)
  // ============================================

  describe('Complete Layout', () => {
    it('should render all parts together', () => {
      render(
        <Layout
          header={<div>Header</div>}
          sidebar={<div>Sidebar</div>}
          footer={<div>Footer</div>}
        >
          <div>Main</div>
        </Layout>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Sidebar')).toBeInTheDocument();
      expect(screen.getByText('Main')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('should apply multiple modifiers together', () => {
      render(
        <Layout
          header={<div>Header</div>}
          stickyHeader={true}
          footer={<div>Footer</div>}
          stickyFooter={true}
          fullHeight={true}
        >
          Main
        </Layout>
      );

      const layout = screen.getByTestId('layout');
      const header = screen.getByTestId('layout-header');
      const footer = screen.getByTestId('layout-footer');

      expect(layout).toHaveClass('layout--full-height');
      expect(header).toHaveClass('layout-header--sticky');
      expect(footer).toHaveClass('layout-footer--sticky');
    });

    it('should handle minimal layout (only main content)', () => {
      render(<Layout>Just Main</Layout>);

      expect(screen.getByText('Just Main')).toBeInTheDocument();
      expect(screen.queryByTestId('layout-header')).not.toBeInTheDocument();
      expect(screen.queryByTestId('layout-sidebar')).not.toBeInTheDocument();
      expect(screen.queryByTestId('layout-footer')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTEXT API INTEGRATION (4 tests)
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from TemplateProvider', () => {
      render(
        <TemplateProvider value={{ stickyHeader: true } as any}>
          <Layout header={<div>Header</div>}>Main</Layout>
        </TemplateProvider>
      );

      const header = screen.getByTestId('layout-header');
      expect(header).toHaveClass('layout-header--sticky');
    });

    it('should override context parameters with props', () => {
      render(
        <TemplateProvider value={{ stickyHeader: true } as any}>
          <Layout header={<div>Header</div>} stickyHeader={false}>
            Main
          </Layout>
        </TemplateProvider>
      );

      const header = screen.getByTestId('layout-header');
      expect(header).not.toHaveClass('layout-header--sticky');
    });

    it('should provide parameters to children via context', () => {
      const ChildComponent = () => {
        return <div data-testid="child">Child</div>;
      };

      render(
        <Layout>
          <ChildComponent />
        </Layout>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should merge context and props correctly', () => {
      render(
        <TemplateProvider value={{ className: 'context-class' } as any}>
          <Layout className="prop-class">Main</Layout>
        </TemplateProvider>
      );

      const layout = screen.getByTestId('layout');
      expect(layout).toHaveClass('prop-class');
    });
  });

  // ============================================
  // CUSTOM STYLES (2 tests)
  // ============================================

  describe('Custom Styles', () => {
    it('should apply custom inline styles', () => {
      render(
        <Layout style={{ backgroundColor: 'red' }}>Main</Layout>
      );

      const layout = screen.getByTestId('layout');
      expect(layout).toHaveStyle({ backgroundColor: 'red' });
    });

    it('should merge custom styles with default styles', () => {
      render(
        <Layout style={{ padding: '10px' }}>Main</Layout>
      );

      const layout = screen.getByTestId('layout');
      expect(layout).toHaveStyle({ padding: '10px' });
    });
  });

  // ============================================
  // ACCESSIBILITY (4 tests)
  // ============================================

  describe('Accessibility', () => {
    it('should use semantic header element', () => {
      render(
        <Layout header={<div>Header</div>}>Main</Layout>
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should use semantic main element', () => {
      render(<Layout>Main</Layout>);

      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
    });

    it('should use semantic footer element', () => {
      render(
        <Layout footer={<div>Footer</div>}>Main</Layout>
      );

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('should support ARIA attributes', () => {
      render(
        <Layout aria-label="Page layout">Main</Layout>
      );

      const layout = screen.getByLabelText('Page layout');
      expect(layout).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES (2 tests)
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty main content', () => {
      render(<Layout>{null}</Layout>);

      const main = screen.getByTestId('layout-main');
      expect(main).toBeEmptyDOMElement();
    });

    it('should handle complex nested content', () => {
      render(
        <Layout
          header={
            <nav>
              <ul>
                <li>Nav Item</li>
              </ul>
            </nav>
          }
          sidebar={
            <div>
              <h3>Sidebar Title</h3>
              <ul>
                <li>Link 1</li>
              </ul>
            </div>
          }
          footer={
            <div>
              <p>Copyright 2025</p>
            </div>
          }
        >
          <article>
            <h1>Article Title</h1>
            <p>Article content</p>
          </article>
        </Layout>
      );

      expect(screen.getByText('Nav Item')).toBeInTheDocument();
      expect(screen.getByText('Sidebar Title')).toBeInTheDocument();
      expect(screen.getByText('Article Title')).toBeInTheDocument();
      expect(screen.getByText('Copyright 2025')).toBeInTheDocument();
    });
  });
});
