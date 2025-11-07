import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders checkbox', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables when disabled prop is true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
