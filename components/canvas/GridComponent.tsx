// ═══════════════════════════════════════════════════════════════
// GRID COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Responsive grid layout with children support
// Features: 3-column grid (default), responsive
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface GridComponentProps {
  component: CanvasComponent;
}

export function GridComponent({ component }: GridComponentProps) {
  const { style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border-2 border-dashed border-slate-300 rounded-lg min-h-[200px] bg-slate-50"
      style={style as React.CSSProperties}
    >
      {children && children.length > 0 ? (
        children.map((child) => (
          <RenderComponent
            key={child.id}
            component={child}
            isSelected={child.id === selectedComponentId}
          />
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center text-sm text-slate-400 py-8">
          Drop components here for grid layout
        </div>
      )}
    </div>
  );
}
