'use client';

/**
 * SpacingHandlesV2 - Modern Figma-style spacing controls (2025)
 *
 * Features:
 * - Compact handles ON the component borders
 * - Visual spacing overlay (margin=blue, padding=green)
 * - Inline value display on hover
 * - Minimal, elegant design
 * - Works for ALL components (atoms, molecules, organisms)
 * - Smart handle visibility based on CSS display/alignment/position
 * - Ghost indicators with tooltips for disabled handles
 * - GOD-TIER margin overlay mathematics (V3.0+)
 *
 * Version: 7.0 (MARGIN INSIDE WRAPPER ARCHITECTURE) - 2025-11-13
 * V7.0: GOD-TIER ARCHITECTURAL FIX ✅
 *       - MARGIN OVERLAYS: Show margin space INSIDE wrapper (not outside!) ✅
 *       - Visualize space BETWEEN wrapper edge and Badge edge ✅
 *       - Margin applied directly to Badge via CSS ✅
 *       - Measurements: Badge position relative to wrapper parent
 *       - MARGIN: Overlays positioned from wrapper edge to Badge edge (inside wrapper bounds)
 *       - PADDING: Positive positioning inside Badge border box
 *       - CSS Box Model compliant architecture
 *       - Smart display logic: block→100%, inline-block→fit-content
 * V6.0: Negative positioning (DEPRECATED - overlays went outside wrapper)
 * V5.0: Margin on wrapper (DEPRECATED - caused issues)
 * V4.0: Mode controlled by ComponentToolbar
 * Tested: All display modes (block, inline-block, flex, inline-flex, grid)
 * Documentation: MARGIN_OVERLAY_MATHEMATICS.md
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useSpacingKeyboard } from './useSpacingKeyboard';

type SpacingMode = 'margin' | 'padding';
type Side = 'top' | 'right' | 'bottom' | 'left';

interface SpacingHandlesV2Props {
  componentId: string;
  mode?: 'margin' | 'padding'; // Mode is now controlled by parent (RenderComponent)
}

export function SpacingHandlesV2({ componentId, mode: externalMode = 'margin' }: SpacingHandlesV2Props) {
  const { components, updateComponentProps, cssCompliantMode } = useCanvasStore();
  const spacingMode: SpacingMode = externalMode; // Use mode from props instead of local state
  const [hoveredSide, setHoveredSide] = useState<Side | null>(null);
  const [draggingSide, setDraggingSide] = useState<Side | null>(null);
  const [badgeRect, setBadgeRect] = useState<DOMRect | null>(null);
  // V7.0: Badge controls margin via CSS, overlays conditional based on cssCompliantMode
  const rafRef = React.useRef<number | null>(null);
  const instanceId = React.useRef(`instance-${Math.random().toString(36).substr(2, 9)}`).current;

  // Enable keyboard shortcuts
  useSpacingKeyboard({ mode: spacingMode, enabled: true });

  // Get component
  const component = components.find(c => c.id === componentId);

  // Early return if component not found
  if (!component) return null;

  const props = component.props || {};
  const prefix = spacingMode;

  // Get display mode, position, and alignment to determine which spacing sides are applicable
  const displayMode = (props.display as string) || 'inline-flex'; // Default for Badge
  const positionMode = (props.position as string) || 'static';
  const alignMode = props.align as string | undefined;

  // Determine which sides are applicable based on display, position, alignment, and spacing type
  const getApplicableSides = (): { top: boolean; right: boolean; bottom: boolean; left: boolean } => {
    // PADDING always works on all sides regardless of display/position/alignment
    if (spacingMode === 'padding') {
      return { top: true, right: true, bottom: true, left: true };
    }

    // MARGIN behavior depends on display mode, position, and alignment
    let sides = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };

    // 1. Display mode restrictions
    if (displayMode === 'inline') {
      // Inline elements: only horizontal margin works (left, right)
      // Vertical margin (top, bottom) is ignored by browser
      sides.top = false;
      sides.bottom = false;
    }

    // 2. Alignment restrictions (CRITICAL!)
    // When align is set, Badge component uses margin auto for alignment
    // This CONFLICTS with manual margin-left/right values
    // Badge.tsx behavior:
    // - left: margin-left:0, margin-right:auto (disable RIGHT)
    // - center: margin-left:auto, margin-right:auto (disable BOTH)
    // - right: margin-left:auto, margin-right:0 (disable LEFT)
    // - full: margin-left:0, margin-right:0, width:100% (disable BOTH)
    if (alignMode) {
      switch (alignMode) {
        case 'left':
          // Left alignment uses margin-right:auto, so RIGHT margin is controlled by auto
          sides.right = false;
          break;
        case 'center':
          // Center uses both auto, disable both sides
          sides.left = false;
          sides.right = false;
          break;
        case 'right':
          // Right alignment uses margin-left:auto, so LEFT margin is controlled by auto
          sides.left = false;
          break;
        case 'full':
          // Full width: both margins set to 0, and they wouldn't be visible anyway
          sides.left = false;
          sides.right = false;
          break;
      }
    }

    // 3. Position mode info (for future enhancements)
    // absolute/fixed: element is out of flow, margin collapse doesn't apply
    // sticky: margin works normally
    // static/relative: normal margin behavior
    // Note: We don't restrict any sides based on position, just documenting behavior

    return sides;
  };

  const applicableSides = getApplicableSides();

  // Generate user-friendly explanation for why a handle is disabled
  const getDisabledReason = (side: Side): { reason: string; action: string } | null => {
    // Only for margin mode - padding always works
    if (spacingMode === 'padding') return null;

    // If side is applicable, no reason
    if (applicableSides[side]) return null;

    // Vertical sides (top/bottom) - check display mode
    if (side === 'top' || side === 'bottom') {
      if (displayMode === 'inline') {
        return {
          reason: 'Inline elements ignore vertical margin in browsers',
          action: 'Change Display to Block, Inline Block, Flex, or Grid'
        };
      }
    }

    // Horizontal sides (left/right) - check alignment
    if (side === 'left' || side === 'right') {
      if (alignMode === 'center') {
        return {
          reason: 'Center alignment uses automatic margins on both sides',
          action: 'Change Align to None, Left, or Right to control margins manually'
        };
      }
      if (alignMode === 'full') {
        return {
          reason: 'Full width alignment sets width to 100% (margins not visible)',
          action: 'Change Align to None to control horizontal margins'
        };
      }
      if (side === 'left' && alignMode === 'right') {
        return {
          reason: 'Right alignment uses margin-left: auto for positioning',
          action: 'Change Align to None, Left, or Center'
        };
      }
      if (side === 'right' && alignMode === 'left') {
        return {
          reason: 'Left alignment uses margin-right: auto for positioning',
          action: 'Change Align to None, Right, or Center'
        };
      }
    }

    return null;
  };

  // Get spacing values (MOVED BEFORE useEffect!)
  const getValue = (side: Side): number => {
    const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
    return props[`${prefix}${capitalizedSide}`] ?? props[prefix] ?? 0;
  };

  const topValue = getValue('top');
  const rightValue = getValue('right');
  const bottomValue = getValue('bottom');
  const leftValue = getValue('left');

  // V7.0: MARGIN CONDITIONAL - Measure Badge relative to different parent based on cssCompliantMode
  React.useEffect(() => {
    if (!componentId) return;

    const updateBadgeRect = () => {
      // Find wrapper div via data-component-id
      const wrapper = document.querySelector(`[data-component-id="${componentId}"]`) as HTMLElement;
      if (!wrapper) return;

      // Find the actual Badge span element (has data-testid="badge")
      const badgeElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
      if (!badgeElement) return;

      // CONDITIONAL PARENT: depends on cssCompliantMode
      let relativeParent: HTMLElement;
      if (cssCompliantMode) {
        // CSS-compliant mode: use canvas parent (allows margin to go outside)
        relativeParent = wrapper.parentElement as HTMLElement;
        if (!relativeParent) return;
      } else {
        // Visual mode: use .relative wrapper (keeps margin inside)
        relativeParent = badgeElement.closest('.relative') as HTMLElement;
        if (!relativeParent) return;
      }

      const badgeRectRaw = badgeElement.getBoundingClientRect();
      const relativeParentRectRaw = relativeParent.getBoundingClientRect();

      // V7.0: Get Badge's CSS margin (applied directly to Badge now!)
      const badgeStyle = window.getComputedStyle(badgeElement);
      const badgeMarginTop = parseFloat(badgeStyle.marginTop) || 0;
      const badgeMarginLeft = parseFloat(badgeStyle.marginLeft) || 0;
      const badgeMarginRight = parseFloat(badgeStyle.marginRight) || 0;
      const badgeMarginBottom = parseFloat(badgeStyle.marginBottom) || 0;

      console.log('🔍 V7.0 MARGIN INSIDE WRAPPER DEBUG:', {
        componentId,
        mode: spacingMode,
        // Badge info (has BOTH margin and padding!)
        'Badge CSS marginTop': badgeMarginTop,
        'Badge CSS marginLeft': badgeMarginLeft,
        'Badge rect': {
          top: badgeRectRaw.top,
          left: badgeRectRaw.left,
          width: badgeRectRaw.width,
          height: badgeRectRaw.height
        },
        // Relative parent info (position: relative container)
        'Relative parent rect': {
          top: relativeParentRectRaw.top,
          left: relativeParentRectRaw.left,
          width: relativeParentRectRaw.width,
          height: relativeParentRectRaw.height
        },
      });

      // V7.0: Badge rect RELATIVE TO position: relative parent (not canvas!)
      // This is CRITICAL because overlays use position: absolute and are positioned relative to this parent
      // For MARGIN mode: Overlays show space INSIDE wrapper (between wrapper edge and Badge edge)
      // For PADDING mode: Overlays show space INSIDE Badge (positive positioning)
      const relativeBadgeRect = {
        top: badgeRectRaw.top - relativeParentRectRaw.top,
        left: badgeRectRaw.left - relativeParentRectRaw.left,
        width: badgeRectRaw.width,
        height: badgeRectRaw.height,
        right: badgeRectRaw.right - relativeParentRectRaw.left,
        bottom: badgeRectRaw.bottom - relativeParentRectRaw.top,
        // ✅ V7.0 CRITICAL: Also store wrapper dimensions for right/bottom margin calculation
        wrapperWidth: relativeParentRectRaw.width,
        wrapperHeight: relativeParentRectRaw.height,
      } as DOMRect & { wrapperWidth: number; wrapperHeight: number };

      setBadgeRect(relativeBadgeRect);
    };

    updateBadgeRect();

    const handleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateBadgeRect);
    };

    // Listen to window resize
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [componentId, topValue, rightValue, bottomValue, leftValue, cssCompliantMode]); // Re-run when margins change OR mode switches!

  if (!badgeRect) return null;

  // Handle drag - receives absolute new value, not delta
  const handleDrag = (side: Side, newValue: number) => {
    const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
    let clampedValue = Math.max(0, Math.round(newValue));

    // ═══════════════════════════════════════════════════════════════
    // V7.11: HYBRID SOLUTION - Best of Both Worlds
    // ═══════════════════════════════════════════════════════════════
    // HORIZONTAL (left/right): Apply constraint system → margin-right moves Badge ✅
    // VERTICAL (top/bottom): Independent margins → wrapper expands ✅
    // ═══════════════════════════════════════════════════════════════

    if (spacingMode === 'margin') {
      // HORIZONTAL MARGINS: Apply Figma-like constraint system
      if (side === 'right') {
        // When margin-right increases → auto-decrease margin-left → Badge moves left
        const availableWidth = badgeRect.wrapperWidth - badgeRect.width;
        clampedValue = Math.min(clampedValue, availableWidth);
        const newMarginLeft = availableWidth - clampedValue;

        updateComponentProps(componentId, {
          marginRight: clampedValue,
          marginLeft: Math.max(0, newMarginLeft),
        });
        return;
      }

      if (side === 'left') {
        // When margin-left increases → auto-decrease margin-right → Badge moves right
        const availableWidth = badgeRect.wrapperWidth - badgeRect.width;
        clampedValue = Math.min(clampedValue, availableWidth);
        const newMarginRight = availableWidth - clampedValue;

        updateComponentProps(componentId, {
          marginLeft: clampedValue,
          marginRight: Math.max(0, newMarginRight),
        });
        return;
      }

      // VERTICAL MARGINS: Independent (allow wrapper expansion)
      // margin-top and margin-bottom work independently
      // Wrapper height expands naturally (like corner handle)
    }

    // Default: Simple independent behavior (padding + vertical margins)
    updateComponentProps(componentId, {
      [`${prefix}${capitalizedSide}`]: clampedValue,
    });
  };

  // Handle corner drag - updates all sides simultaneously (Uniform mode)
  const handleCornerDrag = (newValue: number) => {
    const clampedValue = Math.max(0, Math.round(newValue));

    // V7.11: For margin mode, set individual sides to maintain hybrid constraint system
    // For padding mode, use shorthand (simpler)
    if (spacingMode === 'margin') {
      updateComponentProps(componentId, {
        marginTop: clampedValue,
        marginRight: clampedValue,
        marginBottom: clampedValue,
        marginLeft: clampedValue,
      });
    } else {
      updateComponentProps(componentId, {
        // Set shorthand property and clear individual sides
        padding: clampedValue,
        paddingTop: undefined,
        paddingRight: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
      });
    }
  };

  // Get average spacing value for corner display
  const getAverageSpacing = (): number => {
    const avg = (topValue + rightValue + bottomValue + leftValue) / 4;
    return Math.round(avg);
  };

  // Colors
  const color = spacingMode === 'margin' ? '#3b82f6' : '#10b981'; // blue : green
  const overlayColor = spacingMode === 'margin' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(52, 211, 153, 0.18)';
  const borderColor = spacingMode === 'margin' ? '#3b82f6' : '#10b981';

  // V6.0: No bounds check needed - Badge is the only element

  console.log(`🔍 SpacingHandlesV2 RENDER [${instanceId}]:`, {
    componentId,
    spacingMode,
    topValue,
    leftValue,
    marginOverlaysWillRender: spacingMode === 'margin',
    paddingOverlaysWillRender: spacingMode === 'padding',
    topOverlayHeight: topValue,
    leftOverlayWidth: leftValue,
  });

  return (
    <>
      {/* Visual Overlays - Show spacing areas (like properties panel) - INTERACTIVE */}
      {spacingMode === 'margin' && (
        <>
          {console.log(`✅ V7.0 MARGIN MODE - ${cssCompliantMode ? 'CSS-compliant' : 'Visual'} mode`)}
          {/* V7.0: Top Margin Overlay - CONDITIONAL positioning based on cssCompliantMode */}
          {applicableSides.top && topValue > 0 && (
            <div
              data-overlay-type="margin-top"
              data-instance-id={instanceId}
              onMouseEnter={() => setHoveredSide('top')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                // CONDITIONAL: Visual mode (inside), CSS mode (outside with negative)
                top: cssCompliantMode ? `-${topValue}px` : '0px',
                left: cssCompliantMode ? '0px' : `${badgeRect.left}px`,
                width: cssCompliantMode ? `${badgeRect.width}px` : `${badgeRect.width}px`,
                height: cssCompliantMode ? `${topValue}px` : `${badgeRect.top}px`,
                backgroundColor:
                  draggingSide === 'top'
                    ? 'rgba(52, 211, 153, 0.4)' // Dragging: green 40%
                    : hoveredSide === 'top'
                    ? 'rgba(52, 211, 153, 0.25)' // Hover: green 25%
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20%
                borderBottom: `1px solid ${draggingSide === 'top' ? '#10b981' : hoveredSide === 'top' ? '#10b981' : '#3b82f6'}`, // Only bottom border (opposite side)
                pointerEvents: 'auto',
                cursor: 's-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* V7.0: Right Margin Overlay - CONDITIONAL positioning based on cssCompliantMode */}
          {applicableSides.right && rightValue > 0 && badgeRect.wrapperWidth && (
            <div
              data-overlay-type="margin-right"
              data-instance-id={instanceId}
              onMouseEnter={() => setHoveredSide('right')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: cssCompliantMode ? `-${topValue}px` : `${badgeRect.top}px`,
                left: cssCompliantMode ? `${badgeRect.right}px` : `${badgeRect.right}px`,
                width: cssCompliantMode ? `${rightValue}px` : `${badgeRect.wrapperWidth - badgeRect.right}px`,
                height: cssCompliantMode ? `${badgeRect.height + topValue + bottomValue}px` : `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'right'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'right'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20%
                borderLeft: `1px solid ${draggingSide === 'right' ? '#10b981' : hoveredSide === 'right' ? '#10b981' : '#3b82f6'}`, // Only left border (opposite side)
                pointerEvents: 'auto',
                cursor: 'w-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* V7.0: Bottom Margin Overlay - CONDITIONAL positioning based on cssCompliantMode */}
          {applicableSides.bottom && bottomValue > 0 && badgeRect.wrapperHeight && (
            <div
              data-overlay-type="margin-bottom"
              data-instance-id={instanceId}
              onMouseEnter={() => setHoveredSide('bottom')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: cssCompliantMode ? `${badgeRect.bottom}px` : `${badgeRect.bottom}px`,
                left: cssCompliantMode ? '0px' : `${badgeRect.left}px`,
                width: cssCompliantMode ? `${badgeRect.width}px` : `${badgeRect.width}px`,
                height: cssCompliantMode ? `${bottomValue}px` : `${badgeRect.wrapperHeight - badgeRect.bottom}px`,
                backgroundColor:
                  draggingSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20%
                borderTop: `1px solid ${draggingSide === 'bottom' ? '#10b981' : hoveredSide === 'bottom' ? '#10b981' : '#3b82f6'}`, // Only top border (opposite side)
                pointerEvents: 'auto',
                cursor: 'n-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* V7.0: Left Margin Overlay - CONDITIONAL positioning based on cssCompliantMode */}
          {applicableSides.left && leftValue > 0 && (
            <div
              data-overlay-type="margin-left"
              data-instance-id={instanceId}
              onMouseEnter={() => setHoveredSide('left')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: cssCompliantMode ? `-${topValue}px` : `${badgeRect.top}px`,
                left: cssCompliantMode ? `-${leftValue}px` : '0px',
                width: cssCompliantMode ? `${leftValue}px` : `${badgeRect.left}px`,
                height: cssCompliantMode ? `${badgeRect.height + topValue + bottomValue}px` : `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'left'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'left'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20%
                borderRight: `1px solid ${draggingSide === 'left' ? '#10b981' : hoveredSide === 'left' ? '#10b981' : '#3b82f6'}`, // Only right border (opposite side)
                pointerEvents: 'auto',
                cursor: 'e-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}
        </>
      )}

      {spacingMode === 'padding' && (
        <>
          {console.log('✅ PADDING MODE ACTIVE - rendering padding overlays')}
          {/* Top Padding Overlay - THREE STATES: idle (blue) → hover (green 15%) → dragging (green 25%) */}
          {topValue > 0 && (
            <div
              data-overlay-type="padding-top"
              onMouseEnter={() => setHoveredSide('top')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${Math.min(topValue, badgeRect.height / 2)}px`,
                backgroundColor:
                  draggingSide === 'top'
                    ? 'rgba(52, 211, 153, 0.4)' // Dragging: green 40% (more visible)
                    : hoveredSide === 'top'
                    ? 'rgba(52, 211, 153, 0.25)' // Hover: green 25% (more visible)
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20% (consistent with margin)
                borderBottom: `2px solid ${draggingSide === 'top' ? '#10b981' : hoveredSide === 'top' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ns-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Right Padding Overlay */}
          {rightValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('right')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.right - Math.min(rightValue, badgeRect.width / 2)}px`,
                width: `${Math.min(rightValue, badgeRect.width / 2)}px`,
                height: `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'right'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'right'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20% (consistent with margin)
                borderLeft: `2px solid ${draggingSide === 'right' ? '#10b981' : hoveredSide === 'right' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ew-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Bottom Padding Overlay */}
          {bottomValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('bottom')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.bottom - Math.min(bottomValue, badgeRect.height / 2)}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${Math.min(bottomValue, badgeRect.height / 2)}px`,
                backgroundColor:
                  draggingSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20% (consistent with margin)
                borderTop: `2px solid ${draggingSide === 'bottom' ? '#10b981' : hoveredSide === 'bottom' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ns-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Left Padding Overlay */}
          {leftValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('left')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left}px`,
                width: `${Math.min(leftValue, badgeRect.width / 2)}px`,
                height: `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'left'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'left'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.2)', // Idle: blue 20% (consistent with margin)
                borderRight: `2px solid ${draggingSide === 'left' ? '#10b981' : hoveredSide === 'left' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ew-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          GHOST INDICATORS - Show disabled handles with explanation
          ═══════════════════════════════════════════════════════════════
          Only in margin mode, only for disabled sides
          ═══════════════════════════════════════════════════════════════ */}
      {spacingMode === 'margin' && (
        <>
          {/* Top Ghost Indicator */}
          {!applicableSides.top && (() => {
            const reason = getDisabledReason('top');
            return reason ? (
              <div
                data-ghost-indicator="top"
                className="absolute group"
                style={{
                  top: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  pointerEvents: 'auto',
                  cursor: 'not-allowed',
                }}
              >
                {/* Ghost handle icon */}
                <div
                  style={{
                    width: '24px',
                    height: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.3)', // Red with transparency
                    border: '1px dashed rgba(239, 68, 68, 0.5)',
                    borderRadius: '2px',
                  }}
                />

                {/* Tooltip on hover */}
                <div
                  className="invisible group-hover:visible absolute bg-slate-900 text-white text-xs rounded-lg shadow-xl px-3 py-2 whitespace-nowrap"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '8px',
                    maxWidth: '280px',
                    whiteSpace: 'normal',
                    zIndex: 100,
                  }}
                >
                  <div className="font-semibold mb-1">⚠️ Top margin disabled</div>
                  <div className="text-slate-300 mb-2">{reason.reason}</div>
                  <div className="text-blue-400 text-[10px]">💡 {reason.action}</div>
                  {/* Tooltip arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderBottom: '4px solid rgb(15, 23, 42)',
                    }}
                  />
                </div>
              </div>
            ) : null;
          })()}

          {/* Right Ghost Indicator */}
          {!applicableSides.right && (() => {
            const reason = getDisabledReason('right');
            return reason ? (
              <div
                data-ghost-indicator="right"
                className="absolute group"
                style={{
                  top: '50%',
                  right: '0px',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  pointerEvents: 'auto',
                  cursor: 'not-allowed',
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '24px',
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    border: '1px dashed rgba(239, 68, 68, 0.5)',
                    borderRadius: '2px',
                  }}
                />

                <div
                  className="invisible group-hover:visible absolute bg-slate-900 text-white text-xs rounded-lg shadow-xl px-3 py-2 whitespace-nowrap"
                  style={{
                    top: '50%',
                    right: '100%',
                    transform: 'translateY(-50%)',
                    marginRight: '8px',
                    maxWidth: '280px',
                    whiteSpace: 'normal',
                    zIndex: 100,
                  }}
                >
                  <div className="font-semibold mb-1">⚠️ Right margin disabled</div>
                  <div className="text-slate-300 mb-2">{reason.reason}</div>
                  <div className="text-blue-400 text-[10px]">💡 {reason.action}</div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '-4px',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderLeft: '4px solid rgb(15, 23, 42)',
                    }}
                  />
                </div>
              </div>
            ) : null;
          })()}

          {/* Bottom Ghost Indicator */}
          {!applicableSides.bottom && (() => {
            const reason = getDisabledReason('bottom');
            return reason ? (
              <div
                data-ghost-indicator="bottom"
                className="absolute group"
                style={{
                  bottom: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  pointerEvents: 'auto',
                  cursor: 'not-allowed',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '4px',
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    border: '1px dashed rgba(239, 68, 68, 0.5)',
                    borderRadius: '2px',
                  }}
                />

                <div
                  className="invisible group-hover:visible absolute bg-slate-900 text-white text-xs rounded-lg shadow-xl px-3 py-2 whitespace-nowrap"
                  style={{
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    maxWidth: '280px',
                    whiteSpace: 'normal',
                    zIndex: 100,
                  }}
                >
                  <div className="font-semibold mb-1">⚠️ Bottom margin disabled</div>
                  <div className="text-slate-300 mb-2">{reason.reason}</div>
                  <div className="text-blue-400 text-[10px]">💡 {reason.action}</div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid rgb(15, 23, 42)',
                    }}
                  />
                </div>
              </div>
            ) : null;
          })()}

          {/* Left Ghost Indicator */}
          {!applicableSides.left && (() => {
            const reason = getDisabledReason('left');
            return reason ? (
              <div
                data-ghost-indicator="left"
                className="absolute group"
                style={{
                  top: '50%',
                  left: '0px',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  pointerEvents: 'auto',
                  cursor: 'not-allowed',
                }}
              >
                <div
                  style={{
                    width: '4px',
                    height: '24px',
                    backgroundColor: 'rgba(239, 68, 68, 0.3)',
                    border: '1px dashed rgba(239, 68, 68, 0.5)',
                    borderRadius: '2px',
                  }}
                />

                <div
                  className="invisible group-hover:visible absolute bg-slate-900 text-white text-xs rounded-lg shadow-xl px-3 py-2 whitespace-nowrap"
                  style={{
                    top: '50%',
                    left: '100%',
                    transform: 'translateY(-50%)',
                    marginLeft: '8px',
                    maxWidth: '280px',
                    whiteSpace: 'normal',
                    zIndex: 100,
                  }}
                >
                  <div className="font-semibold mb-1">⚠️ Left margin disabled</div>
                  <div className="text-slate-300 mb-2">{reason.reason}</div>
                  <div className="text-blue-400 text-[10px]">💡 {reason.action}</div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '-4px',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderRight: '4px solid rgb(15, 23, 42)',
                    }}
                  />
                </div>
              </div>
            ) : null;
          })()}
        </>
      )}

      {/* Center Uniform Handle - for all sides at once (like border-radius) */}
      <UniformSpacingHandle
        value={getAverageSpacing()}
        color={color}
        onDrag={handleCornerDrag}
        badgeRect={badgeRect}
        mode={spacingMode}
        topMargin={topValue}
        rightMargin={rightValue}
        bottomMargin={bottomValue}
        leftMargin={leftValue}
      />

      {/* Interactive Handles - with dynamic visual indicators */}
      {/* Only show handles for applicable sides based on display mode */}
      {applicableSides.top && (
        <SpacingBarHandle
          side="top"
          value={topValue}
          color={color}
          isHovered={hoveredSide === 'top'}
          onHover={() => setHoveredSide('top')}
          onLeave={() => setHoveredSide(null)}
          onDrag={(newValue) => handleDrag('top', newValue)}
          onDragStart={() => setDraggingSide('top')}
          onDragEnd={() => setDraggingSide(null)}
          badgeRect={badgeRect}
          mode={spacingMode}
          topMargin={topValue}
          rightMargin={rightValue}
          bottomMargin={bottomValue}
          leftMargin={leftValue}
        />
      )}

      {applicableSides.right && (
        <SpacingBarHandle
          side="right"
          value={rightValue}
          color={color}
          isHovered={hoveredSide === 'right'}
          onHover={() => setHoveredSide('right')}
          onLeave={() => setHoveredSide(null)}
          onDrag={(newValue) => handleDrag('right', newValue)}
          onDragStart={() => setDraggingSide('right')}
          onDragEnd={() => setDraggingSide(null)}
          badgeRect={badgeRect}
          mode={spacingMode}
          topMargin={topValue}
          rightMargin={rightValue}
          bottomMargin={bottomValue}
          leftMargin={leftValue}
        />
      )}

      {applicableSides.bottom && (
        <SpacingBarHandle
          side="bottom"
          value={bottomValue}
          color={color}
          isHovered={hoveredSide === 'bottom'}
          onHover={() => setHoveredSide('bottom')}
          onLeave={() => setHoveredSide(null)}
          onDrag={(newValue) => handleDrag('bottom', newValue)}
          onDragStart={() => setDraggingSide('bottom')}
          onDragEnd={() => setDraggingSide(null)}
          badgeRect={badgeRect}
          mode={spacingMode}
          topMargin={topValue}
          rightMargin={rightValue}
          bottomMargin={bottomValue}
          leftMargin={leftValue}
        />
      )}

      {applicableSides.left && (
        <SpacingBarHandle
          side="left"
          value={leftValue}
          color={color}
          isHovered={hoveredSide === 'left'}
          onHover={() => setHoveredSide('left')}
          onLeave={() => setHoveredSide(null)}
          onDrag={(newValue) => handleDrag('left', newValue)}
          onDragStart={() => setDraggingSide('left')}
          onDragEnd={() => setDraggingSide(null)}
          badgeRect={badgeRect}
          mode={spacingMode}
          topMargin={topValue}
          rightMargin={rightValue}
          bottomMargin={bottomValue}
          leftMargin={leftValue}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIFORM SPACING HANDLE (Center handle for all sides at once)
// ═══════════════════════════════════════════════════════════════
interface UniformSpacingHandleProps {
  value: number;
  color: string;
  onDrag: (newValue: number) => void;
  badgeRect: DOMRect;
  mode: SpacingMode;
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
}

function UniformSpacingHandle({
  value,
  color,
  onDrag,
  badgeRect,
  mode,
  topMargin,
  rightMargin,
  bottomMargin,
  leftMargin,
}: UniformSpacingHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Throttle updates using requestAnimationFrame for smooth 60fps
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;

        // Calculate total delta from start position (use both X and Y for diagonal movement)
        const totalDeltaX = e.clientX - dragStartRef.current.x;
        const totalDeltaY = e.clientY - dragStartRef.current.y;

        // Average of X and Y deltas for omnidirectional control
        const delta = (totalDeltaX - totalDeltaY) / 2;

        const newValue = dragStartRef.current.initialValue + delta;
        onDrag(newValue);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // V6.0: Position at center of Badge (badgeRect is in parent-relative coordinates)
  const centerX = badgeRect.left + badgeRect.width / 2;
  const centerY = badgeRect.top + badgeRect.height / 2;

  console.log('🎯 V6.0 CENTER HANDLE DEBUG:', {
    mode,
    badgeRect: { left: badgeRect.left, top: badgeRect.top, width: badgeRect.width, height: badgeRect.height },
    margins: { top: topMargin, right: rightMargin, bottom: bottomMargin, left: leftMargin },
    calculatedCenter: { x: centerX, y: centerY },
  });

  return (
    <>
      {/* Center Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          top: `${centerY - 11}px`, // 22px height / 2
          left: `${centerX - 11}px`, // 22px width / 2
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: isDragging ? '#4338ca' : isHovered ? '#4f46e5' : '#6366f1', // Indigo
          border: '2px solid white',
          boxShadow: isDragging
            ? '0 0 20px rgba(99, 102, 241, 0.6)'
            : '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'move',
          zIndex: 49,
          transition: isDragging ? 'none' : 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isHovered ? 'none' : 'pulse-subtle 2s ease-in-out infinite',
        }}
      >
        {/* 4-arrows icon (all directions) */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Vertical line */}
          <line x1="8" y1="2" x2="8" y2="14" />
          {/* Horizontal line */}
          <line x1="2" y1="8" x2="14" y2="8" />
          {/* Top arrow */}
          <polyline points="5,5 8,2 11,5" />
          {/* Bottom arrow */}
          <polyline points="5,11 8,14 11,11" />
          {/* Left arrow */}
          <polyline points="5,5 2,8 5,11" />
          {/* Right arrow */}
          <polyline points="11,5 14,8 11,11" />
        </svg>
      </div>

      {/* Tooltip */}
      {(isHovered || isDragging) && (
        <div
          style={{
            position: 'absolute',
            top: `${centerY - 40}px`,
            left: `${centerX}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 51,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          ↔↕ {mode} all: {value}px
          {isDragging && <span style={{ marginLeft: '4px', color: '#d1d5db' }}>(all sides)</span>}
        </div>
      )}
    </>
  );
}

// Bar Handle Component (absolute positioned on Badge edges)
interface SpacingBarHandleProps {
  side: Side;
  value: number;
  color: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onDrag: (newValue: number) => void;
  onDragStart: () => void; // NEW: trigger dragging state
  onDragEnd: () => void; // NEW: clear dragging state
  badgeRect: DOMRect;
  mode: SpacingMode;
  // Margin values for correct positioning in margin mode
  topMargin: number;
  rightMargin: number;
  bottomMargin: number;
  leftMargin: number;
}

function SpacingBarHandle({
  side,
  value,
  color,
  isHovered,
  onHover,
  onLeave,
  onDrag,
  onDragStart,
  onDragEnd,
  badgeRect,
  mode,
  topMargin,
  rightMargin,
  bottomMargin,
  leftMargin,
}: SpacingBarHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    onDragStart(); // Trigger dragging state in parent
    // Store initial mouse position AND initial spacing value
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Throttle updates using requestAnimationFrame for smooth 60fps
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;

        // Calculate total delta from start position
        const totalDeltaX = e.clientX - dragStartRef.current.x;
        const totalDeltaY = e.clientY - dragStartRef.current.y;

        // Calculate new value based on initial value + delta
        // V7.7: TRUE Figma-like drag direction (different for margin vs padding!)
        const isVertical = side === 'top' || side === 'bottom';
        let delta = 0;

        if (mode === 'margin') {
          // MARGIN: Handle is BETWEEN wrapper edge and Badge edge
          // Dragging TOWARDS wrapper edge = increase margin (push element away)
          if (side === 'top') delta = -totalDeltaY; // Drag UP (towards wrapper top) = increase
          else if (side === 'bottom') delta = totalDeltaY; // Drag DOWN (towards wrapper bottom) = increase
          else if (side === 'left') delta = -totalDeltaX; // Drag LEFT (towards wrapper left) = increase
          else if (side === 'right') delta = totalDeltaX; // Drag RIGHT (towards wrapper right) = increase
        } else {
          // PADDING: Handle is INSIDE element on inner edge
          // Dragging INWARD (into element) = increase padding
          if (side === 'top') delta = totalDeltaY; // Drag DOWN (into element) = increase
          else if (side === 'bottom') delta = -totalDeltaY; // Drag UP (into element) = increase
          else if (side === 'left') delta = totalDeltaX; // Drag RIGHT (into element) = increase
          else if (side === 'right') delta = -totalDeltaX; // Drag LEFT (into element) = increase
        }

        const newValue = dragStartRef.current.initialValue + delta;
        onDrag(newValue);
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(); // Clear dragging state in parent
      dragStartRef.current = null;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const isVertical = side === 'top' || side === 'bottom';

  // Cursor style: margin mode uses directional arrows (push away from wrapper edge)
  const cursor = mode === 'margin'
    ? side === 'top' ? 's-resize'     // ↓ Push badge DOWN from top edge
      : side === 'bottom' ? 'n-resize' // ↑ Push badge UP from bottom edge
      : side === 'left' ? 'e-resize'   // → Push badge RIGHT from left edge
      : 'w-resize'                      // ← Push badge LEFT from right edge
    : isVertical ? 'ns-resize' : 'ew-resize';

  // Position styles based on side - HANDLE STRETCHES TO FILL SPACING AREA
  const getPositionStyles = () => {
    // Bar handles: only visible on hover/drag (green), invisible otherwise
    const bgColor = isDragging
      ? 'rgba(16, 185, 129, 0.3)' // Dragging: semi-transparent green
      : isHovered
      ? 'rgba(52, 211, 153, 0.2)' // Hover: light green
      : 'transparent'; // Idle: invisible

    const borderColor = isDragging
      ? '#10b981'
      : isHovered
      ? '#34d399'
      : 'transparent';

    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 46, // Above overlays (z-index: 43)
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: bgColor,
      border: isDragging || isHovered ? `2px solid ${borderColor}` : 'none',
      cursor,
      boxShadow: isDragging ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
      pointerEvents: 'auto' as const,
    };

    // Minimum handle size to remain clickable even with small values
    const minHandleSize = 10;

    // For padding: handles are INSIDE Badge (on inner edge after padding)
    // For margin: handles are FROM wrapper edge (using margin values directly)
    const inset = mode === 'padding';

    // Use margin values from props (already passed from parent)

    switch (side) {
      case 'top': {
        // Handle height = spacing value (minimum 10px for visibility)
        const handleHeight = Math.max(value, minHandleSize);

        if (inset) {
          // Padding mode: inside badge at top edge
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`,
            left: `${badgeRect.left}px`,
            width: `${badgeRect.width}px`,
            height: `${handleHeight}px`,
          };
        } else {
          // ✅ V6.0: Margin mode - MEASURED position with 4px gap from Badge
          const marginSpace = badgeRect.top;
          const handleHeightWithGap = Math.max(marginSpace - 4, minHandleSize); // 4px gap from Badge edge
          return {
            ...baseStyles,
            top: '0px', // Start from parent canvas top
            left: `${badgeRect.left}px`, // Align with Badge left
            width: `${badgeRect.width}px`, // Match Badge width
            height: `${handleHeightWithGap}px`, // ✅ Stops 4px before Badge!
          };
        }
      }
      case 'right': {
        // Handle width = spacing value (minimum 10px for visibility)
        const handleWidth = Math.max(value, minHandleSize);

        if (inset) {
          // Padding mode: inside badge at right edge
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`,
            left: `${badgeRect.right - handleWidth}px`,
            width: `${handleWidth}px`,
            height: `${badgeRect.height}px`,
          };
        } else {
          // ✅ V7.1: Margin mode - MEASURED position with 4px gap from Badge
          const marginSpace = (badgeRect as any).wrapperWidth - badgeRect.right; // ✅ MEASURED distance!
          const handleWidthWithGap = Math.max(marginSpace - 4, minHandleSize); // 4px gap from Badge edge
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`, // Align with Badge top
            left: `${badgeRect.right + 4}px`, // 4px gap from Badge right edge
            width: `${handleWidthWithGap}px`, // ✅ Stops 4px before wrapper edge!
            height: `${badgeRect.height}px`, // Match Badge height
          };
        }
      }
      case 'bottom': {
        // Handle height = spacing value (minimum 10px for visibility)
        const handleHeight = Math.max(value, minHandleSize);

        if (inset) {
          // Padding mode: inside badge at bottom edge
          return {
            ...baseStyles,
            top: `${badgeRect.bottom - handleHeight}px`,
            left: `${badgeRect.left}px`,
            width: `${badgeRect.width}px`,
            height: `${handleHeight}px`,
          };
        } else {
          // ✅ V7.1: Margin mode - MEASURED position with 4px gap from Badge
          const marginSpace = (badgeRect as any).wrapperHeight - badgeRect.bottom; // ✅ MEASURED distance!
          const handleHeightWithGap = Math.max(marginSpace - 4, minHandleSize); // 4px gap from Badge edge
          return {
            ...baseStyles,
            top: `${badgeRect.bottom + 4}px`, // 4px gap from Badge bottom edge
            left: `${badgeRect.left}px`, // Align with Badge left
            width: `${badgeRect.width}px`, // Match Badge width
            height: `${handleHeightWithGap}px`, // ✅ Stops 4px before wrapper edge!
          };
        }
      }
      case 'left': {
        // Handle width = spacing value (minimum 10px for visibility)
        const handleWidth = Math.max(value, minHandleSize);

        if (inset) {
          // Padding mode: inside badge at left edge
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`,
            left: `${badgeRect.left}px`,
            width: `${handleWidth}px`,
            height: `${badgeRect.height}px`,
          };
        } else {
          // ✅ V6.0: Margin mode - position LEFT of Badge (margin space)
          const marginSpace = badgeRect.left;
          const handleWidthWithGap = Math.max(marginSpace - 4, minHandleSize); // 4px gap from Badge edge
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`, // Align with Badge top
            left: '0px', // Start from parent canvas left
            width: `${handleWidthWithGap}px`, // ✅ Stops 4px before Badge!
            height: `${badgeRect.height}px`, // Match Badge height
          };
        }
      }
    }
  };

  // Tooltip position styles - Follow cursor with smart positioning
  const getTooltipStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: 'rgb(31, 41, 55)', // Fully opaque gray-800
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 51,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)',
    };

    // If we have mouse position, show near cursor with smart positioning
    if (mousePos) {
      // Tooltip dimensions (approximate)
      const tooltipWidth = 120; // Approximate width for "Drag to adjust [direction]"
      const tooltipHeight = 30; // Approximate height
      const offset = 10; // Gap between cursor and tooltip

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Cursor position (absolute viewport coordinates)
      const cursorX = mousePos.x;
      const cursorY = mousePos.y;

      // Default: center horizontally, 10px below cursor
      let left = cursorX;
      let top = cursorY + offset;
      let transform = 'translateX(-50%)'; // Center horizontally

      // Check if tooltip fits below cursor
      if (top + tooltipHeight > viewportHeight) {
        // Not enough space below, show above cursor
        top = cursorY - tooltipHeight - offset;
      }

      // Check horizontal boundaries
      const leftEdge = cursorX - tooltipWidth / 2;
      const rightEdge = cursorX + tooltipWidth / 2;

      if (leftEdge < 0) {
        // Too close to left edge, align to left
        left = offset;
        transform = 'translateX(0)';
      } else if (rightEdge > viewportWidth) {
        // Too close to right edge, align to right
        left = viewportWidth - tooltipWidth - offset;
        transform = 'translateX(0)';
      }

      console.log('📍 Tooltip position:', { cursorX, cursorY, left, top, transform });

      return {
        ...baseStyles,
        position: 'fixed', // Use fixed to position relative to viewport
        left: `${left}px`,
        top: `${top}px`,
        transform,
      };
    }

    // Fallback to centered position
    switch (side) {
      case 'top':
        return { ...baseStyles, top: '-40px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { ...baseStyles, right: '-68px', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { ...baseStyles, bottom: '-40px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...baseStyles, left: '-68px', top: '50%', transform: 'translateY(-50%)' };
      default:
        return baseStyles;
    }
  };

  // Get direction name for tooltip
  const getDirectionName = () => {
    const directions: Record<Side, string> = {
      top: 'top',
      right: 'right',
      bottom: 'bottom',
      left: 'left',
    };
    return directions[side];
  };

  // Get dashed line from text edge to Badge edge with arrows (ALWAYS VISIBLE)
  const getDashedLineStyles = (): React.CSSProperties | null => {
    if (value === 0) return null;

    const inset = mode === 'padding';
    const lineColor = '#1f2937';
    // Dynamic opacity based on state - higher for crisp visibility
    const opacity = isDragging ? 1 : isHovered ? 0.95 : 0.8; // Always visible, crisp

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 44,
      // For padding: single white outline in 4 directions
      filter: inset
        ? `
          drop-shadow(1px 0 0 rgba(255,255,255,0.6))
          drop-shadow(-1px 0 0 rgba(255,255,255,0.6))
          drop-shadow(0 1px 0 rgba(255,255,255,0.6))
          drop-shadow(0 -1px 0 rgba(255,255,255,0.6))
        `.trim()
        : undefined,
      opacity,
      transition: 'opacity 0.15s ease',
    };

    // For left/right: HORIZONTAL lines (←→ show horizontal distance)
    // For top/bottom: VERTICAL lines (↑↓ show vertical distance)
    if (inset) {
      // Padding mode: line from text edge to Badge edge
      switch (side) {
        case 'top':
          // Vertical line at center
          return {
            ...baseStyles,
            top: `${badgeRect.top}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'right':
          // Horizontal line at center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right - value}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `2px dashed ${lineColor}`,
          };
        case 'bottom':
          // Vertical line at center
          return {
            ...baseStyles,
            top: `${badgeRect.bottom - value}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'left':
          // Horizontal line at center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `2px dashed ${lineColor}`,
          };
      }
    } else {
      // ✅ V3.6 (GOD-TIER): Margin mode - use MEASURED badgeRect positions, not calculated!
      // Margin = space between wrapper edge and Badge edge
      // Use actual measured Badge position (just like overlays do!)

      switch (side) {
        case 'top':
          // Vertical line from wrapper top (0) to Badge top (badgeRect.top)
          // ✅ Margin space spans full wrapper width → line at wrapper center
          return {
            ...baseStyles,
            top: '0px', // Start from wrapper top edge
            left: `${badgeRect.left + badgeRect.width / 2}px`, // Badge center horizontally
            height: `${badgeRect.top}px`, // ✅ MEASURED distance to Badge
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'right':
          // Horizontal line from Badge right edge to wrapper right edge
          // ✅ Margin space spans full wrapper height → line at wrapper center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`, // Badge center vertically
            right: '0px', // Start from wrapper right edge
            width: `${(badgeRect as any).wrapperWidth - badgeRect.right}px`, // ✅ MEASURED distance from Badge right to wrapper right
            height: '0',
            borderTop: `2px dashed ${lineColor}`,
          };
        case 'bottom':
          // Vertical line from Badge bottom edge to wrapper bottom edge
          // ✅ Margin space spans full wrapper width → line at wrapper center
          return {
            ...baseStyles,
            bottom: '0px', // Start from wrapper bottom edge
            left: `${badgeRect.left + badgeRect.width / 2}px`, // Badge center horizontally
            height: `${(badgeRect as any).wrapperHeight - badgeRect.bottom}px`, // ✅ MEASURED distance from Badge bottom to wrapper bottom
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'left':
          // Horizontal line from wrapper left edge to Badge left edge
          // ✅ Margin space spans full wrapper height → line at wrapper center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`, // Badge center vertically
            left: '0px', // Start from wrapper left edge
            width: `${badgeRect.left}px`, // ✅ MEASURED distance to Badge
            height: '0',
            borderTop: `2px dashed ${lineColor}`,
          };
      }
    }
  };

  // Get arrow indicators at line ends (ALWAYS VISIBLE)
  const getArrowStyles = (): React.CSSProperties[] => {
    if (value === 0) return [];

    const inset = mode === 'padding';
    const arrowColor = '#1f2937';
    const arrowSize = 7; // Slightly larger for better visibility

    // Dynamic opacity based on state - higher for crisp visibility
    const opacity = isDragging ? 1 : isHovered ? 0.95 : 0.8; // Always visible, crisp

    const baseArrowStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${arrowSize}px solid transparent`,
      pointerEvents: 'none',
      zIndex: 45,
      // For padding: single white outline in 4 directions
      filter: inset
        ? `
          drop-shadow(1px 0 0 rgba(255,255,255,0.6))
          drop-shadow(-1px 0 0 rgba(255,255,255,0.6))
          drop-shadow(0 1px 0 rgba(255,255,255,0.6))
          drop-shadow(0 -1px 0 rgba(255,255,255,0.6))
        `.trim()
        : undefined,
      opacity,
      transition: 'opacity 0.15s ease',
    };

    if (inset) {
      switch (side) {
        case 'top':
          // Up and down arrows (vertical line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.top}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderBottomColor: arrowColor,
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + value - arrowSize}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderTopColor: arrowColor,
              borderBottomWidth: 0,
            },
          ];
        case 'right':
          // Left and right arrows (horizontal line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.right - value}px`,
              borderRightColor: arrowColor,
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.right - arrowSize}px`,
              borderLeftColor: arrowColor,
              borderRightWidth: 0,
            },
          ];
        case 'bottom':
          // Up and down arrows (vertical line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.bottom - value}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderBottomColor: arrowColor,
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.bottom - arrowSize}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderTopColor: arrowColor,
              borderBottomWidth: 0,
            },
          ];
        case 'left':
          // Left and right arrows (horizontal line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.left}px`,
              borderRightColor: arrowColor,
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.left + value - arrowSize}px`,
              borderLeftColor: arrowColor,
              borderRightWidth: 0,
            },
          ];
      }
    } else {
      // ✅ V3.6 (GOD-TIER): Margin mode - use MEASURED badgeRect positions, not calculated!
      // Arrows at wrapper edge and Badge edge - Badge edge is MEASURED!

      switch (side) {
        case 'top':
          // Arrows pointing toward each other (↓ at wrapper top, ↑ at Badge top)
          // ✅ Margin space spans full wrapper width → arrows at wrapper center
          const topArrowLeft = badgeRect.left + badgeRect.width / 2 - arrowSize; // Badge center
          return [
            {
              ...baseArrowStyle,
              top: '0px', // Static at wrapper top edge
              left: `${topArrowLeft}px`,
              borderBottomColor: arrowColor, // ↓ pointing down
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top - arrowSize}px`, // ✅ MEASURED Badge top edge
              left: `${topArrowLeft}px`,
              borderTopColor: arrowColor, // ↑ pointing up
              borderBottomWidth: 0,
            },
          ];
        case 'right':
          // Arrows pointing toward each other (→ at Badge right, ← at wrapper right)
          // ✅ Margin space spans full wrapper height → arrows at wrapper center
          const rightArrowTop = badgeRect.top + badgeRect.height / 2 - arrowSize; // Badge center
          return [
            {
              ...baseArrowStyle,
              top: `${rightArrowTop}px`,
              left: `${badgeRect.right}px`, // ✅ MEASURED Badge right edge
              borderRightColor: arrowColor, // → pointing right
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${rightArrowTop}px`,
              right: '0px', // Static at wrapper right edge
              borderLeftColor: arrowColor, // ← pointing left
              borderRightWidth: 0,
            },
          ];
        case 'bottom':
          // Arrows pointing toward each other (↑ at Badge bottom, ↓ at wrapper bottom)
          // ✅ Margin space spans full wrapper width → arrows at wrapper center
          const bottomArrowLeft = badgeRect.left + badgeRect.width / 2 - arrowSize; // Badge center
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.bottom}px`, // ✅ MEASURED Badge bottom edge
              left: `${bottomArrowLeft}px`,
              borderBottomColor: arrowColor, // ↓ pointing down
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              bottom: '0px', // Static at wrapper bottom edge
              left: `${bottomArrowLeft}px`,
              borderTopColor: arrowColor, // ↑ pointing up
              borderBottomWidth: 0,
            },
          ];
        case 'left':
          // Arrows pointing toward each other (← at wrapper left, → at Badge left)
          // ✅ Margin space spans full wrapper height → arrows at wrapper center
          const leftArrowTop = badgeRect.top + badgeRect.height / 2 - arrowSize; // Badge center
          return [
            {
              ...baseArrowStyle,
              top: `${leftArrowTop}px`,
              left: '0px', // Static at wrapper left edge
              borderRightColor: arrowColor, // → pointing right
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${leftArrowTop}px`,
              left: `${badgeRect.left - arrowSize}px`, // ✅ MEASURED Badge left edge
              borderLeftColor: arrowColor, // ← pointing left
              borderRightWidth: 0,
            },
          ];
      }
    }
    return [];
  };

  // Get value label positioned between arrows (ALWAYS VISIBLE)
  const getValueLabelStyles = (): React.CSSProperties | null => {
    if (value === 0) return null;

    const inset = mode === 'padding';
    const opacity = isDragging ? 1 : isHovered ? 0.9 : 0.6; // Always visible

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 46,
      backgroundColor: 'rgb(31, 41, 55)', // Solid gray-800 color (no transparency)
      color: 'white',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      opacity,
      transition: 'opacity 0.15s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    };

    // Position label in the middle of the spacing area
    if (inset) {
      switch (side) {
        case 'top':
          return {
            ...baseStyles,
            top: `${badgeRect.top + value / 2}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'right':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right - value / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'bottom':
          return {
            ...baseStyles,
            top: `${badgeRect.bottom - value / 2}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'left':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left + value / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
      }
    } else {
      // ✅ V3.6 (GOD-TIER): Margin mode - use MEASURED badgeRect positions, not calculated!
      // Label positioned in MIDDLE of margin space (between wrapper edge and Badge edge)
      // Use actual measured Badge position (just like overlays and dashed lines!)

      switch (side) {
        case 'top':
          return {
            ...baseStyles,
            top: `${badgeRect.top / 2}px`, // ✅ MEASURED: Middle of TOP margin space (0 to badgeRect.top)
            left: `${badgeRect.left + badgeRect.width / 2}px`, // Badge center horizontally
            transform: 'translate(-50%, -50%)',
          };
        case 'right':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`, // Badge center vertically
            left: `${badgeRect.right + value / 2}px`, // Middle of RIGHT margin space
            transform: 'translate(-50%, -50%)',
          };
        case 'bottom':
          return {
            ...baseStyles,
            top: `${badgeRect.bottom + value / 2}px`, // Middle of BOTTOM margin space
            left: `${badgeRect.left + badgeRect.width / 2}px`, // Badge center horizontally
            transform: 'translate(-50%, -50%)',
          };
        case 'left':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`, // Badge center vertically
            left: `${badgeRect.left / 2}px`, // ✅ MEASURED: Middle of LEFT margin space (0 to badgeRect.left)
            transform: 'translate(-50%, -50%)',
          };
      }
    }
    return null;
  };

  const dashedLineStyles = getDashedLineStyles();
  const arrowStyles = getArrowStyles();
  const valueLabelStyles = getValueLabelStyles();

  return (
    <>
      {/* Dashed Line - always visible */}
      {dashedLineStyles && <div style={dashedLineStyles} />}

      {/* Arrows at both ends - always visible */}
      {arrowStyles.map((arrowStyle, idx) => (
        <div key={idx} style={arrowStyle} />
      ))}

      {/* Value Label between arrows - always visible */}
      {valueLabelStyles && (
        <div style={valueLabelStyles}>
          {value}px
        </div>
      )}

      {/* Bar Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={onHover}
        onMouseLeave={() => {
          onLeave();
          setMousePos(null);
        }}
        onMouseMove={(e) => {
          // Track absolute mouse position for tooltip (relative to viewport)
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          console.log('🖱️ Mouse position:', { mouseX, mouseY, side });

          setMousePos({
            x: mouseX,
            y: mouseY,
          });
        }}
        style={getPositionStyles()}
      >
        {/* Directional Arrow Icon - shows which direction to drag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}>
          <svg
            width={isVertical ? "10" : "14"}
            height={isVertical ? "14" : "10"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              opacity: isDragging ? 1 : isHovered ? 0.9 : 0.7,
              transition: 'opacity 0.15s ease',
            }}
          >
            {/* Arrow pointing in drag direction */}
            {side === 'top' && <path d="M12 5v14m-7-7l7-7l7 7" />}
            {side === 'right' && <path d="M5 12h14m-7-7l7 7l-7 7" />}
            {side === 'bottom' && <path d="M12 19V5m-7 7l7 7l7-7" />}
            {side === 'left' && <path d="M19 12H5m7-7l-7 7l7 7" />}
          </svg>
        </div>
      </div>

      {/* Value Tooltip - "Drag to adjust [direction]" - Rendered via Portal */}
      {(isHovered || isDragging) && typeof document !== 'undefined' && createPortal(
        <div style={getTooltipStyles()}>
          Drag to adjust {getDirectionName()}
        </div>,
        document.body
      )}
    </>
  );
}
