'use client';

// ═══════════════════════════════════════════════════════════════
// MULTISTEP FORM STEPS CONTROL - CRUD for Multistep Form Builder
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Multi-step form management with nested fields
// Features:
// - Add/Remove/Edit form steps
// - Drag & drop to reorder steps
// - Each step has title, description, and fields array
// - Nested field management per step
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';

interface MultistepFormStepsControlProps {
  componentId: string;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  [key: string]: unknown;
}

export function MultistepFormStepsControl({ componentId }: MultistepFormStepsControlProps) {
  const components = useCanvasStore((state) => state.components);
  const updateComponentProps = useCanvasStore((state) => state.updateComponentProps);

  // Find current component
  const findComponent = (comps: typeof components, id: string): typeof components[0] | null => {
    for (const comp of comps) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const component = findComponent(components, componentId);

  // Default steps
  const defaultItems: FormStep[] = [
    {
      id: 'step-1',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        { id: 'field-1-1', type: 'text', label: 'First Name', placeholder: 'John', required: true },
        { id: 'field-1-2', type: 'text', label: 'Last Name', placeholder: 'Doe', required: true },
        { id: 'field-1-3', type: 'email', label: 'Email', placeholder: 'john@example.com', required: true }
      ]
    },
    {
      id: 'step-2',
      title: 'Contact Details',
      description: 'How can we reach you?',
      fields: [
        { id: 'field-2-1', type: 'tel', label: 'Phone Number', placeholder: '+1 (555) 000-0000', required: true },
        { id: 'field-2-2', type: 'text', label: 'Address', placeholder: '123 Main St', required: false }
      ]
    },
    {
      id: 'step-3',
      title: 'Additional Information',
      description: 'Anything else you'd like to share?',
      fields: [
        { id: 'field-3-1', type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false },
        { id: 'field-3-2', type: 'checkbox', label: 'Subscribe', placeholder: 'I want to receive updates', required: false }
      ]
    }
  ];

  const [items, setItems] = useState<FormStep[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.steps as FormStep[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.steps as FormStep[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: FormStep[]) => {
    logger.debug('🔄 MultistepFormStepsControl: Updating steps', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { steps: newItems });
    logger.debug('✅ MultistepFormStepsControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: FormStep,
    onChange: (updates: Partial<FormStep>) => void
  ) => {
    return (
      <div className="space-y-4">
        {/* Step Title */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Step Title</label>
          <input
            type="text"
            value={item.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Step title..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Step Description */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Description (optional)</label>
          <input
            type="text"
            value={item.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Brief description..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Fields Summary */}
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-2">
            Form Fields ({item.fields.length})
          </p>
          {item.fields.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No fields added yet</p>
          ) : (
            <div className="space-y-1">
              {item.fields.map((field) => (
                <div key={field.id} className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {field.type}
                  </span>
                  <span>{field.label}</span>
                  {field.required && <span className="text-red-500">*</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Fields (Simple JSON editor for now) */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">
            Fields (JSON)
          </label>
          <textarea
            value={JSON.stringify(item.fields, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                if (Array.isArray(parsed)) {
                  onChange({ fields: parsed });
                }
              } catch (err) {
                // Invalid JSON, ignore
              }
            }}
            rows={8}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
          />
          <p className="text-xs text-slate-500 mt-1">
            Edit fields as JSON (id, type, label, placeholder, required, options)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded border border-blue-200">
        <p className="text-xs text-blue-900 font-medium">
          💡 Tip: Each step can have multiple fields. Edit fields as JSON for now.
        </p>
      </div>

      <ItemsEditor
        items={items}
        onItemsChange={handleItemsChange}
        itemTemplate={{
          title: 'New Step',
          description: 'Step description',
          fields: [
            { id: `field-${Date.now()}`, type: 'text', label: 'Field Label', placeholder: 'Placeholder...', required: false }
          ]
        }}
        renderItemEditor={renderItemEditor}
        itemLabel="Form Step"
      />
    </div>
  );
}
