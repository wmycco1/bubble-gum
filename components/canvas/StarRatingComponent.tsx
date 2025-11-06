// StarRating Component
import type { CanvasComponent } from '@/lib/editor/types';
export function StarRatingComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const rating = (props.rating as number) || 0;
  const maxRating = (props.maxRating as number) || 5;
  return <div className="flex gap-1">{Array.from({length: maxRating}, (_, i) => (
    <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
  ))}</div>;
}
