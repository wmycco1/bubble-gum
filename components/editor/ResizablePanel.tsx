'use client';

// ═══════════════════════════════════════════════════════════════
// RESIZABLE PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Advanced UX Enhancement
// Features:
// - Draggable resize handles
// - Collapsible with smooth animations
// - localStorage persistence
// - Min/max width constraints
// - Touch-friendly drag area
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

interface ResizablePanelProps {
  /** Unique ID for localStorage persistence */
  id: string;
  /** Panel content */
  children: ReactNode;
  /** Initial width in pixels */
  defaultWidth?: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Position of the panel */
  position: 'left' | 'right';
  /** CSS class name */
  className?: string;
  /** Show collapse button */
  collapsible?: boolean;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
}

const STORAGE_KEY_PREFIX = 'bubble-gum-panel-';

export function ResizablePanel({
  id,
  children,
  defaultWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  position,
  className = '',
  collapsible = true,
  defaultCollapsed = false,
}: ResizablePanelProps) {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // State Management with localStorage
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const [width, setWidth] = useState<number>(() => {
    if (typeof window === 'undefined') return defaultWidth;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.width || defaultWidth;
      }
    } catch (error) {
      console.error('Failed to load panel state:', error);
    }
    return defaultWidth;
  });

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return defaultCollapsed;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.collapsed ?? defaultCollapsed;
      }
    } catch (error) {
      console.error('Failed to load panel state:', error);
    }
    return defaultCollapsed;
  });

  const [isResizing, setIsResizing] = useState(false);

  // Refs
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Persist state to localStorage
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  useEffect(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${id}`,
        JSON.stringify({ width, collapsed: isCollapsed })
      );
    } catch (error) {
      console.error('Failed to save panel state:', error);
    }
  }, [id, width, isCollapsed]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Resize Handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;

    console.log('📏 Resize started:', { startX: e.clientX, startWidth: width });
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = position === 'left'
      ? e.clientX - startXRef.current
      : startXRef.current - e.clientX;

    const newWidth = Math.min(
      Math.max(startWidthRef.current + deltaX, minWidth),
      maxWidth
    );

    setWidth(newWidth);
  }, [isResizing, position, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    setIsResizing(false);
    console.log('✅ Resize ended:', width);
  }, [isResizing, width]);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
    return undefined;
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Collapse Handlers
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    console.log('🔄 Panel collapsed:', !isCollapsed);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Render
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const collapsedWidth = 40; // Width when collapsed (just show button)

  return (
    <div
      ref={panelRef}
      className={`relative flex-shrink-0 bg-white border-slate-200 transition-all duration-300 ease-in-out ${className}`}
      style={{
        width: isCollapsed ? `${collapsedWidth}px` : `${width}px`,
        borderLeftWidth: position === 'right' ? '1px' : '0',
        borderRightWidth: position === 'left' ? '1px' : '0',
      }}
    >
      {/* Collapse Button */}
      {collapsible && (
        <button
          onClick={toggleCollapse}
          className={`absolute top-4 z-10 flex items-center justify-center w-6 h-6 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition-colors ${
            position === 'left' ? '-right-3' : '-left-3'
          }`}
          title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {position === 'left' ? (
            isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />
          ) : (
            isCollapsed ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
          )}
        </button>
      )}

      {/* Panel Content */}
      <div
        className={`h-full overflow-hidden transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {/* Resize Handle */}
      {!isCollapsed && (
        <div
          className={`absolute top-0 bottom-0 w-1 hover:w-2 cursor-col-resize group transition-all ${
            position === 'left' ? '-right-0.5' : '-left-0.5'
          }`}
          onMouseDown={handleResizeStart}
        >
          {/* Visual indicator */}
          <div
            className={`absolute inset-0 bg-slate-300 opacity-0 group-hover:opacity-100 transition-opacity ${
              isResizing ? 'opacity-100 bg-blue-500' : ''
            }`}
          />

          {/* Grip icon (center) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-white border border-slate-300 rounded-sm p-0.5 shadow-sm">
              <GripVertical className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
      )}

      {/* Resizing Overlay (prevent interference with canvas during resize) */}
      {isResizing && (
        <div className="fixed inset-0 z-50 cursor-col-resize" style={{ background: 'transparent' }} />
      )}
    </div>
  );
}
