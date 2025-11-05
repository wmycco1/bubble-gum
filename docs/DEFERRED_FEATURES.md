# ⏭️ DEFERRED FEATURES - Phase Tracking

**Generated:** November 05, 2025
**Purpose:** Track features deferred to later roadmap phases per user request
**Rationale:** Focus on high-value MVP features first, defer complex features to appropriate phases

---

## 📋 DEFERRED TO WEEK 12 (Sprint 6 - P1.13)

### Image Upload & Optimization

**User Request:**
> "Нужно также добавить возможность загрузки с локального диска и также автоматического преобразование его в webp формат и правильная нарезка в зависимости от responsive design."

**Features:**
1. **Local File Upload** - Upload images from user's computer
2. **WebP Conversion** - Automatic format conversion for performance
3. **Responsive Image Slicing** - Generate different sizes for desktop/tablet/mobile

**Roadmap Reference:**
- **Task:** P1.13 - Image Library & Upload [5 SP]
- **Week:** 12 (Sprint 6)
- **Assignee:** Full-stack Developer
- **Duration:** 3 days
- **Dependencies:** P0.7 (R2 storage)

**Status:** ⏭️ DEFERRED - Already planned in roadmap

**Rationale:**
- Requires Cloudflare R2 storage setup (P0.7)
- Image processing is complex (sharp library, multiple formats)
- Not blocking MVP core functionality
- Week 12 is appropriate timing after core editor complete

**Current Implementation:**
- ✅ Image Library Modal with URL input (MVP complete)
- ✅ Sample image gallery (6 Unsplash images)
- ✅ Preview before selection
- ❌ Local file upload (deferred)
- ❌ WebP conversion (deferred)
- ❌ Responsive slicing (deferred)

---

## 📋 DEFERRED TO FUTURE (Requires Canvas Refactor)

### Advanced Drag & Drop System

**User Request:**
> "При выборе компонента в левой панеле 'Components' пользователь должен иметь возможность вытягивать в удобное место или область, к примеру во внутрь компонента который лежит на канвасе, к примеру grid."

**Features:**
1. **Drag from Palette to Container** - Drag components directly into Grid, Container, etc.
2. **Visual Drop Zones** - Highlight valid drop areas on hover
3. **Nested Component Placement** - Place components inside other components
4. **Grid as Child of Container** - Drag Grid into Container component

**Roadmap Reference:**
- Not explicitly documented in roadmap
- Related to: P1.4 - Canvas & Drag-Drop System (Week 6)
- Requires: Canvas architecture refactor for nested drag zones

**Status:** ⏭️ DEFERRED - Requires significant Canvas refactor

**Rationale:**
- Current dnd-kit implementation handles basic drag-drop
- Nested drop zones require complex collision detection
- Need to prevent circular nesting (Grid in Grid, Container in itself)
- Need to handle component tree updates correctly
- Not blocking MVP core functionality
- Better to implement after core canvas is stable

**Current Implementation:**
- ✅ Drag components from palette to canvas
- ✅ Reorder components on canvas
- ✅ Basic component tree structure
- ❌ Drag into specific containers (deferred)
- ❌ Visual drop zone highlights (deferred)
- ❌ Nested component placement (deferred)

**Recommended Approach (When Implementing):**
1. Add `droppable` zones to Container, Grid, Section components
2. Implement collision detection with `dnd-kit` sensors
3. Add visual feedback (highlight drop zones on drag over)
4. Update `insertComponent` logic to handle parent-child relationships
5. Add validation to prevent circular nesting
6. Create E2E tests for drag scenarios

---

## 📋 DEFERRED TO FUTURE (UI/UX Enhancement)

### Grid Column Management UI

**User Request:**
> "Менять ширину колонок, указывать количество колонок, добавлять колонки и в одну из колонок вытащить дополнительный компонент, к примеру текст и расположить в одной из колонки."

**Features:**
1. **Column Count Control** - UI to set number of columns (1-12)
2. **Column Width Editor** - Adjust width of individual columns
3. **Add/Remove Columns** - Dynamic column management
4. **Component Placement in Columns** - Drag components into specific grid cells

