'use client';

/**
 * BorderRadiusHandles - Figma-style border radius controls
 *
 * Features:
 * - 4 corner handles for individual corner radius control
 * - Drag to increase/decrease border radius
 * - Visual feedback with tooltips
 * - Works for all components with border-radius support
 */

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface BorderRadiusHandlesProps {
  componentId: string;
  // ✨ Unit parameters for each corner
  borderRadiusTopLeftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  borderRadiusTopRightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  borderRadiusBottomLeftUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
  borderRadiusBottomRightUnit?: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
}

export function BorderRadiusHandles({
  componentId,
  borderRadiusTopLeftUnit = 'px',
  borderRadiusTopRightUnit = 'px',
  borderRadiusBottomLeftUnit = 'px',
  borderRadiusBottomRightUnit = 'px',
}: BorderRadiusHandlesProps) {
  const { components, updateComponentProps } = useCanvasStore();
  const [hoveredCorner, setHoveredCorner] = useState<Corner | null>(null);
  const [badgeRect, setBadgeRect] = useState<DOMRect | null>(null);
  // ✨ Mouse position for cursor-following tooltips
  const [mousePos, setMousePos] = useState<{ x: number; y: number; corner: Corner } | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // Get component
  const component = components.find(c => c.id === componentId);

  // Find the actual Badge element and track its position
  React.useEffect(() => {
    if (!componentId) return;

    const updateBadgeRect = () => {
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
    };

    updateBadgeRect();

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

  // Immediate update when props change (removed debouncing for smooth dragging)
  React.useEffect(() => {
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
  }, [componentId, component?.props]);

  if (!component || !badgeRect) return null;

  const props = component.props || {};

  // Get border radius value for each corner (individual overrides shorthand)
  const getValue = (corner: Corner): number => {
    // Convert corner to prop name: topLeft -> TopLeft
    const capitalizedCorner = corner.charAt(0).toUpperCase() + corner.slice(1);
    const individualProp = `borderRadius${capitalizedCorner}`;

    // Individual value overrides shorthand
    return props[individualProp] ?? props.borderRadius ?? 0;
  };

  const topLeftValue = getValue('topLeft');
  const topRightValue = getValue('topRight');
  const bottomLeftValue = getValue('bottomLeft');
  const bottomRightValue = getValue('bottomRight');

  // Handle individual corner drag (optimized for smooth dragging)
  const handleCornerDrag = (corner: Corner, newValue: number, isFinished: boolean = false) => {
    const capitalizedCorner = corner.charAt(0).toUpperCase() + corner.slice(1);
    const propName = `borderRadius${capitalizedCorner}`;

    // Round only when drag is finished for smooth dragging
    const finalValue = isFinished ? Math.max(0, Math.round(newValue)) : Math.max(0, newValue);

    updateComponentProps(componentId, {
      [propName]: finalValue,
    });
  };

  // Handle uniform border radius drag (all corners at once)
  const handleUniformDrag = (newValue: number) => {
    const clampedValue = Math.max(0, Math.round(newValue));

    updateComponentProps(componentId, {
      // Set shorthand property and clear individual corners
      borderRadius: clampedValue,
      borderRadiusTopLeft: undefined,
      borderRadiusTopRight: undefined,
      borderRadiusBottomLeft: undefined,
      borderRadiusBottomRight: undefined,
    });
  };

  // Get average border radius for center handle display
  const getAverageBorderRadius = (): number => {
    const avg = (topLeftValue + topRightValue + bottomLeftValue + bottomRightValue) / 4;
    return Math.round(avg);
  };

  // Calculate center point
  const centerX = badgeRect.left + badgeRect.width / 2;
  const centerY = badgeRect.top + badgeRect.height / 2;

  return (
    <>
      {/* Corner Arrows INSIDE element - visual guides */}
      <CornerArrow corner="topLeft" badgeRect={badgeRect} isHovered={hoveredCorner === 'topLeft'} />
      <CornerArrow corner="topRight" badgeRect={badgeRect} isHovered={hoveredCorner === 'topRight'} />
      <CornerArrow corner="bottomLeft" badgeRect={badgeRect} isHovered={hoveredCorner === 'bottomLeft'} />
      <CornerArrow corner="bottomRight" badgeRect={badgeRect} isHovered={hoveredCorner === 'bottomRight'} />

      {/* Center Uniform Border Radius Handle - for grouped control */}
      <UniformBorderRadiusHandle
        value={getAverageBorderRadius()}
        centerX={centerX}
        centerY={centerY}
        badgeRect={badgeRect}
        onDrag={handleUniformDrag}
      />

      {/* Border Radius Corner Handles */}
      <BorderRadiusHandle
        corner="topLeft"
        value={topLeftValue}
        unit={borderRadiusTopLeftUnit}
        isHovered={hoveredCorner === 'topLeft'}
        onHover={() => setHoveredCorner('topLeft')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue, isFinished) => handleCornerDrag('topLeft', newValue, isFinished)}
        badgeRect={badgeRect}
        sharedMousePos={mousePos?.corner === 'topLeft' ? mousePos : null}
        onMousePosChange={setMousePos}
      />

      <BorderRadiusHandle
        corner="topRight"
        value={topRightValue}
        unit={borderRadiusTopRightUnit}
        isHovered={hoveredCorner === 'topRight'}
        onHover={() => setHoveredCorner('topRight')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue, isFinished) => handleCornerDrag('topRight', newValue, isFinished)}
        badgeRect={badgeRect}
        sharedMousePos={mousePos?.corner === 'topRight' ? mousePos : null}
        onMousePosChange={setMousePos}
      />

      <BorderRadiusHandle
        corner="bottomLeft"
        value={bottomLeftValue}
        unit={borderRadiusBottomLeftUnit}
        isHovered={hoveredCorner === 'bottomLeft'}
        onHover={() => setHoveredCorner('bottomLeft')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue, isFinished) => handleCornerDrag('bottomLeft', newValue, isFinished)}
        badgeRect={badgeRect}
        sharedMousePos={mousePos?.corner === 'bottomLeft' ? mousePos : null}
        onMousePosChange={setMousePos}
      />

      <BorderRadiusHandle
        corner="bottomRight"
        value={bottomRightValue}
        unit={borderRadiusBottomRightUnit}
        isHovered={hoveredCorner === 'bottomRight'}
        onHover={() => setHoveredCorner('bottomRight')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue, isFinished) => handleCornerDrag('bottomRight', newValue, isFinished)}
        badgeRect={badgeRect}
        sharedMousePos={mousePos?.corner === 'bottomRight' ? mousePos : null}
        onMousePosChange={setMousePos}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// CORNER ARROW (Inside element - visual guide)
