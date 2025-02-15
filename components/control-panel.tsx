import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PresetDropdown } from '@/components/PresetDropdown'
import { savePreset, getPresets } from '@/lib/presets'
import { GradientDirection } from '@/lib/types'

type GradientPoint = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "right"

interface ControlPanelProps {
  settings: {
    gridSize: number
    dotSize: number
    brightness: number
    contrast: number
    threshold: number
    gradientStrength: number
    gradientDirection: GradientDirection
    sizeRandomization: number
  }
  onChange: (settings: ControlPanelProps["settings"]) => void
}

export default function ControlPanel({ settings, onChange }: ControlPanelProps) {
  const handleChange = (key: string, value: number | string) => {
    onChange({
      ...settings,
      [key]: value,
    })
  }

  const handleGradientDirectionChange = (value: GradientDirection) => {
    onChange({ ...settings, gradientDirection: value })
  }

  const gradientPoints: GradientPoint[] = [
    "top",
    "top-left",
    "top-right",
    "bottom",
    "bottom-left",
    "bottom-right",
    "left",
    "right",
  ]

  const handleSavePreset = (name: string) => {
    savePreset({
      name,
      gridSize: settings.gridSize,
      dotSize: settings.dotSize,
      brightness: settings.brightness,
      contrast: settings.contrast,
      threshold: settings.threshold,
      gradientStrength: settings.gradientStrength,
      gradientDirection: settings.gradientDirection,
      sizeRandomization: settings.sizeRandomization,
    })
  }

  const handleSelectPreset = (id: string) => {
    const presets = getPresets();
    const selectedPreset = presets.find((p) => p.id === id);
    if (selectedPreset) {
      onChange({
        gridSize: selectedPreset.gridSize,
        dotSize: selectedPreset.dotSize,
        brightness: selectedPreset.brightness,
        contrast: selectedPreset.contrast,
        threshold: selectedPreset.threshold,
        gradientStrength: selectedPreset.gradientStrength,
        gradientDirection: selectedPreset.gradientDirection,
        sizeRandomization: selectedPreset.sizeRandomization,
      });
    }
  }

  return (
    <div>
      <PresetDropdown onAdd={handleSavePreset} onSelect={handleSelectPreset} />
      <Card className="p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Grid Size ({settings.gridSize}px)</Label>
            <Slider
              value={[settings.gridSize]}
              min={20}
              max={100}
              step={1}
              onValueChange={(value) => handleChange("gridSize", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Dot Size ({settings.dotSize.toFixed(2)}x)</Label>
            <Slider
              value={[settings.dotSize]}
              min={0.5}
              max={2.0}
              step={0.1}
              onValueChange={(value) => handleChange("dotSize", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Brightness ({settings.brightness})</Label>
            <Slider
              value={[settings.brightness]}
              min={-100}
              max={100}
              onValueChange={(value) => handleChange("brightness", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Contrast ({settings.contrast})</Label>
            <Slider
              value={[settings.contrast]}
              min={-100}
              max={100}
              onValueChange={(value) => handleChange("contrast", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Threshold ({settings.threshold})</Label>
            <Slider
              value={[settings.threshold]}
              min={0}
              max={255}
              onValueChange={(value) => handleChange("threshold", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Gradient Strength ({settings.gradientStrength.toFixed(2)})</Label>
            <Slider
              value={[settings.gradientStrength]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handleChange("gradientStrength", value[0])}
            />
          </div>

          <div className="space-y-2">
            <Label>Gradient Direction</Label>
            <Select
              value={settings.gradientDirection}
              onValueChange={handleGradientDirectionChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-to-bottom">Top to Bottom</SelectItem>
                <SelectItem value="bottom-to-top">Bottom to Top</SelectItem>
                <SelectItem value="left-to-right">Left to Right</SelectItem>
                <SelectItem value="right-to-left">Right to Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size Randomization ({(settings.sizeRandomization || 0).toFixed(2)})</Label>
            <Slider
              value={[settings.sizeRandomization || 0]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handleChange("sizeRandomization", value[0])}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

