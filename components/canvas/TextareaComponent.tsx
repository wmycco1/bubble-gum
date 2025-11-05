// ═══════════════════════════════════════════════════════════════
// TEXTAREA COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Multiline text input for forms
// Features: Configurable rows, placeholder, label, validation
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface TextareaComponentProps {
  component: CanvasComponent;
}

export function TextareaComponent({ component }: TextareaComponentProps) {
  const { props, style } = component;

  const label = (props.label as string) || 'Message';
  const placeholder = (props.placeholder as string) || 'Enter your message...';
  const name = (props.name as string) || 'message';
  const required = (props.required as boolean) ?? false;
  const rows = (props.rows as number) || 4;

  return (
    <div className="px-6 py-3 w-full">
      {label && (
        <label
          htmlFor={component.id}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={component.id}
        name={name}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-2 text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        style={style as React.CSSProperties}
      />
    </div>
  );
}
