export type GradientDirection = 'top-to-bottom' | 'bottom-to-top' | 'left-to-right' | 'right-to-left';

export interface Preset {
  id: string;
  name: string;
  gridSize: number;
  dotSize: number;
  brightness: number;
  contrast: number;
  threshold: number;
  gradientStrength: number;
  gradientDirection: GradientDirection;
  sizeRandomization: number;
}

export interface Settings {
  gridSize: number;
  dotSize: number;
  brightness: number;
  contrast: number;
  threshold: number;
  gradientStrength: number;
  gradientDirection: GradientDirection;
  sizeRandomization: number;
}
