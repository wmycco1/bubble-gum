# Margin Overlay Mathematics - God-Tier Implementation

**Version:** 3.0 (GOD-TIER)
**Date:** 2025-11-13
**Status:** ✅ PRODUCTION READY

---

## 🎯 Проблема (До God-Tier Рефакторинга)

### ❌ Неправильная Реализация (V2.2 и ранее)

```typescript
// ❌ WRONG - использовали margin VALUE из props
{applicableSides.top && topValue > 0 && (
  <div style={{
    top: '0px',
    height: `${topValue}px`,  // ❌ BAG! Props value != реальная позиция Badge
  }} />
)}
```

**Что было не так:**
- Использовали `topValue` (значение из props: `marginTop: 20`)
- НО Badge мог быть на **другой** позиции из-за:
  - `margin: auto` (alignment)
  - CSS cascading
  - Browser defaults
  - Parent constraints

**Результат:** Overlay "залезал" на Badge вместо отображения в margin-пространстве.

---

## ✅ Правильная Математика (V3.0 God-Tier)

### Ключевая Концепция

**Margin = расстояние между wrapper boundary и Badge boundary**

```
┌──────────────────────────────────────┐ ← Wrapper (0,0)
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← TOP MARGIN (height = badgeRect.top)
│ ┌──────────────────────────────────┐ │ ← Badge top edge
│ │         BADGE CONTENT            │ │
│ │                                  │ │
│ └──────────────────────────────────┘ │ ← Badge bottom edge
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← BOTTOM MARGIN (height = wrapperRect.height - badgeRect.bottom)
└──────────────────────────────────────┘ ← Wrapper bottom
```

---

## 📐 Математические Формулы

### Координатная Система

**Wrapper координаты:**
- `wrapperRect.top = 0` (начало координат)
- `wrapperRect.left = 0` (начало координат)
- `wrapperRect.width` (ширина wrapper)
- `wrapperRect.height` (высота wrapper)

**Badge координаты (относительно wrapper):**
```typescript
// getBoundingClientRect() дает viewport coordinates
// Конвертируем в wrapper-relative:
const relativeRect = {
  top: badgeRect.top - wrapperRect.top,      // Расстояние от wrapper top до Badge top
  left: badgeRect.left - wrapperRect.left,    // Расстояние от wrapper left до Badge left
  right: badgeRect.right - wrapperRect.left,  // Позиция Badge right edge
  bottom: badgeRect.bottom - wrapperRect.top, // Позиция Badge bottom edge
  width: badgeRect.width,
  height: badgeRect.height,
};
```

---

### Top Margin Overlay

**Формула:**
```typescript
const topMarginHeight = badgeRect.top - 0; // или просто badgeRect.top
```

**Позиционирование:**
```typescript
{
  position: 'absolute',
  top: '0px',                    // Начало от wrapper top
  left: '0px',
  width: `${wrapperRect.width}px`,
  height: `${badgeRect.top}px`, // ✅ ВЫСОТА = расстояние до Badge
}
```

**Почему это правильно:**
- Если `badgeRect.top = 20`, значит Badge **на 20px ниже** wrapper top
- Это и есть **TOP MARGIN**!

---

### Right Margin Overlay

**Формула:**
```typescript
const rightMarginWidth = wrapperRect.width - badgeRect.right;
```

**Позиционирование:**
```typescript
{
  position: 'absolute',
  top: '0px',
  right: '0px',                  // Прижат к wrapper right
  width: `${wrapperRect.width - badgeRect.right}px`, // ✅ ШИРИНА = расстояние от Badge right до wrapper right
  height: `${wrapperRect.height}px`,
}
```

**Математика:**
- `wrapperRect.width = 300px`
- `badgeRect.right = 250px` (Badge заканчивается на 250px от wrapper left)
- `rightMargin = 300 - 250 = 50px` ✅

---

### Bottom Margin Overlay

**Формула:**
```typescript
const bottomMarginHeight = wrapperRect.height - badgeRect.bottom;
```

**Позиционирование:**
```typescript
{
  position: 'absolute',
  bottom: '0px',                 // Прижат к wrapper bottom
  left: '0px',
  width: `${wrapperRect.width}px`,
  height: `${wrapperRect.height - badgeRect.bottom}px`, // ✅ ВЫСОТА = расстояние от Badge bottom до wrapper bottom
}
```

---

### Left Margin Overlay

**Формула:**
```typescript
const leftMarginWidth = badgeRect.left - 0; // или просто badgeRect.left
```

