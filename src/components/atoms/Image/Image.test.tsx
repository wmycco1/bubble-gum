/**
 * Image Component Tests
 * God-Tier Development Protocol 2025
 *
 * Tests CSS Modules, Context API integration, and accessibility
 */

import { render, screen } from '@testing-library/react';
import { Image } from './Image';
import { AtomProvider } from '@/context/parameters/ParameterContext';
import styles from './Image.module.css';

describe('Image', () => {
  describe('Rendering', () => {
    it('renders image correctly', () => {
      render(<Image src="/test.jpg" alt="Test image" />);
      expect(screen.getByTestId('image')).toBeInTheDocument();
    });

    it('renders with correct src', () => {
      render(<Image src="/photo.jpg" alt="Photo" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('src', '/photo.jpg');
    });

    it('renders with correct alt text', () => {
      render(<Image src="/photo.jpg" alt="Beautiful scenery" />);
      expect(screen.getByAltText('Beautiful scenery')).toBeInTheDocument();
    });

    it('renders container wrapper', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      expect(screen.getByTestId('image-container')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)(
      'applies %s size class to container',
      (size) => {
        render(<Image src="/test.jpg" alt="Test" size={size} />);
        const container = screen.getByTestId('image-container');
        expect(container).toHaveClass(styles[`image-container--${size}`]);
      }
    );

    it('uses full size by default', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass(styles['image-container']);
      expect(container).not.toHaveClass(styles['image-container--md']);
    });
  });

  describe('Fit Variants', () => {
    it.each(['contain', 'cover', 'fill', 'none', 'scale-down'] as const)(
      'applies %s fit class',
      (fit) => {
        render(<Image src="/test.jpg" alt="Test" fit={fit} />);
        const img = screen.getByTestId('image');
        expect(img).toHaveClass(styles[`image--${fit}`]);
      }
    );

    it('uses cover fit by default', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveClass(styles['image--cover']);
    });
  });

  describe('Aspect Ratios', () => {
    it.each([
      ['square', 'square'],
      ['video', 'video'],
      ['4/3', '4-3'],
      ['3/2', '3-2'],
      ['16/9', '16-9'],
      ['21/9', '21-9'],
    ] as const)(
      'applies %s aspect ratio class',
      (aspectRatio, className) => {
        render(<Image src="/test.jpg" alt="Test" aspectRatio={aspectRatio} />);
        const container = screen.getByTestId('image-container');
        expect(container).toHaveClass(styles[`image-container--${className}`]);
      }
    );
  });

  describe('Rounded Corners', () => {
    it('applies rounded class when rounded prop is true', () => {
      render(<Image src="/test.jpg" alt="Test" rounded />);
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass(styles['image-container--rounded']);
    });

    it('does not apply rounded class by default', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const container = screen.getByTestId('image-container');
      expect(container).not.toHaveClass(styles['image-container--rounded']);
    });
  });

  describe('Loading Strategy', () => {
    it('uses lazy loading by default', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('applies eager loading when specified', () => {
      render(<Image src="/test.jpg" alt="Test" loading="eager" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  describe('Custom Props', () => {
    it('applies custom className to image', () => {
      render(<Image src="/test.jpg" alt="Test" className="custom-class" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveClass('custom-class');
    });

    it('applies custom data-testid', () => {
      render(<Image src="/test.jpg" alt="Test" data-testid="custom-image" />);
      expect(screen.getByTestId('custom-image')).toBeInTheDocument();
    });

    it('forwards HTML img props', () => {
      render(<Image src="/test.jpg" alt="Test" id="my-image" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveAttribute('id', 'my-image');
    });
  });

  describe('Context API Integration', () => {
    it('inherits size from context', () => {
      render(
        <AtomProvider value={{ size: 'lg' }}>
          <Image src="/test.jpg" alt="Test" />
        </AtomProvider>
      );
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass(styles['image-container--lg']);
    });

    it('props override context values', () => {
      render(
        <AtomProvider value={{ size: 'sm' }}>
          <Image src="/test.jpg" alt="Test" size="xl" />
        </AtomProvider>
      );
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass(styles['image-container--xl']);
      expect(container).not.toHaveClass(styles['image-container--sm']);
    });
  });

  describe('CSS Modules', () => {
    it('applies base container class', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const container = screen.getByTestId('image-container');
      expect(container).toHaveClass(styles['image-container']);
    });

    it('applies base image class', () => {
      render(<Image src="/test.jpg" alt="Test" />);
      const img = screen.getByTestId('image');
      expect(img).toHaveClass(styles.image);
    });

    it('applies multiple CSS module classes', () => {
      render(
        <Image
          src="/test.jpg"
          alt="Test"
          size="lg"
          aspectRatio="16/9"
          rounded
          fit="contain"
        />
      );
      const container = screen.getByTestId('image-container');
      const img = screen.getByTestId('image');

      expect(container).toHaveClass(styles['image-container']);
      expect(container).toHaveClass(styles['image-container--lg']);
      expect(container).toHaveClass(styles['image-container--16-9']);
      expect(container).toHaveClass(styles['image-container--rounded']);
      expect(img).toHaveClass(styles['image--contain']);
    });
  });

  describe('Accessibility', () => {
    it('requires alt text', () => {
      render(<Image src="/test.jpg" alt="Descriptive text" />);
      expect(screen.getByAltText('Descriptive text')).toBeInTheDocument();
    });

    it('img element is accessible', () => {
      render(<Image src="/test.jpg" alt="Test image" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Test image');
    });
  });
});
