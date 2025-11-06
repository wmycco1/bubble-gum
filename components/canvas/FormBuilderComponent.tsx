// ═══════════════════════════════════════════════════════════════
// FORM BUILDER COMPONENT - M3 Forms
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Dynamic form builder with configurable fields
// Features:
// - Multiple field types (text/email/textarea/select/checkbox/radio)
// - Required field validation
// - Field labels and placeholders
// - Submit button customization
// - Success message display
// - Professional form styling
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select/radio
}

export function FormBuilderComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const fields = (props.fields as FormField[] | undefined) || [];
  const formTitle = (props.formTitle as string) || 'Contact Form';
  const submitButtonText = (props.submitButtonText as string) || 'Submit';
  const successMessage = (props.successMessage as string) || 'Thank you! Your form has been submitted.';

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  // Empty state
  if (fields.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-sm font-medium">No form fields added</p>
          <p className="text-xs mt-1">Add fields in the properties panel →</p>
        </div>
      </div>
    );
  }

  // Success message
  if (submitted) {
    return (
      <div className="p-8 bg-green-50 border-2 border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2">Success!</h3>
          <p className="text-green-700">{successMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Form Title */}
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{formTitle}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            {/* Label */}
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Field Input */}
            {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
              <input
                type={field.type}
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : field.type === 'textarea' ? (
              <textarea
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            ) : field.type === 'select' ? (
              <select
                value={(formData[field.id] as string) || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an option...</option>
                {(field.options || []).map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={(formData[field.id] as boolean) || false}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  required={field.required}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">{field.placeholder || 'I agree'}</span>
              </div>
            ) : field.type === 'radio' ? (
              <div className="space-y-2">
                {(field.options || []).map((option, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      checked={formData[field.id] === option}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      required={field.required}
                      className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{option}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
        >
          {submitButtonText}
        </button>
      </form>
    </div>
  );
}
