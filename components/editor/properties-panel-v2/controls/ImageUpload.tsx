'use client';

// ═══════════════════════════════════════════════════════════════
// IMAGE UPLOAD - Professional Image Selection Component
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0 - M1: Universal Styling System
// Features:
// - Drag & drop file upload
// - Browse button (file input)
// - URL input
// - Image Library button (integrate existing modal)
// - Preview with remove button
// - Support: JPG, PNG, WebP, GIF, SVG
// - File size validation (max 5MB)
// - Base64 encoding for inline images
// ═══════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onOpenLibrary?: () => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
}

const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Convert file to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate file size and type
 */
function validateFile(file: File, accept: string, maxSize: number): string | null {
  // Check file type
  const acceptedTypes = accept.split(',').map(t => t.trim());
  const isValidType = acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return file.type.startsWith(`${prefix}/`);
    }
    return file.type === type;
  });

  if (!isValidType) {
    return `Invalid file type. Accepted: ${accept}`;
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return `File too large: ${fileSizeMB}MB (max: ${maxSizeMB}MB)`;
  }

  return null;
}

export function ImageUpload({
  value = '',
  onChange,
  onOpenLibrary,
  label,
  accept = DEFAULT_ACCEPT,
  maxSize = DEFAULT_MAX_SIZE,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      // Validate file
      const validationError = validateFile(file, accept, maxSize);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Convert to base64
      const base64 = await fileToBase64(file);
      onChange(base64);
      setShowUrlInput(false);
    } catch (err) {
      setError('Failed to process image');
      console.error('Image upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const imageFile = files[0];
    if (imageFile) {
      await handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFile = files[0];
    if (imageFile) {
      await handleFileSelect(imageFile);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
      setError(null);
    } catch {
      setError('Invalid URL format');
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    setError(null);
  };

  const hasImage = !!value;

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      {/* Preview or Upload Area */}
      {hasImage ? (
        /* Image Preview */
        <div className="relative">
          <div className="rounded-lg border-2 border-slate-300 overflow-hidden bg-slate-100">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={() => setError('Failed to load image')}
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }`}
        >
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-200 mb-3">
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600" />
              ) : (
                <Upload className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <div className="text-sm font-medium text-slate-900 mb-1">
              {isDragging ? 'Drop image here' : 'Drop image or click to browse'}
            </div>
            <div className="text-xs text-slate-600 mb-4">
              JPG, PNG, WebP, GIF, SVG (max {(maxSize / (1024 * 1024)).toFixed(1)}MB)
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={handleBrowseClick}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImageIcon className="w-4 h-4 inline-block mr-2" />
                Browse
              </button>

              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                disabled={isLoading}
                className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LinkIcon className="w-4 h-4 inline-block mr-2" />
                URL
              </button>

              {onOpenLibrary && (
                <button
                  onClick={onOpenLibrary}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ImageIcon className="w-4 h-4 inline-block mr-2" />
                  Library
                </button>
              )}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* URL Input (collapsible) */}
      {showUrlInput && !hasImage && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-300 bg-white">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 rounded-md border border-slate-300 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          />
          <button
            onClick={handleUrlSubmit}
            className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-900 font-medium">Error</p>
            <p className="text-xs text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {!error && !hasImage && (
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-xs text-blue-900">
            💡 Tip: You can drag and drop an image, browse from your computer, paste a URL, or select from the library.
          </p>
        </div>
      )}
    </div>
  );
}
