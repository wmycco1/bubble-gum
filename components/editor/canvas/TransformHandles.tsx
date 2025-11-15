'use client';

/**
 * TransformHandles - Figma-style rotation & scale controls
 *
 * Features:
 * - Rotation handle (circular, top-center)
 * - Scale handles (4 corners)
 * - Drag to rotate/scale component
 * - Visual feedback with tooltips
 * - Works for all components with transform support
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface TransformHandlesProps {
  componentId: string;
}

export function TransformHandles({ componentId }: TransformHandlesProps) {
  const { components, updateComponentProps } = useCanvasStore();
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // Get component
  const component = components.find(c => c.id === componentId);

  // Find the actual component element and track its position
  React.useEffect(() => {
    if (!componentId) return;

    const updateElementRect = () => {
      const wrapper = document.querySelector(`[data-component-id="${componentId}"]`);
      if (!wrapper) return;

      // Try to find Badge or any element with data-testid
      let targetElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;

      // Fallback: use first child if no specific testid found
      if (!targetElement) {
        targetElement = wrapper.querySelector('*:not([data-component-id])') as HTMLElement;
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const relativeRect = {
          top: rect.top - wrapperRect.top,
          left: rect.left - wrapperRect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right - wrapperRect.left,
          bottom: rect.bottom - wrapperRect.top,
        } as DOMRect;

        setElementRect(relativeRect);
      }
    };

    updateElementRect();

    const handleUpdate = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateElementRect);
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

      let targetElement = wrapper.querySelector('[data-testid="badge"]') as HTMLElement;
      if (!targetElement) {
        targetElement = wrapper.querySelector('*:not([data-component-id])') as HTMLElement;
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();

        const relativeRect = {
          top: rect.top - wrapperRect.top,
          left: rect.left - wrapperRect.left,
          width: rect.width,
          height: rect.height,
          right: rect.right - wrapperRect.left,
          bottom: rect.bottom - wrapperRect.top,
        } as DOMRect;

        setElementRect(relativeRect);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [componentId, component?.props]);

  if (!component || !elementRect) return null;

  const props = component.props || {};

  // Get current rotation and scale
  const rotate = props.rotate ?? 0;
  const scaleX = props.scaleX ?? 1;
  const scaleY = props.scaleY ?? 1;

  // Calculate center point for rotation
  const centerX = elementRect.left + elementRect.width / 2;
  const centerY = elementRect.top + elementRect.height / 2;

  return (
    <>
      {/* Rotation Handle - Top Center (LARGE & OBVIOUS) */}
      <RotationHandle
        componentId={componentId}
        centerX={centerX}
        centerY={centerY}
        elementRect={elementRect}
        currentRotation={rotate}
      />

      {/* Center Uniform Scale Handle - Middle of element (GROUP CONTROL) */}
      <UniformScaleHandle
        componentId={componentId}
        centerX={centerX}
        centerY={centerY}
        elementRect={elementRect}
        currentScaleX={scaleX}
        currentScaleY={scaleY}
      />

      {/* Scale Handles - 4 Corners (INDIVIDUAL) */}
      <ScaleHandle
        componentId={componentId}
        corner="topLeft"
        elementRect={elementRect}
        currentScaleX={scaleX}
        currentScaleY={scaleY}
      />

      <ScaleHandle
        componentId={componentId}
        corner="topRight"
        elementRect={elementRect}
        currentScaleX={scaleX}
        currentScaleY={scaleY}
      />

      <ScaleHandle
        componentId={componentId}
        corner="bottomLeft"
        elementRect={elementRect}
        currentScaleX={scaleX}
        currentScaleY={scaleY}
      />

      <ScaleHandle
        componentId={componentId}
        corner="bottomRight"
        elementRect={elementRect}
        currentScaleX={scaleX}
        currentScaleY={scaleY}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// UNIFORM SCALE HANDLE (Center, for grouped control)
// ═══════════════════════════════════════════════════════════════
interface UniformScaleHandleProps {
  componentId: string;
  centerX: number;
  centerY: number;
  elementRect: DOMRect;
  currentScaleX: number;
  currentScaleY: number;
}

