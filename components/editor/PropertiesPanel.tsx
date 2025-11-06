'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - PROPERTIES PANEL (FIXED CONTROLLED INPUTS)
// ═══════════════════════════════════════════════════════════════
// Version: 4.0.0 - M1: Universal Styling System Integration
// New Features (M1):
// - ✅ BorderRadiusControl for ALL components (collapsible)
// - ✅ BackgroundControl for layout components (Container, Section, Card, Grid)
// - ✅ PropertyGroup wrapper for collapsible sections with localStorage
// Previous Fixes (v3.1.0):
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
import { BorderRadiusControl } from './controls/BorderRadiusControl';
import { BackgroundControl } from './controls/BackgroundControl';
import { BoxShadowControl } from './controls/BoxShadowControl';
import { OpacityControl } from './controls/OpacityControl';
import { TransformControl } from './controls/TransformControl';
import { TextShadowControl } from './controls/TextShadowControl';
import { ZIndexControl } from './controls/ZIndexControl';
import { BorderControl } from './controls/BorderControl';
import { CustomStyleControl } from './controls/CustomStyleControl';
import { TypographyControl } from './controls/TypographyControl';
import { AdvancedPropertiesControl } from './controls/AdvancedPropertiesControl';
import { AccordionItemsControl } from './controls/AccordionItemsControl';
import { TabsItemsControl } from './controls/TabsItemsControl';
import { CarouselItemsControl } from './controls/CarouselItemsControl';
import { PropertyGroup } from './controls/PropertyGroup';
import { logger } from '@/lib/utils/logger';

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
      logger.debug('📝 PropertiesPanel SYNC:', {
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
      logger.debug('💾 Debounced store update:', { key, value });
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
    logger.debug('📝 PropertiesPanel UPDATE:', {
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
              <label className="mb-1 block text-sm font-medium text-slate-700">Horizontal Align (Justify)</label>
              <select
                value={(localProps.justifyContent as string) || 'flex-start'}
                onChange={(e) => handleChange('justifyContent', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="flex-start">Left</option>
                <option value="center">Center</option>
                <option value="flex-end">Right</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Vertical Align (Items)</label>
              <select
                value={(localProps.alignItems as string) || 'flex-start'}
                onChange={(e) => handleChange('alignItems', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="flex-start">Top</option>
                <option value="center">Center</option>
                <option value="flex-end">Bottom</option>
                <option value="stretch">Stretch</option>
                <option value="baseline">Baseline</option>
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

                  logger.debug('🔄 Grid columns updated:', {
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

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Horizontal Align (Justify)</label>
              <select
                value={(localProps.justifyContent as string) || 'flex-start'}
                onChange={(e) => handleChange('justifyContent', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="flex-start">Left</option>
                <option value="center">Center</option>
                <option value="flex-end">Right</option>
                <option value="space-between">Space Between</option>
                <option value="space-around">Space Around</option>
                <option value="space-evenly">Space Evenly</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Vertical Align (Items)</label>
              <select
                value={(localProps.alignItems as string) || 'flex-start'}
                onChange={(e) => handleChange('alignItems', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="flex-start">Top</option>
                <option value="center">Center</option>
                <option value="flex-end">Bottom</option>
                <option value="stretch">Stretch</option>
                <option value="baseline">Baseline</option>
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

      // M2: New Interactive Components
      case 'Accordion':
      case 'AccordionComponent':
        return (
          <>
            <div className="rounded-md bg-purple-50 p-3 border border-purple-200 mb-4">
              <p className="text-xs text-purple-900 font-medium mb-1">🎵 Accordion Component</p>
              <p className="text-xs text-purple-700">
                Collapsible panels with multiple items
              </p>
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
                <option value="filled">Filled</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Icon Type</label>
              <select
                value={(localProps.iconType as string) || 'chevron'}
                onChange={(e) => handleChange('iconType', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="chevron">Chevron</option>
                <option value="plus-minus">Plus/Minus</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="accordion-allowMultiple"
                checked={(localProps.allowMultiple as boolean) ?? false}
                onChange={(e) => handleChange('allowMultiple', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="accordion-allowMultiple" className="text-sm font-medium text-slate-700">
                Allow Multiple Open
              </label>
            </div>

            {/* Accordion Items CRUD */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <AccordionItemsControl componentId={component.id} />
            </div>
          </>
        );

      case 'Tabs':
      case 'TabsComponent':
        return (
          <>
            <div className="rounded-md bg-indigo-50 p-3 border border-indigo-200 mb-4">
              <p className="text-xs text-indigo-900 font-medium mb-1">📑 Tabs Component</p>
              <p className="text-xs text-indigo-700">
                Tabbed navigation interface
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'default'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="default">Default</option>
                <option value="pills">Pills</option>
                <option value="underline">Underline</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Orientation</label>
              <select
                value={(localProps.orientation as string) || 'horizontal'}
                onChange={(e) => handleChange('orientation', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="tabs-closable"
                checked={(localProps.closable as boolean) ?? false}
                onChange={(e) => handleChange('closable', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="tabs-closable" className="text-sm font-medium text-slate-700">
                Closable Tabs
              </label>
            </div>

            {/* Tabs Items CRUD */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <TabsItemsControl componentId={component.id} />
            </div>
          </>
        );

      case 'Counter':
      case 'CounterComponent':
        return (
          <>
            <div className="rounded-md bg-cyan-50 p-3 border border-cyan-200 mb-4">
              <p className="text-xs text-cyan-900 font-medium mb-1">🔢 Counter Component</p>
              <p className="text-xs text-cyan-700">
                Numeric counter with increment/decrement
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Label</label>
              <input
                type="text"
                value={(localProps.label as string) || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Counter"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Initial Value</label>
              <input
                type="number"
                value={(localProps.initialValue as number) || 0}
                onChange={(e) => handleChange('initialValue', parseInt(e.target.value) || 0)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Min</label>
                <input
                  type="number"
                  value={(localProps.min as number) || 0}
                  onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Max</label>
                <input
                  type="number"
                  value={(localProps.max as number) || 100}
                  onChange={(e) => handleChange('max', parseInt(e.target.value) || 100)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Step</label>
              <input
                type="number"
                value={(localProps.step as number) || 1}
                onChange={(e) => handleChange('step', parseInt(e.target.value) || 1)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Format</label>
              <select
                value={(localProps.format as string) || 'number'}
                onChange={(e) => handleChange('format', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="number">Number</option>
                <option value="currency">Currency ($)</option>
                <option value="percentage">Percentage (%)</option>
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
          </>
        );

      case 'Progress':
      case 'ProgressComponent':
        return (
          <>
            <div className="rounded-md bg-green-50 p-3 border border-green-200 mb-4">
              <p className="text-xs text-green-900 font-medium mb-1">📊 Progress Component</p>
              <p className="text-xs text-green-700">
                Progress bar indicator
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Value (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={(localProps.value as number) || 50}
                onChange={(e) => handleChange('value', Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
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
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="progress-showLabel"
                checked={(localProps.showLabel as boolean) ?? true}
                onChange={(e) => handleChange('showLabel', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="progress-showLabel" className="text-sm font-medium text-slate-700">
                Show Label
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="progress-animated"
                checked={(localProps.animated as boolean) ?? false}
                onChange={(e) => handleChange('animated', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="progress-animated" className="text-sm font-medium text-slate-700">
                Animated
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="progress-striped"
                checked={(localProps.striped as boolean) ?? false}
                onChange={(e) => handleChange('striped', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="progress-striped" className="text-sm font-medium text-slate-700">
                Striped
              </label>
            </div>
          </>
        );

      case 'Tooltip':
      case 'TooltipComponent':
        return (
          <>
            <div className="rounded-md bg-amber-50 p-3 border border-amber-200 mb-4">
              <p className="text-xs text-amber-900 font-medium mb-1">💬 Tooltip Component</p>
              <p className="text-xs text-amber-700">
                Contextual help tooltip
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Trigger Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Hover me"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tooltip Content</label>
              <textarea
                value={(localProps.content as string) || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="This is a tooltip"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Placement</label>
              <select
                value={(localProps.placement as string) || 'top'}
                onChange={(e) => handleChange('placement', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Trigger</label>
              <select
                value={(localProps.trigger as string) || 'hover'}
                onChange={(e) => handleChange('trigger', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="hover">Hover</option>
                <option value="click">Click</option>
                <option value="focus">Focus</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Delay (ms)</label>
              <input
                type="number"
                value={(localProps.delay as number) || 200}
                onChange={(e) => handleChange('delay', parseInt(e.target.value) || 200)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
          </>
        );

      case 'Modal':
      case 'ModalComponent':
        return (
          <>
            <div className="rounded-md bg-violet-50 p-3 border border-violet-200 mb-4">
              <p className="text-xs text-violet-900 font-medium mb-1">🪟 Modal Component</p>
              <p className="text-xs text-violet-700">
                Dialog/modal window
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Modal Title"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Content</label>
              <textarea
                value={(localProps.content as string) || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Modal content goes here..."
              />
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
                <option value="xl">Extra Large</option>
                <option value="full">Full Screen</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="modal-closeButton"
                checked={(localProps.closeButton as boolean) ?? true}
                onChange={(e) => handleChange('closeButton', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="modal-closeButton" className="text-sm font-medium text-slate-700">
                Show Close Button
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="modal-centered"
                checked={(localProps.centered as boolean) ?? true}
                onChange={(e) => handleChange('centered', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="modal-centered" className="text-sm font-medium text-slate-700">
                Centered
              </label>
            </div>
          </>
        );

      case 'Alert':
      case 'AlertComponent':
        return (
          <>
            <div className="rounded-md bg-rose-50 p-3 border border-rose-200 mb-4">
              <p className="text-xs text-rose-900 font-medium mb-1">🚨 Alert Component</p>
              <p className="text-xs text-rose-700">
                Alert/notification message
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Alert Title"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
              <textarea
                value={(localProps.message as string) || ''}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="This is an alert message"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'info'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="alert-dismissible"
                checked={(localProps.dismissible as boolean) ?? true}
                onChange={(e) => handleChange('dismissible', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="alert-dismissible" className="text-sm font-medium text-slate-700">
                Dismissible
              </label>
            </div>
          </>
        );

      case 'Badge':
      case 'BadgeComponent':
        return (
          <>
            <div className="rounded-md bg-pink-50 p-3 border border-pink-200 mb-4">
              <p className="text-xs text-pink-900 font-medium mb-1">🏷️ Badge Component</p>
              <p className="text-xs text-pink-700">
                Status badge/label
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Text</label>
              <input
                type="text"
                value={(localProps.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Badge"
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
                <option value="primary">Primary</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
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
                id="badge-dot"
                checked={(localProps.dot as boolean) ?? false}
                onChange={(e) => handleChange('dot', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="badge-dot" className="text-sm font-medium text-slate-700">
                Show Dot
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="badge-pulse"
                checked={(localProps.pulse as boolean) ?? false}
                onChange={(e) => handleChange('pulse', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="badge-pulse" className="text-sm font-medium text-slate-700">
                Pulse Animation
              </label>
            </div>
          </>
        );

      case 'Breadcrumb':
      case 'BreadcrumbComponent':
        return (
          <>
            <div className="rounded-md bg-teal-50 p-3 border border-teal-200 mb-4">
              <p className="text-xs text-teal-900 font-medium mb-1">🗺️ Breadcrumb Component</p>
              <p className="text-xs text-teal-700">
                Navigation breadcrumb trail
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Separator</label>
              <select
                value={(localProps.separator as string) || 'slash'}
                onChange={(e) => handleChange('separator', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="slash">Slash (/)</option>
                <option value="chevron">Chevron (&gt;)</option>
                <option value="arrow">Arrow (→)</option>
              </select>
            </div>
          </>
        );

      case 'Divider':
      case 'DividerComponent':
        return (
          <>
            <div className="rounded-md bg-gray-50 p-3 border border-gray-200 mb-4">
              <p className="text-xs text-gray-900 font-medium mb-1">➖ Divider Component</p>
              <p className="text-xs text-gray-700">
                Visual content separator
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Orientation</label>
              <select
                value={(localProps.orientation as string) || 'horizontal'}
                onChange={(e) => handleChange('orientation', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Variant</label>
              <select
                value={(localProps.variant as string) || 'solid'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Label (Optional)</label>
              <input
                type="text"
                value={(localProps.label as string) || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="Divider label"
              />
            </div>

            {localProps.label && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Label Position</label>
                <select
                  value={(localProps.labelPosition as string) || 'center'}
                  onChange={(e) => handleChange('labelPosition', e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Thickness</label>
              <input
                type="text"
                value={(localProps.thickness as string) || '1px'}
                onChange={(e) => handleChange('thickness', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="1px"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Color</label>
              <input
                type="color"
                value={(localProps.color as string) || '#e2e8f0'}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-10 rounded-md border border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Spacing</label>
              <input
                type="text"
                value={(localProps.spacing as string) || '1rem'}
                onChange={(e) => handleChange('spacing', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                placeholder="1rem"
              />
            </div>
          </>
        );

      case 'Carousel':
      case 'CarouselComponent':
        return (
          <>
            <div className="rounded-md bg-orange-50 p-3 border border-orange-200 mb-4">
              <p className="text-xs text-orange-900 font-medium mb-1">🎠 Carousel Component</p>
              <p className="text-xs text-orange-700">
                Image carousel/slideshow
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Interval (ms)</label>
              <input
                type="number"
                value={(localProps.interval as number) || 3000}
                onChange={(e) => handleChange('interval', parseInt(e.target.value) || 3000)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carousel-autoPlay"
                checked={(localProps.autoPlay as boolean) ?? true}
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="carousel-autoPlay" className="text-sm font-medium text-slate-700">
                Auto Play
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carousel-showControls"
                checked={(localProps.showControls as boolean) ?? true}
                onChange={(e) => handleChange('showControls', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="carousel-showControls" className="text-sm font-medium text-slate-700">
                Show Controls
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carousel-showIndicators"
                checked={(localProps.showIndicators as boolean) ?? true}
                onChange={(e) => handleChange('showIndicators', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="carousel-showIndicators" className="text-sm font-medium text-slate-700">
                Show Indicators
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carousel-loop"
                checked={(localProps.loop as boolean) ?? true}
                onChange={(e) => handleChange('loop', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <label htmlFor="carousel-loop" className="text-sm font-medium text-slate-700">
                Loop
              </label>
            </div>

            {/* Carousel Slides CRUD */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <CarouselItemsControl componentId={component.id} />
            </div>
          </>
        );

      // M3: Extended Component Library
      case 'Banner':
      case 'BannerComponent':
        return (
          <>
            <div className="rounded-md bg-blue-50 p-3 border border-blue-200 mb-4">
              <p className="text-xs text-blue-900 font-medium mb-1">🎪 Banner Component</p>
              <p className="text-xs text-blue-700">Hero banner with CTA buttons</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={(localProps.title as string) || 'Welcome to Our Site'}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Subtitle</label>
              <input
                type="text"
                value={(localProps.subtitle as string) || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                value={(localProps.description as string) || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Background Image URL</label>
              <input
                type="text"
                value={(localProps.backgroundImage as string) || ''}
                onChange={(e) => handleChange('backgroundImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA Button Text</label>
              <input
                type="text"
                value={(localProps.ctaText as string) || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">CTA Button Link</label>
              <input
                type="text"
                value={(localProps.ctaLink as string) || '#'}
                onChange={(e) => handleChange('ctaLink', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </>
        );

      case 'Video':
      case 'VideoComponent':
        return (
          <>
            <div className="rounded-md bg-red-50 p-3 border border-red-200 mb-4">
              <p className="text-xs text-red-900 font-medium mb-1">🎥 Video Component</p>
              <p className="text-xs text-red-700">YouTube/Vimeo/HTML5 video player</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Video Provider</label>
              <select
                value={(localProps.provider as string) || 'youtube'}
                onChange={(e) => handleChange('provider', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="html5">HTML5</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Video URL</label>
              <input
                type="text"
                value={(localProps.url as string) || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="video-autoPlay"
                checked={(localProps.autoPlay as boolean) ?? false}
                onChange={(e) => handleChange('autoPlay', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="video-autoPlay" className="text-sm font-medium text-slate-700">
                Auto Play
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="video-controls"
                checked={(localProps.controls as boolean) ?? true}
                onChange={(e) => handleChange('controls', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="video-controls" className="text-sm font-medium text-slate-700">
                Show Controls
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="video-loop"
                checked={(localProps.loop as boolean) ?? false}
                onChange={(e) => handleChange('loop', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="video-loop" className="text-sm font-medium text-slate-700">
                Loop
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="video-muted"
                checked={(localProps.muted as boolean) ?? false}
                onChange={(e) => handleChange('muted', e.target.checked)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor="video-muted" className="text-sm font-medium text-slate-700">
                Muted
              </label>
            </div>
          </>
        );

      case 'InnerSection':
      case 'InnerSectionComponent':
      case 'Spacer':
      case 'SpacerComponent':
      case 'HTML':
      case 'HTMLComponent':
      case 'TextEditor':
      case 'TextEditorComponent':
      case 'IconBox':
      case 'IconBoxComponent':
      case 'ImageBox':
      case 'ImageBoxComponent':
      case 'IconList':
      case 'IconListComponent':
      case 'GoogleMaps':
      case 'GoogleMapsComponent':
      case 'SoundCloud':
      case 'SoundCloudComponent':
      case 'SocialIcons':
      case 'SocialIconsComponent':
      case 'FacebookLike':
      case 'FacebookLikeComponent':
      case 'FacebookContent':
      case 'FacebookContentComponent':
      case 'BannerSlider':
      case 'BannerSliderComponent':
      case 'Slider':
      case 'SliderComponent':
      case 'Toggle':
      case 'ToggleComponent':
      case 'Testimonial':
      case 'TestimonialComponent':
      case 'StarRating':
      case 'StarRatingComponent':
      case 'Menu':
      case 'MenuComponent':
      case 'ProductList':
      case 'ProductListComponent':
      case 'ProductSlider':
      case 'ProductSliderComponent':
      case 'AddToCart':
      case 'AddToCartComponent':
      case 'PricingTable':
      case 'PricingTableComponent':
      case 'RecentlyViewed':
      case 'RecentlyViewedComponent':
      case 'RecentlyCompared':
      case 'RecentlyComparedComponent':
      case 'NewProducts':
      case 'NewProductsComponent':
      case 'FormBuilder':
      case 'FormBuilderComponent':
      case 'MultistepFormBuilder':
      case 'MultistepFormBuilderComponent':
      case 'CMSBlock':
      case 'CMSBlockComponent':
      case 'CMSPage':
      case 'CMSPageComponent':
      case 'OrdersAndReturns':
      case 'OrdersAndReturnsComponent':
        return (
          <div className="rounded-md bg-green-50 p-3 border border-green-200">
            <p className="text-xs text-green-900 font-medium mb-1">✨ M3 Component</p>
            <p className="text-xs text-green-700">
              {component.type} - Properties coming soon!
            </p>
            <p className="text-[10px] text-green-600 mt-2">
              This component is part of the M3 Extended Library. Detailed property controls will be added in the next phase.
            </p>
          </div>
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

      {/* Custom Style Control (CSS/Tailwind Editor - ALL components) */}
      <PropertyGroup
        title="Custom Styling"
        storageKey="custom-style-group"
        defaultExpanded={false}
      >
        <CustomStyleControl componentId={component.id} />
      </PropertyGroup>

      {/* Typography Control (ALL text-based components) */}
      <PropertyGroup
        title="Typography"
        storageKey="typography-group"
        defaultExpanded={false}
      >
        <TypographyControl componentId={component.id} />
      </PropertyGroup>

      {/* Advanced Properties Control (Transitions, Filters, Hover States) */}
      <PropertyGroup
        title="Advanced Properties"
        storageKey="advanced-properties-group"
        defaultExpanded={false}
      >
        <AdvancedPropertiesControl componentId={component.id} />
      </PropertyGroup>

      {/* Spacing Controls (Margin/Padding) */}
      <SpacingControls componentId={component.id} />

      {/* Border Control (ALL components) */}
      <PropertyGroup
        title="Border"
        storageKey="border-group"
        defaultExpanded={false}
      >
        <BorderControl componentId={component.id} />
      </PropertyGroup>

      {/* Border Radius Control (ALL components) */}
      <PropertyGroup
        title="Border Radius"
        storageKey="border-radius-group"
        defaultExpanded={false}
      >
        <BorderRadiusControl componentId={component.id} />
      </PropertyGroup>

      {/* Box Shadow Control (ALL components) */}
      <PropertyGroup
        title="Box Shadow"
        storageKey="box-shadow-group"
        defaultExpanded={false}
      >
        <BoxShadowControl componentId={component.id} />
      </PropertyGroup>

      {/* Opacity Control (ALL components) */}
      <PropertyGroup
        title="Opacity"
        storageKey="opacity-group"
        defaultExpanded={false}
      >
        <OpacityControl componentId={component.id} />
      </PropertyGroup>

      {/* Transform Control (ALL components) */}
      <PropertyGroup
        title="Transform"
        storageKey="transform-group"
        defaultExpanded={false}
      >
        <TransformControl componentId={component.id} />
      </PropertyGroup>

      {/* Z-Index Control (ALL components) */}
      <PropertyGroup
        title="Z-Index"
        storageKey="z-index-group"
        defaultExpanded={false}
      >
        <ZIndexControl componentId={component.id} />
      </PropertyGroup>

      {/* Text Shadow Control (Text-based components) */}
      {['Text', 'TextComponent', 'Heading', 'HeadingComponent', 'Button', 'ButtonComponent', 'Link', 'LinkComponent'].includes(component.type) && (
        <PropertyGroup
          title="Text Shadow"
          storageKey="text-shadow-group"
          defaultExpanded={false}
        >
          <TextShadowControl componentId={component.id} />
        </PropertyGroup>
      )}

      {/* Background Control (Layout components only) */}
      {['Container', 'ContainerComponent', 'Section', 'SectionComponent', 'Card', 'CardComponent', 'Grid', 'GridComponent'].includes(component.type) && (
        <PropertyGroup
          title="Background"
          storageKey="background-group"
          defaultExpanded={false}
        >
          <BackgroundControl componentId={component.id} />
        </PropertyGroup>
      )}

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
