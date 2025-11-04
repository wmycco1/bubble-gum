// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - CANVAS STORE (ZUSTAND)
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Enterprise-grade state management for visual editor
// Features: Undo/Redo, Time-travel debugging, Immutable updates
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { temporal } from 'zundo';
import { nanoid } from 'nanoid';
import type { CanvasComponent, CanvasState, ComponentType, ComponentProps, ComponentStyle } from './types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Store Interface
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CanvasStore extends CanvasState {
  // Component actions
  addComponent: (type: ComponentType, parentId?: string, index?: number) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  deleteComponent: (id: string) => void;
  moveComponent: (id: string, newParentId: string | null, newIndex: number) => void;
  duplicateComponent: (id: string) => void;

  // Selection actions
  selectComponent: (id: string | null) => void;
  setHoveredComponent: (id: string | null) => void;

  // Style actions
  updateComponentStyle: (id: string, style: Partial<ComponentStyle>) => void;
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void;

  // UI actions
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
  setZoom: (zoom: number) => void;
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;

  // Utility actions
  clearCanvas: () => void;
  loadComponents: (components: CanvasComponent[]) => void;
  getComponentById: (id: string) => CanvasComponent | undefined;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Default Component Templates
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const getDefaultComponent = (type: ComponentType): Omit<CanvasComponent, 'id'> => {
  const defaults: Record<ComponentType, Omit<CanvasComponent, 'id'>> = {
    Button: {
      type: 'Button',
      props: { text: 'Click Me', variant: 'default' },
      style: {
        padding: '0.5rem 1rem',
        backgroundColor: '#000000',
        color: '#ffffff',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        border: 'none',
        fontSize: '0.875rem',
        fontWeight: '500',
      },
    },
    Text: {
      type: 'Text',
      props: { text: 'Edit this text' },
      style: {
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#000000',
      },
    },
    Heading: {
      type: 'Heading',
      props: { text: 'Heading', variant: 'h2' },
      style: {
        fontSize: '1.875rem',
        fontWeight: '700',
        lineHeight: '1.2',
        color: '#000000',
        marginBottom: '1rem',
      },
    },
    Image: {
      type: 'Image',
      props: {
        src: 'https://via.placeholder.com/400x300',
        alt: 'Placeholder image',
      },
      style: {
        width: '100%',
        height: 'auto',
        borderRadius: '0.5rem',
      },
    },
    Container: {
      type: 'Container',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        border: '1px dashed #e2e8f0',
        borderRadius: '0.5rem',
        minHeight: '100px',
      },
      children: [],
    },
    Section: {
      type: 'Section',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: '#ffffff',
        minHeight: '200px',
      },
      children: [],
    },
    Grid: {
      type: 'Grid',
      props: {},
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        padding: '1rem',
        minHeight: '150px',
      },
      children: [],
    },
    Card: {
      type: 'Card',
      props: {},
      style: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      },
      children: [],
    },
    Input: {
      type: 'Input',
      props: {
        type: 'text',
        placeholder: 'Enter text...',
      },
      style: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
      },
    },
    Form: {
      type: 'Form',
      props: {},
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        minHeight: '150px',
      },
      children: [],
    },
  };

  return defaults[type];
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Initial State
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const initialState: CanvasState = {
  components: [],
  selectedComponentId: null,
  hoveredComponentId: null,
  past: [],
  future: [],
  isDragging: false,
  isResizing: false,
  zoom: 1,
  deviceMode: 'desktop',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Store Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    temporal(
      (set, get) => ({
        ...initialState,

        // Add new component
        addComponent: (type, parentId, index) => {
          const newComponent: CanvasComponent = {
            ...getDefaultComponent(type),
            id: nanoid(),
            parentId,
          };

          set((state) => {
            const components = [...state.components];

            if (parentId) {
              // Add as child to parent component
              const updateChildren = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === parentId) {
                    const children = comp.children || [];
                    const newChildren = [...children];
                    if (index !== undefined) {
                      newChildren.splice(index, 0, newComponent);
                    } else {
                      newChildren.push(newComponent);
                    }
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: updateChildren(comp.children) };
                  }
                  return comp;
                });
              };

              return {
                components: updateChildren(components),
                selectedComponentId: newComponent.id,
              };
            } else {
              // Add to root level
              if (index !== undefined) {
                components.splice(index, 0, newComponent);
              } else {
                components.push(newComponent);
              }

              return {
                components,
                selectedComponentId: newComponent.id,
              };
            }
          });
        },

        // Update component
        updateComponent: (id, updates) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return { ...comp, ...updates };
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        // Delete component
        deleteComponent: (id) => {
          set((state) => {
            const removeFromTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps
                .filter((comp) => comp.id !== id)
                .map((comp) => {
                  if (comp.children) {
                    return { ...comp, children: removeFromTree(comp.children) };
                  }
                  return comp;
                });
            };

            return {
              components: removeFromTree(state.components),
              selectedComponentId: state.selectedComponentId === id ? null : state.selectedComponentId,
            };
          });
        },

        // Move component
        moveComponent: (id, newParentId, newIndex) => {
          set((state) => {
            // Find and remove component from current location
            let movedComponent: CanvasComponent | undefined;

            const removeFromTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps
                .filter((comp) => {
                  if (comp.id === id) {
                    movedComponent = comp;
                    return false;
                  }
                  return true;
                })
                .map((comp) => {
                  if (comp.children) {
                    return { ...comp, children: removeFromTree(comp.children) };
                  }
                  return comp;
                });
            };

            let components = removeFromTree(state.components);

            if (!movedComponent) return state;

            // Update parentId
            movedComponent = { ...movedComponent, parentId: newParentId || undefined };

            // Insert at new location
            if (newParentId) {
              const insertIntoTree = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === newParentId) {
                    const children = comp.children || [];
                    const newChildren = [...children];
                    newChildren.splice(newIndex, 0, movedComponent!);
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: insertIntoTree(comp.children) };
                  }
                  return comp;
                });
              };

              components = insertIntoTree(components);
            } else {
              components.splice(newIndex, 0, movedComponent);
            }

            return { components };
          });
        },

        // Duplicate component
        duplicateComponent: (id) => {
          const component = get().getComponentById(id);
          if (!component) return;

          const duplicateDeep = (comp: CanvasComponent): CanvasComponent => {
            const newComp = {
              ...comp,
              id: nanoid(),
              children: comp.children?.map(duplicateDeep),
            };
            return newComp;
          };

          const duplicated = duplicateDeep(component);

          set((state) => {
            if (component.parentId) {
              const addToParent = (comps: CanvasComponent[]): CanvasComponent[] => {
                return comps.map((comp) => {
                  if (comp.id === component.parentId) {
                    const children = comp.children || [];
                    const index = children.findIndex((c) => c.id === id);
                    const newChildren = [...children];
                    newChildren.splice(index + 1, 0, duplicated);
                    return { ...comp, children: newChildren };
                  }
                  if (comp.children) {
                    return { ...comp, children: addToParent(comp.children) };
                  }
                  return comp;
                });
              };

              return {
                components: addToParent(state.components),
                selectedComponentId: duplicated.id,
              };
            } else {
              const components = [...state.components];
              const index = components.findIndex((c) => c.id === id);
              components.splice(index + 1, 0, duplicated);

              return {
                components,
                selectedComponentId: duplicated.id,
              };
            }
          });
        },

        // Selection
        selectComponent: (id) => set({ selectedComponentId: id }),
        setHoveredComponent: (id) => set({ hoveredComponentId: id }),

        // Style updates
        updateComponentStyle: (id, style) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return {
                    ...comp,
                    style: { ...comp.style, ...style },
                  };
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        updateComponentProps: (id, props) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  return {
                    ...comp,
                    props: { ...comp.props, ...props },
                  };
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            return {
              components: updateInTree(state.components),
            };
          });
        },

        // UI state
        setIsDragging: (isDragging) => set({ isDragging }),
        setIsResizing: (isResizing) => set({ isResizing }),
        setZoom: (zoom) => set({ zoom }),
        setDeviceMode: (deviceMode) => set({ deviceMode }),

        // Utility
        clearCanvas: () => set({ ...initialState }),
        loadComponents: (components) => set({ components }),
        getComponentById: (id) => {
          const findInTree = (comps: CanvasComponent[]): CanvasComponent | undefined => {
            for (const comp of comps) {
              if (comp.id === id) return comp;
              if (comp.children) {
                const found = findInTree(comp.children);
                if (found) return found;
              }
            }
            return undefined;
          };

          return findInTree(get().components);
        },
      }),
      {
        limit: 50, // Keep 50 history states
        equality: (a, b) => a === b,
      }
    ),
    { name: 'CanvasStore' }
  )
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Undo/Redo Hooks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useUndo = () => {
  const undo = useCanvasStore.temporal.getState().undo;
  const canUndo = useCanvasStore.temporal((state) => state.pastStates.length > 0);
  return { undo, canUndo };
};

export const useRedo = () => {
  const redo = useCanvasStore.temporal.getState().redo;
  const canRedo = useCanvasStore.temporal((state) => state.futureStates.length > 0);
  return { redo, canRedo };
};
