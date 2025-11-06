// MultistepFormBuilder Component - M3 Extended Library
import type { CanvasComponent } from '@/lib/editor/types';

export function MultistepFormBuilderComponent({ component }: { component: CanvasComponent }) {
  return (
    <div className="p-4 border rounded bg-gray-50">
      <p className="text-gray-600">MultistepFormBuilder - Implementation Placeholder</p>
      <pre className="text-xs mt-2">{JSON.stringify(component.props, null, 2)}</pre>
    </div>
  );
}
