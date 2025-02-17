'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

interface TweakSectionProps {
  uploadedFiles: File[];
  groupIds: string[];
  visibility?: boolean[];
  onGroupIdChange: (index: number, groupId: string) => void;
  onVisibilityChange: (index: number, isVisible: boolean) => void;
}

export const TweakSection = ({
  uploadedFiles,
  groupIds,
  visibility = [],
  onGroupIdChange,
  onVisibilityChange,
}: TweakSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Tweak SVGs</h2>
      <div className="p-4 border border-gray-300 rounded-lg">
        {uploadedFiles.map((file, index) => (
          <div key={file.name} className="flex items-center space-x-2 mb-2">
            <span className="text-sm">{file.name}</span>
            <input
              type="text"
              value={groupIds[index]}
              onChange={(e) => onGroupIdChange(index, e.target.value)}
              className="text-sm border rounded px-2 py-1 w-32"
              placeholder="Group ID"
            />
            <Checkbox
              checked={visibility[index] || false}
              onCheckedChange={(checked) => onVisibilityChange(index, !!checked)}
              className="ml-2"
            />
            {visibility[index] ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </div>
        ))}
      </div>
    </section>
  );
}; 