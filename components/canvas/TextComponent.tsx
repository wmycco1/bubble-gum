// ═══════════════════════════════════════════════════════════════
// TEXT COMPONENT
// ═══════════════════════════════════════════════════════════════
// Replaces: OLD TextComponent
// NEW system: Uses CanvasComponent props + style
// Supports: h1, h2, h3, paragraph variants
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface TextComponentProps {
  component: CanvasComponent;
}

export function TextComponent({ component }: TextComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Your text here...';
  const variant = (props.variant as string) || 'paragraph';

  const variantClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    paragraph: 'text-base',
  };

  const Tag = variant === 'paragraph' ? 'p' : (variant as 'h1' | 'h2' | 'h3');
  const variantClass = variantClasses[variant as keyof typeof variantClasses] || variantClasses.paragraph;

  return (
    <div className="px-6 py-8">
      <Tag
        className={`${variantClass} text-slate-900`}
        style={style as React.CSSProperties}
      >
        {text}
      </Tag>
    </div>
  );
}
