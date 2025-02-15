import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { savePreset, getPresets } from '@/lib/presets';
import { useState, useEffect } from 'react';

interface PresetDropdownProps {
  onAdd: (name: string) => void;
  onSelect: (value: string) => void;
}

export const PresetDropdown = ({ onAdd, onSelect }: PresetDropdownProps) => {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    setPresets(getPresets());
  }, []);

  const handleSavePreset = () => {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
      onAdd(presetName);
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a preset" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleSavePreset} variant="default" className="bg-green-600 hover:bg-green-700">
        Save Preset
      </Button>
    </div>
  );
}; 