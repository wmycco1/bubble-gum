/**
 * Parameter Context System
 * God-Tier Development Protocol 2025
 *
 * Provides parameter inheritance across atomic design hierarchy
 * Template → Organism → Molecule → Atom
 */

import React, { createContext, useContext, useMemo } from 'react';
import type {
  BaseParameters,
  TemplateParameters,
  OrganismParameters,
  MoleculeParameters,
  AtomParameters,
} from '@/types/parameters';

// ============================================
// CONTEXT DEFINITIONS
// ============================================

/**
 * Template Context
 * Provides layout, spacing, colors, responsive settings to children
 */
export const TemplateContext = createContext<Partial<TemplateParameters> | null>(null);

/**
 * Organism Context
 * Inherits from Template, adds content, navigation, forms
 */
export const OrganismContext = createContext<Partial<OrganismParameters> | null>(null);

/**
 * Molecule Context
 * Provides typography, colors, basic interactions
 */
export const MoleculeContext = createContext<Partial<MoleculeParameters> | null>(null);

/**
 * Atom Context
 * Provides minimal parameters for basic elements
 */
export const AtomContext = createContext<Partial<AtomParameters> | null>(null);

// ============================================
// HOOKS
// ============================================

/**
 * useTemplateContext
 *
 * Access Template-level parameters
 *
 * @example
 * const { padding, backgroundColor } = useTemplateContext();
 */
export function useTemplateContext(): Partial<TemplateParameters> {
  const context = useContext(TemplateContext);
  return context ?? {};
}

/**
 * useOrganismContext
 *
 * Access Organism-level parameters (includes Template params)
 *
 * @example
 * const { title, ctaText, padding } = useOrganismContext();
 */
export function useOrganismContext(): Partial<OrganismParameters> {
  const organismContext = useContext(OrganismContext);
  const templateContext = useTemplateContext();

  return useMemo(
    () => ({
      ...templateContext,
      ...organismContext,
    }),
    [templateContext, organismContext]
  );
}

/**
 * useMoleculeContext
 *
 * Access Molecule-level parameters
 *
 * @example
 * const { title, variant, color } = useMoleculeContext();
 */
export function useMoleculeContext(): Partial<MoleculeParameters> {
  const context = useContext(MoleculeContext);
  return context ?? {};
}

/**
 * useAtomContext
 *
 * Access Atom-level parameters
 *
 * @example
 * const { text, color, size } = useAtomContext();
 */
export function useAtomContext(): Partial<AtomParameters> {
  const context = useContext(AtomContext);
  return context ?? {};
}

/**
 * useInheritedParameters
 *
 * Smart hook that merges parameters from appropriate contexts
 * based on component's atomic level
 *
 * @param level - Atomic level of component
 * @param props - Component props (override context)
 * @returns Merged parameters
 *
 * @example
 * // In an Organism component
 * const params = useInheritedParameters('organism', props);
 * // Gets: Template params + Organism params + props (props win)
 */
export function useInheritedParameters<T extends BaseParameters>(
  level: 'template' | 'organism' | 'molecule' | 'atom',
  props: Partial<T>
): Partial<T> {
  const templateContext = useTemplateContext();
  const organismContext = useContext(OrganismContext);
  const moleculeContext = useMoleculeContext();
  const atomContext = useAtomContext();

  return useMemo(() => {
    let inherited: any = {};

    switch (level) {
      case 'template':
        // Templates don't inherit
        inherited = {};
        break;

      case 'organism':
        // Organisms inherit from Templates
        inherited = {
          ...templateContext,
          ...organismContext,
        };
        break;

      case 'molecule':
        // Molecules don't inherit from Template/Organism
        // (independent parameter set)
        inherited = {
          ...moleculeContext,
        };
        break;

      case 'atom':
        // Atoms don't inherit from higher levels
        // (independent parameter set)
        inherited = {
          ...atomContext,
        };
        break;
    }

    // Props override context
    return {
      ...inherited,
      ...props,
    } as Partial<T>;
  }, [level, templateContext, organismContext, moleculeContext, atomContext, props]);
}

// ============================================
// PROVIDER COMPONENTS
// ============================================

/**
 * TemplateProvider
 *
 * Provides Template-level parameters to children
 *
 * @example
 * <TemplateProvider value={{ padding: '32px', backgroundColor: '#f5f5f5' }}>
 *   <Section>
 *     <Hero /> {/* Inherits padding, backgroundColor *\/}
 *   </Section>
 * </TemplateProvider>
 */
export const TemplateProvider: React.FC<{
  value: Partial<TemplateParameters>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};

/**
 * OrganismProvider
 *
 * Provides Organism-level parameters to children
 *
 * @example
 * <OrganismProvider value={{ title: 'Welcome', ctaText: 'Get Started' }}>
 *   <HeroContent />
 * </OrganismProvider>
 */
export const OrganismProvider: React.FC<{
  value: Partial<OrganismParameters>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <OrganismContext.Provider value={value}>{children}</OrganismContext.Provider>;
};

