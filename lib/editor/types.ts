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
  | 'CarouselComponent'
  // M3: Extended Component Library (God-Tier 2025)
  // Layout
  | 'InnerSection'
  | 'InnerSectionComponent'
  | 'Spacer'
  | 'SpacerComponent'
  // Content
  | 'Banner'
  | 'BannerComponent'
  | 'HTML'
  | 'HTMLComponent'
  | 'Video'
  | 'VideoComponent'
  | 'TextEditor'
  | 'TextEditorComponent'
  | 'IconBox'
  | 'IconBoxComponent'
  | 'ImageBox'
  | 'ImageBoxComponent'
  | 'IconList'
  | 'IconListComponent'
  // Integrations
  | 'GoogleMaps'
  | 'GoogleMapsComponent'
  | 'SoundCloud'
  | 'SoundCloudComponent'
  | 'SocialIcons'
  | 'SocialIconsComponent'
  | 'FacebookLike'
  | 'FacebookLikeComponent'
  | 'FacebookContent'
  | 'FacebookContentComponent'
  // Sliders
  | 'BannerSlider'
  | 'BannerSliderComponent'
  | 'Slider'
  | 'SliderComponent'
  | 'Toggle'
  | 'ToggleComponent'
  // Reviews
  | 'Testimonial'
  | 'TestimonialComponent'
  | 'StarRating'
  | 'StarRatingComponent'
  // Navigation
  | 'Menu'
  | 'MenuComponent'
  // E-commerce
  | 'ProductList'
  | 'ProductListComponent'
  | 'ProductSlider'
  | 'ProductSliderComponent'
  | 'AddToCart'
  | 'AddToCartComponent'
  | 'PricingTable'
  | 'PricingTableComponent'
  | 'RecentlyViewed'
  | 'RecentlyViewedComponent'
  | 'RecentlyCompared'
  | 'RecentlyComparedComponent'
  | 'NewProducts'
  | 'NewProductsComponent'
  // Forms
  | 'FormBuilder'
  | 'FormBuilderComponent'
  | 'MultistepFormBuilder'
  | 'MultistepFormBuilderComponent'
  // CMS
  | 'CMSBlock'
  | 'CMSBlockComponent'
  | 'CMSPage'
  | 'CMSPageComponent'
  | 'OrdersAndReturns'
  | 'OrdersAndReturnsComponent';

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GRANULAR STYLES SYSTEM (God-Tier 2025)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Allows styling individual elements within complex components
// Example: PricingTable → title, price, description, button separately
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Granular styles for individual elements within a component
 * Each property is optional and can target specific sub-elements
 */
export interface ComponentStyles {
  // Wrapper/Container level (applies to whole component)
  wrapper?: React.CSSProperties;

  // Common text elements
  title?: React.CSSProperties;         // Main heading
  subtitle?: React.CSSProperties;      // Secondary heading
  description?: React.CSSProperties;   // Body text/paragraph
  label?: React.CSSProperties;         // Form labels, badges

  // Interactive elements
  button?: React.CSSProperties;        // CTA buttons, action buttons
  link?: React.CSSProperties;          // Links, anchors

  // Media elements
  image?: React.CSSProperties;         // Images
  icon?: React.CSSProperties;          // Icons, SVGs
  video?: React.CSSProperties;         // Video containers

  // Specialized elements (component-specific)
  price?: React.CSSProperties;         // Pricing (PricingTable, Products)
  badge?: React.CSSProperties;         // Badges (highlighted tier, new product)
  feature?: React.CSSProperties;       // Feature list items
  card?: React.CSSProperties;          // Card containers (PricingTable tiers)
  header?: React.CSSProperties;        // Section headers
  footer?: React.CSSProperties;        // Section footers

  // Form elements
  input?: React.CSSProperties;         // Input fields
  textarea?: React.CSSProperties;      // Text areas
  checkbox?: React.CSSProperties;      // Checkboxes/radios

  // Allow custom element targeting
  [key: string]: React.CSSProperties | undefined;
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

  // Typography (PHASE 3: Typography Controls)
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textDecoration?: string;
  textTransform?: string;

  // Advanced Properties (PHASE 4: Transitions, Filters, Hover States)
  transitionDuration?: number;
  transitionTiming?: string;
  transitionDelay?: number;
  filterBlur?: number;
  filterBrightness?: number;
  filterContrast?: number;
  filterGrayscale?: number;
  filterHueRotate?: number;
  filterInvert?: number;
  filterSaturate?: number;
  filterSepia?: number;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  hoverScale?: number;
  overflow?: string;
  cursor?: string;

