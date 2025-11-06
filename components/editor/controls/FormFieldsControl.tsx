'use client';

// ═══════════════════════════════════════════════════════════════
// FORM FIELDS CONTROL - CRUD for Form Builder
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - Dynamic form field management
// Features:
// - Add/Remove/Edit form fields
// - Drag & drop to reorder
// - Field types: text/email/tel/textarea/select/checkbox/radio
// - Required toggle
// - Options for select/radio
// - Real-time updates
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ItemsEditor } from './ItemsEditor';
import { logger } from '@/lib/utils/logger';

interface FormFieldsControlProps {
  componentId: string;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  [key: string]: unknown;
}

export function FormFieldsControl({ componentId }: FormFieldsControlProps) {
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

  // Default form fields
  const defaultItems: FormField[] = [
    {
      id: 'field-1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your name',
      required: true
    },
    {
      id: 'field-2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: true
    },
    {
      id: 'field-3',
      type: 'tel',
      label: 'Phone Number',
      placeholder: '+1 (555) 000-0000',
      required: false
    },
    {
      id: 'field-4',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Your message here...',
      required: true
    }
  ];

  const [items, setItems] = useState<FormField[]>(() => {
    if (!component) return defaultItems;
    const currentItems = component.props.fields as FormField[] | undefined;
    return currentItems && currentItems.length > 0 ? currentItems : defaultItems;
  });

  // Sync with component changes
  useEffect(() => {
    if (!component) return;
    const currentItems = component.props.fields as FormField[] | undefined;
    if (currentItems && currentItems.length > 0) {
      setItems(currentItems);
    }
  }, [component]);

  // Handle items change
  const handleItemsChange = (newItems: FormField[]) => {
    logger.debug('🔄 FormFieldsControl: Updating fields', {
      componentId,
      newItems,
      itemsCount: newItems.length
    });
    setItems(newItems);
    updateComponentProps(componentId, { fields: newItems });
    logger.debug('✅ FormFieldsControl: updateComponentProps called');
  };

  // Render item editor
  const renderItemEditor = (
    item: FormField,
    onChange: (updates: Partial<FormField>) => void
  ) => {
    return (
      <div className="space-y-3">
        {/* Field Type */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Field Type</label>
          <select
            value={item.type}
            onChange={(e) => onChange({ type: e.target.value as FormField['type'] })}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="tel">Phone</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select (Dropdown)</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio Buttons</option>
          </select>
        </div>

        {/* Label */}
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">Label</label>
          <input
            type="text"
            value={item.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Field label..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Placeholder (not for checkbox/radio) */}
        {item.type !== 'checkbox' && item.type !== 'radio' && (
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Placeholder</label>
            <input
              type="text"
              value={item.placeholder || ''}
              onChange={(e) => onChange({ placeholder: e.target.value })}
              placeholder="Placeholder text..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Options (for select/radio) */}
        {(item.type === 'select' || item.type === 'radio') && (
          <div>
            <label className="text-xs font-medium text-slate-700 mb-1 block">Options (one per line)</label>
            <textarea
              value={(item.options || []).join('\n')}
              onChange={(e) => onChange({ options: e.target.value.split('\n').filter(o => o.trim()) })}
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y font-mono"
            />
            <p className="text-xs text-slate-500 mt-1">
              {(item.options || []).length} option{(item.options || []).length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Required Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id={`required-${item.id}`}
            checked={item.required}
            onChange={(e) => onChange({ required: e.target.checked })}
            className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor={`required-${item.id}`} className="text-xs font-medium text-slate-700">
            Required field
          </label>
        </div>
      </div>
    );
  };

  return (
    <ItemsEditor
      items={items}
      onItemsChange={handleItemsChange}
      itemTemplate={{
        type: 'text',
        label: 'New Field',
        placeholder: 'Enter value...',
        required: false
      }}
      renderItemEditor={renderItemEditor}
      itemLabel="Form Field"
    />
  );
}
