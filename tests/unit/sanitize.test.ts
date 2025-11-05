// ═══════════════════════════════════════════════════════════════
// SANITIZATION TESTS
// ═══════════════════════════════════════════════════════════════
// Tests for lib/utils/sanitize.ts XSS prevention
// ═══════════════════════════════════════════════════════════════

import { describe, it, expect } from 'vitest';
import {
  sanitizeHTML,
  sanitizeRichText,
  sanitizeMarketing,
  stripHTML,
  sanitizeURL,
} from '@/lib/utils/sanitize';

describe('HTML Sanitization', () => {
  describe('sanitizeHTML', () => {
    it('should allow safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const result = sanitizeHTML(input);
      expect(result).toBe('<p>Hello <strong>world</strong></p>');
    });

    it('should remove script tags', () => {
      const input = '<p>Hello</p><script>alert("XSS")</script>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('should remove event handlers', () => {
      const input = '<p onclick="alert(\'XSS\')">Click me</p>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onclick');
      expect(result).toContain('<p>Click me</p>');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('javascript:');
    });

    it('should allow safe links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeHTML(input);
      expect(result).toContain('href="https://example.com"');
    });

    it('should allow images with safe attributes', () => {
      const input = '<img src="https://example.com/image.jpg" alt="Test" />';
      const result = sanitizeHTML(input);
      expect(result).toContain('src="https://example.com/image.jpg"');
      expect(result).toContain('alt="Test"');
    });

    it('should remove iframe tags', () => {
      const input = '<iframe src="https://evil.com"></iframe>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<iframe');
    });

    it('should handle nested XSS attempts', () => {
      const input = '<div><p><script>alert("XSS")</script></p></div>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<script>');
    });
  });

  describe('sanitizeRichText', () => {
    it('should allow rich text formatting', () => {
      const input = '<h1>Title</h1><p>Paragraph with <em>emphasis</em></p>';
      const result = sanitizeRichText(input);
      expect(result).toContain('<h1>Title</h1>');
      expect(result).toContain('<em>emphasis</em>');
    });

    it('should allow tables', () => {
      const input = '<table><tr><td>Cell</td></tr></table>';
      const result = sanitizeRichText(input);
      expect(result).toContain('<table>');
      expect(result).toContain('<td>Cell</td>');
    });

    it('should remove script tags from rich text', () => {
      const input = '<h1>Title</h1><script>alert("XSS")</script>';
      const result = sanitizeRichText(input);
      expect(result).not.toContain('<script>');
    });

    it('should not allow data attributes', () => {
      const input = '<p data-evil="bad">Text</p>';
      const result = sanitizeRichText(input);
      expect(result).not.toContain('data-evil');
    });
  });

  describe('sanitizeMarketing', () => {
    it('should allow minimal formatting', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const result = sanitizeMarketing(input);
      expect(result).toContain('Hello');
      expect(result).toContain('<strong>world</strong>');
    });

    it('should remove complex HTML', () => {
      const input = '<div class="container"><p>Text</p></div>';
      const result = sanitizeMarketing(input);
      expect(result).not.toContain('<div');
      expect(result).toContain('Text');
    });

    it('should allow links', () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = sanitizeMarketing(input);
      expect(result).toContain('href="https://example.com"');
    });
  });

  describe('stripHTML', () => {
    it('should remove all HTML tags', () => {
      const input = '<p>Hello <strong>world</strong></p>';
      const result = stripHTML(input);
      expect(result).toBe('Hello world');
    });

    it('should keep text content', () => {
      const input = '<script>alert("XSS")</script>Hello';
      const result = stripHTML(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should handle nested tags', () => {
      const input = '<div><p><span>Text</span></p></div>';
      const result = stripHTML(input);
      expect(result).toBe('Text');
    });

    it('should return empty string for empty input', () => {
      const result = stripHTML('');
      expect(result).toBe('');
    });
  });

  describe('sanitizeURL', () => {
    it('should allow https URLs', () => {
      const input = 'https://example.com';
      const result = sanitizeURL(input);
      expect(result).toBe('https://example.com');
    });

    it('should allow http URLs', () => {
      const input = 'http://example.com';
      const result = sanitizeURL(input);
      expect(result).toBe('http://example.com');
    });

    it('should allow mailto URLs', () => {
      const input = 'mailto:test@example.com';
      const result = sanitizeURL(input);
      expect(result).toBe('mailto:test@example.com');
    });

    it('should reject javascript: URLs', () => {
      const input = 'javascript:alert("XSS")';
      const result = sanitizeURL(input);
      expect(result).toBe('');
    });

    it('should reject data: URLs', () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeURL(input);
      expect(result).toBe('');
    });

    it('should reject invalid URLs', () => {
      const input = 'not a url';
      const result = sanitizeURL(input);
      expect(result).toBe('');
    });

    it('should handle empty string', () => {
      const result = sanitizeURL('');
      expect(result).toBe('');
    });
  });

  describe('XSS Attack Vectors', () => {
    it('should prevent XSS via img onerror', () => {
      const input = '<img src=x onerror="alert(\'XSS\')" />';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onerror');
    });

    it('should prevent XSS via svg', () => {
      const input = '<svg onload="alert(\'XSS\')"></svg>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('onload');
    });

    it('should prevent XSS via style tag', () => {
      const input = '<style>body { background: url("javascript:alert(\'XSS\')"); }</style>';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<style>');
    });

    it('should prevent XSS via meta tag', () => {
      const input = '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">';
      const result = sanitizeHTML(input);
      expect(result).not.toContain('<meta');
    });
  });
});
