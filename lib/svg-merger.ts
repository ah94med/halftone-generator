export const mergeSVGs = (svgs: string[], groupIds: string[], visibility: boolean[]): string => {
  const parser = new DOMParser();
  const mergedSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mergedSVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  mergedSVG.setAttribute('viewBox', '0 0 1000 1000'); // Adjust as needed

  const gridSize = Math.ceil(Math.sqrt(svgs.length)); // Calculate grid size
  const cellSize = 1000 / gridSize; // Size of each cell in the grid

  svgs.forEach((svg, index) => {
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    if (svgElement) {
      // Calculate position in the grid
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      const x = col * cellSize;
      const y = row * cellSize;

      // Get the original dimensions of the SVG
      const viewBox = svgElement.getAttribute('viewBox');
      const [_, __, width, height] = viewBox ? viewBox.split(' ').map(Number) : [0, 0, 100, 100];

      // Calculate the scale factor to fit the height to 800px
      const scale = 800 / height;

      // Create a group for the SVG and position it
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('id', groupIds[index]); // Use custom group ID
      group.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`);

      // Set visibility based on the checkbox
      if (!visibility[index]) {
        group.setAttribute('visibility', 'hidden');
      } else {
        group.removeAttribute('visibility'); // Ensure visibility is reset if true
      }

      Array.from(svgElement.children).forEach((child) => {
        group.appendChild(child.cloneNode(true));
      });
      mergedSVG.appendChild(group);
    }
  });

  return new XMLSerializer().serializeToString(mergedSVG);
};