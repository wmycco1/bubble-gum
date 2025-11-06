// BannerSlider Component
'use client';
import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
export function BannerSliderComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const slides = (props.slides as Array<{id: string; image: string; title?: string}>) || [];
  const [current, setCurrent] = useState(0);
  return <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
    {slides[current] && <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />}
    <button onClick={() => setCurrent((current - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full">←</button>
    <button onClick={() => setCurrent((current + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full">→</button>
  </div>;
}
