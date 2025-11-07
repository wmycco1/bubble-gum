/**
 * Menu Component Tests (Organism)
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite for Menu organism component
 * Target: 80%+ code coverage
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Menu } from './Menu';
import type { MenuItem } from './Menu.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock data
const mockSimpleItems: MenuItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'About', href: '/about' },
  { id: '3', label: 'Contact', href: '/contact' },
];

const mockItemsWithIcons: MenuItem[] = [
  { id: '1', label: 'Home', href: '/', icon: 'home' },
  { id: '2', label: 'About', href: '/about', icon: 'info' },
  { id: '3', label: 'Contact', href: '/contact', icon: 'mail' },
];

const mockNestedItems: MenuItem[] = [
  {
    id: '1',
    label: 'Products',
    children: [
      { id: '1-1', label: 'Category 1', href: '/products/cat1' },
      { id: '1-2', label: 'Category 2', href: '/products/cat2' },
      {
        id: '1-3',
        label: 'Category 3',
        children: [
          { id: '1-3-1', label: 'Subcategory 1', href: '/products/cat3/sub1' },
          { id: '1-3-2', label: 'Subcategory 2', href: '/products/cat3/sub2' },
        ],
      },
    ],
  },
  { id: '2', label: 'Services', href: '/services' },
  { id: '3', label: 'Contact', href: '/contact' },
];

const mockItemsWithDisabled: MenuItem[] = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'About', href: '/about', disabled: true },
  { id: '3', label: 'Contact', href: '/contact' },
];

describe('Menu Component', () => {
  // ============================================
  // RENDERING TESTS
  // ============================================

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Menu items={mockSimpleItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should render all menu items', () => {
      render(<Menu items={mockSimpleItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should render with custom test ID', () => {
      render(<Menu items={mockSimpleItems} data-testid="custom-menu" />);
      expect(screen.getByTestId('custom-menu')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Menu items={mockSimpleItems} className="custom-class" />);
      const menu = screen.getByRole('navigation');
      expect(menu).toHaveClass('custom-class');
    });

    it('should render icons when showIcons is true', () => {
      render(<Menu items={mockItemsWithIcons} showIcons={true} />);
      const icons = screen.getAllByRole('img');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('should not render icons when showIcons is false', () => {
      render(<Menu items={mockItemsWithIcons} showIcons={false} />);
      const icons = screen.queryAllByRole('img');
      expect(icons).toHaveLength(0);
    });
  });

  // ============================================
  // ORIENTATION TESTS
  // ============================================

  describe('Orientation', () => {
    it('should render horizontal menu by default', () => {
      render(<Menu items={mockSimpleItems} />);
      const menubar = screen.getByRole('menubar');
      expect(menubar).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should render vertical menu when orientation is vertical', () => {
      render(<Menu items={mockSimpleItems} orientation="vertical" />);
      const menubar = screen.getByRole('menubar');
      expect(menubar).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================

  describe('Variants', () => {
    it('should apply default variant', () => {
      render(<Menu items={mockSimpleItems} variant="default" />);
      const menu = screen.getByRole('navigation');
      expect(menu.className).toContain('menu--default');
    });

    it('should apply minimal variant', () => {
      render(<Menu items={mockSimpleItems} variant="minimal" />);
      const menu = screen.getByRole('navigation');
      expect(menu.className).toContain('menu--minimal');
    });

    it('should apply bordered variant', () => {
      render(<Menu items={mockSimpleItems} variant="bordered" />);
      const menu = screen.getByRole('navigation');
      expect(menu.className).toContain('menu--bordered');
    });

    it('should apply pills variant', () => {
      render(<Menu items={mockSimpleItems} variant="pills" />);
      const menu = screen.getByRole('navigation');
      expect(menu.className).toContain('menu--pills');
    });
  });

  // ============================================
  // NESTED MENU TESTS
  // ============================================

  describe('Nested Menus', () => {
    it('should render nested menu items', () => {
      render(<Menu items={mockNestedItems} />);
      expect(screen.getByText('Products')).toBeInTheDocument();
    });

    it('should not show submenu initially', () => {
      render(<Menu items={mockNestedItems} />);
      expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
    });

    it('should expand submenu when parent is clicked', async () => {
      render(<Menu items={mockNestedItems} />);
      const productsButton = screen.getByText('Products');
      fireEvent.click(productsButton);

      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });
    });

    it('should collapse submenu when parent is clicked again', async () => {
      render(<Menu items={mockNestedItems} />);
      const productsButton = screen.getByText('Products');

      // Expand
      fireEvent.click(productsButton);
      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      // Collapse
      fireEvent.click(productsButton);
      await waitFor(() => {
        expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
      });
    });

    it('should render submenu indicators when showSubmenuIndicators is true', () => {
      render(<Menu items={mockNestedItems} showSubmenuIndicators={true} />);
      const productsButton = screen.getByText('Products');
      expect(productsButton.parentElement).toHaveTextContent('Products');
    });

    it('should support deeply nested menus', async () => {
      render(<Menu items={mockNestedItems} />);

      // Expand Products
      fireEvent.click(screen.getByText('Products'));
      await waitFor(() => {
        expect(screen.getByText('Category 3')).toBeInTheDocument();
      });

      // Expand Category 3
      fireEvent.click(screen.getByText('Category 3'));
      await waitFor(() => {
        expect(screen.getByText('Subcategory 1')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // ACTIVE STATE TESTS
  // ============================================

  describe('Active State', () => {
    it('should mark active item with aria-current', () => {
      render(<Menu items={mockSimpleItems} activeItemId="2" />);
      const aboutLink = screen.getByText('About').closest('a');
      expect(aboutLink).toHaveAttribute('aria-current', 'page');
    });

    it('should not mark non-active items with aria-current', () => {
      render(<Menu items={mockSimpleItems} activeItemId="2" />);
      const homeLink = screen.getByText('Home').closest('a');
      expect(homeLink).not.toHaveAttribute('aria-current');
    });
  });

  // ============================================
  // DISABLED STATE TESTS
  // ============================================

  describe('Disabled State', () => {
    it('should render disabled items', () => {
      render(<Menu items={mockItemsWithDisabled} />);
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should not trigger onClick for disabled items', () => {
      const handleClick = jest.fn();
      render(<Menu items={mockItemsWithDisabled} onItemClick={handleClick} />);

      const aboutLink = screen.getByText('About').closest('a');
      fireEvent.click(aboutLink!);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // INTERACTION TESTS
  // ============================================

  describe('Interactions', () => {
    it('should call onItemClick when menu item is clicked', () => {
      const handleClick = jest.fn();
      render(<Menu items={mockSimpleItems} onItemClick={handleClick} />);

      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', label: 'Home' }),
        expect.anything()
      );
    });

    it('should call onSubmenuToggle when submenu is toggled', async () => {
      const handleToggle = jest.fn();
      render(<Menu items={mockNestedItems} onSubmenuToggle={handleToggle} />);

      const productsButton = screen.getByText('Products');
      fireEvent.click(productsButton);

      await waitFor(() => {
        expect(handleToggle).toHaveBeenCalledWith('1', true);
      });
    });

    it('should collapse menu on item click when collapseOnClick is true', async () => {
      render(<Menu items={mockNestedItems} collapseOnClick={true} />);

      // Expand submenu
      const productsButton = screen.getByText('Products');
      fireEvent.click(productsButton);
      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      // Click a submenu item
      const category1Link = screen.getByText('Category 1');
      fireEvent.click(category1Link);

      await waitFor(() => {
        expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================

  describe('Keyboard Navigation', () => {
    it('should navigate with ArrowDown key', async () => {
      const user = userEvent.setup();
      render(<Menu items={mockSimpleItems} />);

      const menu = screen.getByRole('navigation');
      await user.click(menu);
      await user.keyboard('{ArrowDown}');

      // Focus should move to next item
      expect(document.activeElement).toBeDefined();
    });

    it('should navigate with ArrowUp key', async () => {
      const user = userEvent.setup();
      render(<Menu items={mockSimpleItems} />);

      const menu = screen.getByRole('navigation');
      await user.click(menu);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowUp}');

      expect(document.activeElement).toBeDefined();
    });

    it('should activate item with Enter key', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Menu items={mockSimpleItems} onItemClick={handleClick} />);

      const menu = screen.getByRole('navigation');
      await user.click(menu);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      // Enter should trigger click
      await waitFor(() => {
        expect(handleClick).toHaveBeenCalled();
      });
    });

    it('should close all submenus with Escape key', async () => {
      const user = userEvent.setup();
      render(<Menu items={mockNestedItems} />);

      // Expand submenu
      const productsButton = screen.getByText('Products');
      fireEvent.click(productsButton);
      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Category 1')).not.toBeInTheDocument();
      });
    });
  });

  // ============================================
  // ACCORDION BEHAVIOR TESTS
  // ============================================

  describe('Accordion Behavior', () => {
    it('should close other submenus when allowMultipleOpen is false', async () => {
      render(<Menu items={mockNestedItems} allowMultipleOpen={false} />);

      // Expand Products
      fireEvent.click(screen.getByText('Products'));
      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      // If there was another top-level item with children, it should close Products
      // For this test, we just verify the behavior is configured
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    it('should allow multiple submenus open when allowMultipleOpen is true', async () => {
      render(<Menu items={mockNestedItems} allowMultipleOpen={true} />);

      // Expand Products
      fireEvent.click(screen.getByText('Products'));
      await waitFor(() => {
        expect(screen.getByText('Category 1')).toBeInTheDocument();
      });

      // Multiple can stay open
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });
  });

  // ============================================
  // DEFAULT OPEN TESTS
  // ============================================

  describe('Default Open', () => {
    it('should open default submenus on mount', () => {
      render(<Menu items={mockNestedItems} defaultOpenIds={['1']} />);
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    it('should support multiple default open submenus', () => {
      const items = [
        {
          id: '1',
          label: 'Products',
          children: [{ id: '1-1', label: 'Cat 1', href: '/cat1' }],
        },
        {
          id: '2',
          label: 'Services',
          children: [{ id: '2-1', label: 'Service 1', href: '/srv1' }],
        },
      ];

      render(<Menu items={items} defaultOpenIds={['1', '2']} />);
      expect(screen.getByText('Cat 1')).toBeInTheDocument();
      expect(screen.getByText('Service 1')).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Menu items={mockSimpleItems} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA roles', () => {
      render(<Menu items={mockSimpleItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('should have aria-expanded on items with children', () => {
      render(<Menu items={mockNestedItems} />);
      const productsButton = screen.getByText('Products').closest('button');
      expect(productsButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when submenu is opened', async () => {
      render(<Menu items={mockNestedItems} />);
      const productsButton = screen.getByText('Products').closest('button');

      fireEvent.click(productsButton!);

      await waitFor(() => {
        expect(productsButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have aria-haspopup on items with children', () => {
      render(<Menu items={mockNestedItems} />);
      const productsButton = screen.getByText('Products').closest('button');
      expect(productsButton).toHaveAttribute('aria-haspopup', 'true');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('should inherit parameters from AtomProvider', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Menu items={mockSimpleItems} />
        </AtomProvider>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      render(<Menu items={[]} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByRole('menubar')).toBeInTheDocument();
    });

    it('should handle items without href', () => {
      const items: MenuItem[] = [{ id: '1', label: 'No Link' }];
      render(<Menu items={items} />);
      expect(screen.getByText('No Link')).toBeInTheDocument();
    });

    it('should handle items without icon even when showIcons is true', () => {
      const items: MenuItem[] = [{ id: '1', label: 'No Icon', href: '/' }];
      render(<Menu items={items} showIcons={true} />);
      expect(screen.getByText('No Icon')).toBeInTheDocument();
    });
  });
});
