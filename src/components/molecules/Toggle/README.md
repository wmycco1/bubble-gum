# Toggle Component

**Type:** Molecule
**Status:** ✅ Production Ready
**Last Updated:** 2025-11-07

## Overview

A professional toggle switch component for on/off states. Fully accessible, customizable, and supports labels, disabled states, and keyboard navigation.

## Features

- 🔘 **Switch Toggle**: Smooth on/off animations
- 🏷️ **Labels**: Optional labels with configurable positioning
- 🎨 **Size Variants**: sm, md, lg
- 🚫 **Disabled State**: Visual and functional disabled mode
- ♿ **Accessible**: WCAG AA compliant with ARIA attributes
- ⌨️ **Keyboard Navigation**: Full keyboard support
- 🌙 **Dark Mode**: Automatic theme switching
- 📱 **Responsive**: Works on all screen sizes
- 🎯 **Context API**: Parameter inheritance support
- 📋 **Form Integration**: Works seamlessly with forms

## Composition

This molecule is composed of:
- **Text Atom**: For label display
- Native checkbox input (visually hidden)
- Custom visual switch element

## Usage

### Basic Usage

```tsx
import { Toggle } from '@/components/molecules/Toggle';

// Simple toggle
<Toggle checked={isEnabled} onChange={setIsEnabled} />
```

### With Label

```tsx
const [notifications, setNotifications] = useState(false);

<Toggle
  checked={notifications}
  onChange={setNotifications}
  label="Enable notifications"
/>
```

### Label Positioning

```tsx
// Label on right (default)
<Toggle
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark mode"
  labelPosition="right"
/>

// Label on left
<Toggle
  checked={darkMode}
  onChange={setDarkMode}
  label="Dark mode"
  labelPosition="left"
/>
```

### Size Variants

```tsx
<Toggle checked={value} onChange={setValue} size="sm" />
<Toggle checked={value} onChange={setValue} size="md" /> {/* default */}
<Toggle checked={value} onChange={setValue} size="lg" />
```

### Disabled State

```tsx
<Toggle
  checked={true}
  disabled
  label="Read-only setting"
/>
```

### Form Integration

```tsx
<form onSubmit={handleSubmit}>
  <Toggle
    name="subscribe"
    checked={subscribe}
    onChange={setSubscribe}
    label="Subscribe to newsletter"
  />
  <button type="submit">Save</button>
</form>
```

### With Context API

```tsx
import { AtomProvider } from '@/context/parameters/ParameterContext';

<AtomProvider value={{ size: 'lg' }}>
  <Toggle checked={setting1} onChange={setSetting1} label="Setting 1" />
  <Toggle checked={setting2} onChange={setSetting2} label="Setting 2" />
</AtomProvider>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether toggle is on |
| `onChange` | `(checked: boolean) => void` | - | Callback when toggled |
| `disabled` | `boolean` | `false` | Disable interaction |
| `label` | `string` | - | Label text |
| `labelPosition` | `'left' \| 'right'` | `'right'` | Label position |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggle size |
| `className` | `string` | `''` | Additional CSS class |
| `aria-label` | `string` | - | Accessible label |
| `aria-describedby` | `string` | - | Description element ID |
| `data-testid` | `string` | `'toggle'` | Test ID |
| `id` | `string` | auto-generated | HTML ID attribute |
| `name` | `string` | - | Form field name |

## Examples

### Settings Panel

```tsx
const SettingsPanel = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: true,
    autoSave: true,
  });

  const updateSetting = (key: string) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings">
      <Toggle
        checked={settings.notifications}
        onChange={updateSetting('notifications')}
        label="Push notifications"
        size="lg"
      />
      <Toggle
        checked={settings.emailUpdates}
        onChange={updateSetting('emailUpdates')}
        label="Email updates"
        size="lg"
      />
      <Toggle
        checked={settings.darkMode}
        onChange={updateSetting('darkMode')}
        label="Dark mode"
        size="lg"
      />
      <Toggle
        checked={settings.autoSave}
        onChange={updateSetting('autoSave')}
        label="Auto-save"
        size="lg"
      />
    </div>
  );
};
```

### Feature Flags

```tsx
const FeatureFlags = () => {
  const [flags, setFlags] = useState({
    betaFeatures: false,
    analytics: true,
    debugging: false,
  });

  return (
    <div className="feature-flags">
      <Text as="h3">Developer Options</Text>

      <Toggle
        checked={flags.betaFeatures}
        onChange={(v) => setFlags(prev => ({ ...prev, betaFeatures: v }))}
        label="Beta features"
      />

      <Toggle
        checked={flags.analytics}
        onChange={(v) => setFlags(prev => ({ ...prev, analytics: v }))}
        label="Analytics"
      />

      <Toggle
        checked={flags.debugging}
        onChange={(v) => setFlags(prev => ({ ...prev, debugging: v }))}
        label="Debug mode"
      />
    </div>
  );
};
```

### Privacy Settings

```tsx
const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    allowMessages: true,
  });

  return (
    <div className="privacy-settings">
      <Toggle
        checked={privacy.profileVisible}
        onChange={(v) => setPrivacy(prev => ({ ...prev, profileVisible: v }))}
        label="Public profile"
        labelPosition="left"
      />

      <Toggle
        checked={privacy.showEmail}
        onChange={(v) => setPrivacy(prev => ({ ...prev, showEmail: v }))}
        label="Show email address"
        labelPosition="left"
      />

      <Toggle
        checked={privacy.allowMessages}
        onChange={(v) => setPrivacy(prev => ({ ...prev, allowMessages: v }))}
        label="Allow direct messages"
        labelPosition="left"
      />
    </div>
  );
};
```

### Disabled Toggle (Read-only)

```tsx
<Toggle
  checked={systemSetting}
  disabled
  label="System-managed setting (cannot be changed)"
  aria-describedby="system-setting-description"
