'use client';

/**
 * Properties Panel V2
 * Direct AtomParameters binding - NO adapters
 *
 * Features:
 * - Shows parameters ONLY for selected component
 * - Direct parameter editing
 * - Type-safe controls
 * - Real-time updates
 */

import React from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';
import { ParameterEditor } from './ParameterEditor';

interface PropertiesPanelV2Props {
  className?: string;
}

export function PropertiesPanelV2({ className }: PropertiesPanelV2Props) {
  const { selectedComponentId, components, updateComponent } = useCanvasStore();

  // Get selected component
  const selectedComponent = components.find(c => c.id === selectedComponentId);

  // Handle parameter change
  const handleParameterChange = (paramName: string, value: any) => {
    if (!selectedComponent) return;

    // Special handling: When variant changes, clear custom colors to allow variant to show
    const updatedProps: Record<string, any> = {
      ...selectedComponent.props,
      [paramName]: value,
    };

    // If changing variant, clear color and backgroundColor
    if (paramName === 'variant') {
      updatedProps.color = '';
      updatedProps.backgroundColor = '';
    }

    updateComponent(selectedComponent.id, {
      props: updatedProps,
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-bold text-gray-900">Properties</h2>
        {selectedComponent ? (
          <p className="text-sm text-gray-500 mt-1">
            Editing: <span className="font-medium text-gray-700">{selectedComponent.type}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-400 mt-1">
            No component selected
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedComponent ? (
          <ParameterEditor
            component={selectedComponent}
            onParameterChange={handleParameterChange}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="text-6xl mb-4">👈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Selection</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Select a component from the canvas or add one from the component palette to edit its properties.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 text-center">
        Properties Panel V2 • Direct AtomParameters
      </div>
    </div>
  );
}
