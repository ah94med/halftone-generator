'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadSectionProps {
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
  uploadedFiles: File[];
}

export const UploadSection = ({
  onUpload,
  onRemove,
  uploadedFiles,
}: UploadSectionProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
    }
  };

  const handleRemove = (index: number) => {
    onRemove(index);
    toast.success('File removed successfully.');
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Upload SVGs</h2>
      <div className="p-4 border border-dashed border-gray-300 rounded-lg">
        <input
          type="file"
          multiple
          accept=".svg"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer block text-center text-gray-500 hover:text-gray-700"
        >
          Drag and drop SVG files here or click to upload.
        </label>
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <span className="text-sm">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 