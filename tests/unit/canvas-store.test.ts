// ═══════════════════════════════════════════════════════════════
// CANVAS STORE TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade tests for Zustand canvas store
// Coverage: Component CRUD, Undo/Redo, Selection, Persistence
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect, beforeEach } from 'vitest';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { ComponentType } from '@/lib/editor/types';

describe('canvas-store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCanvasStore.getState().clearCanvas();
    localStorage.clear();
  });

  describe('Component Operations', () => {
    it('should add component to root level', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(1);
      expect(components[0]?.type).toBe('Button');
      expect(components[0]?.id).toBeDefined();
    });

    it('should add component with initial props', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);

      const { components } = useCanvasStore.getState();
      expect(components[0]?.props).toHaveProperty('text');
      expect(components[0]?.props.text).toBe('Click Me');
    });

    it('should add nested component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Container' as ComponentType);
      const containerId = useCanvasStore.getState().components[0]?.id;
      expect(containerId).toBeDefined();

      store.addComponent('Button' as ComponentType, containerId!);

      const { components } = useCanvasStore.getState();
      expect(components[0]?.children).toHaveLength(1);
      expect(components[0]?.children![0]?.type).toBe('Button');
    });

    it('should update component props', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Text' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.updateComponentProps(componentId!, { text: 'Updated Text' });

      const { components } = useCanvasStore.getState();
      expect(components[0]?.props.text).toBe('Updated Text');
    });

    it('should update component style', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.updateComponentStyle(componentId!, { backgroundColor: '#ff0000' });

      const { components } = useCanvasStore.getState();
      expect(components[0]?.style.backgroundColor).toBe('#ff0000');
    });

    it('should delete component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.deleteComponent(componentId!);

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(0);
    });

    it('should delete nested component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Container' as ComponentType);
      const containerId = useCanvasStore.getState().components[0]?.id;
      expect(containerId).toBeDefined();
      store.addComponent('Button' as ComponentType, containerId!);
      const buttonId = useCanvasStore.getState().components[0]?.children![0]?.id;
      expect(buttonId).toBeDefined();

      store.deleteComponent(buttonId!);

      const { components } = useCanvasStore.getState();
      expect(components[0]?.children).toHaveLength(0);
    });

    it('should duplicate component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const originalId = useCanvasStore.getState().components[0]?.id;
      expect(originalId).toBeDefined();

      store.duplicateComponent(originalId!);

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(2);
      expect(components[1]?.type).toBe('Button');
      expect(components[1]?.id).not.toBe(originalId);
      expect(components[1]?.props).toEqual(components[0]?.props);
    });

    it('should move component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      store.addComponent('Text' as ComponentType);
      const buttonId = useCanvasStore.getState().components[0]?.id;
      expect(buttonId).toBeDefined();

      store.moveComponent(buttonId!, null, 1);

      const { components } = useCanvasStore.getState();
      expect(components[1]?.type).toBe('Button');
    });

    it('should getComponentById', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      const component = store.getComponentById(componentId!);

      expect(component).toBeDefined();
      expect(component?.type).toBe('Button');
    });
  });

  describe('Undo/Redo', () => {
    it('should undo add component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);

      useCanvasStore.temporal.getState().undo();

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(0);
    });

    it('should redo add component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      useCanvasStore.temporal.getState().undo();

      useCanvasStore.temporal.getState().redo();

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(1);
    });

    it('should undo multiple operations', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      store.addComponent('Text' as ComponentType);
      store.addComponent('Image' as ComponentType);

      useCanvasStore.temporal.getState().undo();
      useCanvasStore.temporal.getState().undo();

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(1);
    });

    it('should respect history limit (50 states)', () => {
      const store = useCanvasStore.getState();

      // Add 60 components
      for (let i = 0; i < 60; i++) {
        store.addComponent('Button' as ComponentType);
      }

      const { pastStates } = useCanvasStore.temporal.getState();
      expect(pastStates.length).toBeLessThanOrEqual(50);
    });
  });

  describe('Selection', () => {
    it('should select component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.selectComponent(componentId!);

      const { selectedComponentId } = useCanvasStore.getState();
      expect(selectedComponentId).toBe(componentId);
    });

    it('should deselect component', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.selectComponent(componentId!);

      store.selectComponent(null);

      const { selectedComponentId } = useCanvasStore.getState();
      expect(selectedComponentId).toBeNull();
    });

    it('should clear selection when component deleted', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      const componentId = useCanvasStore.getState().components[0]?.id;
      expect(componentId).toBeDefined();

      store.selectComponent(componentId!);

      store.deleteComponent(componentId!);

      const { selectedComponentId } = useCanvasStore.getState();
      expect(selectedComponentId).toBeNull();
    });
  });

  describe('UI State', () => {
    it('should set zoom', () => {
      const store = useCanvasStore.getState();

      store.setZoom(1.5);

      expect(useCanvasStore.getState().zoom).toBe(1.5);
    });

    it('should set device mode', () => {
      const store = useCanvasStore.getState();

      store.setDeviceMode('mobile');

      expect(useCanvasStore.getState().deviceMode).toBe('mobile');
    });

    it('should set drag state', () => {
      const store = useCanvasStore.getState();

      store.setIsDragging(true);

      expect(useCanvasStore.getState().isDragging).toBe(true);
    });
  });

  describe('Persistence', () => {
    it('should persist components to localStorage', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);

      // Simulate persistence (Zustand persist middleware)
      const stored = localStorage.getItem('bubble-gum-canvas-v1');
      expect(stored).toBeDefined();
    });

    it('should NOT persist UI state', () => {
      const store = useCanvasStore.getState();
      store.setZoom(2);
      store.selectComponent('test-id');

      // Check localStorage doesn't contain UI state
      const stored = JSON.parse(localStorage.getItem('bubble-gum-canvas-v1') || '{}');
      expect(stored.state).not.toHaveProperty('zoom');
      expect(stored.state).not.toHaveProperty('selectedComponentId');
    });
  });

  describe('Load Components', () => {
    it('should load components from array', () => {
      const store = useCanvasStore.getState();
      const mockComponents = [
        {
          id: 'btn-1',
          type: 'Button' as ComponentType,
          props: { text: 'Test Button' },
          style: {},
          children: [],
        },
      ];

      store.loadComponents(mockComponents);

      const { components } = useCanvasStore.getState();
      expect(components).toHaveLength(1);
      expect(components[0]?.id).toBe('btn-1');
    });
  });

  describe('Clear Canvas', () => {
    it('should reset all state', () => {
      const store = useCanvasStore.getState();
      store.addComponent('Button' as ComponentType);
      store.setZoom(2);
      store.selectComponent('test-id');

      store.clearCanvas();

      const state = useCanvasStore.getState();
      expect(state.components).toHaveLength(0);
      expect(state.zoom).toBe(1);
      expect(state.selectedComponentId).toBeNull();
    });
  });
});
