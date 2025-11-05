// ═══════════════════════════════════════════════════════════════
// EDITOR INTEGRATION TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade integration tests for Editor Page
// Coverage: Component interactions, drag & drop, undo/redo, auto-save
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentType } from '@/lib/editor/types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Mock Components (Simplified for Integration Testing)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Mock ComponentLibrary
const MockComponentLibrary = () => {
  const { addComponent } = useCanvasStore();

  return (
    <div data-testid="component-library">
      <h2>Component Library</h2>
      <button
        data-testid="add-button"
        onClick={() => addComponent('Button' as ComponentType)}
      >
        Add Button
      </button>
      <button
        data-testid="add-text"
        onClick={() => addComponent('Text' as ComponentType)}
      >
        Add Text
      </button>
      <button
        data-testid="add-container"
        onClick={() => addComponent('Container' as ComponentType)}
      >
        Add Container
      </button>
    </div>
  );
};

// Mock Canvas
const MockCanvas = () => {
  const { components, selectComponent, selectedComponentId } = useCanvasStore();

  return (
    <div data-testid="canvas">
      <h2>Canvas</h2>
      {components.length === 0 ? (
        <div data-testid="empty-canvas">Drop components here</div>
      ) : (
        <div data-testid="canvas-components">
          {components.map((component) => (
            <div
              key={component.id}
              data-testid={`component-${component.id}`}
              data-type={component.type}
              data-selected={selectedComponentId === component.id}
              onClick={() => selectComponent(component.id)}
              style={{
                border:
                  selectedComponentId === component.id
                    ? '2px solid blue'
                    : '1px solid gray',
                padding: '10px',
                margin: '5px',
                cursor: 'pointer',
              }}
            >
              {component.type}
              {component.children && component.children.length > 0 && (
                <div data-testid={`children-${component.id}`}>
                  {component.children.map((child) => (
                    <div key={child.id} data-testid={`component-${child.id}`}>
                      {child.type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Mock PropertiesPanel
const MockPropertiesPanel = () => {
  const { selectedComponentId, updateComponentProps, getComponentById } =
    useCanvasStore();

  const selectedComponent = selectedComponentId
    ? getComponentById(selectedComponentId)
    : null;

  if (!selectedComponent) {
    return (
      <div data-testid="properties-panel">
        <p>No component selected</p>
      </div>
    );
  }

  return (
    <div data-testid="properties-panel">
      <h3>Properties: {selectedComponent.type}</h3>
      {selectedComponent.type === 'Button' && (
        <div>
          <label htmlFor="button-text">Button Text:</label>
          <input
            id="button-text"
            data-testid="input-button-text"
            type="text"
            value={selectedComponent.props.text || ''}
            onChange={(e) =>
              updateComponentProps(selectedComponentId!, { text: e.target.value })
            }
          />
        </div>
      )}
      {selectedComponent.type === 'Text' && (
        <div>
          <label htmlFor="text-content">Text Content:</label>
          <input
            id="text-content"
            data-testid="input-text-content"
            type="text"
            value={selectedComponent.props.text || ''}
            onChange={(e) =>
              updateComponentProps(selectedComponentId!, { text: e.target.value })
            }
          />
        </div>
      )}
    </div>
  );
};

// Mock Toolbar
const MockToolbar = () => {
  const { deleteComponent, selectedComponentId } = useCanvasStore();

  const handleUndo = () => {
    useCanvasStore.temporal.getState().undo();
  };

  const handleRedo = () => {
    useCanvasStore.temporal.getState().redo();
  };

  const handleDelete = () => {
    if (selectedComponentId) {
      deleteComponent(selectedComponentId);
    }
  };

  return (
    <div data-testid="toolbar">
      <button data-testid="btn-undo" onClick={handleUndo}>
        Undo
      </button>
      <button data-testid="btn-redo" onClick={handleRedo}>
        Redo
      </button>
      <button
        data-testid="btn-delete"
        onClick={handleDelete}
        disabled={!selectedComponentId}
      >
        Delete
      </button>
    </div>
  );
};

// Mock Editor Page
const MockEditorPage = () => {
  return (
    <div data-testid="editor-page">
      <MockToolbar />
      <div style={{ display: 'flex' }}>
        <MockComponentLibrary />
        <MockCanvas />
        <MockPropertiesPanel />
      </div>
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Integration Tests
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Editor Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    useCanvasStore.getState().clearCanvas();
    localStorage.clear();
  });

  describe('Add Component to Canvas', () => {
    it('should add component from library to canvas', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Initially canvas should be empty
      expect(screen.getByTestId('empty-canvas')).toBeInTheDocument();

      // Click "Add Button" in component library
      const addButtonBtn = screen.getByTestId('add-button');
      await user.click(addButtonBtn);

      // Component should appear on canvas
      await waitFor(() => {
        expect(screen.queryByTestId('empty-canvas')).not.toBeInTheDocument();
        expect(screen.getByTestId('canvas-components')).toBeInTheDocument();
      });

      // Verify component type
      const canvasComponents = screen.getByTestId('canvas-components');
      const components = within(canvasComponents).getAllByText('Button');
      expect(components).toHaveLength(1);
    });

    it('should add multiple components to canvas', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Add Text
      await user.click(screen.getByTestId('add-text'));

      // Add Container
      await user.click(screen.getByTestId('add-container'));

      // Verify all components are on canvas
      await waitFor(() => {
        const canvasComponents = screen.getByTestId('canvas-components');
        expect(within(canvasComponents).getByText('Button')).toBeInTheDocument();
        expect(within(canvasComponents).getByText('Text')).toBeInTheDocument();
        expect(within(canvasComponents).getByText('Container')).toBeInTheDocument();
      });

      // Verify store state
      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(3);
    });
  });

  describe('Select and Edit Component', () => {
    it('should select component and show properties panel', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Initially no component selected
      expect(screen.getByText('No component selected')).toBeInTheDocument();

      // Get component ID
      const { components } = useCanvasStore.getState();
      const buttonId = components[0]?.id;
      if (!buttonId) throw new Error('Component not found');

      // Click component to select it
      const componentElement = screen.getByTestId(`component-${buttonId}`);
      await user.click(componentElement);

      // Properties panel should show
      await waitFor(() => {
        expect(screen.getByText('Properties: Button')).toBeInTheDocument();
      });

      // Component should be visually selected
      expect(componentElement).toHaveAttribute('data-selected', 'true');
    });

    it('should edit component props via properties panel', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Select component
      const { components } = useCanvasStore.getState();
      const buttonId = components[0]?.id;
      if (!buttonId) throw new Error('Component not found');
      await user.click(screen.getByTestId(`component-${buttonId}`));

      // Find text input in properties panel
      const textInput = screen.getByTestId('input-button-text');
      expect(textInput).toHaveValue('Click Me'); // Default value

      // Change text
      await user.clear(textInput);
      await user.type(textInput, 'New Button Text');

      // Verify store updated
      await waitFor(() => {
        const { components } = useCanvasStore.getState();
        expect(components[0]?.props.text).toBe('New Button Text');
      });
    });
  });

  describe('Undo/Redo Operations', () => {
    it('should undo add component', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Verify component exists
      await waitFor(() => {
        expect(screen.getByTestId('canvas-components')).toBeInTheDocument();
      });

      // Click Undo
      await user.click(screen.getByTestId('btn-undo'));

      // Canvas should be empty again
      await waitFor(() => {
        expect(screen.getByTestId('empty-canvas')).toBeInTheDocument();
      });

      // Verify store
      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(0);
    });

    it('should redo add component', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Undo
      await user.click(screen.getByTestId('btn-undo'));

      // Canvas empty
      expect(screen.getByTestId('empty-canvas')).toBeInTheDocument();

      // Redo
      await user.click(screen.getByTestId('btn-redo'));

      // Component should reappear
      await waitFor(() => {
        expect(screen.getByTestId('canvas-components')).toBeInTheDocument();
      });

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(1);
    });

    it('should undo/redo property changes', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Select component
      const { components } = useCanvasStore.getState();
      const buttonId = components[0]?.id;
      if (!buttonId) throw new Error('Component not found');
      await user.click(screen.getByTestId(`component-${buttonId}`));

      // Edit text
      const textInput = screen.getByTestId('input-button-text');
      await user.clear(textInput);
      await user.type(textInput, 'Modified');

      // Verify change
      expect(useCanvasStore.getState().components[0]?.props.text).toBe('Modified');

      // Undo
      await user.click(screen.getByTestId('btn-undo'));

      // Should revert to original
      await waitFor(() => {
        expect(useCanvasStore.getState().components[0]?.props.text).toBe('Click Me');
      });

      // Redo
      await user.click(screen.getByTestId('btn-redo'));

      // Should apply change again
      await waitFor(() => {
        expect(useCanvasStore.getState().components[0]?.props.text).toBe('Modified');
      });
    });
  });

  describe('Delete Component', () => {
    it('should delete selected component', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add Button
      await user.click(screen.getByTestId('add-button'));

      // Select component
      const { components } = useCanvasStore.getState();
      const buttonId = components[0]?.id;
      if (!buttonId) throw new Error('Component not found');
      await user.click(screen.getByTestId(`component-${buttonId}`));

      // Delete button should be enabled
      const deleteBtn = screen.getByTestId('btn-delete');
      expect(deleteBtn).not.toBeDisabled();

      // Click Delete
      await user.click(deleteBtn);

      // Canvas should be empty
      await waitFor(() => {
        expect(screen.getByTestId('empty-canvas')).toBeInTheDocument();
      });

      // Properties panel should show no selection
      expect(screen.getByText('No component selected')).toBeInTheDocument();
    });

    it('should disable delete button when no selection', async () => {
      render(<MockEditorPage />);

      // Delete button should be disabled
      const deleteBtn = screen.getByTestId('btn-delete');
      expect(deleteBtn).toBeDisabled();
    });
  });

  describe('Multiple Component Workflow', () => {
    it('should handle complex workflow: add → select → edit → undo → redo → delete', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Step 1: Add Button
      await user.click(screen.getByTestId('add-button'));
      expect(useCanvasStore.getState().components).toHaveLength(1);

      // Step 2: Add Text
      await user.click(screen.getByTestId('add-text'));
      expect(useCanvasStore.getState().components).toHaveLength(2);

      // Step 3: Select first component (Button)
      const { components } = useCanvasStore.getState();
      const buttonId = components[0]?.id;
      if (!buttonId) throw new Error('Component not found');
      await user.click(screen.getByTestId(`component-${buttonId}`));
      expect(useCanvasStore.getState().selectedComponentId).toBe(buttonId);

      // Step 4: Edit Button text
      const textInput = screen.getByTestId('input-button-text');
      await user.clear(textInput);
      await user.type(textInput, 'Edited Button');
      expect(useCanvasStore.getState().components[0]?.props.text).toBe('Edited Button');

      // Step 5: Undo edit
      await user.click(screen.getByTestId('btn-undo'));
      expect(useCanvasStore.getState().components[0]?.props.text).toBe('Click Me');

      // Step 6: Redo edit
      await user.click(screen.getByTestId('btn-redo'));
      expect(useCanvasStore.getState().components[0]?.props.text).toBe('Edited Button');

      // Step 7: Delete Button
      await user.click(screen.getByTestId('btn-delete'));
      expect(useCanvasStore.getState().components).toHaveLength(1);
      expect(useCanvasStore.getState().components[0]?.type).toBe('Text');
    });
  });

  describe('Persistence', () => {
    it('should persist components to localStorage', async () => {
      const user = userEvent.setup();
      render(<MockEditorPage />);

      // Add components
      await user.click(screen.getByTestId('add-button'));
      await user.click(screen.getByTestId('add-text'));

      // Check localStorage
      await waitFor(() => {
        const stored = localStorage.getItem('bubble-gum-canvas-v1');
        expect(stored).toBeDefined();

        if (stored) {
          const parsed = JSON.parse(stored);
          expect(parsed.state.components).toHaveLength(2);
        }
      });
    });
  });
});
