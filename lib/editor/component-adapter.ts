/**
 * Component Adapter
 * Converts old CanvasComponent interface to new Atomic Component props
 * God-Tier Development Protocol 2025
 *
 * Purpose: Enable seamless migration preserving ALL data
 * Preserves: props, style, custom CSS, children, positioning, everything
 */

import type { CanvasComponent } from './types';
import type { CSSProperties } from 'react';

/**
 * Default props for components when they're first added to canvas
 * Prevents empty/broken components with missing required props
 */
const DEFAULT_COMPONENT_PROPS: Record<string, Record<string, any>> = {
  // Atoms
  'Button': { text: 'Button', variant: 'primary', size: 'md' },
  'Text': { text: 'Text content', variant: 'paragraph' },
  'Heading': { text: 'Heading', level: 'h2' },
  'Image': { src: '/placeholder.svg', alt: 'Image', width: 300, height: 200 },
  'Link': { href: '#', text: 'Link' },
  'Icon': { name: 'star', size: 24 },
  'Input': { placeholder: 'Enter text...', type: 'text' },
  'Textarea': { placeholder: 'Enter text...', rows: 4 },
  'Checkbox': { label: 'Checkbox', checked: false },
  'Badge': { text: 'Badge', variant: 'default' },
  'Submit': { text: 'Submit' },

  // Molecules
  'Alert': { title: 'Alert', message: 'This is an alert message', variant: 'info' },
  'Breadcrumb': { items: [{ label: 'Home', href: '/' }, { label: 'Current' }] },
  'Modal': { title: 'Modal Title', children: 'Modal content' },
  'Progress': { value: 50, max: 100 },
  'StarRating': { rating: 4, max: 5 },
  'Toggle': { label: 'Toggle', checked: false },
  'Tooltip': { content: 'Tooltip text', children: 'Hover me' },
  'IconBox': { icon: 'star', title: 'Feature', description: 'Description' },
  'ImageBox': { src: '/placeholder.svg', alt: 'Image', caption: 'Caption' },

  // Organisms
  'Navbar': { brand: 'Brand', links: [{ label: 'Home', href: '/' }] },
  'Footer': { text: 'Footer content', links: [] },
  'Hero': { title: 'Hero Title', subtitle: 'Subtitle', cta: 'Get Started' },
  'Card': { title: 'Card Title', description: 'Card description' },
  'Form': { title: 'Form', fields: [] },
  'Accordion': { items: [{ title: 'Item 1', content: 'Content 1' }] },
  'Tabs': { tabs: [{ label: 'Tab 1', content: 'Content 1' }] },
  'Carousel': { items: [{ src: '/placeholder.svg', alt: 'Slide 1' }] },
  'Features': { title: 'Features', items: [] },
  'Testimonial': { quote: 'Great product!', author: 'John Doe' },
  'PricingTable': { plans: [] },
  'Menu': { items: [{ label: 'Item 1', href: '#' }] },

  // Templates
  'Container': { children: 'Container content' },
  'Section': { children: 'Section content' },
  'Grid': { columns: 3, children: 'Grid content' },
  'Layout': { children: 'Layout content' },
};

/**
 * Convert CanvasComponent to Atomic Component props
 *
 * Takes the old format:
 * {
 *   id: 'comp-123',
 *   type: 'ButtonComponent',
 *   props: { text: 'Click Me', variant: 'primary' },
 *   style: { backgroundColor: 'red', padding: '10px' }
 * }
 *
 * Returns atomic component props:
 * {
 *   text: 'Click Me',
 *   variant: 'primary',
 *   style: { backgroundColor: 'red', padding: '10px' },
 *   'data-canvas-id': 'comp-123'
 * }
 *
 * @param component - Old canvas component object
 * @returns Props object for atomic component
 */
export function convertCanvasComponentToProps(
  component: CanvasComponent
): Record<string, any> {
  const { id, type, props = {}, style = {}, children } = component;

  // Get default props for this component type (removes "Component" suffix if present)
  const componentType = type.replace('Component', '');
  const defaultProps = DEFAULT_COMPONENT_PROPS[componentType] || {};

  // Start with defaults, then merge original props (props win in conflicts)
  const atomicProps: Record<string, any> = {
    ...defaultProps,
    ...props,
  };

  // Preserve ALL custom styles (shadows, border-radius, positioning, etc.)
  if (style && Object.keys(style).length > 0) {
    atomicProps.style = style as CSSProperties;
  }

  // Preserve component ID for editor tracking
  atomicProps['data-canvas-id'] = id;

  // Preserve children if present
  if (children && children.length > 0) {
    atomicProps.children = children;
  }

  return atomicProps;
}

/**
 * Convert style object to CSS properties
 *
 * Ensures all custom CSS is preserved:
 * - Shadows (box-shadow, text-shadow)
 * - Border-radius (all 4 corners)
 * - Custom CSS properties
 * - Positioning (absolute, relative, etc.)
 * - Transforms, filters, etc.
 *
 * @param style - Style object from canvas component
 * @returns CSSProperties object
 */
export function convertStyleToCSSProperties(
  style: Record<string, any> | undefined
): CSSProperties {
  if (!style || Object.keys(style).length === 0) {
    return {};
  }

  // Direct pass-through - ALL styles preserved
  return style as CSSProperties;
}

/**
 * Merge canvas props with atomic component defaults
 *
 * Ensures canvas props override defaults while preserving all custom data
 *
 * @param canvasProps - Props from canvas component
 * @param defaults - Default props from atomic component
 * @returns Merged props object
 */
