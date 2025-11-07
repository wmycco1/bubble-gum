import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it.each(['default', 'primary', 'success', 'warning', 'error'] as const)(
    'renders %s variant',
    (variant) => {
      render(<Badge variant={variant}>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeInTheDocument();
    }
  );
});
