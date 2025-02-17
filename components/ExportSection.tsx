'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ExportSectionProps {
  svgData: string;
}

export const ExportSection = ({ svgData }: ExportSectionProps) => {
  const [fileName, setFileName] = useState('merged-svg');

  const handleDownload = () => {
    if (!svgData) {
      toast.error('No SVG data to export.');
      return;
    }

    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('SVG downloaded successfully!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(svgData)
      .then(() => toast.success('SVG code copied to clipboard!'))
      .catch(() => toast.error('Failed to copy SVG code.'));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Export</h2>
      <div className="p-4 border border-gray-300 rounded-lg space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="flex-1"
          />
          <Button onClick={handleDownload}>Download SVG</Button>
        </div>
        <div className="space-y-2">
          <textarea
            value={svgData}
            readOnly
            className="w-full p-2 border rounded-lg font-mono text-sm h-40 resize-none"
            placeholder="Merged SVG code will appear here."
          />
          <Button onClick={handleCopyCode} className="w-full">
            Copy SVG Code
          </Button>
        </div>
      </div>
    </section>
  );
}; 