// Slider Component
import type { CanvasComponent } from '@/lib/editor/types';
export function SliderComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const items = (props.items as Array<{id: string; content: string}>) || [];
  return <div className="flex gap-4 overflow-x-auto">{items.map(i => (
    <div key={i.id} className="min-w-[200px] bg-gray-100 p-4 rounded">{i.content}</div>
  ))}</div>;
}
