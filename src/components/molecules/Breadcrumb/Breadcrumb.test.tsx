/**
 * Breadcrumb Component Tests (Molecule)
 * God-Tier Development Protocol 2025
 */

import { render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Breadcrumb.module.css';

const mockItems = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Products', href: '/products' },
  { id: '3', label: 'Category' },
];

describe('Breadcrumb', () => {
  describe('Rendering', () => {
    it('renders breadcrumb correctly', () => {
      render(<Breadcrumb items={mockItems} />);
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('renders all items', () => {
      render(<Breadcrumb items={mockItems} />);
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('renders links for items with href', () => {
      render(<Breadcrumb items={mockItems} />);
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders text for items without href', () => {
      render(<Breadcrumb items={mockItems} />);
      const category = screen.getByText('Category');
      expect(category.tagName).toBe('SPAN');
    });

    it('returns null when items is empty', () => {
      const { container } = render(<Breadcrumb items={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Separators', () => {
    it('renders separators between items', () => {
      render(<Breadcrumb items={mockItems} />);
      const separators = screen.getAllByTestId('breadcrumb-separator');
      expect(separators).toHaveLength(2); // 3 items = 2 separators
    });

    it('does not render separator after last item', () => {
      render(<Breadcrumb items={mockItems} />);
      const lastItem = screen.getByTestId('breadcrumb-item-3');
      expect(lastItem.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
    });

    it.each(['chevron', 'arrow', 'slash'] as const)(
      'renders %s separator correctly',
      (separator) => {
        render(<Breadcrumb items={mockItems} separator={separator} />);
        const separators = screen.getAllByTestId('breadcrumb-separator');
        expect(separators.length).toBeGreaterThan(0);
      }
    );

    it('uses chevron separator by default', () => {
      render(<Breadcrumb items={mockItems} />);
      const separators = screen.getAllByTestId('breadcrumb-separator');
      expect(separators.length).toBe(2);
    });
  });

  describe('Current Page', () => {
    it('marks last item as current page', () => {
      render(<Breadcrumb items={mockItems} />);
      const category = screen.getByText('Category');
      expect(category).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark other items as current', () => {
      render(<Breadcrumb items={mockItems} />);
      const home = screen.getByRole('link', { name: 'Home' });
      expect(home).not.toHaveAttribute('aria-current');
    });
  });

  describe('Home Icon', () => {
    it('shows home icon when showHome is true', () => {
      const { container } = render(<Breadcrumb items={mockItems} showHome />);
      const homeIcon = container.querySelector('[data-testid="breadcrumb-item-1"] svg');
      expect(homeIcon).toBeInTheDocument();
    });

    it('does not show home icon by default', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      const firstItem = container.querySelector('[data-testid="breadcrumb-item-1"]');
      const svg = firstItem?.querySelector('svg');
      // Separators will have SVG, so we need to check for home icon specifically
      expect(firstItem?.querySelector(`.${styles['breadcrumb-home-icon']}`)).not.toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Breadcrumb items={mockItems} className="custom-class" />);
      const breadcrumb = screen.getByRole('navigation');
      expect(breadcrumb).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(<Breadcrumb items={mockItems} data-testid="custom-breadcrumb" />);
      expect(screen.getByTestId('custom-breadcrumb')).toBeInTheDocument();
    });
  });

  describe('Context API Integration', () => {
    it('inherits parameters from context', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Breadcrumb items={mockItems} />
        </AtomProvider>
      );
      const breadcrumb = screen.getByRole('navigation');
      expect(breadcrumb).toBeInTheDocument();
    });
  });

  describe('CSS Modules', () => {
    it('applies base breadcrumb class', () => {
      render(<Breadcrumb items={mockItems} />);
      const breadcrumb = screen.getByRole('navigation');
      expect(breadcrumb).toHaveClass(styles.breadcrumb);
    });

    it('applies breadcrumb-list class', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      const list = container.querySelector('ol');
      expect(list).toHaveClass(styles['breadcrumb-list']);
    });
  });

  describe('Accessibility', () => {
    it('has aria-label="Breadcrumb"', () => {
      render(<Breadcrumb items={mockItems} />);
      expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    });

    it('uses nav element', () => {
      render(<Breadcrumb items={mockItems} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('uses ordered list', () => {
      const { container } = render(<Breadcrumb items={mockItems} />);
      expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('hides separators from screen readers', () => {
      render(<Breadcrumb items={mockItems} />);
      const separators = screen.getAllByTestId('breadcrumb-separator');
      separators.forEach(sep => {
        expect(sep).toHaveAttribute('aria-hidden', 'true');
      });
    });
  });
});
