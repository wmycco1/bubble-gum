// ═══════════════════════════════════════════════════════════════
// CONTAINER COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Layout wrapper with children support
// Features: Padding, border, can contain other components
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface ContainerComponentProps {
  component: CanvasComponent;
}

export function ContainerComponent({ component }: ContainerComponentProps) {
  const { style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  return (
    <div
      className="flex flex-col gap-4 p-6 border-2 border-dashed border-slate-300 rounded-lg min-h-[150px] bg-slate-50"
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
        <div className="flex items-center justify-center text-sm text-slate-400 py-8">
          Drop components here
        </div>
      )}
    </div>
  );
}
