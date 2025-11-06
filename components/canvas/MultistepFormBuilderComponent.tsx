// ═══════════════════════════════════════════════════════════════
// MULTISTEP FORM BUILDER COMPONENT - M3 Forms
// ═══════════════════════════════════════════════════════════════
// Version: 2.0.0 - Multi-step form with progress indicator
// Features:
// - Multiple steps with individual field groups
// - Progress bar with step indicators
// - Next/Previous navigation
// - Step validation before proceeding
// - Success screen on completion
// - Professional wizard-style UX
// ═══════════════════════════════════════════════════════════════

'use client';

import { useState } from 'react';
import type { CanvasComponent } from '@/lib/editor/types';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export function MultistepFormBuilderComponent({ component }: { component: CanvasComponent }) {
  const { props } = component;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [completed, setCompleted] = useState(false);

  const steps = (props.steps as FormStep[] | undefined) || [];
  const formTitle = (props.formTitle as string) || 'Multi-Step Form';
  const successMessage = (props.successMessage as string) || 'Thank you! Your submission has been received.';

  const handleChange = (fieldId: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Multistep form submitted:', formData);
    setCompleted(true);
  };

  // Empty state
  if (steps.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-2">📋</div>
          <p className="text-sm font-medium">No form steps added</p>
          <p className="text-xs mt-1">Add steps in the properties panel →</p>
        </div>
      </div>
    );
  }

  // Success screen
  if (completed) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-12">
          <div className="text-center">
            <div className="text-6xl mb-6">✓</div>
            <h2 className="text-3xl font-bold text-green-900 mb-3">Success!</h2>
            <p className="text-lg text-green-700">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{formTitle}</h1>
        <p className="text-slate-600">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div
                className={`w-full h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              />
              {index < steps.length - 1 && (
                <div className="w-2" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          {steps.map((step, index) => (
            <span key={step.id} className={index === currentStep ? 'font-semibold text-blue-600' : ''}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {/* Step Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentStepData.title}</h2>
        {currentStepData.description && (
          <p className="text-slate-600 mb-6">{currentStepData.description}</p>
        )}

        {/* Form Fields */}
        <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          <div className="space-y-6 mb-8">
            {currentStepData.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

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
                ) : null}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
