'use client';

/**
 * Properties Panel V2
 * Direct AtomParameters binding - NO adapters
 *
 * Features:
 * - 5 tabs: Atoms | Molecules | Organisms | Templates | Pages
 * - Direct parameter editing
 * - Type-safe controls
 * - Real-time updates
 */

import React, { useState } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ComponentSelector } from './ComponentSelector';
import { ParameterEditor } from './ParameterEditor';

interface PropertiesPanelV2Props {
  className?: string;
}

export function PropertiesPanelV2({ className }: PropertiesPanelV2Props) {
  const { selectedComponentId, components, updateComponent } = useCanvasStore();
  const [activeTab, setActiveTab] = useState<'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages'>('atoms');

  // Get selected component
  const selectedComponent = components.find(c => c.id === selectedComponentId);

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: any) => {
    if (!selectedComponent) return;

    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [paramName]: value,
      },
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedComponent ? `Editing: ${selectedComponent.type}` : 'Select a component'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {(['atoms', 'molecules', 'organisms', 'templates', 'pages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors
              ${activeTab === tab
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedComponent ? (
          <ParameterEditor
            component={selectedComponent}
            onParameterChange={handleParameterChange}
          />
        ) : (
          <ComponentSelector
            activeTab={activeTab}
            onComponentSelect={(componentType) => {
              // TODO: Add component to canvas
              console.log('Add component:', componentType);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
        Properties Panel V2 • Direct AtomParameters
      </div>
    </div>
  );
}
