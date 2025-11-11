'use client';

// ═══════════════════════════════════════════════════════════════
// COMPONENT TOOLBAR - Quick Actions + Visual Editing Modes
// ═══════════════════════════════════════════════════════════════
// V2.0: Added visual editing mode toggles (Spacing, Border Radius, Transform)
// Solves: Overlapping handles issue - now one mode active at a time
// Inspired by: Figma/Webflow contextual editing
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import type { EditingMode } from '@/lib/editor/types';

interface ComponentToolbarProps {
  componentId: string;
  position?: 'top' | 'top-right';
}

export function ComponentToolbar({ componentId, position = 'top-right' }: ComponentToolbarProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const duplicateComponent = useCanvasStore((state) => state.duplicateComponent);
  const deleteComponent = useCanvasStore((state) => state.deleteComponent);

  // Visual editing mode state
  const visualEditingMode = useCanvasStore((state) => state.visualEditingMode);
  const setVisualEditingMode = useCanvasStore((state) => state.setVisualEditingMode);

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

  const handleModeToggle = (mode: EditingMode) => (e: React.MouseEvent) => {
    e.stopPropagation();
    // Toggle: if same mode clicked, set to 'none', else activate new mode
    setVisualEditingMode(visualEditingMode === mode ? 'none' : mode);
  };

  const positionClasses = position === 'top'
    ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-full'
    : 'top-0 right-0 -translate-y-full';

  // ═══════════════════════════════════════════════════════════════
  // VISUAL EDITING MODE TOGGLES (NEW!)
  // ═══════════════════════════════════════════════════════════════
  const editingModes = [
    {
      id: 'spacing',
      mode: 'spacing' as EditingMode,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      label: 'Spacing (M/P)',
      description: 'Edit margin & padding',
    },
    {
      id: 'borderRadius',
      mode: 'borderRadius' as EditingMode,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: 'Border Radius',
      description: 'Edit corner roundness',
    },
    {
      id: 'transform',
      mode: 'transform' as EditingMode,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: 'Transform',
      description: 'Rotate & scale',
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  // QUICK ACTIONS (Duplicate, Copy, Delete)
  // ═══════════════════════════════════════════════════════════════
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
      {/* Toolbar with Visual Editing Modes + Quick Actions */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg shadow-lg px-1.5 py-1.5">
        {/* ═══════════════════════════════════════════════════════════════
            VISUAL EDITING MODE TOGGLES
            ═══════════════════════════════════════════════════════════════ */}
        {editingModes.map((modeConfig) => {
          const isActive = visualEditingMode === modeConfig.mode;
          return (
            <div key={modeConfig.id} className="relative">
              <button
                onClick={handleModeToggle(modeConfig.mode)}
                onMouseEnter={() => setShowTooltip(modeConfig.id)}
                onMouseLeave={() => setShowTooltip(null)}
                className={`
                  p-1.5 rounded transition-all duration-150
                  ${isActive
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100'
                  }
                  hover:scale-110 active:scale-95
                `}
                aria-label={modeConfig.label}
                aria-pressed={isActive}
              >
                {modeConfig.icon}
              </button>

              {/* Tooltip */}
              {showTooltip === modeConfig.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap pointer-events-none z-[100]">
                  {modeConfig.label}
                  <div className="text-slate-400 text-[10px] mt-0.5">{modeConfig.description}</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-4 border-transparent border-t-slate-900" />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Divider between editing modes and actions */}
        <div className="w-px h-6 bg-slate-200 mx-0.5" />

        {/* ═══════════════════════════════════════════════════════════════
            QUICK ACTIONS (Duplicate, Copy, Delete)
            ═══════════════════════════════════════════════════════════════ */}
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
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap pointer-events-none z-[100]">
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