// ═══════════════════════════════════════════════════════════════
interface CornerArrowProps {
  corner: Corner;
  badgeRect: DOMRect;
  isHovered: boolean;
}

function CornerArrow({ corner, badgeRect, isHovered }: CornerArrowProps) {
  const inset = 8; // Distance from edge (5-10px as requested)
  const arrowSize = 20; // SVG viewBox size

  // Position arrow inside element at corner
  const getArrowPosition = (): React.CSSProperties => {
    switch (corner) {
      case 'topLeft':
        return {
          top: `${badgeRect.top + inset}px`,
          left: `${badgeRect.left + inset}px`,
        };
      case 'topRight':
        return {
          top: `${badgeRect.top + inset}px`,
          left: `${badgeRect.right - inset - arrowSize}px`,
        };
      case 'bottomLeft':
        return {
          top: `${badgeRect.bottom - inset - arrowSize}px`,
          left: `${badgeRect.left + inset}px`,
        };
      case 'bottomRight':
        return {
          top: `${badgeRect.bottom - inset - arrowSize}px`,
          left: `${badgeRect.right - inset - arrowSize}px`,
        };
    }
  };

  // Arrow path pointing TO center
  const getArrowPath = () => {
    const center = 10; // Center of 20px viewBox

    switch (corner) {
      case 'topLeft':
        // Arrow pointing down-right (to center) ↘
        return `M3 3 L12 12 M12 12 L3 12 M12 12 L12 3`;
      case 'topRight':
        // Arrow pointing down-left (to center) ↙
        return `M17 3 L8 12 M8 12 L17 12 M8 12 L8 3`;
      case 'bottomLeft':
        // Arrow pointing up-right (to center) ↗
        return `M3 17 L12 8 M12 8 L3 8 M12 8 L12 17`;
      case 'bottomRight':
        // Arrow pointing up-left (to center) ↖
        return `M17 17 L8 8 M8 8 L17 8 M8 8 L8 17`;
    }
  };

  return (
    <svg
      width={arrowSize}
      height={arrowSize}
      viewBox={`0 0 ${arrowSize} ${arrowSize}`}
      style={{
        position: 'absolute',
        ...getArrowPosition(),
        pointerEvents: 'none',
        zIndex: 45, // Above arc indicators, below handles
        opacity: isHovered ? 1 : 0.7,
        transition: 'opacity 0.15s ease',
      }}
    >
      <path
        d={getArrowPath()}
        stroke="#6366f1" // Indigo to match center handle
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.4))',
        }}
      />
    </svg>
  );
}

