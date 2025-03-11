"use client";

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface AnimationControlsProps {
  settings: {
    speed: number;
    intensity: number;
    isPlaying: boolean;
  };
  onChange: (settings: any) => void;
}

export default function AnimationControls({ settings, onChange }: AnimationControlsProps) {
  const handleChange = (key: string, value: any) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Speed ({settings.speed.toFixed(1)})</label>
        <Slider
          value={[settings.speed]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={([value]) => handleChange('speed', value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Intensity ({settings.intensity.toFixed(1)})</label>
        <Slider
          value={[settings.intensity]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={([value]) => handleChange('intensity', value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleChange('isPlaying', !settings.isPlaying)}
          className="w-full"
        >
          {settings.isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
          {settings.isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  );
} 