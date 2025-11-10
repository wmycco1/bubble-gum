'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - COMPONENT PALETTE V5.0.0 (ATOMIC DESIGN)
// ═══════════════════════════════════════════════════════════════
// Version: 5.0.0 - Atomic Design System
// Changes:
// - REMOVED old component categories (Layout, Content, Forms, etc.)
// - NEW: 5 tabs based on Atomic Design (Atoms, Molecules, Organisms, Templates, Pages)
// - Direct import from atomic component barrel exports
// - Drag and drop support for all atomic components
// - Search functionality across all categories
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Search, X } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

// Import all atomic components to get their names
import * as Atoms from '../../src/components/atoms';
import * as Molecules from '../../src/components/molecules';
import * as Organisms from '../../src/components/organisms';
import * as Templates from '../../src/components/templates';

// Import parameter definitions to generate default props
import { COMPONENT_PARAMETERS } from './properties-panel-v2/componentParametersMap';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Atomic Component Registry
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type AtomicCategory = 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';

interface ComponentItem {
  name: string;
  icon: string;
  description: string;
}

// Get component names from barrel exports
const atomComponents = Object.keys(Atoms);
const moleculeComponents = Object.keys(Molecules);
const organismComponents = Object.keys(Organisms);
const templateComponents = Object.keys(Templates);

// Icon mapping for components
const componentIcons: Record<string, string> = {
  // Atoms
  Badge: '🏷️',
  Button: '🔘',
  Checkbox: '☑️',
  Divider: '➖',
  Heading: '📄',
  HTML: '🔧',
  Icon: '⭐',
  Image: '🖼️',
  Input: '✏️',
  Link: '🔗',
  Spacer: '↕️',
  Submit: '📤',
  Text: '📝',
  Textarea: '📝',
  Video: '🎥',

  // Molecules
  Alert: '🚨',
  Breadcrumb: '🗺️',
  Counter: '🔢',
  IconBox: '💎',
  IconList: '📋',
  ImageBox: '🖼️',
  Modal: '🪟',
  Progress: '📊',
  StarRating: '⭐',
  Toggle: '🔄',
  Tooltip: '💬',

  // Organisms
  Accordion: '🎵',
  AddToCart: '🛒',
  Banner: '🎪',
  BannerSlider: '🎠',
  Card: '🃏',
  Carousel: '🎠',
  CMSBlock: '📄',
  CMSPage: '📄',
  CTA: '📣',
  FacebookContent: '📘',
  FacebookLike: '👍',
  Features: '✨',
  Footer: '👣',
  Form: '📋',
  FormBuilder: '🏗️',
  GoogleMaps: '🗺️',
  Hero: '🎭',
  InnerSection: '🔳',
  Menu: '🍔',
  MultistepFormBuilder: '🪜',
  Navbar: '🧭',
  NewProducts: '🆕',
  OrdersAndReturns: '📦',
  PricingTable: '💰',
  ProductList: '📦',
  ProductSlider: '🛍️',
  RecentlyCompared: '⚖️',
  RecentlyViewed: '👁️',
  Slider: '🎠',
  SocialIcons: '📱',
  SoundCloud: '🔊',
  Tabs: '📑',
  Testimonial: '💬',
  TextEditor: '✍️',

  // Templates
  Container: '📦',
  Grid: '🔲',
  Layout: '🏗️',
  Section: '📐',
};

// Description mapping
const componentDescriptions: Record<string, string> = {
  // Atoms
  Badge: 'Status or label badge',
  Button: 'Clickable button',
  Checkbox: 'Checkbox with label',
  Divider: 'Content separator',
  Heading: 'Heading (h1-h6)',
  HTML: 'Custom HTML block',
  Icon: 'Icon component',
  Image: 'Image with alt text',
  Input: 'Text input field',
  Link: 'Hyperlink',
  Spacer: 'Vertical spacing',
  Submit: 'Submit button',
  Text: 'Text paragraph',
  Textarea: 'Multi-line text input',
  Video: 'Video player',

  // Molecules
  Alert: 'Alert message',
  Breadcrumb: 'Navigation trail',
  Counter: 'Numeric counter',
  IconBox: 'Icon with text',
  IconList: 'List with icons',
  ImageBox: 'Image with caption',
  Modal: 'Modal dialog',
  Progress: 'Progress bar',
  StarRating: 'Star rating',
  Toggle: 'Toggle switch',
  Tooltip: 'Tooltip',

  // Organisms
  Accordion: 'Collapsible panels',
  AddToCart: 'Add to cart button',
  Banner: 'Hero banner',
  BannerSlider: 'Banner carousel',
  Card: 'Content card',
  Carousel: 'Image carousel',
  CMSBlock: 'CMS content block',
  CMSPage: 'CMS page',
  CTA: 'Call to action',
  FacebookContent: 'Facebook embed',
  FacebookLike: 'Facebook like button',
  Features: 'Features section',
  Footer: 'Page footer',
  Form: 'Contact form',
  FormBuilder: 'Form builder',
  GoogleMaps: 'Google Maps embed',
  Hero: 'Hero section',
  InnerSection: 'Inner section',
  Menu: 'Navigation menu',
  MultistepFormBuilder: 'Multi-step form',
  Navbar: 'Navigation bar',
  NewProducts: 'New products',
  OrdersAndReturns: 'Orders & returns',
  PricingTable: 'Pricing table',
  ProductList: 'Product list',
  ProductSlider: 'Product slider',
  RecentlyCompared: 'Recently compared',
  RecentlyViewed: 'Recently viewed',
  Slider: 'Content slider',
  SocialIcons: 'Social media icons',
  SoundCloud: 'SoundCloud embed',
  Tabs: 'Tabbed content',
  Testimonial: 'Testimonial',
  TextEditor: 'Rich text editor',

  // Templates
  Container: 'Content container',
  Grid: 'Grid layout',
  Layout: 'Page layout',
  Section: 'Page section',
};

