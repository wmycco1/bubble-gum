/**
 * Footer Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 35+ tests covering:
 * - Rendering variants
 * - Multi-column layout
 * - Social media links
 * - Newsletter functionality
 * - User interactions
 * - Accessibility
 * - Context API integration
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Footer } from './Footer';
import { OrganismProvider } from '@/context/parameters/ParameterContext';
import type { FooterLink, FooterColumn, SocialLink } from './Footer.types';

expect.extend(toHaveNoViolations);

// Mock data
const mockLinks: FooterLink[] = [
  { id: '1', label: 'Privacy Policy', href: '/privacy' },
  { id: '2', label: 'Terms of Service', href: '/terms' },
  { id: '3', label: 'Contact Us', href: '/contact' },
];

const mockColumns: FooterColumn[] = [
  {
    id: 'product',
    title: 'Product',
    links: [
      { id: '1', label: 'Features', href: '/features' },
      { id: '2', label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: '3', label: 'About', href: '/about' },
      { id: '4', label: 'Careers', href: '/careers' },
    ],
  },
];

const mockSocialLinks: SocialLink[] = [
  { id: '1', platform: 'facebook', href: 'https://facebook.com', icon: '📘' },
  { id: '2', platform: 'twitter', href: 'https://twitter.com', icon: '🐦' },
  { id: '3', platform: 'linkedin', href: 'https://linkedin.com', icon: '💼' },
];

describe('Footer Component', () => {
  // ============================================
  // BASIC RENDERING TESTS
  // ============================================

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Footer />);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders with default copyright', () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByTestId('footer-copyright')).toHaveTextContent(`© ${currentYear}`);
    });

    it('renders with custom copyright', () => {
      render(<Footer copyright="© 2025 My Company" />);
      expect(screen.getByTestId('footer-copyright')).toHaveTextContent('© 2025 My Company');
    });

    it('renders with simple links', () => {
      render(<Footer links={mockLinks} />);
      mockLinks.forEach((link) => {
        expect(screen.getByText(link.label)).toBeInTheDocument();
      });
    });

    it('renders links with correct hrefs', () => {
      render(<Footer links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElement = screen.getByText(link.label).closest('a');
        expect(linkElement).toHaveAttribute('href', link.href);
      });
    });
  });

  // ============================================
  // MULTI-COLUMN LAYOUT TESTS
  // ============================================

  describe('Multi-Column Layout', () => {
    it('renders multi-column layout', () => {
      render(<Footer columns={mockColumns} layout="multi-column" />);
      expect(screen.getByTestId('footer-columns')).toBeInTheDocument();
    });

    it('renders all column titles', () => {
      render(<Footer columns={mockColumns} layout="multi-column" />);
      mockColumns.forEach((column) => {
        expect(screen.getByText(column.title)).toBeInTheDocument();
      });
    });

    it('renders all column links', () => {
      render(<Footer columns={mockColumns} layout="multi-column" />);
      mockColumns.forEach((column) => {
        column.links.forEach((link) => {
          expect(screen.getByText(link.label)).toBeInTheDocument();
        });
      });
    });

    it('applies correct grid columns', () => {
      render(<Footer columns={mockColumns} layout="multi-column" columnCount={3} />);
      const columnsContainer = screen.getByTestId('footer-columns');
      expect(columnsContainer).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });

    it('defaults to 4 columns when columnCount not specified', () => {
      render(<Footer columns={mockColumns} layout="multi-column" />);
      const columnsContainer = screen.getByTestId('footer-columns');
      expect(columnsContainer).toHaveStyle({ gridTemplateColumns: 'repeat(4, 1fr)' });
    });

    it('does not render columns in single layout', () => {
      render(<Footer columns={mockColumns} layout="single" links={mockLinks} />);
      expect(screen.queryByTestId('footer-columns')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // SOCIAL MEDIA TESTS
  // ============================================

  describe('Social Media', () => {
    it('renders social media section when showSocial is true', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      expect(screen.getByTestId('footer-social')).toBeInTheDocument();
    });

    it('does not render social section when showSocial is false', () => {
      render(<Footer showSocial={false} socialLinks={mockSocialLinks} />);
      expect(screen.queryByTestId('footer-social')).not.toBeInTheDocument();
    });

    it('renders all social links', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      mockSocialLinks.forEach((social) => {
        expect(screen.getByTestId(`footer-social-${social.id}`)).toBeInTheDocument();
      });
    });

    it('renders social links with icons', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      mockSocialLinks.forEach((social) => {
        if (social.icon) {
          expect(screen.getByText(social.icon)).toBeInTheDocument();
        }
      });
    });

    it('social links have correct hrefs', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      mockSocialLinks.forEach((social) => {
        const link = screen.getByTestId(`footer-social-${social.id}`);
        expect(link).toHaveAttribute('href', social.href);
      });
    });

    it('social links open in new tab', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      mockSocialLinks.forEach((social) => {
        const link = screen.getByTestId(`footer-social-${social.id}`);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('calls onSocialClick when social link is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Footer showSocial socialLinks={mockSocialLinks} onSocialClick={handleClick} />);
      const link = screen.getByTestId('footer-social-1');

      await user.click(link);

      expect(handleClick).toHaveBeenCalledWith(mockSocialLinks[0], expect.any(Object));
    });
  });

  // ============================================
  // NEWSLETTER TESTS
  // ============================================

  describe('Newsletter', () => {
    it('renders newsletter section when showNewsletter is true', () => {
      render(<Footer showNewsletter />);
      expect(screen.getByTestId('footer-newsletter')).toBeInTheDocument();
    });

    it('does not render newsletter when showNewsletter is false', () => {
      render(<Footer showNewsletter={false} />);
      expect(screen.queryByTestId('footer-newsletter')).not.toBeInTheDocument();
    });

    it('renders newsletter with default title', () => {
      render(<Footer showNewsletter />);
      expect(screen.getByText('Subscribe to our newsletter')).toBeInTheDocument();
    });

    it('renders newsletter with custom title', () => {
      render(<Footer showNewsletter newsletterTitle="Join our mailing list" />);
      expect(screen.getByText('Join our mailing list')).toBeInTheDocument();
    });

    it('renders newsletter input with placeholder', () => {
      render(<Footer showNewsletter newsletterPlaceholder="Your email here" />);
      const input = screen.getByTestId('footer-newsletter-input');
      expect(input).toHaveAttribute('placeholder', 'Your email here');
    });

    it('renders newsletter submit button with custom text', () => {
      render(<Footer showNewsletter newsletterSubmitText="Sign Up" />);
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('allows typing in newsletter input', async () => {
      const user = userEvent.setup();
      render(<Footer showNewsletter />);
      const input = screen.getByTestId('footer-newsletter-input') as HTMLInputElement;

      await user.type(input, 'test@example.com');

      expect(input.value).toBe('test@example.com');
    });

    it('submit button is disabled when email is empty', () => {
      render(<Footer showNewsletter />);
      const button = screen.getByTestId('footer-newsletter-submit');
      expect(button).toBeDisabled();
    });

    it('submit button is enabled when email is entered', async () => {
      const user = userEvent.setup();
      render(<Footer showNewsletter onNewsletterSubmit={jest.fn()} />);
      const input = screen.getByTestId('footer-newsletter-input');
      const button = screen.getByTestId('footer-newsletter-submit');

      await user.type(input, 'test@example.com');

      expect(button).not.toBeDisabled();
    });

    it('calls onNewsletterSubmit when form is submitted', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<Footer showNewsletter onNewsletterSubmit={handleSubmit} />);
      const input = screen.getByTestId('footer-newsletter-input');
      const button = screen.getByTestId('footer-newsletter-submit');

      await user.type(input, 'test@example.com');
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
    });

    it('clears input after successful submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<Footer showNewsletter onNewsletterSubmit={handleSubmit} />);
      const input = screen.getByTestId('footer-newsletter-input') as HTMLInputElement;

      await user.type(input, 'test@example.com');
      await user.click(screen.getByTestId('footer-newsletter-submit'));

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 100)));
      render(<Footer showNewsletter onNewsletterSubmit={handleSubmit} />);
      const input = screen.getByTestId('footer-newsletter-input');
      const button = screen.getByTestId('footer-newsletter-submit');

      await user.type(input, 'test@example.com');
      await user.click(button);

      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });

  // ============================================
  // LINK BEHAVIOR TESTS
  // ============================================

  describe('Link Behavior', () => {
    it('renders external link with correct attributes', () => {
      const externalLinks = [
        { id: '1', label: 'External', href: 'https://example.com', external: true },
      ];
      render(<Footer links={externalLinks} />);
      const link = screen.getByText('External').closest('a');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders link with icon', () => {
      const linksWithIcon = [
        { id: '1', label: 'Contact', href: '/contact', icon: '📧' },
      ];
      render(<Footer links={linksWithIcon} />);
      expect(screen.getByText('📧')).toBeInTheDocument();
    });

    it('calls onLinkClick when link is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Footer links={mockLinks} onLinkClick={handleClick} />);
      const link = screen.getByTestId('footer-link-1');

      await user.click(link);

      expect(handleClick).toHaveBeenCalledWith(mockLinks[0], expect.any(Object));
    });
  });

  // ============================================
  // VARIANT TESTS
  // ============================================

  describe('Variants', () => {
    it('renders light variant by default', () => {
      render(<Footer />);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer--light');
    });

    it('renders dark variant', () => {
      render(<Footer variant="dark" />);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer--dark');
    });
  });

  // ============================================
  // LAYOUT TESTS
  // ============================================

  describe('Layout', () => {
    it('renders full width by default', () => {
      render(<Footer />);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer--full-width');
    });

    it('renders constrained width when fullWidth={false}', () => {
      render(<Footer fullWidth={false} />);
      const footer = screen.getByTestId('footer');
      expect(footer).not.toHaveClass('footer--full-width');
    });

    it('applies custom maxWidth', () => {
      render(<Footer fullWidth={false} maxWidth="800px" />);
      const container = screen.getByTestId('footer').querySelector('.footer-container');
      expect(container).toHaveStyle({ maxWidth: '800px' });
    });

    it('centers content when centerContent is true', () => {
      render(<Footer centerContent />);
      const container = screen.getByTestId('footer').querySelector('.footer-container');
      expect(container).toHaveClass('footer-container--centered');
    });
  });

  // ============================================
  // CONTEXT API TESTS
  // ============================================

  describe('Context API Integration', () => {
    it('inherits variant from OrganismProvider', () => {
      render(
        <OrganismProvider value={{ variant: 'dark' }}>
          <Footer />
        </OrganismProvider>
      );
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer--dark');
    });

    it('props override context values', () => {
      render(
        <OrganismProvider value={{ variant: 'dark' }}>
          <Footer variant="light" />
        </OrganismProvider>
      );
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('footer--light');
    });

    it('merges context and props correctly', () => {
      render(
        <OrganismProvider value={{ fullWidth: false, centerContent: true }}>
          <Footer variant="dark" />
        </OrganismProvider>
      );
      const footer = screen.getByTestId('footer');
      const container = footer.querySelector('.footer-container');
      expect(footer).toHaveClass('footer--dark');
      expect(footer).not.toHaveClass('footer--full-width');
      expect(container).toHaveClass('footer-container--centered');
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe('Accessibility', () => {
    it('has correct contentinfo role', () => {
      render(<Footer />);
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('navigation has aria-label', () => {
      render(<Footer links={mockLinks} />);
      const nav = screen.getByLabelText('Footer links');
      expect(nav).toBeInTheDocument();
    });

    it('column navigation has descriptive aria-label', () => {
      render(<Footer columns={mockColumns} layout="multi-column" />);
      const productNav = screen.getByLabelText('Product links');
      const companyNav = screen.getByLabelText('Company links');
      expect(productNav).toBeInTheDocument();
      expect(companyNav).toBeInTheDocument();
    });

    it('newsletter input has aria-label', () => {
      render(<Footer showNewsletter />);
      const input = screen.getByLabelText('Email address');
      expect(input).toBeInTheDocument();
    });

    it('social links have aria-label', () => {
      render(<Footer showSocial socialLinks={mockSocialLinks} />);
      const firstLink = screen.getByTestId('footer-social-1');
      expect(firstLink).toHaveAttribute('aria-label');
    });

    it('passes axe accessibility tests', async () => {
      const { container } = render(<Footer links={mockLinks} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with multi-column layout', async () => {
      const { container } = render(<Footer columns={mockColumns} layout="multi-column" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe tests with social and newsletter', async () => {
      const { container } = render(
        <Footer showSocial socialLinks={mockSocialLinks} showNewsletter />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================

  describe('Keyboard Navigation', () => {
    it('supports Tab navigation for links', async () => {
      const user = userEvent.setup();
      render(<Footer links={mockLinks} />);

      await user.tab();
      expect(screen.getByTestId('footer-link-1')).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId('footer-link-2')).toHaveFocus();
    });

    it('newsletter input is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(<Footer showNewsletter />);

      await user.tab();
      const input = screen.getByTestId('footer-newsletter-input');
      expect(input).toHaveFocus();
    });

    it('newsletter can be submitted with Enter key', async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<Footer showNewsletter onNewsletterSubmit={handleSubmit} />);
      const input = screen.getByTestId('footer-newsletter-input');

      await user.type(input, 'test@example.com{Enter}');

      expect(handleSubmit).toHaveBeenCalledWith('test@example.com');
    });
  });

  // ============================================
  // CUSTOM CLASS & DATA TESTS
  // ============================================

  describe('Custom Class and Data Attributes', () => {
    it('applies custom className', () => {
      render(<Footer className="custom-footer" />);
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('custom-footer');
    });

    it('applies custom data-testid', () => {
      render(<Footer data-testid="custom-footer" />);
      expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    });
  });
});
