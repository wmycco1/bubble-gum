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
 */

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { useSpacingKeyboard } from './useSpacingKeyboard';

type SpacingMode = 'margin' | 'padding';
type Side = 'top' | 'right' | 'bottom' | 'left';

interface SpacingHandlesV2Props {
  componentId: string;
}

export function SpacingHandlesV2({ componentId }: SpacingHandlesV2Props) {
  const { components, updateComponentProps } = useCanvasStore();
  const [spacingMode, setSpacingMode] = useState<SpacingMode>('margin');
  const [hoveredSide, setHoveredSide] = useState<Side | null>(null);
  const [draggingSide, setDraggingSide] = useState<Side | null>(null);
  const [badgeRect, setBadgeRect] = useState<DOMRect | null>(null);
  const [wrapperRect, setWrapperRect] = useState<DOMRect | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // Enable keyboard shortcuts
  useSpacingKeyboard({ mode: spacingMode, enabled: true });

  // Get component
  const component = components.find(c => c.id === componentId);

  // Find the actual Badge element (not wrapper) and track its position
  React.useEffect(() => {
    if (!componentId) return;

    const updateBadgeRect = () => {
      const wrapper = document.querySelector(`[data-component-id="${componentId}"]`);
      if (!wrapper) return;

      // Find the actual Badge span element (has data-testid="badge")
      const badgeElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
      if (badgeElement) {
        const rect = badgeElement.getBoundingClientRect();
        const wrapperRectRaw = wrapper.getBoundingClientRect();

        // Save wrapper dimensions (relative coordinates starting at 0,0)
        const relativeWrapperRect = {
          top: 0,
          left: 0,
          width: wrapperRectRaw.width,
          height: wrapperRectRaw.height,
          right: wrapperRectRaw.width,
          bottom: wrapperRectRaw.height,
        } as DOMRect;

        // Calculate relative position to wrapper
        const relativeRect = {
          top: rect.top - wrapperRectRaw.top,
          left: rect.left - wrapperRectRaw.left,
          width: rect.width,
          height: rect.height,
          right: rect.right - wrapperRectRaw.left,
          bottom: rect.bottom - wrapperRectRaw.top,
        } as DOMRect;

        setWrapperRect(relativeWrapperRect);
        setBadgeRect(relativeRect);
      }
    };

    updateBadgeRect();

    const handleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateBadgeRect);
    };

    // Only listen to window resize, not every DOM change
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [componentId]); // Only re-run when componentId changes, NOT on every prop change

  // Immediate update when props change (removed debouncing for smooth dragging)
  React.useEffect(() => {
    const wrapper = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!wrapper) return;

    const badgeElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
    if (badgeElement) {
      const rect = badgeElement.getBoundingClientRect();
      const wrapperRectRaw = wrapper.getBoundingClientRect();

      // Save wrapper dimensions (relative coordinates starting at 0,0)
      const relativeWrapperRect = {
        top: 0,
        left: 0,
        width: wrapperRectRaw.width,
        height: wrapperRectRaw.height,
        right: wrapperRectRaw.width,
        bottom: wrapperRectRaw.height,
      } as DOMRect;

      const relativeRect = {
        top: rect.top - wrapperRectRaw.top,
        left: rect.left - wrapperRectRaw.left,
        width: rect.width,
        height: rect.height,
        right: rect.right - wrapperRectRaw.left,
        bottom: rect.bottom - wrapperRectRaw.top,
      } as DOMRect;

      setWrapperRect(relativeWrapperRect);
      setBadgeRect(relativeRect);
    }
  }, [componentId, component?.props]);

  if (!component || !badgeRect || !wrapperRect) return null;

  const props = component.props || {};
  const prefix = spacingMode;

  // Get spacing values
  const getValue = (side: Side): number => {
    const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);
    return props[`${prefix}${capitalizedSide}`] ?? props[prefix] ?? 0;
  };

  const topValue = getValue('top');
  const rightValue = getValue('right');
  const bottomValue = getValue('bottom');
  const leftValue = getValue('left');

  // Handle drag - receives absolute new value, not delta
  const handleDrag = (side: Side, newValue: number) => {
    const capitalizedSide = side.charAt(0).toUpperCase() + side.slice(1);

    updateComponentProps(componentId, {
      [`${prefix}${capitalizedSide}`]: Math.max(0, Math.round(newValue)),
    });
  };

  // Handle corner drag - updates all sides simultaneously (Simple mode)
  const handleCornerDrag = (newValue: number) => {
    const clampedValue = Math.max(0, Math.round(newValue));

    updateComponentProps(componentId, {
      // Set shorthand property and clear individual sides
      [prefix]: clampedValue,
      [`${prefix}Top`]: undefined,
      [`${prefix}Right`]: undefined,
      [`${prefix}Bottom`]: undefined,
      [`${prefix}Left`]: undefined,
    });
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

  return (
    <>
      {/* Visual Overlays - Show spacing areas (like properties panel) - INTERACTIVE */}
      {spacingMode === 'margin' && (
        <>
          {/* Top Margin Overlay - THREE STATES: idle (blue) → hover (green 15%) → dragging (green 25%) */}
          {topValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('top')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top - topValue}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${topValue}px`,
                backgroundColor:
                  draggingSide === 'top'
                    ? 'rgba(52, 211, 153, 0.4)' // Dragging: green 40% (more visible)
                    : hoveredSide === 'top'
                    ? 'rgba(52, 211, 153, 0.25)' // Hover: green 25% (more visible)
                    : 'rgba(96, 165, 250, 0.1)', // Idle: blue 10% (reduced 50%)
                borderTop: `2px solid ${draggingSide === 'top' ? '#10b981' : hoveredSide === 'top' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ns-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Right Margin Overlay */}
          {rightValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('right')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.right}px`,
                width: `${rightValue}px`,
                height: `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'right'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'right'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.1)',
                borderRight: `2px solid ${draggingSide === 'right' ? '#10b981' : hoveredSide === 'right' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ew-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Bottom Margin Overlay */}
          {bottomValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('bottom')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.bottom}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${bottomValue}px`,
                backgroundColor:
                  draggingSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'bottom'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.1)',
                borderBottom: `2px solid ${draggingSide === 'bottom' ? '#10b981' : hoveredSide === 'bottom' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ns-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}

          {/* Left Margin Overlay */}
          {leftValue > 0 && (
            <div
              onMouseEnter={() => setHoveredSide('left')}
              onMouseLeave={() => setHoveredSide(null)}
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left - leftValue}px`,
                width: `${leftValue}px`,
                height: `${badgeRect.height}px`,
                backgroundColor:
                  draggingSide === 'left'
                    ? 'rgba(52, 211, 153, 0.4)'
                    : hoveredSide === 'left'
                    ? 'rgba(52, 211, 153, 0.25)'
                    : 'rgba(96, 165, 250, 0.1)',
                borderLeft: `2px solid ${draggingSide === 'left' ? '#10b981' : hoveredSide === 'left' ? '#10b981' : '#3b82f6'}`,
                pointerEvents: 'auto',
                cursor: 'ew-resize',
                zIndex: 43,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              }}
            />
          )}
        </>
      )}

      {spacingMode === 'padding' && (
        <>
          {/* Top Padding Overlay - THREE STATES: idle (blue) → hover (green 15%) → dragging (green 25%) */}
          {topValue > 0 && (
            <div
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
                    : 'rgba(96, 165, 250, 0.1)', // Idle: blue 10% (reduced 50%)
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
                    : 'rgba(96, 165, 250, 0.1)',
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
                    : 'rgba(96, 165, 250, 0.1)',
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
                    : 'rgba(96, 165, 250, 0.1)',
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

      {/* Mode Toggle - Absolute positioned, inside top-right of Badge */}
      <div
        className="absolute flex gap-0.5 z-50"
        style={{
          pointerEvents: 'auto',
          top: `${badgeRect.top + 4}px`,
          left: `${badgeRect.right - 46}px`, // 2 buttons (20px each) + gap (2px) + padding (4px)
        }}
      >
        <button
          onClick={() => setSpacingMode('margin')}
          title="Margin"
          className="w-5 h-5 rounded text-[9px] font-bold transition-all shadow-sm"
          style={{
            border: '1.5px solid',
            borderColor: spacingMode === 'margin' ? '#3b82f6' : '#d1d5db',
            backgroundColor: spacingMode === 'margin' ? '#3b82f6' : 'rgba(255,255,255,0.95)',
            color: spacingMode === 'margin' ? 'white' : '#9ca3af',
          }}
        >
          M
        </button>
        <button
          onClick={() => setSpacingMode('padding')}
          title="Padding"
          className="w-5 h-5 rounded text-[9px] font-bold transition-all shadow-sm"
          style={{
            border: '1.5px solid',
            borderColor: spacingMode === 'padding' ? '#10b981' : '#d1d5db',
            backgroundColor: spacingMode === 'padding' ? '#10b981' : 'rgba(255,255,255,0.95)',
            color: spacingMode === 'padding' ? 'white' : '#9ca3af',
          }}
        >
          P
        </button>
      </div>

      {/* Center Uniform Handle - for all sides at once (like border-radius) */}
      <UniformSpacingHandle
        value={getAverageSpacing()}
        color={color}
        onDrag={handleCornerDrag}
        badgeRect={badgeRect}
        mode={spacingMode}
      />

      {/* Interactive Handles - with dynamic visual indicators */}
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
        wrapperRect={wrapperRect}
        mode={spacingMode}
      />

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
        wrapperRect={wrapperRect}
        mode={spacingMode}
      />

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
        wrapperRect={wrapperRect}
        mode={spacingMode}
      />

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
        wrapperRect={wrapperRect}
        mode={spacingMode}
      />
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
}

function UniformSpacingHandle({
  value,
  color,
  onDrag,
  badgeRect,
  mode,
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

  // Position at center of Badge
  const centerX = badgeRect.left + badgeRect.width / 2;
  const centerY = badgeRect.top + badgeRect.height / 2;

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
  wrapperRect: DOMRect;
  mode: SpacingMode;
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
  wrapperRect,
  mode,
}: SpacingBarHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
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
        const isVertical = side === 'top' || side === 'bottom';
        let delta = 0;

        if (side === 'top') delta = -totalDeltaY; // Drag up = increase
        else if (side === 'bottom') delta = totalDeltaY; // Drag down = increase
        else if (side === 'left') delta = -totalDeltaX; // Drag left = increase
        else if (side === 'right') delta = totalDeltaX; // Drag right = increase

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

  // Cursor style: margin mode uses directional arrows (push away), padding uses bidirectional
  const cursor = mode === 'margin'
    ? side === 'top' ? 'n-resize'  // ↑ Push badge down from top
      : side === 'bottom' ? 's-resize'  // ↓ Push badge up from bottom
      : side === 'left' ? 'w-resize'  // ← Push badge right from left
      : 'e-resize'  // → Push badge left from right
    : isVertical ? 'ns-resize' : 'ew-resize';

  // Position styles based on side - HANDLE STRETCHES TO FILL SPACING AREA
  const getPositionStyles = () => {
    // Three-state color system: idle (blue) → hover (green) → dragging (green)
    const bgColor = isDragging
      ? 'rgba(16, 185, 129, 0.9)' // Dragging: bright green
      : isHovered
      ? 'rgba(52, 211, 153, 0.7)' // Hover: green
      : 'rgba(96, 165, 250, 0.15)'; // Idle: blue 15% (reduced 50% from 0.3)

    const borderColor = isDragging || isHovered ? '#10b981' : '#60a5fa';

    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 45,
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: bgColor,
      border: isDragging
        ? `2px solid ${borderColor}`
        : isHovered
        ? `2px solid ${borderColor}`
        : `1px solid rgba(96, 165, 250, 0.5)`,
      cursor,
      boxShadow: isDragging ? '0 0 8px rgba(16, 185, 129, 0.5)' : 'none',
      opacity: isDragging ? 1 : isHovered ? 0.9 : 0.3, // More transparency when idle
    };

    // Minimum handle size to remain clickable even with small values
    const minHandleSize = 10;

    // For padding: handles are INSIDE Badge (on inner edge after padding)
    // For margin: handles are INSIDE wrapper (between wrapper edge and badge)
    const inset = mode === 'padding';

    switch (side) {
      case 'top': {
        // Handle height = spacing value (minimum 10px for visibility)
        const handleHeight = Math.max(value, minHandleSize);
        return {
          ...baseStyles,
          // Padding: inside badge at top edge | Margin: from wrapper top to badge top (INSIDE wrapper)
          top: inset ? `${badgeRect.top}px` : '0px',
          left: `${badgeRect.left}px`,
          width: `${badgeRect.width}px`,
          height: inset ? `${handleHeight}px` : `${badgeRect.top}px`,
        };
      }
      case 'right': {
        // Handle width = spacing value (minimum 10px for visibility)
        const handleWidth = Math.max(value, minHandleSize);
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          // Padding: inside badge at right edge | Margin: from badge right to wrapper right (INSIDE wrapper)
          left: inset ? `${badgeRect.right - handleWidth}px` : `${badgeRect.right}px`,
          width: inset ? `${handleWidth}px` : `${wrapperRect.width - badgeRect.right}px`,
          height: `${badgeRect.height}px`,
        };
      }
      case 'bottom': {
        // Handle height = spacing value (minimum 10px for visibility)
        const handleHeight = Math.max(value, minHandleSize);
        return {
          ...baseStyles,
          // Padding: inside badge at bottom edge | Margin: from badge bottom to wrapper bottom (INSIDE wrapper)
          top: inset ? `${badgeRect.bottom - handleHeight}px` : `${badgeRect.bottom}px`,
          left: `${badgeRect.left}px`,
          width: `${badgeRect.width}px`,
          height: inset ? `${handleHeight}px` : `${wrapperRect.height - badgeRect.bottom}px`,
        };
      }
      case 'left': {
        // Handle width = spacing value (minimum 10px for visibility)
        const handleWidth = Math.max(value, minHandleSize);
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          // Padding: inside badge at left edge | Margin: from wrapper left to badge left (INSIDE wrapper)
          left: inset ? `${badgeRect.left}px` : '0px',
          width: inset ? `${handleWidth}px` : `${badgeRect.left}px`,
          height: `${badgeRect.height}px`,
        };
      }
    }
  };

  // Tooltip position styles - Match center handle styling
  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '11px', // Match center handle size
      fontWeight: 600,
      whiteSpace: 'nowrap' as const,
      pointerEvents: 'none' as const,
      zIndex: 51,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)',
    };

    switch (side) {
      case 'top':
        return { ...baseStyles, top: '-40px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { ...baseStyles, right: '-68px', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { ...baseStyles, bottom: '-40px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...baseStyles, left: '-68px', top: '50%', transform: 'translateY(-50%)' };
    }
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
      // Margin mode: line from Badge edge outward
      switch (side) {
        case 'top':
          return {
            ...baseStyles,
            top: `${badgeRect.top - value}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'right':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `2px dashed ${lineColor}`,
          };
        case 'bottom':
          return {
            ...baseStyles,
            top: `${badgeRect.bottom}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `2px dashed ${lineColor}`,
          };
        case 'left':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left - value}px`,
            width: `${value}px`,
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
      // Margin mode arrows
      switch (side) {
        case 'top':
          // Up and down arrows (vertical line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.top - value}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderBottomColor: arrowColor,
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top - arrowSize}px`,
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
              left: `${badgeRect.right}px`,
              borderRightColor: arrowColor,
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.right + value - arrowSize}px`,
              borderLeftColor: arrowColor,
              borderRightWidth: 0,
            },
          ];
        case 'bottom':
          // Up and down arrows (vertical line)
          return [
            {
              ...baseArrowStyle,
              top: `${badgeRect.bottom}px`,
              left: `${badgeRect.left + badgeRect.width / 2 - arrowSize}px`,
              borderBottomColor: arrowColor,
              borderTopWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.bottom + value - arrowSize}px`,
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
              left: `${badgeRect.left - value}px`,
              borderRightColor: arrowColor,
              borderLeftWidth: 0,
            },
            {
              ...baseArrowStyle,
              top: `${badgeRect.top + badgeRect.height / 2 - arrowSize}px`,
              left: `${badgeRect.left - arrowSize}px`,
              borderLeftColor: arrowColor,
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
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
      // Margin mode
      switch (side) {
        case 'top':
          return {
            ...baseStyles,
            top: `${badgeRect.top - value / 2}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'right':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right + value / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'bottom':
          return {
            ...baseStyles,
            top: `${badgeRect.bottom + value / 2}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            transform: 'translate(-50%, -50%)',
          };
        case 'left':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left - value / 2}px`,
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
        onMouseLeave={onLeave}
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

      {/* Value Tooltip - with directional icons */}
      {(isHovered || isDragging) && (
        <div style={getTooltipStyles()}>
          {side === 'top' && '↑'} {side === 'right' && '→'} {side === 'bottom' && '↓'} {side === 'left' && '←'} {mode === 'margin' ? 'Margin' : 'Padding'} {side}: {value}px
          {isDragging && (
            <span style={{
              display: 'block',
              fontSize: '10px',
              marginTop: '2px',
              color: '#d1d5db',
              fontWeight: 500
            }}>
              drag to adjust
            </span>
          )}
        </div>
      )}
    </>
  );
}
