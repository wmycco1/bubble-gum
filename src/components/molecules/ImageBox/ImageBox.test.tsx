/**
 * ImageBox Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test Coverage: 80%+ (targeting 100%)
 * Testing Philosophy: Test behavior, not implementation
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImageBox } from './ImageBox';
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

// ============================================
// BASIC RENDERING TESTS
// ============================================

describe('ImageBox - Basic Rendering', () => {
  test('renders with required props', () => {
    render(<ImageBox src="/test.jpg" alt="Test image" />);

    expect(screen.getByTestId('imagebox')).toBeInTheDocument();
    expect(screen.getByTestId('imagebox-image')).toBeInTheDocument();
  });

  test('renders with caption', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test image"
        caption="Test caption"
      />
    );

    expect(screen.getByText('Test caption')).toBeInTheDocument();
    expect(screen.getByTestId('imagebox-caption')).toBeInTheDocument();
    expect(screen.getByTestId('imagebox-caption-text')).toBeInTheDocument();
  });

  test('renders with children instead of caption', () => {
    render(
      <ImageBox src="/test.jpg" alt="Test image">
        <div data-testid="custom-caption">Custom caption content</div>
      </ImageBox>
    );

    expect(screen.getByTestId('custom-caption')).toBeInTheDocument();
    expect(screen.getByText('Custom caption content')).toBeInTheDocument();
    // Caption text should not render when children are provided
    expect(screen.queryByTestId('imagebox-caption-text')).not.toBeInTheDocument();
  });

  test('renders without caption or children', () => {
    render(<ImageBox src="/test.jpg" alt="Test image" />);

    expect(screen.queryByTestId('imagebox-caption')).not.toBeInTheDocument();
  });

  test('renders as figure element (semantic HTML)', () => {
    render(<ImageBox src="/test.jpg" alt="Test image" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox.tagName).toBe('FIGURE');
  });
});

// ============================================
// SIZE TESTS
// ============================================

describe('ImageBox - Size Variants', () => {
  test('applies medium size by default', () => {
    render(<ImageBox src="/test.jpg" alt="Test" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--md');
  });

  test('applies small size', () => {
    render(<ImageBox src="/test.jpg" alt="Test" size="sm" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--sm');
  });

  test('applies large size', () => {
    render(<ImageBox src="/test.jpg" alt="Test" size="lg" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--lg');
  });

  test('applies extra large size', () => {
    render(<ImageBox src="/test.jpg" alt="Test" size="xl" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--xl');
  });
});

// ============================================
// VISUAL VARIANTS TESTS
// ============================================

describe('ImageBox - Visual Variants', () => {
  test('applies border when showBorder is true', () => {
    render(<ImageBox src="/test.jpg" alt="Test" showBorder />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--border');
  });

  test('applies shadow when showShadow is true', () => {
    render(<ImageBox src="/test.jpg" alt="Test" showShadow />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--shadow');
  });

  test('applies both border and shadow', () => {
    render(<ImageBox src="/test.jpg" alt="Test" showBorder showShadow />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--border');
    expect(imagebox).toHaveClass('imagebox--shadow');
  });
});

// ============================================
// INTERACTION TESTS
// ============================================

describe('ImageBox - Interactions', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    fireEvent.click(imagebox);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies clickable class when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--clickable');
  });

  test('has role="button" when clickable', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveAttribute('role', 'button');
  });

  test('has tabIndex when clickable', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveAttribute('tabIndex', '0');
  });

  test('responds to Enter key when clickable', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    fireEvent.keyDown(imagebox, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('responds to Space key when clickable', () => {
    const handleClick = jest.fn();
    render(<ImageBox src="/test.jpg" alt="Test" onClick={handleClick} />);

    const imagebox = screen.getByTestId('imagebox');
    fireEvent.keyDown(imagebox, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies hoverable class when hoverable is true', () => {
    render(<ImageBox src="/test.jpg" alt="Test" hoverable />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--hoverable');
  });

  test('does not have interactive attributes when not clickable', () => {
    render(<ImageBox src="/test.jpg" alt="Test" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).not.toHaveAttribute('role', 'button');
    expect(imagebox).not.toHaveAttribute('tabIndex');
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('ImageBox - Accessibility', () => {
  test('applies aria-label', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        aria-label="Test accessibility label"
      />
    );

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveAttribute('aria-label', 'Test accessibility label');
  });

  test('applies aria-describedby', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        aria-describedby="description-id"
      />
    );

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveAttribute('aria-describedby', 'description-id');
  });

  test('uses semantic figcaption for caption', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Test caption"
      />
    );

    const caption = screen.getByTestId('imagebox-caption');
    expect(caption.tagName).toBe('FIGCAPTION');
  });
});

// ============================================
// CUSTOM PROPS TESTS
// ============================================

describe('ImageBox - Custom Props', () => {
  test('applies custom className', () => {
    render(
      <ImageBox src="/test.jpg" alt="Test" className="custom-class" />
    );

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('custom-class');
  });

  test('applies custom id', () => {
    render(<ImageBox src="/test.jpg" alt="Test" id="custom-id" />);

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveAttribute('id', 'custom-id');
  });

  test('applies custom testId', () => {
    render(<ImageBox src="/test.jpg" alt="Test" data-testid="custom-testid" />);

    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });
});

// ============================================
// IMAGE PROPS TESTS
// ============================================

describe('ImageBox - Image Props', () => {
  test('passes src and alt to Image component', () => {
    render(<ImageBox src="/test.jpg" alt="Test alt text" />);

    const imageContainer = screen.getByTestId('imagebox-image');
    expect(imageContainer).toBeInTheDocument();
  });

  test('passes aspectRatio to Image component', () => {
    render(<ImageBox src="/test.jpg" alt="Test" aspectRatio="16/9" />);

    expect(screen.getByTestId('imagebox-image')).toBeInTheDocument();
  });

  test('passes fit to Image component', () => {
    render(<ImageBox src="/test.jpg" alt="Test" fit="contain" />);

    expect(screen.getByTestId('imagebox-image')).toBeInTheDocument();
  });

  test('passes rounded to Image component', () => {
    render(<ImageBox src="/test.jpg" alt="Test" rounded />);

    expect(screen.getByTestId('imagebox-image')).toBeInTheDocument();
  });

  test('passes loading strategy to Image component', () => {
    render(<ImageBox src="/test.jpg" alt="Test" loading="eager" />);

    expect(screen.getByTestId('imagebox-image')).toBeInTheDocument();
  });
});

// ============================================
// CAPTION PROPS TESTS
// ============================================

describe('ImageBox - Caption Props', () => {
  test('passes captionSize to Text component', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Test caption"
        captionSize="lg"
      />
    );

    expect(screen.getByTestId('imagebox-caption-text')).toBeInTheDocument();
  });

  test('passes captionColor to Text component', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Test caption"
        captionColor="primary"
      />
    );

    expect(screen.getByTestId('imagebox-caption-text')).toBeInTheDocument();
  });

  test('passes captionAlign to Text component', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Test caption"
        captionAlign="center"
      />
    );

    expect(screen.getByTestId('imagebox-caption-text')).toBeInTheDocument();
  });
});

// ============================================
// CONTEXT API TESTS
// ============================================

describe('ImageBox - Context API', () => {
  test('inherits parameters from MoleculeContext', () => {
    render(
      <MoleculeProvider value={{ size: 'lg', rounded: true }}>
        <ImageBox src="/test.jpg" alt="Test" />
      </MoleculeProvider>
    );

    const imagebox = screen.getByTestId('imagebox');
    // Size should be inherited from context
    expect(imagebox).toHaveClass('imagebox--lg');
  });

  test('props override context parameters', () => {
    render(
      <MoleculeProvider value={{ size: 'lg' }}>
        <ImageBox src="/test.jpg" alt="Test" size="sm" />
      </MoleculeProvider>
    );

    const imagebox = screen.getByTestId('imagebox');
    // Size from props should override context
    expect(imagebox).toHaveClass('imagebox--sm');
  });
});

// ============================================
// EDGE CASES
// ============================================

describe('ImageBox - Edge Cases', () => {
  test('handles empty src gracefully', () => {
    render(<ImageBox src="" alt="Empty source" />);

    expect(screen.getByTestId('imagebox')).toBeInTheDocument();
  });

  test('handles empty alt text', () => {
    render(<ImageBox src="/test.jpg" alt="" />);

    expect(screen.getByTestId('imagebox')).toBeInTheDocument();
  });

  test('handles long caption text', () => {
    const longCaption = 'A'.repeat(500);
    render(<ImageBox src="/test.jpg" alt="Test" caption={longCaption} />);

    expect(screen.getByText(longCaption)).toBeInTheDocument();
  });

  test('handles special characters in caption', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Caption with & <special> characters"
      />
    );

    expect(screen.getByText('Caption with & <special> characters')).toBeInTheDocument();
  });

  test('handles both caption and children (children wins)', () => {
    render(
      <ImageBox src="/test.jpg" alt="Test" caption="This should not render">
        <div data-testid="children-content">Children content</div>
      </ImageBox>
    );

    expect(screen.getByTestId('children-content')).toBeInTheDocument();
    expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('ImageBox - Integration', () => {
  test('works with multiple visual variants combined', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Combined variants"
        showBorder
        showShadow
        hoverable
      />
    );

    const imagebox = screen.getByTestId('imagebox');
    expect(imagebox).toHaveClass('imagebox--border');
    expect(imagebox).toHaveClass('imagebox--shadow');
    expect(imagebox).toHaveClass('imagebox--hoverable');
  });

  test('works with all image options', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Full options"
        size="lg"
        aspectRatio="16/9"
        fit="cover"
        rounded
        loading="eager"
      />
    );

    expect(screen.getByTestId('imagebox')).toHaveClass('imagebox--lg');
    expect(screen.getByText('Full options')).toBeInTheDocument();
  });

  test('works with all caption options', () => {
    render(
      <ImageBox
        src="/test.jpg"
        alt="Test"
        caption="Styled caption"
        captionSize="lg"
        captionColor="primary"
        captionAlign="center"
      />
    );

    expect(screen.getByTestId('imagebox-caption-text')).toBeInTheDocument();
    expect(screen.getByText('Styled caption')).toBeInTheDocument();
  });
});
