'use client';

import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Slider } from '@/components/ui/slider';

interface PreviewSectionProps {
  svgData: string;
}

export const PreviewSection = ({ svgData }: PreviewSectionProps) => {
  const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({}); // Positions of each <g> element
  const svgRef = useRef<HTMLDivElement>(null); // Ref for the SVG container

  // Parse the SVG data and make each <g> element draggable
  useEffect(() => {
    if (svgRef.current && svgData) {
      svgRef.current.innerHTML = svgData;

      // Add event listeners to make each <g> element draggable
      const gElements = svgRef.current.querySelectorAll('g');
      gElements.forEach((g) => {
        const id = g.getAttribute('id');
        if (id) {
          g.setAttribute('cursor', 'move');
          g.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Prevent dragging the entire SVG
          });
        }
      });
    }
  }, [svgData]);

  // Handle drag for individual <g> elements
  const handleDrag = (id: string, e: any, data: any) => {
    setPositions((prev) => ({
      ...prev,
      [id]: { x: data.x, y: data.y },
    }));
  };

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
      <div className="p-4 border border-gray-300 rounded-lg">
        <div ref={svgRef}>
          {svgData &&
            Object.entries(positions).map(([id, position]) => (
              <Draggable
                key={id}
                position={position}
                onStop={(e, data) => handleDrag(id, e, data)}
              >
                <g id={id} />
              </Draggable>
            ))}
        </div>
      </div>
    </section>
  );
}; 