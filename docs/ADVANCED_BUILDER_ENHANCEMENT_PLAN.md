# 🚀 Advanced Component Builder Enhancement Plan

**Version:** 1.0.0
**Date:** November 05, 2025
**Status:** PHASE 1 COMPLETED - Awaiting User Approval
**Protocol:** God-Tier Development Protocol (2025)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 1: Current State Audit](#phase-1-current-state-audit)
3. [Phase 2: Detailed Implementation Plan](#phase-2-detailed-implementation-plan)
4. [Phase 3-5: Implementation Roadmap](#phase-3-5-implementation-roadmap)
5. [Technical Architecture](#technical-architecture)
6. [Quality Assurance](#quality-assurance)
7. [Timeline & Milestones](#timeline--milestones)

---

## 📊 Executive Summary

### Goals
Transform the existing Bubble Gum Builder into a **world-class, enterprise-grade component builder** with:
- 15+ new interactive components (Accordion, Tabs, Counter, Progress, Modals, etc.)
- Universal styling system (border-radius all corners, backgrounds with gradients/images)
- Canvas-based direct manipulation editing
- Collapsible/resizable panels with smooth animations
- Comprehensive property system for all components
- God-Tier code quality with 80%+ test coverage

### Current State Summary
✅ **Strengths:**
- Solid foundation with 20 existing components
- Well-architected Zustand store with Undo/Redo
- Excellent spacing controls (visual 4-side editor)
- Professional TypeScript types system
- Responsive breakpoints (Desktop/Tablet/Mobile)
- Auto-save with conflict resolution

⚠️ **Gaps to Address:**
- Limited interactive components (no Accordion/Tabs/Counter)
- No border-radius individual corners control
- No background image/gradient support
- No canvas-based direct manipulation
- Panels are not collapsible/resizable
- Many components lack advanced properties
- No component grouping/categories

---

## 🔍 PHASE 1: Current State Audit

### 1.1 Existing Components Analysis

#### **Currently Implemented (20 components):**

| Component | Properties Count | Missing Features |
|-----------|------------------|------------------|
| **Layout (4)** |
| Container | 4 (maxWidth, padding, backgroundColor, alignment) | ❌ Border radius corners, ❌ Background image |
| Section | 5 (text, subtitle, ctaText, ctaLink, backgroundImage) | ❌ Overlay opacity, ❌ Gradient |
| Grid | 3 (columns, columnWidths, gap) | ✅ Good coverage |
| Card | 4 (title, description, image, variant) | ❌ Border radius corners, ❌ Shadow controls |
| **Content (5)** |
| Text | 2 (text, variant) | ❌ Typography (font, size, weight), ❌ Shadows |
| Heading | 3 (text, level, align) | ❌ Typography controls |
| Image | 4 (src, alt, width, height) | ❌ Filters, ❌ Object-fit, ❌ Border radius |
| Link | 5 (text, href, variant, underline, external) | ✅ Good coverage |
| Icon | 3 (icon, size, color) | ❌ Stroke width, ❌ Rotation |
| **Interactive (1)** |
| Button | 4 (text, href, variant, size) | ❌ Icons, ❌ Loading state, ❌ Hover/Active states |
| **Forms (5)** |
| Form | 2 (submitText, fields) | ❌ Validation, ❌ Error states |
| Input | 5 (placeholder, type, name, required, label) | ❌ Icons, ❌ Validation states |
| Textarea | 5 (label, placeholder, name, required, rows) | ✅ Good coverage |
| Checkbox | 4 (label, name, required, defaultChecked) | ✅ Good coverage |
| Submit | 4 (text, variant, size, fullWidth) | ✅ Good coverage |
| **Navigation (3)** |
| Navbar | 2 (logo, links) | ❌ Mobile menu, ❌ Dropdown |
| Footer | 2 (copyright, links) | ❌ Social icons, ❌ Columns |
| Hero | 4 (title, subtitle, ctaText, ctaLink) | ❌ Background overlay, ❌ Image position |
| **Other (2)** |
| Features | 2 (title, features[]) | ✅ Good coverage |
| CTA | 4 (title, description, buttonText, buttonLink) | ✅ Good coverage |

**Total Properties Across All Components:** ~80 properties
**Average Properties per Component:** 4 properties
**Target:** 8-12 properties per component (100% increase)

---

### 1.2 Architecture Analysis

#### **State Management:** ✅ Excellent (Zustand)
```typescript
// canvas-store.ts
- Components tree with parent-child relationships
- Selection state (selected/hovered)
- History (undo/redo with zundo)
- UI state (isDragging, isResizing)
- Responsive breakpoints (desktop/tablet/mobile)
- localStorage persistence with conflict resolution
```

**Strengths:**
- Immutable updates
- Time-travel debugging
- Selective subscriptions for performance
- Type-safe with TypeScript

**Gaps:**
- No "isEditing" state for canvas-based editing
- No "panelCollapsed" state for collapsible panels

---

#### **Styling System:** ✅ Good (ComponentStyle interface)
```typescript
interface ComponentStyle {
  // Layout, Spacing, Typography, Background, Border, Effects
  // Responsive overrides: tablet?, mobile?
}
```

**Strengths:**
- Comprehensive properties (40+ CSS properties)
- Responsive breakpoints with inheritance
- Smart spacing utilities (removes conflicting Tailwind classes)

**Gaps:**
- No borderTopLeftRadius, borderTopRightRadius, etc. (individual corners)
- No gradients support (linear-gradient, radial-gradient)
- No backgroundBlendMode
- No filters (blur, brightness, contrast)
- No transforms individual (rotateX, rotateY, rotateZ)

---

#### **Properties Panel:** ✅ Good (PropertiesPanel.tsx)
```typescript
// Version: 3.1.0 - 1232 lines
// Covers all 20 components with switch-case
// Uses local state + debounced updates (300ms)
```

**Strengths:**
- Controlled inputs with no lag (local state fix)
- Atomic updates for Grid columns (fixed recently)
- Includes SpacingControls component

**Gaps:**
- No grouping/tabs for properties (all in one long list)
- No color picker component (uses basic `<input type="color">`)
- No gradient editor
- No border-radius visual editor (4 corners)
- No image upload component (only URL input + Image Library button)

---

#### **Canvas Rendering:** ✅ Excellent
```typescript
// Canvas.tsx + RenderComponent.tsx
// Responsive canvas widths
// Drag-and-drop with @dnd-kit/core
// Empty state with helpful message
```

**Strengths:**
- Clean component rendering
- Drag-and-drop from palette
- Responsive canvas widths
- Visual feedback (isOver states)

**Gaps:**
- No visual editing handles on canvas
- No bounding box with resize/rotate handles
- No inline property editors (click to edit text, etc.)
- No right-click context menu

---

#### **Component Palette:** ✅ Good (ComponentPalette.tsx)
```typescript
// Version: 3.0.0 - 100 lines
// Flat list of 20 components
// Drag OR click to add
```

**Strengths:**
- Supports both drag and click
- Visual drag feedback
- Clear descriptions

**Gaps:**
- No grouping/categories (all in one list)
- No icons (uses emoji)
- No search/filter
- No collapsible groups
- No compact mode

---

### 1.3 Code Quality Assessment

#### **TypeScript:** ✅ Excellent
- Strict mode enabled
- Explicit types for all interfaces
- Type-safe component props
- Generic utilities with proper typing

#### **Testing:** ❌ **CRITICAL GAP**
```bash
# Current test coverage: ~0%
# No unit tests found
# No integration tests
# No E2E tests
```

**Required:**
- Unit tests for all new components (target: 80%)
- Integration tests for drag-and-drop
- E2E tests for critical user flows

#### **Performance:** ✅ Good
- Selective Zustand subscriptions
- Debounced auto-save (10s)
- Smart spacing utilities (avoids unnecessary re-renders)
- Lazy loading (Next.js App Router)

**Potential Issues:**
- No memoization in PropertiesPanel (re-renders on every change)
- No virtualization for long component lists

#### **Accessibility:** ⚠️ Partial
- Semantic HTML in most components
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y, Delete, Escape)
- No ARIA labels on drag handles
- No screen reader announcements
- No focus management

---

## 🎯 PHASE 2: Detailed Implementation Plan

### 2.1 Milestone 1: Universal Styling System (Week 1-2)

#### **Goal:** Add border-radius (all corners) + backgrounds (color/gradient/image) to ALL components

#### **Tasks:**

**1. Extend TypeScript types** (`lib/editor/types.ts`)
```typescript
export interface ComponentStyle {
  // EXISTING...

  // NEW: Individual border radius
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;

  // NEW: Gradient support
  backgroundImage?: string; // 'linear-gradient(...)' or 'url(...)'
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundBlendMode?: string;

  // NEW: Filters
  filter?: string; // 'blur(5px) brightness(1.2)'
  backdropFilter?: string;
}
```

**2. Create BorderRadiusControl component** (`components/editor/BorderRadiusControl.tsx`)
```tsx
// Visual 4-corner editor (similar to SpacingControls)
// Inputs for: top-left, top-right, bottom-left, bottom-right
// Link/unlink toggle (all corners same value)
// Preview box showing border radius effect
```

**3. Create BackgroundControl component** (`components/editor/BackgroundControl.tsx`)
```tsx
// Mode toggle: Color / Gradient / Image
// Color mode: Color picker with opacity slider
// Gradient mode: Gradient editor (type, angle, stops)
// Image mode: Upload from computer + URL input + Image Library button
// Preview showing current background
```

**4. Create ColorPicker component** (`components/editor/ColorPicker.tsx`)
```tsx
// Professional color picker (use react-colorful or similar)
// Hex, RGB, HSL inputs
// Opacity slider
// Preset colors
// Eyedropper tool (if browser supports)
```

**5. Create GradientEditor component** (`components/editor/GradientEditor.tsx`)
```tsx
// Type: Linear / Radial
// Angle slider (for linear)
// Color stops editor (add/remove/reorder)
// Preview gradient
// CSS output display
```

**6. Create ImageUpload component** (`components/editor/ImageUpload.tsx`)
```tsx
// Drag-and-drop file upload
// Browse button
// URL input
// Image Library button
// Preview with remove button
// Support: JPG, PNG, WebP, GIF, SVG
```

**7. Update PropertiesPanel** (`components/editor/PropertiesPanel.tsx`)
```tsx
// Add BorderRadiusControl to ALL components (after Spacing)
// Add BackgroundControl to layout components (Container, Section, Card, etc.)
// Group controls into collapsible sections:
//   - Content
//   - Layout & Positioning
//   - Styling & Appearance
//   - Spacing
//   - Advanced
```

**8. Update all Canvas components** (20 files in `components/canvas/`)
```tsx
// Apply new style properties:
//   - borderTopLeftRadius, etc. → style object
//   - backgroundImage (gradient or image) → style object
//   - filter, backdropFilter → style object
// Ensure all components support these styles
```

**Testing:**
- Unit tests for each new control component
- Integration test: Set border-radius on Container, verify on canvas
- Integration test: Set gradient background, verify on canvas
- Integration test: Upload image, verify background-image applied

---

### 2.2 Milestone 2: New Interactive Components (Week 3-5)

#### **Goal:** Add 10+ new components with CRUD operations

#### **Components to Implement:**

**1. Accordion Component** (`components/canvas/AccordionComponent.tsx`)
```typescript
interface AccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  allowMultiple?: boolean; // Multiple panels open at once
  defaultOpen?: string[];  // IDs of initially open panels
  variant?: 'default' | 'bordered' | 'filled';
}

// Features:
// - Add/remove accordion items
// - Reorder items (drag handles)
// - Edit title/content inline
// - Expand/collapse animations
// - Icon customization (chevron, plus/minus)
```

**2. Tabs Component** (`components/canvas/TabsComponent.tsx`)
```typescript
interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: string;
    icon?: string;
  }>;
  defaultTab?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  closable?: boolean;
}

// Features:
// - Add/remove tabs
// - Reorder tabs (drag handles)
// - Edit label/content inline
// - Tab indicators
// - Closable tabs (X button)
```

**3. Counter Component** (`components/canvas/CounterComponent.tsx`)
```typescript
interface CounterProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Features:
// - Increment/decrement buttons
// - Keyboard support (up/down arrows)
// - Validation (min/max boundaries)
// - Custom step values
// - Number formatting
```

**4. Progress Bar Component** (`components/canvas/ProgressComponent.tsx`)
```typescript
interface ProgressProps {
  value: number; // 0-100
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
}
```

**5. Tooltip Component** (`components/canvas/TooltipComponent.tsx`)
```typescript
interface TooltipProps {
  text: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'hover' | 'click' | 'focus';
  delay?: number;
}
```

**6. Modal Component** (`components/canvas/ModalComponent.tsx`)
```typescript
interface ModalProps {
  title: string;
  content: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeButton?: boolean;
  backdrop?: boolean | 'static';
  centered?: boolean;
}
```

**7. Alert Component** (`components/canvas/AlertComponent.tsx`)
```typescript
interface AlertProps {
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
  dismissible?: boolean;
}
```

**8. Badge Component** (`components/canvas/BadgeComponent.tsx`)
```typescript
interface BadgeProps {
  text: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
}
```

**9. Breadcrumb Component** (`components/canvas/BreadcrumbComponent.tsx`)
```typescript
interface BreadcrumbProps {
  items: Array<{
    id: string;
    label: string;
    href?: string;
  }>;
  separator?: string | 'slash' | 'chevron' | 'arrow';
}
```

**10. Divider Component** (`components/canvas/DividerComponent.tsx`)
```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  color?: string;
  spacing?: string;
  label?: string;
  labelPosition?: 'left' | 'center' | 'right';
}
```

**11. Carousel Component** (`components/canvas/CarouselComponent.tsx`)
```typescript
interface CarouselProps {
  slides: Array<{
    id: string;
    image: string;
    title?: string;
    description?: string;
  }>;
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
}
```

**For each component:**
1. Create TypeScript interface in `lib/editor/types.ts`
2. Add component type to `ComponentType` union
3. Add default props to `getDefaultComponent()` in `canvas-store.ts`
4. Create canvas component in `components/canvas/`
5. Add to `RenderComponent.tsx` switch-case
6. Create PropertiesPanel section in `PropertiesPanel.tsx`
7. Add to ComponentPalette with icon and description
8. Write unit tests (80%+ coverage)

---

### 2.3 Milestone 3: Canvas-Based Direct Manipulation (Week 6-7)

#### **Goal:** Visual editing directly on canvas with drag handles, sliders, and inline controls

#### **Tasks:**

**1. Create SelectionBox component** (`components/editor/SelectionBox.tsx`)
```tsx
// Bounding box around selected component
// 8 resize handles (corners + midpoints)
// Rotation handle (top)
// Delete button (top-right corner)
// Component type label (top-left corner)
// Keyboard support (arrow keys to move, Shift+arrows to resize)
```

**2. Create ResizeHandle component** (`components/editor/ResizeHandle.tsx`)
```tsx
// Visual handle for resizing
// 8 positions: nw, n, ne, e, se, s, sw, w
// Cursor changes based on position
// Drag to resize component
// Shift key to maintain aspect ratio
// Alt key to resize from center
```

**3. Create RotateHandle component** (`components/editor/RotateHandle.tsx`)
```tsx
// Circular handle above component
// Drag to rotate component
// Shows angle indicator while dragging
// Snap to 15° increments (Shift key)
```

**4. Create InlinePropertyEditor component** (`components/editor/InlinePropertyEditor.tsx`)
```tsx
// Popup editor for common properties
// Triggered by double-click or Enter key
// Properties shown: padding, margin, border-radius
// Visual sliders for numeric values
// Color picker for color values
// Save on blur or Enter, cancel on Escape
```

**5. Create SpacingDragHandle component** (`components/editor/SpacingDragHandle.tsx`)
```tsx
// Visual handles on component edges
// Drag to adjust padding (inside edges)
// Drag to adjust margin (outside edges)
// Shows values while dragging
// Color-coded: padding (green), margin (orange)
```

**6. Create BorderRadiusDragHandle component** (`components/editor/BorderRadiusDragHandle.tsx`)
```tsx
// Visual handles on component corners
// Drag to adjust border-radius
// Shows value while dragging
// Link/unlink corners (Shift key)
```

**7. Update Canvas component** (`components/editor/Canvas.tsx`)
```tsx
// Add SelectionBox when component selected
// Add hover effect on components
// Show measurement lines between components
// Add snap-to-grid functionality (optional, toggle)
// Add ruler guides (optional, toggle)
```

**8. Update canvas-store** (`lib/editor/canvas-store.ts`)
```typescript
// Add isEditing state
// Add editingComponentId state
// Add snapToGrid state
// Add showRulers state
// Add gridSize state (default: 8px)
```

**9. Keyboard shortcuts** (`lib/hooks/useKeyboardShortcuts.ts`)
```typescript
// Arrow keys: Move selected component (10px)
// Shift + Arrow keys: Move 1px (fine-tuning)
// Ctrl + Arrow keys: Resize 10px
// R: Toggle rotation mode
// L: Toggle link corners (border-radius)
// G: Toggle snap-to-grid
```

**Testing:**
- E2E test: Select component → drag to move → verify position
- E2E test: Select component → drag handle → verify resize
- E2E test: Select component → rotate handle → verify rotation
- E2E test: Double-click → edit padding → verify update
- Unit tests for all handle components

---

### 2.4 Milestone 4: Collapsible/Resizable Panels (Week 8)

#### **Goal:** Compact mode for left/right panels with smooth animations

#### **Tasks:**

**1. Create PanelCollapse component** (`components/editor/PanelCollapse.tsx`)
```tsx
// Wrapper for collapsible panels
// Props: defaultCollapsed, onCollapse, width, minWidth, maxWidth
// Collapse button (arrow icon)
// Drag handle for resizing
// Smooth animations (300ms transition)
// Remembers state in localStorage
```

**2. Update ComponentPalette** (`components/editor/ComponentPalette.tsx`)
```tsx
// Add collapse button in header
// Compact mode: Show only category icons (click to expand category)
// Full mode: Show all components with labels
// Width: 300px (full) → 60px (compact)
// Smooth animation on collapse
```

**3. Update PropertiesPanel** (`components/editor/PropertiesPanel.tsx`)
```tsx
// Add collapse button in header
// Auto-collapse when no component selected
// Auto-expand when component selected
// Smooth slide-in animation (300ms)
// Width: 320px (expanded) → 0px (collapsed)
```

**4. Create ResizeHandle component** (`components/editor/ResizeHandle.tsx`)
```tsx
// Vertical handle between panels and canvas
// Drag to resize panel width
// Shows resize cursor on hover
// Min width: 200px (ComponentPalette), 280px (PropertiesPanel)
// Max width: 500px (both)
// Saves width to localStorage
```

**5. Update Editor Page layout** (`app/(dashboard)/editor/[projectId]/page.tsx`)
```tsx
// Add PanelCollapse wrappers around ComponentPalette and PropertiesPanel
// Add ResizeHandle components
// Update CSS Grid layout to support dynamic panel widths
// Add keyboard shortcut: Ctrl+B (toggle left panel), Ctrl+P (toggle right panel)
```

**6. Update canvas-store** (`lib/editor/canvas-store.ts`)
```typescript
// Add UI state:
interface UIState {
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  leftPanelWidth: number;
  rightPanelWidth: number;
}
```

**Testing:**
- E2E test: Click collapse button → verify panel collapses
- E2E test: Drag resize handle → verify panel width changes
- E2E test: Keyboard shortcut Ctrl+B → verify left panel toggles
- Unit tests for PanelCollapse component

---

### 2.5 Milestone 5: Component Grouping & Categories (Week 9)

#### **Goal:** Organize 30+ components into logical categories

#### **Categories:**

```typescript
interface ComponentCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  components: ComponentType[];
}

const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: 'layout',
    label: 'Layout',
    icon: '📐',
    description: 'Containers and structural components',
    components: ['Container', 'Section', 'Grid', 'Card', 'Divider'],
  },
  {
    id: 'content',
    label: 'Content',
    icon: '📝',
    description: 'Text, images, and media',
    components: ['Text', 'Heading', 'Image', 'Link', 'Icon'],
  },
  {
    id: 'forms',
    label: 'Forms',
    icon: '📋',
    description: 'Form inputs and controls',
    components: ['Form', 'Input', 'Textarea', 'Checkbox', 'Submit'],
  },
  {
    id: 'interactive',
    label: 'Interactive',
    icon: '🎯',
    description: 'Buttons and interactive elements',
    components: ['Button', 'Counter'],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    icon: '🧭',
    description: 'Navigation components',
    components: ['Navbar', 'Footer', 'Tabs', 'Breadcrumb'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: '💬',
    description: 'Alerts, toasts, and notifications',
    components: ['Alert', 'Progress', 'Badge', 'Tooltip'],
  },
  {
    id: 'overlay',
    label: 'Overlay',
    icon: '🪟',
    description: 'Modals, dialogs, and overlays',
    components: ['Modal', 'Accordion'],
  },
  {
    id: 'advanced',
    label: 'Advanced',
    icon: '🚀',
    description: 'Advanced components',
    components: ['Carousel', 'Features', 'Hero', 'CTA'],
  },
];
```

**Tasks:**

1. Update ComponentPalette with collapsible category groups
2. Add search/filter functionality
3. Add "Recently Used" category
4. Add "Favorites" functionality (star icon)
5. Sort categories alphabetically or by usage
6. Compact mode: Show only category icons, click to expand

**Testing:**
- E2E test: Click category → verify components expand/collapse
- E2E test: Search "button" → verify only matching components shown
- E2E test: Star component → verify added to Favorites

---

### 2.6 Milestone 6: Property Enhancements (Week 10-11)

#### **Goal:** Add missing properties to ALL components (target: 8-12 per component)

#### **Properties to Add:**

**Typography Properties** (Text, Heading, Link, Button):
```typescript
- fontFamily: 'Inter' | 'Roboto' | 'Open Sans' | 'Lora' | 'Playfair Display' | custom
- fontSize: string (px, rem, em)
- fontWeight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
- lineHeight: string (px, rem, unitless)
- letterSpacing: string (px, em)
- textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
- textDecoration: 'none' | 'underline' | 'overline' | 'line-through'
- textShadow: string (x y blur color)
```

**Border Properties** (All visual components):
```typescript
- borderTopWidth: string
- borderRightWidth: string
- borderBottomWidth: string
- borderLeftWidth: string
- borderTopColor: string
- borderRightColor: string
- borderBottomColor: string
- borderLeftColor: string
- borderTopStyle: 'solid' | 'dashed' | 'dotted' | 'double' | 'none'
- borderRightStyle: '...'
- borderBottomStyle: '...'
- borderLeftStyle: '...'
```

**Shadow Properties** (All visual components):
```typescript
- boxShadow: Array<{
    x: number;
    y: number;
    blur: number;
    spread: number;
    color: string;
    inset?: boolean;
  }>
- textShadow: Array<{
    x: number;
    y: number;
    blur: number;
    color: string;
  }>
```

**Transform Properties** (All components):
```typescript
- rotate: number (degrees)
- rotateX: number
- rotateY: number
- rotateZ: number
- scale: number
- scaleX: number
- scaleY: number
- skewX: number
- skewY: number
- translateX: string
- translateY: string
```

**Effect Properties** (All visual components):
```typescript
- opacity: number (0-1)
- mixBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | ...
- filter: Array<{
    type: 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue-rotate' | 'invert' | 'saturate' | 'sepia';
    value: number | string;
  }>
```

**Interaction Properties** (Interactive components):
```typescript
- cursor: 'auto' | 'pointer' | 'not-allowed' | 'grab' | 'grabbing' | ...
- pointerEvents: 'auto' | 'none'
- userSelect: 'auto' | 'none' | 'text' | 'all'
```

**Animation Properties** (All components):
```typescript
- transition: {
    property: string;
    duration: number;
    timingFunction: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | string;
    delay: number;
  }
- animation: {
    name: string;
    duration: number;
    timingFunction: string;
    delay: number;
    iterationCount: number | 'infinite';
    direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
    fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  }
```

**Component-Specific Properties:**

**Button:**
```typescript
- icon: string (Lucide icon name)
- iconPosition: 'left' | 'right'
- loading: boolean
- disabled: boolean
- fullWidth: boolean
- hoverBackgroundColor: string
- hoverColor: string
- activeBackgroundColor: string
- activeColor: string
```

**Image:**
```typescript
- objectFit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
- objectPosition: string
- aspectRatio: string (e.g., '16/9', '4/3', '1/1')
- filters: { blur: number; brightness: number; contrast: number; ... }
```

**Input:**
```typescript
- icon: string (Lucide icon name)
- iconPosition: 'left' | 'right'
- clearable: boolean
- disabled: boolean
- readOnly: boolean
- validationState: 'default' | 'success' | 'error' | 'warning'
- helpText: string
- errorText: string
```

---

### 2.7 Milestone 7: Comprehensive Refactoring (Week 12-14)

#### **Goal:** God-Tier code quality with 80%+ test coverage

#### **Tasks:**

**1. Remove Code Duplication**
- Extract common property editors into reusable components
- Create BaseComponent wrapper for shared functionality
- Create PropertyGroup component for collapsible property sections
- Create NumberInput, Select, Toggle components for reuse

**2. Implement Error Handling**
- Try-catch blocks around all user actions
- Toast notifications for errors
- Error boundaries for component rendering
- Fallback UI for failed components

**3. Optimize Performance**
- Memoize PropertiesPanel sections
- Virtualize long component lists (react-window)
- Debounce expensive operations (gradient preview, etc.)
- Lazy load component imports
- Use React.memo for all canvas components

**4. Testing (CRITICAL)**
```bash
# Target coverage: 80%+
# Unit tests: 200+ tests
# Integration tests: 50+ tests
# E2E tests: 20+ critical flows
```

**Test Plan:**
- Unit tests for every component (canvas + editor)
- Unit tests for all utility functions
- Integration tests for drag-and-drop
- Integration tests for property updates
- E2E tests for critical user flows:
  1. Create new component → add properties → save
  2. Drag component from palette → drop on canvas → select → delete
  3. Add Accordion → add items → reorder → delete item
  4. Set gradient background → verify on canvas
  5. Resize panel → verify width saved
  6. Undo/Redo operations
  7. Auto-save after changes

**5. Accessibility (WCAG 2.1 AA)**
- Keyboard navigation for all interactions
- ARIA labels on all interactive elements
- Focus management (trap focus in modals)
- Screen reader announcements
- Color contrast ratio 4.5:1 minimum
- Skip links for keyboard users

**6. Documentation**
- Inline code comments for complex logic
- Component API documentation (props, events)
- User guide for new features
- Architecture decision records (ADRs)

---

## 🏗️ Technical Architecture

### 3.1 New Folder Structure

```
bubble-gum/
├── components/
│   ├── canvas/
│   │   ├── AccordionComponent.tsx (NEW)
│   │   ├── TabsComponent.tsx (NEW)
│   │   ├── CounterComponent.tsx (NEW)
│   │   ├── ProgressComponent.tsx (NEW)
│   │   ├── TooltipComponent.tsx (NEW)
│   │   ├── ModalComponent.tsx (NEW)
│   │   ├── AlertComponent.tsx (NEW)
│   │   ├── BadgeComponent.tsx (NEW)
│   │   ├── BreadcrumbComponent.tsx (NEW)
│   │   ├── DividerComponent.tsx (NEW)
│   │   ├── CarouselComponent.tsx (NEW)
│   │   └── [existing 20 components...]
│   ├── editor/
│   │   ├── controls/ (NEW)
│   │   │   ├── BorderRadiusControl.tsx (NEW)
│   │   │   ├── BackgroundControl.tsx (NEW)
│   │   │   ├── ColorPicker.tsx (NEW)
│   │   │   ├── GradientEditor.tsx (NEW)
│   │   │   ├── ImageUpload.tsx (NEW)
│   │   │   ├── TypographyControl.tsx (NEW)
│   │   │   ├── ShadowControl.tsx (NEW)
│   │   │   ├── TransformControl.tsx (NEW)
│   │   │   ├── FilterControl.tsx (NEW)
│   │   │   └── PropertyGroup.tsx (NEW)
│   │   ├── canvas-editing/ (NEW)
│   │   │   ├── SelectionBox.tsx (NEW)
│   │   │   ├── ResizeHandle.tsx (NEW)
│   │   │   ├── RotateHandle.tsx (NEW)
│   │   │   ├── SpacingDragHandle.tsx (NEW)
│   │   │   ├── BorderRadiusDragHandle.tsx (NEW)
│   │   │   └── InlinePropertyEditor.tsx (NEW)
│   │   ├── panels/ (NEW)
│   │   │   ├── PanelCollapse.tsx (NEW)
│   │   │   └── ResizeHandle.tsx (NEW)
│   │   ├── Canvas.tsx (ENHANCED)
│   │   ├── ComponentPalette.tsx (ENHANCED)
│   │   ├── PropertiesPanel.tsx (ENHANCED)
│   │   └── [existing editor components...]
│   └── ui/ (shadcn/ui components)
├── lib/
│   ├── editor/
│   │   ├── types.ts (ENHANCED - 100+ new properties)
│   │   ├── canvas-store.ts (ENHANCED - new UI state)
│   │   ├── component-categories.ts (NEW)
│   │   └── [existing files...]
│   └── utils/
│       ├── gradient.ts (NEW)
│       ├── transform.ts (NEW)
│       └── [existing utils...]
├── tests/ (NEW)
│   ├── unit/
│   │   ├── components/
│   │   ├── controls/
│   │   └── utils/
│   ├── integration/
│   │   ├── drag-and-drop.test.tsx
│   │   ├── property-updates.test.tsx
│   │   └── [more tests...]
│   └── e2e/
│       ├── component-creation.spec.ts
│       ├── accordion-crud.spec.ts
│       ├── panel-resizing.spec.ts
│       └── [more tests...]
└── docs/
    ├── ADVANCED_BUILDER_ENHANCEMENT_PLAN.md (THIS FILE)
    ├── COMPONENT_API.md (NEW)
    ├── USER_GUIDE.md (NEW)
    └── [existing docs...]
```

---

### 3.2 Key Design Patterns

**1. Composition Pattern**
```tsx
// Reusable property controls
<PropertyGroup title="Styling" defaultOpen={true}>
  <BorderRadiusControl componentId={id} />
  <BackgroundControl componentId={id} />
  <ShadowControl componentId={id} />
</PropertyGroup>
```

**2. Render Props Pattern**
```tsx
// Flexible component rendering
<SelectionBox component={component}>
  {({ isSelected, isHovered }) => (
    <ComponentRenderer
      component={component}
      highlight={isSelected || isHovered}
    />
  )}
</SelectionBox>
```

**3. Compound Components Pattern**
```tsx
// Accordion with flexible composition
<Accordion>
  <AccordionItem title="Item 1">Content 1</AccordionItem>
  <AccordionItem title="Item 2">Content 2</AccordionItem>
</Accordion>
```

**4. Factory Pattern**
```typescript
// Component creation
const ComponentFactory = {
  create(type: ComponentType): CanvasComponent {
    const defaults = getDefaultComponent(type);
    return {
      id: nanoid(),
      ...defaults,
    };
  },
};
```

---

## ✅ Quality Assurance

### 4.1 Testing Strategy

**Unit Tests (80%+ coverage):**
- All canvas components
- All editor controls
- All utility functions
- All custom hooks

**Integration Tests:**
- Drag-and-drop interactions
- Property updates (local state → store → canvas)
- Undo/Redo operations
- Auto-save functionality
- Panel resize/collapse

**E2E Tests (Playwright):**
- Critical user flows (create, edit, delete components)
- CRUD operations for new components (Accordion, Tabs, etc.)
- Canvas-based editing (resize, rotate, inline edit)
- Panel interactions (collapse, resize)
- Keyboard shortcuts

### 4.2 Performance Benchmarks

**Target Metrics:**
- Initial load: <2s
- Component add: <100ms
- Property update: <50ms (local state), <200ms (canvas update)
- Drag-and-drop: 60fps (16ms per frame)
- Panel collapse animation: 300ms smooth
- Auto-save debounce: 10s (configurable)

**Optimization Techniques:**
- React.memo for all canvas components
- useMemo for expensive calculations
- useCallback for event handlers
- Virtualization for long lists
- Code splitting (dynamic imports)
- Image lazy loading

### 4.3 Accessibility Checklist

- [ ] All interactive elements keyboard-accessible
- [ ] Focus indicators visible (outline, ring)
- [ ] ARIA labels on all drag handles
- [ ] Screen reader announcements for state changes
- [ ] Color contrast ratio 4.5:1+
- [ ] Skip links for keyboard users
- [ ] Focus trap in modals
- [ ] Semantic HTML (headings, landmarks)
- [ ] Alt text on all images
- [ ] Form labels associated with inputs

---

## 📅 Timeline & Milestones

### Overview (14 weeks total)

| Week | Milestone | Deliverables | Status |
|------|-----------|--------------|--------|
| **1-2** | Universal Styling | Border-radius controls, Background controls (color/gradient/image), Color picker, Gradient editor, Image upload | 🔜 |
| **3-5** | New Components | 11 new components (Accordion, Tabs, Counter, Progress, Tooltip, Modal, Alert, Badge, Breadcrumb, Divider, Carousel) | 🔜 |
| **6-7** | Canvas Editing | Selection box, Resize handles, Rotate handle, Inline editor, Spacing drag handles, Border-radius drag handles | 🔜 |
| **8** | Collapsible Panels | Panel collapse, Resize handles, Keyboard shortcuts, localStorage persistence | 🔜 |
| **9** | Component Grouping | 8 categories, Search/filter, Favorites, Recently used | 🔜 |
| **10-11** | Property Enhancements | Add 100+ properties across all components, Typography controls, Shadow controls, Transform controls, Filter controls | 🔜 |
| **12-14** | Comprehensive Refactoring | Remove duplication, Error handling, Performance optimization, Testing (80%+), Accessibility (WCAG AA), Documentation | 🔜 |

### Detailed Timeline

#### **Week 1-2: Universal Styling System**
- **Day 1-2:** Extend TypeScript types, Create BorderRadiusControl
- **Day 3-4:** Create ColorPicker, Create GradientEditor
- **Day 5-6:** Create BackgroundControl, Create ImageUpload
- **Day 7-8:** Update PropertiesPanel (add controls to all components)
- **Day 9-10:** Update all 20 canvas components (apply new styles)
- **Testing:** Unit + Integration tests

#### **Week 3-5: New Interactive Components**
- **Week 3:** Accordion, Tabs, Counter (3 components)
- **Week 4:** Progress, Tooltip, Modal, Alert (4 components)
- **Week 5:** Badge, Breadcrumb, Divider, Carousel (4 components)
- **Each component:** Types → Store → Canvas → Properties → Tests

#### **Week 6-7: Canvas-Based Direct Manipulation**
- **Day 1-2:** SelectionBox, ResizeHandle
- **Day 3-4:** RotateHandle, InlinePropertyEditor
- **Day 5-6:** SpacingDragHandle, BorderRadiusDragHandle
- **Day 7-8:** Update Canvas, Update canvas-store
- **Day 9-10:** Keyboard shortcuts
- **Testing:** E2E tests

#### **Week 8: Collapsible/Resizable Panels**
- **Day 1-2:** PanelCollapse component
- **Day 3-4:** Update ComponentPalette (compact mode)
- **Day 5-6:** Update PropertiesPanel (auto-collapse)
- **Day 7-8:** ResizeHandle, Update Editor layout
- **Testing:** E2E tests

#### **Week 9: Component Grouping & Categories**
- **Day 1-2:** Define categories, Update types
- **Day 3-4:** Update ComponentPalette (collapsible groups)
- **Day 5-6:** Search/filter functionality
- **Day 7-8:** Favorites, Recently used
- **Testing:** Unit + E2E tests

#### **Week 10-11: Property Enhancements**
- **Week 10:** Typography, Border, Shadow controls
- **Week 11:** Transform, Filter, Animation controls
- **Testing:** Unit tests for each control

#### **Week 12-14: Comprehensive Refactoring**
- **Week 12:** Remove duplication, Error handling
- **Week 13:** Performance optimization, Testing (unit + integration)
- **Week 14:** Accessibility audit, Documentation, Final QA

---

## 🎯 Success Criteria

### Phase Completion Checklist

**Milestone 1: Universal Styling ✅**
- [ ] All components support individual border-radius (4 corners)
- [ ] All components support background color/gradient/image
- [ ] Color picker with opacity slider
- [ ] Gradient editor (linear/radial with color stops)
- [ ] Image upload (drag-drop + browse + URL)
- [ ] Visual preview for all styling
- [ ] 80%+ test coverage

**Milestone 2: New Components ✅**
- [ ] 11 new components implemented
- [ ] Each component has 8-12 properties
- [ ] CRUD operations for dynamic components (Accordion, Tabs)
- [ ] All components support universal styling
- [ ] Properties Panel integration
- [ ] Component Palette integration
- [ ] 80%+ test coverage per component

**Milestone 3: Canvas Editing ✅**
- [ ] Selection box with 8 resize handles
- [ ] Rotation handle
- [ ] Inline property editor (double-click)
- [ ] Spacing drag handles (padding/margin)
- [ ] Border-radius drag handles
- [ ] Keyboard shortcuts (arrows, Shift, Ctrl)
- [ ] 60fps performance
- [ ] E2E tests passing

**Milestone 4: Collapsible Panels ✅**
- [ ] Left panel collapses to 60px (icon-only mode)
- [ ] Right panel auto-collapses when no selection
- [ ] Smooth animations (300ms)
- [ ] Drag to resize panels
- [ ] State persists in localStorage
- [ ] Keyboard shortcuts (Ctrl+B, Ctrl+P)

**Milestone 5: Component Grouping ✅**
- [ ] Components organized into 8 categories
- [ ] Collapsible category groups
- [ ] Search/filter functionality
- [ ] Favorites system
- [ ] Recently used category
- [ ] Compact mode support

**Milestone 6: Property Enhancements ✅**
- [ ] 100+ new properties added
- [ ] Typography controls (font, size, weight, line-height, etc.)
- [ ] Shadow controls (box-shadow, text-shadow)
- [ ] Transform controls (rotate, scale, skew, translate)
- [ ] Filter controls (blur, brightness, contrast, etc.)
- [ ] Component-specific properties (Button icons, Image filters, etc.)

**Milestone 7: Comprehensive Refactoring ✅**
- [ ] Code duplication removed
- [ ] Error handling implemented
- [ ] Performance optimized (memoization, virtualization)
- [ ] 80%+ test coverage (unit + integration + E2E)
- [ ] WCAG 2.1 AA compliant
- [ ] Documentation complete (API docs, user guide, ADRs)

---

## 🚀 Next Steps

### PHASE 2: Waiting for User Approval

**Before starting implementation, please confirm:**

1. **Scope Approval:**
   - ✅ 11 new components (Accordion, Tabs, Counter, Progress, Tooltip, Modal, Alert, Badge, Breadcrumb, Divider, Carousel)
   - ✅ Universal styling (border-radius, backgrounds)
   - ✅ Canvas-based editing (selection box, handles)
   - ✅ Collapsible panels
   - ✅ Component categories
   - ✅ 100+ new properties

2. **Timeline Approval:**
   - ✅ 14 weeks total (3.5 months)
   - ✅ Milestone-based approach
   - ✅ Testing at each milestone

3. **Quality Standards:**
   - ✅ 80%+ test coverage
   - ✅ WCAG 2.1 AA compliance
   - ✅ 60fps performance
   - ✅ God-Tier code quality

4. **Priorities:**
   - Which milestone should we start with?
   - Any components to add/remove?
   - Any specific requirements or constraints?

**To proceed, please respond with:**
- "go" (semi-automatic mode - I'll ask for approval at critical decisions)
- "auto" (autonomous mode - I'll complete entire plan without stopping)
- "modify: [your changes]" (I'll update the plan based on your feedback)

---

## 📝 Appendix

### A. Technology Stack

**Core:**
- Next.js 16.0.1 (App Router)
- React 19.2.0
- TypeScript 5.x (Strict mode)
- Zustand 5.0.8 (State management)
- Zundo 2.x (Undo/Redo)

**UI/Styling:**
- Tailwind CSS 4.1.16
- shadcn/ui components
- Radix UI primitives
- Lucide React (icons)
- react-colorful (color picker)

**Drag & Drop:**
- @dnd-kit/core 6.x
- @dnd-kit/sortable 8.x
- @dnd-kit/utilities 3.x

**Testing:**
- Vitest (unit/integration)
- React Testing Library
- Playwright (E2E)

**Database:**
- PostgreSQL 14+
- Prisma 6.18.0 ORM

**Authentication:**
- Clerk 6.34.1

### B. Dependencies to Add

```json
{
  "dependencies": {
    "react-colorful": "^5.6.1",
    "react-window": "^1.8.10",
    "framer-motion": "^11.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0"
  }
}
```

### C. References

- **Bubble Gum Docs:** `/var/www/bubble-gum/docs/`
- **God-Tier Protocol:** `/var/www/bubble-gum/docs/GOD_TIER_PROTOCOL.md`
- **Tech Stack:** `/var/www/bubble-gum/docs/TECH_STACK.md`
- **Original CLAUDE.md:** `/var/www/bubble-gum/CLAUDE.md`

---

**End of Plan Document**

**Status:** ⏸️ **AWAITING USER APPROVAL TO PROCEED**