**Позиционирование:**
```typescript
{
  position: 'absolute',
  top: '0px',
  left: '0px',                   // Начало от wrapper left
  width: `${badgeRect.left}px`, // ✅ ШИРИНА = расстояние до Badge
  height: `${wrapperRect.height}px`,
}
```

---

## 🧪 Verification Tests

### Test 1: Badge with margin: 20px

**Setup:**
```typescript
marginTop: 20,
marginRight: 30,
marginBottom: 40,
marginLeft: 10,
```

**Expected badgeRect (relative to wrapper):**
```typescript
badgeRect.top = 20     // ✅ Top margin
badgeRect.left = 10    // ✅ Left margin
badgeRect.right = wrapperWidth - 30  // ✅ Right margin
badgeRect.bottom = wrapperHeight - 40 // ✅ Bottom margin
```

**Overlay heights/widths:**
```typescript
topOverlay.height = badgeRect.top = 20 ✅
rightOverlay.width = wrapperWidth - badgeRect.right = 30 ✅
bottomOverlay.height = wrapperHeight - badgeRect.bottom = 40 ✅
leftOverlay.width = badgeRect.left = 10 ✅
```

---

### Test 2: Badge with margin: auto (centered)

**Setup:**
```typescript
marginLeft: 'auto',
marginRight: 'auto',
width: '200px',
```

**Expected (wrapper 400px wide):**
```typescript
badgeRect.left = 100   // (400 - 200) / 2
badgeRect.right = 300  // 100 + 200
```

**Overlay widths:**
```typescript
leftOverlay.width = badgeRect.left = 100 ✅ (shows auto margin space)
rightOverlay.width = 400 - 300 = 100 ✅ (shows auto margin space)
```

**Важно:** Overlays показывают **РЕАЛЬНОЕ** пространство, даже если margin создан через `auto`!

---

## 🎯 Edge Cases

### Edge Case 1: Badge Pressed Against Wrapper Edge

**Scenario:** `marginTop = 0`

**Result:**
```typescript
badgeRect.top = 0
topOverlay.height = 0  // Overlay не рендерится (условие: > 0)
```

✅ **Правильно!** Нет margin = нет overlay.

---

### Edge Case 2: Badge Overflow (shouldn't happen, but...)

**Scenario:** Badge больше wrapper (bad CSS)

**Protection:**
```typescript
if (badgeRect.bottom > wrapperRect.height) {
  // Badge overflows - don't render bottom overlay
}
```

**Current implementation:** Условие `> 0` в рендеринге автоматически защищает.

---

### Edge Case 3: Inline Display with Vertical Margin

**Scenario:** `display: inline`, `marginTop: 20`

**Browser behavior:** Vertical margin игнорируется.

**Our implementation:**
```typescript
// badgeRect.top может быть 0 даже если marginTop: 20
// Overlay height = badgeRect.top = 0
// Overlay НЕ рендерится ✅ (корректно отражает браузерное поведение!)
```

---

## 🚀 Performance Optimization

### 1. Use RAF for Updates

```typescript
React.useEffect(() => {
  const updateBadgeRect = () => {
    // Measure Badge position
  };

  // Throttle with RAF
  const handleUpdate = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateBadgeRect);
  };

  window.addEventListener('resize', handleUpdate);
  return () => {
    window.removeEventListener('resize', handleUpdate);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, [componentId]);
```

---

### 2. Conditional Rendering

```typescript
// Only render overlay if margin > 0
{applicableSides.top && badgeRect.top > 0 && (
  <TopMarginOverlay />
)}
```

**Benefit:** 0 overlays when no margin = 0 DOM nodes = faster rendering.

---

### 3. Memo Calculations

```typescript
const overlayDimensions = React.useMemo(() => ({
  top: badgeRect.top,
  right: wrapperRect.width - badgeRect.right,
  bottom: wrapperRect.height - badgeRect.bottom,
  left: badgeRect.left,
}), [badgeRect, wrapperRect]);
```

---

## 📊 Comparison: Old vs New

| Aspect | Old (V2.2) | New (V3.0 God-Tier) |
|--------|------------|---------------------|
| **Data Source** | `marginTop` prop | `badgeRect.top` (measured) |
| **Accuracy** | ❌ Incorrect when margin:auto | ✅ Always correct |
| **Edge Case: margin:auto** | ❌ Shows wrong size | ✅ Shows actual space |
| **Edge Case: inline display** | ❌ Shows overlay even though margin ignored | ✅ No overlay (correct!) |
| **Visual Quality** | ❌ Overlays "залезают" на Badge | ✅ Overlays in margin space only |
| **Math Complexity** | Simple but wrong | Correct and elegant |

