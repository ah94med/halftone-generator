'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadSection } from '@/components/UploadSection';
import { TweakSection } from '@/components/TweakSection';
import { PreviewSection } from '@/components/PreviewSection';
import { ExportSection } from '@/components/ExportSection';
import { mergeSVGs } from '@/lib/svg-merger';

export default function SvgMergePage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<boolean[]>([]);
  const [svgData, setSvgData] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Helper function to re-merge SVGs
  const remergeSVGs = async (files: File[] = uploadedFiles) => {
    if (files.length === 0) {
      setSvgData('');
      return;
    }
    try {
      const svgStrings = await Promise.all(files.map((file) => file.text()));
      const merged = mergeSVGs(svgStrings, groupIds, visibility);
      setSvgData(merged);
    } catch (error) {
      console.error('Error merging SVGs:', error);
      setSvgData('');
    }
  };

  const handleUpload = async (files: File[]) => {
    const newFiles = [...uploadedFiles, ...files];
    const newGroupIds = [...groupIds, ...files.map((_, i) => `svg-group-${groupIds.length + i}`)];
    const newVisibility = [...visibility, ...files.map(() => true)];
    
    setUploadedFiles(newFiles);
    setGroupIds(newGroupIds);
    setVisibility(newVisibility);
    
    // Immediately remerge with the new files
    await remergeSVGs(newFiles);
  };

  const handleRemove = async (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newGroupIds = groupIds.filter((_, i) => i !== index);
    const newVisibility = visibility.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setGroupIds(newGroupIds);
    setVisibility(newVisibility);
    await remergeSVGs();
  };

  const handleGroupIdChange = async (index: number, groupId: string) => {
    const newGroupIds = [...groupIds];
    newGroupIds[index] = groupId;
    setGroupIds(newGroupIds);
    await remergeSVGs();
  };

  const handleVisibilityChange = async (index: number, isVisible: boolean) => {
    const newVisibility = [...visibility];
    newVisibility[index] = isVisible;
    setVisibility(newVisibility);
    await remergeSVGs();
  };

  useEffect(() => {
    if (previewRef.current && svgData) {
      previewRef.current.innerHTML = svgData;
    }
  }, [svgData]);

  // Add this effect to remerge when groupIds or visibility change
  useEffect(() => {
    if (uploadedFiles.length > 0) {
      remergeSVGs();
    }
  }, [groupIds, visibility]);

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
              onGroupIdChange={handleGroupIdChange}
              onVisibilityChange={handleVisibilityChange}
            />
          )}
          <PreviewSection svgData={svgData} ref={previewRef} />
          <ExportSection svgData={svgData} />
        </div>
      </div>
    </div>
  );
} 