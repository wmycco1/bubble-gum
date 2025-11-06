// ═══════════════════════════════════════════════════════════════
// FORM COMPONENT
// ═══════════════════════════════════════════════════════════════
// NEW system: Uses CanvasComponent props + style
// Features: Dynamic fields, submit button
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/utils/logger';

interface FormComponentProps {
  component: CanvasComponent;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required: boolean;
}

export function FormComponent({ component }: FormComponentProps) {
  const { props, style } = component;

  const fields = (props.fields as FormField[]) || [
    { id: '1', label: 'Name', type: 'text', required: true },
    { id: '2', label: 'Email', type: 'email', required: true },
  ];
  const submitText = (props.submitText as string) || 'Submit';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logger.debug('Form submitted');
  };

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('px-6 py-8', style);

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-4"
      >
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                required={field.required}
                className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            ) : (
              <Input
                id={field.id}
                type={field.type}
                required={field.required}
              />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full">
          {submitText}
        </Button>
      </form>
    </div>
  );
}
