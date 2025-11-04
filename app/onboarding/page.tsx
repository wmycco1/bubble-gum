'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const { isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    goal: '',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding and redirect to dashboard
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-lg text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to Bubble Gum! 🎉
          </h1>
          <p className="mt-2 text-slate-600">
            Let's get you set up in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 ${i !== 3 ? 'mr-2' : ''}`}
              >
                <div
                  className={`h-2 rounded-full ${
                    i <= step ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-sm text-slate-500">
            Step {step} of 3
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Tell us about your business
              </h2>
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Company or Project Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-slate-700"
                >
                  Industry
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an industry</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="services">Professional Services</option>
                  <option value="tech">Technology</option>
                  <option value="creative">Creative & Design</option>
                  <option value="hospitality">Hospitality & Food</option>
                  <option value="health">Health & Wellness</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">
                What's your main goal?
              </h2>
              <div className="space-y-3">
                {[
                  {
                    value: 'landing',
                    label: 'Create a landing page',
                    desc: 'Promote a product or service',
                  },
                  {
                    value: 'portfolio',
                    label: 'Build a portfolio',
                    desc: 'Showcase your work and skills',
                  },
                  {
                    value: 'ecommerce',
                    label: 'Start an online store',
                    desc: 'Sell products online',
                  },
                  {
                    value: 'blog',
                    label: 'Launch a blog',
                    desc: 'Share content and ideas',
                  },
                  {
                    value: 'other',
                    label: 'Something else',
                    desc: 'Explore all features',
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFormData({ ...formData, goal: option.value })
                    }
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      formData.goal === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">
                      {option.label}
                    </div>
                    <div className="text-sm text-slate-600">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-slate-900">
                You're all set! 🚀
              </h2>
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  What happens next?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600">✓</span>
                    <span className="text-slate-700">
                      Explore the drag-and-drop page builder
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600">✓</span>
                    <span className="text-slate-700">
                      Try AI-powered page generation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600">✓</span>
                    <span className="text-slate-700">
                      Connect your custom domain
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-blue-600">✓</span>
                    <span className="text-slate-700">
                      Publish your first website in minutes
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Free Trial Active:</span> You
                  have 7 days to explore all features
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>
              {step === 3 ? 'Get Started' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
