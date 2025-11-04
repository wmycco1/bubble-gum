import type { ButtonProps } from '@/types/components';
import { Button } from '../ui/button';

export function ButtonComponentView({ props }: { props: ButtonProps }) {
  const sizeMap = {
    sm: 'sm' as const,
    md: 'default' as const,
    lg: 'lg' as const,
  };

  const variantMap = {
    primary: 'default' as const,
    secondary: 'secondary' as const,
    outline: 'outline' as const,
  };

  return (
    <div className="px-6 py-8 text-center">
      <Button size={sizeMap[props.size]} variant={variantMap[props.variant]}>
        {props.text}
      </Button>
    </div>
  );
}
