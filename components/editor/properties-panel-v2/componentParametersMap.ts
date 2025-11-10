/**
 * Component Parameters Mapping
 * Defines all editable parameters for each atomic component
 */

export interface ParameterDefinition {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'color' | 'select' | 'image' | 'textarea';
  label: string;
  description?: string;
  options?: string[];
  defaultValue?: any;
  required?: boolean;
  min?: number; // For number type
  max?: number; // For number type
}

export const COMPONENT_PARAMETERS: Record<string, ParameterDefinition[]> = {
  // ============================================
  // ATOMS (15 components)
  // ============================================

  Badge: [
    // Content
    { name: 'children', type: 'text', label: 'Text', required: true },

    // Visual Style
    { name: 'variant', type: 'select', label: 'Variant', options: ['default', 'primary', 'success', 'warning', 'error', 'info'] },
    { name: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'] },
    { name: 'rounded', type: 'select', label: 'Shape', options: ['pill', 'rounded', 'square'], defaultValue: 'pill' },

    // Border (Simple Modern UX)
    { name: 'borderWidth', type: 'number', label: 'Border Width', description: 'Width in pixels', min: 0 },
    { name: 'borderStyle', type: 'select', label: 'Border Style',
      options: ['none', 'solid', 'dashed', 'dotted', 'double'] },
    { name: 'borderColor', type: 'color', label: 'Border Color' },

    // Icon Settings
    { name: 'icon', type: 'text', label: 'Icon Name', description: 'e.g. star, heart, check, x' },
    { name: 'iconPosition', type: 'select', label: 'Icon Position', options: ['left', 'right'], defaultValue: 'left' },
    { name: 'dot', type: 'boolean', label: 'Show Dot Indicator' },

    // Interactive
    { name: 'clickable', type: 'boolean', label: 'Clickable' },
    { name: 'removable', type: 'boolean', label: 'Removable (Show × button)' },

    // Custom Colors
    { name: 'color', type: 'color', label: 'Text Color', description: 'Overrides variant color' },
    { name: 'backgroundColor', type: 'color', label: 'Background Color', description: 'Overrides variant' },
  ],

  Button: [
    { name: 'children', type: 'text', label: 'Button Text', required: true },
    { name: 'variant', type: 'select', label: 'Variant', options: ['primary', 'secondary', 'outline', 'ghost', 'link'] },
    { name: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg'] },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
    { name: 'fullWidth', type: 'boolean', label: 'Full Width' },
  ],

  Checkbox: [
    { name: 'label', type: 'text', label: 'Label' },
    { name: 'checked', type: 'boolean', label: 'Checked' },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
    { name: 'required', type: 'boolean', label: 'Required' },
  ],

  Divider: [
    { name: 'orientation', type: 'select', label: 'Orientation', options: ['horizontal', 'vertical'] },
    { name: 'thickness', type: 'number', label: 'Thickness (px)' },
    { name: 'color', type: 'color', label: 'Color' },
  ],

  Heading: [
    { name: 'children', type: 'text', label: 'Text', required: true },
    { name: 'level', type: 'select', label: 'Level', options: ['1', '2', '3', '4', '5', '6'] },
    { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right'] },
    { name: 'color', type: 'color', label: 'Color' },
  ],

  HTML: [
    { name: 'content', type: 'textarea', label: 'HTML Content', required: true },
    { name: 'sanitize', type: 'boolean', label: 'Sanitize HTML' },
  ],

  Icon: [
    { name: 'name', type: 'text', label: 'Icon Name', required: true },
    { name: 'size', type: 'number', label: 'Size (px)' },
    { name: 'color', type: 'color', label: 'Color' },
  ],

  Image: [
    { name: 'src', type: 'image', label: 'Image URL', required: true },
    { name: 'alt', type: 'text', label: 'Alt Text', required: true },
    { name: 'width', type: 'number', label: 'Width' },
    { name: 'height', type: 'number', label: 'Height' },
    { name: 'loading', type: 'select', label: 'Loading', options: ['lazy', 'eager'] },
  ],

  Input: [
    { name: 'type', type: 'select', label: 'Type', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
    { name: 'placeholder', type: 'text', label: 'Placeholder' },
    { name: 'value', type: 'text', label: 'Value' },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
    { name: 'required', type: 'boolean', label: 'Required' },
  ],

  Link: [
    { name: 'href', type: 'text', label: 'URL', required: true },
    { name: 'children', type: 'text', label: 'Link Text', required: true },
    { name: 'target', type: 'select', label: 'Target', options: ['_self', '_blank', '_parent', '_top'] },
    { name: 'variant', type: 'select', label: 'Variant', options: ['default', 'primary', 'secondary'] },
  ],

  Spacer: [
    { name: 'height', type: 'number', label: 'Height (px)' },
    { name: 'width', type: 'number', label: 'Width (px)' },
  ],

  Submit: [
    { name: 'children', type: 'text', label: 'Button Text', required: true },
    { name: 'variant', type: 'select', label: 'Variant', options: ['primary', 'secondary'] },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
  ],

  Text: [
    { name: 'children', type: 'text', label: 'Content', required: true },
    { name: 'size', type: 'select', label: 'Size', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    { name: 'weight', type: 'select', label: 'Weight', options: ['normal', 'medium', 'semibold', 'bold'] },
    { name: 'align', type: 'select', label: 'Alignment', options: ['left', 'center', 'right', 'justify'] },
    { name: 'color', type: 'color', label: 'Color' },
  ],

  Textarea: [
    { name: 'placeholder', type: 'text', label: 'Placeholder' },
    { name: 'rows', type: 'number', label: 'Rows' },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
    { name: 'required', type: 'boolean', label: 'Required' },
  ],

  Video: [
    { name: 'src', type: 'text', label: 'Video URL', required: true },
    { name: 'poster', type: 'image', label: 'Poster Image' },
    { name: 'controls', type: 'boolean', label: 'Show Controls' },
    { name: 'autoplay', type: 'boolean', label: 'Autoplay' },
    { name: 'loop', type: 'boolean', label: 'Loop' },
    { name: 'muted', type: 'boolean', label: 'Muted' },
  ],

  // ============================================
  // MOLECULES (11 components) - Simplified
  // ============================================

  Alert: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'message', type: 'text', label: 'Message', required: true },
    { name: 'variant', type: 'select', label: 'Variant', options: ['info', 'success', 'warning', 'error'] },
    { name: 'dismissible', type: 'boolean', label: 'Dismissible' },
  ],

  Modal: [
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'isOpen', type: 'boolean', label: 'Open' },
    { name: 'size', type: 'select', label: 'Size', options: ['sm', 'md', 'lg', 'xl'] },
  ],

  Progress: [
    { name: 'value', type: 'number', label: 'Progress (0-100)' },
    { name: 'variant', type: 'select', label: 'Variant', options: ['default', 'success', 'warning', 'error'] },
    { name: 'showLabel', type: 'boolean', label: 'Show Label' },
  ],

  Toggle: [
    { name: 'label', type: 'text', label: 'Label' },
    { name: 'checked', type: 'boolean', label: 'Checked' },
    { name: 'disabled', type: 'boolean', label: 'Disabled' },
  ],

  // ============================================
  // ORGANISMS (Major ones) - Simplified
  // ============================================

  Hero: [
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'subtitle', type: 'text', label: 'Subtitle' },
    { name: 'backgroundImage', type: 'image', label: 'Background Image' },
    { name: 'ctaText', type: 'text', label: 'CTA Button Text' },
    { name: 'ctaLink', type: 'text', label: 'CTA Link' },
  ],

  Banner: [
    { name: 'title', type: 'text', label: 'Title', required: true },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'backgroundImage', type: 'image', label: 'Background' },
    { name: 'overlay', type: 'boolean', label: 'Dark Overlay' },
  ],

  Card: [
    { name: 'title', type: 'text', label: 'Title' },
    { name: 'description', type: 'text', label: 'Description' },
    { name: 'image', type: 'image', label: 'Image' },
    { name: 'variant', type: 'select', label: 'Variant', options: ['default', 'outlined', 'elevated'] },
  ],

  Form: [
    { name: 'title', type: 'text', label: 'Form Title' },
    { name: 'submitText', type: 'text', label: 'Submit Button Text' },
    { name: 'action', type: 'text', label: 'Form Action URL' },
  ],

  // ============================================
  // TEMPLATES (5 components)
  // ============================================

  Container: [
    { name: 'maxWidth', type: 'select', label: 'Max Width', options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'] },
    { name: 'padding', type: 'select', label: 'Padding', options: ['none', 'sm', 'md', 'lg'] },
  ],

  Section: [
    { name: 'padding', type: 'select', label: 'Padding', options: ['none', 'sm', 'md', 'lg', 'xl'] },
    { name: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],

  Grid: [
    { name: 'columns', type: 'number', label: 'Columns' },
    { name: 'gap', type: 'select', label: 'Gap', options: ['none', 'sm', 'md', 'lg'] },
  ],

  Layout: [
    { name: 'variant', type: 'select', label: 'Layout Type', options: ['default', 'sidebar', 'split'] },
  ],
};

// Common parameters for ALL components
export const COMMON_PARAMETERS: ParameterDefinition[] = [
  { name: 'id', type: 'text', label: 'ID', description: 'Unique identifier' },
  { name: 'className', type: 'text', label: 'CSS Classes', description: 'Custom CSS classes' },
  { name: 'aria-label', type: 'text', label: 'ARIA Label', description: 'Accessibility label' },
];
