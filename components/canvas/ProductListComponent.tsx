// ProductList Component
import type { CanvasComponent } from '@/lib/editor/types';
export function ProductListComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const products = (props.products as Array<{id: string; name: string; price: number; image: string}>) || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map(p => (
        <div key={p.id} className="border rounded-lg p-4">
          <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded mb-2" />
          <h3 className="font-semibold">{p.name}</h3>
          <p className="text-lg text-green-600">${p.price}</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded w-full">Add to Cart</button>
        </div>
      ))}
    </div>
  );
}
