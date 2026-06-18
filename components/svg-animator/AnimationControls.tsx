"use client";

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { PresetsDropdown } from "@/components/svg-animator/PresetsDropdown";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AnimationControlsProps {
  settings: {
    speed: number;
    intensity: number;
    isPlaying: boolean;
    animationType: 'scale' | 'rotate';
    rotationSpeed: number;
  };
  onChange: (settings: any) => void;
}

export default function AnimationControls({ settings, onChange }: AnimationControlsProps) {
  const handleChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    
    // Ensure rotationSpeed is always defined
    if (key === 'animationType' && value === 'rotate' && !newSettings.rotationSpeed) {
      newSettings.rotationSpeed = 2;
    }
    
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <PresetsDropdown onSelect={(preset) => {
        switch (preset) {
          case "breathing":
            onChange({ 
              ...settings, 
              animationType: 'scale',
              speed: 2,
              intensity: 0.5,
              isPlaying: true
            });
            break;
          case "rotate":
            onChange({
              ...settings,
              animationType: 'rotate',
              rotationSpeed: 2,
              isPlaying: true
            });
            break;
          default:
            break;
        }
      }} />

      {/* Animation Type Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Animation Type</label>
        <div className="flex gap-2">
          <Button
            variant={settings.animationType === 'scale' ? 'default' : 'outline'}
            onClick={() => handleChange('animationType', 'scale')}
            className="flex-1"
          >
            Scale
          </Button>
          <Button
            variant={settings.animationType === 'rotate' ? 'default' : 'outline'}
            onClick={() => handleChange('animationType', 'rotate')}
            className="flex-1"
          >
            Rotate
          </Button>
        </div>
      </div>

      {/* Scale Animation Controls */}
      {settings.animationType === 'scale' && (
        <>
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
        </>
      )}

      {/* Rotation Animation Controls */}
      {settings.animationType === 'rotate' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Rotation Speed ({(settings.rotationSpeed || 2).toFixed(1)}s)
          </label>
          <Slider
            value={[settings.rotationSpeed || 2]}
            min={0.5}
            max={5}
            step={0.1}
            onValueChange={([value]) => handleChange('rotationSpeed', value)}
          />
        </div>
      )}

      {/* Play/Pause Controls */}
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