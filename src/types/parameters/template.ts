/**
 * Template Parameters
 * God-Tier Development Protocol 2025
 *
 * Template components: Container, Section, InnerSection, Grid
 * Responsible for: Page structure, layout, spacing, backgrounds
 */

import { BaseParameters } from './base';
import {
  ResponsiveValue,
  ResponsiveSpacing,
  ColorValue,
  BackgroundType,
  BackgroundSize,
  BackgroundRepeat,
  BackgroundAttachment,
  VisibilityConfig,
  Display,
  Position,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
  ShadowConfig,
} from './utils';

/**
 * TemplateParameters
 *
 * Template-level components provide page structure and layout.
 * They cascade spacing, colors, and responsive behavior to children.
 *
 * @example
 * <Section
 *   maxWidth="1200px"
 *   padding={{ all: { value: 32, unit: 'px' } }}
 *   backgroundColor="#f5f5f5"
 * >
 *   <Hero />
 *   <Features />
 * </Section>
 */
export interface TemplateParameters extends BaseParameters {
  // ============================================
  // LAYOUT & SPACING (PRIMARY)
  // ============================================

  /**
   * Width of the component
   * Can be responsive across breakpoints
   *
   * @example
   * width="100%"
   * width={{ mobile: '100%', desktop: '1200px' }}
   */
  width?: ResponsiveValue<string | number>;

  /**
   * Height of the component
   */
  height?: ResponsiveValue<string | number>;

  /**
   * Minimum width
   */
  minWidth?: ResponsiveValue<string | number>;

  /**
   * Maximum width (common for containers)
   *
   * @example
   * maxWidth="1200px"
   */
  maxWidth?: ResponsiveValue<string | number>;

  /**
   * Minimum height
   */
  minHeight?: ResponsiveValue<string | number>;

  /**
   * Maximum height
   */
  maxHeight?: ResponsiveValue<string | number>;

  /**
   * Padding (all sides with responsive support)
   *
   * @example
   * padding={{ all: { value: 16, unit: 'px' } }}
   * padding={{ x: { value: 32, unit: 'px' }, y: { value: 16, unit: 'px' } }}
   */
  padding?: ResponsiveSpacing;

  /**
   * Margin (all sides with responsive support)
   */
  margin?: ResponsiveSpacing;

  /**
   * Gap for flex/grid containers
   *
   * @example
   * gap={{ value: 16, unit: 'px' }}
   * gap={{ mobile: { value: 8, unit: 'px' }, desktop: { value: 24, unit: 'px' } }}
   */
  gap?: ResponsiveValue<{ value: number; unit: string }>;

  /**
   * Row gap for grid containers
   */
  rowGap?: ResponsiveValue<{ value: number; unit: string }>;

  /**
   * Column gap for grid containers
   */
  columnGap?: ResponsiveValue<{ value: number; unit: string }>;

  // ============================================
  // GRID-SPECIFIC (GridComponent)
  // ============================================

  /**
   * Number of columns in grid
   *
   * @example
   * columns={3}
   * columns={{ mobile: 1, tablet: 2, desktop: 3 }}
   */
  columns?: ResponsiveValue<number>;

  /**
   * Column widths (for custom grid layouts)
   *
   * @example
   * columnWidths={['1fr', '2fr', '1fr']}
   */
  columnWidths?: string[];

  /**
   * Number of rows in grid
   */
  rows?: ResponsiveValue<number>;

  /**
   * Row heights
   */
  rowHeights?: string[];

  /**
   * Grid template areas (named grid)
   *
   * @example
   * gridTemplateAreas={[
   *   'header header header',
   *   'sidebar content aside',
   *   'footer footer footer'
   * ]}
   */
  gridTemplateAreas?: string[];

  /**
   * Grid auto flow direction
   */
  gridAutoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';

  // ============================================
  // COLORS & BACKGROUNDS (PRIMARY)
  // ============================================

  /**
   * Background color
   *
   * @example
   * backgroundColor="#f5f5f5"
   * backgroundColor="rgba(0, 0, 0, 0.1)"
   */
  backgroundColor?: ColorValue;

  /**
   * Background type
   */
  backgroundType?: BackgroundType;

  /**
   * Background image URL
   *
   * @example
   * backgroundImage="https://example.com/hero-bg.jpg"
   */
  backgroundImage?: string;

  /**
   * Background position
   *
   * @example
   * backgroundPosition="center"
   * backgroundPosition="50% 25%"
   */
  backgroundPosition?: string;

  /**
   * Background size
   */
  backgroundSize?: BackgroundSize;

  /**
   * Background repeat
   */
  backgroundRepeat?: BackgroundRepeat;

  /**
   * Background attachment (scroll/fixed)
   */
  backgroundAttachment?: BackgroundAttachment;

  /**
   * Overlay enabled (for image/video backgrounds)
   */
  overlay?: boolean;

  /**
   * Overlay color
   */
  overlayColor?: ColorValue;

  /**
   * Overlay opacity (0-1)
   */
  overlayOpacity?: number;

