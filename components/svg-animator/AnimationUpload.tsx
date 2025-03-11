'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface AnimationUploadProps {
  onUpload: (files: File[]) => void;
}

export default function AnimationUpload({ onUpload }: AnimationUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(Array.from(files));
    }
  };

  return (
    <div className="flex justify-end">
      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Upload SVG
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
} 