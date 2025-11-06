// Testimonial Component
import type { CanvasComponent } from '@/lib/editor/types';
export function TestimonialComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const quote = props.quote as string || 'Great product!';
  const author = props.author as string || 'John Doe';
  const role = props.role as string;
  return <div className="bg-white p-6 rounded-lg shadow-md"><p className="text-lg mb-4">"{quote}"</p><div className="font-semibold">{author}</div>{role && <div className="text-sm text-gray-600">{role}</div>}</div>;
}
