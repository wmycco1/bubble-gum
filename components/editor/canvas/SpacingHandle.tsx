'use client';

/**
 * SpacingHandle - Individual draggable handle for margin/padding control
 *
 * Features:
 * - Draggable interaction
 * - Tooltip with current value
 * - Visual feedback on hover/drag
 * - Supports all 4 sides + center
 */

import React, { useState, useRef } from 'react';

type HandlePosition = 'top' | 'right' | 'bottom' | 'left' | 'center';

interface SpacingHandleProps {
  position: HandlePosition;
  value?: number;
  onValueChange: (value: number) => void;
  x: number;
  y: number;
  snapToGrid?: number; // Grid snap in px (e.g., 4, 8)
}

export function SpacingHandle({
  position,
  value = 0,
  onValueChange,
  x,
  y,
  snapToGrid,
}: SpacingHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialValue: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialValue: value,
    };

    // Add global mouse listeners
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Calculate movement based on position
      let delta = 0;
      if (position === 'top') {
        delta = dragStartRef.current.y - e.clientY; // Inverted: drag up = increase
      } else if (position === 'bottom') {
        delta = e.clientY - dragStartRef.current.y;
      } else if (position === 'left') {
        delta = dragStartRef.current.x - e.clientX; // Inverted: drag left = increase
      } else if (position === 'right') {
        delta = e.clientX - dragStartRef.current.x;
      } else if (position === 'center') {
        // Center: use average of both axes
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        delta = (deltaX + deltaY) / 2;
      }

      let newValue = dragStartRef.current.initialValue + delta;

      // Snap to grid if enabled and Shift is pressed
      if (snapToGrid && e.shiftKey) {
        newValue = Math.round(newValue / snapToGrid) * snapToGrid;
      }

      // Clamp to 0+ (no negative spacing)
      newValue = Math.max(0, Math.round(newValue));

      onValueChange(newValue);
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

  // Handle styles based on position
  const getHandleStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      cursor: position === 'center' ? 'move' : getCursor(position),
      zIndex: isDragging ? 1000 : 100,
      transition: isDragging ? 'none' : 'all 0.15s ease',
    };

    if (position === 'center') {
      return {
        ...baseStyle,
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: isDragging ? '#3b82f6' : isHovered ? '#60a5fa' : '#93c5fd',
        border: '2px solid #1e40af',
        boxShadow: isDragging ? '0 4px 12px rgba(59, 130, 246, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
      };
    }

    // Side handles - VERY VISIBLE FOR DEBUG
    const isVertical = position === 'top' || position === 'bottom';
    return {
      ...baseStyle,
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      width: isVertical ? '60px' : '12px',
      height: isVertical ? '12px' : '60px',
      borderRadius: '6px',
      backgroundColor: isDragging ? '#ef4444' : isHovered ? '#f97316' : '#3b82f6',
      border: '3px solid #1e40af',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.6)',
    };
  };

  const getCursor = (pos: HandlePosition): string => {
    switch (pos) {
      case 'top':
      case 'bottom':
        return 'ns-resize';
      case 'left':
      case 'right':
        return 'ew-resize';
      case 'center':
        return 'move';
      default:
        return 'default';
    }
  };

  return (
    <>
      {/* Handle */}
      <div
        style={getHandleStyle()}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Tooltip */}
      {(isHovered || isDragging) && (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: position === 'top' ? y - 30 : position === 'bottom' ? y + 30 : y,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1001,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          {position === 'center' ? 'All' : position}: {value}px
        </div>
      )}
    </>
  );
}
