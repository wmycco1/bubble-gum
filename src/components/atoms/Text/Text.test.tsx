/**
 * Text Component Tests
 * God-Tier Development Protocol 2025
 */

import { render, screen } from '@testing-library/react';
import { Text } from './Text';

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
        expect(text).toHaveClass(`text-${size}`);
      }
    );
  });

  describe('Weights', () => {
    it.each(['normal', 'medium', 'semibold', 'bold'] as const)(
      'applies %s weight class',
      (weight) => {
        const { container } = render(<Text weight={weight}>Text</Text>);
        const text = container.querySelector('p');
        expect(text).toHaveClass(`font-${weight}`);
      }
    );
  });

  describe('Alignment', () => {
    it.each(['left', 'center', 'right', 'justify'] as const)(
      'applies %s alignment class',
      (align) => {
        const { container } = render(<Text align={align}>Text</Text>);
        const text = container.querySelector('p');
        expect(text).toHaveClass(`text-${align}`);
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
      expect(text).toBeInTheDocument();
    });
  });

  describe('Text Styles', () => {
    it('applies italic style', () => {
      const { container } = render(<Text italic>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('italic');
    });

    it('applies underline style', () => {
      const { container } = render(<Text underline>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('underline');
    });

    it('applies line-through style', () => {
      const { container } = render(<Text lineThrough>Text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('line-through');
    });

    it('applies multiple styles', () => {
      const { container } = render(
        <Text italic underline weight="bold">
          Text
        </Text>
      );
      const text = container.querySelector('p');
      expect(text).toHaveClass('italic');
      expect(text).toHaveClass('underline');
      expect(text).toHaveClass('font-bold');
    });
  });

  describe('Truncation', () => {
    it('applies truncate class', () => {
      const { container } = render(<Text truncate>Long text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('truncate');
    });

    it('applies line-clamp class with maxLines', () => {
      const { container } = render(<Text maxLines={3}>Long text</Text>);
      const text = container.querySelector('p');
      expect(text).toHaveClass('line-clamp-3');
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
      expect(text).toHaveClass('text-lg');
      expect(text).toHaveClass('font-bold');
      expect(text).toHaveClass('text-center');
      expect(text).toHaveClass('text-blue-600');
      expect(text).toHaveClass('italic');
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
});
