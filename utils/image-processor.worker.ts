const processImage = async (
  imageData: ImageData,
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
  },
) => {
  const { width, height, data } = imageData
  const { gridSize, dotSize, brightness, contrast, threshold, gradient } = settings

  // Create new array for processed data
  const processedData = new Uint8ClampedArray(data.length)
  const svgElements: string[] = []

  // Process image data
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      // Get average brightness of grid cell
      let totalBrightness = 0
      let samples = 0

      for (let dy = 0; dy < gridSize && y + dy < height; dy++) {
        for (let dx = 0; dx < gridSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          totalBrightness += (r + g + b) / 3
          samples++
        }
      }

      const avgBrightness = totalBrightness / samples

      // Apply brightness, contrast, and threshold
      let adjustedBrightness = avgBrightness
      adjustedBrightness += brightness
      adjustedBrightness = ((adjustedBrightness - 128) * (contrast + 100)) / 100 + 128

      if (adjustedBrightness >= threshold) {
        // Calculate dot size based on brightness and gradient
        const normalizedBrightness = (255 - adjustedBrightness) / 255
        const baseSize = gridSize * dotSize * normalizedBrightness

        // Apply gradient multipliers
        const yGradient = y < height / 2 ? gradient.up : gradient.down
        const xGradient = x < width / 2 ? gradient.left : gradient.right
        const finalSize = baseSize * yGradient * xGradient

        // Add diamond to SVG elements
        const centerX = x + gridSize / 2
        const centerY = y + gridSize / 2

        svgElements.push(`
          <rect
            x="${centerX - finalSize / 2}"
            y="${centerY - finalSize / 2}"
            width="${finalSize}"
            height="${finalSize}"
            transform="rotate(45 ${centerX} ${centerY})"
            fill="#0000FF"
          />
        `)

        // Draw preview on canvas
        for (let dy = 0; dy < gridSize && y + dy < height; dy++) {
          for (let dx = 0; dx < gridSize && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4
            const isInDiamond = Math.abs(dx - gridSize / 2) + Math.abs(dy - gridSize / 2) < finalSize / 2
            processedData[i] = isInDiamond ? 0 : 255 // R
            processedData[i + 1] = isInDiamond ? 0 : 255 // G
            processedData[i + 2] = isInDiamond ? 255 : 255 // B
            processedData[i + 3] = 255 // A
          }
        }
      }
    }
  }

  // Generate SVG document
  const svgData = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${svgElements.join("\n")}
    </svg>
  `

  return {
    processedImageData: new ImageData(processedData, width, height),
    svgData,
  }
}

// Handle messages from main thread
self.onmessage = async (e) => {
  const { imageData, settings } = e.data
  const result = await processImage(imageData, settings)
  self.postMessage(result)
}

