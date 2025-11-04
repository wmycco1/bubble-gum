import { SignIn } from '@clerk/nextjs';

// Force dynamic rendering for Clerk
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <SignIn />
    </div>
  );
}
