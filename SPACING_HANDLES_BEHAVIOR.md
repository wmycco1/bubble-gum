# SpacingHandlesV2 - Complete Behavior Matrix

## 📊 Parameter Interaction Matrix

This document describes how different CSS properties affect margin/padding handle visibility and behavior in the visual editor.

---

## 🎯 Core Rules

### Rule 1: Padding ALWAYS works
- **Padding** works on ALL 4 sides regardless of `display`, `position`, or `align`
- All padding handles are always visible and functional

### Rule 2: Margin depends on Display
- **Display mode** determines which margin sides work in the browser
- Handles are hidden for sides that don't work

### Rule 3: Alignment blocks horizontal margin
- **Align** (center/right/full) uses `margin-left/right: auto`
- This CONFLICTS with manual margin-left/right
- Left/right margin handles are DISABLED when align is active

---

## 📋 Complete Test Matrix

### Display Mode Behavior

| Display | Top Margin | Right Margin | Bottom Margin | Left Margin | Reason |
|---------|-----------|--------------|---------------|-------------|---------|
| **block** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **inline-block** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **inline** | ❌ | ✅ | ❌ | ✅ | Inline ignores vertical margin |
| **flex** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **inline-flex** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **grid** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **inline-grid** | ✅ | ✅ | ✅ | ✅ | All sides work |
| **none** | N/A | N/A | N/A | N/A | Element hidden |

---

### Alignment Mode Behavior (CRITICAL!)

| Align | Top Margin | Right Margin | Bottom Margin | Left Margin | Badge.tsx Behavior |
|-------|-----------|--------------|---------------|-------------|-------------------|
| **none** | ✅ | ✅ | ✅ | ✅ | No alignment, all margins work |
| **left** | ✅ | ❌ | ✅ | ✅ | `margin-right: auto` (disable right) |
| **center** | ✅ | ❌ | ✅ | ❌ | `margin-left/right: auto` (disable both) |
| **right** | ✅ | ✅ | ✅ | ❌ | `margin-left: auto` (disable left) |
| **full** | ✅ | ❌ | ✅ | ❌ | `width: 100%`, margins set to 0 |

**Why?** Badge component uses auto margins for alignment (Badge.tsx lines 943-984):
```typescript
case 'left':
  styleOverrides.push(`margin-left: 0 !important`);
  styleOverrides.push(`margin-right: auto !important`); // ← CONFLICTS with manual right margin

case 'center':
  styleOverrides.push(`margin-left: auto !important`);  // ← CONFLICTS with manual left margin
  styleOverrides.push(`margin-right: auto !important`); // ← CONFLICTS with manual right margin

case 'right':
  styleOverrides.push(`margin-left: auto !important`);  // ← CONFLICTS with manual left margin
  styleOverrides.push(`margin-right: 0 !important`);

case 'full':
  styleOverrides.push(`width: 100% !important`);
  styleOverrides.push(`margin-left: 0 !important`);
  styleOverrides.push(`margin-right: 0 !important`);
```

When `margin: auto` is used, manual margin values are overridden!

---

### Position Mode Behavior

| Position | Top Margin | Right Margin | Bottom Margin | Left Margin | Notes |
|----------|-----------|--------------|---------------|-------------|-------|
| **static** | ✅ | ✅ | ✅ | ✅ | Normal flow |
| **relative** | ✅ | ✅ | ✅ | ✅ | Normal flow + offset |
| **absolute** | ✅ | ✅ | ✅ | ✅ | Out of flow, no margin collapse |
| **fixed** | ✅ | ✅ | ✅ | ✅ | Out of flow, viewport-relative |
| **sticky** | ✅ | ✅ | ✅ | ✅ | Hybrid behavior |

**Note:** Position doesn't restrict which sides work, but affects margin collapse behavior.

---

## 🧪 Test Cases

### Test Case 1: Inline Display
**Setup:**
- Component: Badge
- Display: `inline`
- Align: none
- Expected: Only left/right margin handles visible

**Result:** ✅ Top/bottom handles hidden (vertical margin ignored by inline elements)

---

### Test Case 2: Center Alignment
**Setup:**
- Component: Badge
- Display: `block`
- Align: `center`
- Expected: Only top/bottom margin handles visible

**Result:** ✅ Left/right handles hidden (conflicts with auto margins)

---

### Test Case 3: Inline + Center (edge case!)
**Setup:**
- Component: Badge
- Display: `inline`
- Align: `center`
- Expected: NO margin handles visible!

**Result:** ✅ All handles hidden
- Top/bottom: disabled by inline display
- Left/right: disabled by center alignment

---

### Test Case 4: Block + Left Align
**Setup:**
- Component: Badge
- Display: `block`
- Align: `left`
- Expected: Top/bottom/LEFT handles visible, RIGHT hidden

**Result:** ✅ Right handle hidden (controlled by margin-right: auto)

---

### Test Case 5: Block + Right Align
**Setup:**
- Component: Badge
- Display: `block`
- Align: `right`
- Expected: Top/bottom/RIGHT handles visible, LEFT hidden

**Result:** ✅ Left handle hidden (controlled by margin-left: auto)

---

### Test Case 6: Padding (always works)
**Setup:**
- Component: Badge
- Display: any
- Align: any
- Position: any
- Mode: **padding**
- Expected: All 4 padding handles ALWAYS visible

**Result:** ✅ Padding ignores all restrictions

---

## 🔧 Implementation Details

### Code Location
`/var/www/bubble-gum/components/editor/canvas/SpacingHandlesV2.tsx`

### Key Functions

