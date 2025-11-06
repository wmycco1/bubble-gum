// Toggle Component
'use client';
import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
export function ToggleComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const items = (props.items as Array<{id: string; trigger: string; content: string}>) || [];
  const [open, setOpen] = useState<string[]>([]);
  return <div className="space-y-2">{items.map(item => (
    <div key={item.id} className="border rounded">
      <button onClick={() => setOpen(open.includes(item.id) ? open.filter(i => i !== item.id) : [...open, item.id])} className="w-full p-3 text-left font-medium">{item.trigger}</button>
      {open.includes(item.id) && <div className="p-3 border-t">{item.content}</div>}
    </div>
  ))}</div>;
}
