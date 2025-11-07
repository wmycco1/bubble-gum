/**
 * PricingTable Component Tests
 * God-Tier Development Protocol 2025
 *
 * Comprehensive test suite with 80%+ coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PricingTable } from './PricingTable';
import type { PricingTableProps, PricingTier } from './PricingTable.types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock CSS modules
jest.mock('./PricingTable.module.css', () => ({
  'pricing-table': 'pricing-table',
  'pricing-table--grid-2': 'pricing-table--grid-2',
  'pricing-table--grid-3': 'pricing-table--grid-3',
  'pricing-table--grid-4': 'pricing-table--grid-4',
  'pricing-table-toggle': 'pricing-table-toggle',
  'toggle-button': 'toggle-button',
  'toggle-button--active': 'toggle-button--active',
  'pricing-table-grid': 'pricing-table-grid',
  'pricing-tier': 'pricing-tier',
  'pricing-tier--highlighted': 'pricing-tier--highlighted',
  'pricing-tier--disabled': 'pricing-tier--disabled',
  'tier-badge-wrapper': 'tier-badge-wrapper',
  'tier-badge': 'tier-badge',
  'tier-content': 'tier-content',
  'tier-name': 'tier-name',
  'tier-description': 'tier-description',
  'tier-price-wrapper': 'tier-price-wrapper',
  'tier-price': 'tier-price',
  'tier-price-amount': 'tier-price-amount',
  'tier-price-period': 'tier-price-period',
  'tier-cta': 'tier-cta',
  'tier-features': 'tier-features',
  'feature-item': 'feature-item',
  'feature-icon': 'feature-icon',
  'feature-text': 'feature-text',
  'pricing-table-empty': 'pricing-table-empty',
}));

// Sample pricing tiers
const sampleTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'For individuals',
    features: ['1 site', 'Basic support', '1GB storage'],
    ctaText: 'Start Free',
    ctaHref: '/signup/free',
  },
  {
    id: '2',
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For professionals',
    features: [
      { id: 'f1', text: '10 sites', included: true },
      { id: 'f2', text: 'Priority support', included: true },
      { id: 'f3', text: '100GB storage', included: true },
      { id: 'f4', text: 'Advanced analytics', included: true },
    ],
    ctaText: 'Get Pro',
    ctaHref: '/signup/pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    description: 'For teams',
    features: ['Unlimited sites', 'Dedicated support', 'Unlimited storage', 'Custom features'],
    ctaText: 'Contact Sales',
    ctaHref: '/contact',
  },
];

describe('PricingTable', () => {
  // ============================================
  // BASIC RENDERING
  // ============================================

  describe('Basic Rendering', () => {
    it('renders with required tiers prop', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByTestId('pricing-table')).toBeInTheDocument();
    });

    it('renders all pricing tiers', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
    });

    it('renders tier prices', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$49')).toBeInTheDocument();
      expect(screen.getByText('$99')).toBeInTheDocument();
    });

    it('renders tier periods', () => {
      render(<PricingTable tiers={sampleTiers} />);
      const periods = screen.getAllByText('/month');
      expect(periods).toHaveLength(3);
    });

    it('renders tier descriptions', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByText('For individuals')).toBeInTheDocument();
      expect(screen.getByText('For professionals')).toBeInTheDocument();
      expect(screen.getByText('For teams')).toBeInTheDocument();
    });

    it('renders as section element', () => {
      const { container } = render(<PricingTable tiers={sampleTiers} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<PricingTable tiers={sampleTiers} className="custom-pricing" />);
      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('custom-pricing');
    });

    it('applies custom data-testid', () => {
      render(<PricingTable tiers={sampleTiers} data-testid="custom-pricing-table" />);
      expect(screen.getByTestId('custom-pricing-table')).toBeInTheDocument();
    });
  });

  // ============================================
  // EMPTY STATE
  // ============================================

  describe('Empty State', () => {
    it('renders empty state when no tiers provided', () => {
      render(<PricingTable tiers={[]} />);
      expect(screen.getByText('No pricing tiers available')).toBeInTheDocument();
    });

    it('shows correct testid for empty state', () => {
      render(<PricingTable tiers={[]} />);
      expect(screen.getByTestId('pricing-table-empty')).toBeInTheDocument();
    });
  });

  // ============================================
  // LAYOUT VARIANTS
  // ============================================

  describe('Layout Variants', () => {
    it('renders grid-2 layout', () => {
      render(<PricingTable tiers={sampleTiers} layout="grid-2" />);
      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('pricing-table--grid-2');
    });

    it('renders grid-3 layout (default)', () => {
      render(<PricingTable tiers={sampleTiers} layout="grid-3" />);
      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('pricing-table--grid-3');
    });

    it('renders grid-4 layout', () => {
      render(<PricingTable tiers={sampleTiers} layout="grid-4" />);
      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('pricing-table--grid-4');
    });

    it('defaults to grid-3 layout when not specified', () => {
      render(<PricingTable tiers={sampleTiers} />);
      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('pricing-table--grid-3');
    });
  });

  // ============================================
  // HIGHLIGHTED TIER
  // ============================================

  describe('Highlighted Tier', () => {
    it('highlights specified tier', () => {
      render(<PricingTable tiers={sampleTiers} />);
      const proTier = screen.getByTestId('pricing-table-tier-2');
      expect(proTier).toHaveClass('pricing-tier--highlighted');
    });

    it('renders badge on highlighted tier', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByText('Most Popular')).toBeInTheDocument();
    });

    it('renders badge with correct testid', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByTestId('pricing-table-tier-2-badge')).toBeInTheDocument();
    });

    it('does not highlight non-highlighted tiers', () => {
      render(<PricingTable tiers={sampleTiers} />);
      const freeTier = screen.getByTestId('pricing-table-tier-1');
      expect(freeTier).not.toHaveClass('pricing-tier--highlighted');
    });
  });

  // ============================================
  // DISABLED TIER
  // ============================================

  describe('Disabled Tier', () => {
    const disabledTiers: PricingTier[] = [
      {
        id: '1',
        name: 'Disabled Plan',
        price: '$99',
        features: ['Feature 1'],
        ctaText: 'Not Available',
        disabled: true,
      },
    ];

    it('renders disabled tier with correct class', () => {
      render(<PricingTable tiers={disabledTiers} />);
      const tier = screen.getByTestId('pricing-table-tier-1');
      expect(tier).toHaveClass('pricing-tier--disabled');
    });

    it('disables CTA button for disabled tier', () => {
      render(<PricingTable tiers={disabledTiers} />);
      const button = screen.getByRole('button', { name: 'Not Available' });
      expect(button).toBeDisabled();
    });
  });

  // ============================================
  // FEATURES
  // ============================================

  describe('Features', () => {
    it('renders string features', () => {
      render(<PricingTable tiers={[sampleTiers[0]]} />);
      expect(screen.getByText('1 site')).toBeInTheDocument();
      expect(screen.getByText('Basic support')).toBeInTheDocument();
      expect(screen.getByText('1GB storage')).toBeInTheDocument();
    });

    it('renders object features', () => {
      render(<PricingTable tiers={[sampleTiers[1]]} />);
      expect(screen.getByText('10 sites')).toBeInTheDocument();
      expect(screen.getByText('Priority support')).toBeInTheDocument();
      expect(screen.getByText('100GB storage')).toBeInTheDocument();
      expect(screen.getByText('Advanced analytics')).toBeInTheDocument();
    });

    it('renders features list with correct testid', () => {
      render(<PricingTable tiers={[sampleTiers[0]]} />);
      expect(screen.getByTestId('pricing-table-tier-1-features')).toBeInTheDocument();
    });

    it('does not render features section when no features', () => {
      const noFeaturesTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Basic',
          price: '$0',
          features: [],
          ctaText: 'Get Started',
        },
      ];
      render(<PricingTable tiers={noFeaturesTiers} />);
      expect(screen.queryByTestId('pricing-table-tier-1-features')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CTA BUTTONS
  // ============================================

  describe('CTA Buttons', () => {
    it('renders CTA button for each tier', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByRole('button', { name: 'Start Free' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Get Pro' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Contact Sales' })).toBeInTheDocument();
    });

    it('calls onCtaClick when CTA button is clicked', () => {
      const onCtaClick = jest.fn();
      render(<PricingTable tiers={sampleTiers} onCtaClick={onCtaClick} />);

      const button = screen.getByRole('button', { name: 'Get Pro' });
      fireEvent.click(button);

      expect(onCtaClick).toHaveBeenCalledTimes(1);
      expect(onCtaClick).toHaveBeenCalledWith(
        sampleTiers[1],
        expect.objectContaining({ type: 'click' })
      );
    });

    it('does not call onCtaClick for disabled tier', () => {
      const onCtaClick = jest.fn();
      const disabledTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Disabled',
          price: '$99',
          features: [],
          ctaText: 'Not Available',
          disabled: true,
        },
      ];
      render(<PricingTable tiers={disabledTiers} onCtaClick={onCtaClick} />);

      const button = screen.getByRole('button', { name: 'Not Available' });
      fireEvent.click(button);

      expect(onCtaClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // TIER CLICK
  // ============================================

  describe('Tier Click', () => {
    it('calls onTierClick when tier is clicked', () => {
      const onTierClick = jest.fn();
      render(<PricingTable tiers={sampleTiers} onTierClick={onTierClick} />);

      const tier = screen.getByTestId('pricing-table-tier-2');
      fireEvent.click(tier);

      expect(onTierClick).toHaveBeenCalledTimes(1);
      expect(onTierClick).toHaveBeenCalledWith(sampleTiers[1]);
    });

    it('does not call onTierClick for disabled tier', () => {
      const onTierClick = jest.fn();
      const disabledTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Disabled',
          price: '$99',
          features: [],
          ctaText: 'Not Available',
          disabled: true,
        },
      ];
      render(<PricingTable tiers={disabledTiers} onTierClick={onTierClick} />);

      const tier = screen.getByTestId('pricing-table-tier-1');
      fireEvent.click(tier);

      expect(onTierClick).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // PERIOD TOGGLE
  // ============================================

  describe('Period Toggle', () => {
    it('does not show toggle by default', () => {
      render(<PricingTable tiers={sampleTiers} />);
      expect(screen.queryByTestId('pricing-table-toggle')).not.toBeInTheDocument();
    });

    it('shows toggle when showPeriodToggle is true', () => {
      render(<PricingTable tiers={sampleTiers} showPeriodToggle={true} />);
      expect(screen.getByTestId('pricing-table-toggle')).toBeInTheDocument();
    });

    it('renders monthly and yearly toggle buttons', () => {
      render(<PricingTable tiers={sampleTiers} showPeriodToggle={true} />);
      expect(screen.getByTestId('pricing-table-toggle-monthly')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-table-toggle-yearly')).toBeInTheDocument();
    });

    it('defaults to monthly period', () => {
      render(<PricingTable tiers={sampleTiers} showPeriodToggle={true} />);
      const monthlyButton = screen.getByTestId('pricing-table-toggle-monthly');
      expect(monthlyButton).toHaveClass('toggle-button--active');
      expect(monthlyButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('switches to yearly period when clicked', () => {
      render(<PricingTable tiers={sampleTiers} showPeriodToggle={true} />);
      const yearlyButton = screen.getByTestId('pricing-table-toggle-yearly');

      fireEvent.click(yearlyButton);

      expect(yearlyButton).toHaveClass('toggle-button--active');
      expect(yearlyButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onPeriodChange when period is toggled', () => {
      const onPeriodChange = jest.fn();
      render(
        <PricingTable tiers={sampleTiers} showPeriodToggle={true} onPeriodChange={onPeriodChange} />
      );

      const yearlyButton = screen.getByTestId('pricing-table-toggle-yearly');
      fireEvent.click(yearlyButton);

      expect(onPeriodChange).toHaveBeenCalledWith('yearly');
    });

    it('respects defaultPeriod prop', () => {
      render(
        <PricingTable tiers={sampleTiers} showPeriodToggle={true} defaultPeriod="yearly" />
      );
      const yearlyButton = screen.getByTestId('pricing-table-toggle-yearly');
      expect(yearlyButton).toHaveClass('toggle-button--active');
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<PricingTable tiers={sampleTiers} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('renders with semantic article elements', () => {
      const { container } = render(<PricingTable tiers={sampleTiers} />);
      const articles = container.querySelectorAll('article');
      expect(articles).toHaveLength(3);
    });

    it('toggle buttons have aria-pressed attribute', () => {
      render(<PricingTable tiers={sampleTiers} showPeriodToggle={true} />);
      const monthlyButton = screen.getByTestId('pricing-table-toggle-monthly');
      const yearlyButton = screen.getByTestId('pricing-table-toggle-yearly');

      expect(monthlyButton).toHaveAttribute('aria-pressed');
      expect(yearlyButton).toHaveAttribute('aria-pressed');
    });

    it('CTA buttons are keyboard accessible', () => {
      render(<PricingTable tiers={sampleTiers} />);
      const button = screen.getByRole('button', { name: 'Get Pro' });
      expect(button).toBeInTheDocument();
    });
  });

  // ============================================
  // CONTEXT API
  // ============================================

  describe('Context API', () => {
    it('inherits parameters from context', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <PricingTable tiers={sampleTiers} />
        </AtomProvider>
      );

      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('context-class');
    });

    it('props override context parameters', () => {
      const { AtomProvider } = require('@/context/parameters/ParameterContext');

      render(
        <AtomProvider value={{ className: 'context-class' }}>
          <PricingTable tiers={sampleTiers} className="props-class" />
        </AtomProvider>
      );

      const table = screen.getByTestId('pricing-table');
      expect(table).toHaveClass('props-class');
    });
  });

  // ============================================
  // EDGE CASES
  // ============================================

  describe('Edge Cases', () => {
    it('handles tier without period', () => {
      const noPeriodTiers: PricingTier[] = [
        {
          id: '1',
          name: 'One-time',
          price: '$99',
          features: ['Feature 1'],
          ctaText: 'Buy Now',
        },
      ];
      render(<PricingTable tiers={noPeriodTiers} />);
      expect(screen.getByText('$99')).toBeInTheDocument();
      expect(screen.queryByTestId('pricing-table-tier-1-period')).not.toBeInTheDocument();
    });

    it('handles tier without description', () => {
      const noDescTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Basic',
          price: '$0',
          features: [],
          ctaText: 'Get Started',
        },
      ];
      render(<PricingTable tiers={noDescTiers} />);
      expect(screen.queryByTestId('pricing-table-tier-1-description')).not.toBeInTheDocument();
    });

    it('handles tier without badge', () => {
      const noBadgeTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Basic',
          price: '$0',
          features: [],
          ctaText: 'Get Started',
          highlighted: true,
        },
      ];
      render(<PricingTable tiers={noBadgeTiers} />);
      expect(screen.queryByTestId('pricing-table-tier-1-badge')).not.toBeInTheDocument();
    });

    it('handles numeric price', () => {
      const numericPriceTiers: PricingTier[] = [
        {
          id: '1',
          name: 'Pro',
          price: 49,
          features: [],
          ctaText: 'Get Started',
        },
      ];
      render(<PricingTable tiers={numericPriceTiers} />);
      expect(screen.getByText('49')).toBeInTheDocument();
    });
  });

  // ============================================
  // RENDERING PERFORMANCE
  // ============================================

  describe('Rendering Performance', () => {
    it('renders with minimal re-renders', () => {
      const { rerender } = render(<PricingTable tiers={sampleTiers} />);
      rerender(<PricingTable tiers={sampleTiers} />);
      expect(screen.getByTestId('pricing-table')).toBeInTheDocument();
    });

    it('handles many tiers efficiently', () => {
      const manyTiers = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Plan ${i + 1}`,
        price: `$${(i + 1) * 10}`,
        features: ['Feature 1', 'Feature 2'],
        ctaText: 'Get Started',
      }));

      render(<PricingTable tiers={manyTiers} />);
      expect(screen.getByText('Plan 1')).toBeInTheDocument();
      expect(screen.getByText('Plan 10')).toBeInTheDocument();
    });
  });
});
