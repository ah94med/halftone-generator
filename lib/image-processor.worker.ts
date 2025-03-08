import { GradientDirection } from '@/lib/types';

type GradientPoint = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right" | "left" | "right"

interface Settings {
  gridSize: number
  dotSize: number
  brightness: number
  contrast: number
  threshold: number
  gradientStrength: number
  gradientDirection: GradientDirection
  sizeRandomization: number
}

const getGradientFactor = (
  x: number,
  y: number,
  width: number,
  height: number,
  gradientDirection: GradientDirection,
): number => {
  switch (gradientDirection) {
    case 'top-to-bottom':
      return y / height; // 0 at top, 1 at bottom
    case 'bottom-to-top':
      return 1 - y / height; // 1 at top, 0 at bottom
    case 'left-to-right':
      return x / width; // 0 at left, 1 at right
    case 'right-to-left':
      return 1 - x / width; // 1 at left, 0 at right
    default:
      return 0;
  }
}

// const getGradientFactor = (
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   pointA: GradientPoint,
//   pointB: GradientPoint,
// ): number => {
//   const getPointValue = (point: GradientPoint, x: number, y: number, width: number, height: number): number => {
//     switch (point) {
//       case "top":
//         return 1 - y / height
//       case "top-left":
//         return 1 - (x / width + y / height) / 2
//       case "top-right":
//         return 1 - ((width - x) / width + y / height) / 2
//       case "bottom":
//         return y / height
//       case "bottom-left":
//         return (x / width + y / height) / 2
//       case "bottom-right":
//         return ((width - x) / width + y / height) / 2
//       case "left":
//         return 1 - x / width
//       case "right":
//         return x / width
//       default:
//         return 0
//     }
//   }

//   const valueA = getPointValue(pointA, x, y, width, height)
//   const valueB = getPointValue(pointB, x, y, width, height)
//   return (valueA + valueB) / 2
// }

const generateDetailedSVG = (shapes: Array<{ x: number, y: number, size: number }>, width: number, height: number): string => {
  const svgElements = shapes.map(shape => `
    <rect
      x="${shape.x - shape.size / 2}"
      y="${shape.y - shape.size / 2}"
      width="${shape.size}"
      height="${shape.size}"
      transform="rotate(45 ${shape.x} ${shape.y})"
      fill="#0000FF"
    />
  `);

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${svgElements.join("\n")}
    </svg>
  `;
};

const processImage = (imageData: ImageData, settings: Settings) => {
  const { width, height, data } = imageData
  const { gridSize, dotSize, brightness, contrast, threshold, gradientStrength, gradientDirection, sizeRandomization } = settings

  // Create new array for processed data
  const processedData = new Uint8ClampedArray(data.length)
  let pathData = '' // Store all diamond paths here
  const shapes: Array<{ x: number, y: number, size: number }> = []

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
      let adjustedBrightness = avgBrightness + brightness
      adjustedBrightness = ((adjustedBrightness - 128) * (contrast + 100)) / 100 + 128

      if (adjustedBrightness >= threshold) {
        // Calculate dot size based on brightness and gradient
        const normalizedBrightness = (255 - adjustedBrightness) / 255
        const baseSize = gridSize * dotSize * normalizedBrightness

        // Apply gradient
        const gradientFactor = getGradientFactor(x, y, width, height, gradientDirection)
        let finalSize = baseSize * (1 - gradientStrength * (1 - gradientFactor))

        // Apply size randomization
        if (sizeRandomization > 0) {
          const randomFactor = 1 + (Math.random() - 0.5) * 2 * sizeRandomization
          finalSize *= randomFactor
        }

        // Add diamond to path data
        const centerX = x + gridSize / 2
        const centerY = y + gridSize / 2
        const halfSize = finalSize / 2

        // Diamond path: M (start), L (line to), Z (close path)
        pathData += `M${centerX - halfSize},${centerY} L${centerX},${centerY - halfSize} L${centerX + halfSize},${centerY} L${centerX},${centerY + halfSize} Z `

        shapes.push({
          x: centerX,
          y: centerY,
          size: finalSize
        });

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
      } else {
        // If below threshold, set to white
        for (let dy = 0; dy < gridSize && y + dy < height; dy++) {
          for (let dx = 0; dx < gridSize && x + dx < width; dx++) {
            const i = ((y + dy) * width + (x + dx)) * 4
            processedData[i] = 255 // R
            processedData[i + 1] = 255 // G
            processedData[i + 2] = 255 // B
            processedData[i + 3] = 255 // A
          }
        }
      }
    }
  }

  const singlePathSVG = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathData.trim()}" fill="#0000FF" />
    </svg>
  `;

  const detailedSVG = generateDetailedSVG(shapes, width, height);

  return {
    processedImageData: new ImageData(processedData, width, height),
    svgData: singlePathSVG,
    detailedSvgData: detailedSVG
  }
}

// Handle messages from main thread
self.onmessage = (e: MessageEvent) => {
  const { imageData, settings } = e.data
  const result = processImage(imageData, settings)
  self.postMessage(result)
}