const COMPONENT_REGISTRY: Record<AtomicCategory, string[]> = {
  atoms: atomComponents,
  molecules: moleculeComponents,
  organisms: organismComponents,
  templates: templateComponents,
  pages: [], // Pages will be added later
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Generate Default Props for Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function generateDefaultProps(componentName: string): Record<string, any> {
  const paramDefs = COMPONENT_PARAMETERS[componentName];

  if (!paramDefs) {
    // Fallback for components without parameter definitions
    return {
      children: componentName,
    };
  }

  const defaultProps: Record<string, any> = {};

  paramDefs.forEach((param) => {
    // Use defaultValue if provided
    if (param.defaultValue !== undefined) {
      defaultProps[param.name] = param.defaultValue;
      return;
    }

    // Generate sensible defaults based on type
    switch (param.type) {
      case 'text':
      case 'textarea':
        if (param.name === 'children' || param.name === 'title' || param.name === 'label') {
          defaultProps[param.name] = componentName;
        } else if (param.name === 'placeholder') {
          defaultProps[param.name] = `Enter ${param.label.toLowerCase()}...`;
        } else if (param.name === 'value' && (componentName === 'Input' || componentName === 'Textarea')) {
          // Use defaultValue instead of value for inputs in editor (no onChange)
          defaultProps['defaultValue'] = '';
        } else if (param.required) {
          defaultProps[param.name] = `Sample ${param.label}`;
        }
        break;

      case 'number':
        if (param.name === 'width' || param.name === 'height') {
          defaultProps[param.name] = 300;
        } else if (param.name === 'level') {
          defaultProps[param.name] = '2'; // h2 by default
        } else if (param.name === 'rows') {
          defaultProps[param.name] = 4;
        } else if (param.required) {
          defaultProps[param.name] = 0;
        }
        break;

      case 'boolean':
        // Use defaultChecked instead of checked for checkboxes in editor (no onChange)
        if (param.name === 'checked' && componentName === 'Checkbox') {
          defaultProps['defaultChecked'] = false;
        } else {
          defaultProps[param.name] = false;
        }
        break;

      case 'color':
        defaultProps[param.name] = '#3b82f6'; // blue-500
        break;

      case 'select':
        if (param.options && param.options.length > 0) {
          defaultProps[param.name] = param.options[0];
        }
        break;

      case 'image':
        if (param.name === 'src' || param.name === 'backgroundImage') {
          defaultProps[param.name] = 'https://via.placeholder.com/800x600?text=Image';
        }
        if (param.name === 'alt' && param.required) {
          defaultProps[param.name] = componentName + ' image';
        }
        break;
    }
  });

  // Ensure children exists if not set
  if (!defaultProps.children && !defaultProps.content && !defaultProps.title) {
    defaultProps.children = componentName;
  }

  // Add required function props for specific components
  if (componentName === 'Modal' && !defaultProps.onClose) {
    defaultProps.onClose = () => {}; // noop function for editor
    defaultProps.isOpen = true; // Show modal by default in editor
  }

  return defaultProps;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Draggable Component Item
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface DraggableComponentProps {
  componentName: string;
  icon: string;
  label: string;
  description: string;
}

function DraggableComponent({ componentName, icon, label, description }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette-${componentName}`,
    data: {
      type: componentName,
      fromPalette: true,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const addComponent = useCanvasStore((state) => state.addComponent);

  const handleClick = () => {
    logger.info('🎨 Adding component from palette', { type: componentName });

    // Generate default props from parameter definitions
    const defaultProps = generateDefaultProps(componentName);

    logger.debug('Generated default props', { componentName, defaultProps });

    addComponent({
      type: componentName as any,
      props: defaultProps,
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className="group relative flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500 truncate">{description}</div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component Palette
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ComponentPalette() {
  const [activeTab, setActiveTab] = useState<AtomicCategory>('atoms');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    const components = COMPONENT_REGISTRY[activeTab];

    if (!searchQuery.trim()) {
      return components;
    }

    const query = searchQuery.toLowerCase();
    return components.filter((name) =>
      name.toLowerCase().includes(query) ||
      (componentDescriptions[name] || '').toLowerCase().includes(query)
    );
  }, [activeTab, searchQuery]);

  const tabs: { key: AtomicCategory; label: string; count: number }[] = [
    { key: 'atoms', label: 'Atoms', count: atomComponents.length },
    { key: 'molecules', label: 'Molecules', count: moleculeComponents.length },
    { key: 'organisms', label: 'Organisms', count: organismComponents.length },
    { key: 'templates', label: 'Templates', count: templateComponents.length },
    { key: 'pages', label: 'Pages', count: 0 },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 flex border-b border-gray-200 bg-white overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
              ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-75">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((componentName) => (
              <DraggableComponent
                key={componentName}
                componentName={componentName}
                icon={componentIcons[componentName] || '🔷'}
                label={componentName}
                description={componentDescriptions[componentName] || 'Component'}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-sm">No components found</div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
}