  // ═══════════════════════════════════════════════════════════════
  // NEW: GRANULAR STYLES (God-Tier 2025)
  // ═══════════════════════════════════════════════════════════════
  /**
   * Granular styles for individual elements within the component
   * Allows styling title, subtitle, button, price, etc. separately
   */
  styles?: ComponentStyles;

  /**
   * Visibility control (display: none vs visibility: hidden)
   */
  visibility?: 'visible' | 'hidden';

  /**
   * Display mode control
   */
  display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'inline-flex' | 'none';

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Visual Editing Modes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Visual editing mode for canvas components
 * Controls which visual handles are shown when component is selected
 *
 * SOLVING: Border radius handles, spacing handles, and transform handles
 * were overlapping in corners causing poor UX. Solution: contextual modes.
 *
 * Inspired by Figma/Webflow - one mode active at a time for clean UI
 *
 * @example
 * - 'none' → Only selection bounds + toolbar (default)
 * - 'spacing' → M/P buttons + spacing handles (margin/padding)
 * - 'borderRadius' → Corner handles for border-radius
 * - 'transform' → Rotation/scale handles (future)
 */
export type EditingMode = 'none' | 'spacing' | 'borderRadius' | 'transform';

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

  // ═══════════════════════════════════════════════════════════════
  // NEW: EDITOR MODE (God-Tier 2025)
  // ═══════════════════════════════════════════════════════════════
  /**
   * Editor mode: simple (inline editing) or advanced (full properties panel)
   * Simple: contentEditable text, quick actions, no properties panel
   * Advanced: full control, properties panel, granular styling
   */
  editorMode: 'simple' | 'advanced';

  /**
   * Visual editing mode for canvas (NEW!)
   * Controls which visual handles are displayed when component is selected
   * Prevents overlapping handles (spacing vs border-radius vs transform)
   *
   * User toggles via ComponentToolbar buttons
   */
  visualEditingMode: EditingMode;
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// M3: Extended Component Library Props (God-Tier 2025)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ───────────────────────────────────────────────────────────────
// Layout Components
// ───────────────────────────────────────────────────────────────

/** InnerSection component props - Nested layout container */
export interface InnerSectionProps {
  maxWidth?: string;
  padding?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  borderRadius?: string;
  boxShadow?: string;
  minHeight?: string;
}

/** Spacer component props - Empty space / divider */
export interface SpacerProps {
  height?: string;
  backgroundColor?: string;
  showDivider?: boolean;
  dividerStyle?: 'solid' | 'dashed' | 'dotted';
  dividerColor?: string;
  dividerThickness?: number;
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
}

// ───────────────────────────────────────────────────────────────
// Content Components
// ───────────────────────────────────────────────────────────────

/** Banner component props - Hero-style banner with CTA */
export interface BannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayColor?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaVariant?: 'primary' | 'secondary' | 'outline';
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  textAlign?: 'left' | 'center' | 'right';
  height?: string;
  parallax?: boolean;
  showArrow?: boolean;
}

/** HTML component props - Custom HTML rendering */
export interface HTMLProps {
  content?: string;
  sanitize?: boolean;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

/** Video component props - Video player embed */
export interface VideoProps {
  url?: string;
  provider?: 'youtube' | 'vimeo' | 'html5';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showThumbnail?: boolean;
  thumbnail?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  startTime?: number;
  endTime?: number;
  showCaptions?: boolean;
}

/** TextEditor component props - Rich text WYSIWYG editor */
export interface TextEditorProps {
  content?: string;
  placeholder?: string;
  toolbar?: boolean;
  toolbarOptions?: string[];
  maxLength?: number;
  showWordCount?: boolean;
}

/** IconBox component props - Icon with heading and description */
export interface IconBoxProps {
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  heading?: string;
  description?: string;
  link?: string;
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  alignment?: 'left' | 'center' | 'right';
  iconPosition?: 'top' | 'left' | 'right';
  hoverEffect?: boolean;
}

/** ImageBox component props - Image with caption and description */
export interface ImageBoxProps {
  image?: string;
  alt?: string;
  caption?: string;
  description?: string;
  link?: string;
  openLightbox?: boolean;
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  showOverlay?: boolean;
  overlayContent?: string;
  hoverZoom?: boolean;
}

/** IconList component props - List with icons */
export interface IconListProps {
  items?: Array<{
    id: string;
    icon?: string;
    text: string;
    subtext?: string;
  }>;
  iconColor?: string;
  iconSize?: number;
  spacing?: 'compact' | 'normal' | 'relaxed';
  variant?: 'checkmarks' | 'custom' | 'bullets';
}

// ───────────────────────────────────────────────────────────────
// Integration Components
// ───────────────────────────────────────────────────────────────

/** GoogleMaps component props - Embedded Google Maps */
export interface GoogleMapsProps {
  apiKey?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title?: string;
    description?: string;
  }>;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  height?: string;
  showControls?: boolean;
  draggable?: boolean;
  scrollwheel?: boolean;
  customStyle?: string;
}

