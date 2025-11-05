// ═══════════════════════════════════════════════════════════════
// CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Checkbox input with label
// Features: Label, required validation, default checked state
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface CheckboxComponentProps {
  component: CanvasComponent;
}

export function CheckboxComponent({ component }: CheckboxComponentProps) {
  const { props, style } = component;

  const label = (props.label as string) || 'Accept terms and conditions';
  const name = (props.name as string) || 'checkbox';
  const required = (props.required as boolean) ?? false;
  const defaultChecked = (props.defaultChecked as boolean) ?? false;

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('px-6 py-3 w-full', style);

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={component.id}
            name={name}
            type="checkbox"
            required={required}
            defaultChecked={defaultChecked}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={component.id}
            className="font-medium text-slate-700 cursor-pointer"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
      </div>
    </div>
  );
}
