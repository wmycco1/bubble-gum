'use client';

// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - EDITOR PAGE
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Visual page editor with drag & drop canvas
// ═══════════════════════════════════════════════════════════════

import { use } from 'react';
import { trpc } from '@/lib/trpc/client';
import { EditorCanvas } from '@/components/editor/EditorCanvas';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { EditorToolbar } from '@/components/editor/EditorToolbar';
import { EditorPropertiesPanel } from '@/components/editor/EditorPropertiesPanel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EditorPageProps {
  params: Promise<{ projectId: string }>;
}

export default function EditorPage({ params }: EditorPageProps) {
  const { projectId } = use(params);

  // Fetch project data
  const { data: project, isLoading, error } = trpc.project.getById.useQuery(
    { id: projectId },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 mx-auto"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !project) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md text-center">
          <div className="mb-4 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Project Not Found</h1>
          <p className="text-slate-600 mb-6">
            {error?.message || 'The project you are looking for does not exist or you do not have permission to access it.'}
          </p>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Editor interface
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              ← Back
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{project.name}</h1>
            <p className="text-xs text-slate-500">
              Last saved: {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <EditorToolbar />
      </header>

      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Components */}
        <EditorSidebar />

        {/* Canvas */}
        <main className="flex-1 overflow-auto">
          <EditorCanvas />
        </main>

        {/* Right Panel - Properties */}
        <EditorPropertiesPanel />
      </div>
    </div>
  );
}
