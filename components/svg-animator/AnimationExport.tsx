'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AnimationExportProps {
  svgData: string;
  settings: {
    speed: number;
    intensity: number;
    isPlaying: boolean;
    shapeEffect: string;
  };
}

export default function AnimationExport({ svgData, settings }: AnimationExportProps) {
  const [fileName, setFileName] = useState('animated-svg');

  const handleDownload = () => {
    if (!svgData) {
      toast.error('No SVG data to export.');
      return;
    }

    // Create a temporary container to parse the SVG
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = svgData;
    const svgElement = tempContainer.querySelector('svg');

    if (svgElement) {
      // Add the <style> tag for animations
      const style = document.createElement('style');
      style.textContent = `
        .animate-dots-breathing {
          transform-box: fill-box;
          transform-origin: center;
          animation: breathing var(--animation-speed, 2s) ease-in-out infinite;
          will-change: transform;
        }

        @keyframes breathing {
          0%, 100% { 
            transform: rotate(45deg) scale(1); 
          }
          50% { 
            transform: rotate(45deg) scale(calc(1 + (0.1 * var(--animation-intensity, 0.2)))); 
          }
        }
      `;
      svgElement.prepend(style);

      // Apply animation classes to all rect elements
      const rects = svgElement.querySelectorAll('rect');
      rects.forEach((rect) => {
        rect.classList.add('animate-dots-breathing');
      });

      // Serialize the modified SVG
      const serializer = new XMLSerializer();
      const animatedSvgData = serializer.serializeToString(svgElement);

      // Create a blob and trigger the download
      const blob = new Blob([animatedSvgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Animated SVG downloaded successfully!');
    }
  };

  const handleCopy = async () => {
    if (!svgData) {
      toast.error('No SVG data to copy.');
      return;
    }

    // Create a temporary container to parse the SVG
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = svgData;
    const svgElement = tempContainer.querySelector('svg');

    if (svgElement) {
      // Apply animation classes and styles to the SVG elements
      const dots = svgElement.querySelectorAll('path, rect');
      dots.forEach((dot, index) => {
        const element = dot as HTMLElement;

        // Remove existing animation classes
        element.classList.remove(
          'animate-dots-breathing',
          'animate-dots-wave',
          'animate-dots-rotate',
          'animate-dots-twist',
          'animate-dots-skew'
        );

        // Apply selected effect
        if (settings.shapeEffect === 'wave') {
          element.classList.add('animate-dots-wave');
        } else if (settings.shapeEffect === 'breathing') {
          element.classList.add('animate-dots-breathing');
        }

        // Set animation speed and intensity
        element.style.setProperty('--animation-speed', `${settings.speed}s`);
        element.style.setProperty('--animation-intensity', `${settings.intensity}`);
      });

      // Serialize the modified SVG
      const serializer = new XMLSerializer();
      const animatedSvgData = serializer.serializeToString(svgElement);

      // Copy the animated SVG to the clipboard
      try {
        await navigator.clipboard.writeText(animatedSvgData);
        toast.success('Animated SVG code copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy SVG code');
      }
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button onClick={handleDownload}>
        <Download className="w-4 h-4 mr-2" />
        Download Animated SVG
      </Button>
      <Button onClick={handleCopy} variant="outline">
        <Copy className="w-4 h-4 mr-2" />
        Copy Animated SVG Code
      </Button>
    </div>
  );
} 