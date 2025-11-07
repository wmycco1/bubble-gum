/**
 * Text Component Tests
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, and accessibility
 */

import { render, screen } from '@testing-library/react';
import { Text } from './Text';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Text.module.css';

describe('Text', () => {
  describe('Rendering', () => {
    it('renders children correctly', () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as paragraph by default', () => {
      const { container } = render(<Text>Content</Text>);
      expect(container.querySelector('p')).toBeInTheDocument();
    });

    it('renders as custom element', () => {
      const { container } = render(<Text as="span">Content</Text>);
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  });

  describe('HTML Elements', () => {
    it.each(['p', 'span', 'div', 'label'] as const)(
      'renders as %s element',
      (element) => {
        const { container } = render(<Text as={element}>Content</Text>);
        expect(container.querySelector(element)).toBeInTheDocument();
      }
    );
  });

  describe('Sizes', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const)(
      'applies %s size class',
      (size) => {
        const { container } = render(<Text size={size}>Text</Text>);
        const text = container.querySelector('p');
        expect(text).toHaveClass(styles[`text--${size}`]);
      }
    );
  });

  describe('Weights', () => {
    it.each(['normal', 'medium', 'semibold', 'bold'] as const)(
      'applies %s weight class',
      (weight) => {
        const { container } = render(<Text weight={weight}>Text</Text>);
        const text = container.querySelector('p');
        expect(text).toHaveClass(styles[`text--${weight}`]);
      }
    );
  });

  describe('Alignment', () => {
    it.each(['left', 'center', 'right', 'justify'] as const)(
      'applies %s alignment class',
      (align) => {
        const { container } = render(<Text align={align}>Text</Text>);
        const text = container.querySelector('p');
        expect(text).toHaveClass(styles[`text--${align}`]);
      }
    );
  });

  describe('Colors', () => {
    it.each([
      'default',
      'muted',
      'primary',
      'secondary',
      'success',
      'warning',
      'error',
    ] as const)('applies %s color class', (color) => {
      const { container } = render(<Text color={color}>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles[`text--${color}`]);
    });
  });

  describe('Text Styles', () => {
    it('applies italic style', () => {
      const { container } = render(<Text italic>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--italic']);
    });

    it('applies underline style', () => {
      const { container } = render(<Text underline>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--underline']);
    });

    it('applies line-through style', () => {
      const { container } = render(<Text lineThrough>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--line-through']);
    });

    it('applies multiple styles', () => {
      const { container } = render(
        <Text italic underline weight="bold">
          Text
        </Text>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--italic']);
      expect(text).toHaveClass(styles['text--underline']);
      expect(text).toHaveClass(styles['text--bold']);
    });
  });

  describe('Truncation', () => {
    it('applies truncate class', () => {
      const { container } = render(<Text truncate>Long text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--truncate']);
    });

    it('applies line-clamp class with maxLines', () => {
      const { container } = render(<Text maxLines={3}>Long text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--clamp-3']);
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      const { container } = render(<Text className="custom-class">Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('custom-class');
    });

    it('applies id attribute', () => {
      render(<Text id="custom-id">Text</Text>);
      expect(screen.getByText('Text')).toHaveAttribute('id', 'custom-id');
    });

    it('applies aria-label', () => {
      render(<Text aria-label="Custom label">Text</Text>);
      expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
    });
  });

  describe('Data Attributes', () => {
    it('has default data-testid', () => {
      render(<Text>Content</Text>);
      expect(screen.getByTestId('text')).toBeInTheDocument();
    });

    it('uses custom data-testid', () => {
      render(<Text data-testid="custom-text">Content</Text>);
      expect(screen.getByTestId('custom-text')).toBeInTheDocument();
    });
  });

  describe('Composition', () => {
    it('renders with multiple props', () => {
      const { container } = render(
        <Text
          as="span"
          size="lg"
          weight="bold"
          align="center"
          color="primary"
          italic
        >
          Styled Text
        </Text>
      );

      const text = container.querySelector('span');
      expect(text).toHaveClass(styles['text--lg']);
      expect(text).toHaveClass(styles['text--bold']);
      expect(text).toHaveClass(styles['text--center']);
      expect(text).toHaveClass(styles['text--primary']);
      expect(text).toHaveClass(styles['text--italic']);
    });

    it('renders with nested elements', () => {
      render(
        <Text>
          Hello <strong>World</strong>
        </Text>
      );
      expect(screen.getByText(/Hello/)).toBeInTheDocument();
      expect(screen.getByText('World')).toBeInTheDocument();
    });
  });

  describe('Context API Integration', () => {
    it('inherits size from context', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'lg' }}>
          <Text>Context text</Text>
        </AtomProvider>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--lg']);
    });

    it('inherits color from context', () => {
      const { container } = render(
        <AtomProvider value={{ color: 'primary' }}>
          <Text>Context text</Text>
        </AtomProvider>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--primary']);
    });

    it('props override context values', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'sm', color: 'muted' }}>
          <Text size="xl" color="error">Override text</Text>
        </AtomProvider>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--xl']);
      expect(text).toHaveClass(styles['text--error']);
      expect(text).not.toHaveClass(styles['text--sm']);
      expect(text).not.toHaveClass(styles['text--muted']);
    });

    it('merges context and props correctly', () => {
      const { container } = render(
        <AtomProvider value={{ size: 'lg', weight: 'bold' }}>
          <Text color="primary">Merged text</Text>
        </AtomProvider>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles['text--lg']);
      expect(text).toHaveClass(styles['text--bold']);
      expect(text).toHaveClass(styles['text--primary']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base text class', () => {
      const { container } = render(<Text>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles.text);
    });

    it('applies multiple CSS module classes', () => {
      const { container } = render(
        <Text size="lg" weight="bold" color="primary">
          Text
        </Text>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass(styles.text);
      expect(text).toHaveClass(styles['text--lg']);
      expect(text).toHaveClass(styles['text--bold']);
      expect(text).toHaveClass(styles['text--primary']);
    });
  });
});
