/**
 * Footer Component Types
 * God-Tier Development Protocol 2025
 *
 * TypeScript interfaces for Footer component (Organism level)
 */

import type { OrganismParameters } from '@/types/parameters';

/**
 * Footer link item configuration
 */
export interface FooterLink {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Link URL
   */
  href: string;

  /**
   * External link (opens in new tab)
   * @default false
   */
  external?: boolean;

  /**
   * Icon name (optional)
   */
  icon?: string;
}

/**
 * Footer column configuration (multi-column layout)
 */
export interface FooterColumn {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Column title
   */
  title: string;

  /**
   * Links in this column
   */
  links: FooterLink[];
}

/**
 * Social media platform configuration
 */
export interface SocialLink {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Platform name (e.g., 'facebook', 'twitter', 'linkedin')
   */
  platform: string;

  /**
   * Profile URL
   */
  href: string;

  /**
   * Display icon
   */
  icon?: string;

  /**
   * Accessible label
   */
  ariaLabel?: string;
}

/**
 * Footer visual variants
 */
export type FooterVariant = 'light' | 'dark';

/**
 * Footer layout options
 */
export type FooterLayout = 'single' | 'multi-column';

/**
 * Footer-specific parameters
 * Extends OrganismParameters with footer-specific props
 *
 * @example Basic usage
 * ```tsx
 * <Footer
 *   copyright="© 2025 My Company"
 *   links={[
 *     { id: '1', label: 'Privacy', href: '/privacy' },
 *     { id: '2', label: 'Terms', href: '/terms' },
 *   ]}
 * />
 * ```
 *
 * @example Multi-column layout
 * ```tsx
 * <Footer
 *   copyright="© 2025 Company"
 *   columns={[
 *     {
 *       id: 'product',
 *       title: 'Product',
 *       links: [
 *         { id: '1', label: 'Features', href: '/features' },
 *         { id: '2', label: 'Pricing', href: '/pricing' },
 *       ]
 *     },
 *     {
 *       id: 'company',
 *       title: 'Company',
 *       links: [
 *         { id: '3', label: 'About', href: '/about' },
 *         { id: '4', label: 'Contact', href: '/contact' },
 *       ]
 *     }
 *   ]}
 * />
 * ```
 *
 * @example With social media
 * ```tsx
 * <Footer
 *   copyright="© 2025 Company"
 *   showSocial
 *   socialLinks={[
 *     { id: '1', platform: 'facebook', href: 'https://facebook.com/...' },
 *     { id: '2', platform: 'twitter', href: 'https://twitter.com/...' },
 *   ]}
 * />
 * ```
 */
export interface FooterProps extends OrganismParameters {
  /**
   * Copyright text
   * @default '© {currentYear} Company Name. All rights reserved.'
   */
  copyright?: string;

  /**
   * Simple footer links (single row)
   * Used for basic footer layout
   */
  links?: FooterLink[];

  /**
   * Multi-column footer layout
   * Used for complex footer with grouped links
   */
  columns?: FooterColumn[];

  /**
   * Show social media section
   * @default false
   */
  showSocial?: boolean;

  /**
   * Social media links
   */
  socialLinks?: SocialLink[];

  /**
   * Show newsletter signup
   * @default false
   */
  showNewsletter?: boolean;

  /**
   * Newsletter title
   * @default 'Subscribe to our newsletter'
   */
  newsletterTitle?: string;

  /**
   * Newsletter placeholder text
   * @default 'Enter your email'
   */
  newsletterPlaceholder?: string;

  /**
   * Newsletter submit button text
   * @default 'Subscribe'
   */
  newsletterSubmitText?: string;

  /**
   * Newsletter submit handler
   */
  onNewsletterSubmit?: (email: string) => void | Promise<void>;

  /**
   * Visual variant
   * @default 'light'
   */
  variant?: FooterVariant;

  /**
   * Layout style
   * - 'single': Single row of links
   * - 'multi-column': Multiple columns of grouped links
   * @default 'single'
   */
  layout?: FooterLayout;

  /**
   * Number of columns for multi-column layout
   * @default 4
   */
  columnCount?: number;

  /**
   * Link click handler
   */
  onLinkClick?: (link: FooterLink, event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Social link click handler
   */
  onSocialClick?: (link: SocialLink, event: React.MouseEvent<HTMLAnchorElement>) => void;

  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Max width (when not full width)
   * @default '1200px'
   */
  maxWidth?: string;

  /**
   * Center content
   * @default true
   */
  centerContent?: boolean;
}
