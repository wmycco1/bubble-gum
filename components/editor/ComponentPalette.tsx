'use client';

import type { PageComponent, ComponentType } from '@/types/components';
import { componentDefaults } from '@/types/components';

interface ComponentPaletteProps {
  onAddComponent: (component: PageComponent) => void;
}

const componentTypes: Array<{ type: ComponentType; label: string; icon: string }> = [
  { type: 'hero', label: 'Hero', icon: '🎭' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'image', label: 'Image', icon: '🖼️' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'form', label: 'Form', icon: '📋' },
];

export function ComponentPalette({ onAddComponent }: ComponentPaletteProps) {
  const handleAdd = (type: ComponentType) => {
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: componentDefaults[type],
    } as unknown as PageComponent;

    onAddComponent(newComponent);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-900">Components</h2>
      <div className="space-y-2">
        {componentTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => handleAdd(type)}
            className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-medium text-slate-900">{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">AI Tools</h2>
        <button
          className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 opacity-50 cursor-not-allowed"
          disabled
        >
          ✨ Generate with AI
        </button>
        <p className="mt-2 text-xs text-slate-600">Coming soon</p>
      </div>
    </div>
  );
}
