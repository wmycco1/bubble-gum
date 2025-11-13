# Spacing System - Version History & Recovery Guide

**Purpose:** Track critical versions of spacing handle behavior for easy recovery

---

## 🎯 CURRENT STABLE VERSION

### **v7.11-hybrid-margin-stable** ✅ RECOMMENDED

**Tag:** `v7.11-hybrid-margin-stable`
**Date:** 2025-11-13
**Status:** ✅ STABLE - Production Ready
**Commits:** `1f19362`, `0bab21c`, `1b9a001`

#### Behavior:

**HORIZONTAL MARGINS (left/right):**
- ✅ Figma-style constraint system
- margin-right ↑ → margin-left ↓ → Badge moves LEFT
- margin-left ↑ → margin-right ↓ → Badge moves RIGHT
- Total horizontal space constrained to wrapper width

**VERTICAL MARGINS (top/bottom):**
- ✅ CSS-compliant independent behavior
- margin-top ↑ → wrapper HEIGHT expands UPWARD
- margin-bottom ↑ → wrapper HEIGHT expands DOWNWARD
- No auto-adjustment, natural CSS box model

#### Technical Details:

```typescript
// File: components/editor/canvas/SpacingHandlesV2.tsx
// Lines: 302-339

if (spacingMode === 'margin') {
  // HORIZONTAL: Apply constraint system
  if (side === 'right' || side === 'left') {
    const availableWidth = badgeRect.wrapperWidth - badgeRect.width;
    clampedValue = Math.min(clampedValue, availableWidth);
    const oppositeMargin = availableWidth - clampedValue;
    // Update both margins simultaneously
  }

  // VERTICAL: Independent (fall through to default)
}
```

#### Recovery:

```bash
# View tag details
git show v7.11-hybrid-margin-stable

# Restore this version
git checkout v7.11-hybrid-margin-stable

# Cherry-pick to current branch
git cherry-pick v7.11-hybrid-margin-stable

# Or reset to this version (DESTRUCTIVE!)
git reset --hard v7.11-hybrid-margin-stable
```

---

## 📚 VERSION HISTORY

### v7.10 - Independent Margins (PARTIAL)
**Commits:** `66c3f2d`
**Issue:** Wrapper expansion worked ✅, but margin-right didn't move Badge ❌
**Replaced by:** v7.11

### v7.7 - Correct Drag Directions
**Commits:** `a401591`
**Feature:** Fixed drag directions for margin vs padding
**Status:** Good foundation, but missing features

### v7.6 - Full Constraint System (PARTIAL)
**Issue:** margin-right worked ✅, but wrapper couldn't expand ❌
**Replaced by:** v7.11 (hybrid approach)

---

## 🔄 COMPARISON TABLE

| Feature | v7.6 | v7.10 | v7.11 ✅ |
|---------|------|-------|----------|
| **margin-right moves Badge** | ✅ | ❌ | ✅ |
| **margin-left moves Badge** | ✅ | ✅ | ✅ |
| **Wrapper vertical expansion** | ❌ | ✅ | ✅ |
| **Horizontal constraints** | ✅ | ❌ | ✅ |
| **Corner handle works** | ✅ | ✅ | ✅ |
| **Figma-like UX** | Partial | Partial | **Full** |

---

## 🎨 DESIGN RATIONALE

### Why Hybrid Approach?

**Horizontal (left/right):**
- Wrapper width is FIXED (parent container constraint)
- Need constraint system for intuitive UX
- When margin-right increases, Badge MUST move left (only way to see visual change)

**Vertical (top/bottom):**
- Wrapper height can GROW (no fixed constraint)
- Natural CSS box model works perfectly
- When margin-top increases, wrapper expands upward naturally

### Key Insight:

The fundamental difference is **wrapper flexibility:**
- Fixed dimension → need constraints (horizontal)
- Flexible dimension → no constraints needed (vertical)

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: margin-right doesn't move Badge
**Symptom:** Increasing margin-right has no visual effect
**Solution:** Restore v7.11 constraint system for horizontal margins

### Issue 2: Wrapper doesn't expand vertically
**Symptom:** margin-top/bottom increase but wrapper height stays fixed
**Solution:** Remove constraint system for vertical margins (v7.11 behavior)

### Issue 3: Runtime error "mode is not defined"
**Solution:** Use `spacingMode` variable name (fixed in v7.11)

### Issue 4: Runtime error "wrapperRect is not defined"
**Solution:** Use `badgeRect.wrapperWidth` instead (fixed in v7.11)

---

## 📝 TESTING CHECKLIST

When testing spacing behavior:

**Horizontal Margins:**
- [ ] margin-right increases → Badge moves LEFT
- [ ] margin-left increases → Badge moves RIGHT
- [ ] margin-right + margin-left ≤ availableWidth (constrained)
- [ ] Drag direction intuitive (towards wrapper edge = increase)

**Vertical Margins:**
- [ ] margin-top increases → wrapper HEIGHT grows UPWARD
- [ ] margin-bottom increases → wrapper HEIGHT grows DOWNWARD
- [ ] No auto-adjustment of opposite margin
- [ ] Wrapper expands like corner handle behavior

**Padding (all sides):**
- [ ] Independent behavior on all sides
- [ ] Drag INTO element = increase
- [ ] No constraints, no auto-adjustment

**Corner Handle:**
- [ ] Sets all sides to same value
- [ ] Wrapper expands in all directions
- [ ] Uses shorthand property (`margin: 50px`)

---

## 🏗️ ARCHITECTURE NOTES

### File Structure:
```
components/editor/canvas/SpacingHandlesV2.tsx
├── Lines 50-75: Variable declarations (spacingMode, prefix)
├── Lines 201-270: updateBadgeRect() - Measurements
├── Lines 291-339: handleDrag() - V7.11 HYBRID LOGIC ⭐
├── Lines 341-354: handleCornerDrag() - Simple mode
└── Lines 900-1300: Render logic (overlays, handles)
```

### Key Variables:
- `spacingMode`: 'margin' | 'padding'
- `badgeRect`: DOMRect with added `wrapperWidth`, `wrapperHeight`
- `prefix`: 'margin' or 'padding' (for prop names)
- `availableWidth`: `wrapperWidth - badgeWidth`

---

## 📊 GIT TAG MANAGEMENT

### List all spacing-related tags:
```bash
git tag -l "v7.*"
```

### View tag annotation:
```bash
git show v7.11-hybrid-margin-stable
```

### Compare versions:
```bash
git diff v7.10..v7.11-hybrid-margin-stable
```

### Delete tag (if needed):
```bash
git tag -d v7.11-hybrid-margin-stable  # local
git push origin :refs/tags/v7.11-hybrid-margin-stable  # remote
```

---

**Last Updated:** 2025-11-13
**Maintained by:** Development Team
**Status:** Living Document

---

*This document tracks the evolution of the spacing system to enable quick recovery and understanding of design decisions.*
