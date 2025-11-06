# Storybook Setup Guide

**Purpose:** Complete guide for setting up and using Storybook in Bubble Gum project
**Protocol:** God-Tier Development Protocol 2025
**Target:** Interactive component documentation with 5+ variants per component

---

## 📊 Storybook Stack

### Core Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Storybook** | 8+ | Component development environment |
| **@storybook/react** | 8+ | React integration |
| **@storybook/addon-essentials** | 8+ | Core addons bundle |
| **@storybook/addon-interactions** | 8+ | Interaction testing |
| **@storybook/addon-a11y** | 8+ | Accessibility testing |
| **@storybook/test** | 8+ | Testing utilities |

---

## 🚀 Installation

### Step 1: Install Storybook

```bash
# Initialize Storybook (auto-detects React)
npx storybook@latest init

# Or install manually
npm install --save-dev \
  @storybook/react \
  @storybook/addon-essentials \
  @storybook/addon-interactions \
  @storybook/addon-a11y \
  @storybook/test \
  storybook
```

### Step 2: Configure Storybook

Create `.storybook/main.ts`:

```typescript
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  // Story file patterns
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  // Addons
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],

  // Framework
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Documentation
  docs: {
    autodocs: 'tag',
  },

  // Vite configuration
  viteFinal: async (config) => {
    // Add path aliases
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    return config;
  },
};

export default config;
```

### Step 3: Configure Preview

Create `.storybook/preview.ts`:

```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/globals.css'; // Import global styles

const preview: Preview = {
  // Parameters
  parameters: {
    // Actions addon configuration
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Controls addon configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Layout options
    layout: 'centered', // centered, fullscreen, padded

    // Accessibility addon configuration
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'landmark-one-main',
            enabled: false, // Disable for components
          },
        ],
      },
    },

    // Viewport addon configuration
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1920px', height: '1080px' },
        },
      },
    },
  },

  // Global decorators
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
```

### Step 4: Add Scripts to package.json

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "storybook:ci": "storybook build --quiet"
  }
}
```

---

## 📝 Writing Stories

### Story Template (CSF 3.0)

```typescript
/**
 * ComponentName Stories
 * God-Tier Development Protocol 2025
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ComponentName } from './ComponentName';

/**
 * ComponentName component description
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * ## Usage
 * ```tsx
 * <ComponentName prop="value" />
 * ```
 */
