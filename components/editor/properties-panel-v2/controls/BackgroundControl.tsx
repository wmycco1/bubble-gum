'use client';

// ═══════════════════════════════════════════════════════════════
// BACKGROUND CONTROL - Universal Background Styling Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Mode toggle: Color / Gradient / Image
// - Color mode: ColorPicker component
// - Gradient mode: GradientEditor component
// - Image mode: ImageUpload component
// - Background size selector (cover, contain, auto, custom)
// - Background position selector (9-point grid)
// - Background repeat toggle
// - Background attachment (scroll/fixed)
// - Live preview showing current background
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ColorPicker } from '@/components/editor/controls/ColorPicker';
import { GradientEditor } from './GradientEditor';
import { ImageUpload } from './ImageUpload';

interface BackgroundControlProps {
  componentId: string;
}

type BackgroundMode = 'color' | 'gradient' | 'image';
type BackgroundSize = 'cover' | 'contain' | 'auto' | 'custom';
type BackgroundPosition = 'center' | 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left';
type BackgroundRepeat = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
type BackgroundAttachment = 'scroll' | 'fixed';

export function BackgroundControl({ componentId }: BackgroundControlProps) {
  const deviceMode = useCanvasStore((state) => state.deviceMode);
  const updateResponsiveStyle = useCanvasStore((state) => state.updateResponsiveStyle);
  const components = useCanvasStore((state) => state.components);

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

  // Get current background values from component style
  const getStyleValue = (property: string): string | undefined => {
    if (!component) return undefined;

    const style = component.style;

    // Check responsive overrides
    if (deviceMode === 'mobile' && style.mobile) {
      const mobileValue = (style.mobile as Record<string, unknown>)[property];
      if (mobileValue) return String(mobileValue);
    }
    if (deviceMode === 'tablet' && style.tablet) {
      const tabletValue = (style.tablet as Record<string, unknown>)[property];
      if (tabletValue) return String(tabletValue);
    }

    // Check base style
    const baseValue = (style as Record<string, unknown>)[property];
    return baseValue ? String(baseValue) : undefined;
  };

  const backgroundColor = getStyleValue('backgroundColor') || '';
  const backgroundImage = getStyleValue('backgroundImage') || '';
  const backgroundSize = getStyleValue('backgroundSize') || 'cover';
  const backgroundPosition = getStyleValue('backgroundPosition') || 'center';
  const backgroundRepeat = getStyleValue('backgroundRepeat') || 'no-repeat';
  const backgroundAttachment = getStyleValue('backgroundAttachment') || 'scroll';

  // Determine current mode based on existing values
  const detectMode = (): BackgroundMode => {
    if (backgroundImage) {
      // Check if it's a gradient or image
      if (backgroundImage.includes('gradient')) {
        return 'gradient';
      }
      return 'image';
    }
    if (backgroundColor) {
      return 'color';
    }
    return 'color'; // Default
  };

  const [mode, setMode] = useState<BackgroundMode>(detectMode());

  // Sync mode with external changes
  useEffect(() => {
    setMode(detectMode());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundColor, backgroundImage]);

  const handleModeChange = (newMode: BackgroundMode) => {
    setMode(newMode);

    // Clear previous background values when switching modes
    if (newMode === 'color') {
      updateResponsiveStyle(componentId, deviceMode, {
        backgroundImage: undefined,
      });
    } else if (newMode === 'gradient') {
      updateResponsiveStyle(componentId, deviceMode, {
        backgroundColor: undefined,
      });
    } else if (newMode === 'image') {
      updateResponsiveStyle(componentId, deviceMode, {
        backgroundColor: undefined,
      });
    }
  };

  const handleColorChange = (color: string) => {
    updateResponsiveStyle(componentId, deviceMode, {
      backgroundColor: color || undefined,
    });
  };

  const handleGradientChange = (gradient: string) => {
    updateResponsiveStyle(componentId, deviceMode, {
      backgroundImage: gradient || undefined,
    });
  };

  const handleImageChange = (imageUrl: string) => {
    if (imageUrl) {
      updateResponsiveStyle(componentId, deviceMode, {
        backgroundImage: `url(${imageUrl})`,
      });
    } else {
      updateResponsiveStyle(componentId, deviceMode, {
        backgroundImage: undefined,
      });
    }
  };

  const handleSizeChange = (size: BackgroundSize) => {
    updateResponsiveStyle(componentId, deviceMode, {
      backgroundSize: size === 'custom' ? '100% 100%' : size,
    });
  };

  const handlePositionChange = (position: BackgroundPosition) => {
    // Convert position to CSS values
    const positionMap: Record<BackgroundPosition, string> = {
      'center': 'center center',
      'top': 'center top',
      'top-right': 'right top',
      'right': 'right center',
      'bottom-right': 'right bottom',
      'bottom': 'center bottom',
      'bottom-left': 'left bottom',
      'left': 'left center',
      'top-left': 'left top',
    };

    updateResponsiveStyle(componentId, deviceMode, {
      backgroundPosition: positionMap[position],
    });
  };

  const handleRepeatChange = (repeat: BackgroundRepeat) => {
    updateResponsiveStyle(componentId, deviceMode, {
      backgroundRepeat: repeat,
    });
  };

  const handleAttachmentChange = (attachment: BackgroundAttachment) => {
    updateResponsiveStyle(componentId, deviceMode, {
      backgroundAttachment: attachment,
    });
  };

  // Build preview style
  const previewStyle: React.CSSProperties = {
    backgroundColor: mode === 'color' ? backgroundColor : undefined,
    backgroundImage: mode === 'gradient' || mode === 'image' ? backgroundImage : undefined,
    backgroundSize: mode === 'image' ? backgroundSize : undefined,
    backgroundPosition: mode === 'image' ? backgroundPosition : undefined,
    backgroundRepeat: mode === 'image' ? backgroundRepeat : undefined,
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">
            Background
          </h3>
          <span className="text-xs text-slate-500">
            {deviceMode === 'desktop' ? 'Desktop' : deviceMode === 'tablet' ? 'Tablet' : 'Mobile'}
          </span>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => handleModeChange('color')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'color'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Color
          </button>
          <button
            onClick={() => handleModeChange('gradient')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'gradient'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gradient
          </button>
          <button
            onClick={() => handleModeChange('image')}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'image'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Image
          </button>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-700">
            Preview
          </label>
          <div
            className="h-24 rounded-lg border-2 border-slate-300 relative overflow-hidden"
            style={previewStyle}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-lg bg-black/30 px-2 py-1 rounded">
                Background Preview
              </span>
            </div>
          </div>
        </div>

        {/* Mode-Specific Controls */}
        {mode === 'color' && (
          <ColorPicker
            value={backgroundColor}
            onChange={handleColorChange}
            showOpacity={true}
            showPresets={true}
            label="Background Color"
          />
        )}

        {mode === 'gradient' && (
          <GradientEditor
            value={backgroundImage}
            onChange={handleGradientChange}
            label="Background Gradient"
          />
        )}

        {mode === 'image' && (
          <div className="space-y-4">
            <ImageUpload
              value={backgroundImage.replace(/^url\(['"]?|['"]?\)$/g, '')}
              onChange={handleImageChange}
              label="Background Image"
            />

            {/* Background Size */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Background Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['cover', 'contain', 'auto', 'custom'] as BackgroundSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      backgroundSize === size || (size === 'custom' && backgroundSize === '100% 100%')
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Position (9-point grid) */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Background Position
              </label>
              <div className="grid grid-cols-3 gap-1 p-2 rounded-lg border border-slate-200 bg-slate-50">
                {([
                  'top-left', 'top', 'top-right',
                  'left', 'center', 'right',
                  'bottom-left', 'bottom', 'bottom-right'
                ] as BackgroundPosition[]).map((position) => (
                  <button
                    key={position}
                    onClick={() => handlePositionChange(position)}
                    className={`h-10 rounded border-2 transition-all ${
                      backgroundPosition.includes(position.replace('-', ' '))
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                    title={position}
                  />
                ))}
              </div>
            </div>

            {/* Background Repeat */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Background Repeat
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['no-repeat', 'repeat', 'repeat-x', 'repeat-y'] as BackgroundRepeat[]).map((repeat) => (
                  <button
                    key={repeat}
                    onClick={() => handleRepeatChange(repeat)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      backgroundRepeat === repeat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {repeat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Attachment */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Background Attachment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['scroll', 'fixed'] as BackgroundAttachment[]).map((attachment) => (
                  <button
                    key={attachment}
                    onClick={() => handleAttachmentChange(attachment)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      backgroundAttachment === attachment
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {attachment.charAt(0).toUpperCase() + attachment.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-xs text-blue-900">
            💡 {mode === 'color' && 'Solid color backgrounds work great for simple designs.'}
            {mode === 'gradient' && 'Gradients add depth and visual interest to your design.'}
            {mode === 'image' && 'Background images can be photos, patterns, or textures.'}
          </p>
        </div>
      </div>
    </div>
  );
}
