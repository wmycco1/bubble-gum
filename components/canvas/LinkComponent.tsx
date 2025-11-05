// ═══════════════════════════════════════════════════════════════
// LINK COMPONENT
// ═══════════════════════════════════════════════════════════════
// Purpose: Styled anchor/link component
// Features: Multiple variants, underline, external link support
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';

interface LinkComponentProps {
  component: CanvasComponent;
}

export function LinkComponent({ component }: LinkComponentProps) {
  const { props, style } = component;

  const text = (props.text as string) || 'Click here';
  const href = (props.href as string) || '#';
  const variant = (props.variant as 'default' | 'primary' | 'secondary') || 'default';
  const underline = (props.underline as boolean) ?? true;
  const external = (props.external as boolean) ?? false;

  const variantClasses = {
    default: 'text-blue-600 hover:text-blue-800',
    primary: 'text-indigo-600 hover:text-indigo-800 font-medium',
    secondary: 'text-slate-600 hover:text-slate-900',
  };

  const underlineClass = underline ? 'underline' : 'no-underline hover:underline';
  const variantClass = variantClasses[variant];

  // Remove Tailwind spacing classes if custom spacing is set
  const wrapperClassName = mergeClassNameWithSpacing('px-6 py-2', style);

  return (
    <div className={wrapperClassName} style={style as React.CSSProperties}>
      <a
        href={href}
        className={`${variantClass} ${underlineClass} transition-colors duration-200 cursor-pointer`}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {text}
        {external && (
          <svg
            className="inline-block ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        )}
      </a>
    </div>
  );
}