/**
 * MoleculeProvider
 *
 * Provides Molecule-level parameters to children
 *
 * @example
 * <MoleculeProvider value={{ variant: 'success', dismissible: true }}>
 *   <AlertContent />
 * </MoleculeProvider>
 */
export const MoleculeProvider: React.FC<{
  value: Partial<MoleculeParameters>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <MoleculeContext.Provider value={value}>{children}</MoleculeContext.Provider>;
};

/**
 * AtomProvider
 *
 * Provides Atom-level parameters to children
 *
 * @example
 * <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
 *   <ButtonContent />
 * </AtomProvider>
 */
export const AtomProvider: React.FC<{
  value: Partial<AtomParameters>;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return <AtomContext.Provider value={value}>{children}</AtomContext.Provider>;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * mergeParameters
 *
 * Deep merge parameters with proper override behavior
 *
 * @param base - Base parameters (lower priority)
 * @param override - Override parameters (higher priority)
 * @returns Merged parameters
 *
 * @example
 * const merged = mergeParameters(
 *   { padding: '16px', color: 'blue' },
 *   { padding: '32px' }
 * );
 * // Result: { padding: '32px', color: 'blue' }
 */
export function mergeParameters<T extends BaseParameters>(
  base: Partial<T>,
  override: Partial<T>
): Partial<T> {
  return {
    ...base,
    ...override,
    // Special handling for nested objects
    ...(base.style && override.style
      ? { style: { ...base.style, ...override.style } }
      : {}),
    ...(base.dataAttributes && override.dataAttributes
      ? { dataAttributes: { ...base.dataAttributes, ...override.dataAttributes } }
      : {}),
  };
}

/**
 * filterInheritableParameters
 *
 * Filters out non-inheritable parameters (id, className, event handlers, etc.)
 *
 * @param params - Parameters to filter
 * @returns Filtered parameters safe for inheritance
 *
 * @example
 * const inheritable = filterInheritableParameters({
 *   id: 'unique-id', // filtered out
 *   padding: '16px', // kept
 *   onClick: () => {}, // filtered out
 * });
 */
export function filterInheritableParameters<T extends BaseParameters>(
  params: Partial<T>
): Partial<T> {
  const nonInheritable = [
    'id',
    'className',
    'style',
    'children',
    'key',
    'ref',
    'onClick',
    'onChange',
    'onSubmit',
    'onFocus',
    'onBlur',
    'data-testid',
    'data-cy',
    'as',
  ];

  const filtered: any = {};

  Object.keys(params).forEach((key) => {
    // Skip non-inheritable props
    if (nonInheritable.includes(key)) return;

    // Skip event handlers (start with 'on')
    if (key.startsWith('on') && key.length > 2 && key[2] === key[2].toUpperCase()) {
      return;
    }

    filtered[key] = (params as any)[key];
  });

  return filtered as Partial<T>;
}

/**
 * withParameterContext
 *
 * HOC that wraps component with parameter context provider
 *
 * @param Component - Component to wrap
 * @param level - Atomic level
 * @returns Wrapped component with context
 *
 * @example
 * const ButtonWithContext = withParameterContext(Button, 'atom');
 */
export function withParameterContext<P extends BaseParameters>(
  Component: React.ComponentType<P>,
  level: 'template' | 'organism' | 'molecule' | 'atom'
) {
  return function ComponentWithContext(props: P) {
    const inherited = useInheritedParameters(level, props);

    return <Component {...(inherited as P)} />;
  };
}

/**
 * useParameterOverride
 *
 * Hook for components that need to override inherited parameters
 *
 * @param level - Atomic level
 * @param props - Component props
 * @param overrides - Conditional overrides
 * @returns Final parameters
 *
 * @example
 * const params = useParameterOverride('atom', props, {
 *   // Override padding if variant is 'compact'
 *   ...(variant === 'compact' ? { padding: '8px' } : {})
 * });
 */
export function useParameterOverride<T extends BaseParameters>(
  level: 'template' | 'organism' | 'molecule' | 'atom',
  props: Partial<T>,
  overrides: Partial<T>
): Partial<T> {
  const inherited = useInheritedParameters(level, props);

  return useMemo(
    () => mergeParameters(inherited, overrides),
    [inherited, overrides]
  );
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * isTemplateParameter
 *
 * Type guard to check if parameter belongs to Template level
 */
export function isTemplateParameter(key: string): boolean {
  const templateKeys = [
    'width',
    'height',
    'maxWidth',
    'padding',
    'margin',
    'gap',
    'columns',
    'backgroundColor',
    'backgroundImage',
    'overlay',
    'responsive',
    'hide',
    'show',
    'display',
    'flexDirection',
    'justifyContent',
    'alignItems',
  ];

  return templateKeys.includes(key);
}

/**
 * isOrganismParameter
 *
 * Type guard to check if parameter belongs to Organism level
 */
export function isOrganismParameter(key: string): boolean {
  const organismKeys = [
    'title',
    'subtitle',
    'description',
    'content',
    'items',
    'ctaText',
    'ctaLink',
    'formTitle',
    'submitText',
    'icon',
    'image',
    'video',
    'animation',
  ];

  return organismKeys.includes(key);
}
