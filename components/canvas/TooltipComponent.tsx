// ═══════════════════════════════════════════════════════════════
// TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Tooltip with positioning (top, bottom, left, right)
// - Trigger types (hover, click, focus)
// - Delay support
// - Arrow indicator
// - Dark/light themes
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';

interface TooltipComponentProps {
  component: CanvasComponent;
}

export function TooltipComponent({ component }: TooltipComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const text = (props.text as string) || 'Hover me';
  const content = (props.content as string) || 'This is a tooltip';
  const placement = (props.placement as 'top' | 'bottom' | 'left' | 'right') || 'top';
  const trigger = (props.trigger as 'hover' | 'click' | 'focus') || 'hover';
  const delay = (props.delay as number) ?? 200;

  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleShow = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  const handleToggle = () => {
    if (showTooltip) {
      handleHide();
    } else {
      handleShow();
    }
  };

  // Event handlers based on trigger type
  const getEventHandlers = () => {
    switch (trigger) {
      case 'click':
        return { onClick: handleToggle };
      case 'focus':
        return { onFocus: handleShow, onBlur: handleHide };
      default: // hover
        return { onMouseEnter: handleShow, onMouseLeave: handleHide };
    }
  };

  // Tooltip positioning
  const getTooltipPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
    }
  };

  // Arrow positioning
  const getArrowPosition = () => {
    switch (placement) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent';
    }
  };

  // Base wrapper className
  const baseClassName = 'relative inline-block';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  return (
    <div className={wrapperClassName} style={cleanedStyle as React.CSSProperties}>
      {/* Trigger Element */}
      <span
        className="cursor-pointer text-blue-600 hover:text-blue-800 border-b border-dashed border-blue-600"
        {...getEventHandlers()}
        tabIndex={0}
      >
        {text}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute ${getTooltipPosition()} z-50 px-3 py-2 text-sm text-white bg-slate-900 rounded-md shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-200`}
          role="tooltip"
        >
          {content}

          {/* Arrow */}
          <div
            className={`absolute ${getArrowPosition()} w-0 h-0 border-4`}
          />
        </div>
      )}
    </div>
  );
}
