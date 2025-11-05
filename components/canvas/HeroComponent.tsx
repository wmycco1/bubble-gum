// ═══════════════════════════════════════════════════════════════
// HERO COMPONENT
// ═══════════════════════════════════════════════════════════════
// Hero section with title, subtitle, and CTA
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface HeroComponentProps {
  component: CanvasComponent;
}

export function HeroComponent({ component }: HeroComponentProps) {
  const { props, style } = component;

  const title = (props.title as string) || 'Welcome to Our Platform';
  const subtitle = (props.subtitle as string) || 'Build amazing products with our tools';
  const ctaText = (props.ctaText as string) || 'Get Started';
  const ctaLink = (props.ctaLink as string) || '#';

  return (
    <section
      className="flex min-h-[500px] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-20"
      style={style as React.CSSProperties}
    >
      <div className="max-w-4xl text-center">
        {/* Title */}
        <h1 className="mb-6 text-5xl font-bold text-slate-900">{title}</h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mb-8 text-xl text-slate-600">{subtitle}</p>
        )}

        {/* CTA Button */}
        {ctaText && (
          <a
            href={ctaLink}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
