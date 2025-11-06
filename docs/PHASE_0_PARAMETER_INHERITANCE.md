# PHASE 0: Parameter Inheritance Strategy

**Status:** ✅ DEFINED
**Generated:** November 6, 2025
**God-Tier Development Protocol 2025**

---

## 📊 Executive Summary

Based on the parameter audit of 63 components, this document defines the **hierarchical parameter inheritance system** for Atomic Design implementation with Compound Components pattern.

**Key Findings:**
- 247 total props across 63 components
- 11 parameter categories identified
- 73% categorization success rate (180/247 props)
- 55 unique uncategorized props requiring review

---

## 🎯 Inheritance Hierarchy

```
┌─────────────────────────────────────────┐
│          TEMPLATE LEVEL                 │
│  (Container, Section, InnerSection)     │
│  • Layout & Spacing (100%)              │
│  • Colors & Backgrounds (100%)          │
│  • Responsive & Visibility (100%)       │
│  • Advanced & Meta (100%)               │
└──────────────┬──────────────────────────┘
               │ inherits ↓
┌──────────────┴──────────────────────────┐
│          ORGANISM LEVEL                 │
│  (Hero, PricingTable, Navbar, Forms)    │
│  • All Template parameters              │
│  • Content & Data (100%)                │
│  • Navigation & Links (100%)            │
│  • Forms & Validation (conditional)     │
│  • Media & Embeds (conditional)         │
│  • Interactions & Animations (75%)      │
└──────────────┬──────────────────────────┘
               │ inherits ↓
┌──────────────┴──────────────────────────┐
│          MOLECULE LEVEL                 │
│  (Alert, IconBox, Progress, Modal)      │
│  • Typography (100%)                    │
│  • Colors & Backgrounds (75%)           │
│  • Layout & Spacing (limited: 50%)      │
│  • Interactions & Animations (50%)      │
│  • Borders & Effects (50%)              │
└──────────────┬──────────────────────────┘
               │ inherits ↓
┌──────────────┴──────────────────────────┐
│          ATOM LEVEL                     │
│  (Button, Input, Icon, Text)            │
│  • Typography (75%)                     │
│  • Colors (50%)                         │
│  • Interactions (basic: 25%)            │
│  • Forms & Validation (for inputs)      │
└─────────────────────────────────────────┘
```

---

## 📋 Category Priority Matrix

Based on audit results (63 components analyzed):

| Category | Usage | Components | Priority | Template | Organism | Molecule | Atom |
|----------|-------|------------|----------|----------|----------|----------|------|
| **Typography** | 47 | 30 (48%) | ⭐⭐⭐⭐⭐ | ❌ | ✅ | ✅✅ | ✅✅ |
| **Content & Data** | 30 | 23 (37%) | ⭐⭐⭐⭐⭐ | ❌ | ✅✅ | ✅ | ✅ |
| **Forms & Validation** | 24 | 16 (25%) | ⭐⭐⭐⭐ | ❌ | ✅ | ✅ | ✅✅ |
| **Layout & Spacing** | 20 | 13 (21%) | ⭐⭐⭐⭐⭐ | ✅✅ | ✅ | ⚠️ | ❌ |
| **Advanced & Meta** | 18 | 18 (29%) | ⭐⭐⭐ | ✅ | ✅ | ⚠️ | ⚠️ |
| **Responsive & Visibility** | 14 | 9 (14%) | ⭐⭐⭐⭐ | ✅✅ | ✅ | ⚠️ | ❌ |
| **Navigation & Links** | 11 | 10 (16%) | ⭐⭐⭐ | ❌ | ✅✅ | ✅ | ❌ |
| **Media & Embeds** | 8 | 6 (10%) | ⭐⭐⭐ | ❌ | ✅ | ✅ | ⚠️ |
| **Colors & Backgrounds** | 6 | 2 (3%) | ⭐⭐⭐⭐ | ✅✅ | ✅ | ✅ | ⚠️ |
| **Interactions & Animations** | 2 | 2 (3%) | ⭐⭐⭐ | ❌ | ✅ | ✅ | ⚠️ |
| **Borders & Effects** | 0 | 0 (0%) | ⭐⭐ | ❌ | ⚠️ | ✅ | ⚠️ |

