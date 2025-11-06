// ═══════════════════════════════════════════════════════════════
// TEXT COMPONENT
// ═══════════════════════════════════════════════════════════════
// Replaces: OLD TextComponent
// NEW system: Uses CanvasComponent props + style
// Supports: h1, h2, h3, paragraph variants
// ═══════════════════════════════════════════════════════════════

import { useEffect } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { logger } from '@/lib/utils/logger';

interface TextComponentProps {
  component: CanvasComponent;
}

export function TextComponent({ component }: TextComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Your text here...';
  const variant = (props.variant as string) || 'paragraph';

  // Debug: Log when props change
  useEffect(() => {
    logger.debug('📄 TextComponent render:', { id: component.id, text, variant, props });
  }, [component.id, text, variant, props]);

  const variantClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    paragraph: 'text-base',
  };

  const Tag = variant === 'paragraph' ? 'p' : (variant as 'h1' | 'h2' | 'h3');
  const variantClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.paragraph;

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('px-6 py-8', style);

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      <Tag className={`${variantClass} text-slate-900`}>
        {text}
      </Tag>
    </div>
  );
}
