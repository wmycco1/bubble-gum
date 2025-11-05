// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - TYPE ADAPTER
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Bridge between OLD system (types/components.ts) and NEW system (lib/editor/types.ts)
// Allows gradual migration without breaking existing components
// ═══════════════════════════════════════════════════════════════

import type { PageComponent, ComponentType as OldComponentType } from '@/types/components';
import type {
  CanvasComponent,
  ComponentType as NewComponentType,
  ComponentProps,
  ComponentStyle,
} from './types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type Mappings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Maps OLD component types to NEW component types
 * OLD: lowercase ('hero', 'text', etc.)
 * NEW: PascalCase ('Button', 'Text', etc.)
 */
const typeMapping: Record<OldComponentType, NewComponentType> = {
  hero: 'Section', // Hero → Section with special styling
  text: 'Text',
  image: 'Image',
  button: 'Button',
  form: 'Form',
};

/**
 * Reverse mapping for converting NEW → OLD
 */
const reverseTypeMapping: Partial<Record<NewComponentType, OldComponentType>> = {
  Section: 'hero', // Section can be hero if has special props
  Text: 'text',
  Image: 'image',
  Button: 'button',
  Form: 'form',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Converters: OLD → NEW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts OLD PageComponent to NEW CanvasComponent
 * This allows OLD components to work with NEW canvas-store
 */
export function convertOldToNew(oldComponent: PageComponent): CanvasComponent {
  const newType = typeMapping[oldComponent.type] || 'Text';

  // Convert props based on component type
  const newProps: ComponentProps = convertPropsOldToNew(oldComponent);

  // Generate default style based on component type
  const style: ComponentStyle = generateDefaultStyle(newType, oldComponent);

  return {
    id: oldComponent.id,
    type: newType,
    props: newProps,
    style,
    children: [], // OLD system doesn't have children
  };
}

/**
 * Converts props from OLD format to NEW format
 */
function convertPropsOldToNew(oldComponent: PageComponent): ComponentProps {
  switch (oldComponent.type) {
    case 'hero':
      return {
        text: oldComponent.props.title || '',
        // Store subtitle and CTA in custom props
        subtitle: oldComponent.props.subtitle,
        ctaText: oldComponent.props.ctaText,
        ctaLink: oldComponent.props.ctaLink,
      };

    case 'text':
      return {
        text: oldComponent.props.content || '',
        variant: oldComponent.props.variant,
        align: oldComponent.props.align,
      };

    case 'image':
      return {
        src: oldComponent.props.src || '',
        alt: oldComponent.props.alt || '',
        width: oldComponent.props.width?.toString(),
        height: oldComponent.props.height?.toString(),
      };

    case 'button':
      return {
        text: oldComponent.props.text || '',
        href: oldComponent.props.href,
        variant: oldComponent.props.variant,
        size: oldComponent.props.size,
      };

    case 'form':
      return {
        submitText: oldComponent.props.submitText || 'Submit',
        fields: oldComponent.props.fields,
      };

    default:
      return {};
  }
}

/**
 * Generates default style based on component type and OLD props
 */
function generateDefaultStyle(
  type: NewComponentType,
  oldComponent: PageComponent
): ComponentStyle {
  const baseStyle: ComponentStyle = {};

  switch (type) {
    case 'Section': // Hero
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        minHeight: '400px',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundImage: oldComponent.type === 'hero' ? oldComponent.props.backgroundImage : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };

    case 'Text':
      const variant = oldComponent.type === 'text' ? oldComponent.props.variant : 'paragraph';
      return {
        ...baseStyle,
        fontSize:
          variant === 'h1' ? '2.5rem' : variant === 'h2' ? '2rem' : variant === 'h3' ? '1.5rem' : '1rem',
        fontWeight: variant !== 'paragraph' ? '700' : '400',
        lineHeight: variant !== 'paragraph' ? '1.2' : '1.5',
        textAlign: oldComponent.type === 'text' ? oldComponent.props.align : 'left',
      };

    case 'Image':
      return {
        ...baseStyle,
        width: '100%',
        height: 'auto',
        borderRadius: '0.5rem',
      };

    case 'Button':
      const btnVariant = oldComponent.type === 'button' ? oldComponent.props.variant : 'primary';
      return {
        ...baseStyle,
        padding: '0.5rem 1rem',
        backgroundColor: btnVariant === 'primary' ? '#000000' : btnVariant === 'secondary' ? '#6c757d' : 'transparent',
        color: btnVariant === 'outline' ? '#000000' : '#ffffff',
        border: btnVariant === 'outline' ? '1px solid #000000' : 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
      };

    case 'Form':
      return {
        ...baseStyle,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        minHeight: '150px',
      };

    default:
      return baseStyle;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Converters: NEW → OLD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts NEW CanvasComponent to OLD PageComponent
 * This allows NEW components to be saved in OLD format for DB compatibility
 */
export function convertNewToOld(newComponent: CanvasComponent): PageComponent | null {
  const oldType = reverseTypeMapping[newComponent.type];
  if (!oldType) {
    console.warn(`Cannot convert component type ${newComponent.type} to OLD format`);
    return null;
  }

  const oldProps = convertPropsNewToOld(newComponent, oldType);

  return {
    id: newComponent.id,
    type: oldType,
    props: oldProps,
  } as PageComponent;
}

/**
 * Converts props from NEW format to OLD format
 */
function convertPropsNewToOld(
  newComponent: CanvasComponent,
  oldType: OldComponentType
): PageComponent['props'] {
  switch (oldType) {
    case 'hero':
      return {
        title: newComponent.props.text || '',
        subtitle: (newComponent.props.subtitle as string) || '',
        ctaText: (newComponent.props.ctaText as string) || '',
        ctaLink: (newComponent.props.ctaLink as string) || '#',
        backgroundImage: newComponent.style.backgroundImage,
      };

    case 'text':
      return {
        content: newComponent.props.text || '',
        variant: (newComponent.props.variant as 'h1' | 'h2' | 'h3' | 'paragraph') || 'paragraph',
        align: (newComponent.style.textAlign as 'left' | 'center' | 'right') || 'left',
      };

    case 'image':
      return {
        src: newComponent.props.src || '',
        alt: newComponent.props.alt || '',
        width: newComponent.props.width ? parseInt(newComponent.props.width as string) : undefined,
        height: newComponent.props.height ? parseInt(newComponent.props.height as string) : undefined,
      };

    case 'button':
      return {
        text: newComponent.props.text || '',
        href: newComponent.props.href,
        variant: (newComponent.props.variant as 'primary' | 'secondary' | 'outline') || 'primary',
        size: (newComponent.props.size as 'sm' | 'md' | 'lg') || 'md',
      };

    case 'form':
      return {
        fields: (newComponent.props.fields as any) || [],
        submitText: newComponent.props.submitText as string || 'Submit',
      };

    default:
      // Fallback to text component props
      return {
        content: '',
        variant: 'paragraph' as const,
        align: 'left' as const,
      };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Batch Converters
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts array of OLD components to NEW components
 */
export function convertArrayOldToNew(oldComponents: PageComponent[]): CanvasComponent[] {
  return oldComponents.map(convertOldToNew);
}

/**
 * Converts array of NEW components to OLD components
 * Filters out components that can't be converted
 */
export function convertArrayNewToOld(newComponents: CanvasComponent[]): PageComponent[] {
  return newComponents
    .map(convertNewToOld)
    .filter((comp): comp is PageComponent => comp !== null);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type Guards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Checks if component is from OLD system
 */
export function isOldComponent(component: any): component is PageComponent {
  return (
    typeof component === 'object' &&
    component !== null &&
    'type' in component &&
    typeof component.type === 'string' &&
    component.type === component.type.toLowerCase() // OLD types are lowercase
  );
}

/**
 * Checks if component is from NEW system
 */
export function isNewComponent(component: any): component is CanvasComponent {
  return (
    typeof component === 'object' &&
    component !== null &&
    'type' in component &&
    'style' in component &&
    typeof component.type === 'string' &&
    component.type[0] === component.type[0].toUpperCase() // NEW types are PascalCase
  );
}
