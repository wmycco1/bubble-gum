// ═══════════════════════════════════════════════════════════════
// LOGGER UTILITY
// ═══════════════════════════════════════════════════════════════
// Purpose: Production-ready logging with levels
// Features:
// - Multiple log levels (debug, info, warn, error)
// - Structured logging with context
// - Disabled in production (only warn/error)
// - TypeScript support
// ═══════════════════════════════════════════════════════════════

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // In production, only log warnings and errors
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      // eslint-disable-next-line no-console
      console[level === 'debug' ? 'log' : level](`${prefix} ${message}`, context);
    } else {
      // eslint-disable-next-line no-console
      console[level === 'debug' ? 'log' : level](`${prefix} ${message}`);
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
