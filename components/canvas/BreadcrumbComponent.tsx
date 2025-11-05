// ═══════════════════════════════════════════════════════════════
// BREADCRUMB COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Breadcrumb navigation trail
// - Separator styles (slash, chevron, arrow)
// - Link support
// - Active/inactive states
// - Truncation for long paths
// ═══════════════════════════════════════════════════════════════

import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface BreadcrumbComponentProps {
  component: CanvasComponent;
}

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

export function BreadcrumbComponent({ component }: BreadcrumbComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const items = (props.items as BreadcrumbItem[]) || [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Category' },
  ];
  const separator = (props.separator as string | 'slash' | 'chevron' | 'arrow') || 'chevron';

  // Get separator element
  const getSeparator = () => {
    switch (separator) {
      case 'chevron':
        return <ChevronRight className="w-4 h-4 text-slate-400" />;
      case 'arrow':
        return <ArrowRight className="w-4 h-4 text-slate-400" />;
      case 'slash':
        return <span className="text-slate-400">/</span>;
      default:
        // Custom separator string
        return <span className="text-slate-400">{separator}</span>;
    }
  };

  // Base wrapper className
  const baseClassName = 'flex items-center flex-wrap gap-2';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <nav
      className={wrapperClassName}
      style={style as React.CSSProperties}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.id} className="flex items-center gap-2">
              {item.href ? (
                <a
                  href={item.href}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`text-sm ${
                    isLast ? 'text-slate-900 font-medium' : 'text-slate-600'
                  }`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {/* Separator */}
              {!isLast && <span aria-hidden="true">{getSeparator()}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
