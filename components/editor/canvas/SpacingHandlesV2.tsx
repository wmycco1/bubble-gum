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
  const [badgeRect, setBadgeRect] = useState<DOMRect | null>(null);
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
        const wrapperRect = wrapper.getBoundingClientRect();

        // Calculate relative position to wrapper
        const relativeRect = {
          top: rect.top - wrapperRect.top,
          left: rect.left - wrapperRect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right - wrapperRect.left,
          bottom: rect.bottom - wrapperRect.top,
        } as DOMRect;

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

  // Separate effect to update badge rect when spacing values change (debounced)
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const wrapper = document.querySelector(`[data-component-id="${componentId}"]`);
      if (!wrapper) return;

      const badgeElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
      if (badgeElement) {
        const rect = badgeElement.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const relativeRect = {
          top: rect.top - wrapperRect.top,
          left: rect.left - wrapperRect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right - wrapperRect.left,
          bottom: rect.bottom - wrapperRect.top,
        } as DOMRect;

        setBadgeRect(relativeRect);
      }
    }, 50); // Debounce 50ms

    return () => clearTimeout(timeoutId);
  }, [componentId, component?.props]); // Update when props change, but debounced

  if (!component || !badgeRect) return null;

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
      {/* Visual Overlays - Show spacing areas (like properties panel) */}
      {spacingMode === 'margin' && (
        <>
          {/* Top Margin Overlay */}
          {topValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top - topValue}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${topValue}px`,
                backgroundColor: overlayColor,
                borderTop: `2px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Right Margin Overlay */}
          {rightValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.right}px`,
                width: `${rightValue}px`,
                height: `${badgeRect.height}px`,
                backgroundColor: overlayColor,
                borderRight: `2px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Bottom Margin Overlay */}
          {bottomValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.bottom}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${bottomValue}px`,
                backgroundColor: overlayColor,
                borderBottom: `2px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Left Margin Overlay */}
          {leftValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left - leftValue}px`,
                width: `${leftValue}px`,
                height: `${badgeRect.height}px`,
                backgroundColor: overlayColor,
                borderLeft: `2px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}
        </>
      )}

      {spacingMode === 'padding' && (
        <>
          {/* Top Padding Overlay */}
          {topValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${Math.min(topValue, badgeRect.height / 2)}px`,
                backgroundColor: overlayColor,
                borderBottom: `1px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Right Padding Overlay */}
          {rightValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.right - Math.min(rightValue, badgeRect.width / 2)}px`,
                width: `${Math.min(rightValue, badgeRect.width / 2)}px`,
                height: `${badgeRect.height}px`,
                backgroundColor: overlayColor,
                borderLeft: `1px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Bottom Padding Overlay */}
          {bottomValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.bottom - Math.min(bottomValue, badgeRect.height / 2)}px`,
                left: `${badgeRect.left}px`,
                width: `${badgeRect.width}px`,
                height: `${Math.min(bottomValue, badgeRect.height / 2)}px`,
                backgroundColor: overlayColor,
                borderTop: `1px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
              }}
            />
          )}

          {/* Left Padding Overlay */}
          {leftValue > 0 && (
            <div
              style={{
                position: 'absolute',
                top: `${badgeRect.top}px`,
                left: `${badgeRect.left}px`,
                width: `${Math.min(leftValue, badgeRect.width / 2)}px`,
                height: `${badgeRect.height}px`,
                backgroundColor: overlayColor,
                borderRight: `1px solid ${borderColor}`,
                pointerEvents: 'none',
                zIndex: 43,
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
        badgeRect={badgeRect}
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
        badgeRect={badgeRect}
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
        badgeRect={badgeRect}
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
        badgeRect={badgeRect}
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

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Calculate total delta from start position (use both X and Y for diagonal movement)
      const totalDeltaX = e.clientX - dragStartRef.current.x;
      const totalDeltaY = e.clientY - dragStartRef.current.y;

      // Average of X and Y deltas for omnidirectional control
      const delta = (totalDeltaX - totalDeltaY) / 2;

      const newValue = dragStartRef.current.initialValue + delta;
      onDrag(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
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
  badgeRect: DOMRect;
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
  badgeRect,
  mode,
}: SpacingBarHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    // Store initial mouse position AND initial spacing value
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const isVertical = side === 'top' || side === 'bottom';
  const cursor = isVertical ? 'ns-resize' : 'ew-resize';

  // Position styles based on side - positioned on Badge boundaries
  const getPositionStyles = () => {
    // Subtle handles - almost invisible unless hover/drag
    const bgColor = isDragging
      ? '#ef4444'
      : isHovered
      ? color
      : `${color}10`; // Very subtle (6% opacity)

    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 45,
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: bgColor,
      border: isDragging
        ? `2px solid ${color}`
        : isHovered
        ? `1px solid ${color}`
        : `1px solid ${color}20`, // Almost invisible
      cursor,
      boxShadow: isDragging ? '0 0 8px rgba(59, 130, 246, 0.4)' : 'none',
      opacity: isDragging ? 1 : isHovered ? 0.9 : 0.3, // More transparency when idle
    };

    const handleWidth = 16;

    // For padding: handles are INSIDE Badge (on inner edge after padding)
    // For margin: handles are OUTSIDE Badge (beyond outer edge)
    const inset = mode === 'padding';

    switch (side) {
      case 'top':
        return {
          ...baseStyles,
          top: inset ? `${badgeRect.top}px` : `${badgeRect.top - handleWidth}px`,
          left: `${badgeRect.left}px`,
          width: `${badgeRect.width}px`,
          height: `${handleWidth}px`,
        };
      case 'right':
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          left: inset ? `${badgeRect.right - handleWidth}px` : `${badgeRect.right}px`,
          width: `${handleWidth}px`,
          height: `${badgeRect.height}px`,
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: inset ? `${badgeRect.bottom - handleWidth}px` : `${badgeRect.bottom}px`,
          left: `${badgeRect.left}px`,
          width: `${badgeRect.width}px`,
          height: `${handleWidth}px`,
        };
      case 'left':
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          left: inset ? `${badgeRect.left}px` : `${badgeRect.left - handleWidth}px`,
          width: `${handleWidth}px`,
          height: `${badgeRect.height}px`,
        };
    }
  };

  // Tooltip position styles
  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap' as const,
      pointerEvents: 'none' as const,
      zIndex: 51,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    };

    switch (side) {
      case 'top':
        return { ...baseStyles, top: '-28px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { ...baseStyles, right: '-48px', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { ...baseStyles, bottom: '-28px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { ...baseStyles, left: '-48px', top: '50%', transform: 'translateY(-50%)' };
    }
  };

  // Get dashed line from text edge to Badge edge with arrows
  const getDashedLineStyles = (): React.CSSProperties | null => {
    if (!isDragging && !isHovered) return null;
    if (value === 0) return null;

    const lineColor = color;
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 44,
    };

    const inset = mode === 'padding';

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
            borderLeft: `1px dashed ${lineColor}`,
          };
        case 'right':
          // Horizontal line at center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right - value}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `1px dashed ${lineColor}`,
          };
        case 'bottom':
          // Vertical line at center
          return {
            ...baseStyles,
            top: `${badgeRect.bottom - value}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `1px dashed ${lineColor}`,
          };
        case 'left':
          // Horizontal line at center
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `1px dashed ${lineColor}`,
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
            borderLeft: `1px dashed ${lineColor}`,
          };
        case 'right':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.right}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `1px dashed ${lineColor}`,
          };
        case 'bottom':
          return {
            ...baseStyles,
            top: `${badgeRect.bottom}px`,
            left: `${badgeRect.left + badgeRect.width / 2}px`,
            height: `${value}px`,
            width: '0',
            borderLeft: `1px dashed ${lineColor}`,
          };
        case 'left':
          return {
            ...baseStyles,
            top: `${badgeRect.top + badgeRect.height / 2}px`,
            left: `${badgeRect.left - value}px`,
            width: `${value}px`,
            height: '0',
            borderTop: `1px dashed ${lineColor}`,
          };
      }
    }
  };

  // Get arrow indicators at line ends
  const getArrowStyles = (): React.CSSProperties[] => {
    if (!isDragging && !isHovered) return [];
    if (value === 0) return [];

    const arrowColor = color;
    const arrowSize = 6;
    const inset = mode === 'padding';

    const baseArrowStyle: React.CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: `${arrowSize}px solid transparent`,
      pointerEvents: 'none',
      zIndex: 45,
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

  const dashedLineStyles = getDashedLineStyles();
  const arrowStyles = getArrowStyles();

  return (
    <>
      {/* Dashed Line - only when hovering or dragging */}
      {dashedLineStyles && <div style={dashedLineStyles} />}

      {/* Arrows at both ends */}
      {arrowStyles.map((arrowStyle, idx) => (
        <div key={idx} style={arrowStyle} />
      ))}

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

      {/* Value Tooltip */}
      {(isHovered || isDragging) && (
        <div style={getTooltipStyles()}>
          📏 {side}: {value}px
        </div>
      )}
    </>
  );
}
