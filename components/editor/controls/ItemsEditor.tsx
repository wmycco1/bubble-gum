'use client';

// ═══════════════════════════════════════════════════════════════
// ITEMS EDITOR - Generic CRUD for Dynamic Component Items
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - PHASE 2: CRUD Controls for Interactive Components
// Features:
// - Add/Remove/Edit items dynamically
// - Drag & drop to reorder items
// - Generic interface for any item type
// - Title and content editing
// - Visual feedback for operations
// - Undo/Redo support via canvas-store
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Plus, Trash2, Edit2, GripVertical, Check, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BaseItem {
  id: string;
  title?: string;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

interface ItemsEditorProps<T extends BaseItem> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  itemTemplate: Omit<T, 'id'>;
  renderItemEditor: (item: T, onChange: (updates: Partial<T>) => void) => React.ReactNode;
  itemLabel?: string;
  maxItems?: number;
}

// Sortable Item Component
function SortableItem<T extends BaseItem>({
  item,
  editingItem,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  renderEditor,
  onChange,
}: {
  item: T;
  editingItem: T | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemove: () => void;
  renderEditor: (item: T, onChange: (updates: Partial<T>) => void) => React.ReactNode;
  onChange: (updates: Partial<T>) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-white transition-shadow ${
        isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
      }`}
    >
      {/* Item Header */}
      <div className="flex items-center gap-2 p-3 border-b border-slate-100">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-100 rounded transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4 text-slate-400" />
        </button>

        {/* Item Preview Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">
            {(item as { title?: string }).title ||
             (item as { label?: string }).label ||
             (item as { name?: string }).name ||
             `Item ${item.id.slice(0, 6)}`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Save"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRemove}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remove"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Item Editor (when editing) */}
      {isEditing && editingItem && (
        <div className="p-3 bg-slate-50">
          {renderEditor(editingItem, (updates) => {
            console.log('🔥 Input onChange fired in SortableItem!', updates);
            onChange(updates);
          })}
        </div>
      )}
    </div>
  );
}

export function ItemsEditor<T extends BaseItem>({
  items,
  onItemsChange,
  itemTemplate,
  renderItemEditor,
  itemLabel = 'Item',
  maxItems,
}: ItemsEditorProps<T>) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add new item
  const handleAdd = () => {
    const newItem = {
      ...itemTemplate,
      id: `item-${Date.now()}`,
    } as T;

    onItemsChange([...items, newItem]);
    setEditingId(newItem.id);
    setEditingItem(newItem);
  };

  // Start editing
  const handleEdit = (item: T) => {
    console.log('✏️ ItemsEditor: handleEdit called', { itemId: item.id });
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  // Save editing
  const handleSave = () => {
    if (!editingItem) return;

    const updatedItems = items.map((item) =>
      item.id === editingId ? editingItem : item
    );
    onItemsChange(updatedItems);
    setEditingId(null);
    setEditingItem(null);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  // Remove item
  const handleRemove = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    onItemsChange(updatedItems);
  };

  // Update editing item
  const handleEditingChange = (updates: Partial<T>) => {
    console.log('📝 ItemsEditor: handleEditingChange called', { updates, editingItem });
    if (!editingItem) return;
    setEditingItem({ ...editingItem, ...updates });
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    onItemsChange(reorderedItems);
  };

  const canAdd = !maxItems || items.length < maxItems;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">
            {itemLabel}s
          </span>
          <span className="text-xs text-slate-500">
            ({items.length}{maxItems ? `/${maxItems}` : ''})
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            canAdd
              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              : 'text-slate-400 cursor-not-allowed'
          }`}
          title={canAdd ? `Add ${itemLabel}` : `Maximum ${maxItems} items reached`}
        >
          <Plus className="w-3.5 h-3.5" />
          Add {itemLabel}
        </button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="text-xs text-slate-400 text-center py-8 border border-dashed border-slate-200 rounded-lg">
          No {itemLabel.toLowerCase()}s yet. Click "Add {itemLabel}" to create one.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  editingItem={editingId === item.id ? editingItem : null}
                  isEditing={editingId === item.id}
                  onEdit={() => handleEdit(item)}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onRemove={() => handleRemove(item.id)}
                  renderEditor={renderItemEditor}
                  onChange={handleEditingChange}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Info */}
      <div className="text-[10px] text-slate-500 flex items-center gap-1">
        <GripVertical className="w-3 h-3" />
        Drag items to reorder
      </div>
    </div>
  );
}
