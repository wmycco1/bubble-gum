// ═══════════════════════════════════════════════════════════════
// NEW PRODUCTS COMPONENT - M3 E-commerce
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Display newly added products
// Features:
// - Grid layout with "NEW" badge
// - Product cards with image/name/price
// - "Add to Cart" CTA button
// - Fresh/vibrant styling
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function NewProductsComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  const products = (props.products as ProductItem[] | undefined) || [];
  const columns = (props.columns as number) || 4;
  const title = (props.title as string) || 'New Arrivals';

  if (products.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">✨</div>
          <p className="text-sm font-medium">No new products</p>
          <p className="text-xs mt-1">Add products in the properties panel →</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>

      {/* Products Grid */}
      <div className={`grid gap-4 ${
        columns === 1 ? 'grid-cols-1' :
        columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
        columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
        columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
        columns === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' :
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
      }`}>
        {products.map((product) => (
          <div key={product.id} className="relative border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
            {/* NEW Badge */}
            <div className="absolute top-2 right-2 z-10">
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">
                NEW
              </span>
            </div>

            <div className="relative w-full h-40 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                }}
              />
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-green-600 mb-2">
                ${product.price.toFixed(2)}
              </p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
