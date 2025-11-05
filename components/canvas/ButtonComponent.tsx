// ═══════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Uses CanvasComponent props + style
// Features: Multiple variants (primary, secondary, outline)
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { Button } from '@/components/ui/button';

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

  return (
    <div className="px-6 py-8 text-center">
      <Button
        variant={variantMap[variant as keyof typeof variantMap] || 'default'}
        style={style as React.CSSProperties}
        onClick={handleClick}
      >
        {text}
      </Button>
    </div>
  );
}
