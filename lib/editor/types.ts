// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR TYPES
// ═══════════════════════════════════════════════════════════════
// Version: 4.0.0 - M2: New Interactive Components
// Changes (v4.0.0):
// - Added 11 new component types (Accordion, Tabs, Counter, etc.)
// - Added prop interfaces for all new components
// Previous (v3.0.0):
// - Added individual border-radius properties (4 corners)
// - Added gradient support (backgroundImage)
// - Added filter and backdrop-filter
// - Added individual border properties (width, color, style per side)
// - Added transform individual properties
// - Enterprise-grade TypeScript types for visual editor
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
  | 'SubmitComponent'
  // M2: New Interactive Components
  | 'Accordion'
  | 'AccordionComponent'
  | 'Tabs'
  | 'TabsComponent'
  | 'Counter'
  | 'CounterComponent'
  | 'Progress'
  | 'ProgressComponent'
  | 'Tooltip'
  | 'TooltipComponent'
  | 'Modal'
  | 'ModalComponent'
  | 'Alert'
  | 'AlertComponent'
  | 'Badge'
  | 'BadgeComponent'
  | 'Breadcrumb'
  | 'BreadcrumbComponent'
  | 'Divider'
  | 'DividerComponent'
  | 'Carousel'
  | 'CarouselComponent';

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

  // Border - Shorthand
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  borderStyle?: string;

  // Border - Individual corners (NEW!)
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // Border - Individual sides width
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;

  // Border - Individual sides color
  borderTopColor?: string;
  borderRightColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;

  // Border - Individual sides style
  borderTopStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderRightStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';

  // Background - Extended (NEW!)
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundBlendMode?: string;

  // Effects - Extended (NEW!)
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  cursor?: string;
  filter?: string;              // 'blur(5px) brightness(1.2) contrast(1.1)'
  backdropFilter?: string;      // Same as filter, for backdrop
  mixBlendMode?: string;        // 'normal' | 'multiply' | 'screen' | 'overlay' etc.

  // Transform - Individual properties (NEW!)
  rotate?: string;              // '45deg'
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  scale?: string;               // '1.5'
  scaleX?: string;
  scaleY?: string;
  skewX?: string;               // '10deg'
  skewY?: string;
  translateX?: string;          // '100px'
  translateY?: string;

  // Typography - Extended (NEW!)
  letterSpacing?: string;
  textTransform?: string;       // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  textDecoration?: string;
  textShadow?: string;
  wordSpacing?: string;
  whiteSpace?: string;

  // Layout - Extended (NEW!)
  minWidth?: string;
  maxWidth?: string;
  maxHeight?: string;
  overflow?: string;
  overflowX?: string;
  overflowY?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;

  // Flexbox/Grid - Extended (NEW!)
  flexWrap?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  alignSelf?: string;
  justifySelf?: string;
  order?: string;

  // Interaction (NEW!)
  pointerEvents?: string;
  userSelect?: string;
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

  // Custom styling (PHASE 1: Custom CSS/Tailwind Editor)
  id?: string;
  className?: string;
  customCSS?: string;
  customTailwind?: string;

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// M2: New Interactive Components Props
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Accordion component props */
export interface AccordionProps {
  items?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'filled';
  iconType?: 'chevron' | 'plus-minus';
}

/** Tabs component props */
export interface TabsProps {
  tabs?: Array<{
    id: string;
    label: string;
    content: string;
    icon?: string;
  }>;
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  closable?: boolean;
}

/** Counter component props */
export interface CounterProps {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
}

/** Progress component props */
export interface ProgressProps {
  value?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
}

/** Tooltip component props */
export interface TooltipProps {
  text?: string;
  content?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
}

/** Modal component props */
export interface ModalProps {
  title?: string;
  content?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeButton?: boolean;
  backdrop?: boolean | 'static';
  centered?: boolean;
}

/** Alert component props */
export interface AlertProps {
  title?: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
}

/** Badge component props */
export interface BadgeProps {
  text?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}

/** Breadcrumb component props */
export interface BreadcrumbProps {
  items?: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
  separator?: string | 'slash' | 'chevron' | 'arrow';
}

/** Divider component props */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  spacing?: string;
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}

/** Carousel component props */
export interface CarouselProps {
  slides?: Array<{
    id: string;
    image: string;
    title?: string;
    description?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
}
