// ═══════════════════════════════════════════════════════════════
// FEATURES COMPONENT
// ═══════════════════════════════════════════════════════════════
// Features grid section
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface FeaturesComponentProps {
  component: CanvasComponent;
}

interface Feature {
  icon?: string;
  title: string;
  description: string;
}

export function FeaturesComponent({ component }: FeaturesComponentProps) {
  const { props, style } = component;

  const title = (props.title as string) || 'Our Features';
  const features = (props.features as Feature[]) || [
    {
      icon: '🚀',
      title: 'Fast Performance',
      description: 'Lightning-fast load times and smooth interactions',
    },
    {
      icon: '🔒',
      title: 'Secure',
      description: 'Enterprise-grade security to protect your data',
    },
    {
      icon: '⚡',
      title: 'Powerful',
      description: 'Advanced features to boost your productivity',
    },
  ];

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('bg-white px-8 py-16', style);

  return (
    <section className={wrapperClassName} style={style as React.CSSProperties}>
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          {title}
        </h2>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
            >
              {/* Icon */}
              {feature.icon && (
                <div className="mb-4 text-4xl">{feature.icon}</div>
              )}

              {/* Title */}
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
