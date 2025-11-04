'use client';

import { use, useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPalette } from '@/components/editor/ComponentPalette';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import type { PageComponent } from '@/types/components';

interface EditorPageProps {
  params: Promise<{ projectId: string }>;
}

export default function EditorPage(props: EditorPageProps) {
  const params = use(props.params);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [components, setComponents] = useState<PageComponent[]>([]);

  // Editor UI state
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoom, setZoom] = useState<number>(1);

  const { data: project, isLoading: projectLoading } =
    trpc.project.getById.useQuery({
      id: params.projectId,
    });

  const updatePageContent = trpc.page.updateContent.useMutation();

  const homepage = project?.pages.find((p) => p.slug === 'index');

  // Load page content when homepage is available
  useEffect(() => {
    if (homepage?.content && components.length === 0) {
      try {
        const content = Array.isArray(homepage.content)
          ? homepage.content
          : typeof homepage.content === 'string'
          ? JSON.parse(homepage.content)
          : [];

        if (content.length > 0) {
          console.log('Loading components from DB:', content);
          setComponents(content as PageComponent[]);
        }
      } catch (error) {
        console.error('Failed to parse homepage content:', error);
      }
    }
  }, [homepage?.content, components.length]);

  const handleSave = async () => {
    if (!homepage) return;
    await updatePageContent.mutateAsync({
      id: homepage.id,
      content: components,
    });
  };

  const handleAddComponent = (component: PageComponent) => {
    setComponents([...components, component]);
  };

  const handleUpdateComponent = (id: string, props: Record<string, unknown>) => {
    setComponents(
      components.map((comp) =>
        comp.id === id
          ? ({ ...comp, props: { ...comp.props, ...props } } as PageComponent)
          : comp
      )
    );
  };

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter((comp) => comp.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const handleMoveComponent = (fromIndex: number, toIndex: number) => {
    const newComponents = [...components];
    const [removed] = newComponents.splice(fromIndex, 1);
    if (removed) {
      newComponents.splice(toIndex, 0, removed);
      setComponents(newComponents);
    }
  };

  const selectedComponent = components.find((c) => c.id === selectedComponentId);

  // Debug logging
  console.log('EditorPage State:', {
    componentsCount: components.length,
    selectedComponentId,
    selectedComponent,
    hasPropsPanel: !!selectedComponent,
  });

  if (projectLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-900 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Project not found</h2>
          <Link href="/projects" className="mt-4 inline-block">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      {/* Header with Toolbar */}
      <header className="border-b border-slate-200 bg-white">
        {/* Top bar - Project info and actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                {project.name}
              </h1>
              <p className="text-sm text-slate-600">Editing: Home Page</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={updatePageContent.isPending}
            >
              {updatePageContent.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" disabled>
              Preview
            </Button>
            <Button size="sm" variant="secondary" disabled>
              Publish
            </Button>
          </div>
        </div>

        {/* Toolbar - Device modes and zoom */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-100 px-6 py-2">
          {/* Device Mode */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
            <Button
              variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('desktop')}
              title="Desktop (1440px)"
              className="h-8"
            >
              🖥️ Desktop
            </Button>
            <Button
              variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('tablet')}
              title="Tablet (768px)"
              className="h-8"
            >
              📱 Tablet
            </Button>
            <Button
              variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setDeviceMode('mobile')}
              title="Mobile (375px)"
              className="h-8"
            >
              📱 Mobile
            </Button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0"
            >
              −
            </Button>
            <span className="w-16 text-center text-sm text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              disabled={zoom >= 2}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>
      </header>

      {/* Editor Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Component Palette - Left Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-white overflow-y-auto">
          <ComponentPalette onAddComponent={handleAddComponent} />
        </div>

        {/* Canvas - Center */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="flex items-center justify-center min-h-full">
            <div
              className="transition-all duration-200"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                width: deviceMode === 'desktop' ? '1440px' : deviceMode === 'tablet' ? '768px' : '375px',
                maxWidth: '100%',
              }}
            >
              <Canvas
                components={components}
                selectedId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
                onDeleteComponent={handleDeleteComponent}
                onMoveComponent={handleMoveComponent}
              />
            </div>
          </div>
        </div>

        {/* Properties Panel - Right Sidebar */}
        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto">
          <PropertiesPanel
            component={selectedComponent}
            onUpdate={(props) => {
              if (selectedComponentId) {
                handleUpdateComponent(selectedComponentId, props);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
