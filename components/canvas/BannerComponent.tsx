// ═══════════════════════════════════════════════════════════════
// BANNER COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M3: Extended Component Library
// Purpose: Hero-style banner with CTA buttons
// Features:
// - Background image with overlay
// - Title, subtitle, description
// - Primary & secondary CTA buttons
// - Text alignment (left, center, right)
// - Configurable height
// - WCAG AA accessibility
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { mergeAllStyles, buildClassNameFromProps } from '@/lib/utils/apply-custom-props';
import { ChevronDown } from 'lucide-react';

interface BannerComponentProps {
  component: CanvasComponent;
}

export function BannerComponent({ component }: BannerComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const title = (props.title as string) || 'Welcome to Our Site';
  const subtitle = props.subtitle as string | undefined;
  const description = props.description as string | undefined;
  const backgroundImage = props.backgroundImage as string | undefined;
  const backgroundColor = (props.backgroundColor as string) || '#1f2937';
  const overlay = (props.overlay as boolean) ?? true;
  const overlayOpacity = (props.overlayOpacity as number) ?? 0.5;
  const overlayColor = (props.overlayColor as string) || '#000000';
  const ctaText = props.ctaText as string | undefined;
  const ctaLink = (props.ctaLink as string) || '#';
  const ctaVariant = (props.ctaVariant as string) || 'primary';
  const secondaryCtaText = props.secondaryCtaText as string | undefined;
  const secondaryCtaLink = (props.secondaryCtaLink as string) || '#';
  const textAlign = (props.textAlign as 'left' | 'center' | 'right') || 'center';
  const height = (props.height as string) || '500px';
  const showArrow = (props.showArrow as boolean) ?? true;

  // CTA button styles
  const getCtaClasses = (variant: string) => {
    const base = 'px-6 py-3 rounded-lg font-medium transition-all duration-200';
    if (variant === 'primary') {
      return `${base} bg-blue-600 text-white hover:bg-blue-700`;
    } else if (variant === 'secondary') {
      return `${base} bg-white text-gray-900 hover:bg-gray-100`;
    } else {
      return `${base} border-2 border-white text-white hover:bg-white hover:text-gray-900`;
    }
  };

  // Text alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  // Base styles
  const baseStyle: React.CSSProperties = {
    position: 'relative',
    height,
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const baseClassName = `relative flex flex-col justify-center ${alignmentClasses[textAlign]} px-4 md:px-8`;
  const wrapperClassName = mergeClassNameWithSpacing(
    buildClassNameFromProps(props, baseClassName),
    style
  );

  const finalStyle = mergeAllStyles(baseStyle as React.CSSProperties, props);

  return (
    <div
      id={props.id as string | undefined}
      className={wrapperClassName}
      style={finalStyle}
    >
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl">
        {subtitle && (
          <p className="text-sm md:text-base uppercase tracking-wide text-white/90 mb-2">
            {subtitle}
          </p>
        )}

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>

        {description && (
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            {description}
          </p>
        )}

        {/* CTA Buttons */}
        {(ctaText || secondaryCtaText) && (
          <div className="flex gap-4 flex-wrap">
            {ctaText && (
              <a
                href={ctaLink}
                className={getCtaClasses(ctaVariant)}
                aria-label={ctaText}
              >
                {ctaText}
              </a>
            )}

            {secondaryCtaText && (
              <a
                href={secondaryCtaLink}
                className={getCtaClasses('outline')}
                aria-label={secondaryCtaText}
              >
                {secondaryCtaText}
              </a>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {showArrow && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
