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
  | 'Container'
  | 'Section'
  | 'Grid'
  | 'Card'
  | 'Input'
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
  | 'CardComponent';

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

export interface ComponentStyle {
  // Layout
  width?: string;
  height?: string;
  minHeight?: string;
  margin?: string;
  marginBottom?: string;
  padding?: string;
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
