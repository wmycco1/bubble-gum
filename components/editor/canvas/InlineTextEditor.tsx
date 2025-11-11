'use client';

/**
 * InlineTextEditor - Figma-style inline text editing for canvas components
 *
 * Features:
 * - Double-click to activate editing
 * - contentEditable for seamless editing
 * - Transparent background - edit directly on component
 * - Save on blur or Enter key
 * - Escape to cancel
 * - Positioned directly over component text
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCanvasStore } from '@/lib/editor/canvas-store';

interface InlineTextEditorProps {
  componentId: string;
  initialText: string;
  onSave: (newText: string) => void;
  onCancel: () => void;
  rect: DOMRect; // Position/size of the component being edited
}

export function InlineTextEditor({
  componentId,
  initialText,
  onSave,
  onCancel,
  rect,
}: InlineTextEditorProps) {
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-focus and select all text
    if (editableRef.current) {
      editableRef.current.focus();

      // Select all text in contentEditable
      const range = document.createRange();
      range.selectNodeContents(editableRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  const handleSave = () => {
    const newText = editableRef.current?.innerText.trim() || '';
    if (newText !== initialText && newText !== '') {
      onSave(newText);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
    >
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        style={{
          width: '100%',
          height: '100%',
          padding: '0', // Без padding - используем padding Badge
          fontSize: 'inherit',
          fontFamily: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
          backgroundColor: 'transparent', // Полностью прозрачный
          border: 'none', // Без границы
          borderRadius: '0',
          outline: '2px solid #3b82f6', // Тонкий outline для индикации редактирования
          outlineOffset: '-2px',
          cursor: 'text',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {initialText}
      </div>
    </div>
  );
}
