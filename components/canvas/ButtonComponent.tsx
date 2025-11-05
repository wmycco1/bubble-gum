// ═══════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Uses CanvasComponent props + style
// Features: Multiple variants (primary, secondary, outline)
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { Button } from '@/components/ui/button';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface ButtonComponentProps {
  component: CanvasComponent;
}

export function ButtonComponent({ component }: ButtonComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Button';
  const href = (props.href as string) || '#';
  const variant = (props.variant as string) || 'primary';

  const variantMap = {
    primary: 'default' as const,
    secondary: 'secondary' as const,
    outline: 'outline' as const,
  };

  const handleClick = () => {
    if (href && href !== '#') {
      window.open(href, '_blank');
    }
  };

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('px-6 py-8 text-center', style);

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      <Button
        variant={variantMap[variant as keyof typeof variantMap] || 'default'}
        onClick={handleClick}
      >
        {text}
      </Button>
    </div>
  );
}