**Legend:**
- ✅✅ = Primary (full interface)
- ✅ = Secondary (partial interface)
- ⚠️ = Conditional (component-specific)
- ❌ = Not applicable

---

## 🔧 TypeScript Interface Hierarchy

### 1. Base Parameters (All Levels)

```typescript
/**
 * Core parameters inherited by ALL atomic levels
 */
interface BaseParameters {
  // Meta
  id?: string;
  className?: string;
  style?: React.CSSProperties;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;

  // Testing
  'data-testid'?: string;
}
```

---

### 2. Template Level Parameters

```typescript
/**
 * Template components: Container, Section, InnerSection, Grid
 * Responsible for: Page structure, layout, spacing
 */
interface TemplateParameters extends BaseParameters {
  // Layout & Spacing (PRIMARY)
  width?: ResponsiveValue<string | number>;
  maxWidth?: ResponsiveValue<string | number>;
  minHeight?: ResponsiveValue<string | number>;
  padding?: ResponsiveSpacing;
  margin?: ResponsiveSpacing;
  gap?: ResponsiveValue<string | number>;

  // Colors & Backgrounds (PRIMARY)
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundRepeat?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;

  // Responsive & Visibility (PRIMARY)
  responsive?: boolean;
  hide?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };

  // Grid-specific (for GridComponent)
  columns?: number;
  columnWidths?: string[];

  // Children
  children?: React.ReactNode;
}

type ResponsiveValue<T> = T | {
  mobile?: T;
  tablet?: T;
  desktop?: T;
};

type ResponsiveSpacing = {
  top?: ResponsiveValue<number>;
  right?: ResponsiveValue<number>;
  bottom?: ResponsiveValue<number>;
  left?: ResponsiveValue<number>;
  all?: ResponsiveValue<number>;
  x?: ResponsiveValue<number>;
  y?: ResponsiveValue<number>;
};
```

---

### 3. Organism Level Parameters

```typescript
/**
 * Organism components: Hero, PricingTable, Navbar, Forms, etc.
 * Responsible for: Sections, complex interactions, content
 */
interface OrganismParameters extends TemplateParameters {
  // Content & Data (PRIMARY)
  title?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  items?: any[]; // Type varies by component
  data?: Record<string, any>;

  // Navigation & Links (PRIMARY)
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  link?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';

  // Forms & Validation (CONDITIONAL - for form organisms)
  formTitle?: string;
  submitText?: string;
  onSubmit?: (data: any) => void | Promise<void>;
  validation?: ValidationRules;

  // Media & Embeds (CONDITIONAL)
  icon?: string;
  iconType?: string;
  image?: string;
  video?: string;

  // Interactions & Animations
  animation?: AnimationType;
  transition?: TransitionConfig;
  hover?: HoverEffect;

  // Visibility Controls (common in organisms)
  showControls?: boolean;
  showIndicators?: boolean;
  showArrow?: boolean;
  showDivider?: boolean;
  showRating?: boolean;
  showAvatar?: boolean;
  showCompany?: boolean;
  showThumbnail?: boolean;
  showSidebar?: boolean;
  showCaptions?: boolean;
}

type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce' | 'none';
type TransitionConfig = {
  duration?: number;
  delay?: number;
  easing?: string;
};
type HoverEffect = 'scale' | 'lift' | 'glow' | 'none';
```

---

### 4. Molecule Level Parameters

```typescript
/**
 * Molecule components: Alert, IconBox, Progress, Modal, etc.
 * Responsible for: Simple UI patterns, visual feedback
 */
interface MoleculeParameters extends BaseParameters {
  // Typography (PRIMARY)
  title?: string;
  text?: string;
  fontSize?: ResponsiveValue<number>;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;

  // Colors & Backgrounds (SECONDARY)
  backgroundColor?: string;

  // Layout & Spacing (LIMITED)
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: ResponsiveSpacing;

  // Interactions & Animations (SECONDARY)
  animation?: AnimationType;
  dismissible?: boolean;

  // Borders & Effects (SECONDARY)
  variant?: 'default' | 'outlined' | 'filled' | 'ghost';

  // Visibility
  showValue?: boolean;
  showQuantity?: boolean;
}
```

