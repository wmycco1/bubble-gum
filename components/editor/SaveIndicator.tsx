'use client';

// ═══════════════════════════════════════════════════════════════
// SAVE INDICATOR COMPONENT
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Purpose: Visual feedback for auto-save status
// Features:
// - Accessible (ARIA live region)
// - Animated state transitions
// - Mobile-friendly
// - Non-intrusive design
// ═══════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import type { SaveStatus } from '@/lib/hooks/useAutoSave';
import { cn } from '@/lib/utils/cn';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface SaveIndicatorProps {
  status: SaveStatus;
  lastSavedAt?: Date | null;
  error?: string;
  retryCount?: number;
  isOnline?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SaveIndicator({
  status,
  lastSavedAt,
  error,
  retryCount = 0,
  isOnline = true,
}: SaveIndicatorProps) {
  // Format last saved time
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 10) return 'just now';
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status config (icon, text, color, animation)
  const statusConfig = useMemo(() => {
    switch (status) {
      case 'idle':
        return {
          icon: '',
          text: '',
          color: 'text-slate-600',
          bgColor: '',
          show: false,
          ariaLive: 'off' as const,
        };

      case 'saving':
        return {
          icon: '⏳',
          text: 'Saving...',
          color: 'text-slate-700',
          bgColor: 'bg-slate-100',
          show: true,
          ariaLive: 'polite' as const,
          animate: 'pulse',
        };

      case 'saved':
        return {
          icon: '✅',
          text: `Saved ${formatLastSaved(lastSavedAt || null)}`,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          show: true,
          ariaLive: 'polite' as const,
        };

      case 'error':
        return {
          icon: '⚠️',
          text: error || 'Save failed',
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          show: true,
          ariaLive: 'assertive' as const,
        };

      case 'retrying':
        return {
          icon: '🔄',
          text: `Retrying... (${retryCount + 1})`,
          color: 'text-orange-700',
          bgColor: 'bg-orange-50',
          show: true,
          ariaLive: 'polite' as const,
          animate: 'spin',
        };

      case 'offline':
        return {
          icon: '📡',
          text: 'Offline - Will save when online',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-50',
          show: true,
          ariaLive: 'assertive' as const,
        };

      default:
        return {
          icon: '',
          text: '',
          color: 'text-slate-600',
          bgColor: '',
          show: false,
          ariaLive: 'off' as const,
        };
    }
  }, [status, lastSavedAt, error, retryCount]);

  // Don't render if nothing to show
  if (!statusConfig.show) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-200',
        statusConfig.bgColor,
        statusConfig.color,
        status === 'saved' ? 'border-green-200' : 'border-transparent',
        status === 'error' ? 'border-red-200' : 'border-transparent',
        status === 'offline' ? 'border-yellow-200' : 'border-transparent',
        status === 'retrying' ? 'border-orange-200' : 'border-transparent'
      )}
      role="status"
      aria-live={statusConfig.ariaLive}
      aria-atomic="true"
    >
      {/* Icon */}
      <span
        className={cn(
          'flex-shrink-0',
          statusConfig.animate === 'pulse' && 'animate-pulse',
          statusConfig.animate === 'spin' && 'animate-spin'
        )}
        aria-hidden="true"
      >
        {statusConfig.icon}
      </span>

      {/* Text */}
      <span className="whitespace-nowrap">{statusConfig.text}</span>

      {/* Online indicator (only show when offline) */}
      {!isOnline && status !== 'offline' && (
        <span
          className="ml-1 h-2 w-2 rounded-full bg-yellow-500 animate-pulse"
          title="Offline"
          aria-label="Offline"
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Compact Variant (for mobile/tight spaces)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SaveIndicatorCompact({
  status,
  lastSavedAt,
  isOnline = true,
}: Omit<SaveIndicatorProps, 'error' | 'retryCount'>) {
  const statusConfig = useMemo(() => {
    switch (status) {
      case 'idle':
        return { icon: '', color: 'text-slate-400', show: false };
      case 'saving':
        return { icon: '⏳', color: 'text-slate-600', show: true, animate: 'pulse' };
      case 'saved':
        return { icon: '✅', color: 'text-green-600', show: true };
      case 'error':
        return { icon: '⚠️', color: 'text-red-600', show: true };
      case 'retrying':
        return { icon: '🔄', color: 'text-orange-600', show: true, animate: 'spin' };
      case 'offline':
        return { icon: '📡', color: 'text-yellow-600', show: true };
      default:
        return { icon: '', color: 'text-slate-400', show: false };
    }
  }, [status]);

  if (!statusConfig.show) {
    return null;
  }

  return (
    <div className="flex items-center gap-1" role="status" aria-live="polite">
      <span
        className={cn(
          'text-base',
          statusConfig.color,
          statusConfig.animate === 'pulse' && 'animate-pulse',
          statusConfig.animate === 'spin' && 'animate-spin'
        )}
        title={status === 'saved' && lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString()}` : status}
      >
        {statusConfig.icon}
      </span>

      {!isOnline && (
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" aria-label="Offline" />
      )}
    </div>
  );
}
