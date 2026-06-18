"use client";

import { useEffect, useRef } from 'react';

interface AnimationPreviewProps {
  svgData: string;
  settings: {
    speed: number;
    intensity: number;
    isPlaying: boolean;
    animationType: string;
    rotationSpeed: number;
  };
}

export default function AnimationPreview({ svgData, settings }: AnimationPreviewProps) {
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgRef.current && svgData) {
      console.log('Rendering SVG...');
      svgRef.current.innerHTML = svgData;
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        console.log('SVG element found:', svgElement);
        
        // Set SVG dimensions
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Get all dots (paths and rects)
        const dots = svgElement.querySelectorAll('path, rect');
        console.log(`Found ${dots.length} dots`);
        
        dots.forEach((dot, index) => {
          const element = dot as HTMLElement;
          
          // Remove all animation classes
          element.classList.remove(
            'animate-dots-breathing',
            'animate-dots-breathing-rotate',
            'animate-dots-rotate',
            'animate-dots-rotate-45'
          );

          // Apply new animation based on selected type
          if (settings.animationType === 'rotate') {
            // Apply appropriate rotation animation based on element type
            if (element.tagName === 'rect') {
              element.classList.add('animate-dots-rotate-45');
            } else {
              element.classList.add('animate-dots-rotate');
            }
          } else {
            // Apply breathing animation based on element type
            const hasRotation = element.getAttribute('transform')?.includes('rotate') || 
                              element.style.transform?.includes('rotate');
            
            if (hasRotation || element.tagName === 'rect') {
              element.classList.add('animate-dots-breathing-rotate');
            } else {
              element.classList.add('animate-dots-breathing');
            }
          }

          // Set animation properties
          element.style.setProperty('--animation-speed', `${settings.speed}s`);
          element.style.setProperty('--animation-intensity', `${settings.intensity}`);
          element.style.setProperty('--rotation-speed', `${settings.rotationSpeed || 2}s`);
          element.style.setProperty('--index', `${index}`);
          
          // Control animation play state
          element.style.animationPlayState = settings.isPlaying ? 'running' : 'paused';
        });
      }
    }
  }, [svgData, settings]);

  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
      <div ref={svgRef} className="w-full h-full" />
    </div>
  );
} 