/**
 * Navbar Component (Organism)
 * God-Tier Development Protocol 2025
 *
 * Navigation bar with logo, links, and mobile responsive menu.
 * Uses Link Atom and Context API for parameter inheritance.
 *
 * @example Basic
 * ```tsx
 * <Navbar
 *   logo="Brand"
 *   links={[
 *     { id: '1', label: 'Home', href: '/' },
 *     { id: '2', label: 'About', href: '/about' }
 *   ]}
 * />
 * ```
 *
 * @example With Context API
 * ```tsx
 * <OrganismProvider value={{ sticky: true, variant: 'dark' }}>
 *   <Navbar logo="Brand" links={navLinks} />
 * </OrganismProvider>
 * ```
 *
 * @example Sticky with dark variant
 * ```tsx
 * <Navbar
 *   logo={<img src="/logo.svg" alt="Logo" />}
 *   links={links}
 *   sticky
 *   variant="dark"
 * />
 * ```
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { useOrganismContext, mergeParameters, AtomProvider } from '@/context/parameters/ParameterContext';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import { Link } from '@/components/atoms/Link';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import type { NavbarProps } from './Navbar.types';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';
import styles from './Navbar.module.css';
import { getValidDOMProps } from '@/lib/utils/filterDOMProps';

export const Navbar: React.FC<NavbarProps> = (props) => {
  // Get inherited parameters from Organism context
  const contextParams = useOrganismContext();

  // Merge context + props (props win in case of conflicts)
  const params = mergeParameters(contextParams, props) as NavbarProps;

  // Destructure with defaults
  const {
    logo = 'Logo',
    logoHref = '/',
    links,
    sticky = false,
    variant = 'light',
    mobileBreakpoint = 'md',
    showMobileMenu: controlledMobileMenu,
    onMobileMenuToggle,
    onLogoClick,
    onLinkClick,
    shadow = true,
    fullWidth = true,
    maxWidth = '1200px',
    zIndex = 1000,
    className = '',
    'data-testid': testId = 'navbar',
    ...rest
  } = params;

  // Mobile menu state (internal or controlled)
  const [internalMobileMenu, setInternalMobileMenu] = useState(false);
  const isMobileMenuOpen = controlledMobileMenu !== undefined ? controlledMobileMenu : internalMobileMenu;

  // Scroll state for sticky navbar
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky behavior
  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setInternalMobileMenu(newState);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(newState);
    }
  };

  // Handle logo click
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onLogoClick) {
      onLogoClick(e);
    }
  };

  // Handle link click
  const handleLinkClick = (link: any, e: React.MouseEvent<HTMLAnchorElement>) => {
    // Close mobile menu on link click
    setInternalMobileMenu(false);
    if (onMobileMenuToggle) {
      onMobileMenuToggle(false);
    }

    if (onLinkClick) {
      onLinkClick(link, e);
    }
  };

  // Compute CSS classes
  const navClasses = [
    styles.navbar,
    styles[`navbar--${variant}`],
    sticky && styles['navbar--sticky'],
    sticky && isScrolled && styles['navbar--scrolled'],
    shadow && styles['navbar--shadow'],
    fullWidth && styles['navbar--full-width'],
    isMobileMenuOpen && styles['navbar--menu-open'],
    styles[`navbar--mobile-${mobileBreakpoint}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const containerClasses = [
    styles['navbar-container'],
    !fullWidth && styles['navbar-container--constrained'],
  ]
    .filter(Boolean)
    .join(' ');

  const menuClasses = [
    styles['navbar-menu'],
    isMobileMenuOpen && styles['navbar-menu--open'],
  ]
    .filter(Boolean)
    .join(' ');

  // Filter out invalid DOM props from rest
  const validDOMProps = getValidDOMProps(rest);

  return (
    <nav
      className={navClasses}
      role="navigation"
      aria-label="Main navigation"
      data-testid={testId}
      style={{
        ...(zIndex && { zIndex }),
        ...rest.style,
      }}
      {...validDOMProps}
    >
      <div
        className={containerClasses}
        style={{
          ...(!fullWidth && maxWidth && { maxWidth }),
        }}
      >
        {/* Logo */}
        <div className={styles['navbar-logo']}>
          <Link
            href={logoHref}
            onClick={handleLogoClick}
            className={styles['navbar-logo-link']}
            data-testid={`${testId}-logo`}
          >
            {typeof logo === 'string' ? (
              <span className={styles['navbar-logo-text']}>{logo}</span>
            ) : (
              logo
            )}
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className={styles['navbar-links']} data-testid={`${testId}-links`}>
          <AtomProvider value={{ size: 'md' }}>
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                external={link.external}
                disabled={link.disabled}
                onClick={(e) => handleLinkClick(link, e)}
                className={[
                  styles['navbar-link'],
                  link.active && styles['navbar-link--active'],
                  link.disabled && styles['navbar-link--disabled'],
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`${testId}-link-${link.id}`}
              >
                {link.icon && (
                  <span className={styles['navbar-link-icon']} aria-hidden="true">
                    {link.icon}
                  </span>
                )}
                {link.label}
              </Link>
            ))}
          </AtomProvider>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button
          type="button"
          className={styles['navbar-toggle']}
          onClick={handleMobileMenuToggle}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="navbar-mobile-menu"
          data-testid={`${testId}-toggle`}
        >
          <span className={styles['navbar-toggle-icon']}>
            {isMobileMenuOpen ? (
              // Close icon (X)
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="navbar-mobile-menu"
        className={menuClasses}
        data-testid={`${testId}-mobile-menu`}
        aria-hidden={!isMobileMenuOpen}
      >
        <AtomProvider value={{ size: 'lg' }}>
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              external={link.external}
              disabled={link.disabled}
              onClick={(e) => handleLinkClick(link, e)}
              className={[
                styles['navbar-mobile-link'],
                link.active && styles['navbar-mobile-link--active'],
                link.disabled && styles['navbar-mobile-link--disabled'],
              ]
                .filter(Boolean)
                .join(' ')}
              data-testid={`${testId}-mobile-link-${link.id}`}
            >
              {link.icon && (
                <span className={styles['navbar-mobile-link-icon']} aria-hidden="true">
                  {link.icon}
                </span>
              )}
              {link.label}
            </Link>
          ))}
        </AtomProvider>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className={styles['navbar-backdrop']}
          onClick={handleMobileMenuToggle}
          data-testid={`${testId}-backdrop`}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

// Display name for React DevTools
Navbar.displayName = 'Navbar';

// Default export for convenience
export default Navbar;
