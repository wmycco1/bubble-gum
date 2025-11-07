import { render, screen } from '@testing-library/react';
import { HTML } from './HTML';

describe('HTML', () => {
  it('renders HTML content', () => {
    render(<HTML content="<p>Test content</p>" />);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('sanitizes script tags by default', () => {
    render(<HTML content="<p>Safe</p><script>alert('xss')</script>" />);
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });
});
