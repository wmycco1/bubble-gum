// ═══════════════════════════════════════════════════════════════
// FEATURES COMPONENT - God-Tier 2025
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Granular Styles Support
// NEW (v2.0.0): Element-level styling (wrapper, header, title, description, icon, feature)
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent, ComponentStyles } from '@/lib/editor/types';
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

  // Get granular styles (God-Tier 2025)
  const styles = (props.styles as ComponentStyles | undefined) || {};

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('bg-white px-8 py-16', style);

  const wrapperStyle = {
    ...(style as React.CSSProperties),
    ...styles.wrapper,
  };

  return (
    <section className={wrapperClassName} style={wrapperStyle}>
      <div className="mx-auto max-w-7xl">
        {/* Section Title */}
        <h2
          className="mb-12 text-center text-3xl font-bold text-slate-900"
          style={styles.header}
        >
          {title}
        </h2>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              style={styles.feature}
            >
              {/* Icon */}
              {feature.icon && (
                <div className="mb-4 text-4xl" style={styles.icon}>
                  {feature.icon}
                </div>
              )}

              {/* Title */}
              <h3
                className="mb-2 text-xl font-semibold text-slate-900"
                style={styles.title}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600" style={styles.description}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
