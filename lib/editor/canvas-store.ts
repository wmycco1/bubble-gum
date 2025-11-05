// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - CANVAS STORE (ZUSTAND)
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Added localStorage persistence
// Enterprise-grade state management for visual editor
// Features: Undo/Redo, Time-travel debugging, Immutable updates, localStorage backup
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
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
  updateResponsiveStyle: (id: string, breakpoint: 'desktop' | 'tablet' | 'mobile', style: Partial<ComponentStyle>) => void;

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
    Navbar: {
      type: 'Navbar',
      props: { logo: 'Logo', links: [{ text: 'Home', href: '#' }] },
      style: {},
    },
    NavbarComponent: {
      type: 'NavbarComponent',
      props: { logo: 'Logo', links: [{ text: 'Home', href: '#' }] },
      style: {},
    },
    Hero: {
      type: 'Hero',
      props: { title: 'Hero Title', subtitle: 'Subtitle' },
      style: {},
    },
    HeroComponent: {
      type: 'HeroComponent',
      props: { title: 'Hero Title', subtitle: 'Subtitle' },
      style: {},
    },
    Footer: {
      type: 'Footer',
      props: { copyright: '© 2025 Company' },
      style: {},
    },
    FooterComponent: {
      type: 'FooterComponent',
      props: { copyright: '© 2025 Company' },
      style: {},
    },
    Features: {
      type: 'Features',
      props: { title: 'Features', features: [] },
      style: {},
    },
    FeaturesComponent: {
      type: 'FeaturesComponent',
      props: { title: 'Features', features: [] },
      style: {},
    },
    CTA: {
      type: 'CTA',
      props: { title: 'Call to Action', buttonText: 'Click Here' },
      style: {},
    },
    CTAComponent: {
      type: 'CTAComponent',
      props: { title: 'Call to Action', buttonText: 'Click Here' },
      style: {},
    },
    SectionComponent: {
      type: 'SectionComponent',
      props: {},
      style: {},
      children: [],
    },
    TextComponent: {
      type: 'TextComponent',
      props: { text: 'Text' },
      style: {},
    },
    ImageComponent: {
      type: 'ImageComponent',
      props: { src: 'https://via.placeholder.com/400x300', alt: 'Image' },
      style: {},
    },
    ButtonComponent: {
      type: 'ButtonComponent',
      props: { text: 'Button' },
      style: {},
    },
    InputComponent: {
      type: 'InputComponent',
      props: { placeholder: 'Input...' },
      style: {},
    },
    FormComponent: {
      type: 'FormComponent',
      props: {},
      style: {},
      children: [],
    },
    ContainerComponent: {
      type: 'ContainerComponent',
      props: {},
      style: {},
      children: [],
    },
    GridComponent: {
      type: 'GridComponent',
      props: {},
      style: {},
      children: [],
    },
    CardComponent: {
      type: 'CardComponent',
      props: {},
      style: {},
      children: [],
    },
    Link: {
      type: 'Link',
      props: { text: 'Click here', href: '#' },
      style: {},
    },
    LinkComponent: {
      type: 'LinkComponent',
      props: { text: 'Click here', href: '#' },
      style: {},
    },
    Icon: {
      type: 'Icon',
      props: { icon: 'star', size: '24' },
      style: {},
    },
    IconComponent: {
      type: 'IconComponent',
      props: { icon: 'star', size: '24' },
      style: {},
    },
    Textarea: {
      type: 'Textarea',
      props: { label: 'Message', placeholder: 'Enter your message...' },
      style: {},
    },
    TextareaComponent: {
      type: 'TextareaComponent',
      props: { label: 'Message', placeholder: 'Enter your message...' },
      style: {},
    },
    Checkbox: {
      type: 'Checkbox',
      props: { label: 'Accept terms and conditions' },
      style: {},
    },
    CheckboxComponent: {
      type: 'CheckboxComponent',
      props: { label: 'Accept terms and conditions' },
      style: {},
    },
    Submit: {
      type: 'Submit',
      props: { text: 'Submit' },
      style: {},
    },
    SubmitComponent: {
      type: 'SubmitComponent',
      props: { text: 'Submit' },
      style: {},
    },
    HeadingComponent: {
      type: 'HeadingComponent',
      props: { text: 'Heading', level: 'h2' },
      style: {},
    },
  };

  return defaults[type] || defaults.Text;
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
// Persistence Configuration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PersistedState {
  components: CanvasComponent[];
  version: number;
  timestamp: number;
}