---

### 5. Atom Level Parameters

```typescript
/**
 * Atom components: Button, Input, Icon, Text, etc.
 * Responsible for: Basic UI elements, minimal props
 */
interface AtomParameters extends BaseParameters {
  // Typography (for text-based atoms)
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';

  // Colors (minimal)
  backgroundColor?: string;
  buttonColor?: string;
  dividerColor?: string;

  // Forms & Validation (for input atoms)
  value?: string | number | boolean;
  onChange?: (value: any) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  // Interactions (basic)
  onClick?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;

  // Size
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  height?: number;

  // Icon-specific
  iconType?: string;
  iconName?: string;

  // Children (for container atoms)
  children?: React.ReactNode;
}
```

---

## 🔗 Parameter Inheritance Rules

### Rule 1: Cascading Override

Child components can **override** parent parameters:

```typescript
// Template provides default
<Section backgroundColor="blue">
  {/* Organism inherits blue background */}
  <Hero />

  {/* Organism overrides with red */}
  <Hero backgroundColor="red" />
</Section>
```

### Rule 2: Context API Propagation

Use Context for deep parameter passing:

```typescript
// Template sets context
<SectionContext.Provider value={{ spacing: 'lg', theme: 'dark' }}>
  <Section>
    {/* All children access via useContext */}
    <Hero /> {/* spacing='lg', theme='dark' */}
  </Section>
</SectionContext.Provider>
```

### Rule 3: Compound Components Composition

Parameters flow through compound sub-components:

```typescript
// Organism with Compound pattern
<PricingTable gap="lg" responsive={true}>
  <PricingTable.Card> {/* inherits gap, responsive */}
    <PricingTable.Title>Pro</PricingTable.Title> {/* inherits theme */}
    <PricingTable.Price>$99</PricingTable.Price>
  </PricingTable.Card>
</PricingTable>
```

### Rule 4: Selective Inheritance

Components only inherit **relevant** parameters:

```typescript
// Button (Atom) ignores layout parameters
<Section padding="xl" backgroundColor="blue">
  <Button />
  {/* inherits: backgroundColor */}
  {/* ignores: padding (not applicable to Button) */}
</Section>
```

---

## 📦 Implementation Strategy

### Phase 1: Create Base Interfaces

**Week 3 Tasks:**
1. Define TypeScript interfaces for all 5 levels
2. Create utility types (`ResponsiveValue`, `ResponsiveSpacing`)
3. Document parameter override behavior
4. Create interface tests

**Deliverables:**
- `src/types/parameters/base.ts`
- `src/types/parameters/template.ts`
- `src/types/parameters/organism.ts`
- `src/types/parameters/molecule.ts`
- `src/types/parameters/atom.ts`

---

### Phase 2: Implement Context Providers

**Week 4 Tasks:**
1. Create `ParameterContext` for each atomic level
2. Implement cascading logic
3. Add override behavior
4. Write context tests

**Deliverables:**
- `src/context/TemplateContext.tsx`
- `src/context/OrganismContext.tsx`
- `src/context/MoleculeContext.tsx`
- `src/context/AtomContext.tsx`

---

### Phase 3: Migrate Components

**Weeks 5-20 (PHASE 1+):**
1. Start with Atoms (15 components × 1-2 days = 15-30 days)
2. Then Molecules (11 components × 2-3 days = 22-33 days)
3. Then Templates (4 components × 5-7 days = 20-28 days)
4. Finally Organisms (33 components × 3-5 days = 99-165 days)

**Estimated Total: 156-256 days ÷ 3 developers = 52-85 days (10-17 weeks)**

---

## 🎯 Uncategorized Props Resolution

**55 unique uncategorized props** need review:

