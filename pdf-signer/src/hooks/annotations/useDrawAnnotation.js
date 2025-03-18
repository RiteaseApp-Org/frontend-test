import { useState } from 'react';

export const useDrawAnnotation = (currentPage, zoomLevel) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [drawAnnotations, setDrawAnnotations] = useState([]);

  const handleDrawStart = (e, containerRef) => {
    if (!containerRef.current) return;
    
    setIsDrawing(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);
    setCurrentPath([{ x, y }]);
  };

  const handleDrawMove = (e, containerRef) => {
    if (!isDrawing || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);
    setCurrentPath((prev) => [...prev, { x, y }]);
  };

  const handleDrawEnd = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    if (currentPath.length > 1) {
      setDrawAnnotations((prev) => [
        ...prev,
        {
          type: "draw",
          path: currentPath,
          page: currentPage,
        },
      ]);
    }
    setCurrentPath([]);
  };

  return {
    drawAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
  };
}; 