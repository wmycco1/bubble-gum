# Atomic Design System - Quick Reference Card

**Version:** 1.0.0 | **Print-Friendly** ✅ | **Last Updated:** January 2025

---

## 📐 COMPONENT HIERARCHY

```
Pages (User's published pages)
  ↓ composed of
Templates (Page layouts: Landing, About, Product)
  ↓ composed of
Organisms (Sections: Hero, Pricing Table, Navigation)
  ↓ composed of
Molecules (Groups: Search Input, Icon Box, Card)
  ↓ composed of
Atoms (Elements: Button, Input, Icon, Text)
```

**Golden Rule:** Build small → compose big

---

## 🎯 COMPOUND COMPONENTS PATTERN

### ✅ DO (Compound Pattern)
```typescript
<PricingTable>
  <PricingTable.Card>
    <PricingTable.Title>Pro</PricingTable.Title>
    <PricingTable.Price>$99</PricingTable.Price>
  </PricingTable.Card>
</PricingTable>
```

### ❌ DON'T (Prop-based)
```typescript
<PricingTable
  title="Pro"
  price={99}
  features={[...]} // 47 props = bad DX
/>
```

**Why?** Flexibility, type safety, performance, maintainability

---

## 📊 2025 METRICS TARGETS

| Metric | Target | Current Avg | Improvement |
|--------|--------|-------------|-------------|
| Time to First Page | **<3 min** | 15-20 min | -83% |
| Canvas Editing | **85%+** | 60-70% | +21% |
| Mobile Success | **75%+** | 40-50% | +56% |
| User Satisfaction | **4.7/5** | 4.2/5 | +12% |
| LCP (Core Web Vital) | **<2.5s** | 3-4s | -37% |

---

## 🔧 TYPESCRIPT STRICT MODE

### Required tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### ✅ Good Typing
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}
```

### ❌ Bad Typing
```typescript
function Button(props: any) { } // Never use 'any'!
```

---

## 🧪 TESTING REQUIREMENTS

| Type | Coverage | Tool |
|------|----------|------|
| **Unit** | 80%+ | Jest + RTL |
| **Integration** | 70%+ | Jest |
| **E2E** | Critical flows | Playwright |
| **A11y** | 100% | jest-axe |

### Test Template
```typescript
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = render(<Component />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

---

## ♿ ACCESSIBILITY (WCAG 2.2 AA)

### Checklist
- [ ] All interactive elements focusable
- [ ] Keyboard navigation (Tab, Enter, Esc, Arrows)
- [ ] ARIA labels for icon-only buttons
- [ ] Color contrast ≥4.5:1 (text)
- [ ] Color contrast ≥3:1 (UI components)
- [ ] Touch targets ≥44x44px (mobile)
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] No keyboard traps
- [ ] Focus indicators visible (≥3:1 contrast)

### Quick Test
```bash
npm test -- --testNamePattern="accessibility"
# Should pass all axe checks
```

---

## ⚡ PERFORMANCE (Core Web Vitals 2025)

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** | <2.5s | 2.5-4s | >4s |
| **FID** | <100ms | 100-300ms | >300ms |
| **CLS** | <0.1 | 0.1-0.25 | >0.25 |
| **INP** | <200ms | 200-500ms | >500ms |

### Optimization Checklist
- [ ] React.memo for expensive components
- [ ] useMemo for calculations
- [ ] useCallback for event handlers
- [ ] Code splitting per atomic level
- [ ] Image optimization (WebP/AVIF)
- [ ] Lazy loading (off-screen content)
- [ ] Virtual scrolling (long lists)
- [ ] Bundle size <500KB total

---

## 🎨 UX PATTERNS (2025 High-Conversion)

### Inline Editing
- **Trigger:** Double-click text
- **Toolbar:** Appears above selection
- **Save:** Enter key
- **Cancel:** Esc key
- **AI Suggestions:** Tab to accept

