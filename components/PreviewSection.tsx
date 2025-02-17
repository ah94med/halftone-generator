'use client';

import { forwardRef, useEffect } from 'react';

interface PreviewSectionProps {
  svgData: string;
}

export const PreviewSection = forwardRef<HTMLDivElement, PreviewSectionProps>(({ svgData }, ref) => {
  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current && svgData) {
      ref.current.innerHTML = svgData;
    }
  }, [svgData, ref]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
      <div
        ref={ref}
        className="p-4 border border-gray-300 rounded-lg overflow-auto"
        style={{ height: '800px', maxWidth: '100%' }}
      >
        {!svgData && <p className="text-gray-500">Upload SVGs to see the preview.</p>}
      </div>
    </section>
  );
});

PreviewSection.displayName = 'PreviewSection'; 