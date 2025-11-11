'use client';

import React from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { TextControl } from './controls/TextControl';
import { NumberControl } from './controls/NumberControl';
import { ToggleControl } from './controls/ToggleControl';
import { ColorControl } from './controls/ColorControl';
import { DualColorControl } from './controls/DualColorControl';
import { SelectControl } from './controls/SelectControl';
import { ImageControl } from './controls/ImageControl';
import { TextareaControl } from './controls/TextareaControl';
import { SpacingControl } from './controls/SpacingControl';
import { ShadowControl } from './controls/ShadowControl';
import { OpacityControl } from './controls/OpacityControl';
import { BorderRadiusControl } from './controls/BorderRadiusControl';
import { BorderControl } from './controls/BorderControl';
import { TransformControl } from './controls/TransformControl';
import { VariantControl } from './controls/VariantControl';
import { ResponsiveVisibilityControl } from './controls/ResponsiveVisibilityControl';
import { AlignmentControl } from './controls/AlignmentControl';
import { FontFamilyControl } from './controls/FontFamilyControl';
import { FontSizeControl } from './controls/FontSizeControl';
import { FontStyleControl } from './controls/FontStyleControl';
import { LetterSpacingControl } from './controls/LetterSpacingControl';
import { TextTransformControl } from './controls/TextTransformControl';
import { TextShadowControl } from './controls/TextShadowControl';
import { DisplayControl } from './controls/DisplayControl';
import { COMPONENT_PARAMETERS, COMMON_PARAMETERS } from './componentParametersMap';

interface ParameterEditorProps {
  component: CanvasComponent;
  onParameterChange: (paramName: string, value: any) => void;
}