  /**
   * Gradient configuration (if backgroundType='gradient')
   */
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    angle?: number;
    stops: Array<{ color: ColorValue; position: number }>;
  };

  /**
   * Background video URL (if backgroundType='video')
   */
  backgroundVideo?: {
    url: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
  };

  // ============================================
  // RESPONSIVE & VISIBILITY (PRIMARY)
  // ============================================

  /**
   * Enable responsive behavior
   */
  responsive?: boolean;

  /**
   * Hide component on specific breakpoints
   *
   * @example
   * hide={{ mobile: true }} // Hide on mobile only
   * hide={{ mobile: false, desktop: true }} // Show on mobile, hide on desktop
   */
  hide?: VisibilityConfig;

  /**
   * Show component on specific breakpoints (inverse of hide)
   */
  show?: VisibilityConfig;

  /**
   * Display type
   */
  display?: ResponsiveValue<Display>;

  /**
   * Visibility (CSS visibility property)
   */
  visibility?: ResponsiveValue<'visible' | 'hidden' | 'collapse'>;

  /**
   * Opacity (0-1)
   */
  opacity?: ResponsiveValue<number>;

  // ============================================
  // FLEXBOX (for flex containers)
  // ============================================

  /**
   * Flex direction
   */
  flexDirection?: ResponsiveValue<FlexDirection>;

  /**
   * Justify content (main axis)
   */
  justifyContent?: ResponsiveValue<JustifyContent>;

  /**
   * Align items (cross axis)
   */
  alignItems?: ResponsiveValue<AlignItems>;

  /**
   * Align content (multi-line flex)
   */
  alignContent?: ResponsiveValue<JustifyContent>;

  /**
   * Flex wrap
   */
  flexWrap?: ResponsiveValue<FlexWrap>;

  /**
   * Flex grow
   */
  flexGrow?: ResponsiveValue<number>;

  /**
   * Flex shrink
   */
  flexShrink?: ResponsiveValue<number>;

  /**
   * Flex basis
   */
  flexBasis?: ResponsiveValue<string | number>;

  // ============================================
  // POSITIONING
  // ============================================

  /**
   * Position type
   */
  position?: ResponsiveValue<Position>;

  /**
   * Top offset (for positioned elements)
   */
  top?: ResponsiveValue<string | number>;

  /**
   * Right offset
   */
  right?: ResponsiveValue<string | number>;

  /**
   * Bottom offset
   */
  bottom?: ResponsiveValue<string | number>;

  /**
   * Left offset
   */
  left?: ResponsiveValue<string | number>;

  /**
   * Z-index
   */
  zIndex?: number;

  // ============================================
  // OVERFLOW
  // ============================================

  /**
   * Overflow behavior
   */
  overflow?: ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;

  /**
   * Overflow X
   */
  overflowX?: ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;

  /**
   * Overflow Y
   */
  overflowY?: ResponsiveValue<'visible' | 'hidden' | 'scroll' | 'auto'>;

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Box shadow
   *
   * @example
   * boxShadow={[{
   *   offsetX: 0,
   *   offsetY: 4,
   *   blur: 6,
   *   spread: 0,
   *   color: '#000',
   *   opacity: 0.1
   * }]}
   */
  boxShadow?: ShadowConfig[];

  /**
   * Border radius (all corners)
   */
  borderRadius?: ResponsiveValue<string | number>;

  /**
   * Border radius per corner
   */
  borderRadiusCorners?: {
    topLeft?: ResponsiveValue<string | number>;
    topRight?: ResponsiveValue<string | number>;
    bottomRight?: ResponsiveValue<string | number>;
    bottomLeft?: ResponsiveValue<string | number>;
  };

  /**
   * Backdrop filter (blur, etc.)
   *
   * @example
   * backdropFilter="blur(10px)"
   */
  backdropFilter?: string;

  /**
   * Filter (brightness, contrast, etc.)
   */
  filter?: string;

  // ============================================
  // CONTAINER-SPECIFIC
  // ============================================

  /**
   * Container element type
   */
  containerElement?: 'div' | 'section' | 'article' | 'aside' | 'nav' | 'main' | 'header' | 'footer';

  /**
   * Full width container (ignores maxWidth)
   */
  fullWidth?: boolean;

  /**
   * Full height container (100vh)
   */
  fullHeight?: boolean;

  /**
   * Center content horizontally
   */
  centerHorizontal?: boolean;

  /**
   * Center content vertically
   */
  centerVertical?: boolean;

  /**
   * Container query support (2025 feature)
   */
  containerQuery?: {
    minWidth?: number;
    maxWidth?: number;
    name?: string;
  };

  // ============================================
  // SECTION-SPECIFIC
  // ============================================

  /**
   * Section element type
   */
  sectionElement?: 'section' | 'div' | 'article';

  /**
   * Stack children vertically with gap
   */
  stack?: boolean;

  /**
   * Stack direction
   */
  stackDirection?: ResponsiveValue<'vertical' | 'horizontal'>;

  /**
   * Stack spacing (shorthand for gap)
   */
  stackSpacing?: ResponsiveValue<{ value: number; unit: string }>;
}

/**
 * Container-specific parameters
 */
export interface ContainerParameters extends TemplateParameters {
  maxWidth: ResponsiveValue<string | number>;
  centerHorizontal?: boolean;
}

/**
 * Section-specific parameters
 */
export interface SectionParameters extends TemplateParameters {
  sectionElement?: 'section' | 'div' | 'article';
  stack?: boolean;
}

/**
 * Grid-specific parameters
 */
export interface GridParameters extends TemplateParameters {
  columns: ResponsiveValue<number>;
  gap?: ResponsiveValue<{ value: number; unit: string }>;
}
