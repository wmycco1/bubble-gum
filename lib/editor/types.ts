// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TYPES
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Enhanced with specific component interfaces
// Enterprise-grade TypeScript types for visual editor
// ═══════════════════════════════════════════════════════════════

export type ComponentType =
  | 'Button'
  | 'Text'
  | 'Heading'
  | 'Image'
  | 'Link'
  | 'Icon'
  | 'Container'
  | 'Section'
  | 'Grid'
  | 'Card'
  | 'Input'
  | 'Textarea'
  | 'Checkbox'
  | 'Submit'
  | 'Form'
  | 'Navbar'
  | 'NavbarComponent'
  | 'Hero'
  | 'HeroComponent'
  | 'Footer'
  | 'FooterComponent'
  | 'Features'
  | 'FeaturesComponent'
  | 'CTA'
  | 'CTAComponent'
  | 'SectionComponent'
  | 'TextComponent'
  | 'ImageComponent'
  | 'ButtonComponent'
  | 'InputComponent'
  | 'FormComponent'
  | 'ContainerComponent'
  | 'GridComponent'
  | 'CardComponent'
  | 'HeadingComponent'
  | 'LinkComponent'
  | 'IconComponent'
  | 'TextareaComponent'
  | 'CheckboxComponent'
  | 'SubmitComponent';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Specific Component Props Interfaces
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Button component props */
export interface ButtonProps {
  text?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/** Text/Heading component props */
export interface TextProps {
  text?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'paragraph';
}

/** Image component props */
export interface ImageProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/** Input component props */
export interface InputProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  name?: string;
  required?: boolean;
  label?: string;
}

/** Form component props */
export interface FormProps {
  submitText?: string;
  fields?: Array<{
    name: string;
    type: string;
    label: string;
    required?: boolean;
  }>;
}

/** Section (Hero) component props */
export interface SectionProps {
  text?: string;           // Title
  subtitle?: string;       // Subtitle
  ctaText?: string;        // Call-to-action button text
  ctaLink?: string;        // Call-to-action button link
  backgroundImage?: string;
  overlay?: boolean;
}

/** Container component props */
export interface ContainerProps {
  maxWidth?: string;       // Max width (e.g., '1200px', '100%')
  padding?: string;        // Padding (e.g., '2rem', '20px')
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
}

/** Grid component props */
export interface GridProps {
  columns?: number;        // Number of columns (1-4)
  gap?: string;           // Gap between items (e.g., '1rem', '20px')
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
}

/** Card component props */
export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  href?: string;
  variant?: 'default' | 'bordered' | 'elevated';
}

/** Heading component props */
export interface HeadingProps {
  text?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  align?: 'left' | 'center' | 'right';
}

/** Link component props */
export interface LinkProps {
  text?: string;
  href?: string;
  variant?: 'default' | 'primary' | 'secondary';
  underline?: boolean;
  external?: boolean;
}

/** Icon component props */
export interface IconProps {
  icon?: string;
  size?: number;
  color?: string;
}

/** Textarea component props */
export interface TextareaProps {
  label?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  rows?: number;
}

/** Checkbox component props */
export interface CheckboxProps {
  label?: string;
  name?: string;
  required?: boolean;
  defaultChecked?: boolean;
}

/** Submit button component props */
export interface SubmitProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Responsive Breakpoints
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type Breakpoint = 'desktop' | 'tablet' | 'mobile';

export const BREAKPOINTS = {
  desktop: { min: 1024, label: 'Desktop', icon: '🖥️' },
  tablet: { min: 768, label: 'Tablet', icon: '📱' },
  mobile: { min: 0, label: 'Mobile', icon: '📱' },
} as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Style Properties (Responsive-aware)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface StyleProperties {
  // Layout
  width?: string;
  height?: string;
  minHeight?: string;

  // Spacing - Shorthand
  margin?: string;
  padding?: string;

  // Spacing - Individual sides
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Display & Flexbox
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  textAlign?: string;
  color?: string;

  // Background
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;

  // Border
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;

  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  cursor?: string;
}

/**
 * Component Style with Responsive Breakpoints
 * Desktop styles are default, tablet/mobile override as needed
 * Inheritance: mobile → tablet → desktop
 */
export interface ComponentStyle extends StyleProperties {
  // Responsive overrides (optional)
  tablet?: Partial<StyleProperties>;
  mobile?: Partial<StyleProperties>;
}

export interface ComponentProps {
  // Common props
  text?: string;
  href?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  variant?: string;
  size?: string;

  // Form props
  name?: string;
  type?: string;
  required?: boolean;

  // Custom HTML attributes
  [key: string]: unknown;
}

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  props: ComponentProps;
  style: ComponentStyle;
  children?: CanvasComponent[];
  parentId?: string;
}

export interface CanvasState {
  // Components tree
  components: CanvasComponent[];

  // Selection
  selectedComponentId: string | null;
  hoveredComponentId: string | null;

  // History (for undo/redo)
  past: CanvasComponent[][];
  future: CanvasComponent[][];

  // UI state
  isDragging: boolean;
  isResizing: boolean;

  // Viewport
  zoom: number;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
}

export interface DragItem {
  type: 'new-component' | 'existing-component';
  componentType?: ComponentType;
  componentId?: string;
}

export interface DropPosition {
  parentId: string | null;
  index: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Responsive Style Utilities
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get resolved styles for a specific breakpoint
 * Implements inheritance: mobile → tablet → desktop
 */
export function getResponsiveStyles(
  style: ComponentStyle,
  breakpoint: Breakpoint
): StyleProperties {
  const baseStyles = { ...style };
  delete baseStyles.tablet;
  delete baseStyles.mobile;

  switch (breakpoint) {
    case 'mobile':
      return {
        ...baseStyles,
        ...(style.tablet || {}),
        ...(style.mobile || {}),
      };
    case 'tablet':
      return {
        ...baseStyles,
        ...(style.tablet || {}),
      };
    case 'desktop':
    default:
      return baseStyles;
  }
}