### Quick Settings
- **Trigger:** Click ⚙️ icon or select element
- **Position:** Near selected element
- **Content:** 5-8 essential controls only
- **Close:** Click outside or Esc
- **Advanced:** "More Options" → Properties Panel

### Drag-to-Change
- **Trigger:** Click + drag numeric value
- **Direction:** Up = increase, Down = decrease
- **Speed:** Shift = 10x faster
- **Precision:** Alt = disable snapping
- **Feedback:** Tooltip shows current value

### Bounding Box
- **8 Resize handles:** Corners + sides
- **Rotation handle:** Top-center (circular)
- **Move:** Drag entire box
- **Snap:** 8px grid (Alt to disable)
- **Aspect ratio:** Shift to lock
- **Nudge:** Arrow keys (Shift for 10px)

---

## 🗂️ FILE STRUCTURE

```
src/components/atoms/Button/
├── Button.tsx              # Main component
├── ButtonIcon.tsx          # Sub-component
├── ButtonText.tsx          # Sub-component
├── ButtonSpinner.tsx       # Sub-component
├── ButtonContext.tsx       # Context API
├── Button.types.ts         # TypeScript interfaces
├── Button.test.tsx         # Unit tests
├── Button.stories.tsx      # Storybook
├── index.ts                # Exports
└── README.md               # Documentation
```

**Rule:** One component = one folder with ALL related files

---

## 🔐 SECURITY (OWASP Top 10)

### Input Validation (Zod)
```typescript
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1).max(100),
  price: z.number().min(0).max(999999)
});

const data = schema.parse(userInput); // Throws if invalid
```

### XSS Prevention
```typescript
// ✅ Good: React auto-escapes
<div>{userInput}</div>

// ❌ Bad: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: Sanitize first
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

### Environment Variables
```bash
# ✅ Good: Server-side only
DATABASE_URL=postgresql://...      # .env.local (not committed)
ANTHROPIC_API_KEY=sk-ant-...      # .env.local

# ✅ Good: Client-side (public)
NEXT_PUBLIC_API_URL=https://...   # Safe to expose

# ❌ Bad: Never commit secrets
API_KEY=secret123                  # .env (committed to git) ❌
```

---

## 📱 MOBILE OPTIMIZATION (62% Traffic)

### Touch Targets
- **Minimum size:** 44x44px (WCAG 2.2)
- **Spacing:** 8px between targets
- **Visual feedback:** Highlight on touch

### Gestures
```typescript
// Pinch to zoom
onPinch={(scale) => setZoom(scale)}

// Swipe to undo
onSwipeRight={() => undo()}

// Long press for context menu
onLongPress={() => showContextMenu()}
```

### Haptic Feedback (iOS/Android)
```typescript
if ('vibrate' in navigator) {
  navigator.vibrate([10, 20, 30]); // Pattern
}
```

---

## 🚀 QUICK COMMANDS

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run type-check         # TypeScript check
npm run lint               # ESLint
npm run test               # Run tests
npm run test:coverage      # Coverage report
npm run storybook          # Start Storybook

# Quality checks (before commit)
npm run pre-commit         # Runs all checks

# Component generation
npm run generate:atom -- --name=MyButton
npm run generate:molecule -- --name=SearchBar
npm run generate:organism -- --name=PricingTable
```

---

## 📚 DOCUMENTATION SUITE

| File | Purpose | Lines | Read Time |
|------|---------|-------|-----------|
| [README](./ATOMIC_DESIGN_README.md) | Navigation hub | 600 | 10 min |
| [PART 1](./ATOMIC_DESIGN_ENHANCED_2025.md) | Architecture | 2,200 | 45 min |
| [PART 2](./ATOMIC_DESIGN_ENHANCED_2025_PART2.md) | Canvas editing | 1,200 | 30 min |
| [METRICS](./ATOMIC_DESIGN_METRICS_2025.md) | KPIs & A/B tests | 800 | 20 min |
| [CHECKLIST](./GOD_TIER_PROTOCOL_CHECKLIST.md) | Quality standards | 500 | 15 min |
| [IMPLEMENTATION](./ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md) | Step-by-step code | 800 | 45 min |
| **THIS FILE** | Quick reference | 300 | 5 min |

