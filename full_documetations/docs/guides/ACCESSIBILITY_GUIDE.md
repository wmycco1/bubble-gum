# ♿ Accessibility Guide - Bubble Gum

WCAG 2.1 AA compliance guide.

---

## 🎯 Accessibility Goals

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast ≥4.5:1
- ✅ Focus indicators
- ✅ Alt text for images

---

## ⌨️ Keyboard Navigation

### Tab Order

```typescript
// Proper tab order
<button tabIndex={0}>Primary</button>
<button tabIndex={0}>Secondary</button>
<button tabIndex={-1}>Hidden</button>
```

### Skip Links

```typescript
<a href="#main" className="skip-link">
  Skip to main content
</a>
```

---

## 🔍 Screen Readers

### ARIA Labels

```typescript
<button aria-label="Close dialog">
  <X />
</button>
```

### Alt Text

```typescript
<Image 
  src="/hero.jpg" 
  alt="Person creating landing page" 
/>
```

---

## 🎨 Color Contrast

### Text

```css
/* Minimum 4.5:1 ratio */
.text {
  color: #333; /* on white */
}
```

### Interactive Elements

```css
/* Minimum 3:1 ratio */
.button {
  background: #0066cc;
  color: white;
}
```

---

## ✅ Testing

```bash
# Lighthouse accessibility audit
npm run lighthouse

# Axe accessibility testing
npm run test:a11y
```

---

**Accessibility Complete! ♿**
