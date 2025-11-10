'use client';

import React from 'react';
import * as Atoms from '../../../src/components/atoms';
import * as Molecules from '../../../src/components/molecules';
import * as Organisms from '../../../src/components/organisms';
import * as Templates from '../../../src/components/templates';

const COMPONENT_REGISTRY = {
  atoms: Object.keys(Atoms),
  molecules: Object.keys(Molecules),
  organisms: Object.keys(Organisms),
  templates: Object.keys(Templates),
  pages: [], // Future
};

interface ComponentSelectorProps {
  activeTab: 'atoms' | 'molecules' | 'organisms' | 'templates' | 'pages';
  onComponentSelect: (componentType: string) => void;
}

export function ComponentSelector({ activeTab, onComponentSelect }: ComponentSelectorProps) {
  const components = COMPONENT_REGISTRY[activeTab];

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">{activeTab}</h3>
      <div className="grid grid-cols-2 gap-2">
        {components.map((componentName) => (
          <button
            key={componentName}
            onClick={() => onComponentSelect(componentName)}
            className="p-3 text-left text-sm border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="font-medium text-gray-900">{componentName}</div>
            <div className="text-xs text-gray-500 mt-1">Click to add</div>
          </button>
        ))}
      </div>
    </div>
  );
}