/** SoundCloud component props - SoundCloud audio embed */
export interface SoundCloudProps {
  url?: string;
  autoPlay?: boolean;
  hideRelated?: boolean;
  showComments?: boolean;
  showUser?: boolean;
  showReposts?: boolean;
  visual?: boolean;
  color?: string;
}

/** SocialIcons component props - Social media icon grid */
export interface SocialIconsProps {
  icons?: Array<{
    id: string;
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'github' | 'custom';
    url: string;
    customIcon?: string;
  }>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'filled' | 'outline' | 'minimal';
  shape?: 'square' | 'rounded' | 'circle';
  spacing?: string;
  color?: string;
  hoverEffect?: boolean;
  openInNewTab?: boolean;
}

/** FacebookLike component props - Facebook Like button */
export interface FacebookLikeProps {
  url?: string;
  layout?: 'standard' | 'button_count' | 'button' | 'box_count';
  action?: 'like' | 'recommend';
  size?: 'small' | 'large';
  showShare?: boolean;
  showFaces?: boolean;
  colorScheme?: 'light' | 'dark';
}

/** FacebookContent component props - Embed Facebook posts/videos */
export interface FacebookContentProps {
  url?: string;
  type?: 'post' | 'video' | 'page';
  width?: string;
  showText?: boolean;
  adaptContainerWidth?: boolean;
}

// ───────────────────────────────────────────────────────────────
// Slider Components
// ───────────────────────────────────────────────────────────────

/** BannerSlider component props - Full-width hero slider */
export interface BannerSliderProps {
  slides?: Array<{
    id: string;
    image: string;
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    textAlign?: 'left' | 'center' | 'right';
    overlay?: boolean;
    overlayOpacity?: number;
  }>;
  autoPlay?: boolean;
  interval?: number;
  transition?: 'fade' | 'slide' | 'zoom';
  transitionDuration?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  showThumbnails?: boolean;
  pauseOnHover?: boolean;
  loop?: boolean;
  height?: string;
}

/** Slider component props - Universal content slider */
export interface SliderProps {
  items?: Array<{
    id: string;
    content: string;
    image?: string;
    title?: string;
  }>;
  itemsPerView?: number;
  spaceBetween?: number;
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  showControls?: boolean;
  showPagination?: boolean;
  centeredSlides?: boolean;
  freeMode?: boolean;
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

/** Toggle component props - Accordion alternative with slide animation */
export interface ToggleProps {
  items?: Array<{
    id: string;
    trigger: string;
    content: string;
  }>;
  defaultOpen?: string[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'filled';
  animated?: boolean;
  iconPosition?: 'left' | 'right';
}

// ───────────────────────────────────────────────────────────────
// Review Components
// ───────────────────────────────────────────────────────────────

/** Testimonial component props - Customer testimonial */
export interface TestimonialProps {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  showRating?: boolean;
  variant?: 'default' | 'card' | 'minimal' | 'quote-style';
  alignment?: 'left' | 'center' | 'right';
}

/** StarRating component props - Star rating display/input */
export interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  emptyColor?: string;
  interactive?: boolean;
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  halfStars?: boolean;
}

// ───────────────────────────────────────────────────────────────
// Navigation Components
// ───────────────────────────────────────────────────────────────

/** Menu component props - Multi-level navigation menu */
export interface MenuProps {
  items?: Array<{
    id: string;
    label: string;
    href?: string;
    icon?: string;
    children?: Array<{
      id: string;
      label: string;
      href?: string;
      icon?: string;
    }>;
  }>;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'mega';
  mobileBreakpoint?: number;
  sticky?: boolean;
  showIcons?: boolean;
  highlightActive?: boolean;
  dropdownAnimation?: 'fade' | 'slide' | 'none';
}

// ───────────────────────────────────────────────────────────────
// E-commerce Components
// ───────────────────────────────────────────────────────────────

/** ProductList component props - Product grid/list view */
export interface ProductListProps {
  products?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    rating?: number;
    badge?: string;
    inStock?: boolean;
  }>;
  layout?: 'grid' | 'list';
  columns?: number;
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  showCompare?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
  sortOptions?: string[];
  filterOptions?: string[];
}

