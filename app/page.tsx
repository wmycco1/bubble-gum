import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-5xl font-bold text-center mb-4 text-slate-900">
          Bubble Gum
        </h1>
        <p className="text-center text-lg text-slate-600 mb-8">
          AI-Powered Page Builder - Create production-ready websites in 30 minutes
        </p>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 justify-center">
            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && !userId && (
            <Link
              href="/dev-login"
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              🔧 Clerk requires phone? Click here
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
