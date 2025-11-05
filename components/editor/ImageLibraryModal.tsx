'use client';

// ═══════════════════════════════════════════════════════════════
// IMAGE LIBRARY MODAL - MVP VERSION
// ═══════════════════════════════════════════════════════════════
// MVP: URL input for adding images
// Future: Unsplash API integration, Upload functionality
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { X } from 'lucide-react';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

export function ImageLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
}: ImageLibraryModalProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  if (!isOpen) return null;

  const handlePreview = () => {
    if (imageUrl.trim()) {
      setPreviewUrl(imageUrl.trim());
    }
  };

  const handleSelect = () => {
    if (previewUrl) {
      onSelectImage(previewUrl);
      setImageUrl('');
      setPreviewUrl('');
      onClose();
    }
  };

  const handleClose = () => {
    setImageUrl('');
    setPreviewUrl('');
    onClose();
  };

  // Sample images for quick selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
    'https://images.unsplash.com/photo-1484100356142-db6ab6244067?w=800',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Image Library
            </h2>
            <p className="text-sm text-slate-600">
              Add image URL or select from samples
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload from Local Disk */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Upload from Computer
            </label>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result as string;
                      setImageUrl(base64);
                      setPreviewUrl(base64);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-700"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Select JPG, PNG, GIF, WebP from your computer
            </p>
          </div>

          {/* URL Input Section */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Or Enter Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePreview();
                  }
                }}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              />
              <button
                onClick={handlePreview}
                disabled={!imageUrl.trim()}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Preview
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Enter a URL to any image (JPG, PNG, GIF, WebP, etc.)
            </p>
          </div>

          {/* Preview Section */}
          {previewUrl && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Preview
                </span>
                <button
                  onClick={handleSelect}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  ✓ Use This Image
                </button>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-md bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={() => {
                    setPreviewUrl('');
                    alert('Failed to load image. Please check the URL and try again.');
                  }}
                />
              </div>
            </div>
          )}

          {/* Sample Images Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700">
                Sample Images
              </h3>
              <span className="text-xs text-slate-500">
                Click to select
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {sampleImages.map((url, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setImageUrl(url);
                    setPreviewUrl(url);
                  }}
                  className="group relative aspect-video overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100 transition-all hover:border-slate-900 hover:shadow-lg"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Sample ${index + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity group-hover:bg-opacity-20" />
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-1 text-sm font-medium text-blue-900">
              💡 Coming Soon
            </h4>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Unsplash integration (search millions of free images)</li>
              <li>• Upload your own images</li>
              <li>• Image management (organize, delete, rename)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
