// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - DB ADAPTER
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Simplified for DB compatibility only
// Purpose: Convert between canvas-store format and DB JSON format
// Note: Only needed for database backwards compatibility
// ═══════════════════════════════════════════════════════════════

import type {
  CanvasComponent,
  ComponentType as NewComponentType,
  ComponentProps,
  ComponentStyle,
} from './types';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Database Types (simplified, for compatibility)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type DbComponentType = 'hero' | 'text' | 'image' | 'button' | 'form';

interface DbComponent {
  id: string;
  type: DbComponentType;
  props: Record<string, unknown>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Type Mappings
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Maps NEW component types to DB types (for backwards compatibility)
 */
const newToDbTypeMap: Partial<Record<NewComponentType, DbComponentType>> = {
  Section: 'hero',
  Text: 'text',
  Heading: 'text',
  Image: 'image',
  Button: 'button',
  Form: 'form',
  // Note: Container, Grid, Card, Input don't have DB equivalents yet
  // They will be stored as 'text' placeholder until DB schema is updated
};

/**
 * Maps DB types to NEW component types
 */
const dbToNewTypeMap: Record<DbComponentType, NewComponentType> = {
  hero: 'Section',
  text: 'Text',
  image: 'Image',
  button: 'Button',
  form: 'Form',
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Converters: DB → Store (Loading)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts DB component to Store component
 * Used when loading from database
 */
export function convertOldToNew(dbComponent: DbComponent): CanvasComponent {
  const newType = dbToNewTypeMap[dbComponent.type] || 'Text';

  // Convert props based on type
  const newProps: ComponentProps = convertPropsDbToStore(dbComponent);

  // Generate default style
  const style: ComponentStyle = generateDefaultStyle(newType, dbComponent);

  return {
    id: dbComponent.id,
    type: newType,
    props: newProps,
    style,
    children: [], // DB format doesn't support children yet
  };
}

/**
 * Converts props from DB format to Store format
 */
function convertPropsDbToStore(dbComponent: DbComponent): ComponentProps {
  const props = dbComponent.props;

  switch (dbComponent.type) {
    case 'hero':
      return {
        text: (props.title as string) || '',
        subtitle: props.subtitle,
        ctaText: props.ctaText,
        ctaLink: props.ctaLink,
      };

    case 'text':
      return {
        text: (props.content as string) || '',
        variant: (props.variant as string) || 'paragraph',
      };

    case 'image':
      return {
        src: (props.src as string) || '',
        alt: (props.alt as string) || '',
      };

    case 'button':
      return {
        text: (props.text as string) || '',
        href: (props.href as string) || '#',
        variant: (props.variant as string) || 'primary',
      };

    case 'form':
      return {
        submitText: (props.submitText as string) || 'Submit',
        fields: props.fields as any,
      };

    default:
      return { text: 'Text' };
  }
}

/**
 * Generates default style based on component type
 */
function generateDefaultStyle(type: NewComponentType, dbComponent: DbComponent): ComponentStyle {
  const baseStyle: ComponentStyle = {};

  switch (type) {
    case 'Section':
      return {
        ...baseStyle,
        padding: '4rem 2rem',
        minHeight: '400px',
        backgroundColor: '#f8f9fa',
      };

    case 'Text':
    case 'Heading':
      const variant = dbComponent.props.variant as string;
      return {
        ...baseStyle,
        fontSize:
          variant === 'h1' ? '2.5rem' : variant === 'h2' ? '2rem' : variant === 'h3' ? '1.5rem' : '1rem',
        fontWeight: variant && variant !== 'paragraph' ? '700' : '400',
        lineHeight: variant && variant !== 'paragraph' ? '1.2' : '1.5',
      };

    case 'Image':
      return {
        ...baseStyle,
        width: '100%',
        height: 'auto',
        borderRadius: '0.5rem',
      };

    case 'Button':
      return {
        ...baseStyle,
        padding: '0.5rem 1rem',
        borderRadius: '0.375rem',
      };

    case 'Form':
      return {
        ...baseStyle,
        padding: '1rem',
        minHeight: '150px',
      };

    default:
      return baseStyle;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Converters: Store → DB (Saving)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts Store component to DB component
 * Used when saving to database
 */
export function convertNewToOld(storeComponent: CanvasComponent): DbComponent | null {
  const dbType = newToDbTypeMap[storeComponent.type];

  // If component type not supported in DB yet, skip it
  if (!dbType) {
    console.warn(`Component type ${storeComponent.type} not supported in DB format yet - skipping`);
    return null;
  }

  const dbProps = convertPropsStoreToDb(storeComponent, dbType);

  return {
    id: storeComponent.id,
    type: dbType,
    props: dbProps,
  };
}

/**
 * Converts props from Store format to DB format
 */
function convertPropsStoreToDb(
  storeComponent: CanvasComponent,
  dbType: DbComponentType
): Record<string, unknown> {
  switch (dbType) {
    case 'hero':
      return {
        title: storeComponent.props.text || '',
        subtitle: storeComponent.props.subtitle || '',
        ctaText: storeComponent.props.ctaText || '',
        ctaLink: storeComponent.props.ctaLink || '#',
      };

    case 'text':
      return {
        content: storeComponent.props.text || '',
        variant: storeComponent.props.variant || 'paragraph',
        align: 'left', // Default
      };

    case 'image':
      return {
        src: storeComponent.props.src || '',
        alt: storeComponent.props.alt || '',
        width: 800,
        height: 600,
      };

    case 'button':
      return {
        text: storeComponent.props.text || '',
        href: storeComponent.props.href || '#',
        variant: storeComponent.props.variant || 'primary',
        size: 'md',
      };

    case 'form':
      return {
        fields: storeComponent.props.fields || [],
        submitText: storeComponent.props.submitText || 'Submit',
      };

    default:
      return {};
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Batch Converters
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Converts array of DB components to Store components
 * Used when loading page from database
 */
export function convertArrayOldToNew(dbComponents: DbComponent[]): CanvasComponent[] {
  return dbComponents.map(convertOldToNew);
}

/**
 * Converts array of Store components to DB components
 * Filters out components that can't be stored in current DB format
 * Used when saving page to database
 */
export function convertArrayNewToOld(storeComponents: CanvasComponent[]): DbComponent[] {
  return storeComponents
    .map(convertNewToOld)
    .filter((comp): comp is DbComponent => comp !== null);
}
