import { render } from '@testing-library/react';
import { Spacer } from './Spacer';

describe('Spacer', () => {
  it('renders spacer', () => {
    const { container } = render(<Spacer />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
