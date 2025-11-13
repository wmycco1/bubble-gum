# Spacing Handles - Quick Reference

## 🎯 One-Page Cheat Sheet

### When are margin handles HIDDEN?

| Scenario | Hidden Handles | Reason |
|----------|---------------|---------|
| `display: inline` | Top, Bottom | Inline ignores vertical margin |
| `align: left` | Right | Uses `margin-right: auto` |
| `align: center` | Left, Right | Uses `margin-left/right: auto` |
| `align: right` | Left | Uses `margin-left: auto` |
| `align: full` | Left, Right | Full width, margins not visible |
| **Padding mode** | NONE | Padding ALWAYS works! |

---

## 📊 Complete Matrix

### Display × Align × Margin Handles

| Display | Align | Top | Right | Bottom | Left |
|---------|-------|-----|-------|--------|------|
| **block** | none | ✅ | ✅ | ✅ | ✅ |
| **block** | left | ✅ | ❌ | ✅ | ✅ |
| **block** | center | ✅ | ❌ | ✅ | ❌ |
| **block** | right | ✅ | ✅ | ✅ | ❌ |
| **block** | full | ✅ | ❌ | ✅ | ❌ |
| **inline** | none | ❌ | ✅ | ❌ | ✅ |
| **inline** | left | ❌ | ❌ | ❌ | ✅ |
| **inline** | center | ❌ | ❌ | ❌ | ❌ |
| **inline** | right | ❌ | ✅ | ❌ | ❌ |
| **inline-block** | none | ✅ | ✅ | ✅ | ✅ |
| **flex** | none | ✅ | ✅ | ✅ | ✅ |
| **grid** | none | ✅ | ✅ | ✅ | ✅ |

---

## 🚨 Critical Rules

1. **Padding ignores everything** - All 4 sides ALWAYS visible
2. **Inline kills vertical** - Top/bottom margin don't work
3. **Align kills horizontal** - Left/right controlled by auto margins
4. **Position doesn't restrict** - All positions allow all margins

---

## 💡 User-Friendly Explanations

### Why is my left/right handle missing?
- **Alignment is active!** When you use Center/Left/Right/Full alignment, those directions use automatic margins. Turn off alignment to manually control left/right margins.

### Why is my top/bottom handle missing?
- **Display is set to inline!** Inline elements ignore vertical margins in browsers. Change display to block/inline-block/flex to use vertical margins.

### Why do I see ALL handles?
- **Perfect!** You're either in Padding mode (always all sides), or you have Display: block/flex/grid with Align: none.

---

## 🎨 Visual Legend

- ✅ = Handle visible & functional
- ❌ = Handle hidden (conflicts with CSS)

---

**Quick Tip:** Switch to **Padding mode** if you need to control all 4 sides regardless of display/alignment!

---

**Last Updated:** 2025-11-13