export function ParameterEditor({ component, onParameterChange }: ParameterEditorProps) {
  const params = component.props || {};

  // Get component-specific parameters from comprehensive mapping
  const specificParams = COMPONENT_PARAMETERS[component.type] || [];

  // Enhanced onChange handler that clears custom colors when variant changes
  const handleParameterChange = React.useCallback((paramName: string, value: any) => {
    // Special handling: When variant changes on Badge, clear custom colors
    // This ensures variant preset colors take effect
    if (paramName === 'variant' && component.type === 'Badge') {
      console.log('🔄 ParameterEditor: Badge variant changed, clearing custom colors');
      // Clear color first
      onParameterChange('color', undefined);
      // Clear backgroundColor
      onParameterChange('backgroundColor', undefined);
      // Then set the new variant
      onParameterChange(paramName, value);
    } else {
      // Normal parameter change
      onParameterChange(paramName, value);
    }
  }, [component.type, onParameterChange]);

  // Filter out individual color/backgroundColor params - we'll render them as DualColorControl
  const shouldSkipParam = (paramName: string, index: number, allParams: any[]) => {
    // Skip backgroundColor if color param exists (they'll be rendered together)
    if (paramName === 'backgroundColor') {
      return allParams.some(p => p.name === 'color');
    }
    return false;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Component-specific parameters first (most important) */}
      {specificParams.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Component Properties</h3>
          {specificParams.map((param, index) => {
            // Skip params that will be rendered by DualColorControl
            if (shouldSkipParam(param.name, index, specificParams)) {
              return null;
            }

            // Special case: render color + backgroundColor as DualColorControl
            if (param.name === 'color' && specificParams.some(p => p.name === 'backgroundColor')) {
              return (
                <DualColorControl
                  key="colors"
                  textColor={params['color']}
                  backgroundColor={params['backgroundColor']}
                  onTextColorChange={(color) => handleParameterChange('color', color)}
                  onBackgroundColorChange={(bgColor) => handleParameterChange('backgroundColor', bgColor)}
                />
              );
            }

            return renderControl(param, params[param.name], handleParameterChange, params);
          })}
        </div>
      )}

      {/* Common parameters at the bottom (advanced) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Properties</h3>
        {COMMON_PARAMETERS.map((param) => renderControl(param, params[param.name], handleParameterChange, params))}
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
    case 'variant':
      // Visual variant selector for Badge
      return <VariantControl key={param.name} {...param} value={value} onChange={onChange} />;
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

    // V7.7 - Transform Control (Rotation & Scale)
    case 'transform': {
      // Get individual transform values from component props
      const rotate = allParams['rotate'];
      const scaleX = allParams['scaleX'];
      const scaleY = allParams['scaleY'];
      const transitionDuration = allParams['transitionDuration'];

      return (
        <TransformControl
          key={param.name}
          label={param.label}
          description={param.description}
          rotate={rotate}
          scaleX={scaleX}
          scaleY={scaleY}
          transitionDuration={transitionDuration}
          onChange={onChange}
        />
      );
    }

    // V7.8 - Responsive Visibility Control
    case 'responsive': {
      // Get device visibility flags from component props
      const hideOnMobile = allParams['hideOnMobile'];
      const hideOnTablet = allParams['hideOnTablet'];
      const hideOnDesktop = allParams['hideOnDesktop'];

      return (
        <ResponsiveVisibilityControl
          key={param.name}
          label={param.label}
          description={param.description}
          hideOnMobile={hideOnMobile}
          hideOnTablet={hideOnTablet}
          hideOnDesktop={hideOnDesktop}
          onChange={(device: 'mobile' | 'tablet' | 'desktop', hide: boolean) => {
            // Map device to parameter name
            const paramName = `hideOn${device.charAt(0).toUpperCase()}${device.slice(1)}`;
            onChange(paramName, hide);
          }}
        />
      );
    }

    // V8.1 - Visual Alignment Control
    case 'alignment':
      return (
        <AlignmentControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          onChange={onChange}
        />
      );

    // V8.1 - Font Family Control with Visual Preview
    case 'fontFamily':
      return (
        <FontFamilyControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          options={param.options || []}
          onChange={onChange}
        />
      );

    // V8.1 - Font Size Control with Unit Support (px, rem, em, %)
    case 'fontSize': {
      // Get unit from component props (default: px)
      const unit = allParams['fontSizeUnit'] || 'px';

      return (
        <FontSizeControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          unit={unit}
          min={param.min}
          max={param.max}
          onChange={onChange}
          onUnitChange={(name, newUnit) => {
            // Store unit separately
            onChange('fontSizeUnit', newUnit);
          }}
        />
      );
    }

    // V8.1 - Font Style Control with Visual Buttons
    case 'fontStyle':
      return (
        <FontStyleControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          onChange={onChange}
        />
      );

    // V8.1 - Letter Spacing Control with Live Preview
    case 'letterSpacing':
      return (
        <LetterSpacingControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          min={param.min}
          max={param.max}
          onChange={onChange}
        />
      );

    // V8.1 - Text Transform Control with Visual Buttons
    case 'textTransform':
      return (
        <TextTransformControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          onChange={onChange}
        />
      );

    // V8.1 - Text Shadow Control with Live Text Preview
    case 'textShadow': {
      // Get custom text shadow parameters from component props
      const offsetX = allParams['textShadowOffsetX'];
      const offsetY = allParams['textShadowOffsetY'];
      const blur = allParams['textShadowBlur'];
      const color = allParams['textShadowColor'];
      const textShadowOpacity = allParams['textShadowOpacity'];

      return (
        <TextShadowControl
          key={param.name}
          label={param.label}
          description={param.description}
          preset={value || 'none'}
          offsetX={offsetX}
          offsetY={offsetY}
          blur={blur}
          color={color}
          opacity={textShadowOpacity}
          onPresetChange={(preset) => onChange('textShadow', preset)}
          onCustomChange={(paramType, customValue) => {
            // Handle custom text shadow parameters
            onChange(`textShadow${paramType.charAt(0).toUpperCase()}${paramType.slice(1)}`, customValue);
          }}
          onOpacityChange={(opacityValue) => {
            onChange('textShadowOpacity', opacityValue);
          }}
        />
      );
    }

    // V8.2 - Display Control with Visual Icons
    case 'display':
      return (
        <DisplayControl
          key={param.name}
          name={param.name}
          label={param.label}
          description={param.description}
          value={value}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}
