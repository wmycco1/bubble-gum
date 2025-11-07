/**
 * Navbar Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 40+ tests covering:
 * - Rendering variants
 * - Mobile behavior
 * - Sticky behavior
 * - User interactions
 * - Accessibility
 * - Context API integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Navbar } from './Navbar';
import { OrganismProvider } from '@/context/parameters/ParameterContext';
import type { NavbarLink } from './Navbar.types';

expect.extend(toHaveNoViolations);

// Mock navigation links
const mockLinks: NavbarLink[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'About', href: '/about' },
  { id: '3', label: 'Services', href: '/services' },
  { id: '4', label: 'Contact', href: '/contact' },
];

describe('Navbar Component', () => {
  // ============================================
  // BASIC RENDERING TESTS
  // ============================================

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Navbar links={mockLinks} />);
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders with default logo', () => {
      render(<Navbar links={mockLinks} />);
      expect(screen.getByTestId('navbar-logo')).toHaveTextContent('Logo');
    });

    it('renders with custom text logo', () => {
      render(<Navbar logo="My Brand" links={mockLinks} />);
      expect(screen.getByTestId('navbar-logo')).toHaveTextContent('My Brand');
    });

    it('renders with React node logo', () => {
      const LogoComponent = () => <img src="/logo.svg" alt="Logo" />;
      render(<Navbar logo={<LogoComponent />} links={mockLinks} />);
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const links = screen.getAllByText(link.label);
        expect(links.length).toBeGreaterThan(0);
      });
    });

    it('renders with correct link hrefs', () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElement = screen.getByTestId(`navbar-link-${link.id}`);
        expect(linkElement).toHaveAttribute('href', link.href);
      });
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================

  describe('Variants', () => {
    it('renders light variant by default', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--light');
    });

    it('renders dark variant', () => {
      render(<Navbar links={mockLinks} variant="dark" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--dark');
    });

    it('renders transparent variant', () => {
      render(<Navbar links={mockLinks} variant="transparent" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--transparent');
    });
  });

  // ============================================
  // STICKY BEHAVIOR TESTS
  // ============================================

  describe('Sticky Behavior', () => {
    it('applies sticky class when sticky prop is true', () => {
      render(<Navbar links={mockLinks} sticky />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--sticky');
    });

    it('does not apply sticky class by default', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).not.toHaveClass('navbar--sticky');
    });

    it('applies scrolled class when scrolled (sticky enabled)', async () => {
      render(<Navbar links={mockLinks} sticky />);
      const navbar = screen.getByTestId('navbar');

      // Simulate scroll
      window.scrollY = 100;
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(navbar).toHaveClass('navbar--scrolled');
      });
    });

    it('does not apply scrolled class when not sticky', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByTestId('navbar');

      window.scrollY = 100;
      fireEvent.scroll(window);

      expect(navbar).not.toHaveClass('navbar--scrolled');
    });
  });

  // ============================================
  // MOBILE MENU TESTS
  // ============================================

  describe('Mobile Menu', () => {
    it('renders mobile menu toggle button', () => {
      render(<Navbar links={mockLinks} />);
      expect(screen.getByTestId('navbar-toggle')).toBeInTheDocument();
    });

    it('toggle button has correct aria-label when closed', () => {
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Open menu');
    });

    it('toggle button has correct aria-label when open', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-label', 'Close menu');
    });

    it('opens mobile menu when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).toHaveClass('navbar-menu--open');
    });

    it('closes mobile menu when toggle is clicked again', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);
      await user.click(toggle);

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).not.toHaveClass('navbar-menu--open');
    });

    it('renders backdrop when mobile menu is open', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      expect(screen.getByTestId('navbar-backdrop')).toBeInTheDocument();
    });

    it('closes mobile menu when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);
      const backdrop = screen.getByTestId('navbar-backdrop');
      await user.click(backdrop);

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).not.toHaveClass('navbar-menu--open');
    });

    it('closes mobile menu when link is clicked', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);
      const mobileLink = screen.getByTestId('navbar-mobile-link-1');
      await user.click(mobileLink);

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).not.toHaveClass('navbar-menu--open');
    });

    it('calls onMobileMenuToggle when provided', async () => {
      const user = userEvent.setup();
      const handleToggle = jest.fn();
      render(<Navbar links={mockLinks} onMobileMenuToggle={handleToggle} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      expect(handleToggle).toHaveBeenCalledWith(true);
    });
  });

  // ============================================
  // LINK BEHAVIOR TESTS
  // ============================================

  describe('Link Behavior', () => {
    it('renders active link with active class', () => {
      const linksWithActive = [
        { id: '1', label: 'Home', href: '/', active: true },
        ...mockLinks.slice(1),
      ];
      render(<Navbar links={linksWithActive} />);
      const link = screen.getByTestId('navbar-link-1');
      expect(link).toHaveClass('navbar-link--active');
    });

    it('renders disabled link with disabled class', () => {
      const linksWithDisabled = [
        { id: '1', label: 'Home', href: '/', disabled: true },
        ...mockLinks.slice(1),
      ];
      render(<Navbar links={linksWithDisabled} />);
      const link = screen.getByTestId('navbar-link-1');
      expect(link).toHaveClass('navbar-link--disabled');
    });

    it('renders external link with correct attributes', () => {
      const linksWithExternal = [
        { id: '1', label: 'External', href: 'https://example.com', external: true },
        ...mockLinks.slice(1),
      ];
      render(<Navbar links={linksWithExternal} />);
      const link = screen.getByTestId('navbar-link-1');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders link with icon', () => {
      const linksWithIcon = [
        { id: '1', label: 'Home', href: '/', icon: '🏠' },
        ...mockLinks.slice(1),
      ];
      render(<Navbar links={linksWithIcon} />);
      const icons = screen.getAllByText('🏠');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('calls onLinkClick when link is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Navbar links={mockLinks} onLinkClick={handleClick} />);
      const link = screen.getByTestId('navbar-link-1');

      await user.click(link);

      expect(handleClick).toHaveBeenCalledWith(
        mockLinks[0],
        expect.any(Object)
      );
    });

    it('calls onLogoClick when logo is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Navbar links={mockLinks} onLogoClick={handleClick} />);
      const logo = screen.getByTestId('navbar-logo');

      await user.click(logo);

      expect(handleClick).toHaveBeenCalled();
    });
  });

  // ============================================
  // LAYOUT TESTS
  // ============================================

  describe('Layout', () => {
    it('renders with shadow by default', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--shadow');
    });

    it('renders without shadow when shadow={false}', () => {
      render(<Navbar links={mockLinks} shadow={false} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).not.toHaveClass('navbar--shadow');
    });

    it('renders full width by default', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--full-width');
    });

    it('renders constrained width when fullWidth={false}', () => {
      render(<Navbar links={mockLinks} fullWidth={false} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).not.toHaveClass('navbar--full-width');
    });

    it('applies custom z-index', () => {
      render(<Navbar links={mockLinks} zIndex={2000} />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveStyle({ zIndex: 2000 });
    });

    it('applies custom maxWidth when not full width', () => {
      render(<Navbar links={mockLinks} fullWidth={false} maxWidth="800px" />);
      const container = screen.getByTestId('navbar').querySelector('.navbar-container--constrained');
      expect(container).toHaveStyle({ maxWidth: '800px' });
    });
  });

  // ============================================
  // MOBILE BREAKPOINT TESTS
  // ============================================

  describe('Mobile Breakpoints', () => {
    it('applies correct class for sm breakpoint', () => {
      render(<Navbar links={mockLinks} mobileBreakpoint="sm" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--mobile-sm');
    });

    it('applies correct class for md breakpoint', () => {
      render(<Navbar links={mockLinks} mobileBreakpoint="md" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--mobile-md');
    });

    it('applies correct class for lg breakpoint', () => {
      render(<Navbar links={mockLinks} mobileBreakpoint="lg" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--mobile-lg');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('inherits sticky from OrganismProvider', () => {
      render(
        <OrganismProvider value={{ sticky: true }}>
          <Navbar links={mockLinks} />
        </OrganismProvider>
      );
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--sticky');
    });

    it('inherits variant from OrganismProvider', () => {
      render(
        <OrganismProvider value={{ variant: 'dark' }}>
          <Navbar links={mockLinks} />
        </OrganismProvider>
      );
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--dark');
    });

    it('props override context values', () => {
      render(
        <OrganismProvider value={{ variant: 'dark' }}>
          <Navbar links={mockLinks} variant="light" />
        </OrganismProvider>
      );
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--light');
    });

    it('merges context and props correctly', () => {
      render(
        <OrganismProvider value={{ sticky: true, shadow: false }}>
          <Navbar links={mockLinks} variant="dark" />
        </OrganismProvider>
      );
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('navbar--sticky');
      expect(navbar).toHaveClass('navbar--dark');
      expect(navbar).not.toHaveClass('navbar--shadow');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('has correct nav role', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toBeInTheDocument();
    });

    it('has aria-label for navigation', () => {
      render(<Navbar links={mockLinks} />);
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveAttribute('aria-label', 'Main navigation');
    });

    it('toggle button has aria-expanded attribute', () => {
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggle button aria-expanded changes when clicked', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('mobile menu has aria-hidden attribute', () => {
      render(<Navbar links={mockLinks} />);
      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).toHaveAttribute('aria-hidden', 'true');
    });

    it('mobile menu aria-hidden changes when opened', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).toHaveAttribute('aria-hidden', 'false');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(<Navbar links={mockLinks} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with mobile menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      await user.click(toggle);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================

  describe('Keyboard Navigation', () => {
    it('supports Tab navigation for links', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);

      await user.tab();
      expect(screen.getByTestId('navbar-logo')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('navbar-link-1')).toHaveFocus();
    });

    it('supports Enter key to toggle mobile menu', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      toggle.focus();
      await user.keyboard('{Enter}');

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).toHaveClass('navbar-menu--open');
    });

    it('supports Space key to toggle mobile menu', async () => {
      const user = userEvent.setup();
      render(<Navbar links={mockLinks} />);
      const toggle = screen.getByTestId('navbar-toggle');

      toggle.focus();
      await user.keyboard(' ');

      const menu = screen.getByTestId('navbar-mobile-menu');
      expect(menu).toHaveClass('navbar-menu--open');
    });
  });

  // ============================================
  // CUSTOM CLASS & DATA TESTS
  // ============================================

  describe('Custom Class and Data Attributes', () => {
    it('applies custom className', () => {
      render(<Navbar links={mockLinks} className="custom-navbar" />);
      const navbar = screen.getByTestId('navbar');
      expect(navbar).toHaveClass('custom-navbar');
    });

    it('applies custom data-testid', () => {
      render(<Navbar links={mockLinks} data-testid="custom-navbar" />);
      expect(screen.getByTestId('custom-navbar')).toBeInTheDocument();
    });
  });
});
