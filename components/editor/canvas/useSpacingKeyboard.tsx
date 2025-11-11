'use client';

/**
 * useSpacingKeyboard - Keyboard shortcuts for spacing control
 *
 * Shortcuts:
 * - Arrow keys: Adjust individual sides (↑↓ = top/bottom, ←→ = left/right)
 * - Shift + Arrow: Adjust all sides together
 * - Alt + Arrow: Larger step (10px instead of 1px)
 * - Ctrl/Cmd + Arrow: Smaller step (0.5px for fine-tuning)
 */

import { useEffect } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

type SpacingMode = 'margin' | 'padding';

interface UseSpacingKeyboardOptions {
  mode: SpacingMode;
  enabled?: boolean;
}

export function useSpacingKeyboard({ mode, enabled = true }: UseSpacingKeyboardOptions) {
  const { selectedComponentId, components, updateComponentProps } = useCanvasStore();

  useEffect(() => {
    if (!enabled || !selectedComponentId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle arrow keys
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }

      // Don't interfere if user is typing in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const selectedComponent = components.find(c => c.id === selectedComponentId);
      if (!selectedComponent) return;

      e.preventDefault();

      const props = selectedComponent.props || {};
      const prefix = mode; // 'margin' or 'padding'

      // Determine step size
      let step = 1;
      if (e.altKey) step = 10; // Large step
      if (e.metaKey || e.ctrlKey) step = 0.5; // Fine-tuning

      // Determine which side(s) to adjust
      let updates: Record<string, number | undefined> = {};

      if (e.shiftKey) {
        // Shift + Arrow = All sides
        const currentValue = props[prefix] ?? 0;
        let newValue = currentValue;

        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          newValue = Math.max(0, currentValue - step);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          newValue = currentValue + step;
        }

        // Clear individual sides and set shorthand
        updates = {
          [prefix]: Math.round(newValue * 10) / 10, // Round to 1 decimal
          [`${prefix}Top`]: undefined,
          [`${prefix}Right`]: undefined,
          [`${prefix}Bottom`]: undefined,
          [`${prefix}Left`]: undefined,
        };
      } else {
        // Individual side adjustment
        let side: 'Top' | 'Right' | 'Bottom' | 'Left' | null = null;

        if (e.key === 'ArrowUp') side = 'Top';
        else if (e.key === 'ArrowDown') side = 'Bottom';
        else if (e.key === 'ArrowLeft') side = 'Left';
        else if (e.key === 'ArrowRight') side = 'Right';

        if (side) {
          const currentValue = props[`${prefix}${side}`] ?? props[prefix] ?? 0;
          let newValue = currentValue;

          // Up/Left = decrease, Down/Right = increase
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            newValue = Math.max(0, currentValue - step);
          } else {
            newValue = currentValue + step;
          }

          updates = {
            [`${prefix}${side}`]: Math.round(newValue * 10) / 10, // Round to 1 decimal
          };
        }
      }

      if (Object.keys(updates).length > 0) {
        updateComponentProps(selectedComponentId, updates);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, selectedComponentId, components, mode, updateComponentProps]);
}