---

## ✅ Final God-Tier Implementation

```typescript
// Top Margin Overlay
{applicableSides.top && badgeRect.top > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: `${wrapperRect.width}px`,
      height: `${badgeRect.top}px`, // ✅ ACTUAL distance to Badge
      backgroundColor: 'rgba(96, 165, 250, 0.35)',
      borderTop: '2px solid #3b82f6',
      borderBottom: '2px dashed #3b82f6',
      zIndex: 43,
    }}
  />
)}

// Right Margin Overlay
{applicableSides.right && (wrapperRect.width - badgeRect.right) > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '0px',
      right: '0px',
      width: `${wrapperRect.width - badgeRect.right}px`, // ✅ ACTUAL distance from Badge to wrapper right
      height: `${wrapperRect.height}px`,
      // ... rest of styles
    }}
  />
)}

// Bottom Margin Overlay
{applicableSides.bottom && (wrapperRect.height - badgeRect.bottom) > 0 && (
  <div
    style={{
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      width: `${wrapperRect.width}px`,
      height: `${wrapperRect.height - badgeRect.bottom}px`, // ✅ ACTUAL distance from Badge to wrapper bottom
      // ... rest of styles
    }}
  />
)}

// Left Margin Overlay
{applicableSides.left && badgeRect.left > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: `${badgeRect.left}px`, // ✅ ACTUAL distance to Badge
      height: `${wrapperRect.height}px`,
      // ... rest of styles
    }}
  />
)}
```

---

## 🛠️ CRITICAL WRAPPER FIX (V3.1)

### Проблема: Margin не применялся в браузере

**Симптомы (до V3.1):**
- `marginTop: 87px` был в props Badge
- Inline styles с `!important` применялись к Badge span
- НО в браузере Badge был flush против wrapper top (badgeRect.top === 0)
- Overlays НЕ рендерились (условие: `badgeRect.top > 0`)

**Root Cause:**
Wrapper div в `RenderComponent.tsx` (строка 287-299):
```typescript
<div
  data-component-id={component.id}
  style={{
    opacity: isDragging ? 0.3 : 1,
    zIndex: isSelected ? 10 : 1,
    // ПРОБЛЕМА: нет display, wrapper сжимается к content box
  }}
  className={cn('relative cursor-auto transition-all', ...)}
>
  <Badge marginTop={87} marginLeft={79} /> {/* Margin не создаёт пространство! */}
</div>
```

**Почему margin не работал:**
1. Wrapper div был `position: relative` (из Tailwind класса)
2. Wrapper НЕ имел `display: inline-block` или `display: block`
3. По умолчанию wrapper сжимался к размеру Badge content box
4. Margin Badge был "коллапсирован" - некуда "отодвигаться" от родителя!

**Решение (V3.1):**
```typescript
const style: React.CSSProperties = {
  opacity: isDragging ? 0.3 : 1,
  zIndex: isSelected ? 10 : 1,
  pointerEvents: isDragging ? 'none' : 'auto',
  willChange: isDragging ? 'opacity' : 'auto',
  transition: 'opacity 100ms ease-out',
  ...(visibility && { visibility }),
  // ✅ CRITICAL FIX: Add display: inline-block to allow child's margin to create space
  display: 'inline-block', // ← КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ!
};
```

**Как это работает:**
- `display: inline-block` на wrapper позволяет child's margin создавать РЕАЛЬНОЕ пространство
- Теперь Badge с `marginTop: 87px` действительно отодвигается на 87px от wrapper top
- `badgeRect.top` теперь будет `87`, а не `0`!
- Overlays корректно рендерятся с `height: 87px` ✅

**Файлы изменены:**
- `/var/www/bubble-gum/components/editor/RenderComponent.tsx` - V5.1.0 (строка 111)

---

## 🎉 Результат (V3.1 - God-Tier + Wrapper Fix)

- ✅ Overlays всегда в margin-пространстве, никогда не залезают на Badge
- ✅ Работает с margin: auto (alignment)
- ✅ Работает с display: inline (показывает реальное поведение браузера)
- ✅ Pixel-perfect accuracy
- ✅ Performance optimized (RAF, conditional rendering)
- ✅ God-tier математика
- ✅ Wrapper больше не блокирует margin! Badge's margin теперь создаёт РЕАЛЬНОЕ пространство!

**Status:** 🚀 PRODUCTION READY

---

**Last Updated:** 2025-11-13
**Version:** 3.1 (God-Tier + Wrapper Fix)
