// SoundCloud Component
import type { CanvasComponent } from '@/lib/editor/types';
export function SoundCloudComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const url = props.url as string;
  return <div className="bg-gray-100 p-4 rounded"><p>SoundCloud: {url || 'No URL'}</p></div>;
}
