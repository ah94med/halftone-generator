'use client';

import { useState, useRef } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { TweakSection } from '@/components/TweakSection';
import { PreviewSection } from '@/components/PreviewSection';
import { ExportSection } from '@/components/ExportSection';
import { mergeSVGs } from '@/lib/svg-merger';

export default function SvgMergePage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<boolean[]>([]);
  const [scales, setScales] = useState<number[]>([]); // Scale for each SVG
  const [xPositions, setXPositions] = useState<number[]>([]); // X position for each SVG
  const [yPositions, setYPositions] = useState<number[]>([]); // Y position for each SVG
  const [svgData, setSvgData] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleUpload = async (files: File[]) => {
    const newFiles = [...uploadedFiles, ...files];
    const newGroupIds = [...groupIds, ...files.map((_, i) => `svg-group-${groupIds.length + i}`)];
    const newVisibility = [...visibility, ...files.map(() => true)];
    const newScales = [...scales, ...files.map(() => 1)];
    const newXPositions = [...xPositions, ...files.map(() => 0)];
    const newYPositions = [...yPositions, ...files.map(() => 0)];
    
    // Read all files first
    const svgStrings = await Promise.all(newFiles.map((file) => file.text()));
    
    // Update state in a single batch
    setUploadedFiles(newFiles);
    setGroupIds(newGroupIds);
    setVisibility(newVisibility);
    setScales(newScales);
    setXPositions(newXPositions);
    setYPositions(newYPositions);
    
    // Merge SVGs after state updates
    const mergedSVG = mergeSVGs(svgStrings, newGroupIds, newVisibility, newScales, newXPositions, newYPositions);
    setSvgData(mergedSVG);
  };

  // Create a generic update handler
  const createUpdateHandler = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    key: keyof typeof state
  ) => (index: number, value: T) => {
    setter(prev => {
      const newValues = [...prev];
      newValues[index] = value;
      
      // Update the SVG data after state change
      const svgStrings = uploadedFiles.map(file => file.text());
      const mergedSVG = mergeSVGs(svgStrings, groupIds, visibility, scales, xPositions, yPositions);
      setSvgData(mergedSVG);
      
      return newValues;
    });
  };

  // Use the generic handler for all properties
  const handleGroupIdChange = createUpdateHandler(setGroupIds, 'groupIds');
  const handleVisibilityChange = createUpdateHandler(setVisibility, 'visibility');
  const handleScaleChange = createUpdateHandler(setScales, 'scales');
  const handleXPositionChange = createUpdateHandler(setXPositions, 'xPositions');
  const handleYPositionChange = createUpdateHandler(setYPositions, 'yPositions');

  const handleRemove = async (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newGroupIds = groupIds.filter((_, i) => i !== index);
    const newVisibility = visibility.filter((_, i) => i !== index);
    const newScales = scales.filter((_, i) => i !== index);
    const newXPositions = xPositions.filter((_, i) => i !== index);
    const newYPositions = yPositions.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setGroupIds(newGroupIds);
    setVisibility(newVisibility);
    setScales(newScales);
    setXPositions(newXPositions);
    setYPositions(newYPositions);
    setSvgData(mergeSVGs(newFiles.map((file) => file.text()), newGroupIds, newVisibility, newScales, newXPositions, newYPositions));
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">SVG Merger</h1>
        <div className="space-y-8">
          <UploadSection onUpload={handleUpload} onRemove={handleRemove} uploadedFiles={uploadedFiles} />
          {uploadedFiles.length > 0 && (
            <TweakSection
              uploadedFiles={uploadedFiles}
              groupIds={groupIds}
              visibility={visibility}
              scales={scales}
              xPositions={xPositions}
              yPositions={yPositions}
              onGroupIdChange={handleGroupIdChange}
              onVisibilityChange={handleVisibilityChange}
              onScaleChange={handleScaleChange}
              onXPositionChange={handleXPositionChange}
              onYPositionChange={handleYPositionChange}
            />
          )}
          <PreviewSection svgData={svgData} ref={previewRef} />
          <ExportSection svgData={svgData} />
        </div>
      </div>
    </div>
  );
} 