/** ProductSlider component props - Product carousel */
export interface ProductSliderProps {
  products?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image: string;
    rating?: number;
    badge?: string;
  }>;
  itemsPerView?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  showAddToCart?: boolean;
  loop?: boolean;
}

/** AddToCart component props - Add to cart button with options */
export interface AddToCartProps {
  productId?: string;
  variant?: 'button' | 'icon' | 'button-icon';
  size?: 'sm' | 'md' | 'lg';
  showQuantity?: boolean;
  showVariants?: boolean;
  variants?: Array<{
    id: string;
    name: string;
    options: string[];
  }>;
  buttonText?: string;
  successMessage?: string;
  animateOnAdd?: boolean;
}

/** PricingTable component props - Pricing comparison table */
export interface PricingTableProps {
  plans?: Array<{
    id: string;
    name: string;
    price: number;
    currency?: string;
    period?: string;
    description?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
    ctaLink?: string;
    badge?: string;
  }>;
  columns?: number;
  showMostPopular?: boolean;
  variant?: 'default' | 'bordered' | 'cards';
  billingToggle?: boolean;
}

/** RecentlyViewed component props - Recently viewed products */
export interface RecentlyViewedProps {
  maxItems?: number;
  itemsPerView?: number;
  layout?: 'grid' | 'slider';
  showAddToCart?: boolean;
  title?: string;
  emptyMessage?: string;
}

/** RecentlyCompared component props - Product comparison widget */
export interface RecentlyComparedProps {
  maxItems?: number;
  showDifferencesOnly?: boolean;
  attributes?: string[];
  title?: string;
  emptyMessage?: string;
}

/** NewProducts component props - Latest products showcase */
export interface NewProductsProps {
  maxItems?: number;
  layout?: 'grid' | 'slider';
  columns?: number;
  showBadge?: boolean;
  badgeText?: string;
  daysThreshold?: number;
  showAddToCart?: boolean;
  sortBy?: 'date' | 'popularity' | 'price';
}

// ───────────────────────────────────────────────────────────────
// Form Components
// ───────────────────────────────────────────────────────────────

/** FormBuilder component props - Dynamic form builder */
export interface FormBuilderProps {
  fields?: Array<{
    id: string;
    type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
    label: string;
    placeholder?: string;
    required?: boolean;
    validation?: string;
    options?: string[];
    conditional?: {
      field: string;
      value: string;
    };
  }>;
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  showLabels?: boolean;
  labelPosition?: 'top' | 'left' | 'inside';
  layout?: 'vertical' | 'horizontal' | 'inline';
  fieldSpacing?: string;
  autoSave?: boolean;
  captcha?: boolean;
}

/** MultistepFormBuilder component props - Multi-step wizard form */
export interface MultistepFormBuilderProps {
  steps?: Array<{
    id: string;
    title: string;
    description?: string;
    fields: Array<{
      id: string;
      type: string;
      label: string;
      required?: boolean;
    }>;
  }>;
  showProgress?: boolean;
  progressStyle?: 'bar' | 'steps' | 'dots';
  allowBack?: boolean;
  saveProgress?: boolean;
  submitText?: string;
  backText?: string;
  nextText?: string;
  validateOnStep?: boolean;
}

// ───────────────────────────────────────────────────────────────
// CMS Components
// ───────────────────────────────────────────────────────────────

/** CMSBlock component props - Reusable CMS content block */
export interface CMSBlockProps {
  blockId?: string;
  blockIdentifier?: string;
  showTitle?: boolean;
  cache?: boolean;
  cacheDuration?: number;
}

/** CMSPage component props - Full CMS page embed */
export interface CMSPageProps {
  pageId?: string;
  pageIdentifier?: string;
  showBreadcrumbs?: boolean;
  showTitle?: boolean;
  showMeta?: boolean;
}

/** OrdersAndReturns component props - Order lookup form */
export interface OrdersAndReturnsProps {
  title?: string;
  description?: string;
  requireEmail?: boolean;
  requireOrderNumber?: boolean;
  requireZipCode?: boolean;
  submitText?: string;
  showFindByOrder?: boolean;
  showFindByEmail?: boolean;
}
