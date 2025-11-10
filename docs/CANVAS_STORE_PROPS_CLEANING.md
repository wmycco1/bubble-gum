# Canvas Store Props Cleaning

## Problem

When updating component props in the canvas store, empty string values (`''`) were persisting in the component state. This caused issues where:

1. User changes a variant from "primary" to "error"
2. PropertiesPanel clears custom `color` and `backgroundColor` by setting them to `''`
3. Canvas store merges props: `{ variant: 'error', color: '', backgroundColor: '' }`
4. Empty strings are **valid values** in JavaScript, so they don't get removed
5. Component receives `color: ''` and `backgroundColor: ''`
6. These empty strings override variant preset colors via `!important` CSS

## Solution

### 1. Created `cleanEmptyProps` utility function

```typescript
/**
 * Remove props with empty string values from an object.
 * This prevents empty strings from overriding default/variant values.
 */
const cleanEmptyProps = <T extends Record<string, any>>(props: T): T => {
  const cleaned = { ...props };
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === '') {
      delete cleaned[key];
    }
  });
  return cleaned;
};
```

**Location:** `/var/www/bubble-gum/lib/editor/canvas-store.ts` (lines 56-74)

### 2. Applied to `updateComponent` method

```typescript
updateComponent: (id, updates) => {
  set((state) => {
    const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
      return comps.map((comp) => {
        if (comp.id === id) {
          const merged = { ...comp, ...updates };

          // CRITICAL FIX: Remove props with empty string values
          if (updates.props) {
            merged.props = cleanEmptyProps(merged.props);
          }

          return merged;
        }
        // ... rest
      });
    };
    // ... rest
  });
}
```

**Location:** `/var/www/bubble-gum/lib/editor/canvas-store.ts` (lines 1507-1535)

### 3. Applied to `updateComponentProps` method

```typescript
updateComponentProps: (id, props) => {
  set((state) => {
    const updateInTree = (comps: CanvasComponent[]): CanvasComponent[] => {
      return comps.map((comp) => {
        if (comp.id === id) {
          // Merge props and clean empty strings
          const mergedProps = { ...comp.props, ...props };
          const cleanedProps = cleanEmptyProps(mergedProps);

          const updated = { ...comp, props: cleanedProps };
          return updated;
        }
        // ... rest
      });
    };
    // ... rest
  });
}
```

**Location:** `/var/www/bubble-gum/lib/editor/canvas-store.ts` (lines 1751-1789)

## How It Works

### Before Fix

```javascript
// User changes variant from "primary" to "error"
PropertiesPanel sends: {
  variant: 'error',
  color: '',           // ← Empty string to clear
  backgroundColor: '', // ← Empty string to clear
}

// Canvas store merges (OLD behavior):
oldProps = { variant: 'primary', color: '#ff0000', backgroundColor: '#0000ff' }
updates  = { variant: 'error', color: '', backgroundColor: '' }
result   = { variant: 'error', color: '', backgroundColor: '' } // ❌ Empty strings persist!

// Prisma saves to DB: { variant: 'error', color: '', backgroundColor: '' }
// Badge component receives empty strings and applies them via !important
// Result: Variant colors don't show
```

### After Fix

```javascript
// User changes variant from "primary" to "error"
PropertiesPanel sends: {
  variant: 'error',
  color: '',           // ← Empty string to clear
  backgroundColor: '', // ← Empty string to clear
}

// Canvas store merges and cleans (NEW behavior):
oldProps = { variant: 'primary', color: '#ff0000', backgroundColor: '#0000ff' }
updates  = { variant: 'error', color: '', backgroundColor: '' }
merged   = { variant: 'error', color: '', backgroundColor: '' }
cleaned  = { variant: 'error' } // ✅ Empty strings DELETED!

// Prisma saves to DB: { variant: 'error' } (no color/backgroundColor)
// Badge component receives only variant, applies preset colors
// Result: Variant colors work perfectly!
```

## Related Components

### PropertiesPanelV2.tsx

Clears `color` and `backgroundColor` when `variant` changes:

```typescript
const handleParameterChange = (paramName: string, value: any) => {
  if (!selectedComponent) return;

  const updatedProps: Record<string, any> = {
    ...selectedComponent.props,
    [paramName]: value,
  };

  // If changing variant, clear color and backgroundColor
  if (paramName === 'variant') {
    updatedProps.color = '';
    updatedProps.backgroundColor = '';
  }

  updateComponent(selectedComponent.id, {
    props: updatedProps,
  });
};
```

**Location:** `/var/www/bubble-gum/components/editor/properties-panel-v2/PropertiesPanelV2.tsx` (lines 29-47)

### Badge.tsx V6.6

Clears inline styles before applying new ones:

```typescript
React.useEffect(() => {
  if (spanRef.current) {
    // Clear previous inline color/background/border styles
    spanRef.current.style.color = '';
    spanRef.current.style.backgroundColor = '';
    spanRef.current.style.borderWidth = '';
    spanRef.current.style.borderStyle = '';
    spanRef.current.style.borderColor = '';

    // Apply new styles if any
    if (inlineStyleString) {
      spanRef.current.style.cssText += '; ' + inlineStyleString;
    }
  }
}, [inlineStyleString]);
```

**Location:** `/var/www/bubble-gum/src/components/atoms/Badge/Badge.tsx` (lines 212-226)

## Testing

To verify the fix works:

1. Add a Badge component to canvas
2. Set custom colors (Text Color + Background Color)
3. Change Variant multiple times: default → primary → success → warning → error
4. Verify that variant colors show correctly each time
5. Check browser console for `Badge V6.6 [style clearing]` logs
6. Check database to confirm no empty string values are saved

## Future Prevention

This utility function (`cleanEmptyProps`) is now centralized and used in all prop update methods. Any future methods that update component props should also use this utility to prevent similar issues.

## Version History

- **v1.0** (2025-11-10): Initial implementation
  - Created `cleanEmptyProps` utility
  - Applied to `updateComponent`
  - Applied to `updateComponentProps`
  - Documented solution

## Related Files

- `/var/www/bubble-gum/lib/editor/canvas-store.ts` - Main store with utility
- `/var/www/bubble-gum/components/editor/properties-panel-v2/PropertiesPanelV2.tsx` - Props clearing
- `/var/www/bubble-gum/src/components/atoms/Badge/Badge.tsx` - Style clearing
- `/var/www/bubble-gum/components/editor/properties-panel-v2/componentParametersMap.ts` - Parameter definitions

## Author

Fixed by: Claude AI
Date: November 10, 2025
Issue: Badge variant colors not working after multiple changes
