'use client';

import React from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { TextControl } from './controls/TextControl';
import { NumberControl } from './controls/NumberControl';
import { ToggleControl } from './controls/ToggleControl';
import { ColorControl } from './controls/ColorControl';

interface ParameterEditorProps {
  component: CanvasComponent;
  onParameterChange: (paramName: string, value: any) => void;
}

export function ParameterEditor({ component, onParameterChange }: ParameterEditorProps) {
  const params = component.props || {};

  // Common parameters for all components
  const commonParams = [
    { name: 'className', type: 'text', label: 'CSS Class' },
    { name: 'id', type: 'text', label: 'ID' },
    { name: 'aria-label', type: 'text', label: 'ARIA Label' },
  ];

  // Component-specific parameters (simplified - будет расширено)
  const specificParams = getComponentParameters(component.type);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Properties</h3>
        {commonParams.map((param) => renderControl(param, params[param.name], onParameterChange))}
      </div>

      {specificParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Component Properties</h3>
          {specificParams.map((param) => renderControl(param, params[param.name], onParameterChange))}
        </div>
      )}
    </div>
  );
}

function renderControl(
  param: { name: string; type: string; label: string; options?: string[] },
  value: any,
  onChange: (name: string, value: any) => void
) {
  switch (param.type) {
    case 'text':
      return <TextControl key={param.name} {...param} value={value} onChange={onChange} />;
    case 'number':
      return <NumberControl key={param.name} {...param} value={value} onChange={onChange} />;
    case 'boolean':
      return <ToggleControl key={param.name} {...param} value={value} onChange={onChange} />;
    case 'color':
      return <ColorControl key={param.name} {...param} value={value} onChange={onChange} />;
    default:
      return null;
  }
}

function getComponentParameters(componentType: string) {
  // Simplified mapping - будет расширено с полной типизацией
  const paramMap: Record<string, any[]> = {
    Button: [
      { name: 'children', type: 'text', label: 'Text' },
      { name: 'variant', type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline'] },
      { name: 'disabled', type: 'boolean', label: 'Disabled' },
    ],
    Text: [
      { name: 'children', type: 'text', label: 'Content' },
      { name: 'color', type: 'color', label: 'Color' },
    ],
    Image: [
      { name: 'src', type: 'text', label: 'Image URL' },
      { name: 'alt', type: 'text', label: 'Alt Text' },
      { name: 'width', type: 'number', label: 'Width' },
      { name: 'height', type: 'number', label: 'Height' },
    ],
  };

  return paramMap[componentType] || [];
}