const UniformScaleHandle = React.memo(function UniformScaleHandle({
  componentId,
  centerX,
  centerY,
  elementRect,
  currentScaleX,
  currentScaleY
}: UniformScaleHandleProps) {
  const { updateComponentProps } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number; initialScaleX: number; initialScaleY: number } | null>(null);
  const mouseMoveRafRef = React.useRef<number | null>(null); // ⚡ RAF for hover mouse tracking

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialScaleX: currentScaleX,
      initialScaleY: currentScaleY,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Use diagonal movement (average of X and Y) for uniform scaling
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Average delta for uniform scaling
      const avgDelta = (deltaX + deltaY) / 2;

      // Sensitivity: 0.01 per pixel (same as corner handles)
      const scaleChange = avgDelta * 0.01;

      // Apply uniform scale (same to both X and Y)
      let newScale = dragStartRef.current.initialScaleX + scaleChange;

      // Minimum scale: 0.1
      newScale = Math.max(0.1, newScale);

      // Round to 2 decimal places
      newScale = Math.round(newScale * 100) / 100;

      // Update both scaleX and scaleY to the same value
      updateComponentProps(componentId, {
        scaleX: newScale,
        scaleY: newScale,
      });
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

  // Average current scale for display
  const avgScale = (currentScaleX + currentScaleY) / 2;

  return (
    <>
      {/* Visual feedback lines - only when hovering or dragging */}
      {(isHovered || isDragging) && (
        <>
          {/* Top dashed line */}
          <div
            style={{
              position: 'absolute',
              left: `${centerX}px`,
              top: `${elementRect.top}px`,
              width: '0',
              height: `${centerY - elementRect.top}px`,
              borderLeft: '2px dashed #6366f1',
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          />

          {/* Right dashed line */}
          <div
            style={{
              position: 'absolute',
              left: `${centerX}px`,
              top: `${centerY}px`,
              width: `${elementRect.right - centerX}px`,
              height: '0',
              borderTop: '2px dashed #6366f1',
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          />

          {/* Bottom dashed line */}
          <div
            style={{
              position: 'absolute',
              left: `${centerX}px`,
              top: `${centerY}px`,
              width: '0',
              height: `${elementRect.bottom - centerY}px`,
              borderLeft: '2px dashed #6366f1',
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          />

          {/* Left dashed line */}
          <div
            style={{
              position: 'absolute',
              left: `${elementRect.left}px`,
              top: `${centerY}px`,
              width: `${centerX - elementRect.left}px`,
              height: '0',
              borderTop: '2px dashed #6366f1',
              pointerEvents: 'none',
              zIndex: 44,
              opacity: 0.6,
            }}
          />
        </>
      )}

      {/* Center Uniform Scale Handle (PROMINENT - INDIGO COLOR) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          setIsHovered(true);
          setMousePos({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e) => {
          // ⚡ RAF throttling: Update at max 60fps
          if (!isDragging) {
            if (mouseMoveRafRef.current) {
              cancelAnimationFrame(mouseMoveRafRef.current);
            }
            mouseMoveRafRef.current = requestAnimationFrame(() => {
              setMousePos({ x: e.clientX, y: e.clientY });
            });
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          // ⚡ Cancel RAF and clear mouse position
          if (mouseMoveRafRef.current) {
            cancelAnimationFrame(mouseMoveRafRef.current);
            mouseMoveRafRef.current = null;
          }
          if (!isDragging) {
            setMousePos(null);
          }
        }}
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
          animation: !isDragging ? 'pulse-subtle-scale 2s ease-in-out infinite' : 'none',
        }}
        title="Drag to scale uniformly (both X and Y)"
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
        @keyframes pulse-subtle-scale {
          0%, 100% {
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.5), 0 3px 8px rgba(0,0,0,0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.7), 0 3px 8px rgba(0,0,0,0.3);
          }
        }
      `}</style>

      {/* Tooltip - Portal rendered for correct cursor-relative positioning */}
      {mousePos && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y + 10}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937', // Dark gray (gray-800) - 14.6:1 contrast with white
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)', // Subtle highlight
          }}
        >
          ↔↕ uniform: ×{avgScale.toFixed(2)}
          {isDragging && <span className="ml-1 text-gray-300">(all sides)</span>}
        </div>,
        document.body
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // ⚡ Custom comparison - only re-render if these values change
  return (
    prevProps.centerX === nextProps.centerX &&
    prevProps.centerY === nextProps.centerY &&
    prevProps.currentScaleX === nextProps.currentScaleX &&
    prevProps.currentScaleY === nextProps.currentScaleY
  );
});

// ═══════════════════════════════════════════════════════════════
// ROTATION HANDLE (Circular, top-center)
// ═══════════════════════════════════════════════════════════════
interface RotationHandleProps {
  componentId: string;
  centerX: number;
  centerY: number;
  elementRect: DOMRect;
  currentRotation: number;
}

const RotationHandle = React.memo(function RotationHandle({ componentId, centerX, centerY, elementRect, currentRotation }: RotationHandleProps) {
  const { updateComponentProps } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number; initialRotation: number } | null>(null);
  const mouseMoveRafRef = React.useRef<number | null>(null); // ⚡ RAF for hover mouse tracking

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, initialRotation: currentRotation };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // IMPROVED: Use horizontal movement for rotation (more intuitive & sensitive)
      const deltaX = e.clientX - dragStartRef.current.x;

      // Sensitivity: 0.5 degrees per pixel (was too stiff before)
      const angleDelta = deltaX * 0.5;

      // Apply rotation (snap to 15° increments if Shift is held)
      let newRotation = dragStartRef.current.initialRotation + angleDelta;

      if (e.shiftKey) {
        newRotation = Math.round(newRotation / 15) * 15;
      }

      // Normalize to -360 to 360
      while (newRotation > 360) newRotation -= 360;
      while (newRotation < -360) newRotation += 360;

      updateComponentProps(componentId, {
        rotate: Math.round(newRotation),
      });
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

  // Position rotation handle above center, with line connecting
  const handleY = elementRect.top - 40;
  const handleX = centerX;

  return (
    <>
      {/* Line from center to rotation handle */}
      <div
        style={{
          position: 'absolute',
          left: `${centerX - 1}px`,
          top: `${elementRect.top}px`,
          width: '3px',
          height: '40px',
          backgroundColor: isDragging ? '#3b82f6' : isHovered ? '#60a5fa' : '#94a3b8',
          pointerEvents: 'none',
          zIndex: 45,
          transformOrigin: 'top center',
        }}
      />

      {/* Rotation Handle (LARGE Circular with Icon) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          setIsHovered(true);
          setMousePos({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e) => {
          if (!isDragging) {
            setMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isDragging) {
            setMousePos(null);
          }
        }}
        style={{
          position: 'absolute',
          left: `${handleX - 14}px`,
          top: `${handleY - 14}px`,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 48,
          transition: isDragging ? 'none' : 'all 0.15s ease',
          backgroundColor: isDragging ? '#2563eb' : isHovered ? '#3b82f6' : '#60a5fa',
          border: '3px solid white',
          boxShadow: isDragging
            ? '0 0 16px rgba(59, 130, 246, 0.8)'
            : '0 3px 8px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
        }}
        title="Drag to rotate (Shift: snap 15°)"
      >
        🔄
      </div>

      {/* Tooltip - Portal rendered for correct cursor-relative positioning */}
      {mousePos && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y + 10}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937', // Dark gray (gray-800) - 14.6:1 contrast with white
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)', // Subtle highlight
          }}
        >
          ↻ {currentRotation}°
          {isDragging && <span className="ml-1 text-gray-300">(Shift: snap 15°)</span>}
        </div>,
        document.body
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// SCALE HANDLE (4 corners)
// ═══════════════════════════════════════════════════════════════
type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface ScaleHandleProps {
  componentId: string;
  corner: Corner;
  elementRect: DOMRect;
  currentScaleX: number;
  currentScaleY: number;
}

function ScaleHandle({ componentId, corner, elementRect, currentScaleX, currentScaleY }: ScaleHandleProps) {
  const { updateComponentProps } = useCanvasStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = React.useRef<{ x: number; y: number; initialScaleX: number; initialScaleY: number } | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialScaleX: currentScaleX,
      initialScaleY: currentScaleY
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Throttle updates using requestAnimationFrame for smooth 60fps
      rafRef.current = requestAnimationFrame(() => {
        if (!dragStartRef.current) return;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        // Calculate scale change based on corner
        // Moving outward increases scale, inward decreases
        let scaleChangeX = 0;
        let scaleChangeY = 0;

        const scaleFactor = 0.01; // Sensitivity

        switch (corner) {
          case 'topLeft':
            scaleChangeX = -deltaX * scaleFactor;
            scaleChangeY = -deltaY * scaleFactor;
            break;
          case 'topRight':
            scaleChangeX = deltaX * scaleFactor;
            scaleChangeY = -deltaY * scaleFactor;
            break;
          case 'bottomLeft':
            scaleChangeX = -deltaX * scaleFactor;
            scaleChangeY = deltaY * scaleFactor;
            break;
          case 'bottomRight':
            scaleChangeX = deltaX * scaleFactor;
            scaleChangeY = deltaY * scaleFactor;
            break;
        }

        // Uniform scale if Shift is held
        if (e.shiftKey) {
          const avgChange = (scaleChangeX + scaleChangeY) / 2;
          scaleChangeX = avgChange;
          scaleChangeY = avgChange;
        }

        let newScaleX = Math.max(0.1, dragStartRef.current.initialScaleX + scaleChangeX);
        let newScaleY = Math.max(0.1, dragStartRef.current.initialScaleY + scaleChangeY);

        // NO rounding during drag for smooth animation
        updateComponentProps(componentId, {
          scaleX: newScaleX,
          scaleY: newScaleY,
        });
      });
    };

    const handleMouseUp = () => {
      // Final update with rounded values
      if (dragStartRef.current && window.event) {
        const deltaX = (window.event as MouseEvent).clientX - dragStartRef.current.x;
        const deltaY = (window.event as MouseEvent).clientY - dragStartRef.current.y;

        let scaleChangeX = 0;
        let scaleChangeY = 0;
        const scaleFactor = 0.01;

        switch (corner) {
          case 'topLeft':
            scaleChangeX = -deltaX * scaleFactor;
            scaleChangeY = -deltaY * scaleFactor;
            break;
          case 'topRight':
            scaleChangeX = deltaX * scaleFactor;
            scaleChangeY = -deltaY * scaleFactor;
            break;
          case 'bottomLeft':
            scaleChangeX = -deltaX * scaleFactor;
            scaleChangeY = deltaY * scaleFactor;
            break;
          case 'bottomRight':
            scaleChangeX = deltaX * scaleFactor;
            scaleChangeY = deltaY * scaleFactor;
            break;
        }

        let newScaleX = Math.max(0.1, dragStartRef.current.initialScaleX + scaleChangeX);
        let newScaleY = Math.max(0.1, dragStartRef.current.initialScaleY + scaleChangeY);

        // Round to 2 decimal places ONLY on mouseUp
        newScaleX = Math.round(newScaleX * 100) / 100;
        newScaleY = Math.round(newScaleY * 100) / 100;

        updateComponentProps(componentId, {
          scaleX: newScaleX,
          scaleY: newScaleY,
        });
      }

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

  // Position handle at corner
  const getPositionStyles = () => {
    const handleSize = 16; // INCREASED from 10 to 16
    const offset = -8; // Adjusted for larger size

    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      borderRadius: '3px',
      cursor: 'nwse-resize',
      zIndex: 47,
      transition: isDragging ? 'none' : 'all 0.15s ease',
      backgroundColor: isDragging ? '#10b981' : isHovered ? '#34d399' : '#6ee7b7',
      border: '3px solid white',
      boxShadow: isDragging
        ? '0 0 16px rgba(16, 185, 129, 0.7)'
        : '0 3px 8px rgba(0,0,0,0.3)',
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
          top: `${elementRect.top + offset}px`,
          left: `${elementRect.left + offset}px`,
          cursor: 'nwse-resize',
        };
      case 'topRight':
        return {
          ...baseStyles,
          top: `${elementRect.top + offset}px`,
          left: `${elementRect.right - handleSize - offset}px`,
          cursor: 'nesw-resize',
        };
      case 'bottomLeft':
        return {
          ...baseStyles,
          top: `${elementRect.bottom - handleSize - offset}px`,
          left: `${elementRect.left + offset}px`,
          cursor: 'nesw-resize',
        };
      case 'bottomRight':
        return {
          ...baseStyles,
          top: `${elementRect.bottom - handleSize - offset}px`,
          left: `${elementRect.right - handleSize - offset}px`,
          cursor: 'nwse-resize',
        };
    }
  };

  // Tooltip position - Brutalist dark style
  const getTooltipStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
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

    switch (corner) {
      case 'topLeft':
        return { ...baseStyles, top: '-28px', left: '0' };
      case 'topRight':
        return { ...baseStyles, top: '-28px', right: '0' };
      case 'bottomLeft':
        return { ...baseStyles, bottom: '-28px', left: '0' };
      case 'bottomRight':
        return { ...baseStyles, bottom: '-28px', right: '0' };
    }
  };

  return (
    <>
      {/* Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          setIsHovered(true);
          setMousePos({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={(e) => {
          if (!isDragging) {
            setMousePos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          if (!isDragging) {
            setMousePos(null);
          }
        }}
        style={getPositionStyles()}
      />

      {/* Tooltip - Portal rendered for correct cursor-relative positioning */}
      {mousePos && typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x}px`,
            top: `${mousePos.y + 10}px`,
            transform: 'translateX(-50%)',
            backgroundColor: '#1f2937', // Dark gray (gray-800) - 14.6:1 contrast with white
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)', // Subtle highlight
          }}
        >
          scale: {currentScaleX.toFixed(2)}×{currentScaleY.toFixed(2)}
          {isDragging && <span className="ml-1 text-gray-300">(Shift: uniform)</span>}
        </div>,
        document.body
      )}
    </>
  );
}
