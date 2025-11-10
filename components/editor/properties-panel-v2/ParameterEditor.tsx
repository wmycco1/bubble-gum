'use client';

import React from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { TextControl } from './controls/TextControl';
import { NumberControl } from './controls/NumberControl';
import { ToggleControl } from './controls/ToggleControl';
import { ColorControl } from './controls/ColorControl';
import { SelectControl } from './controls/SelectControl';
import { ImageControl } from './controls/ImageControl';
import { TextareaControl } from './controls/TextareaControl';
import { COMPONENT_PARAMETERS, COMMON_PARAMETERS } from './componentParametersMap';

interface ParameterEditorProps {
  component: CanvasComponent;
  onParameterChange: (paramName: string, value: any) => void;
}

export function ParameterEditor({ component, onParameterChange }: ParameterEditorProps) {
  const params = component.props || {};

  // Get component-specific parameters from comprehensive mapping
  const specificParams = COMPONENT_PARAMETERS[component.type] || [];

  return (
    <div className="p-4 space-y-4">
      {/* Component-specific parameters first (most important) */}
      {specificParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Component Properties</h3>
          {specificParams.map((param) => renderControl(param, params[param.name], onParameterChange))}
        </div>
      )}

      {/* Common parameters at the bottom (advanced) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Properties</h3>
        {COMMON_PARAMETERS.map((param) => renderControl(param, params[param.name], onParameterChange))}
      </div>
    </div>
  );
}

function renderControl(
  param: { name: string; type: string; label: string; options?: string[]; description?: string; required?: boolean },
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
    case 'select':
      return <SelectControl key={param.name} {...param} value={value} onChange={onChange} />;
    case 'image':
      return <ImageControl key={param.name} {...param} value={value} onChange={onChange} />;
    case 'textarea':
      return <TextareaControl key={param.name} {...param} value={value} onChange={onChange} />;
    default:
      return null;
  }
}
