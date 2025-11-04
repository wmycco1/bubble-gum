'use client';

import type { PageComponent } from '@/types/components';

interface PropertiesPanelProps {
  component: PageComponent | undefined;
  onUpdate: (props: Record<string, unknown>) => void;
}

export function PropertiesPanel({ component, onUpdate }: PropertiesPanelProps) {
  if (!component) {
    return (
      <div className="p-6">
        <p className="text-center text-sm text-slate-600">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Properties</h2>
        <p className="text-xs text-slate-600">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)}{' '}
          Component
        </p>
      </div>

      <div className="space-y-4">
        {component.type === 'hero' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={(component.props.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Subtitle
              </label>
              <textarea
                value={(component.props.subtitle as string) || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                CTA Text
              </label>
              <input
                type="text"
                value={(component.props.ctaText as string) || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
          </>
        )}

        {component.type === 'text' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Content
              </label>
              <textarea
                value={(component.props.content as string) || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={5}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Variant
              </label>
              <select
                value={(component.props.variant as string) || 'paragraph'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Alignment
              </label>
              <select
                value={(component.props.align as string) || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        {component.type === 'image' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                type="text"
                value={(component.props.src as string) || ''}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Alt Text
              </label>
              <input
                type="text"
                value={(component.props.alt as string) || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
          </>
        )}

        {component.type === 'button' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Button Text
              </label>
              <input
                type="text"
                value={(component.props.text as string) || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Link
              </label>
              <input
                type="text"
                value={(component.props.href as string) || ''}
                onChange={(e) => handleChange('href', e.target.value)}
                placeholder="#"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Variant
              </label>
              <select
                value={(component.props.variant as string) || 'primary'}
                onChange={(e) => handleChange('variant', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          </>
        )}

        {component.type === 'form' && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Submit Button Text
              </label>
              <input
                type="text"
                value={(component.props.submitText as string) || ''}
                onChange={(e) => handleChange('submitText', e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
            </div>
            <p className="text-xs text-slate-600">
              Form fields configuration coming soon
            </p>
          </>
        )}
      </div>
    </div>
  );
}
