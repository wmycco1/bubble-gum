import { render, screen } from '@testing-library/react';
import { Submit } from './Submit';

describe('Submit', () => {
  it('renders with default value', () => {
    render(<Submit />);
    expect(screen.getByDisplayValue('Submit')).toBeInTheDocument();
  });

  it('renders with custom value', () => {
    render(<Submit value="Send" />);
    expect(screen.getByDisplayValue('Send')).toBeInTheDocument();
  });

  it('disables when disabled', () => {
    render(<Submit disabled />);
    expect(screen.getByDisplayValue('Submit')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Submit loading />);
    expect(screen.getByDisplayValue('Submitting...')).toBeInTheDocument();
  });
});
