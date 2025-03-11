'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AnimationExportProps {
  svgData: string;
}

export default function AnimationExport({ svgData }: AnimationExportProps) {
  const [fileName, setFileName] = useState('animated-svg');

  const handleDownload = () => {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded successfully!');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgData);
      toast.success('SVG code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy SVG code');
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        Download SVG
      </Button>
      <Button onClick={handleCopy} variant="outline">
        <Copy className="w-4 h-4 mr-2" />
        Copy SVG Code
      </Button>
    </div>
  );
} 