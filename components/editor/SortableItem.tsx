'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative">
      {/* Drag Handle - only this area is draggable */}
      <button
        {...listeners}
        className="absolute left-2 top-2 z-10 flex h-6 w-6 cursor-move items-center justify-center rounded bg-slate-200 opacity-0 transition-opacity hover:bg-slate-300 group-hover:opacity-100"
        aria-label="Drag to reorder"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="1" fill="currentColor" />
          <circle cx="3" cy="6" r="1" fill="currentColor" />
          <circle cx="3" cy="9" r="1" fill="currentColor" />
          <circle cx="9" cy="3" r="1" fill="currentColor" />
          <circle cx="9" cy="6" r="1" fill="currentColor" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
        </svg>
      </button>
      {children}
    </div>
  );
}
