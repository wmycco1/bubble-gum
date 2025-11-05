'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - PROPERTIES PANEL (FIXED CONTROLLED INPUTS)
// ═══════════════════════════════════════════════════════════════
// Version: 3.1.0 - FIXED: Grid columns visual update
// Changes:
// - ✅ FIXED: Grid columns now update visually when changed (3→6 columns)
// - ✅ Atomic update for columns + columnWidths (no debounce)
// - ✅ FIXED: Controlled input lag with async Zustand store updates
// - ✅ FIXED: Input fields now editable (were showing only first char)
// - ✅ Local state with debounced updates (300ms) to store
// - ✅ Immediate UI feedback, batch store updates for performance
// - Accepts CanvasComponent instead of PageComponent
// - Enhanced debug logging with useEffect
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback, useRef } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { LinksEditor, type Link } from './LinksEditor';
import { ImageLibraryModal } from './ImageLibraryModal';
import { SpacingControls } from './SpacingControls';

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

  // Image library modal state
  const [showImageLibrary, setShowImageLibrary] = useState(false);

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
      case 'SectionComponent':
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
      case 'TextComponent':
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
      case 'ImageComponent':
        return (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={(localProps.src as string) || ''}
                  onChange={(e) => handleChange('src', e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                  placeholder="https://..."
                />
                <button
                  onClick={() => setShowImageLibrary(true)}
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                  title="Open Image Library"
                >
                  🖼️ Library
                </button>
              </div>
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
      case 'ButtonComponent':
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
      case 'InputComponent':
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
      case 'FormComponent':
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
      case 'ContainerComponent':
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
      case 'GridComponent':
        const columns = (localProps.columns as number) || 3;
        const columnWidths = (localProps.columnWidths as string[]) || Array.from({ length: columns }, () => '1fr');

        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🔲 Grid Component (Advanced)</p>
              <p className="text-xs text-blue-700">
                Per-column drop zones • {component.children?.length || 0} items
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Columns</label>
              <select
                value={columns}
                onChange={(e) => {
                  const newColumns = parseInt(e.target.value);
                  // Preserve existing widths if reducing columns, or add '1fr' for new columns
                  const newWidths = Array.from({ length: newColumns }, (_, i) =>
                    columnWidths[i] || '1fr'
                  );

                  // Update local state immediately for BOTH properties
                  setLocalProps((prev) => ({
                    ...prev,
                    columns: newColumns,
                    columnWidths: newWidths,
                  }));

                  // Clear any pending debounce timers
                  if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                  }

                  // Update store immediately (no debounce for column count changes)
                  // This ensures visual update happens instantly
                  onUpdate({
                    columns: newColumns,
                    columnWidths: newWidths,
                  });

                  console.log('🔄 Grid columns updated:', {
                    newColumns,
                    newWidths,
                    timestamp: new Date().toISOString(),
                  });
                }}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
                <option value="5">5 Columns</option>
                <option value="6">6 Columns</option>
                <option value="7">7 Columns</option>
                <option value="8">8 Columns</option>
                <option value="9">9 Columns</option>
                <option value="10">10 Columns</option>
                <option value="11">11 Columns</option>
                <option value="12">12 Columns</option>
              </select>
            </div>

            <div className="rounded-md bg-slate-50 p-3 border border-slate-200">
              <label className="mb-2 block text-xs font-medium text-slate-700">Column Widths</label>
              <p className="text-xs text-slate-600 mb-3">
                Drag components to specific columns. Adjust widths using CSS units (1fr, 200px, auto, etc.)
              </p>
              <div className="space-y-2">
                {Array.from({ length: columns }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-12">Col {index + 1}:</span>
                    <input
                      type="text"
                      value={columnWidths[index] || '1fr'}
                      onChange={(e) => {
                        const newWidths = [...columnWidths];
                        newWidths[index] = e.target.value;
                        handleChange('columnWidths', newWidths);
                      }}
                      placeholder="1fr"
                      className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Examples: 1fr (equal), 2fr (double), 200px (fixed), auto (content)
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Gap</label>
              <select
                value={(localProps.gap as string) || '1.5rem'}
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
          </>
        );

      // Card
      case 'Card':
      case 'CardComponent':
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

      // Navbar
      case 'Navbar':
      case 'NavbarComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🧭 Navbar Component</p>
              <p className="text-xs text-blue-700">
                Navigation bar with logo and links
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Logo Text</label>
              <input
                type="text"
                value={(localProps.logo as string) || ''}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Brand Name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Links</label>
              <LinksEditor
                value={(localProps.links as Link[]) || []}
                onChange={(newLinks) => handleChange('links', newLinks)}
                maxLinks={10}
              />
            </div>
          </>
        );

      // Hero
      case 'Hero':
      case 'HeroComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🦸 Hero Component</p>
              <p className="text-xs text-blue-700">
                Hero section with title, subtitle, and CTA
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Welcome to our site"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
              <textarea
                value={(localProps.subtitle as string) || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="A brief description..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA Button Text</label>
              <input
                type="text"
                value={(localProps.ctaText as string) || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Get Started"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA Link</label>
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

      // Footer
      case 'Footer':
      case 'FooterComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">👣 Footer Component</p>
              <p className="text-xs text-blue-700">
                Footer with copyright and links
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Copyright Text</label>
              <input
                type="text"
                value={(localProps.copyright as string) || ''}
                onChange={(e) => handleChange('copyright', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="© 2025 Company Name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Links</label>
              <LinksEditor
                value={(localProps.links as Link[]) || []}
                onChange={(newLinks) => handleChange('links', newLinks)}
                maxLinks={10}
              />
            </div>
          </>
        );

      // Features
      case 'Features':
      case 'FeaturesComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">⭐ Features Component</p>
              <p className="text-xs text-blue-700">
                Feature grid with icons and descriptions
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Section Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Our Features"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Features (JSON)</label>
              <textarea
                value={JSON.stringify((localProps.features as Array<{ icon: string; title: string; description: string }>) || [], null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleChange('features', parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                rows={10}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder='[{"icon": "⚡", "title": "Fast", "description": "Lightning quick"}]'
              />
              <p className="mt-1 text-xs text-slate-500">
                Format: [{"{"}"icon": "emoji", "title": "...", "description": "..."{"}"}]
              </p>
            </div>
          </>
        );

      // CTA
      case 'CTA':
      case 'CTAComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">📣 CTA Component</p>
              <p className="text-xs text-blue-700">
                Call-to-action section
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Ready to get started?"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={(localProps.description as string) || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Join thousands of users..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Button Text</label>
              <input
                type="text"
                value={(localProps.buttonText as string) || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Get Started Now"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Button Link</label>
              <input
                type="text"
                value={(localProps.buttonLink as string) || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="#"
              />
            </div>
          </>
        );

      // Heading
      case 'Heading':
      case 'HeadingComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">📄 Heading Component</p>
              <p className="text-xs text-blue-700">
                h1-h6 heading element
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Your Heading"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Level</label>
              <select
                value={(localProps.level as string) || 'h2'}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="h1">H1 (Largest)</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6 (Smallest)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Alignment</label>
              <select
                value={(localProps.align as string) || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );

      // Link
      case 'Link':
      case 'LinkComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🔗 Link Component</p>
              <p className="text-xs text-blue-700">
                Hyperlink with variants
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Click here"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">URL</label>
              <input
                type="text"
                value={(localProps.href as string) || ''}
                onChange={(e) => handleChange('href', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'default'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="default">Default (Blue)</option>
                <option value="primary">Primary (Indigo)</option>
                <option value="secondary">Secondary (Gray)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="link-underline"
                checked={(localProps.underline as boolean) ?? true}
                onChange={(e) => handleChange('underline', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="link-underline" className="text-sm font-medium text-slate-700">
                Underline
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="link-external"
                checked={(localProps.external as boolean) ?? false}
                onChange={(e) => handleChange('external', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="link-external" className="text-sm font-medium text-slate-700">
                External Link (opens in new tab)
              </label>
            </div>
          </>
        );

      // Icon
      case 'Icon':
      case 'IconComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">⭐ Icon Component</p>
              <p className="text-xs text-blue-700">
                Lucide icon library
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Icon Name</label>
              <select
                value={(localProps.icon as string) || 'star'}
                onChange={(e) => handleChange('icon', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="star">Star</option>
                <option value="heart">Heart</option>
                <option value="check">Check</option>
                <option value="x">X</option>
                <option value="alert">Alert</option>
                <option value="info">Info</option>
                <option value="home">Home</option>
                <option value="user">User</option>
                <option value="mail">Mail</option>
                <option value="phone">Phone</option>
                <option value="menu">Menu</option>
                <option value="search">Search</option>
                <option value="cart">Shopping Cart</option>
                <option value="settings">Settings</option>
                <option value="chevron-right">Chevron Right</option>
                <option value="arrow-right">Arrow Right</option>
                <option value="external-link">External Link</option>
                <option value="download">Download</option>
                <option value="upload">Upload</option>
                <option value="trash">Trash</option>
                <option value="edit">Edit</option>
                <option value="eye">Eye</option>
                <option value="lock">Lock</option>
                <option value="unlock">Unlock</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Size (px)</label>
              <input
                type="number"
                value={(localProps.size as number) || 24}
                onChange={(e) => handleChange('size', parseInt(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                min={12}
                max={128}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
              <input
                type="color"
                value={(localProps.color as string) || '#000000'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded-md border border-slate-300 cursor-pointer"
              />
            </div>
          </>
        );

      // Textarea
      case 'Textarea':
      case 'TextareaComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">📝 Textarea Component</p>
              <p className="text-xs text-blue-700">
                Multiline text input
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Label</label>
              <input
                type="text"
                value={(localProps.label as string) || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Message"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Placeholder</label>
              <input
                type="text"
                value={(localProps.placeholder as string) || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Enter your message..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={(localProps.name as string) || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="message"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Rows</label>
              <input
                type="number"
                value={(localProps.rows as number) || 4}
                onChange={(e) => handleChange('rows', parseInt(e.target.value))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                min={2}
                max={20}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="textarea-required"
                checked={(localProps.required as boolean) ?? false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="textarea-required" className="text-sm font-medium text-slate-700">
                Required
              </label>
            </div>
          </>
        );

      // Checkbox
      case 'Checkbox':
      case 'CheckboxComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">☑️ Checkbox Component</p>
              <p className="text-xs text-blue-700">
                Checkbox with label
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Label</label>
              <input
                type="text"
                value={(localProps.label as string) || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Accept terms and conditions"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={(localProps.name as string) || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="checkbox"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox-required"
                checked={(localProps.required as boolean) ?? false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="checkbox-required" className="text-sm font-medium text-slate-700">
                Required
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="checkbox-default"
                checked={(localProps.defaultChecked as boolean) ?? false}
                onChange={(e) => handleChange('defaultChecked', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="checkbox-default" className="text-sm font-medium text-slate-700">
                Checked by default
              </label>
            </div>
          </>
        );

      // Submit Button
      case 'Submit':
      case 'SubmitComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">📤 Submit Button Component</p>
              <p className="text-xs text-blue-700">
                Form submit button
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Submit"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'primary'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="primary">Primary (Blue)</option>
                <option value="secondary">Secondary (Gray)</option>
                <option value="success">Success (Green)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Size</label>
              <select
                value={(localProps.size as string) || 'md'}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="submit-fullwidth"
                checked={(localProps.fullWidth as boolean) ?? false}
                onChange={(e) => handleChange('fullWidth', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="submit-fullwidth" className="text-sm font-medium text-slate-700">
                Full Width
              </label>
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

      {/* Spacing Controls (Margin/Padding) */}
      <SpacingControls componentId={component.id} />

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelectImage={(url) => {
          handleChange('src', url);
        }}
      />
    </div>
  );
}
