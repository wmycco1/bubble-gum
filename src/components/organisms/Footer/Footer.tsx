/**
 * Footer Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Footer with copyright, links, social media, and optional newsletter.
 * Uses Link and Text Atoms, supports single and multi-column layouts.
 *
 * @example Basic
 * ```tsx
 * <Footer
 *   copyright="© 2025 Company"
 *   links={[
 *     { id: '1', label: 'Privacy', href: '/privacy' },
 *     { id: '2', label: 'Terms', href: '/terms' }
 *   ]}
 * />
 * ```
 *
 * @example Multi-column
 * ```tsx
 * <Footer
 *   copyright="© 2025 Company"
 *   columns={columnsConfig}
 *   showSocial
 *   socialLinks={socialConfig}
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <OrganismProvider value={{ variant: 'dark' }}>
 *   <Footer copyright="© 2025" links={links} />
 * </OrganismProvider>
 * ```
 */

'use client';

import React, { useState } from 'react';
import { useOrganismContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';
import type { FooterProps, FooterLink, SocialLink } from './Footer.types';
import styles from './Footer.module.css';

export const Footer: React.FC<FooterProps> = (props) => {
  // Get inherited parameters from Organism context
  const contextParams = useOrganismContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as FooterProps;

  // Destructure with defaults
  const {
    copyright = `© ${new Date().getFullYear()} Company Name. All rights reserved.`,
    links = [],
    columns = [],
    showSocial = false,
    socialLinks = [],
    showNewsletter = false,
    newsletterTitle = 'Subscribe to our newsletter',
    newsletterPlaceholder = 'Enter your email',
    newsletterSubmitText = 'Subscribe',
    onNewsletterSubmit,
    variant = 'light',
    layout = 'single',
    columnCount = 4,
    onLinkClick,
    onSocialClick,
    fullWidth = true,
    maxWidth = '1200px',
    centerContent = true,
    className = '',
    'data-testid': testId = 'footer',
    ...rest
  } = params;

  // Newsletter email state
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Handle link click
  const handleLinkClick = (link: FooterLink, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLinkClick) {
      onLinkClick(link, e);
    }
  };

  // Handle social click
  const handleSocialClick = (link: SocialLink, e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSocialClick) {
      onSocialClick(link, e);
    }
  };

  // Handle newsletter submit
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !onNewsletterSubmit) return;

    setNewsletterLoading(true);
    try {
      await onNewsletterSubmit(email);
      setEmail(''); // Clear input on success
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Determine layout
  const isMultiColumn = layout === 'multi-column' && columns.length > 0;

  // Compute CSS classes
  const footerClasses = [
    styles.footer,
    styles[`footer--${variant}`],
    fullWidth && styles['footer--full-width'],
    isMultiColumn && styles['footer--multi-column'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles['footer-container'],
    centerContent && styles['footer-container--centered'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <footer
      className={footerClasses}
      role="contentinfo"
      data-testid={testId}
      {...rest}
    >
      <div
        className={containerClasses}
        style={{
          ...(!fullWidth && maxWidth && { maxWidth }),
        }}
      >
        {/* Multi-column Layout */}
        {isMultiColumn && (
          <div
            className={styles['footer-columns']}
            style={{
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            }}
            data-testid={`${testId}-columns`}
          >
            {columns.map((column) => (
              <div key={column.id} className={styles['footer-column']} data-testid={`${testId}-column-${column.id}`}>
                <AtomProvider value={{ size: 'sm', weight: 'semibold' }}>
                  <Text className={styles['footer-column-title']}>{column.title}</Text>
                </AtomProvider>
                <nav className={styles['footer-column-links']} aria-label={`${column.title} links`}>
                  <AtomProvider value={{ size: 'sm' }}>
                    {column.links.map((link) => (
                      <Link
                        key={link.id}
                        href={link.href}
                        external={link.external}
                        onClick={(e) => handleLinkClick(link, e)}
                        className={styles['footer-column-link']}
                        data-testid={`${testId}-link-${link.id}`}
                      >
                        {link.icon && (
                          <span className={styles['footer-link-icon']} aria-hidden="true">
                            {link.icon}
                          </span>
                        )}
                        {link.label}
                      </Link>
                    ))}
                  </AtomProvider>
                </nav>
              </div>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        {showNewsletter && (
          <div className={styles['footer-newsletter']} data-testid={`${testId}-newsletter`}>
            <AtomProvider value={{ size: 'md', weight: 'semibold' }}>
              <Text className={styles['footer-newsletter-title']}>{newsletterTitle}</Text>
            </AtomProvider>
            <form onSubmit={handleNewsletterSubmit} className={styles['footer-newsletter-form']}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterPlaceholder}
                required
                className={styles['footer-newsletter-input']}
                aria-label="Email address"
                data-testid={`${testId}-newsletter-input`}
              />
              <button
                type="submit"
                disabled={newsletterLoading || !email}
                className={styles['footer-newsletter-button']}
                data-testid={`${testId}-newsletter-submit`}
              >
                {newsletterLoading ? 'Submitting...' : newsletterSubmitText}
              </button>
            </form>
          </div>
        )}

        {/* Single Row Links */}
        {!isMultiColumn && links.length > 0 && (
          <nav className={styles['footer-links']} aria-label="Footer links" data-testid={`${testId}-links`}>
            <AtomProvider value={{ size: 'sm' }}>
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  external={link.external}
                  onClick={(e) => handleLinkClick(link, e)}
                  className={styles['footer-link']}
                  data-testid={`${testId}-link-${link.id}`}
                >
                  {link.icon && (
                    <span className={styles['footer-link-icon']} aria-hidden="true">
                      {link.icon}
                    </span>
                  )}
                  {link.label}
                </Link>
              ))}
            </AtomProvider>
          </nav>
        )}

        {/* Social Media Links */}
        {showSocial && socialLinks.length > 0 && (
          <div className={styles['footer-social']} data-testid={`${testId}-social`}>
            <AtomProvider value={{ size: 'sm' }}>
              {socialLinks.map((social) => (
                <Link
                  key={social.id}
                  href={social.href}
                  external
                  onClick={(e) => handleSocialClick(social, e)}
                  className={styles['footer-social-link']}
                  aria-label={social.ariaLabel || `Visit our ${social.platform}`}
                  data-testid={`${testId}-social-${social.id}`}
                >
                  {social.icon ? (
                    <span className={styles['footer-social-icon']} aria-hidden="true">
                      {social.icon}
                    </span>
                  ) : (
                    <span className={styles['footer-social-text']}>{social.platform}</span>
                  )}
                </Link>
              ))}
            </AtomProvider>
          </div>
        )}

        {/* Copyright */}
        <div className={styles['footer-copyright']} data-testid={`${testId}-copyright`}>
          <AtomProvider value={{ size: 'sm', color: 'muted' }}>
            <Text className={styles['footer-copyright-text']}>{copyright}</Text>
          </AtomProvider>
        </div>
      </div>
    </footer>
  );
};

// Display name for React DevTools
Footer.displayName = 'Footer';

// Default export for convenience
export default Footer;
