'use client';

// ═══════════════════════════════════════════════════════════════
// PROPERTY GROUP - Collapsible Property Section Wrapper
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Collapsible/expandable sections
// - Smooth animations (height transition)
// - localStorage persistence (remember collapsed state)
// - Icon indicator (chevron)
// - Badge for property count
// - Professional UI with hover states
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface PropertyGroupProps {
  title: string;
  icon?: React.ReactNode;
  badge?: string | number;
  defaultExpanded?: boolean;
  storageKey?: string; // For localStorage persistence
  children: React.ReactNode;
  className?: string;
}

export function PropertyGroup({
  title,
  icon,
  badge,
  defaultExpanded = true,
  storageKey,
  children,
  className = '',
}: PropertyGroupProps) {
  // Load initial expanded state from localStorage (if storageKey provided)
  const getInitialExpanded = (): boolean => {
    if (!storageKey || typeof window === 'undefined') {
      return defaultExpanded;
    }

    try {
      const stored = localStorage.getItem(`propertyGroup:${storageKey}`);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch {
      // Ignore localStorage errors
    }

    return defaultExpanded;
  };

  const [isExpanded, setIsExpanded] = useState(getInitialExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  // Save expanded state to localStorage
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;

    try {
      localStorage.setItem(`propertyGroup:${storageKey}`, String(isExpanded));
    } catch {
      // Ignore localStorage errors
    }
  }, [isExpanded, storageKey]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`border-t border-slate-200 bg-white ${className}`}>
      {/* Header (clickable) */}
      <button
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          {/* Icon */}
          {icon && (
            <div className="text-slate-600 group-hover:text-slate-900 transition-colors">
              {icon}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>

          {/* Badge */}
          {badge !== undefined && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-medium">
              {badge}
            </span>
          )}
        </div>

        {/* Chevron indicator */}
        <ChevronDown
          className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${
            isExpanded ? 'rotate-0' : '-rotate-90'
          }`}
        />
      </button>

      {/* Content (collapsible) */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: isExpanded ? contentRef.current?.scrollHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
