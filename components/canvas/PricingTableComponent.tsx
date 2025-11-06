// ═══════════════════════════════════════════════════════════════
// PRICING TABLE COMPONENT - M3 E-commerce
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Professional pricing tiers display
// Features:
// - Multiple pricing tiers (Free/Starter/Pro/Enterprise)
// - Featured/Popular tier highlighting
// - Feature lists with checkmarks
// - CTA buttons per tier
// - Responsive grid layout
// - High-conversion 2025 design
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted: boolean;
}

export function PricingTableComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;

  // Get pricing tiers from props
  const tiers = (props.tiers as PricingTier[] | undefined) || [];

  // Empty state
  if (tiers.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-sm font-medium">No pricing tiers added</p>
          <p className="text-xs mt-1">Add pricing tiers in the properties panel →</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      {/* Grid layout - responsive */}
      <div className={`
        grid gap-6 mx-auto max-w-7xl
        ${tiers.length === 1 ? 'grid-cols-1 max-w-md' : ''}
        ${tiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' : ''}
        ${tiers.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-6xl' : ''}
        ${tiers.length >= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : ''}
      `}>
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`
              relative rounded-2xl border-2 p-8 transition-all duration-200
              ${tier.highlighted
                ? 'border-blue-500 bg-blue-50 shadow-xl scale-105 z-10'
                : 'border-slate-200 bg-white hover:shadow-lg'
              }
            `}
          >
            {/* Popular Badge */}
            {tier.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  MOST POPULAR
                </span>
              </div>
            )}

            {/* Tier Name */}
            <h3 className={`text-xl font-bold mb-2 ${tier.highlighted ? 'text-blue-900' : 'text-slate-900'}`}>
              {tier.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 mb-6">
              {tier.description}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className={`text-5xl font-bold ${tier.highlighted ? 'text-blue-900' : 'text-slate-900'}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-slate-600 text-sm">/{tier.period}</span>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className={`
                w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
                ${tier.highlighted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105'
                }
              `}
            >
              {tier.buttonText}
            </button>

            {/* Features List */}
            <ul className="mt-8 space-y-3">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.highlighted ? 'text-blue-600' : 'text-green-600'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-slate-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
