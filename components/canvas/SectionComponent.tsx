// ═══════════════════════════════════════════════════════════════
// SECTION COMPONENT (Hero/Banner)
// ═══════════════════════════════════════════════════════════════
// Replaces: OLD HeroComponent
// NEW system: Uses CanvasComponent props + style
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { Button } from '@/components/ui/button';

interface SectionComponentProps {
  component: CanvasComponent;
}

export function SectionComponent({ component }: SectionComponentProps) {
  const { props, style } = component;

  const title = (props.text as string) || 'Welcome';
  const subtitle = (props.subtitle as string) || '';
  const ctaText = (props.ctaText as string) || '';
  const ctaLink = (props.ctaLink as string) || '#';

  return (
    <div
      className="relative bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-24 sm:py-32 lg:px-8"
      style={style as React.CSSProperties}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg leading-8 text-slate-300">
            {subtitle}
          </p>
        )}
        {ctaText && (
          <div className="mt-10">
            <Button
              size="lg"
              onClick={() => ctaLink !== '#' && window.open(ctaLink, '_blank')}
            >
              {ctaText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
