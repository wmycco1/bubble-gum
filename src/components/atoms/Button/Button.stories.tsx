/**
 * Button Component Storybook Stories
 * God-Tier Development Protocol 2025
 *
 * Interactive documentation and testing for Button component
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './Button';
import { AtomProvider } from '@/context/parameters/ParameterContext';

/**
 * Button component for user actions and interactions.
 *
 * ## Features
 * - Multiple variants (primary, secondary, outline, ghost, danger)
 * - Four sizes (sm, md, lg, xl)
 * - Loading state with spinner
 * - Icon support (left/right)
 * - Full accessibility (WCAG 2.2 AA)
 * - Context API integration
 *
 * ## Usage
 * ```tsx
 * <Button text="Click me" variant="primary" onClick={() => alert('Clicked!')} />
 * ```
 */
const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. Supports loading indicators, icons, and full keyboard accessibility.',
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text label',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual variant of the button',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'HTML button type attribute',
      table: {
        type: { summary: 'button | submit | reset' },
        defaultValue: { summary: 'button' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loading: {
      control: 'boolean',
      description: 'Loading state (shows spinner)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'Full width button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    leftIcon: {
      control: 'text',
      description: 'Icon to display before text',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    rightIcon: {
      control: 'text',
      description: 'Icon to display after text',
      table: {
        type: { summary: 'React.ReactNode' },
      },
    },
    onClick: {
      description: 'Click handler',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ============================================
// BASIC STORIES
// ============================================

/**
 * Default button with primary variant and medium size
 */
export const Default: Story = {
  args: {
    text: 'Button',
  },
};

/**
 * Primary button - Use for main actions
 */
export const Primary: Story = {
  args: {
    text: 'Primary Button',
    variant: 'primary',
  },
};

/**
 * Secondary button - Use for secondary actions
 */
export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    variant: 'secondary',
  },
};

/**
 * Outline button - Use for tertiary actions
 */
export const Outline: Story = {
  args: {
    text: 'Outline Button',
    variant: 'outline',
  },
};

/**
 * Ghost button - Use for subtle actions
 */
export const Ghost: Story = {
  args: {
    text: 'Ghost Button',
    variant: 'ghost',
  },
};

/**
 * Danger button - Use for destructive actions (delete, remove, etc.)
 */
export const Danger: Story = {
  args: {
    text: 'Delete',
    variant: 'danger',
  },
};

// ============================================
// SIZE VARIANTS
// ============================================

/**
 * Small button - Compact UI, tight spaces
 */
export const Small: Story = {
  args: {
    text: 'Small Button',
    size: 'sm',
  },
};

/**
 * Medium button - Default size, most common
 */
export const Medium: Story = {
  args: {
    text: 'Medium Button',
    size: 'md',
  },
};

/**
 * Large button - Prominent actions, mobile
 */
export const Large: Story = {
  args: {
    text: 'Large Button',
    size: 'lg',
  },
};

/**
 * Extra Large button - Hero sections, CTAs
 */
export const ExtraLarge: Story = {
  args: {
    text: 'Extra Large Button',
    size: 'xl',
  },
};

// ============================================
// STATE VARIANTS
// ============================================

/**
 * Disabled button - Cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    text: 'Disabled Button',
    disabled: true,
  },
};

/**
 * Loading button - Shows spinner, prevents interaction
 */
export const Loading: Story = {
  args: {
    text: 'Loading...',
    loading: true,
  },
};

/**
 * Full width button - Spans entire container width
 */
export const FullWidth: Story = {
  args: {
    text: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// ============================================
// ICON VARIANTS
// ============================================

/**
 * Button with left icon
 */
export const WithLeftIcon: Story = {
  args: {
    text: 'Back',
    leftIcon: '←',
  },
};

/**
 * Button with right icon
 */
export const WithRightIcon: Story = {
  args: {
    text: 'Next',
    rightIcon: '→',
  },
};

/**
 * Button with both icons
 */
export const WithBothIcons: Story = {
  args: {
    text: 'Download',
    leftIcon: '⬇',
    rightIcon: '📁',
  },
};

/**
 * Icon button examples
 */
export const IconExamples: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button text="Save" leftIcon="💾" variant="primary" />
      <Button text="Delete" leftIcon="🗑️" variant="danger" />
      <Button text="Edit" leftIcon="✏️" variant="secondary" />
      <Button text="Share" leftIcon="↗" variant="outline" />
      <Button text="Download" leftIcon="⬇" variant="ghost" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// ============================================
// TYPE VARIANTS
// ============================================

/**
 * Submit button - Use in forms
 */
export const Submit: Story = {
  args: {
    text: 'Submit Form',
    type: 'submit',
    variant: 'primary',
  },
};

/**
 * Reset button - Use in forms
 */
export const Reset: Story = {
  args: {
    text: 'Reset Form',
    type: 'reset',
    variant: 'secondary',
  },
};

// ============================================
// COMBINATION EXAMPLES
// ============================================

/**
 * All variants showcase
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button text="Primary" variant="primary" />
        <Button text="Secondary" variant="secondary" />
        <Button text="Outline" variant="outline" />
        <Button text="Ghost" variant="ghost" />
        <Button text="Danger" variant="danger" />
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button text="Primary" variant="primary" disabled />
        <Button text="Secondary" variant="secondary" disabled />
        <Button text="Outline" variant="outline" disabled />
        <Button text="Ghost" variant="ghost" disabled />
        <Button text="Danger" variant="danger" disabled />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All sizes showcase
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Button text="Small" size="sm" />
      <Button text="Medium" size="md" />
      <Button text="Large" size="lg" />
      <Button text="Extra Large" size="xl" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Loading states for all variants
 */
export const LoadingStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button text="Loading..." variant="primary" loading />
      <Button text="Loading..." variant="secondary" loading />
      <Button text="Loading..." variant="outline" loading />
      <Button text="Loading..." variant="ghost" loading />
      <Button text="Loading..." variant="danger" loading />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// ============================================
// CONTEXT API EXAMPLES
// ============================================

/**
 * Button with Context API - Size inherited from provider
 */
export const WithContext: Story = {
  render: () => (
    <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Button text="Inherits size='lg' and variant='primary'" />
        <Button text="Overrides variant" variant="secondary" />
        <Button text="Overrides size" size="sm" />
      </div>
    </AtomProvider>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Buttons inherit size and variant from AtomProvider. Props override context values.',
      },
    },
  },
};

// ============================================
// REAL-WORLD EXAMPLES
// ============================================

/**
 * Form buttons group
 */
export const FormButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
      <Button text="Cancel" variant="ghost" />
      <Button text="Save Draft" variant="outline" />
      <Button text="Publish" variant="primary" type="submit" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Confirmation dialog buttons
 */
export const ConfirmationDialog: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
      <Button text="Cancel" variant="ghost" />
      <Button text="Delete" variant="danger" leftIcon="🗑️" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Navigation buttons
 */
export const Navigation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
      <Button text="Previous" variant="outline" leftIcon="←" />
      <Button text="Next" variant="primary" rightIcon="→" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Action buttons toolbar
 */
export const Toolbar: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button text="Save" leftIcon="💾" size="sm" variant="ghost" />
      <Button text="Edit" leftIcon="✏️" size="sm" variant="ghost" />
      <Button text="Share" leftIcon="↗" size="sm" variant="ghost" />
      <Button text="Delete" leftIcon="🗑️" size="sm" variant="ghost" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * CTA button - Hero section
 */
export const CallToAction: Story = {
  args: {
    text: 'Get Started Free',
    variant: 'primary',
    size: 'xl',
    rightIcon: '→',
  },
};

/**
 * Loading async action
 */
export const AsyncAction: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <Button
        text={loading ? 'Saving...' : 'Save Changes'}
        loading={loading}
        onClick={handleClick}
        variant="primary"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click to simulate async action with loading state',
      },
    },
  },
};

// ============================================
// ACCESSIBILITY EXAMPLES
// ============================================

/**
 * Accessible button with custom labels
 */
export const AccessibleExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <Button text="×" aria-label="Close dialog" variant="ghost" />
      <Button text="?" aria-label="Help and support" variant="outline" />
      <Button
        text="Delete Account"
        aria-label="Permanently delete your account"
        variant="danger"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'Examples of buttons with custom aria-label for better screen reader support',
      },
    },
  },
};

// Import React for AsyncAction story
import React from 'react';
