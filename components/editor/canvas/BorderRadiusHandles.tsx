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
}

export function BorderRadiusHandles({ componentId }: BorderRadiusHandlesProps) {
  const { components, updateComponentProps } = useCanvasStore();
  const [hoveredCorner, setHoveredCorner] = useState<Corner | null>(null);
  const [badgeRect, setBadgeRect] = useState<DOMRect | null>(null);
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

  // Debounced update when props change
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
    }, 50);

    return () => clearTimeout(timeoutId);
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

  // Handle individual corner drag
  const handleCornerDrag = (corner: Corner, newValue: number) => {
    const capitalizedCorner = corner.charAt(0).toUpperCase() + corner.slice(1);
    const propName = `borderRadius${capitalizedCorner}`;

    updateComponentProps(componentId, {
      [propName]: Math.max(0, Math.round(newValue)),
    });
  };

  return (
    <>
      {/* Border Radius Corner Handles */}
      <BorderRadiusHandle
        corner="topLeft"
        value={topLeftValue}
        isHovered={hoveredCorner === 'topLeft'}
        onHover={() => setHoveredCorner('topLeft')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue) => handleCornerDrag('topLeft', newValue)}
        badgeRect={badgeRect}
      />

      <BorderRadiusHandle
        corner="topRight"
        value={topRightValue}
        isHovered={hoveredCorner === 'topRight'}
        onHover={() => setHoveredCorner('topRight')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue) => handleCornerDrag('topRight', newValue)}
        badgeRect={badgeRect}
      />

      <BorderRadiusHandle
        corner="bottomLeft"
        value={bottomLeftValue}
        isHovered={hoveredCorner === 'bottomLeft'}
        onHover={() => setHoveredCorner('bottomLeft')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue) => handleCornerDrag('bottomLeft', newValue)}
        badgeRect={badgeRect}
      />

      <BorderRadiusHandle
        corner="bottomRight"
        value={bottomRightValue}
        isHovered={hoveredCorner === 'bottomRight'}
        onHover={() => setHoveredCorner('bottomRight')}
        onLeave={() => setHoveredCorner(null)}
        onDrag={(newValue) => handleCornerDrag('bottomRight', newValue)}
        badgeRect={badgeRect}
      />
    </>
  );
}

// Border Radius Handle Component
interface BorderRadiusHandleProps {
  corner: Corner;
  value: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onDrag: (newValue: number) => void;
  badgeRect: DOMRect;
}

function BorderRadiusHandle({
  corner,
  value,
  isHovered,
  onHover,
  onLeave,
  onDrag,
  badgeRect,
}: BorderRadiusHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = React.useRef<{ x: number; y: number; initialValue: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialValue: value };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const totalDeltaX = e.clientX - dragStartRef.current.x;
      const totalDeltaY = e.clientY - dragStartRef.current.y;

      // For border radius: drag away from corner increases, drag towards decreases
      let delta = 0;

      switch (corner) {
        case 'topLeft':
          delta = -(totalDeltaX + totalDeltaY) / 2;
          break;
        case 'topRight':
          delta = (totalDeltaX - totalDeltaY) / 2;
          break;
        case 'bottomLeft':
          delta = (-totalDeltaX + totalDeltaY) / 2;
          break;
        case 'bottomRight':
          delta = (totalDeltaX + totalDeltaY) / 2;
          break;
      }

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

  // Position handle at corner
  const getPositionStyles = () => {
    const handleSize = 10; // Small square handle
    const offset = 3; // Offset from corner

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      borderRadius: '2px', // Slightly rounded square
      cursor: 'nwse-resize',
      zIndex: 47, // Above spacing handles
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: isDragging ? '#10b981' : isHovered ? '#3b82f6' : '#93c5fd',
      border: isDragging ? '2px solid #059669' : isHovered ? '2px solid #2563eb' : '2px solid #60a5fa',
      boxShadow: isDragging ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none',
      opacity: isDragging ? 1 : isHovered ? 1 : 0.6,
    };

    switch (corner) {
      case 'topLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.top + offset}px`,
          left: `${badgeRect.left + offset}px`,
        };
      case 'topRight':
        return {
          ...baseStyles,
          top: `${badgeRect.top + offset}px`,
          left: `${badgeRect.right - handleSize - offset}px`,
        };
      case 'bottomLeft':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - handleSize - offset}px`,
          left: `${badgeRect.left + offset}px`,
        };
      case 'bottomRight':
        return {
          ...baseStyles,
          top: `${badgeRect.bottom - handleSize - offset}px`,
          left: `${badgeRect.right - handleSize - offset}px`,
        };
    }
  };

  // Tooltip position
  const getTooltipStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 51,
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    };

    switch (corner) {
      case 'topLeft':
        return { ...baseStyles, top: '-22px', left: '0' };
      case 'topRight':
        return { ...baseStyles, top: '-22px', right: '0' };
      case 'bottomLeft':
        return { ...baseStyles, bottom: '-22px', left: '0' };
      case 'bottomRight':
        return { ...baseStyles, bottom: '-22px', right: '0' };
    }
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

      {/* Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={getPositionStyles()}
      />

      {/* Tooltip */}
      {(isHovered || isDragging) && (
        <div style={getTooltipStyles()}>
          🔄 radius: {value}px
        </div>
      )}
    </>
  );
}
