"use client"

import type React from "react"
import { forwardRef, useEffect, useRef } from "react"

interface ImageProcessorProps {
  image: string
  settings: {
    gridSize: number
    dotSize: number
    brightness: number
    contrast: number
    threshold: number
    gradient: {
      up: number
      down: number
      left: number
      right: number
    }
  }
}

const ImageProcessor = forwardRef<HTMLCanvasElement, ImageProcessorProps>(({ image, settings }, ref) => {
  const workerRef = useRef<Worker>()

  useEffect(() => {
    if (typeof window === "undefined") return

    // Initialize Web Worker
    workerRef.current = new Worker(new URL("../lib/image-processor.worker.ts", import.meta.url))

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    const canvas = ref as React.MutableRefObject<HTMLCanvasElement>
    if (!canvas.current || !image) return

    const ctx = canvas.current.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = image
    img.onload = () => {
      // Set canvas size to match image
      canvas.current.width = img.width
      canvas.current.height = img.height

      // Draw original image
      ctx.drawImage(img, 0, 0)

      // Get image data
      const imageData = ctx.getImageData(0, 0, img.width, img.height)

      // Process image in Web Worker
      workerRef.current?.postMessage({
        imageData,
        settings,
      })

      // Handle processed data from worker
      workerRef.current!.onmessage = (e) => {
        const { processedImageData, svgData } = e.data
        ctx.putImageData(processedImageData, 0, 0)

        // Store SVG data for download
        canvas.current.setAttribute("data-svg", svgData)
      }
    }
  }, [image, settings, ref])

  return <canvas ref={ref} className="w-full h-full" />
})

ImageProcessor.displayName = "ImageProcessor"

export default ImageProcessor

