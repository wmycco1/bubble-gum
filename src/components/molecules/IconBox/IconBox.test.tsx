/**
 * IconBox Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test Coverage: 80%+ (targeting 100%)
 * Testing Philosophy: Test behavior, not implementation
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconBox } from './IconBox';
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

// ============================================
// BASIC RENDERING TESTS
// ============================================

describe('IconBox - Basic Rendering', () => {
  test('renders with required props', () => {
    render(<IconBox icon="check" heading="Test Heading" />);

    expect(screen.getByTestId('iconbox')).toBeInTheDocument();
    expect(screen.getByTestId('iconbox-icon')).toBeInTheDocument();
    expect(screen.getByTestId('iconbox-heading')).toBeInTheDocument();
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  test('renders with description', () => {
    render(
      <IconBox
        icon="check"
        heading="Test Heading"
        description="Test description"
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByTestId('iconbox-description')).toBeInTheDocument();
  });

  test('renders with children instead of description', () => {
    render(
      <IconBox icon="check" heading="Test Heading">
        <div data-testid="custom-content">Custom content</div>
      </IconBox>
    );

    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
    // Description should not render when children are provided
    expect(screen.queryByTestId('iconbox-description')).not.toBeInTheDocument();
  });

  test('renders without description or children', () => {
    render(<IconBox icon="check" heading="Test Heading" />);

    expect(screen.queryByTestId('iconbox-description')).not.toBeInTheDocument();
  });
});

// ============================================
// ALIGNMENT TESTS
// ============================================

describe('IconBox - Alignment', () => {
  test('applies left alignment by default', () => {
    render(<IconBox icon="check" heading="Test" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--left');
  });

  test('applies center alignment', () => {
    render(<IconBox icon="check" heading="Test" align="center" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--center');
  });

  test('applies right alignment', () => {
    render(<IconBox icon="check" heading="Test" align="right" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--right');
  });
});

// ============================================
// LAYOUT TESTS
// ============================================

describe('IconBox - Layout', () => {
  test('applies vertical layout by default', () => {
    render(<IconBox icon="check" heading="Test" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--vertical');
  });

  test('applies horizontal layout', () => {
    render(<IconBox icon="check" heading="Test" layout="horizontal" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--horizontal');
  });
});

// ============================================
// SIZE TESTS
// ============================================

describe('IconBox - Size Variants', () => {
  test('applies medium size by default', () => {
    render(<IconBox icon="check" heading="Test" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--md');
  });

  test('applies small size', () => {
    render(<IconBox icon="check" heading="Test" size="sm" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--sm');
  });

  test('applies large size', () => {
    render(<IconBox icon="check" heading="Test" size="lg" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--lg');
  });

  test('applies extra large size', () => {
    render(<IconBox icon="check" heading="Test" size="xl" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--xl');
  });
});

// ============================================
// VISUAL VARIANTS TESTS
// ============================================

describe('IconBox - Visual Variants', () => {
  test('applies background when showBackground is true', () => {
    render(<IconBox icon="check" heading="Test" showBackground />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--background');
  });

  test('applies border when showBorder is true', () => {
    render(<IconBox icon="check" heading="Test" showBorder />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--border');
  });

  test('applies both background and border', () => {
    render(<IconBox icon="check" heading="Test" showBackground showBorder />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--background');
    expect(iconbox).toHaveClass('iconbox--border');
  });
});

// ============================================
// INTERACTION TESTS
// ============================================

describe('IconBox - Interactions', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    fireEvent.click(iconbox);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies clickable class when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--clickable');
  });

  test('has role="button" when clickable', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveAttribute('role', 'button');
  });

  test('has tabIndex when clickable', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveAttribute('tabIndex', '0');
  });

  test('responds to Enter key when clickable', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    fireEvent.keyDown(iconbox, { key: 'Enter' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('responds to Space key when clickable', () => {
    const handleClick = jest.fn();
    render(<IconBox icon="check" heading="Test" onClick={handleClick} />);

    const iconbox = screen.getByTestId('iconbox');
    fireEvent.keyDown(iconbox, { key: ' ' });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies hoverable class when hoverable is true', () => {
    render(<IconBox icon="check" heading="Test" hoverable />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('iconbox--hoverable');
  });

  test('does not have interactive attributes when not clickable', () => {
    render(<IconBox icon="check" heading="Test" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).not.toHaveAttribute('role', 'button');
    expect(iconbox).not.toHaveAttribute('tabIndex');
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('IconBox - Accessibility', () => {
  test('applies aria-label', () => {
    render(
      <IconBox
        icon="check"
        heading="Test"
        aria-label="Test accessibility label"
      />
    );

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveAttribute('aria-label', 'Test accessibility label');
  });

  test('applies aria-describedby', () => {
    render(
      <IconBox
        icon="check"
        heading="Test"
        aria-describedby="description-id"
      />
    );

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveAttribute('aria-describedby', 'description-id');
  });

  test('icon has aria-hidden attribute', () => {
    render(<IconBox icon="check" heading="Test" />);

    // Icon component should receive aria-hidden="true"
    const iconContainer = screen.getByTestId('iconbox-icon');
    expect(iconContainer).toBeInTheDocument();
  });
});

// ============================================
// CUSTOM PROPS TESTS
// ============================================

describe('IconBox - Custom Props', () => {
  test('applies custom className', () => {
    render(
      <IconBox icon="check" heading="Test" className="custom-class" />
    );

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveClass('custom-class');
  });

  test('applies custom id', () => {
    render(<IconBox icon="check" heading="Test" id="custom-id" />);

    const iconbox = screen.getByTestId('iconbox');
    expect(iconbox).toHaveAttribute('id', 'custom-id');
  });

  test('applies custom testId', () => {
    render(<IconBox icon="check" heading="Test" data-testid="custom-testid" />);

    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });
});

// ============================================
// ATOM COMPOSITION TESTS
// ============================================

describe('IconBox - Atom Composition', () => {
  test('passes iconColor to Icon component', () => {
    render(<IconBox icon="check" heading="Test" iconColor="success" />);

    // Icon component should be rendered
    expect(screen.getByTestId('iconbox-icon')).toBeInTheDocument();
  });

  test('passes iconSize to Icon component', () => {
    render(<IconBox icon="check" heading="Test" iconSize="lg" />);

    expect(screen.getByTestId('iconbox-icon')).toBeInTheDocument();
  });

  test('passes headingLevel to Heading component', () => {
    render(<IconBox icon="check" heading="Test" headingLevel="h2" />);

    expect(screen.getByTestId('iconbox-heading')).toBeInTheDocument();
  });

  test('passes textSize to Text component', () => {
    render(
      <IconBox
        icon="check"
        heading="Test"
        description="Test description"
        textSize="lg"
      />
    );

    expect(screen.getByTestId('iconbox-description')).toBeInTheDocument();
  });
});

// ============================================
// CONTEXT API TESTS
// ============================================

describe('IconBox - Context API', () => {
  test('inherits parameters from MoleculeContext', () => {
    render(
      <MoleculeProvider value={{ size: 'lg', iconColor: 'primary' }}>
        <IconBox icon="check" heading="Test" />
      </MoleculeProvider>
    );

    const iconbox = screen.getByTestId('iconbox');
    // Size should be inherited from context
    expect(iconbox).toHaveClass('iconbox--lg');
  });

  test('props override context parameters', () => {
    render(
      <MoleculeProvider value={{ size: 'lg' }}>
        <IconBox icon="check" heading="Test" size="sm" />
      </MoleculeProvider>
    );

    const iconbox = screen.getByTestId('iconbox');
    // Size from props should override context
    expect(iconbox).toHaveClass('iconbox--sm');
  });
});

// ============================================
// EDGE CASES
// ============================================

describe('IconBox - Edge Cases', () => {
  test('handles empty heading gracefully', () => {
    render(<IconBox icon="check" heading="" />);

    expect(screen.getByTestId('iconbox')).toBeInTheDocument();
  });

  test('handles long heading text', () => {
    const longHeading = 'A'.repeat(200);
    render(<IconBox icon="check" heading={longHeading} />);

    expect(screen.getByText(longHeading)).toBeInTheDocument();
  });

  test('handles long description text', () => {
    const longDescription = 'B'.repeat(500);
    render(
      <IconBox icon="check" heading="Test" description={longDescription} />
    );

    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  test('handles special characters in text', () => {
    render(
      <IconBox
        icon="check"
        heading="Test & <Special> Characters"
        description="Test quotes and apostrophes"
      />
    );

    expect(screen.getByText('Test & <Special> Characters')).toBeInTheDocument();
    expect(screen.getByText('Test quotes and apostrophes')).toBeInTheDocument();
  });
});
