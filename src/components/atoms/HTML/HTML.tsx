'use client';
import React from 'react';

export interface HTMLProps {
  content: string;
  sanitize?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const HTML: React.FC<HTMLProps> = ({
  content,
  sanitize = true,
  className = '',
  'data-testid': testId = 'html',
}) => {
  // Simple sanitization (production should use DOMPurify)
  const sanitized = sanitize
    ? content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    : content;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      data-testid={testId}
    />
  );
};
