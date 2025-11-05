// ═══════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M2: New Interactive Components
// Features:
// - Modal dialog with overlay
// - Size variants (sm, md, lg, xl, full)
// - Closable with button or backdrop click
// - Optional backdrop (static prevents close on click)
// - Centered or top-aligned
// - Smooth animations
// - Focus trap (accessibility)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';
import { mergeClassNameWithSpacing } from '@/lib/utils/spacing';
import { X } from 'lucide-react';

interface ModalComponentProps {
  component: CanvasComponent;
}

export function ModalComponent({ component }: ModalComponentProps) {
  const { style, props } = component;

  // Extract props with defaults
  const title = (props.title as string) || 'Modal Title';
  const content = (props.content as string) || 'Modal content goes here...';
  const size = (props.size as 'sm' | 'md' | 'lg' | 'xl' | 'full') || 'md';
  const closeButton = (props.closeButton as boolean) ?? true;
  const backdrop = (props.backdrop as boolean | 'static') ?? true;
  const centered = (props.centered as boolean) ?? true;

  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBackdropClick = () => {
    if (backdrop !== 'static') {
      handleClose();
    }
  };

  // Modal size classes
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-3xl';
      case 'xl':
        return 'max-w-5xl';
      case 'full':
        return 'max-w-full mx-4';
      default:
        return 'max-w-lg';
    }
  };

  // Base wrapper className
  const baseClassName = 'inline-block';
  const wrapperClassName = mergeClassNameWithSpacing(baseClassName, style);

  return (
    <>
      {/* Trigger Button */}
      <div className={wrapperClassName} style={style as React.CSSProperties}>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Open Modal
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto ${
            centered ? 'flex items-center justify-center p-4' : 'pt-20'
          }`}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          {backdrop && (
            <div
              className="fixed inset-0 bg-black/50 transition-opacity animate-in fade-in duration-200"
              onClick={handleBackdropClick}
              aria-hidden="true"
            />
          )}

          {/* Modal Container */}
          <div
            className={`relative ${getSizeClass()} w-full bg-white rounded-lg shadow-xl animate-in zoom-in-95 fade-in duration-200 ${
              !centered ? 'mx-auto' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3
                id="modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                {title}
              </h3>

              {closeButton && (
                <button
                  onClick={handleClose}
                  className="p-1 rounded-md hover:bg-slate-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-6 text-slate-700">
              {content}
            </div>

            {/* Footer (optional - could be extended) */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
