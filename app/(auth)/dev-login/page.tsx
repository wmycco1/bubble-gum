'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DevLoginPage() {
  const router = useRouter();

  if (process.env.NODE_ENV !== 'development') {
    router.push('/');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">
          🔧 Dev Mode Login
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          This page is only available in development mode. Clerk requires phone
          verification in test mode.
        </p>

        <div className="space-y-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h2 className="font-semibold text-yellow-900">
            To disable phone requirement in Clerk:
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-yellow-800">
            <li>Go to https://dashboard.clerk.com</li>
            <li>Select your application</li>
            <li>Go to "User & Authentication" → "Email, Phone, Username"</li>
            <li>Find "Phone number" section</li>
            <li>Change to "Optional" or "Off"</li>
            <li>Click "Save"</li>
          </ol>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={() => router.push('/sign-up')}
            className="w-full"
          >
            Try Sign Up Again
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
          >
            Back to Home
          </Button>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-900">
            Alternative: Use existing Clerk account
          </h3>
          <p className="text-xs text-slate-600">
            If you already have a Clerk account with phone verified, you can use
            it to test the application.
          </p>
        </div>
      </div>
    </div>
  );
}