// UNIFORM BORDER RADIUS HANDLE (Center, for grouped control)
// ═══════════════════════════════════════════════════════════════
interface UniformBorderRadiusHandleProps {
  value: number;
  centerX: number;
  centerY: number;
  badgeRect: DOMRect;
  onDrag: (newValue: number) => void;
}

function UniformBorderRadiusHandle({
  value,
  centerX,
  centerY,
  badgeRect,
  onDrag,
}: UniformBorderRadiusHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Use diagonal movement (average of X and Y) for uniform radius
      const totalDeltaX = e.clientX - dragStartRef.current.x;
      const totalDeltaY = e.clientY - dragStartRef.current.y;

      // Average delta for uniform border radius
      const avgDelta = (totalDeltaX + totalDeltaY) / 2;

      const newValue = dragStartRef.current.initialValue + avgDelta;
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

  // Position handle at center of element
  const handleSize = 22; // LARGER for prominence (vs 16px corners)
  const handleX = centerX - handleSize / 2;
  const handleY = centerY - handleSize / 2;

  return (
    <>
      {/* Visual feedback - dashed lines to corners when hovering/dragging */}
      {(isHovered || isDragging) && value > 0 && (
        <>
          {/* Diagonal line to top-left corner */}
          <svg
            style={{
              position: 'absolute',
              left: `${badgeRect.left}px`,
              top: `${badgeRect.top}px`,
              width: `${centerX - badgeRect.left}px`,
              height: `${centerY - badgeRect.top}px`,
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          >
            <line
              x1="0"
              y1="0"
              x2={centerX - badgeRect.left}
              y2={centerY - badgeRect.top}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>

          {/* Diagonal line to top-right corner */}
          <svg
            style={{
              position: 'absolute',
              left: `${centerX}px`,
              top: `${badgeRect.top}px`,
              width: `${badgeRect.right - centerX}px`,
              height: `${centerY - badgeRect.top}px`,
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          >
            <line
              x1="0"
              y1={centerY - badgeRect.top}
              x2={badgeRect.right - centerX}
              y2="0"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>

          {/* Diagonal line to bottom-left corner */}
          <svg
            style={{
              position: 'absolute',
              left: `${badgeRect.left}px`,
              top: `${centerY}px`,
              width: `${centerX - badgeRect.left}px`,
              height: `${badgeRect.bottom - centerY}px`,
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          >
            <line
              x1="0"
              y1={badgeRect.bottom - centerY}
              x2={centerX - badgeRect.left}
              y2="0"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>

          {/* Diagonal line to bottom-right corner */}
          <svg
            style={{
              position: 'absolute',
              left: `${centerX}px`,
              top: `${centerY}px`,
              width: `${badgeRect.right - centerX}px`,
              height: `${badgeRect.bottom - centerY}px`,
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          >
            <line
              x1="0"
              y1="0"
              x2={badgeRect.right - centerX}
              y2={badgeRect.bottom - centerY}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="4"
            />
          </svg>
        </>
      )}

      {/* Center Uniform Border Radius Handle (PROMINENT - INDIGO COLOR) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          left: `${handleX}px`,
          top: `${handleY}px`,
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          borderRadius: '50%',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 49, // Above corner handles
          transition: isDragging ? 'none' : 'all 0.15s ease',
          // INDIGO (blue-purple) to distinguish from green corners
          backgroundColor: isDragging ? '#4338ca' : isHovered ? '#4f46e5' : '#6366f1',
          border: '3px solid white',
          boxShadow: isDragging
            ? '0 0 20px rgba(99, 102, 241, 0.9), 0 0 40px rgba(99, 102, 241, 0.5)'
            : isHovered
            ? '0 0 16px rgba(99, 102, 241, 0.7), 0 4px 10px rgba(0,0,0,0.3)'
            : '0 0 12px rgba(99, 102, 241, 0.5), 0 3px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: !isDragging ? 'pulse-subtle 2s ease-in-out infinite' : 'none',
        }}
        title="Drag to change all corners uniformly"
      >
        {/* 4-arrows icon (all directions) */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Vertical line */}
          <line x1="8" y1="2" x2="8" y2="14" />
          {/* Horizontal line */}
          <line x1="2" y1="8" x2="14" y2="8" />
          {/* Arrow heads */}
          <polyline points="5,5 8,2 11,5" /> {/* Top arrow */}
          <polyline points="5,11 8,14 11,11" /> {/* Bottom arrow */}
          <polyline points="5,5 2,8 5,11" /> {/* Left arrow */}
          <polyline points="11,5 14,8 11,11" /> {/* Right arrow */}
        </svg>
      </div>

      {/* CSS Animation for subtle pulse */}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.5), 0 3px 8px rgba(0,0,0,0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.7), 0 3px 8px rgba(0,0,0,0.3);
          }
        }
      `}</style>

      {/* Tooltip - Brutalist dark style */}
      {(isHovered || isDragging) && (
        <div
          style={{
            position: 'absolute',
            left: `${centerX}px`,
            top: `${centerY - 36}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937', // Dark gray (gray-800) - 14.6:1 contrast with white
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 51,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)', // Subtle highlight
          }}
        >
          ↔↕ all corners: {value}px
          {isDragging && <span className="ml-1 text-gray-300">(uniform)</span>}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// BORDER RADIUS HANDLE (Individual corners)
// ═══════════════════════════════════════════════════════════════
interface BorderRadiusHandleProps {
  corner: Corner;
  value: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw'; // ✨ Unit for display
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onDrag: (newValue: number, isFinished?: boolean) => void;
  badgeRect: DOMRect;
  // ✨ Shared mouse position from parent
  sharedMousePos: { x: number; y: number; corner: Corner } | null;
  onMousePosChange: (pos: { x: number; y: number; corner: Corner } | null) => void;
}

function BorderRadiusHandle({
  corner,
  value,
  unit,
  isHovered,
  onHover,
  onLeave,
  onDrag,
  badgeRect,
  sharedMousePos,
  onMousePosChange,
}: BorderRadiusHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    // ✨ Update mouse position for tooltip
    onMousePosChange({ x: e.clientX, y: e.clientY, corner });

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // ✨ Update mouse position for cursor-following tooltip
      onMousePosChange({ x: e.clientX, y: e.clientY, corner });

      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Throttle updates using requestAnimationFrame for smooth 60fps
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;

        const totalDeltaX = e.clientX - dragStartRef.current.x;
        const totalDeltaY = e.clientY - dragStartRef.current.y;

        // FIXED: Inverted logic for intuitive behavior
        // Drag OUTWARD (away from center) → radius DECREASES (sharper corner)
        // Drag INWARD (towards center) → radius INCREASES (rounder corner)
        let delta = 0;

        switch (corner) {
          case 'topLeft':
            // Drag up-left (outward) = negative delta → decrease radius
            // Drag down-right (inward) = positive delta → increase radius
            delta = (totalDeltaX + totalDeltaY) / 2;
            break;
          case 'topRight':
            // Drag up-right (outward) = negative delta → decrease radius
            // Drag down-left (inward) = positive delta → increase radius
            delta = -(totalDeltaX - totalDeltaY) / 2;
            break;
          case 'bottomLeft':
            // Drag down-left (outward) = negative delta → decrease radius
            // Drag up-right (inward) = positive delta → increase radius
            delta = (totalDeltaX - totalDeltaY) / 2;
            break;
          case 'bottomRight':
            // Drag down-right (outward) = negative delta → decrease radius
            // Drag up-left (inward) = positive delta → increase radius
            delta = -(totalDeltaX + totalDeltaY) / 2;
            break;
        }

        const newValue = dragStartRef.current.initialValue + delta;
        onDrag(newValue, false); // Not finished yet
      });
    };

    const handleMouseUp = () => {
      // Final update with rounded value
      if (dragStartRef.current) {
        const totalDeltaX = window.event ? (window.event as MouseEvent).clientX - dragStartRef.current.x : 0;
        const totalDeltaY = window.event ? (window.event as MouseEvent).clientY - dragStartRef.current.y : 0;

        let delta = 0;
        switch (corner) {
          case 'topLeft':
            delta = (totalDeltaX + totalDeltaY) / 2;
            break;
          case 'topRight':
            delta = -(totalDeltaX - totalDeltaY) / 2;
            break;
          case 'bottomLeft':
            delta = (totalDeltaX - totalDeltaY) / 2;
            break;
          case 'bottomRight':
            delta = -(totalDeltaX + totalDeltaY) / 2;
            break;
        }

        const newValue = dragStartRef.current.initialValue + delta;
        onDrag(newValue, true); // Finished, will round
      }

      setIsDragging(false);
      dragStartRef.current = null;

      // ✨ Clear mouse position
      onMousePosChange(null);

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

  // Position handle at corner (like scale handles - green squares)
  const getPositionStyles = () => {
    const handleSize = 16;
    const offset = -8; // Negative offset like scale handles

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      borderRadius: '3px', // Slightly rounded squares like scale
      cursor: 'nwse-resize',
      zIndex: 47,
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: isDragging ? '#10b981' : isHovered ? '#34d399' : '#6ee7b7', // Green like scale
      border: '3px solid white',
      boxShadow: isDragging ? '0 0 16px rgba(16, 185, 129, 0.7)' : '0 3px 8px rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
      color: 'white',
    };

    switch (corner) {
      case 'topLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.top + offset}px`,
          left: `${badgeRect.left + offset}px`,
          cursor: 'nwse-resize',
        };
      case 'topRight':
        return {
          ...baseStyles,
          top: `${badgeRect.top + offset}px`,
          left: `${badgeRect.right - handleSize - offset}px`,
          cursor: 'nesw-resize',
        };
      case 'bottomLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - handleSize - offset}px`,
          left: `${badgeRect.left + offset}px`,
          cursor: 'nesw-resize',
        };
      case 'bottomRight':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - handleSize - offset}px`,
          left: `${badgeRect.right - handleSize - offset}px`,
          cursor: 'nwse-resize',
        };
    }
  };

  // Tooltip arrow symbol for each corner
  const getTooltipArrow = (): string => {
    switch (corner) {
      case 'topLeft':
        return '↘'; // Down-right
      case 'topRight':
        return '↙'; // Down-left
      case 'bottomLeft':
        return '↗'; // Up-right
      case 'bottomRight':
        return '↖'; // Up-left
    }
  };

  // ✨ Tooltip position - Cursor-following (like SpacingHandlesV2)
  const getTooltipStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      backgroundColor: '#1f2937', // Dark gray (gray-800) - 14.6:1 contrast with white
      color: 'white',
      padding: '6px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 51,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.1)', // Subtle highlight
    };

    const mousePos = sharedMousePos?.corner === corner ? sharedMousePos : null;

    // ✨ If we have mouse position, show near cursor with smart positioning (10px offset)
    if (mousePos) {
      const tooltipWidth = 120; // Approximate width
      const tooltipHeight = 30; // Approximate height
      const offset = 10; // Gap between cursor and tooltip (like SpacingHandlesV2)

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

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

      return {
        ...baseStyles,
        position: 'fixed', // Use fixed to position relative to viewport
        left: `${left}px`,
        top: `${top}px`,
        transform,
      };
    }

    // Fallback: if no mousePos, don't show tooltip (hidden by render condition)
    return { ...baseStyles, position: 'fixed', left: '-9999px', top: '-9999px' };
  };

  // Visual indicator - arc showing border radius effect
  const getArcIndicator = (): React.CSSProperties | null => {
    if (!isHovered && !isDragging) return null;
    if (value === 0) return null;

    const arcSize = Math.min(value * 2, 40); // Limit arc size for visibility

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: `${arcSize}px`,
      height: `${arcSize}px`,
      borderColor: '#10b981',
      borderStyle: 'solid',
      borderWidth: '2px',
      pointerEvents: 'none',
      zIndex: 44,
      opacity: 0.6,
    };

    switch (corner) {
      case 'topLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          left: `${badgeRect.left}px`,
          borderRadius: '0 0 100% 0',
          borderTop: 'none',
          borderLeft: 'none',
        };
      case 'topRight':
        return {
          ...baseStyles,
          top: `${badgeRect.top}px`,
          left: `${badgeRect.right - arcSize}px`,
          borderRadius: '0 0 0 100%',
          borderTop: 'none',
          borderRight: 'none',
        };
      case 'bottomLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - arcSize}px`,
          left: `${badgeRect.left}px`,
          borderRadius: '0 100% 0 0',
          borderBottom: 'none',
          borderLeft: 'none',
        };
      case 'bottomRight':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - arcSize}px`,
          left: `${badgeRect.right - arcSize}px`,
          borderRadius: '100% 0 0 0',
          borderBottom: 'none',
          borderRight: 'none',
        };
    }
  };

  const arcIndicatorStyles = getArcIndicator();

  return (
    <>
      {/* Visual Arc Indicator - shows border radius effect */}
      {arcIndicatorStyles && <div style={arcIndicatorStyles} />}

      {/* Handle (no arrow - arrows are separate inside element) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          onHover();
          // ✨ Update mouse position when hovering over handle
          onMousePosChange({ x: e.clientX, y: e.clientY, corner });
        }}
        onMouseMove={(e) => {
          // ✨ CRITICAL: Update mouse position continuously while hovering
          // This ensures tooltip follows cursor (not just on click)
          if (!isDragging) {
            onMousePosChange({ x: e.clientX, y: e.clientY, corner });
          }
        }}
        onMouseLeave={() => {
          onLeave();
          // ✨ Clear mouse position when leaving handle (if not dragging)
          if (!isDragging) {
            onMousePosChange(null);
          }
        }}
        style={getPositionStyles()}
      />

      {/* ✨ Tooltip - показывается только когда есть mousePos (hover или dragging) */}
      {(sharedMousePos?.corner === corner) && (
        <div style={getTooltipStyles()}>
          {getTooltipArrow()} radius: {value}{unit}
        </div>
      )}
    </>
  );
}
