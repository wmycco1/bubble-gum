// ═══════════════════════════════════════════════════════════════
// ORDERS AND RETURNS COMPONENT - M3 E-commerce/CMS
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Customer service page for order tracking/returns
// Features:
// - Order lookup form (Order ID + Email)
// - Return policy information
// - Contact support CTA
// - FAQ section
// - Professional customer service design
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

export function OrdersAndReturnsComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');

  const title = (props.title as string) || 'Orders & Returns';
  const subtitle = (props.subtitle as string) || 'Track your order or initiate a return';
  const returnPolicy = (props.returnPolicy as string) || 'We offer a 30-day return policy on all items. Items must be unused and in original packaging.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, this would query order status
    alert(`Looking up order: ${orderId} for ${email}`);
  };

  return (
    <div className="py-12 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{title}</h1>
          <p className="text-lg text-slate-600">{subtitle}</p>
        </div>

        {/* Order Lookup Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Track Your Order</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD-12345"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Return Policy */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Return Policy</h2>
          <p className="text-slate-700 leading-relaxed mb-6">{returnPolicy}</p>
          <button className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
            Initiate Return
          </button>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How long does shipping take?</h3>
              <p className="text-slate-700">Standard shipping takes 3-5 business days. Express shipping is 1-2 business days.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">What is your return window?</h3>
              <p className="text-slate-700">You have 30 days from delivery to initiate a return.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">How do I track my order?</h3>
              <p className="text-slate-700">Use the form above with your Order ID and email address to track your shipment.</p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-slate-700 mb-3">Need more help?</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}
