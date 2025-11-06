'use client';

// ═══════════════════════════════════════════════════════════════
// COMPONENT TOOLBAR - Quick Actions (God-Tier 2025)
// ═══════════════════════════════════════════════════════════════
// Floating toolbar with Duplicate, Copy, Delete actions
// Shows on hover or when component is selected
// High-conversion UX with tooltips and hotkeys
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface ComponentToolbarProps {
  componentId: string;
  position?: 'top' | 'top-right';
}

export function ComponentToolbar({ componentId, position = 'top-right' }: ComponentToolbarProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const duplicateComponent = useCanvasStore((state) => state.duplicateComponent);
  const deleteComponent = useCanvasStore((state) => state.deleteComponent);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateComponent(componentId);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement clipboard copy
    console.log('Copy to clipboard:', componentId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteComponent(componentId);
  };

  const positionClasses = position === 'top'
    ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-full'
    : 'top-0 right-0 -translate-y-full';

  const actions = [
    {
      id: 'duplicate',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Duplicate',
      hotkey: 'Ctrl+D',
      onClick: handleDuplicate,
      color: 'hover:bg-blue-50 hover:text-blue-600',
    },
    {
      id: 'copy',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      label: 'Copy',
      hotkey: 'Ctrl+C',
      onClick: handleCopy,
      color: 'hover:bg-green-50 hover:text-green-600',
    },
    {
      id: 'delete',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      label: 'Delete',
      hotkey: 'Del',
      onClick: handleDelete,
      color: 'hover:bg-red-50 hover:text-red-600',
    },
  ];

  return (
    <div
      className={`absolute ${positionClasses} mb-2 z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-lg px-1.5 py-1.5">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <button
              onClick={action.onClick}
              onMouseEnter={() => setShowTooltip(action.id)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                p-1.5 rounded transition-all duration-150
                text-slate-600 ${action.color}
                hover:scale-110 active:scale-95
              `}
              aria-label={action.label}
            >
              {action.icon}
            </button>

            {/* Tooltip */}
            {showTooltip === action.id && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap pointer-events-none">
                {action.label}
                <span className="text-slate-400 ml-1.5">({action.hotkey})</span>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-slate-900" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
