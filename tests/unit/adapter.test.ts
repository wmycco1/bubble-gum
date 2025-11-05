// ═══════════════════════════════════════════════════════════════
// ADAPTER TESTS
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade tests for DB adapter conversion functions
// Coverage: DB↔Store conversions, type mappings, style generation
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  convertOldToNew,
  convertNewToOld,
  convertArrayOldToNew,
  convertArrayNewToOld,
} from '@/lib/editor/adapter';
import type { CanvasComponent } from '@/lib/editor/types';

describe('adapter - DB to Store conversions', () => {
  describe('convertOldToNew - Hero/Section component', () => {
    it('should convert hero to Section with correct props', () => {
      const dbComponent = {
        id: 'hero-1',
        type: 'hero' as const,
        props: {
          title: 'Welcome to Bubble Gum',
          subtitle: 'Build websites in 30 minutes',
          ctaText: 'Get Started',
          ctaLink: '/signup',
        },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.id).toBe('hero-1');
      expect(result.type).toBe('Section');
      expect(result.props.text).toBe('Welcome to Bubble Gum');
      expect(result.props.subtitle).toBe('Build websites in 30 minutes');
      expect(result.props.ctaText).toBe('Get Started');
      expect(result.props.ctaLink).toBe('/signup');
      expect(result.children).toEqual([]);
    });

    it('should generate default style for Section', () => {
      const dbComponent = {
        id: 'hero-1',
        type: 'hero' as const,
        props: { title: 'Test' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.padding).toBe('4rem 2rem');
      expect(result.style.minHeight).toBe('400px');
      expect(result.style.backgroundColor).toBe('#f8f9fa');
    });

    it('should handle missing props with defaults', () => {
      const dbComponent = {
        id: 'hero-1',
        type: 'hero' as const,
        props: {},
      };

      const result = convertOldToNew(dbComponent);

      expect(result.props.text).toBe('');
      expect(result.props.subtitle).toBeUndefined();
    });
  });

  describe('convertOldToNew - Text component', () => {
    it('should convert text to Text with correct props', () => {
      const dbComponent = {
        id: 'text-1',
        type: 'text' as const,
        props: {
          content: 'This is a paragraph',
          variant: 'paragraph',
        },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.id).toBe('text-1');
      expect(result.type).toBe('Text');
      expect(result.props.text).toBe('This is a paragraph');
      expect(result.props.variant).toBe('paragraph');
    });

    it('should generate style for h1 variant', () => {
      const dbComponent = {
        id: 'text-1',
        type: 'text' as const,
        props: { content: 'Heading', variant: 'h1' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.fontSize).toBe('2.5rem');
      expect(result.style.fontWeight).toBe('700');
      expect(result.style.lineHeight).toBe('1.2');
    });

    it('should generate style for h2 variant', () => {
      const dbComponent = {
        id: 'text-2',
        type: 'text' as const,
        props: { content: 'Subheading', variant: 'h2' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.fontSize).toBe('2rem');
      expect(result.style.fontWeight).toBe('700');
    });

    it('should generate style for h3 variant', () => {
      const dbComponent = {
        id: 'text-3',
        type: 'text' as const,
        props: { content: 'Subheading', variant: 'h3' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.fontSize).toBe('1.5rem');
      expect(result.style.fontWeight).toBe('700');
    });

    it('should generate style for paragraph variant', () => {
      const dbComponent = {
        id: 'text-4',
        type: 'text' as const,
        props: { content: 'Text', variant: 'paragraph' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.fontSize).toBe('1rem');
      expect(result.style.fontWeight).toBe('400');
      expect(result.style.lineHeight).toBe('1.5');
    });
  });

  describe('convertOldToNew - Image component', () => {
    it('should convert image to Image with correct props', () => {
      const dbComponent = {
        id: 'img-1',
        type: 'image' as const,
        props: {
          src: 'https://example.com/image.jpg',
          alt: 'Sample image',
        },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.id).toBe('img-1');
      expect(result.type).toBe('Image');
      expect(result.props.src).toBe('https://example.com/image.jpg');
      expect(result.props.alt).toBe('Sample image');
    });

    it('should generate default style for Image', () => {
      const dbComponent = {
        id: 'img-1',
        type: 'image' as const,
        props: { src: '', alt: '' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.width).toBe('100%');
      expect(result.style.height).toBe('auto');
      expect(result.style.borderRadius).toBe('0.5rem');
    });

    it('should handle empty src and alt', () => {
      const dbComponent = {
        id: 'img-1',
        type: 'image' as const,
        props: {},
      };

      const result = convertOldToNew(dbComponent);

      expect(result.props.src).toBe('');
      expect(result.props.alt).toBe('');
    });
  });

  describe('convertOldToNew - Button component', () => {
    it('should convert button to Button with correct props', () => {
      const dbComponent = {
        id: 'btn-1',
        type: 'button' as const,
        props: {
          text: 'Click Me',
          href: '/action',
          variant: 'primary',
        },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.id).toBe('btn-1');
      expect(result.type).toBe('Button');
      expect(result.props.text).toBe('Click Me');
      expect(result.props.href).toBe('/action');
      expect(result.props.variant).toBe('primary');
    });

    it('should generate default style for Button', () => {
      const dbComponent = {
        id: 'btn-1',
        type: 'button' as const,
        props: { text: 'Button' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.padding).toBe('0.5rem 1rem');
      expect(result.style.borderRadius).toBe('0.375rem');
    });

    it('should handle default href', () => {
      const dbComponent = {
        id: 'btn-1',
        type: 'button' as const,
        props: { text: 'Button' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.props.href).toBe('#');
    });
  });

  describe('convertOldToNew - Form component', () => {
    it('should convert form to Form with correct props', () => {
      const dbComponent = {
        id: 'form-1',
        type: 'form' as const,
        props: {
          submitText: 'Submit Form',
          fields: [
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'message', type: 'text', label: 'Message', required: false },
          ],
        },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.id).toBe('form-1');
      expect(result.type).toBe('Form');
      expect(result.props.submitText).toBe('Submit Form');
      expect(Array.isArray(result.props.fields)).toBe(true);
      expect((result.props.fields as unknown[]).length).toBe(2);
      expect((result.props.fields as unknown[])[0]).toEqual({
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
      });
    });

    it('should generate default style for Form', () => {
      const dbComponent = {
        id: 'form-1',
        type: 'form' as const,
        props: { submitText: 'Submit' },
      };

      const result = convertOldToNew(dbComponent);

      expect(result.style.padding).toBe('1rem');
      expect(result.style.minHeight).toBe('150px');
    });

    it('should handle default submitText', () => {
      const dbComponent = {
        id: 'form-1',
        type: 'form' as const,
        props: {},
      };

      const result = convertOldToNew(dbComponent);

      expect(result.props.submitText).toBe('Submit');
    });
  });
});

describe('adapter - Store to DB conversions', () => {
  describe('convertNewToOld - Section to hero', () => {
    it('should convert Section to hero with correct props', () => {
      const storeComponent: CanvasComponent = {
        id: 'section-1',
        type: 'Section',
        props: {
          text: 'Welcome',
          subtitle: 'Subtitle text',
          ctaText: 'Get Started',
          ctaLink: '/signup',
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result).not.toBeNull();
      expect(result!.id).toBe('section-1');
      expect(result!.type).toBe('hero');
      expect(result!.props.title).toBe('Welcome');
      expect(result!.props.subtitle).toBe('Subtitle text');
      expect(result!.props.ctaText).toBe('Get Started');
      expect(result!.props.ctaLink).toBe('/signup');
    });

    it('should handle missing optional props with defaults', () => {
      const storeComponent: CanvasComponent = {
        id: 'section-1',
        type: 'Section',
        props: {},
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.props.title).toBe('');
      expect(result!.props.subtitle).toBe('');
      expect(result!.props.ctaLink).toBe('#');
    });
  });

  describe('convertNewToOld - Text component', () => {
    it('should convert Text to text with correct props', () => {
      const storeComponent: CanvasComponent = {
        id: 'text-1',
        type: 'Text',
        props: {
          text: 'Paragraph text',
          variant: 'paragraph',
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.id).toBe('text-1');
      expect(result!.type).toBe('text');
      expect(result!.props.content).toBe('Paragraph text');
      expect(result!.props.variant).toBe('paragraph');
      expect(result!.props.align).toBe('left');
    });

    it('should convert Heading to text', () => {
      const storeComponent: CanvasComponent = {
        id: 'heading-1',
        type: 'Heading',
        props: {
          text: 'Heading text',
          variant: 'h1',
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.type).toBe('text');
      expect(result!.props.content).toBe('Heading text');
      expect(result!.props.variant).toBe('h1');
    });
  });

  describe('convertNewToOld - Image component', () => {
    it('should convert Image to image with correct props', () => {
      const storeComponent: CanvasComponent = {
        id: 'img-1',
        type: 'Image',
        props: {
          src: 'https://example.com/image.jpg',
          alt: 'Test image',
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.id).toBe('img-1');
      expect(result!.type).toBe('image');
      expect(result!.props.src).toBe('https://example.com/image.jpg');
      expect(result!.props.alt).toBe('Test image');
      expect(result!.props.width).toBe(800);
      expect(result!.props.height).toBe(600);
    });
  });

  describe('convertNewToOld - Button component', () => {
    it('should convert Button to button with correct props', () => {
      const storeComponent: CanvasComponent = {
        id: 'btn-1',
        type: 'Button',
        props: {
          text: 'Click Me',
          href: '/action',
          variant: 'primary',
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.id).toBe('btn-1');
      expect(result!.type).toBe('button');
      expect(result!.props.text).toBe('Click Me');
      expect(result!.props.href).toBe('/action');
      expect(result!.props.variant).toBe('primary');
      expect(result!.props.size).toBe('md');
    });
  });

  describe('convertNewToOld - Form component', () => {
    it('should convert Form to form with correct props', () => {
      const storeComponent: CanvasComponent = {
        id: 'form-1',
        type: 'Form',
        props: {
          submitText: 'Submit Form',
          fields: [{ name: 'email', type: 'email', label: 'Email' }],
        },
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result!.id).toBe('form-1');
      expect(result!.type).toBe('form');
      expect(result!.props.submitText).toBe('Submit Form');
      expect(result!.props.fields).toHaveLength(1);
    });
  });

  describe('convertNewToOld - Unsupported types', () => {
    it('should return null for Container (not supported in DB)', () => {
      const storeComponent: CanvasComponent = {
        id: 'container-1',
        type: 'Container',
        props: {},
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result).toBeNull();
    });

    it('should return null for Grid (not supported in DB)', () => {
      const storeComponent: CanvasComponent = {
        id: 'grid-1',
        type: 'Grid',
        props: {},
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result).toBeNull();
    });

    it('should return null for Card (not supported in DB)', () => {
      const storeComponent: CanvasComponent = {
        id: 'card-1',
        type: 'Card',
        props: {},
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result).toBeNull();
    });

    it('should return null for Input (not supported in DB)', () => {
      const storeComponent: CanvasComponent = {
        id: 'input-1',
        type: 'Input',
        props: {},
        style: {},
        children: [],
      };

      const result = convertNewToOld(storeComponent);

      expect(result).toBeNull();
    });
  });
});

describe('adapter - Batch converters', () => {
  describe('convertArrayOldToNew', () => {
    it('should convert array of DB components to Store components', () => {
      const dbComponents = [
        {
          id: 'hero-1',
          type: 'hero' as const,
          props: { title: 'Welcome' },
        },
        {
          id: 'text-1',
          type: 'text' as const,
          props: { content: 'Description', variant: 'paragraph' },
        },
        {
          id: 'btn-1',
          type: 'button' as const,
          props: { text: 'Click' },
        },
      ];

      const result = convertArrayOldToNew(dbComponents);

      expect(result).toHaveLength(3);
      expect(result[0]!.type).toBe('Section');
      expect(result[1]!.type).toBe('Text');
      expect(result[2]!.type).toBe('Button');
    });

    it('should handle empty array', () => {
      const result = convertArrayOldToNew([]);
      expect(result).toEqual([]);
    });

    it('should preserve order', () => {
      const dbComponents = [
        { id: '1', type: 'button' as const, props: { text: 'First' } },
        { id: '2', type: 'text' as const, props: { content: 'Second' } },
        { id: '3', type: 'image' as const, props: { src: '', alt: '' } },
      ];

      const result = convertArrayOldToNew(dbComponents);

      expect(result[0]!.id).toBe('1');
      expect(result[1]!.id).toBe('2');
      expect(result[2]!.id).toBe('3');
    });
  });

  describe('convertArrayNewToOld', () => {
    it('should convert array of Store components to DB components', () => {
      const storeComponents: CanvasComponent[] = [
        {
          id: 'section-1',
          type: 'Section',
          props: { text: 'Welcome' },
          style: {},
          children: [],
        },
        {
          id: 'text-1',
          type: 'Text',
          props: { text: 'Description' },
          style: {},
          children: [],
        },
      ];

      const result = convertArrayNewToOld(storeComponents);

      expect(result).toHaveLength(2);
      expect(result[0]!.type).toBe('hero');
      expect(result[1]!.type).toBe('text');
    });

    it('should filter out unsupported component types', () => {
      const storeComponents: CanvasComponent[] = [
        {
          id: 'section-1',
          type: 'Section',
          props: { text: 'Welcome' },
          style: {},
          children: [],
        },
        {
          id: 'container-1',
          type: 'Container',
          props: {},
          style: {},
          children: [],
        },
        {
          id: 'button-1',
          type: 'Button',
          props: { text: 'Click' },
          style: {},
          children: [],
        },
        {
          id: 'grid-1',
          type: 'Grid',
          props: {},
          style: {},
          children: [],
        },
      ];

      const result = convertArrayNewToOld(storeComponents);

      expect(result).toHaveLength(2);
      expect(result[0]!.type).toBe('hero');
      expect(result[1]!.type).toBe('button');
    });

    it('should handle empty array', () => {
      const result = convertArrayNewToOld([]);
      expect(result).toEqual([]);
    });

    it('should handle array with all unsupported types', () => {
      const storeComponents: CanvasComponent[] = [
        {
          id: 'container-1',
          type: 'Container',
          props: {},
          style: {},
          children: [],
        },
        {
          id: 'grid-1',
          type: 'Grid',
          props: {},
          style: {},
          children: [],
        },
      ];

      const result = convertArrayNewToOld(storeComponents);

      expect(result).toEqual([]);
    });
  });
});

describe('adapter - Edge cases and validation', () => {
  it('should handle component with all empty props', () => {
    const dbComponent = {
      id: 'test-1',
      type: 'text' as const,
      props: {},
    };

    const result = convertOldToNew(dbComponent);

    expect(result.props.text).toBe('');
    expect(result.type).toBe('Text');
  });

  it('should generate children as empty array for all conversions', () => {
    const dbComponent = {
      id: 'test-1',
      type: 'hero' as const,
      props: { title: 'Test' },
    };

    const result = convertOldToNew(dbComponent);

    expect(result.children).toEqual([]);
    expect(Array.isArray(result.children)).toBe(true);
  });

  it('should preserve component IDs through round-trip conversion', () => {
    const originalId = 'unique-id-123';
    const storeComponent: CanvasComponent = {
      id: originalId,
      type: 'Button',
      props: { text: 'Test' },
      style: {},
      children: [],
    };

    const dbComponent = convertNewToOld(storeComponent);
    expect(dbComponent!.id).toBe(originalId);

    const backToStore = convertOldToNew(dbComponent!);
    expect(backToStore.id).toBe(originalId);
  });
});