/>
<Text id="system-setting-description" size="sm" color="muted">
  This setting is controlled by your system administrator
</Text>
```

## Accessibility

The component implements WCAG AA standards:

- **Keyboard Navigation**: Full keyboard support (Space, Enter)
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Indicators**: Visible focus states
- **Semantic HTML**: Uses native checkbox input
- **ARIA Attributes**:
  - `aria-label`: Describes the toggle
  - `aria-checked`: Indicates checked state
  - `aria-describedby`: Links to description element
  - `disabled`: Indicates disabled state

### Screen Reader Experience

```
"Enable notifications, toggle button, not checked"
"Enable notifications, toggle button, checked"
"Read-only setting, toggle button, checked, unavailable" (disabled)
```

## Styling

### CSS Variables

Customize the component appearance:

```css
.toggle {
  --toggle-bg-off: #e5e7eb;
  --toggle-bg-on: #3b82f6;
  --toggle-thumb-color: #ffffff;
  --toggle-border-color: transparent;
  --toggle-label-color: #374151;
  --toggle-disabled-opacity: 0.5;
  --toggle-focus-color: #3b82f6;
  --toggle-width-sm: 32px;
  --toggle-height-sm: 18px;
  --toggle-thumb-sm: 14px;
  --toggle-width-md: 44px;
  --toggle-height-md: 24px;
  --toggle-thumb-md: 20px;
  --toggle-width-lg: 56px;
  --toggle-height-lg: 30px;
  --toggle-thumb-lg: 26px;
  --toggle-label-gap: 12px;
  --toggle-thumb-offset: 2px;
  --toggle-transition: all 0.2s ease-in-out;
}
```

### Custom Styling

```tsx
<Toggle
  checked={value}
  onChange={setValue}
  className="custom-toggle"
  style={{ '--toggle-bg-on': '#10b981' } as React.CSSProperties}
/>
```

## Behavior

### Controlled Component

The Toggle is a controlled component - you must manage its state:

```tsx
const [checked, setChecked] = useState(false);

<Toggle checked={checked} onChange={setChecked} />
```

### Form Integration

Works seamlessly with HTML forms:

```tsx
<form onSubmit={handleSubmit}>
  <Toggle name="fieldName" checked={value} onChange={setValue} />
</form>
```

The `name` prop enables form data collection.

### Keyboard Interaction

- **Space**: Toggle on/off
- **Enter**: Toggle on/off
- **Tab**: Focus next/previous element

### Label Clicking

Clicking the label toggles the switch (same as clicking the switch itself).

## Performance

- **Memoization**: Uses `useCallback` for stable event handlers
- **Efficient Rendering**: Only re-renders on prop changes
- **Lightweight**: Minimal DOM elements
- **No External Dependencies**: Uses native HTML checkbox

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

```bash
npm test Toggle.test.tsx
```

**Coverage**: 95%+ (all branches covered)

### Test Cases

- Rendering with various props
- Checked/unchecked states
- Label positioning and clicking
- Size variants
- Disabled state
- User interactions (click, keyboard)
- Context API integration
- Accessibility (ARIA, focus, labels)
- Edge cases (undefined values, forms)

## Migration Guide

### From Canvas Component

```tsx
// Old (Canvas component - accordion/collapse)
<ToggleComponent
  component={{
    props: {
      items: [...],
    }
  }}
/>

// New (Molecule component - switch toggle)
<Toggle
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Feature name"
/>
```

**Note**: The old ToggleComponent was an accordion. This new Toggle is a switch.

## Related Components

- **Text** (Atom): Used for labels
- **Checkbox** (Atom): Similar input pattern
- **Radio** (Atom): Similar selection pattern

## Changelog

### v1.0.0 (2025-11-07)
- Initial release
- Full feature set
- 95%+ test coverage
- WCAG AA compliance

## Contributing

When modifying this component:
1. Update tests to maintain 90%+ coverage
2. Test accessibility with screen readers
3. Verify dark mode appearance
4. Test keyboard navigation
5. Update this README

## License

Part of Bubble Gum project - God-Tier Development Protocol 2025
