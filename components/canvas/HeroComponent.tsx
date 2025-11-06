// ═══════════════════════════════════════════════════════════════
// HERO COMPONENT - God-Tier 2025
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Granular Styles Support
// NEW (v2.0.0):
// - ✅ Granular styles (wrapper, title, subtitle, button)
// - ✅ Element-level customization
// Previous: Hero section with title, subtitle, and CTA
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent, ComponentStyles } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface HeroComponentProps {
  component: CanvasComponent;
}

export function HeroComponent({ component }: HeroComponentProps) {
  const { props, style } = component;

  const title = (props.title as string) || 'Welcome to Our Platform';
  const subtitle = (props.subtitle as string) || 'Build amazing products with our tools';
  const ctaText = (props.ctaText as string) || 'Get Started';
  const ctaLink = (props.ctaLink as string) || '#';

  // Get granular styles (God-Tier 2025)
  const styles = (props.styles as ComponentStyles | undefined) || {};

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing(
    'flex min-h-[500px] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-20',
    style
  );

  // Merge base styles with wrapper granular styles
  const wrapperStyle = {
    ...(style as React.CSSProperties),
    ...styles.wrapper,
  };

  return (
    <section className={wrapperClassName} style={wrapperStyle}>
      <div className="max-w-4xl text-center">
        {/* Title */}
        <h1
          className="mb-6 text-5xl font-bold text-slate-900"
          style={styles.title}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mb-8 text-xl text-slate-600"
            style={styles.subtitle}
          >
            {subtitle}
          </p>
        )}

        {/* CTA Button */}
        {ctaText && (
          <a
            href={ctaLink}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            style={styles.button}
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
