// ═══════════════════════════════════════════════════════════════
// SUBMIT BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Submit button for forms
// Features: Loading state, disabled state, variants
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';

interface SubmitComponentProps {
  component: CanvasComponent;
}

export function SubmitComponent({ component }: SubmitComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Submit';
  const variant = (props.variant as 'primary' | 'secondary' | 'success') || 'primary';
  const size = (props.size as 'sm' | 'md' | 'lg') || 'md';
  const fullWidth = (props.fullWidth as boolean) ?? false;

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : 'w-auto';
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  return (
    <div className="px-6 py-3">
      <button
        type="submit"
        className={`${variantClass} ${sizeClass} ${widthClass} font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        style={style as React.CSSProperties}
      >
        {text}
      </button>
    </div>
  );
}