**Roadmap Reference:**
- Grid component exists (P1.6 - Component Library, Week 8)
- Advanced management UI not documented
- Related to responsive controls (P1.12, Week 12)

**Status:** ⏭️ DEFERRED - Enhancement after MVP

**Rationale:**
- Basic Grid component already implemented
- Column count can be set via props (1, 2, 3, 4, 6, 12)
- Advanced UI requires visual grid editor
- Not blocking MVP core functionality
- Better to implement after user testing shows demand

**Current Implementation:**
- ✅ Grid component with responsive columns
- ✅ Column count via props (PropertiesPanel)
- ✅ Gap control (sm, md, lg, xl)
- ❌ Visual column width editor (deferred)
- ❌ Add/remove column buttons (deferred)
- ❌ Drag components into specific cells (deferred)

**Recommended Approach (When Implementing):**
1. Add visual grid cell overlay on Grid selection
2. Add resize handles to column dividers
3. Add "+/- Column" buttons in PropertiesPanel
4. Implement drag zones for each grid cell
5. Store column widths in Grid props (`columnWidths: string[]`)
6. Use CSS Grid `grid-template-columns` for custom widths

---

## 📋 DEFERRED TO FUTURE (Advanced Feature)

### Visual Spacing Editor (Drag Handles)

**User Request:**
> "Через удерживание части элемента на канвасе и меня его внешние и внутренние отступы в зависимости от того как в сторону и что хочет поменять пользователь."

**Features:**
1. **Drag Handles on Canvas** - Visual handles for spacing adjustment
2. **Visual Margin Indicators** - Show margin areas on component hover
3. **Visual Padding Indicators** - Show padding areas when selected
4. **Drag to Adjust** - Click and drag to change margin/padding values

**Roadmap Reference:**
- Not documented in roadmap
- Related to: Properties panel enhancements (P1.5, Week 7)

**Status:** ⏭️ DEFERRED - Advanced UX feature

**Rationale:**
- Complex implementation (requires canvas overlay)
- Current SpacingControls provide explicit inputs (Week 7 requirement)
- Visual editing is "nice to have" not "must have" for MVP
- Better to validate with explicit inputs first
- Can add visual editor based on user feedback

**Current Implementation:**
- ✅ SpacingControls component with explicit inputs
- ✅ Visual 4-side editor (top, right, bottom, left)
- ✅ Supports px, rem, em, % units
- ✅ Responsive (works with breakpoints)
- ❌ Drag handles on canvas (deferred)
- ❌ Visual margin/padding indicators (deferred)

**Recommended Approach (When Implementing):**
1. Add overlay layer to Canvas for handles
2. Detect component bounds and add resize/spacing handles
3. Track mouse drag events for handle movement
4. Convert pixel drag distance to CSS units
5. Update component style in real-time
6. Add visual indicators (blue for padding, orange for margin)

---

## 📊 SUMMARY

| Feature | Roadmap Status | Sprint | Priority | Status |
|---------|---------------|--------|----------|--------|
| **Image Upload/WebP/Slicing** | P1.13, Week 12 | Sprint 6 | MEDIUM | ⏭️ DEFERRED |
| **Advanced Drag-Drop** | Not documented | TBD | MEDIUM | ⏭️ DEFERRED |
| **Grid Management UI** | Not documented | TBD | LOW | ⏭️ DEFERRED |
| **Visual Spacing Editor** | Not documented | TBD | LOW | ⏭️ DEFERRED |

**Implemented Instead:**
- ✅ **SpacingControls** - Explicit margin/padding inputs (Week 7 requirement)
- ✅ **Image Library Modal** - URL input + sample gallery (MVP)
- ✅ **Responsive Design System** - Breakpoints + style inheritance
- ✅ **Basic Grid Component** - Column count, gap, responsive

**Next Actions:**
1. Continue with roadmap Phase 1 tasks
2. Revisit deferred features in appropriate sprints
3. Gather user feedback on current implementations
4. Prioritize based on user demand and impact

---

**Last Updated:** November 05, 2025
**Maintained by:** Claude AI
