"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Download, ImageIcon } from "lucide-react"
import ImageProcessor from "@/components/image-processor"
import ControlPanel from "@/components/control-panel"
import { debounce } from "@/lib/debounce"

type GradientPoint = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "right"

export default function HalftoneConverter() {
  const [image, setImage] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    gridSize: 30,
    dotSize: 1.0,
    brightness: 0,
    contrast: 0,
    threshold: 128,
    gradientStrength: 0.5,
    gradientPointA: "top" as GradientPoint,
    gradientPointB: "bottom" as GradientPoint,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSettingsChange = useCallback(
    debounce((newSettings: typeof settings) => {
      setSettings(newSettings)
    }, 150),
    [],
  )

  const downloadSVG = () => {
    if (!canvasRef.current) return
    const svgData = canvasRef.current.getAttribute("data-svg")
    if (svgData) {
      const blob = new Blob([svgData], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "halftone.svg"
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const downloadPNG = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "halftone.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Card className="p-6">
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Halftone Pattern Generator</h1>
            <div className="flex gap-2">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <input ref={fileInputRef} type="file" accept="image/png" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {image ? (
                <ImageProcessor ref={canvasRef} image={image} settings={settings} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p>Upload a PNG image to begin</p>
                  </div>
                </div>
              )}
            </div>

            <ControlPanel settings={settings} onChange={handleSettingsChange} />
          </div>

          {image && (
            <div className="flex gap-2 justify-end">
              <Button onClick={downloadPNG} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
              <Button onClick={downloadSVG}>
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

