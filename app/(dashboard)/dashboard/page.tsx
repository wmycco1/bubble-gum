import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
          This is your protected dashboard. Only authenticated users can see this page.
        </p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-slate-900">User Information</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="text-sm text-slate-900">{user?.emailAddresses[0]?.emailAddress}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">User ID</dt>
              <dd className="text-sm text-slate-900">{userId}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Joined</dt>
              <dd className="text-sm text-slate-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
