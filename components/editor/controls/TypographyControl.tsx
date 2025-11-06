'use client';

// ═══════════════════════════════════════════════════════════════
// TYPOGRAPHY CONTROL - Advanced Text Styling
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 3: Typography Controls
// Features:
// - Font family selector (web-safe + Google Fonts)
// - Font weight slider (100-900)
// - Line height control
// - Letter spacing control
// - Text decoration selector
// - Text transform selector
// - Font size control
// - Real-time preview
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { Type, AlignLeft, ChevronDown } from 'lucide-react';
import { extractTypographyFromCSS } from '@/lib/utils/css-property-parser';

interface TypographyControlProps {
  componentId: string;
}

// Common web-safe fonts + popular Google Fonts
const FONT_FAMILIES = [
  { value: 'sans-serif', label: 'System Sans-serif', category: 'System' },
  { value: 'serif', label: 'System Serif', category: 'System' },
  { value: 'monospace', label: 'System Monospace', category: 'System' },
  { value: 'Inter', label: 'Inter', category: 'Google Fonts' },
  { value: 'Roboto', label: 'Roboto', category: 'Google Fonts' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Google Fonts' },
  { value: 'Lato', label: 'Lato', category: 'Google Fonts' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Google Fonts' },
  { value: 'Poppins', label: 'Poppins', category: 'Google Fonts' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Google Fonts' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Google Fonts' },
  { value: 'Fira Code', label: 'Fira Code', category: 'Monospace' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' },
];

const FONT_WEIGHTS = [
  { value: 100, label: 'Thin' },
  { value: 200, label: 'Extra Light' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
];

const TEXT_DECORATIONS = [
  { value: 'none', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-through', label: 'Strikethrough' },
  { value: 'overline', label: 'Overline' },
];

const TEXT_TRANSFORMS = [
  { value: 'none', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export function TypographyControl({ componentId }: TypographyControlProps) {
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

  // State for typography properties
  const [fontFamily, setFontFamily] = useState<string>(
    (component?.props.fontFamily as string) || 'sans-serif'
  );
  const [fontSize, setFontSize] = useState<number>(
    (component?.props.fontSize as number) || 16
  );
  const [fontWeight, setFontWeight] = useState<number>(
    (component?.props.fontWeight as number) || 400
  );
  const [lineHeight, setLineHeight] = useState<number>(
    (component?.props.lineHeight as number) || 1.5
  );
  const [letterSpacing, setLetterSpacing] = useState<number>(
    (component?.props.letterSpacing as number) || 0
  );
  const [textDecoration, setTextDecoration] = useState<string>(
    (component?.props.textDecoration as string) || 'none'
  );
  const [textTransform, setTextTransform] = useState<string>(
    (component?.props.textTransform as string) || 'none'
  );

  // Sync with component changes (including Custom CSS)
  useEffect(() => {
    if (!component) return;

    // 🔥 BIDIRECTIONAL SYNC: First try to extract from Custom CSS
    const customCSS = (component.props.customCSS as string) || '';
    if (customCSS) {
      const extractedTypography = extractTypographyFromCSS(customCSS);
      if (extractedTypography && Object.keys(extractedTypography).length > 0) {
        console.log('🔄 TypographyControl: Syncing from Custom CSS', extractedTypography);

        if (extractedTypography.fontFamily !== undefined) {
          setFontFamily(extractedTypography.fontFamily);
        }
        if (extractedTypography.fontSize !== undefined) {
          setFontSize(extractedTypography.fontSize);
        }
        if (extractedTypography.fontWeight !== undefined) {
          setFontWeight(Number(extractedTypography.fontWeight));
        }
        if (extractedTypography.lineHeight !== undefined) {
          setLineHeight(parseFloat(extractedTypography.lineHeight));
        }
        if (extractedTypography.letterSpacing !== undefined) {
          setLetterSpacing(extractedTypography.letterSpacing);
        }
        if (extractedTypography.textDecoration !== undefined) {
          setTextDecoration(extractedTypography.textDecoration);
        }
        if (extractedTypography.textTransform !== undefined) {
          setTextTransform(extractedTypography.textTransform);
        }
        return; // Don't override with component props if CSS is present
      }
    }

    // Fallback: Sync from component props (existing logic)
    if (component.props.fontFamily !== undefined) {
      setFontFamily(component.props.fontFamily as string);
    }
    if (component.props.fontSize !== undefined) {
      setFontSize(component.props.fontSize as number);
    }
    if (component.props.fontWeight !== undefined) {
      setFontWeight(component.props.fontWeight as number);
    }
    if (component.props.lineHeight !== undefined) {
      setLineHeight(component.props.lineHeight as number);
    }
    if (component.props.letterSpacing !== undefined) {
      setLetterSpacing(component.props.letterSpacing as number);
    }
    if (component.props.textDecoration !== undefined) {
      setTextDecoration(component.props.textDecoration as string);
    }
    if (component.props.textTransform !== undefined) {
      setTextTransform(component.props.textTransform as string);
    }
  }, [component, component?.props.customCSS]);

  // Handlers
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    updateComponentProps(componentId, { fontFamily: value });
  };

  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
    updateComponentProps(componentId, { fontSize: value });
  };

  const handleFontWeightChange = (value: number) => {
    setFontWeight(value);
    updateComponentProps(componentId, { fontWeight: value });
  };

  const handleLineHeightChange = (value: number) => {
    setLineHeight(value);
    updateComponentProps(componentId, { lineHeight: value });
  };

  const handleLetterSpacingChange = (value: number) => {
    setLetterSpacing(value);
    updateComponentProps(componentId, { letterSpacing: value });
  };

  const handleTextDecorationChange = (value: string) => {
    setTextDecoration(value);
    updateComponentProps(componentId, { textDecoration: value });
  };

  const handleTextTransformChange = (value: string) => {
    setTextTransform(value);
    updateComponentProps(componentId, { textTransform: value });
  };

  const handleReset = () => {
    const defaults = {
      fontFamily: 'sans-serif',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: 0,
      textDecoration: 'none',
      textTransform: 'none',
    };
    setFontFamily(defaults.fontFamily);
    setFontSize(defaults.fontSize);
    setFontWeight(defaults.fontWeight);
    setLineHeight(defaults.lineHeight);
    setLetterSpacing(defaults.letterSpacing);
    setTextDecoration(defaults.textDecoration);
    setTextTransform(defaults.textTransform);
    updateComponentProps(componentId, defaults);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Typography</span>
        </div>
        <button
          onClick={handleReset}
          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Font Family
        </label>
        <div className="relative">
          <select
            value={fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-8"
            style={{ fontFamily }}
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          Google Fonts are automatically loaded
        </p>
      </div>

      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700">Font Size</label>
          <span className="text-xs text-slate-600">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="8"
          max="72"
          step="1"
          value={fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>8px</span>
          <span>72px</span>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700">Font Weight</label>
          <span className="text-xs text-slate-600">
            {FONT_WEIGHTS.find((w) => w.value === fontWeight)?.label || fontWeight}
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="900"
          step="100"
          value={fontWeight}
          onChange={(e) => handleFontWeightChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>100</span>
          <span>900</span>
        </div>
      </div>

      {/* Line Height */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700">Line Height</label>
          <span className="text-xs text-slate-600">{lineHeight.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.8"
          max="3"
          step="0.1"
          value={lineHeight}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>0.8</span>
          <span>3.0</span>
        </div>
      </div>

      {/* Letter Spacing */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-700">Letter Spacing</label>
          <span className="text-xs text-slate-600">{letterSpacing.toFixed(2)}px</span>
        </div>
        <input
          type="range"
          min="-2"
          max="10"
          step="0.1"
          value={letterSpacing}
          onChange={(e) => handleLetterSpacingChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>-2px</span>
          <span>10px</span>
        </div>
      </div>

      {/* Text Decoration */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Text Decoration
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_DECORATIONS.map((decoration) => (
            <button
              key={decoration.value}
              onClick={() => handleTextDecorationChange(decoration.value)}
              className={`px-3 py-2 text-xs rounded-md border transition-all ${
                textDecoration === decoration.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ textDecoration: decoration.value }}
            >
              {decoration.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Transform */}
      <div>
        <label className="text-xs font-medium text-slate-700 mb-2 block">
          Text Transform
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_TRANSFORMS.map((transform) => (
            <button
              key={transform.value}
              onClick={() => handleTextTransformChange(transform.value)}
              className={`px-3 py-2 text-xs rounded-md border transition-all ${
                textTransform === transform.value
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              style={{ textTransform: transform.value as 'none' | 'uppercase' | 'lowercase' | 'capitalize' }}
            >
              {transform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <label className="text-xs font-medium text-slate-700 mb-2 block flex items-center gap-1">
          <AlignLeft className="w-3 h-3" />
          Live Preview
        </label>
        <div
          className="p-4 bg-slate-50 border border-slate-200 rounded-md"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            fontWeight,
            lineHeight,
            letterSpacing: `${letterSpacing}px`,
            textDecoration,
            textTransform: textTransform as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
          }}
        >
          The quick brown fox jumps over the lazy dog. 0123456789
        </div>
      </div>

      {/* Info */}
      <div className="text-[10px] text-slate-500 flex items-start gap-1 bg-blue-50 p-2 rounded">
        <Type className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>
          Typography settings apply to text content within the component. Use Custom CSS for more advanced styling.
        </span>
      </div>
    </div>
  );
}
