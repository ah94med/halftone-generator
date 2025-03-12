"use client";

import { useEffect, useRef } from 'react';

interface AnimationPreviewProps {
  svgData: string;
  settings: {
    speed: number;
    intensity: number;
    isPlaying: boolean;
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
        
        // Apply animation properties to each dot
        dots.forEach((dot, index) => {
          console.log(`Processing dot ${index}`);
          const element = dot as HTMLElement;
          
          // Check if the element has a rotation transform
          const hasRotation = element.getAttribute('transform')?.includes('rotate') || 
                            element.style.transform?.includes('rotate');
          
          // Add appropriate animation class
          if (hasRotation || element.tagName === 'rect') {
            element.classList.add('animate-dots-breathing-rotate');
          } else {
            element.classList.add('animate-dots-breathing');
          }
          
          // Set animation properties
          element.style.setProperty('--animation-speed', `${settings.speed}s`);
          element.style.setProperty('--animation-intensity', `${settings.intensity}`);
          element.style.setProperty('--index', `${index}`);
          
          // Control animation play state
          if (settings.isPlaying) {
            element.style.animationPlayState = 'running';
          } else {
            element.style.animationPlayState = 'paused';
          }
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