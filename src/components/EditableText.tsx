"use client";

import React, { useState } from 'react';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { Edit3 } from 'lucide-react';

interface EditableTextProps {
  value: string;
  path: string;
  multiline?: boolean;
  className?: string;
  tagName?: React.ElementType;
}

export default function EditableText({ value, path, multiline, className, tagName: Tag = "span" }: EditableTextProps) {
  const { isEditMode, updateDraft, draftConfig } = useVisualEditor();
  const [isEditing, setIsEditing] = useState(false);

  // Resolve current value from draftConfig based on path
  const keys = path.split('.');
  let resolvedText = draftConfig;
  for (const key of keys) {
      resolvedText = resolvedText?.[key];
  }
  const currentText = (resolvedText !== undefined && resolvedText !== null) ? resolvedText : value;

  const [localValue, setLocalValue] = useState(currentText);

  // Update local value if draftConfig changes (e.g. after refresh or publish)
  React.useEffect(() => {
    setLocalValue(currentText);
  }, [currentText]);

  if (!isEditMode) {
    return React.createElement(Tag as any, { className }, currentText);
  }

  const handleBlur = () => {
    setIsEditing(false);
    updateDraft(path, localValue);
  };

  return (
    <span className={`relative group/edit inline-block ${Tag === 'span' ? '' : 'w-full'}`}>
      {isEditing ? (
        multiline ? (
          <textarea
            autoFocus
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className={`w-full bg-white/5 border border-cyan-500 rounded-xl p-4 text-inherit font-inherit outline-none focus:ring-2 ring-cyan-500/30 ${className}`}
          />
        ) : (
          <input
            autoFocus
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={handleBlur}
            className={`w-full bg-white/5 border border-cyan-500 rounded-xl px-2 py-1 text-inherit font-inherit outline-none ${className}`}
          />
        )
      ) : (
        <span 
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className={`cursor-pointer border border-transparent hover:border-[#d4af37]/50 hover:border-dashed hover:bg-[#d4af37]/5 rounded-xl transition-all relative ${className}`}
        >
          {Tag === 'span' ? localValue : React.createElement(Tag as any, {}, localValue)}
          <span className="absolute top-0 right-0 -translate-y-full p-1 bg-[#d4af37] text-black rounded-t-lg opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center gap-1 shadow-lg pointer-events-none">
            <Edit3 size={10} /> <span className="text-[8px] font-black uppercase tracking-tight">Edit</span>
          </span>
        </span>
      )}
    </span>
  );
}
