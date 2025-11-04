# 🧪 UNIT TESTS EXAMPLES

**Generated:** November 2, 2025  
**Tools:** Jest + React Testing Library  
**Coverage:** Components, Hooks, Utils

---

## 📋 TABLE OF CONTENTS

1. [Component Tests](#component-tests)
2. [Hook Tests](#hook-tests)
3. [Utility Tests](#utility-tests)
4. [API Tests](#api-tests)

---

## 🎨 COMPONENT TESTS

### Example 1: Button Component

```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-sm');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click me</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
```

---

### Example 2: Form Component

```typescript
// src/components/ContactForm/ContactForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields', () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab();
    
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello World');
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello World',
      });
    });
  });

  it('shows loading state during submission', async () => {
    const slowSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<ContactForm onSubmit={slowSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();
  });

  it('clears form after successful submission', async () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);
    
    await userEvent.type(screen.getByLabelText('Name'), 'John');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Email')).toHaveValue('');
    });
  });
});
```

---

### Example 3: Modal Component

```typescript
// src/components/Modal/Modal.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Modal isOpen={false}>Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<Modal isOpen={true}>Content</Modal>);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Modal isOpen={true} title="Test Modal">Content</Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    await userEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('calls onClose when overlay clicked', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    await userEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not close on overlay click when closeOnOverlay is false', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlay={false}>
        Content
      </Modal>
    );
    
    await userEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('closes on Escape key', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        Content
      </Modal>
    );
    
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalled();
  });

  it('traps focus inside modal', async () => {
    render(
      <Modal isOpen={true}>
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </Modal>
    );
    
    const buttons = screen.getAllByRole('button');
    
    // Focus first button
    buttons[0].focus();
    expect(buttons[0]).toHaveFocus();
    
    // Tab to second
    await userEvent.tab();
    expect(buttons[1]).toHaveFocus();
    
    // Tab to third
    await userEvent.tab();
    expect(buttons[2]).toHaveFocus();
    
    // Tab should wrap to first
    await userEvent.tab();
    expect(buttons[0]).toHaveFocus();
  });
});
```

---

## 🪝 HOOK TESTS

### Example 1: useFetch Hook

```typescript
// src/hooks/useFetch/useFetch.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useFetch('/api/data'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches and returns data', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch('/api/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles errors', async () => {
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetch('/api/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });

  it('refetches when URL changes', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockData2,
      });

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/api/data/1' } }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData1);
    });

    rerender({ url: '/api/data/2' });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockData2);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

---

### Example 2: useLocalStorage Hook

```typescript
// src/hooks/useLocalStorage/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when key does not exist', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    );

    expect(result.current[0]).toBe('initial');
  });

  it('returns stored value when key exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    );

    expect(result.current[0]).toBe('stored');
  });

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    );

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('handles function updates', () => {
    const { result } = renderHook(() =>
      useLocalStorage('counter', 0)
    );

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });

  it('handles complex objects', () => {
    const initialValue = { name: 'John', age: 30 };

    const { result } = renderHook(() =>
      useLocalStorage('user', initialValue)
    );

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1]({ name: 'Jane', age: 25 });
    });

    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
  });

  it('handles JSON parse errors gracefully', () => {
    localStorage.setItem('test-key', 'invalid json');

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
  });
});
```

---

## 🔧 UTILITY TESTS

### Example 1: formatPrice

```typescript
// src/utils/formatPrice/formatPrice.test.ts
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats USD correctly', () => {
    expect(formatPrice(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('formats EUR correctly', () => {
    expect(formatPrice(1234.56, 'EUR')).toBe('€1,234.56');
  });

  it('handles zero', () => {
    expect(formatPrice(0, 'USD')).toBe('$0.00');
  });

  it('handles negative numbers', () => {
    expect(formatPrice(-100, 'USD')).toBe('-$100.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatPrice(1.999, 'USD')).toBe('$2.00');
    expect(formatPrice(1.001, 'USD')).toBe('$1.00');
  });

  it('handles large numbers', () => {
    expect(formatPrice(1000000, 'USD')).toBe('$1,000,000.00');
  });

  it('uses correct thousand separators', () => {
    expect(formatPrice(1234567.89, 'USD')).toBe('$1,234,567.89');
  });
});
```

---

### Example 2: validateEmail

```typescript
// src/utils/validation/validateEmail.test.ts
import { validateEmail } from './validateEmail';

describe('validateEmail', () => {
  it('validates correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@example.com')).toBe(true);
    expect(validateEmail('user+tag@example.co.uk')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
  });

  it('handles empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('handles whitespace', () => {
    expect(validateEmail('  test@example.com  ')).toBe(true);
  });

  it('handles special characters in local part', () => {
    expect(validateEmail('test.name+tag@example.com')).toBe(true);
    expect(validateEmail('test_name@example.com')).toBe(true);
  });
});
```

---

### Example 3: slugify

```typescript
// src/utils/slugify/slugify.test.ts
import { slugify } from './slugify';

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('converts to lowercase', () => {
    expect(slugify('HELLO WORLD')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello @#$ World!')).toBe('hello-world');
  });

  it('handles multiple spaces', () => {
    expect(slugify('Hello    World')).toBe('hello-world');
  });

  it('removes leading and trailing hyphens', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles numbers', () => {
    expect(slugify('Product 123')).toBe('product-123');
  });

  it('handles unicode characters', () => {
    expect(slugify('Héllo Wörld')).toBe('hello-world');
  });
});
```

---

## 📡 API TESTS

### Example 1: API Client

```typescript
// src/lib/api/client.test.ts
import { apiClient } from './client';

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('makes GET request', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await apiClient.get('/api/test');

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: expect.any(Object),
    });
    expect(result).toEqual(mockData);
  });

  it('makes POST request with body', async () => {
    const payload = { name: 'Test' };
    const mockResponse = { id: 1, ...payload };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiClient.post('/api/test', payload);

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws error on HTTP error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(apiClient.get('/api/test')).rejects.toThrow('Not Found');
  });

  it('includes auth token when available', async () => {
    const mockData = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    await apiClient.get('/api/test', { token: 'Bearer abc123' });

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      method: 'GET',
      headers: expect.objectContaining({
        Authorization: 'Bearer abc123',
      }),
    });
  });
});
```

---

**Unit Tests Status:** ✅ Complete  
**Last Updated:** November 2, 2025
