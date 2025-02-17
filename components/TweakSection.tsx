'use client';

import { Eye, EyeOff } from 'lucide-react';

interface TweakSectionProps {
  uploadedFiles: File[];
  groupIds: string[];
  visibility: boolean[];
  onGroupIdChange: (index: number, groupId: string) => void;
  onVisibilityChange: (index: number, isVisible: boolean) => void;
}

export const TweakSection = ({
  uploadedFiles,
  groupIds,
  visibility,
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
            <button
              onClick={() => onVisibilityChange(index, !visibility[index])}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {visibility[index] ? (
                <Eye className="w-4 h-4 text-gray-700" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}; 