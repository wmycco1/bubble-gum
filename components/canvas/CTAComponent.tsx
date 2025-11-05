// ═══════════════════════════════════════════════════════════════
// CTA COMPONENT
// ═══════════════════════════════════════════════════════════════
// Call-to-action section
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface CTAComponentProps {
  component: CanvasComponent;
}

export function CTAComponent({ component }: CTAComponentProps) {
  const { props, style } = component;

  const title = (props.title as string) || 'Ready to get started?';
  const description = (props.description as string) || 'Join thousands of satisfied customers today';
  const buttonText = (props.buttonText as string) || 'Sign Up Now';
  const buttonLink = (props.buttonLink as string) || '#';

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing(
    'bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-16',
    style
  );

  return (
    <section className={wrapperClassName} style={style as React.CSSProperties}>
      <div className="mx-auto max-w-4xl text-center">
        {/* Title */}
        <h2 className="mb-4 text-4xl font-bold text-white">{title}</h2>

        {/* Description */}
        {description && (
          <p className="mb-8 text-xl text-blue-100">{description}</p>
        )}

        {/* CTA Button */}
        <a
          href={buttonLink}
          className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