export function mergeCanvasPropsWithDefaults(
  canvasProps: Record<string, any>,
  defaults: Record<string, any> = {}
): Record<string, any> {
  return {
    ...defaults,
    ...canvasProps,
    // Merge styles separately to preserve both
    style: {
      ...(defaults.style || {}),
      ...(canvasProps.style || {}),
    },
  };
}

/**
 * Extract children from canvas component
 *
 * @param component - Canvas component
 * @returns Array of child components
 */
export function extractChildren(
  component: CanvasComponent
): CanvasComponent[] {
  return component.children || [];
}

/**
 * Check if component has children
 *
 * @param component - Canvas component
 * @returns true if component has children
 */
export function hasChildren(component: CanvasComponent): boolean {
  return Boolean(component.children && component.children.length > 0);
}

/**
 * Convert array of canvas components to props array
 *
 * Useful for list components (items, tabs, accordion panels, etc.)
 *
 * @param components - Array of canvas components
 * @returns Array of props objects
 */
export function convertComponentArrayToProps(
  components: CanvasComponent[]
): Record<string, any>[] {
  return components.map(convertCanvasComponentToProps);
}

/**
 * Validate canvas component structure
 *
 * @param component - Component to validate
 * @returns true if valid canvas component
 */
export function isValidCanvasComponent(
  component: any
): component is CanvasComponent {
  return (
    component &&
    typeof component === 'object' &&
    typeof component.id === 'string' &&
    typeof component.type === 'string'
  );
}

/**
 * Safe prop extraction with type checking
 *
 * @param component - Canvas component
 * @param propName - Name of prop to extract
 * @param defaultValue - Default value if prop not found
 * @returns Prop value or default
 */
export function extractPropSafely<T = any>(
  component: CanvasComponent,
  propName: string,
  defaultValue: T
): T {
  const value = component.props?.[propName];
  return value !== undefined ? (value as T) : defaultValue;
}

/**
 * Extract style property safely
 *
 * @param component - Canvas component
 * @param styleName - CSS property name
 * @param defaultValue - Default value if not found
 * @returns Style value or default
 */
export function extractStyleSafely<T = any>(
  component: CanvasComponent,
  styleName: string,
  defaultValue: T
): T {
  const value = component.style?.[styleName];
  return value !== undefined ? (value as T) : defaultValue;
}

/**
 * Convert responsive styles
 *
 * Handles breakpoint-specific styles from canvas format
 *
 * @param component - Canvas component
 * @returns Responsive styles object
 */
export function convertResponsiveStyles(
  component: CanvasComponent
): Record<string, CSSProperties> {
  const responsiveStyles: Record<string, CSSProperties> = {};

  // Check for breakpoint-specific styles in props
  if (component.props?.responsiveStyles) {
    const rs = component.props.responsiveStyles as Record<string, any>;

    // Mobile
    if (rs.mobile) {
      responsiveStyles.mobile = rs.mobile as CSSProperties;
    }

    // Tablet
    if (rs.tablet) {
      responsiveStyles.tablet = rs.tablet as CSSProperties;
    }

    // Desktop
    if (rs.desktop) {
      responsiveStyles.desktop = rs.desktop as CSSProperties;
    }
  }

  return responsiveStyles;
}

/**
 * Convert className from canvas format
 *
 * @param component - Canvas component
 * @returns className string
 */
export function extractClassName(component: CanvasComponent): string {
  return extractPropSafely(component, 'className', '');
}

/**
 * Convert data attributes
 *
 * Extracts all data-* attributes from props
 *
 * @param component - Canvas component
 * @returns Object with data attributes
 */
export function extractDataAttributes(
  component: CanvasComponent
): Record<string, string> {
  const dataAttrs: Record<string, string> = {};

  if (component.props) {
    Object.keys(component.props).forEach((key) => {
      if (key.startsWith('data-')) {
        dataAttrs[key] = String(component.props![key]);
      }
    });
  }

  return dataAttrs;
}

/**
 * Convert ARIA attributes
 *
 * Extracts all aria-* attributes from props
 *
 * @param component - Canvas component
 * @returns Object with ARIA attributes
 */
export function extractAriaAttributes(
  component: CanvasComponent
): Record<string, string> {
  const ariaAttrs: Record<string, string> = {};

  if (component.props) {
    Object.keys(component.props).forEach((key) => {
      if (key.startsWith('aria-')) {
        ariaAttrs[key] = String(component.props![key]);
      }
    });
  }

  return ariaAttrs;
}

/**
 * Full conversion with all metadata preserved
 *
 * Master conversion function that preserves EVERYTHING:
 * - All props
 * - All styles
 * - All custom CSS
 * - All data attributes
 * - All ARIA attributes
 * - Children
 * - Responsive styles
 *
 * @param component - Canvas component
 * @returns Complete atomic component props
 */
export function convertCanvasComponentFull(
  component: CanvasComponent
): Record<string, any> {
  const baseProps = convertCanvasComponentToProps(component);
  const dataAttrs = extractDataAttributes(component);
  const ariaAttrs = extractAriaAttributes(component);
  const responsiveStyles = convertResponsiveStyles(component);

  return {
    ...baseProps,
    ...dataAttrs,
    ...ariaAttrs,
    ...(Object.keys(responsiveStyles).length > 0 && { responsiveStyles }),
  };
}
