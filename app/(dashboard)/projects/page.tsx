'use client';

import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function ProjectsPage() {
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { data: projects, isLoading, error, refetch } = trpc.project.list.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  const createProject = trpc.project.create.useMutation({
    onSuccess: () => {
      setNewProjectName('');
      setIsCreating(false);
      refetch();
    },
  });
  const deleteProject = trpc.project.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await createProject.mutateAsync({ name: newProjectName.trim() });
      console.log('Project created successfully, refetching list...');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if database connection fails
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
              <p className="text-slate-600 mt-1">
                Create and manage your websites
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-800 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Database Connection Error</h3>
              <p className="text-sm mb-4">
                Unable to connect to the database. This feature will be available in Phase 2.
              </p>
              <p className="text-xs text-yellow-700 font-mono mb-6">
                {error.message}
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => refetch()} variant="outline">
                Retry Connection
              </Button>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Coming in Phase 2:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Create and manage multiple projects</li>
              <li>✓ Visual page editor with drag & drop</li>
              <li>✓ AI-powered page generation</li>
              <li>✓ Custom domains and publishing</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Your Projects</h1>
            <p className="text-slate-600 mt-1">
              Create and manage your websites
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Create Project Form */}
        {!isCreating ? (
          <Button onClick={() => setIsCreating(true)} className="mb-6">
            + New Project
          </Button>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <div className="flex gap-4">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name..."
                className="flex-1 rounded-md border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateProject();
                  }
                }}
              />
              <Button
                onClick={handleCreateProject}
                disabled={createProject.isPending || !newProjectName.trim()}
              >
                {createProject.isPending ? 'Creating...' : 'Create'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName('');
                }}
              >
                Cancel
              </Button>
            </div>
            {createProject.error && (
              <p className="text-red-500 text-sm mt-2">
                {createProject.error.message}
              </p>
            )}
          </div>
        )}

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-slate-600 mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  {project.isPublished && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Published
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{project._count.pages}</span>{' '}
                    pages
                  </div>
                  {project.subdomain && (
                    <div className="text-sm text-slate-600">
                      <span className="font-mono text-xs">
                        {project.subdomain}.bubblegum.app
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link href={`/editor/${project.id}`} className="flex-1">
                    <Button className="w-full" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete "${project.name}"?`
                        )
                      ) {
                        deleteProject.mutate({ id: project.id });
                      }
                    }}
                    disabled={deleteProject.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No projects yet
            </h3>
            <p className="text-slate-600 mb-6">
              Create your first project to get started
            </p>
            {!isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                + Create Your First Project
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
