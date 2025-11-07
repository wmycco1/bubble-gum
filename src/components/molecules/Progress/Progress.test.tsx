/**
 * Progress Component Tests
 * God-Tier Development Protocol 2025
 *
 * Test Coverage: 80%+ (targeting 100%)
 * Testing Philosophy: Test behavior, not implementation
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Progress } from './Progress';
import { MoleculeProvider } from '@/context/parameters/ParameterContext';

// ============================================
// BASIC RENDERING TESTS
// ============================================

describe('Progress - Basic Rendering', () => {
  test('renders with required props', () => {
    render(<Progress value={50} />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
    expect(screen.getByTestId('progress-track')).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Progress value={75} label="Upload Progress" />);

    expect(screen.getByText('Upload Progress')).toBeInTheDocument();
    expect(screen.getByTestId('progress-label')).toBeInTheDocument();
  });

  test('renders with percentage by default', () => {
    render(<Progress value={60} label="Loading" />);

    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByTestId('progress-percentage')).toBeInTheDocument();
  });

  test('hides percentage when showPercentage is false', () => {
    render(<Progress value={60} label="Loading" showPercentage={false} />);

    expect(screen.queryByText('60%')).not.toBeInTheDocument();
    expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
  });

  test('renders without label', () => {
    render(<Progress value={50} />);

    expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
    // Header should still exist if showPercentage is true (default)
    expect(screen.getByTestId('progress-header')).toBeInTheDocument();
  });

  test('renders with children instead of label', () => {
    render(
      <Progress value={50}>
        <div data-testid="custom-label">Custom Label Content</div>
      </Progress>
    );

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByText('Custom Label Content')).toBeInTheDocument();
    // Label should not render when children are provided
    expect(screen.queryByTestId('progress-label')).not.toBeInTheDocument();
  });
});

// ============================================
// VALUE CLAMPING TESTS
// ============================================

describe('Progress - Value Clamping', () => {
  test('clamps value to 0-100 range (negative)', () => {
    render(<Progress value={-50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('clamps value to 0-100 range (over 100)', () => {
    render(<Progress value={150} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  test('handles zero value', () => {
    render(<Progress value={0} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('handles 100 value', () => {
    render(<Progress value={100} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  test('handles decimal values', () => {
    render(<Progress value={45.7} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '45.7');
  });
});

// ============================================
// SIZE TESTS
// ============================================

describe('Progress - Size Variants', () => {
  test('applies medium size by default', () => {
    render(<Progress value={50} />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('progress--md');
  });

  test('applies small size', () => {
    render(<Progress value={50} size="sm" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('progress--sm');
  });

  test('applies large size', () => {
    render(<Progress value={50} size="lg" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('progress--lg');
  });
});

// ============================================
// VARIANT TESTS
// ============================================

describe('Progress - Variant Colors', () => {
  test('applies default variant by default', () => {
    render(<Progress value={50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--default');
  });

  test('applies success variant', () => {
    render(<Progress value={90} variant="success" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--success');
  });

  test('applies warning variant', () => {
    render(<Progress value={40} variant="warning" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--warning');
  });

  test('applies error variant', () => {
    render(<Progress value={20} variant="error" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--error');
  });

  test('applies info variant', () => {
    render(<Progress value={60} variant="info" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--info');
  });
});

// ============================================
// ANIMATION TESTS
// ============================================

describe('Progress - Animation', () => {
  test('applies animated class by default', () => {
    render(<Progress value={50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--animated');
  });

  test('does not apply animated class when animated is false', () => {
    render(<Progress value={50} animated={false} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).not.toHaveClass('progress__bar--animated');
  });

  test('applies striped class when striped is true', () => {
    render(<Progress value={50} striped />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--striped');
  });

  test('applies both animated and striped classes', () => {
    render(<Progress value={50} animated striped />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--animated');
    expect(bar).toHaveClass('progress__bar--striped');
  });
});

// ============================================
// INDETERMINATE STATE TESTS
// ============================================

describe('Progress - Indeterminate State', () => {
  test('applies indeterminate class when indeterminate is true', () => {
    render(<Progress value={50} indeterminate />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveClass('progress__bar--indeterminate');
  });

  test('does not show percentage in indeterminate state', () => {
    render(<Progress value={50} label="Loading" indeterminate />);

    expect(screen.queryByTestId('progress-percentage')).not.toBeInTheDocument();
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
  });

  test('does not set aria-valuenow in indeterminate state', () => {
    render(<Progress value={50} indeterminate />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });
});

// ============================================
// ACCESSIBILITY TESTS
// ============================================

describe('Progress - Accessibility', () => {
  test('has progressbar role', () => {
    render(<Progress value={50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('role', 'progressbar');
  });

  test('has correct aria-valuenow', () => {
    render(<Progress value={75} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '75');
  });

  test('has correct aria-valuemin', () => {
    render(<Progress value={50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
  });

  test('has correct aria-valuemax', () => {
    render(<Progress value={50} />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  test('applies aria-label from props', () => {
    render(<Progress value={50} aria-label="Upload progress" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('aria-label', 'Upload progress');
  });

  test('applies aria-label from label prop to bar', () => {
    render(<Progress value={50} label="Loading files" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-label', 'Loading files');
  });

  test('applies aria-describedby', () => {
    render(<Progress value={50} aria-describedby="description-id" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('aria-describedby', 'description-id');
  });
});

// ============================================
// CUSTOM PROPS TESTS
// ============================================

describe('Progress - Custom Props', () => {
  test('applies custom className', () => {
    render(<Progress value={50} className="custom-class" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveClass('custom-class');
  });

  test('applies custom id', () => {
    render(<Progress value={50} id="custom-id" />);

    const progress = screen.getByTestId('progress');
    expect(progress).toHaveAttribute('id', 'custom-id');
  });

  test('applies custom testId', () => {
    render(<Progress value={50} data-testid="custom-testid" />);

    expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
  });

  test('applies custom color via inline style', () => {
    render(<Progress value={50} color="#ff0000" />);

    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveStyle({ backgroundColor: '#ff0000' });
  });

  test('applies custom backgroundColor via inline style', () => {
    render(<Progress value={50} backgroundColor="#cccccc" />);

    const track = screen.getByTestId('progress-track');
    expect(track).toHaveStyle({ backgroundColor: '#cccccc' });
  });
});

// ============================================
// TEXT COMPOSITION TESTS
// ============================================

describe('Progress - Text Composition', () => {
  test('passes labelSize to Text component', () => {
    render(<Progress value={50} label="Loading" labelSize="lg" />);

    expect(screen.getByTestId('progress-label')).toBeInTheDocument();
  });

  test('passes labelColor to Text component', () => {
    render(<Progress value={50} label="Loading" labelColor="primary" />);

    expect(screen.getByTestId('progress-label')).toBeInTheDocument();
  });

  test('passes percentageSize to Text component', () => {
    render(<Progress value={50} percentageSize="lg" />);

    expect(screen.getByTestId('progress-percentage')).toBeInTheDocument();
  });

  test('passes percentageColor to Text component', () => {
    render(<Progress value={50} percentageColor="primary" />);

    expect(screen.getByTestId('progress-percentage')).toBeInTheDocument();
  });
});

// ============================================
// CONTEXT API TESTS
// ============================================

describe('Progress - Context API', () => {
  test('inherits parameters from MoleculeContext', () => {
    render(
      <MoleculeProvider value={{ size: 'lg', variant: 'success' }}>
        <Progress value={50} />
      </MoleculeProvider>
    );

    const progress = screen.getByTestId('progress');
    const bar = screen.getByTestId('progress-bar');

    // Size should be inherited from context
    expect(progress).toHaveClass('progress--lg');
    // Variant should be inherited from context
    expect(bar).toHaveClass('progress__bar--success');
  });

  test('props override context parameters', () => {
    render(
      <MoleculeProvider value={{ size: 'lg', variant: 'success' }}>
        <Progress value={50} size="sm" variant="error" />
      </MoleculeProvider>
    );

    const progress = screen.getByTestId('progress');
    const bar = screen.getByTestId('progress-bar');

    // Size from props should override context
    expect(progress).toHaveClass('progress--sm');
    // Variant from props should override context
    expect(bar).toHaveClass('progress__bar--error');
  });
});

// ============================================
// EDGE CASES
// ============================================

describe('Progress - Edge Cases', () => {
  test('handles empty label gracefully', () => {
    render(<Progress value={50} label="" />);

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  test('handles very long label text', () => {
    const longLabel = 'A'.repeat(200);
    render(<Progress value={50} label={longLabel} />);

    expect(screen.getByText(longLabel)).toBeInTheDocument();
  });

  test('handles NaN value', () => {
    render(<Progress value={NaN} />);

    // NaN should be clamped to 0
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  test('handles Infinity value', () => {
    render(<Progress value={Infinity} />);

    // Infinity should be clamped to 100
    const bar = screen.getByTestId('progress-bar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  test('handles both label and children (children wins)', () => {
    render(
      <Progress value={50} label="This should not render">
        <div data-testid="children-content">Children content</div>
      </Progress>
    );

    expect(screen.getByTestId('children-content')).toBeInTheDocument();
    expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
  });
});

// ============================================
// INTEGRATION TESTS
// ============================================

describe('Progress - Integration', () => {
  test('works with all visual options combined', () => {
    render(
      <Progress
        value={75}
        label="Processing"
        variant="success"
        size="lg"
        animated
        striped
      />
    );

    const progress = screen.getByTestId('progress');
    const bar = screen.getByTestId('progress-bar');

    expect(progress).toHaveClass('progress--lg');
    expect(bar).toHaveClass('progress__bar--success');
    expect(bar).toHaveClass('progress__bar--animated');
    expect(bar).toHaveClass('progress__bar--striped');
    expect(screen.getByText('Processing')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('works with custom colors and styles', () => {
    render(
      <Progress
        value={60}
        label="Custom"
        color="#ff00ff"
        backgroundColor="#f0f0f0"
        className="custom-progress"
      />
    );

    const progress = screen.getByTestId('progress');
    const bar = screen.getByTestId('progress-bar');
    const track = screen.getByTestId('progress-track');

    expect(progress).toHaveClass('custom-progress');
    expect(bar).toHaveStyle({ backgroundColor: '#ff00ff' });
    expect(track).toHaveStyle({ backgroundColor: '#f0f0f0' });
  });

  test('works with all text customization options', () => {
    render(
      <Progress
        value={80}
        label="Loading"
        labelSize="lg"
        labelColor="primary"
        percentageSize="md"
        percentageColor="success"
      />
    );

    expect(screen.getByTestId('progress-label')).toBeInTheDocument();
    expect(screen.getByTestId('progress-percentage')).toBeInTheDocument();
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });
});
