// ═══════════════════════════════════════════════════════════════
// HEADING COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Dedicated heading component (h1-h6)
// Features: Multiple heading levels, font size control, alignment
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface HeadingComponentProps {
  component: CanvasComponent;
}

export function HeadingComponent({ component }: HeadingComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Your Heading';
  const level = (props.level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2';
  const align = (props.align as 'left' | 'center' | 'right') || 'left';

  const levelClasses = {
    h1: 'text-5xl font-bold',
    h2: 'text-4xl font-bold',
    h3: 'text-3xl font-semibold',
    h4: 'text-2xl font-semibold',
    h5: 'text-xl font-medium',
    h6: 'text-lg font-medium',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const Tag = level;
  const levelClass = levelClasses[level];
  const alignClass = alignClasses[align];

  return (
    <div className="px-6 py-4">
      <Tag
        className={`${levelClass} ${alignClass} text-slate-900`}
        style={style as React.CSSProperties}
      >
        {text}
      </Tag>
    </div>
  );
}
