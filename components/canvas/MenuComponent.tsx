// Menu Component
import type { CanvasComponent } from '@/lib/editor/types';
export function MenuComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const items = (props.items as Array<{id: string; label: string; href?: string}>) || [];
  return <nav className="flex gap-6">{items.map(item => (
    <a key={item.id} href={item.href || '#'} className="hover:text-blue-600 transition">{item.label}</a>
  ))}</nav>;
}