const meta: Meta<typeof ComponentName> = {
  title: 'Atoms/ComponentName', // Category/ComponentName
  component: ComponentName,
  tags: ['autodocs'], // Enable auto-documentation
  parameters: {
    layout: 'centered', // centered, fullscreen, padded
    docs: {
      description: {
        component: 'Detailed component description here.',
      },
    },
  },
  argTypes: {
    // Define controls
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Visual variant of the component',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the component',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    text: {
      control: 'text',
      description: 'Component text',
    },
  },
  args: {
    // Default args for all stories
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// ============================================
// STORIES
// ============================================

/**
 * Default story with basic props
 */
export const Default: Story = {
  args: {
    text: 'Component',
  },
};

/**
 * Primary variant - Use for main actions
 */
export const Primary: Story = {
  args: {
    text: 'Primary',
    variant: 'primary',
  },
};

/**
 * Interactive story with custom render
 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);

    return (
      <ComponentName
        text={`Clicked ${count} times`}
        onClick={() => setCount(count + 1)}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click to increment counter',
      },
    },
  },
};

// Import React for interactive stories
import React from 'react';
```

---

## 🎯 Story Patterns

### Pattern 1: Basic Variants

```typescript
export const Primary: Story = {
  args: {
    text: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    text: 'Outline Button',
    variant: 'outline',
  },
};
```

### Pattern 2: State Variants

```typescript
export const Disabled: Story = {
  args: {
    text: 'Disabled',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    text: 'Loading...',
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    text: 'Error State',
    error: 'Something went wrong',
  },
};
```

### Pattern 3: Combination Showcases

```typescript
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button text="Primary" variant="primary" />
      <Button text="Secondary" variant="secondary" />
      <Button text="Outline" variant="outline" />
      <Button text="Ghost" variant="ghost" />
      <Button text="Danger" variant="danger" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button text="Small" size="sm" />
      <Button text="Medium" size="md" />
      <Button text="Large" size="lg" />
      <Button text="XL" size="xl" />
    </div>
  ),
};
```

### Pattern 4: Interactive Stories

```typescript
export const AsyncAction: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);

    const handleClick = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };

    return (
      <Button
        text={loading ? 'Saving...' : 'Save'}
        loading={loading}
        onClick={handleClick}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Click to simulate async action with 2-second delay',
      },
    },
  },
};
```

### Pattern 5: Context API Stories

```typescript
export const WithContext: Story = {
  render: () => (
    <AtomProvider value={{ size: 'lg', variant: 'primary' }}>
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <Button text="Inherits context" />
        <Button text="Overrides variant" variant="secondary" />
      </div>
    </AtomProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates Context API parameter inheritance',
      },
    },
  },
};
```

### Pattern 6: Real-World Examples

```typescript
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
    docs: {
      description: {
        story: 'Typical form button group pattern',
      },
    },
  },
};
```

---

## 🏃 Running Storybook

### Start Development Server

```bash
npm run storybook
```

Opens at `http://localhost:6006`

### Build Static Version

```bash
npm run build-storybook
```

Outputs to `storybook-static/`

### Deploy to Vercel/Netlify

```bash
# Build
npm run build-storybook

# Deploy storybook-static/ folder
```

---

## 🎨 Addons

### Essential Addons (Included)

1. **Controls** - Interactive props editor
2. **Actions** - Event handler logging
3. **Docs** - Auto-generated documentation
4. **Viewport** - Responsive testing
5. **Backgrounds** - Background color testing
6. **Toolbars** - Custom toolbar items

### Accessibility Addon

```typescript
// Already configured in preview.ts
parameters: {
  a11y: {
    config: {
      rules: [
        { id: 'color-contrast', enabled: true },
        { id: 'label', enabled: true },
      ],
    },
  },
}
```

**Usage:**
- Click "Accessibility" tab
- View violations
- Get WCAG guidelines
- Fix issues

### Interactions Addon

```typescript
import { userEvent, within } from '@storybook/test';

export const TestInteractions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await userEvent.click(button);
    // Add assertions
  },
};
```

---

## 📚 Documentation

### Auto-Generated Docs

Enable with `tags: ['autodocs']`:

```typescript
const meta: Meta<typeof Component> = {
  title: 'Atoms/Component',
  component: Component,
  tags: ['autodocs'], // ← Enable auto-docs
};
```

### Custom Documentation

Create `ComponentName.mdx`:

```mdx
import { Meta, Canvas, Story } from '@storybook/blocks';
import * as ComponentStories from './ComponentName.stories';

<Meta of={ComponentStories} />

# ComponentName

Description of component.

## Examples

<Canvas of={ComponentStories.Default} />

## Props

Component props table auto-generated from argTypes.

## Usage

```tsx
import { ComponentName } from '@/components/atoms/ComponentName';

<ComponentName prop="value" />
```
```

---

## ✅ Best Practices

### 1. Organize Stories by Category

```typescript
// Atomic Design structure
title: 'Atoms/Button'
title: 'Molecules/Card'
title: 'Organisms/Hero'
title: 'Templates/Container'
```

### 2. Use Meaningful Story Names

**✅ Good:**
```typescript
export const PrimaryLarge: Story = { ... }
export const DisabledWithIcon: Story = { ... }
export const LoadingState: Story = { ... }
```

**❌ Bad:**
```typescript
export const Story1: Story = { ... }
export const Test: Story = { ... }
```

### 3. Add Descriptions

```typescript
const meta: Meta<typeof Component> = {
  parameters: {
    docs: {
      description: {
        component: 'Detailed description with features and usage.',
      },
    },
  },
};

export const Primary: Story = {
  parameters: {
    docs: {
      description: {
        story: 'When to use this variant.',
      },
    },
  },
};
```

### 4. Use Controls Wisely

```typescript
argTypes: {
  // Good: Provide options for select
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
  },

  // Good: Appropriate control type
  disabled: {
    control: 'boolean',
  },

  // Avoid: Don't control functions
  onClick: {
    control: false, // Disable control for functions
  },
}
```

### 5. Show Real-World Examples

```typescript
export const LoginForm: Story = {
  render: () => (
    <form>
      <Input label="Email" type="email" />
      <Input label="Password" type="password" />
      <Button text="Sign In" type="submit" variant="primary" />
    </form>
  ),
};
```

---

## 🚨 Common Issues

### Issue 1: "Module not found: '@/...'"

**Solution:** Check Vite alias configuration in `.storybook/main.ts`:

```typescript
viteFinal: async (config) => {
  config.resolve.alias = {
    '@': path.resolve(__dirname, '../src'),
  };
  return config;
},
```

### Issue 2: Styles not loading

**Solution:** Import global styles in `.storybook/preview.ts`:

```typescript
import '../src/styles/globals.css';
```

### Issue 3: Context providers needed

**Solution:** Add decorator in `.storybook/preview.ts`:

```typescript
decorators: [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
],
```

### Issue 4: Images not loading

**Solution:** Add static directory to `.storybook/main.ts`:

```typescript
staticDirs: ['../public'],
```

---

## 📊 Storybook Checklist

Per component:

- [ ] Component story file created (`*.stories.tsx`)
- [ ] Meta configuration complete
- [ ] ArgTypes defined for all props
- [ ] Default story created
- [ ] ≥5 variant stories
- [ ] State variations (loading, disabled, error)
- [ ] Interactive examples (if applicable)
- [ ] Real-world usage examples
- [ ] Accessibility tab shows 0 violations
- [ ] Documentation descriptions added
- [ ] Controls work correctly
- [ ] Responsive tested (viewport addon)

---

## 📚 Resources

### Documentation
- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [Component Story Format](https://storybook.js.org/docs/react/api/csf)
- [Addons](https://storybook.js.org/docs/react/configure/storybook-addons)

### Examples
- [Design Systems for Storybook](https://storybook.js.org/showcase)
- [Storybook Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction#best-practices)

---

**Guide Version:** 1.0.0
**Last Updated:** November 6, 2025
**Follows:** God-Tier Development Protocol 2025
