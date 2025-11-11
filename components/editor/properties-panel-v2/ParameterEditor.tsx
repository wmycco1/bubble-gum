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
import { SpacingControl } from './controls/SpacingControl';
import { ShadowControl } from './controls/ShadowControl';
import { OpacityControl } from './controls/OpacityControl';
import { BorderRadiusControl } from './controls/BorderRadiusControl';
import { BorderControl } from './controls/BorderControl';
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
          {specificParams.map((param) => renderControl(param, params[param.name], onParameterChange, params))}
        </div>
      )}

      {/* Common parameters at the bottom (advanced) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Properties</h3>
        {COMMON_PARAMETERS.map((param) => renderControl(param, params[param.name], onParameterChange, params))}
      </div>
    </div>
  );
}

function renderControl(
  param: {
    name: string;
    type: string;
    label: string;
    options?: string[];
    description?: string;
    required?: boolean;
    paramName?: string;
    presetOptions?: string[];
  },
  value: any,
  onChange: (name: string, value: any) => void,
  allParams: any = {}
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

    // V7.1 - New advanced controls
    case 'spacing': {
      const paramName = param.paramName || param.name;

      // Get individual side values from component props
      const top = allParams[`${paramName}Top`];
      const right = allParams[`${paramName}Right`];
      const bottom = allParams[`${paramName}Bottom`];
      const left = allParams[`${paramName}Left`];

      return (
        <SpacingControl
          key={param.name}
          label={param.label}
          description={param.description}
          value={value}
          top={top}
          right={right}
          bottom={bottom}
          left={left}
          paramName={paramName}
          onChange={onChange}
          onSideChange={(side: 'Top' | 'Right' | 'Bottom' | 'Left', sideValue: number | undefined) => {
            // Handle individual side changes
            onChange(`${paramName}${side}`, sideValue);
          }}
        />
      );
    }
    case 'shadow': {
      // Get custom shadow parameters from component props
      const offsetX = allParams['shadowOffsetX'];
      const offsetY = allParams['shadowOffsetY'];
      const blur = allParams['shadowBlur'];
      const spread = allParams['shadowSpread'];
      const color = allParams['shadowColor'];
      const shadowOpacity = allParams['shadowOpacity'];

      return (
        <ShadowControl
          key={param.name}
          label={param.label}
          description={param.description}
          preset={value || 'none'}
          offsetX={offsetX}
          offsetY={offsetY}
          blur={blur}
          spread={spread}
          color={color}
          opacity={shadowOpacity}
          onPresetChange={(preset) => onChange('shadow', preset)}
          onCustomChange={(paramType, customValue) => {
            // Handle custom shadow parameters
            onChange(`shadow${paramType.charAt(0).toUpperCase()}${paramType.slice(1)}`, customValue);
          }}
          onOpacityChange={(opacityValue) => {
            onChange('shadowOpacity', opacityValue);
          }}
        />
      );
    }
    case 'opacity':
      return (
        <OpacityControl
          key={param.name}
          label={param.label}
          description={param.description}
          value={value !== undefined ? value : 100}
          onChange={(opacityValue) => onChange(param.name, opacityValue)}
        />
      );

    // V7.2 - Border Radius Control (Simple & Advanced)
    case 'borderRadius': {
      // Get individual corner values from component props
      const topLeft = allParams['borderRadiusTopLeft'];
      const topRight = allParams['borderRadiusTopRight'];
      const bottomLeft = allParams['borderRadiusBottomLeft'];
      const bottomRight = allParams['borderRadiusBottomRight'];

      return (
        <BorderRadiusControl
          key={param.name}
          label={param.label}
          description={param.description}
          value={value}
          topLeft={topLeft}
          topRight={topRight}
          bottomLeft={bottomLeft}
          bottomRight={bottomRight}
          onChange={onChange}
          onCornerChange={(corner: 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight', cornerValue: number | undefined) => {
            // Handle individual corner changes
            onChange(`borderRadius${corner}`, cornerValue);
          }}
        />
      );
    }

    // V7.3 - Border Control (Simple & Advanced)
    case 'border': {
      // Get individual side values from component props
      const top = allParams['borderTopWidth'];
      const right = allParams['borderRightWidth'];
      const bottom = allParams['borderBottomWidth'];
      const left = allParams['borderLeftWidth'];
      const borderStyle = allParams['borderStyle'];
      const borderColor = allParams['borderColor'];
      const topColor = allParams['borderTopColor'];
      const rightColor = allParams['borderRightColor'];
      const bottomColor = allParams['borderBottomColor'];
      const leftColor = allParams['borderLeftColor'];

      return (
        <BorderControl
          key={param.name}
          label={param.label}
          description={param.description}
          value={value}
          top={top}
          right={right}
          bottom={bottom}
          left={left}
          borderStyle={borderStyle}
          borderColor={borderColor}
          topColor={topColor}
          rightColor={rightColor}
          bottomColor={bottomColor}
          leftColor={leftColor}
          onChange={onChange}
          onSideChange={(side: 'Top' | 'Right' | 'Bottom' | 'Left', sideValue: number | undefined) => {
            // Handle individual side changes
            onChange(`border${side}Width`, sideValue);
          }}
          onStyleChange={(style: string) => {
            onChange('borderStyle', style);
          }}
          onColorChange={(color: string) => {
            onChange('borderColor', color);
          }}
          onSideColorChange={(side: 'Top' | 'Right' | 'Bottom' | 'Left', color: string | undefined) => {
            // Handle individual side color changes (can be undefined to clear)
            onChange(`border${side}Color`, color);
          }}
        />
      );
    }

    default:
      return null;
  }
}
