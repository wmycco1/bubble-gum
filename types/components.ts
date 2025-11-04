/**
 * Component Type Definitions
 * Defines structure for all builder components
 */

export type ComponentType = 'hero' | 'text' | 'image' | 'button' | 'form';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  props: Record<string, unknown> | HeroProps | TextProps | ImageProps | ButtonProps | FormProps;
}

// Hero Component
export interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface HeroComponent extends BaseComponent {
  type: 'hero';
  props: HeroProps;
}

// Text Component
export interface TextProps {
  content: string;
  variant: 'h1' | 'h2' | 'h3' | 'paragraph';
  align: 'left' | 'center' | 'right';
}

export interface TextComponent extends BaseComponent {
  type: 'text';
  props: TextProps;
}

// Image Component
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  props: ImageProps;
}

// Button Component
export interface ButtonProps {
  text: string;
  href?: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  props: ButtonProps;
}

// Form Component
export interface FormProps {
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'email' | 'textarea';
    required: boolean;
  }>;
  submitText: string;
  action?: string;
}

export interface FormComponent extends BaseComponent {
  type: 'form';
  props: FormProps;
}

// Union type for all components
export type PageComponent =
  | HeroComponent
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | FormComponent;

// Component defaults
export const componentDefaults: Record<ComponentType, BaseComponent['props']> = {
  hero: {
    title: 'Welcome to Your Website',
    subtitle: 'Create something amazing',
    ctaText: 'Get Started',
    ctaLink: '#',
  } as HeroProps,
  text: {
    content: 'Your text here...',
    variant: 'paragraph',
    align: 'left',
  } as TextProps,
  image: {
    src: 'https://images.unsplash.com/photo-1557683316-973673baf926',
    alt: 'Placeholder image',
    width: 800,
    height: 600,
  } as ImageProps,
  button: {
    text: 'Click me',
    variant: 'primary',
    size: 'md',
  } as ButtonProps,
  form: {
    fields: [
      {
        id: '1',
        label: 'Name',
        type: 'text',
        required: true,
      },
      {
        id: '2',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        id: '3',
        label: 'Message',
        type: 'textarea',
        required: false,
      },
    ],
    submitText: 'Submit',
  } as FormProps,
};
