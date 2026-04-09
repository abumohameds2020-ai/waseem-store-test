"use client";

import React, { useRef, useState } from 'react';
import { useVisualEditor } from '@/context/VisualEditorContext';
import { ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditableImageProps {
  src: string;
  path: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function EditableImage({ src, path, alt, className, width, height }: EditableImageProps) {
  const { isEditMode, updateDraft, draftConfig } = useVisualEditor();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resolve current src from draftConfig based on path
  const keys = path.split('.');
  let resolvedSrc = draftConfig;
  for (const key of keys) {
      resolvedSrc = resolvedSrc?.[key];
  }
  const currentSrc = resolvedSrc || src;

  if (!isEditMode) {
    return <img src={currentSrc} alt={alt} className={className} width={width} height={height} />;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      updateDraft(path, data.url);
      toast.success('Asset deployed to mission control');
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Neural uplink failed. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group/image ${className} overflow-hidden`}>
      <img 
        src={currentSrc} 
        alt={alt} 
        className={`w-full h-full object-cover transition-all ${isUploading ? 'opacity-50 grayscale' : ''}`} 
      />
      
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 cursor-pointer backdrop-blur-sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-16 h-16 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
           {isUploading ? <Loader2 className="animate-spin" size={32} /> : <UploadCloud size={32} />}
        </div>
        <div className="text-center px-4">
           <span className="block text-white font-black uppercase tracking-widest text-xs mb-1">Replace Asset</span>
           <span className="block text-[#d4af37] text-[8px] font-bold uppercase tracking-[0.2em]">Deployment Required</span>
        </div>
      </div>

      {/* Golden Border Frame */}
      <div className="absolute inset-0 border-2 border-transparent group-hover/image:border-[#d4af37] border-dashed rounded-lg pointer-events-none transition-all" />

      {/* Hidden File Input */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
