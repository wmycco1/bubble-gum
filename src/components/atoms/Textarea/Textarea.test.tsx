import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders textarea', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('calls onChange when text is entered', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'test');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('disables when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