const STORAGE_KEY = 'bubble-gum-canvas-v1';
const STORAGE_VERSION = 1;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Store Implementation
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useCanvasStore = create<CanvasStore>()(
  persist(
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

        updateResponsiveStyle: (id, breakpoint, style) => {
          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  if (breakpoint === 'desktop') {
                    // Desktop is base style, update directly
                    return {
                      ...comp,
                      style: { ...comp.style, ...style },
                    };
                  } else {
                    // Tablet/Mobile are nested overrides
                    return {
                      ...comp,
                      style: {
                        ...comp.style,
                        [breakpoint]: {
                          ...(comp.style[breakpoint] || {}),
                          ...style,
                        },
                      },
                    };
                  }
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
          console.log('🔧 updateComponentProps called:', { id, props });

          set((state) => {
            const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
              return comps.map((comp) => {
                if (comp.id === id) {
                  const updated = {
                    ...comp,
                    props: { ...comp.props, ...props },
                  };
                  console.log('✅ Component props updated:', {
                    id,
                    oldProps: comp.props,
                    newProps: updated.props,
                  });
                  return updated;
                }
                if (comp.children) {
                  return { ...comp, children: updateInTree(comp.children) };
                }
                return comp;
              });
            };

            const newComponents = updateInTree(state.components);

            // Save to history for undo/redo
            return {
              components: newComponents,
              past: [...state.past, state.components],
              future: [], // Clear future when making new changes
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
  ),
  {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    storage: createJSONStorage(() => localStorage),

    // Only persist canvas data (NOT UI state like selection, zoom)
    partialize: (state) => ({
      components: state.components,
      // DON'T persist: selectedComponentId, hoveredComponentId, zoom, deviceMode, isDragging, isResizing, past, future
    }),

    // Merge strategy: override components from localStorage, keep UI state from initialState
    merge: (persistedState: unknown, currentState) => {
      console.log('📦 localStorage: Restoring persisted state');
      return {
        ...currentState, // Keep UI state (selection, zoom, etc.)
        ...(persistedState as Partial<CanvasStore>), // Override with persisted canvas data
      };
    },

    // Migration function for version changes
    migrate: (persistedState: unknown, version: number) => {
      console.log(`🔄 localStorage: Migrating from version ${version} to ${STORAGE_VERSION}`);

      if (version === 0) {
        // Migrate from v0 to v1 (if needed in future)
        return {
          ...(persistedState as Record<string, unknown>),
          version: 1,
        };
      }

      return persistedState;
    },

    // Only persist in browser environment
    skipHydration: typeof window === 'undefined',

    // Log persistence events
    onRehydrateStorage: () => {
      console.log('💾 localStorage: Starting hydration');
      return (state, error) => {
        if (error) {
          console.error('❌ localStorage: Hydration error:', error);
        } else {
          console.log('✅ localStorage: Hydration complete', {
            components: state?.components.length || 0,
          });
        }
      };
    },
  }
)
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Undo/Redo Hooks
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const useUndo = () => {
  const undo = useCanvasStore.temporal.getState().undo;
  const pastStates = useCanvasStore.temporal.getState().pastStates;
  const canUndo = pastStates.length > 0;
  return { undo, canUndo };
};

export const useRedo = () => {
  const redo = useCanvasStore.temporal.getState().redo;
  const futureStates = useCanvasStore.temporal.getState().futureStates;
  const canRedo = futureStates.length > 0;
  return { redo, canRedo };
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// localStorage Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Clear localStorage backup (call on logout or when starting fresh)
 */
export const clearCanvasLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 localStorage: Cleared canvas backup');
  }
};

/**
 * Get persisted state from localStorage (for conflict detection)
 */
export const getPersistedCanvasState = (): PersistedState | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed.state as PersistedState;
  } catch (error) {
    console.error('❌ localStorage: Failed to read persisted state:', error);
    return null;
  }
};

/**
 * Check if localStorage has unsaved changes compared to database
 */
export const hasLocalStorageConflict = (dbComponents: CanvasComponent[]): boolean => {
  const persisted = getPersistedCanvasState();
  if (!persisted || !persisted.components) return false;

  const localCount = persisted.components.length;
  const dbCount = dbComponents.length;

  // Simple conflict detection: local has more components
  if (localCount > dbCount) {
    console.warn('⚠️ localStorage conflict detected:', {
      local: localCount,
      database: dbCount,
    });
    return true;
  }

  return false;
};
