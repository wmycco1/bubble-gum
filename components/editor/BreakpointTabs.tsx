'use client';

// ═══════════════════════════════════════════════════════════════
// BREAKPOINT TABS - Responsive Style Editor
// ═══════════════════════════════════════════════════════════════
// Enterprise-grade breakpoint switcher for responsive design
// Features: Desktop/Tablet/Mobile tabs, visual indicators
// ═══════════════════════════════════════════════════════════════

import { useCanvasStore } from '@/lib/editor/canvas-store';
import { BREAKPOINTS, type Breakpoint } from '@/lib/editor/types';
import { cn } from '@/lib/utils/cn';

export function BreakpointTabs() {
  const deviceMode = useCanvasStore((state) => state.deviceMode);
  const setDeviceMode = useCanvasStore((state) => state.setDeviceMode);

  const breakpoints: Breakpoint[] = ['desktop', 'tablet', 'mobile'];

  return (
    <div className="flex flex-col gap-2 p-4 border-b border-slate-200 bg-slate-50">
      <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {breakpoints.map((breakpoint) => {
          const isActive = deviceMode === breakpoint;
          const config = BREAKPOINTS[breakpoint];

          return (
            <button
              key={breakpoint}
              onClick={() => setDeviceMode(breakpoint)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all',
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
              title={`${config.label} (${config.min}px+)`}
            >
              <span className="text-base">{config.icon}</span>
              <span className="hidden sm:inline">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div className="text-xs text-slate-600">
        <p>
          💡 Styles inherit:{' '}
          <span className="font-mono text-slate-900">
            mobile → tablet → desktop
          </span>
        </p>
      </div>
    </div>
  );
}
