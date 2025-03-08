'use client';

import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff } from 'lucide-react';

interface TweakSectionProps {
  uploadedFiles: File[];
  groupIds: string[];
  visibility: boolean[];
  scales: number[];
  xPositions: number[];
  yPositions: number[];
  onGroupIdChange: (index: number, groupId: string) => void;
  onVisibilityChange: (index: number, isVisible: boolean) => void;
  onScaleChange: (index: number, scale: number) => void;
  onXPositionChange: (index: number, x: number) => void;
  onYPositionChange: (index: number, y: number) => void;
}

export const TweakSection = ({
  uploadedFiles,
  groupIds,
  visibility,
  scales,
  xPositions,
  yPositions,
  onGroupIdChange,
  onVisibilityChange,
  onScaleChange,
  onXPositionChange,
  onYPositionChange,
}: TweakSectionProps) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Tweak SVGs</h2>
      <div className="p-4 border border-gray-300 rounded-lg">
        {uploadedFiles.map((file, index) => (
          <div key={file.name} className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
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

            {/* Scale Control */}
            <div>
              <label className="block text-sm font-medium mb-2">Scale</label>
              <Slider
                value={[scales[index]]}
                onValueChange={([value]) => onScaleChange(index, value)}
                min={0.5}
                max={2}
                step={0.1}
              />
            </div>

            {/* X Position Control */}
            <div>
              <label className="block text-sm font-medium mb-2">X Position</label>
              <Slider
                value={[xPositions[index]]}
                onValueChange={([value]) => onXPositionChange(index, value)}
                min={-500}
                max={500}
                step={10}
              />
            </div>

            {/* Y Position Control */}
            <div>
              <label className="block text-sm font-medium mb-2">Y Position</label>
              <Slider
                value={[yPositions[index]]}
                onValueChange={([value]) => onYPositionChange(index, value)}
                min={-500}
                max={500}
                step={10}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}; 