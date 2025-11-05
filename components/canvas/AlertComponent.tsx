// ═══════════════════════════════════════════════════════════════
// ALERT COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Alert variants (info, success, warning, error)
// - Optional title
// - Dismissible with close button
// - Icon support
// - Responsive design
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing, cleanBorderRadiusStyle } from '@/lib/utils/spacing';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

interface AlertComponentProps {
  component: CanvasComponent;
}

export function AlertComponent({ component }: AlertComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const title = (props.title as string) || '';
  const message = (props.message as string) || 'This is an alert message';
  const variant = (props.variant as 'info' | 'success' | 'warning' | 'error') || 'info';
  const dismissible = (props.dismissible as boolean) ?? true;

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-900',
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          title: 'text-green-900',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          title: 'text-yellow-900',
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-900',
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          title: 'text-red-900',
        };
      default:
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-900',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          title: 'text-blue-900',
        };
    }
  };

  const variantStyles = getVariantStyles();

  // Base wrapper className
  const baseClassName = `w-full flex items-start gap-3 p-4 rounded-lg border ${variantStyles.container}`;
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);
  const cleanedStyle = cleanBorderRadiusStyle(style as Record<string, unknown>);

  return (
    <div className={wrapperClassName} style={cleanedStyle as React.CSSProperties} role="alert">
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">{variantStyles.icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold mb-1 ${variantStyles.title}`}>{title}</h4>
        )}
        <p className="text-sm">{message}</p>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
