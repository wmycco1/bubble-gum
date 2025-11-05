// ═══════════════════════════════════════════════════════════════
// SPACING CONTROLS TESTS
// ═══════════════════════════════════════════════════════════════
// Tests for SpacingControls component (margin/padding editor)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SpacingControls } from '@/components/editor/SpacingControls';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { CanvasComponent } from '@/lib/editor/types';

describe('SpacingControls Component', () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Setup
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  beforeEach(() => {
    // Reset store before each test
    useCanvasStore.setState({
      components: [],
      selectedComponentId: null,
      deviceMode: 'desktop',
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Rendering Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should render spacing controls with margin/padding toggle', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    render(<SpacingControls componentId="test-comp" />);

    // Check header
    expect(screen.getByText('Spacing')).toBeInTheDocument();

    // Check toggle buttons
    expect(screen.getByText('Margin')).toBeInTheDocument();
    expect(screen.getByText('Padding')).toBeInTheDocument();
  });

  it('should show 4 input fields for top/right/bottom/left', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    // Should have 4 input fields
    const inputs = container.querySelectorAll('input[type="text"]');
    expect(inputs.length).toBe(4);
  });

  it('should display current device mode', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({
      components: [component],
      deviceMode: 'tablet',
    });

    render(<SpacingControls componentId="test-comp" />);

    expect(screen.getByText('Tablet')).toBeInTheDocument();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Margin/Padding Toggle Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should toggle between margin and padding', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    render(<SpacingControls componentId="test-comp" />);

    const marginBtn = screen.getByText('Margin');
    const paddingBtn = screen.getByText('Padding');

    // Default should be margin (active)
    expect(marginBtn.className).toContain('bg-white');

    // Click padding
    fireEvent.click(paddingBtn);
    expect(paddingBtn.className).toContain('bg-white');

    // Click back to margin
    fireEvent.click(marginBtn);
    expect(marginBtn.className).toContain('bg-white');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Value Display Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should display existing margin values', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {
        marginTop: '16px',
        marginRight: '8px',
        marginBottom: '16px',
        marginLeft: '8px',
      },
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Check values (order: top, right, bottom, left based on absolute positioning)
    expect(inputs[0]!.value).toBe('16px'); // top
    expect(inputs[1]!.value).toBe('8px');  // right
    expect(inputs[2]!.value).toBe('16px'); // bottom
    expect(inputs[3]!.value).toBe('8px');  // left
  });

  it('should display existing padding values when padding is selected', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {
        paddingTop: '12px',
        paddingRight: '24px',
        paddingBottom: '12px',
        paddingLeft: '24px',
      },
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    // Switch to padding
    const paddingBtn = screen.getByText('Padding');
    fireEvent.click(paddingBtn);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    expect(inputs[0]!.value).toBe('12px'); // top
    expect(inputs[1]!.value).toBe('24px'); // right
    expect(inputs[2]!.value).toBe('12px'); // bottom
    expect(inputs[3]!.value).toBe('24px'); // left
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Responsive Value Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should display responsive margin values for tablet', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {
        marginTop: '16px',
        tablet: {
          marginTop: '12px',
        },
      },
    };

    useCanvasStore.setState({
      components: [component],
      deviceMode: 'tablet',
    });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Should show tablet override value
    expect(inputs[0]!.value).toBe('12px');
  });

  it('should display responsive margin values for mobile with inheritance', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {
        marginTop: '16px',
        tablet: {
          marginTop: '12px',
        },
        mobile: {
          marginTop: '8px',
        },
      },
    };

    useCanvasStore.setState({
      components: [component],
      deviceMode: 'mobile',
    });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Should show mobile override value
    expect(inputs[0]!.value).toBe('8px');
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Value Update Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should update margin value on input change', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Change top margin
    fireEvent.change(inputs[0]!, { target: { value: '20px' } });

    // Check store was updated
    const updatedComponent = useCanvasStore.getState().components[0];
    expect(updatedComponent!.style.marginTop).toBe('20px');
  });

  it('should auto-add px unit when only number is provided', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Enter number without unit
    fireEvent.change(inputs[0]!, { target: { value: '16' } });

    // Should auto-add 'px'
    const updatedComponent = useCanvasStore.getState().components[0];
    expect(updatedComponent!.style.marginTop).toBe('16px');
  });

  it('should accept rem, em, % units', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {},
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Test different units
    fireEvent.change(inputs[0]!, { target: { value: '1rem' } });
    fireEvent.change(inputs[1]!, { target: { value: '2em' } });
    fireEvent.change(inputs[2]!, { target: { value: '50%' } });

    const updatedComponent = useCanvasStore.getState().components[0];
    expect(updatedComponent!.style.marginTop).toBe('1rem');
    expect(updatedComponent!.style.marginRight).toBe('2em');
    expect(updatedComponent!.style.marginBottom).toBe('50%');
  });

  it('should clear value when empty string is provided', () => {
    const component: CanvasComponent = {
      id: 'test-comp',
      type: 'Button',
      props: { text: 'Test' },
      style: {
        marginTop: '16px',
      },
    };

    useCanvasStore.setState({ components: [component] });

    const { container } = render(<SpacingControls componentId="test-comp" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Clear value
    fireEvent.change(inputs[0]!, { target: { value: '' } });

    const updatedComponent = useCanvasStore.getState().components[0];
    expect(updatedComponent!.style.marginTop).toBeUndefined();
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Nested Component Tests
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  it('should work with nested components', () => {
    const components: CanvasComponent[] = [
      {
        id: 'parent',
        type: 'Container',
        props: {},
        style: {},
        children: [
          {
            id: 'child',
            type: 'Button',
            props: { text: 'Click' },
            style: { marginTop: '10px' },
          },
        ],
      },
    ];

    useCanvasStore.setState({ components });

    const { container } = render(<SpacingControls componentId="child" />);

    const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;

    // Should display child's margin
    expect(inputs[0]!.value).toBe('10px');

    // Update child's margin
    fireEvent.change(inputs[0]!, { target: { value: '20px' } });

    // Check nested update
    const updatedComponents = useCanvasStore.getState().components;
    const updatedChild = updatedComponents[0]!.children?.[0];
    expect(updatedChild?.style.marginTop).toBe('20px');
  });
});