**1. Determine which sides are applicable:**
```typescript
const getApplicableSides = (): { top: boolean; right: boolean; bottom: boolean; left: boolean } => {
  // 1. Padding always works
  if (spacingMode === 'padding') {
    return { top: true, right: true, bottom: true, left: true };
  }

  // 2. Check display mode
  if (displayMode === 'inline') {
    sides.top = false;
    sides.bottom = false;
  }

  // 3. Check alignment (CRITICAL!)
  if (alignMode) {
    switch (alignMode) {
      case 'left': sides.right = false; break;
      case 'center': sides.left = false; sides.right = false; break;
      case 'right': sides.left = false; break;
      case 'full': sides.left = false; sides.right = false; break;
    }
  }

  return sides;
};
```

**2. Generate user-friendly explanations:**
```typescript
const getDisabledReason = (side: Side): { reason: string; action: string } | null => {
  // Only for margin mode - padding always works
  if (spacingMode === 'padding') return null;
  if (applicableSides[side]) return null;

  // Vertical sides (top/bottom) - check display mode
  if ((side === 'top' || side === 'bottom') && displayMode === 'inline') {
    return {
      reason: 'Inline elements ignore vertical margin in browsers',
      action: 'Change Display to Block, Inline Block, Flex, or Grid'
    };
  }

  // Horizontal sides (left/right) - check alignment
  if (side === 'left' || side === 'right') {
    if (alignMode === 'center') {
      return {
        reason: 'Center alignment uses automatic margins on both sides',
        action: 'Change Align to None, Left, or Right to control margins manually'
      };
    }
    // ... other alignment cases
  }

  return null;
};
```

---

## 🎨 Visual Feedback

### Active Handles (Enabled sides)
- ✅ Full interactive handle rendered
- ✅ Blue/green overlay visible
- ✅ Dashed line showing boundaries
- ✅ Value label displayed on hover/drag
- ✅ Draggable with visual feedback

### Ghost Indicators (Disabled sides) - **NEW in V2.3!**
When a handle is disabled, user sees:
- 🔴 **Ghost handle icon** - Red dashed bar (24×4px or 4×24px)
- 🔴 **Tooltip on hover** - Explains WHY handle is disabled
- 💡 **Action hint** - Suggests how to enable the handle
- 🚫 **Cursor: not-allowed** - Visual feedback that interaction is blocked

**Ghost Indicator Structure:**
```
⚠️ [Side] margin disabled
📝 [Reason why it's disabled]
💡 [Action to enable it]
```

**Example tooltips:**
- **Top disabled (inline display):**
  - ⚠️ Top margin disabled
  - Inline elements ignore vertical margin in browsers
  - 💡 Change Display to Block, Inline Block, Flex, or Grid

- **Left disabled (right alignment):**
  - ⚠️ Left margin disabled
  - Right alignment uses margin-left: auto for positioning
  - 💡 Change Align to None, Left, or Center

User sees clear feedback for BOTH enabled AND disabled handles!

---

## 🐛 Known Issues & Limitations

### Issue 1: Align + Display interaction
**Problem:** When `align: center` + `display: inline`, no margin handles shown
**Status:** ✅ Expected behavior (both restrictions apply)
**Workaround:** Use `display: block` or `align: left`

### Issue 2: Full alignment
**Problem:** `align: full` sets `width: 100%`, left/right margin has no visible effect
**Status:** ✅ Handles correctly hidden (margin wouldn't be visible anyway)

---

## 📝 Version History

- **V2.0** (2025-11-13): Initial implementation with display mode support
- **V2.1** (2025-11-13): Added alignment mode support (CRITICAL FIX)
- **V2.2** (2025-11-13): Added position mode documentation
- **V2.3** (2025-11-13): Added ghost indicators with tooltips for disabled handles (UX ENHANCEMENT)
- **V3.0 (GOD-TIER)** (2025-11-13): Fixed CRITICAL bug - margin overlays now use badgeRect (measured) instead of props values. Overlays no longer "залезают" на Badge. See MARGIN_OVERLAY_MATHEMATICS.md for details.
- **V3.1 (WRAPPER FIX)** (2025-11-13): Fixed CRITICAL wrapper bug - RenderComponent.tsx wrapper div now has `display: inline-block` to allow Badge's margin to create actual space. Before this fix, wrapper shrunk to child's content box and margin had no effect in browser.

---

## ✅ Testing Checklist

### Display Mode Tests
- [x] Display: inline - only horizontal margin (top/bottom hidden)
- [x] Display: block - all sides work
- [x] Display: inline-block - all sides work
- [x] Display: flex - all sides work
- [x] Display: inline-flex - all sides work
- [x] Display: grid - all sides work
- [x] Display: inline-grid - all sides work

### Alignment Mode Tests
- [x] Align: none - all sides work
- [x] Align: left - top/bottom/left work, right hidden
- [x] Align: center - only top/bottom work
- [x] Align: right - top/bottom/right work, left hidden
- [x] Align: full - only top/bottom work

### Position Mode Tests
- [x] Position: static - documented (no restrictions)
- [x] Position: relative - documented (no restrictions)
- [x] Position: absolute - documented (out of flow, no restrictions)
- [x] Position: fixed - documented (out of flow, no restrictions)
- [x] Position: sticky - documented (no restrictions)

### Padding Mode Test
- [x] Padding mode - ALWAYS all sides (ignores all restrictions)

### Edge Cases
- [x] Edge case: inline + center align (NO handles!)
- [x] Edge case: inline + left align (only LEFT handle)
- [x] Edge case: inline + right align (only RIGHT handle)
- [x] Edge case: block + full align (only top/bottom)

---

**Last Updated:** 2025-11-13
**Maintained by:** Claude AI
