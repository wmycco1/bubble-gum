import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.firstName || 'User'}!
        </h1>
        <p className="mt-2 text-slate-600">
          Build amazing websites with AI-powered tools
        </p>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/projects"
            className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Your Projects
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              View and manage all your websites
            </p>
            <Button>Go to Projects</Button>
          </Link>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              AI Generator
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Create pages with AI assistance
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Account Settings
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Manage your subscription and profile
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Account Information
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="text-sm text-slate-900 mt-1">
                {user?.emailAddresses[0]?.emailAddress}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Plan</dt>
              <dd className="text-sm text-slate-900 mt-1">Free Trial</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Member Since</dt>
              <dd className="text-sm text-slate-900 mt-1">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
