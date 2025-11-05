'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - PROPERTIES PANEL (FIXED CONTROLLED INPUTS)
// ═══════════════════════════════════════════════════════════════
// Version: 3.0.0 - LOCAL STATE FIX for controlled inputs
// Changes:
// - ✅ FIXED: Controlled input lag with async Zustand store updates
// - ✅ FIXED: Input fields now editable (were showing only first char)
// - ✅ Local state with debounced updates (300ms) to store
// - ✅ Immediate UI feedback, batch store updates for performance
// - Accepts CanvasComponent instead of PageComponent
// - Enhanced debug logging with useEffect
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback, useRef } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

interface PropertiesPanelProps {
  component: CanvasComponent | undefined;
  onUpdate: (props: Record<string, unknown>) => void;
}

export function PropertiesPanel({ component, onUpdate }: PropertiesPanelProps) {
  // ═══════════════════════════════════════════════════════════════
  // LOCAL STATE FIX: Prevents controlled input lag with async store
  // ═══════════════════════════════════════════════════════════════
  // Problem: Controlled inputs (value={}) with async Zustand updates
  //          cause React to reset input value before store update completes
  // Solution: Local state for immediate UI update + debounced store update
  // ═══════════════════════════════════════════════════════════════

  // Local state mirrors component.props for immediate input feedback
  const [localProps, setLocalProps] = useState<Record<string, unknown>>(component?.props || {});

  // Debounce timer reference
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when component changes (selection or external update)
  useEffect(() => {
    if (component) {
      setLocalProps(component.props);
      console.log('📝 PropertiesPanel SYNC:', {
        componentId: component.id,
        componentType: component.type,
        propsKeys: Object.keys(component.props),
        timestamp: new Date().toISOString(),
      });
    }
  }, [component?.id, component?.props]); // Only sync on component change, not every render

  // Debounced update to store (300ms delay)
  const debouncedUpdate = useCallback((key: string, value: unknown) => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      console.log('💾 Debounced store update:', { key, value });
      onUpdate({ [key]: value });
    }, 300);
  }, [onUpdate]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debug logging with useEffect to track changes
  useEffect(() => {
    console.log('📝 PropertiesPanel UPDATE:', {
      hasComponent: !!component,
      componentId: component?.id,
      componentType: component?.type,
      componentPropsKeys: component ? Object.keys(component.props) : [],
      timestamp: new Date().toISOString(),
    });
  }, [component]);

  if (!component) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="text-4xl mb-2">👆</div>
          <p className="text-sm font-medium text-slate-900 mb-1">No component selected</p>
          <p className="text-xs text-slate-600">
            Click on a component in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  // Handle input change: Update local state immediately + debounce store update
  const handleChange = (key: string, value: unknown) => {
    // 1. Update local state immediately (instant UI feedback)
    setLocalProps((prev) => ({ ...prev, [key]: value }));

    // 2. Debounce store update (reduce re-renders, batch changes)
    debouncedUpdate(key, value);
  };

  /**
   * Render properties based on component type
   */
  const renderProperties = () => {
    switch (component.type) {
      // Section (Hero)
      case 'Section':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Welcome to Your Website"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
              <textarea
                value={(localProps.subtitle as string) || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Create something amazing"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA Text</label>
              <input
                type="text"
                value={(localProps.ctaText as string) || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Get Started"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                CTA Link
              </label>
              <input
                type="text"
                value={(localProps.ctaLink as string) || ''}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="#"
              />
            </div>
          </>
        );

      // Text & Heading
      case 'Text':
      case 'Heading':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <textarea
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Your text here..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'paragraph'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>
          </>
        );

      // Image
      case 'Image':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
              <input
                type="text"
                value={(localProps.src as string) || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Alt Text</label>
              <input
                type="text"
                value={(localProps.alt as string) || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Describe the image"
              />
            </div>
          </>
        );

      // Button
      case 'Button':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Button Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Click me"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Link</label>
              <input
                type="text"
                value={(localProps.href as string) || ''}
                onChange={(e) => handleChange('href', e.target.value)}
                placeholder="#"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'primary'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </>
        );

      // Input
      case 'Input':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Placeholder</label>
              <input
                type="text"
                value={(localProps.placeholder as string) || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Enter text..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
              <select
                value={(localProps.type as string) || 'text'}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
              </select>
            </div>
          </>
        );

      // Form
      case 'Form':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Submit Button Text
              </label>
              <input
                type="text"
                value={(localProps.submitText as string) || ''}
                onChange={(e) => handleChange('submitText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Submit"
              />
            </div>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs text-blue-900 font-medium mb-1">📝 Form Builder</p>
              <p className="text-xs text-blue-700">
                Form fields configuration coming in Phase 1.10
              </p>
            </div>
          </>
        );

      // Container
      case 'Container':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">📦 Container Component</p>
              <p className="text-xs text-blue-700">
                Layout container • Children: {component.children?.length || 0}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Max Width</label>
              <select
                value={(localProps.maxWidth as string) || '100%'}
                onChange={(e) => handleChange('maxWidth', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="100%">Full Width (100%)</option>
                <option value="1200px">Large (1200px)</option>
                <option value="960px">Medium (960px)</option>
                <option value="640px">Small (640px)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Padding</label>
              <select
                value={(localProps.padding as string) || '1rem'}
                onChange={(e) => handleChange('padding', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="0">None</option>
                <option value="0.5rem">Small (0.5rem)</option>
                <option value="1rem">Medium (1rem)</option>
                <option value="2rem">Large (2rem)</option>
                <option value="4rem">Extra Large (4rem)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Alignment</label>
              <select
                value={(localProps.alignment as string) || 'left'}
                onChange={(e) => handleChange('alignment', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Background Color</label>
              <input
                type="text"
                value={(localProps.backgroundColor as string) || ''}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="#ffffff or transparent"
              />
            </div>
          </>
        );

      // Grid
      case 'Grid':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🔲 Grid Component</p>
              <p className="text-xs text-blue-700">
                Responsive grid layout • Children: {component.children?.length || 0}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Columns</label>
              <select
                value={(localProps.columns as number) || 3}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Gap</label>
              <select
                value={(localProps.gap as string) || '1rem'}
                onChange={(e) => handleChange('gap', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="0">No gap</option>
                <option value="0.5rem">Small (0.5rem)</option>
                <option value="1rem">Medium (1rem)</option>
                <option value="1.5rem">Large (1.5rem)</option>
                <option value="2rem">Extra Large (2rem)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Align Items</label>
              <select
                value={(localProps.alignItems as string) || 'start'}
                onChange={(e) => handleChange('alignItems', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
          </>
        );

      // Card
      case 'Card':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🃏 Card Component</p>
              <p className="text-xs text-blue-700">
                Content card • Children: {component.children?.length || 0}
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Card title"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={(localProps.description as string) || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Card description"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
              <input
                type="text"
                value={(localProps.image as string) || ''}
                onChange={(e) => handleChange('image', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Link (Optional)</label>
              <input
                type="text"
                value={(localProps.href as string) || ''}
                onChange={(e) => handleChange('href', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="#"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'default'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="default">Default</option>
                <option value="bordered">Bordered</option>
                <option value="elevated">Elevated (Shadow)</option>
              </select>
            </div>
          </>
        );

      default:
        return (
          <div className="rounded-md bg-yellow-50 p-3 border border-yellow-200">
            <p className="text-xs text-yellow-900">
              ⚠️ Unknown component type: {component.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <h2 className="text-sm font-semibold text-slate-900">Properties</h2>
        </div>
        <p className="text-xs text-slate-600">
          {component.type} Component
          {component.id && <span className="ml-1 text-slate-400">• {component.id.slice(0, 8)}</span>}
        </p>
      </div>

      {/* Properties Form */}
      <div className="space-y-4">{renderProperties()}</div>

      {/* Tips */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <p className="text-xs text-slate-600 mb-2">
          💡 <span className="font-medium">Keyboard Shortcuts:</span>
        </p>
        <div className="text-xs text-slate-600 space-y-1 ml-4">
          <div>• <kbd className="px-1 py-0.5 bg-slate-100 rounded">Ctrl+Z</kbd> Undo</div>
          <div>• <kbd className="px-1 py-0.5 bg-slate-100 rounded">Ctrl+Y</kbd> Redo</div>
          <div>• <kbd className="px-1 py-0.5 bg-slate-100 rounded">Delete</kbd> Remove component</div>
        </div>
      </div>
    </div>
  );
}
