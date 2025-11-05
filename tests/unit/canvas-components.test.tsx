// ═══════════════════════════════════════════════════════════════
// CANVAS COMPONENTS TESTS
// ═══════════════════════════════════════════════════════════════
// Tests for new canvas components (Heading, Link, Icon, Textarea, Checkbox, Submit)
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeadingComponent } from '@/components/canvas/HeadingComponent';
import { LinkComponent } from '@/components/canvas/LinkComponent';
import { IconComponent } from '@/components/canvas/IconComponent';
import { TextareaComponent } from '@/components/canvas/TextareaComponent';
import { CheckboxComponent } from '@/components/canvas/CheckboxComponent';
import { SubmitComponent } from '@/components/canvas/SubmitComponent';
import type { CanvasComponent } from '@/lib/editor/types';

describe('Canvas Components - New Components', () => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // HeadingComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('HeadingComponent', () => {
    it('should render h2 by default', () => {
      const component: CanvasComponent = {
        id: 'test-1',
        type: 'Heading',
        props: { text: 'Test Heading' },
        style: {},
      };

      render(<HeadingComponent component={component} />);
      const heading = screen.getByText('Test Heading');
      expect(heading.tagName).toBe('H2');
    });

    it('should render different heading levels', () => {
      const levels: Array<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      levels.forEach((level) => {
        const component: CanvasComponent = {
          id: `test-${level}`,
          type: 'Heading',
          props: { text: `Heading ${level}`, level },
          style: {},
        };

        const { unmount } = render(<HeadingComponent component={component} />);
        const heading = screen.getByText(`Heading ${level}`);
        expect(heading.tagName).toBe(level.toUpperCase());
        unmount();
      });
    });

    it('should apply alignment classes', () => {
      const component: CanvasComponent = {
        id: 'test-align',
        type: 'Heading',
        props: { text: 'Centered', align: 'center' },
        style: {},
      };

      render(<HeadingComponent component={component} />);
      const heading = screen.getByText('Centered');
      expect(heading.className).toContain('text-center');
    });

    it('should use default text if not provided', () => {
      const component: CanvasComponent = {
        id: 'test-default',
        type: 'Heading',
        props: {},
        style: {},
      };

      render(<HeadingComponent component={component} />);
      expect(screen.getByText('Your Heading')).toBeInTheDocument();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LinkComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('LinkComponent', () => {
    it('should render link with text and href', () => {
      const component: CanvasComponent = {
        id: 'test-link',
        type: 'Link',
        props: { text: 'Click here', href: 'https://example.com' },
        style: {},
      };

      render(<LinkComponent component={component} />);
      const link = screen.getByText('Click here');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should open external links in new tab', () => {
      const component: CanvasComponent = {
        id: 'test-external',
        type: 'Link',
        props: { text: 'External', href: 'https://example.com', external: true },
        style: {},
      };

      render(<LinkComponent component={component} />);
      const link = screen.getByText('External');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should not have target for internal links', () => {
      const component: CanvasComponent = {
        id: 'test-internal',
        type: 'Link',
        props: { text: 'Internal', href: '/about', external: false },
        style: {},
      };

      render(<LinkComponent component={component} />);
      const link = screen.getByText('Internal');
      expect(link).not.toHaveAttribute('target');
    });

    it('should apply variant classes', () => {
      const component: CanvasComponent = {
        id: 'test-variant',
        type: 'Link',
        props: { text: 'Primary Link', variant: 'primary' },
        style: {},
      };

      render(<LinkComponent component={component} />);
      const link = screen.getByText('Primary Link');
      expect(link.className).toContain('text-indigo-600');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // IconComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('IconComponent', () => {
    it('should render star icon by default', () => {
      const component: CanvasComponent = {
        id: 'test-icon',
        type: 'Icon',
        props: {},
        style: {},
      };

      const { container } = render(<IconComponent component={component} />);
      // Icon renders as SVG
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should handle size prop as string', () => {
      const component: CanvasComponent = {
        id: 'test-size-string',
        type: 'Icon',
        props: { icon: 'star', size: '48' },
        style: {},
      };

      const { container } = render(<IconComponent component={component} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '48');
      expect(svg).toHaveAttribute('height', '48');
    });

    it('should handle size prop as number', () => {
      const component: CanvasComponent = {
        id: 'test-size-number',
        type: 'Icon',
        props: { icon: 'star', size: '32' },
        style: {},
      };

      const { container } = render(<IconComponent component={component} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('should use default size if not provided', () => {
      const component: CanvasComponent = {
        id: 'test-default-size',
        type: 'Icon',
        props: { icon: 'heart' },
        style: {},
      };

      const { container } = render(<IconComponent component={component} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '24');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // TextareaComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('TextareaComponent', () => {
    it('should render textarea with label', () => {
      const component: CanvasComponent = {
        id: 'test-textarea',
        type: 'Textarea',
        props: { label: 'Message', placeholder: 'Enter message...' },
        style: {},
      };

      render(<TextareaComponent component={component} />);
      expect(screen.getByText('Message')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter message...')).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      const component: CanvasComponent = {
        id: 'test-required',
        type: 'Textarea',
        props: { label: 'Required Field', required: true },
        style: {},
      };

      render(<TextareaComponent component={component} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should set rows attribute', () => {
      const component: CanvasComponent = {
        id: 'test-rows',
        type: 'Textarea',
        props: { rows: 10 },
        style: {},
      };

      const { container } = render(<TextareaComponent component={component} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveAttribute('rows', '10');
    });

    it('should use default rows if not provided', () => {
      const component: CanvasComponent = {
        id: 'test-default-rows',
        type: 'Textarea',
        props: {},
        style: {},
      };

      const { container } = render(<TextareaComponent component={component} />);
      const textarea = container.querySelector('textarea');
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CheckboxComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('CheckboxComponent', () => {
    it('should render checkbox with label', () => {
      const component: CanvasComponent = {
        id: 'test-checkbox',
        type: 'Checkbox',
        props: { label: 'Accept terms' },
        style: {},
      };

      render(<CheckboxComponent component={component} />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      const component: CanvasComponent = {
        id: 'test-required-checkbox',
        type: 'Checkbox',
        props: { label: 'Required checkbox', required: true },
        style: {},
      };

      render(<CheckboxComponent component={component} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should be checked by default if defaultChecked is true', () => {
      const component: CanvasComponent = {
        id: 'test-default-checked',
        type: 'Checkbox',
        props: { label: 'Pre-checked', defaultChecked: true },
        style: {},
      };

      const { container } = render(<CheckboxComponent component={component} />);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeChecked();
    });

    it('should not be checked by default if defaultChecked is false', () => {
      const component: CanvasComponent = {
        id: 'test-not-checked',
        type: 'Checkbox',
        props: { label: 'Not checked', defaultChecked: false },
        style: {},
      };

      const { container } = render(<CheckboxComponent component={component} />);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).not.toBeChecked();
    });
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SubmitComponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  describe('SubmitComponent', () => {
    it('should render submit button with text', () => {
      const component: CanvasComponent = {
        id: 'test-submit',
        type: 'Submit',
        props: { text: 'Send' },
        style: {},
      };

      render(<SubmitComponent component={component} />);
      const button = screen.getByText('Send');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should use default text if not provided', () => {
      const component: CanvasComponent = {
        id: 'test-default-text',
        type: 'Submit',
        props: {},
        style: {},
      };

      render(<SubmitComponent component={component} />);
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('should apply variant classes', () => {
      const component: CanvasComponent = {
        id: 'test-variant-submit',
        type: 'Submit',
        props: { text: 'Save', variant: 'success' },
        style: {},
      };

      render(<SubmitComponent component={component} />);
      const button = screen.getByText('Save');
      expect(button.className).toContain('bg-green-600');
    });

    it('should apply size classes', () => {
      const component: CanvasComponent = {
        id: 'test-size-submit',
        type: 'Submit',
        props: { text: 'Large Button', size: 'lg' },
        style: {},
      };

      render(<SubmitComponent component={component} />);
      const button = screen.getByText('Large Button');
      expect(button.className).toContain('px-8 py-3 text-lg');
    });

    it('should apply full width class', () => {
      const component: CanvasComponent = {
        id: 'test-fullwidth',
        type: 'Submit',
        props: { text: 'Full Width', fullWidth: true },
        style: {},
      };

      render(<SubmitComponent component={component} />);
      const button = screen.getByText('Full Width');
      expect(button.className).toContain('w-full');
    });
  });
});
