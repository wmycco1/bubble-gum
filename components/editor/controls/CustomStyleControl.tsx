'use client';

// ═══════════════════════════════════════════════════════════════
// CUSTOM STYLE CONTROL - CSS/Tailwind Editor with Auto-Conversion
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 1: Custom CSS/Tailwind Editor
// Features:
// - Custom CSS textarea with syntax highlighting
// - Automatic CSS → Tailwind conversion
// - Tailwind → CSS conversion
// - Toggle between CSS/Tailwind view
// - ID and className inputs
// - Real-time preview
// - Professional code editor experience
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { Code, Palette, Eye, EyeOff, RefreshCw } from 'lucide-react';
import {
  parseCSS,
  convertCSSStringToTailwind,
  tailwindToCSS,
  formatCSSObject,
} from '@/lib/utils/css-to-tailwind';

interface CustomStyleControlProps {
  componentId: string;
}

type ViewMode = 'css' | 'tailwind';

export function CustomStyleControl({ componentId }: CustomStyleControlProps) {
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

  // Local state
  const [viewMode, setViewMode] = useState<ViewMode>('css');
  const [cssInput, setCssInput] = useState('');
  const [tailwindInput, setTailwindInput] = useState('');
  const [customId, setCustomId] = useState('');
  const [customClassName, setCustomClassName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [autoConvert, setAutoConvert] = useState(true);

  // Initialize from component
  useEffect(() => {
    if (!component) return;

    // Get custom ID and className from component
    const id = (component.props.id as string) || '';
    const className = (component.props.className as string) || '';
    const customCSS = (component.props.customCSS as string) || '';
    const customTailwind = (component.props.customTailwind as string) || '';

    setCustomId(id);
    setCustomClassName(className);
    setCssInput(customCSS);
    setTailwindInput(customTailwind);
  }, [component]);

  // Handle CSS input change
  const handleCSSChange = (value: string) => {
    setCssInput(value);

    // Auto-convert to Tailwind if enabled
    if (autoConvert) {
      const tailwindClasses = convertCSSStringToTailwind(value);
      setTailwindInput(tailwindClasses);
    }

    // Update component
    if (component) {
      updateComponentProps(componentId, {
        customCSS: value,
        customTailwind: autoConvert ? convertCSSStringToTailwind(value) : tailwindInput,
      });
    }
  };

  // Handle Tailwind input change
  const handleTailwindChange = (value: string) => {
    setTailwindInput(value);

    // Auto-convert to CSS if enabled
    if (autoConvert) {
      const cssObject = tailwindToCSS(value);
      const cssString = formatCSSObject(cssObject);
      setCssInput(cssString);
    }

    // Update component
    if (component) {
      updateComponentProps(componentId, {
        customTailwind: value,
        customCSS: autoConvert ? formatCSSObject(tailwindToCSS(value)) : cssInput,
      });
    }
  };

  // Handle ID change
  const handleIdChange = (value: string) => {
    setCustomId(value);
    if (component) {
      updateComponentProps(componentId, {
        id: value || undefined,
      });
    }
  };

  // Handle className change
  const handleClassNameChange = (value: string) => {
    setCustomClassName(value);
    if (component) {
      updateComponentProps(componentId, {
        className: value || undefined,
      });
    }
  };

  // Manual convert CSS to Tailwind
  const convertToTailwind = () => {
    const tailwindClasses = convertCSSStringToTailwind(cssInput);
    setTailwindInput(tailwindClasses);
    if (component) {
      updateComponentProps(componentId, {
        customTailwind: tailwindClasses,
      });
    }
  };

  // Manual convert Tailwind to CSS
  const convertToCSS = () => {
    const cssObject = tailwindToCSS(tailwindInput);
    const cssString = formatCSSObject(cssObject);
    setCssInput(cssString);
    if (component) {
      updateComponentProps(componentId, {
        customCSS: cssString,
      });
    }
  };

  // Clear all custom styles
  const handleClear = () => {
    setCssInput('');
    setTailwindInput('');
    if (component) {
      updateComponentProps(componentId, {
        customCSS: undefined,
        customTailwind: undefined,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Custom Styling</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            {showPreview ? (
              <EyeOff className="w-3.5 h-3.5 text-slate-600" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-slate-600" />
            )}
          </button>
          {(cssInput || tailwindInput) && (
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Clear all custom styles"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ID and Class Name Inputs */}
      <div className="space-y-2">
        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">CSS ID</label>
          <input
            type="text"
            value={customId}
            onChange={(e) => handleIdChange(e.target.value)}
            placeholder="my-unique-id"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            HTML id attribute (must be unique on page)
          </p>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 mb-1 block">CSS Classes</label>
          <input
            type="text"
            value={customClassName}
            onChange={(e) => handleClassNameChange(e.target.value)}
            placeholder="my-class another-class"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Space-separated class names
          </p>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setViewMode('css')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
            viewMode === 'css'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Code className="w-3.5 h-3.5" />
            <span>CSS</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode('tailwind')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors relative ${
            viewMode === 'tailwind'
              ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>Tailwind</span>
          </div>
        </button>
      </div>

      {/* Auto-convert Toggle */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-md border border-slate-200">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-xs font-medium text-slate-700">Auto-convert</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoConvert}
            onChange={(e) => setAutoConvert(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* CSS View */}
      {viewMode === 'css' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">Custom CSS</label>
            {!autoConvert && tailwindInput && (
              <button
                onClick={convertToCSS}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Convert from Tailwind
              </button>
            )}
          </div>
          <textarea
            value={cssInput}
            onChange={(e) => handleCSSChange(e.target.value)}
            placeholder="color: #3b82f6;&#10;font-size: 16px;&#10;padding: 12px;"
            className="w-full h-40 px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
            spellCheck={false}
          />
          <p className="text-[10px] text-slate-500">
            Enter CSS properties (one per line, semicolon-separated)
          </p>
        </div>
      )}

      {/* Tailwind View */}
      {viewMode === 'tailwind' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700">Tailwind Classes</label>
            {!autoConvert && cssInput && (
              <button
                onClick={convertToTailwind}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Convert from CSS
              </button>
            )}
          </div>
          <textarea
            value={tailwindInput}
            onChange={(e) => handleTailwindChange(e.target.value)}
            placeholder="text-blue-600 text-base p-3 rounded-lg shadow-md"
            className="w-full h-40 px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y"
            spellCheck={false}
          />
          <p className="text-[10px] text-slate-500">
            Enter Tailwind utility classes (space-separated)
          </p>
        </div>
      )}

      {/* Preview */}
      {showPreview && (cssInput || tailwindInput) && (
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div className="text-[10px] text-slate-500 mb-2 font-medium">Preview:</div>
          <div className="bg-white rounded p-4 border border-slate-200">
            <div
              className={tailwindInput}
              style={parseCSS(cssInput) as React.CSSProperties}
            >
              <div className="text-sm">Preview Element</div>
              <div className="text-xs text-slate-600 mt-1">
                Custom styles applied
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-md bg-blue-50 p-3 border border-blue-200">
        <p className="text-xs text-blue-900 font-medium mb-1">💡 How it works</p>
        <ul className="text-[10px] text-blue-700 space-y-1 list-disc list-inside">
          <li>Write CSS or Tailwind classes</li>
          <li>Auto-convert converts between formats in real-time</li>
          <li>CSS properties take precedence over Tailwind</li>
          <li>Custom ID and classes are added to the HTML element</li>
          <li>Changes apply immediately on the canvas</li>
        </ul>
      </div>
    </div>
  );
}
