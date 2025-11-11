'use client';

/**
 * SpacingHandles - Interactive spacing controls for selected component
 *
 * Features:
 * - 4 side handles (top, right, bottom, left)
 * - 1 center handle (all sides)
 * - Visual spacing preview
 * - Real-time updates to canvas-store
 * - Support for margin and padding modes
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { SpacingHandle } from './SpacingHandle';
import { useSpacingKeyboard } from './useSpacingKeyboard';

type SpacingMode = 'margin' | 'padding';

interface SpacingHandlesProps {
  mode?: SpacingMode;
}

export function SpacingHandles({ mode = 'margin' }: SpacingHandlesProps) {
  const { selectedComponentId, components, updateComponentProps } = useCanvasStore();
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);
  const [spacingMode, setSpacingMode] = useState<SpacingMode>(mode);
  const rafRef = useRef<number | null>(null);

  // Enable keyboard shortcuts for spacing control
  useSpacingKeyboard({ mode: spacingMode, enabled: !!selectedComponentId });

  // Get selected component
  const selectedComponent = components.find(c => c.id === selectedComponentId);

  // Update element rect on component selection or resize
  useEffect(() => {
    if (!selectedComponentId) {
      setElementRect(null);
      return;
    }

    const updateRect = () => {
      // Find element by data-component-id attribute
      const element = document.querySelector(`[data-component-id="${selectedComponentId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setElementRect(rect);
      }
    };

    // Initial update
    updateRect();

    // Update on resize/scroll
    const handleUpdate = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateRect);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    // Observe DOM changes (for component updates)
    const observer = new MutationObserver(handleUpdate);
    const canvas = document.querySelector('[data-canvas-container]');
    if (canvas) {
      observer.observe(canvas, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [selectedComponentId]);

  if (!selectedComponent || !elementRect) {
    return null;
  }

  // Get current spacing values
  const props = selectedComponent.props || {};
  const prefix = spacingMode; // 'margin' or 'padding'

  const topValue = props[`${prefix}Top`] ?? props[prefix] ?? 0;
  const rightValue = props[`${prefix}Right`] ?? props[prefix] ?? 0;
  const bottomValue = props[`${prefix}Bottom`] ?? props[prefix] ?? 0;
  const leftValue = props[`${prefix}Left`] ?? props[prefix] ?? 0;
  const allSidesValue = props[prefix] ?? 0;

  // Check if individual sides are set
  const hasIndividualSides =
    props[`${prefix}Top`] !== undefined ||
    props[`${prefix}Right`] !== undefined ||
    props[`${prefix}Bottom`] !== undefined ||
    props[`${prefix}Left`] !== undefined;

  // Calculate handle positions
  const centerX = elementRect.left + elementRect.width / 2;
  const centerY = elementRect.top + elementRect.height / 2;

  const handles = {
    top: { x: centerX, y: elementRect.top },
    right: { x: elementRect.right, y: centerY },
    bottom: { x: centerX, y: elementRect.bottom },
    left: { x: elementRect.left, y: centerY },
    center: { x: centerX, y: centerY },
  };

  // Handle value changes
  const handleSideChange = (side: 'Top' | 'Right' | 'Bottom' | 'Left', value: number) => {
    updateComponentProps(selectedComponent.id, {
      [`${prefix}${side}`]: value,
    });
  };

  const handleAllSidesChange = (value: number) => {
    // Clear individual sides and set shorthand
    updateComponentProps(selectedComponent.id, {
      [prefix]: value,
      [`${prefix}Top`]: undefined,
      [`${prefix}Right`]: undefined,
      [`${prefix}Bottom`]: undefined,
      [`${prefix}Left`]: undefined,
    });
  };

  return (
    <>
      {/* Visual spacing preview */}
      <div
        style={{
          position: 'fixed',
          left: elementRect.left - (spacingMode === 'margin' ? leftValue : 0),
          top: elementRect.top - (spacingMode === 'margin' ? topValue : 0),
          width: elementRect.width + (spacingMode === 'margin' ? leftValue + rightValue : 0),
          height: elementRect.height + (spacingMode === 'margin' ? topValue + bottomValue : 0),
          border: '1px dashed #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          pointerEvents: 'none',
          zIndex: 99,
        }}
      />

      {/* Mode Toggle */}
      <div
        style={{
          position: 'fixed',
          left: elementRect.left,
          top: elementRect.top - 40,
          zIndex: 1002,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '4px',
            backgroundColor: 'white',
            borderRadius: '6px',
            padding: '2px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={() => setSpacingMode('margin')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: spacingMode === 'margin' ? '#3b82f6' : 'transparent',
              color: spacingMode === 'margin' ? 'white' : '#6b7280',
              transition: 'all 0.15s ease',
            }}
          >
            Margin
          </button>
          <button
            onClick={() => setSpacingMode('padding')}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: spacingMode === 'padding' ? '#3b82f6' : 'transparent',
              color: spacingMode === 'padding' ? 'white' : '#6b7280',
              transition: 'all 0.15s ease',
            }}
          >
            Padding
          </button>
        </div>
      </div>

      {/* Side Handles */}
      <SpacingHandle
        position="top"
        value={topValue}
        onValueChange={(value) => handleSideChange('Top', value)}
        x={handles.top.x}
        y={handles.top.y}
        snapToGrid={4}
      />

      <SpacingHandle
        position="right"
        value={rightValue}
        onValueChange={(value) => handleSideChange('Right', value)}
        x={handles.right.x}
        y={handles.right.y}
        snapToGrid={4}
      />

      <SpacingHandle
        position="bottom"
        value={bottomValue}
        onValueChange={(value) => handleSideChange('Bottom', value)}
        x={handles.bottom.x}
        y={handles.bottom.y}
        snapToGrid={4}
      />

      <SpacingHandle
        position="left"
        value={leftValue}
        onValueChange={(value) => handleSideChange('Left', value)}
        x={handles.left.x}
        y={handles.left.y}
        snapToGrid={4}
      />

      {/* Center Handle (All Sides) */}
      <SpacingHandle
        position="center"
        value={allSidesValue}
        onValueChange={handleAllSidesChange}
        x={handles.center.x}
        y={handles.center.y}
        snapToGrid={8}
      />

      {/* Instructions */}
      <div
        style={{
          position: 'fixed',
          left: elementRect.left,
          top: elementRect.bottom + 10,
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          pointerEvents: 'none',
          zIndex: 1002,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          maxWidth: '350px',
          lineHeight: '1.5',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '4px' }}>
          🎛️ Spacing Controls ({spacingMode})
        </div>
        <div style={{ opacity: 0.85 }}>
          🖱️ Drag handles • Center = all sides
        </div>
        <div style={{ opacity: 0.85 }}>
          ⌨️ Arrows = sides • Shift+Arrows = all
        </div>
        <div style={{ opacity: 0.7, fontSize: '10px', marginTop: '2px' }}>
          Alt = 10px step • Shift (drag) = snap to grid
        </div>
      </div>
    </>
  );
}
