// ═══════════════════════════════════════════════════════════════
// CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Content card with children support
// Features: Shadow, border, padding, can contain other components
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { RenderComponent } from '@/components/editor/RenderComponent';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface CardComponentProps {
  component: CanvasComponent;
}

export function CardComponent({ component }: CardComponentProps) {
  const { style, children } = component;
  const selectedComponentId = useCanvasStore((state) => state.selectedComponentId);

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow min-h-[150px]"
      style={style as React.CSSProperties}
    >
      {children && children.length > 0 ? (
        <div className="space-y-4">
          {children.map((child) => (
            <RenderComponent
              key={child.id}
              component={child}
              isSelected={child.id === selectedComponentId}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-sm text-slate-400 py-8">
          Drop components here
        </div>
      )}
    </div>
  );
}