### High Priority (10+ usage):
1. `variant` - Should be in **Borders & Effects** (styling variants)
2. `items` - Should be in **Content & Data** (already there, but keyword missing)
3. `allowMultiple` - Should be in **Interactions & Animations**
4. `defaultOpen` - Should be in **Interactions & Animations**

### Medium Priority (5-9 usage):
- Layout-related: `columns`, `mobileStack`, `centerContent`
- Content-related: `message`, `label`, `options`
- Interaction-related: `dismissible`, `autoplay`, `loop`

### Low Priority (1-4 usage):
- Component-specific props that don't fit standard categories
- May need custom parameter groups

**Action:** Update `audit-parameters.js` keyword lists in Week 3

---

## 💡 Best Practices

### 1. Parameter Naming Conventions

```typescript
// ✅ GOOD - Consistent naming
backgroundColor: string;
backgroundImage: string;
backgroundSize: string;

// ❌ BAD - Inconsistent naming
bgColor: string;
imageBg: string;
sizeOfBackground: string;
```

### 2. Responsive Parameters

```typescript
// ✅ GOOD - Unified responsive type
fontSize: ResponsiveValue<number>;
// fontSize: 16 OR fontSize: { mobile: 14, desktop: 18 }

// ❌ BAD - Separate props for each breakpoint
fontSizeMobile: number;
fontSizeTablet: number;
fontSizeDesktop: number;
```

### 3. Optional vs Required

```typescript
// Templates: Most parameters optional (defaults provided)
interface TemplateParameters {
  width?: string; // optional - default: '100%'
  backgroundColor?: string; // optional - default: 'transparent'
}

// Atoms: Some required for functionality
interface ButtonParameters {
  text: string; // REQUIRED
  onClick: () => void; // REQUIRED
  variant?: 'primary' | 'secondary'; // optional - default: 'primary'
}
```

### 4. Type Safety

```typescript
// ✅ GOOD - Strict types
type Alignment = 'left' | 'center' | 'right';
textAlign: Alignment;

// ❌ BAD - Loose types
textAlign: string; // allows any string, no autocomplete
```

---

## 📊 Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Parameter Categories Defined** | 11 | 11 | ✅ 100% |
| **TypeScript Interfaces Created** | 5 levels | 0 | 🔄 Week 3 |
| **Context Providers Implemented** | 4 levels | 0 | 🔄 Week 4 |
| **Components Migrated** | 63 | 0 | 🔄 Weeks 5-20 |
| **Uncategorized Props Resolved** | <10 | 55 | 🔄 Week 3 |
| **Interface Test Coverage** | 80%+ | 0% | 🔄 Weeks 3-4 |

---

## 🚀 Next Steps (Week 3)

### Immediate Actions:
1. ✅ Create `src/types/parameters/` directory
2. ✅ Implement base TypeScript interfaces (5 levels)
3. ✅ Update `audit-parameters.js` with missing keywords
4. ✅ Re-run parameter audit to verify categorization
5. ✅ Document parameter override behavior
6. ✅ Create interface usage examples

### Week 3 Deliverables:
- [ ] TypeScript interfaces (5 files)
- [ ] Parameter override documentation
- [ ] Updated parameter audit report (<10 uncategorized)
- [ ] Context provider architecture design
- [ ] Week 3 completion report

---

## 🔗 Related Documentation

- [PHASE_0_COMPONENT_AUDIT.md](./PHASE_0_COMPONENT_AUDIT.md) - Component inventory
- [PHASE_0_PARAMETER_AUDIT.md](./PHASE_0_PARAMETER_AUDIT.md) - Parameter analysis
- [PHASE_0_ROADMAP.md](./PHASE_0_ROADMAP.md) - Overall timeline
- [ATOMIC_DESIGN_ENHANCED_2025.md](./ATOMIC_DESIGN_ENHANCED_2025.md) - Full specification
- [ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md](./ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md) - Code examples

---

**Parameter Inheritance Strategy Version:** 1.0.0
**Last Updated:** November 6, 2025
**Next Review:** Week 3 (TypeScript Interfaces Complete)
**Maintained By:** Architecture Team

---

**🎯 Inheritance system defined! TypeScript interfaces next (Week 3).**
