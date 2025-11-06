/**
 * Parameter Types - Central Export
 * God-Tier Development Protocol 2025
 *
 * Centralized export for all parameter interfaces and utilities
 */

// Base parameters
export * from './base';
export type { BaseParameters } from './base';

// Template parameters
export * from './template';
export type {
  TemplateParameters,
  ContainerParameters,
  SectionParameters,
  GridParameters,
} from './template';

// Organism parameters
export * from './organism';
export type { OrganismParameters } from './organism';

// Molecule parameters
export * from './molecule';
export type { MoleculeParameters } from './molecule';

// Atom parameters
export * from './atom';
export type {
  AtomParameters,
  ButtonParameters,
  InputParameters,
  IconParameters,
  ImageParameters,
  LinkParameters,
} from './atom';

// Utility types
export * from './utils';
export type {
  ResponsiveValue,
  SpacingValue,
  ResponsiveSpacing,
  SizePreset,
  BorderStyle,
  BorderRadiusPreset,
  AnimationType,
  TransitionConfig,
  HoverEffect,
  TextAlign,
  VerticalAlign,
  Display,
  Position,
  FlexDirection,
  JustifyContent,
  AlignItems,
  FlexWrap,
  ColorValue,
  FontWeight,
  FontStyle,
  TextTransform,
  TextDecorationLine,
  TextDecorationStyle,
  LinkTarget,
  Breakpoint,
  VisibilityConfig,
  BackgroundType,
  BackgroundSize,
  BackgroundRepeat,
  BackgroundAttachment,
  GradientType,
  GradientStop,
  ShadowConfig,
  ShadowPreset,
  ValidationRule,
  ValidationRules,
  FieldError,
  ImageFormat,
  IconType,
  ComponentVariant,
  ButtonVariant,
  AlertVariant,
  LoadingState,
  Orientation,
  Direction,
  ZIndexLayer,
} from './utils';

export {
  DEFAULT_BREAKPOINTS,
  DEFAULT_Z_INDEX,
  resolveResponsive,
  spacingToCss,
  shadowToCss,
  isResponsive,
} from './utils';

// Re-export helpful type guards
export { hasChildren, isPolymorphic, mergeDataAttributes, extractAriaProps } from './base';

/**
 * Union type of all parameter interfaces
 */
export type AnyParameters =
  | BaseParameters
  | TemplateParameters
  | OrganismParameters
  | MoleculeParameters
  | AtomParameters;

/**
 * Atomic level identifier
 */
export type AtomicLevel = 'atom' | 'molecule' | 'organism' | 'template' | 'page';

/**
 * Parameter interface map by atomic level
 */
export type ParametersByLevel = {
  atom: AtomParameters;
  molecule: MoleculeParameters;
  organism: OrganismParameters;
  template: TemplateParameters;
  page: BaseParameters; // Pages typically don't have special params beyond base
};

/**
 * Get parameter interface for a specific atomic level
 *
 * @example
 * type ButtonParams = GetParametersForLevel<'atom'>;
 * type HeroParams = GetParametersForLevel<'organism'>;
 */
export type GetParametersForLevel<T extends AtomicLevel> = ParametersByLevel[T];

/**
 * Component props with parameters
 *
 * Helper type to merge component-specific props with atomic-level parameters
 *
 * @example
 * interface CustomButtonProps extends ComponentWithParameters<'atom'> {
 *   customProp: string;
 * }
 */
export type ComponentWithParameters<T extends AtomicLevel> = GetParametersForLevel<T> & {
  children?: React.ReactNode;
};

/**
 * Extract parameter subset from full parameters
 *
 * @example
 * // Get only typography params
 * type TypographyParams = ExtractParams<AtomParameters, 'fontSize' | 'fontWeight' | 'color'>;
 */
export type ExtractParams<T, K extends keyof T> = Pick<T, K>;

/**
 * Make certain parameters required
 *
 * @example
 * // Button must have text and onClick
 * type RequiredButtonParams = RequireParams<ButtonParameters, 'text' | 'onClick'>;
 */
export type RequireParams<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make all parameters optional (useful for defaults)
 */
export type OptionalParams<T> = Partial<T>;

/**
 * Component parameter inheritance helper
 *
 * Extracts parameters that should be inherited from parent to child
 *
 * @example
 * // Template passes these to Organism children
 * type InheritedParams = InheritableParameters<TemplateParameters>;
 */
export type InheritableParameters<T> = Omit<
  T,
  | 'id'
  | 'className'
  | 'style'
  | 'children'
  | 'key'
  | 'ref'
  | 'onClick'
  | 'onChange'
  | 'onSubmit'
  | 'data-testid'
>;

/**
 * Merge multiple parameter interfaces
 *
 * @example
 * type CustomParams = MergeParameters<[AtomParameters, { customProp: string }]>;
 */
export type MergeParameters<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First & MergeParameters<Rest>
  : {};

/**
 * Parameter validation helper
 *
 * Type guard to check if object conforms to parameter interface
 */
export function isValidParameters<T extends AnyParameters>(
  obj: any,
  level: AtomicLevel
): obj is T {
  if (!obj || typeof obj !== 'object') return false;

  // Basic checks - all parameters should be plain objects
  if (Array.isArray(obj)) return false;

  // Level-specific validation could be added here
  // For now, just basic object check
  return true;
}

/**
 * Default parameter values by atomic level
 */
export const DEFAULT_PARAMETERS: Record<AtomicLevel, Partial<AnyParameters>> = {
  atom: {
    size: 'md',
    disabled: false,
    loading: false,
  },
  molecule: {
    size: 'md',
    variant: 'default',
    dismissible: false,
  },
  organism: {
    animation: 'none',
    showControls: true,
    responsive: true,
  },
  template: {
    responsive: true,
    fullWidth: false,
    centerHorizontal: false,
    centerVertical: false,
  },
  page: {
    // Pages use base parameters only
  },
};

/**
 * Parameter categories for organization
 */
export const PARAMETER_CATEGORIES = {
  typography: [
    'fontSize',
    'fontWeight',
    'fontStyle',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'textTransform',
    'textDecoration',
    'color',
  ],
  spacing: [
    'padding',
    'margin',
    'gap',
    'rowGap',
    'columnGap',
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
  ],
  colors: [
    'backgroundColor',
    'borderColor',
    'color',
    'iconColor',
    'overlayColor',
    'gradientStops',
  ],
  layout: [
    'display',
    'position',
    'flexDirection',
    'justifyContent',
    'alignItems',
    'gridColumns',
    'gridRows',
  ],
  responsive: ['responsive', 'hide', 'show', 'breakpoint'],
  accessibility: [
    'aria-label',
    'aria-describedby',
    'aria-hidden',
    'role',
    'tabIndex',
  ],
  interactions: [
    'onClick',
    'onChange',
    'onSubmit',
    'hover',
    'active',
    'disabled',
    'loading',
  ],
  content: ['title', 'subtitle', 'description', 'text', 'content', 'items', 'data'],
  navigation: ['href', 'link', 'target', 'onClick', 'ctaText', 'ctaLink'],
  forms: [
    'value',
    'onChange',
    'type',
    'placeholder',
    'required',
    'validation',
    'error',
  ],
  media: ['src', 'alt', 'icon', 'video', 'image', 'thumbnail'],
  advanced: ['id', 'className', 'style', 'data-testid', 'ref', 'as'],
} as const;
