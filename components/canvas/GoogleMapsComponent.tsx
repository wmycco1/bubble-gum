// GoogleMaps Component
import type { CanvasComponent } from '@/lib/editor/types';
export function GoogleMapsComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const address = props.address as string || 'New York';
  const height = props.height as string || '400px';
  return <div style={{height}} className="bg-gray-200 flex items-center justify-center rounded">
    <p className="text-gray-500">Map: {address}</p>
  </div>;
}
