// ═══════════════════════════════════════════════════════════════
// INPUT COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Standalone input field
// Features: Text, email, password, number types
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
// @ts-ignore - Will be used when spacing controls are applied
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InputComponentProps {
  component: CanvasComponent;
}

export function InputComponent({ component }: InputComponentProps) {
  const { props, style } = component;

  const type = (props.type as string) || 'text';
  const placeholder = (props.placeholder as string) || 'Enter text...';
  const label = (props.label as string) || '';

  return (
    <div className="px-6 py-8">
      <div className="max-w-md mx-auto space-y-2" style={style as React.CSSProperties}>
        {label && (
          <Label htmlFor={`input-${component.id}`}>
            {label}
          </Label>
        )}
        <Input
          id={`input-${component.id}`}
          type={type}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
