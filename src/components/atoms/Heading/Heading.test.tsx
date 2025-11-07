/**
 * Heading Component Tests
 */

import { render, screen } from '@testing-library/react';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders children', () => {
    render(<Heading>Test Heading</Heading>);
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  it.each(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const)(
    'renders as %s element',
    (level) => {
      const { container } = render(<Heading level={level}>Heading</Heading>);
      expect(container.querySelector(level)).toBeInTheDocument();
    }
  );

  it('defaults to h2', () => {
    const { container } = render(<Heading>Heading</Heading>);
    expect(container.querySelector('h2')).toBeInTheDocument();
  });

  it.each(['left', 'center', 'right'] as const)(
    'applies %s alignment',
    (align) => {
      const { container } = render(<Heading align={align}>Heading</Heading>);
      const heading = container.querySelector('h2');
      expect(heading).toHaveClass(`text-${align}`);
    }
  );
});
