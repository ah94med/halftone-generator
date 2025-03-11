"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import AnimationControls from '@/components/svg-animator/AnimationControls';
import AnimationPreview from '@/components/svg-animator/AnimationPreview';
import AnimationExport from '@/components/svg-animator/AnimationExport';
import AnimationUpload from '@/components/svg-animator/AnimationUpload';

export default function SvgAnimator() {
  const [svgData, setSvgData] = useState<string>('');
  const [animationSettings, setAnimationSettings] = useState({
    speed: 1,
    intensity: 0.5,
    isPlaying: false,
  });

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (file) {
      const svgText = await file.text();
      setSvgData(svgText);
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Card className="p-6">
        <div className="grid gap-6">
          <h1 className="text-2xl font-bold">SVG Animation Studio</h1>
          
          <AnimationUpload onUpload={handleUpload} />
          
          {svgData && (
            <>
              <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                <AnimationPreview 
                  svgData={svgData} 
                  settings={animationSettings}
                />
                <AnimationControls
                  settings={animationSettings}
                  onChange={setAnimationSettings}
                />
              </div>
              
              <AnimationExport svgData={svgData} />
            </>
          )}
        </div>
      </Card>
    </div>
  );
} 