**Total:** ~6,400 lines | ~300 KB | 3 hours reading

---

## 🎯 DECISION FLOWCHART

```
Starting new component?
    ↓
Is it a single element? (Button, Input, Icon)
    YES → Create ATOM
    NO  ↓
Is it 2-5 elements? (Search = Input + Icon)
    YES → Create MOLECULE
    NO  ↓
Is it a page section? (Hero, Pricing, Nav)
    YES → Create ORGANISM (use Compound pattern!)
    NO  ↓
Is it a page layout?
    YES → Create TEMPLATE
    NO  ↓
Is it a complete page?
    YES → Create PAGE
```

---

## 🔑 GOD-TIER CHECKLIST (Before PR)

- [ ] TypeScript strict mode (0 errors)
- [ ] No `any` types
- [ ] Tests written (80%+ coverage)
- [ ] Accessibility tested (0 violations)
- [ ] Storybook story added
- [ ] README.md exists
- [ ] Performance checked (no regressions)
- [ ] Mobile tested (touch targets, gestures)
- [ ] Code reviewed (peer approval)
- [ ] Documentation updated

**If ANY checkbox is unchecked → PR blocked!**

---

## 💡 COMMON MISTAKES

### ❌ Mistake 1: Using `any`
```typescript
function Component(props: any) { } // Never!
```
**Fix:** Define proper interface
```typescript
interface Props { variant: 'primary'; }
function Component(props: Props) { }
```

### ❌ Mistake 2: Missing accessibility
```html
<button></button> <!-- No label! -->
```
**Fix:** Add ARIA label
```html
<button aria-label="Close">×</button>
```

### ❌ Mistake 3: Prop drilling
```typescript
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} /> {/* Drilling! */}
  </Child>
</Parent>
```
**Fix:** Use Context API
```typescript
<ParentContext.Provider value={data}>
  <Child>
    <GrandChild /> {/* Accesses via context */}
  </Child>
</ParentContext.Provider>
```

### ❌ Mistake 4: Skipping tests
```typescript
// Component.tsx exists
// Component.test.tsx missing ← BAD!
```
**Fix:** Always create `.test.tsx`
```bash
npm run generate:component -- --name=MyComponent
# Auto-creates all files including tests
```

---

## 🆘 TROUBLESHOOTING

### Problem: TypeScript errors
```bash
npx tsc --noEmit
# Read errors, fix types
```

### Problem: Tests failing
```bash
npm test -- --watch
# Debug specific test
```

### Problem: Accessibility violations
```bash
npm test -- --testNamePattern="accessibility"
# Check jest-axe output
```

### Problem: Performance issues
```bash
npm run lighthouse
# Check Core Web Vitals
```

---

## 📞 GET HELP

1. **Check docs:** Start with [README](./ATOMIC_DESIGN_README.md)
2. **Search code:** `grep -r "your question" src/`
3. **Ask team:** Slack channel: #atomic-design
4. **Review examples:** See `src/components/` for working code

---

## 🎓 LEARNING RESOURCES

### Official Docs
- [Atomic Design](https://atomicdesign.bradfrost.com/) - Brad Frost
- [Compound Components](https://www.patterns.dev/react/compound-pattern/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

### Internal
- [Implementation Guide](./ATOMIC_DESIGN_IMPLEMENTATION_GUIDE.md)
- [Metrics Dashboard](./ATOMIC_DESIGN_METRICS_2025.md)
- [God-Tier Checklist](./GOD_TIER_PROTOCOL_CHECKLIST.md)

---

**Quick Reference Version:** 1.0.0
**Print this page for your desk! 🖨️**
**Last Updated:** January 2025
