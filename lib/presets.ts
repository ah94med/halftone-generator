import { GradientDirection, Preset } from '@/lib/types';


export const DEFAULT_PRESET: Preset = {
  id: 'default',
  name: 'Default',
  gridSize: 30,
  dotSize: 1.0,
  brightness: 0,
  contrast: 0,
  threshold: 128,
  gradientStrength: 0.5,
  gradientDirection: 'top-to-bottom',
  sizeRandomization: 0,
};

export const savePreset = (preset: Omit<Preset, 'id'>) => {
  if (typeof window === 'undefined') return;
  
  const id = crypto.randomUUID();
  const presets = JSON.parse(localStorage.getItem('presets') || '[]');
  presets.push({ ...preset, id });
  localStorage.setItem('presets', JSON.stringify(presets));
};

export const getPresets = (): Preset[] => {
  if (typeof window === 'undefined') return [DEFAULT_PRESET];
  
  const savedPresets = JSON.parse(localStorage.getItem('presets') || '[]');
  return [DEFAULT_PRESET, ...savedPresets];
}; 