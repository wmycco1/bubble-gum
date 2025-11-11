/**
 * Error Boundary for Badge component
 * Provides graceful error handling and fallback UI for production safety
 *
 * @module BadgeErrorBoundary
 * @packageDocumentation
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props for BadgeErrorBoundary component
 */
interface BadgeErrorBoundaryProps {
  /** Child component(s) to wrap with error boundary */
  children: ReactNode;
  /** Optional fallback UI to render on error (default: minimal inline badge) */
  fallback?: ReactNode;
  /** Optional error callback for logging/monitoring */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * State for BadgeErrorBoundary component
 */
interface BadgeErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred (for dev debugging) */
  error?: Error;
}

/**
 * Error Boundary component for Badge
 *
 * Catches JavaScript errors in Badge component tree and displays fallback UI
 * instead of crashing the entire application.
 *
 * Features:
 * - Graceful error handling (no app crashes)
 * - Fallback UI with minimal inline badge
 * - Error logging for monitoring
 * - Production-safe (no error details exposed)
 * - Development-friendly (console errors in dev mode)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <BadgeErrorBoundary>
 *   <Badge>Content</Badge>
 * </BadgeErrorBoundary>
 *
 * // Custom fallback
 * <BadgeErrorBoundary fallback={<span>Error</span>}>
 *   <Badge>Content</Badge>
 * </BadgeErrorBoundary>
 *
 * // With error logging
 * <BadgeErrorBoundary onError={(error) => logToService(error)}>
 *   <Badge>Content</Badge>
 * </BadgeErrorBoundary>
 * ```
 */
export class BadgeErrorBoundary extends Component<
  BadgeErrorBoundaryProps,
  BadgeErrorBoundaryState
> {
  constructor(props: BadgeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  /**
   * Lifecycle method called when error is caught
   * Updates state to trigger fallback UI rendering
   *
   * @param error - The error that was thrown
   * @returns New state with error flag
   */
  static getDerivedStateFromError(error: Error): BadgeErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method called after error is caught
   * Logs error details for monitoring and debugging
   *
   * @param error - The error that was thrown
   * @param errorInfo - Component stack trace information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Badge Error Boundary] Component error caught:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }

    // Call optional error callback (for production monitoring)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry, LogRocket, etc.
      // sentry.captureException(error, { extra: errorInfo });
      console.error('[Badge] Error:', error.message);
    }
  }

  /**
   * Renders either children or fallback UI based on error state
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback: minimal inline badge with error icon
      return (
        <span
          role="status"
          aria-label="Error loading badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.125rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            borderRadius: '9999px',
            backgroundColor: '#fee',
            color: '#c00',
            border: '1px solid #fcc',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ marginRight: '0.25rem' }}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 4a1 1 0 112 0v4a1 1 0 11-2 0V4zm1 7a1 1 0 100 2 1 1 0 000-2z"
              clipRule="evenodd"
            />
          </svg>
          {process.env.NODE_ENV === 'development'
            ? `Error: ${this.state.error?.message || 'Unknown'}`
            : 'Error'}
        </span>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

/**
 * Higher-order component to wrap Badge with Error Boundary
 *
 * Convenience function for wrapping Badge components with error handling.
 *
 * @param Component - Badge component to wrap
 * @returns Wrapped component with error boundary
 *
 * @example
 * ```tsx
 * // Wrap Badge component
 * const SafeBadge = withBadgeErrorBoundary(Badge);
 *
 * // Use in app
 * <SafeBadge variant="primary">Safe Badge</SafeBadge>
 * ```
 */
export function withBadgeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WrappedComponent(props: P) {
    return (
      <BadgeErrorBoundary>
        <Component {...props} />
      </BadgeErrorBoundary>
    );
  };
}
