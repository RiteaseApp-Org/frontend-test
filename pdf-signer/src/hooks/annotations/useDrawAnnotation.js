import { useState, useEffect } from 'react';

export const useDrawAnnotation = (currentPage, zoomLevel, file) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

  // Generate a unique identifier for the file
  const getFileId = () => {
    if (!file) return null;
    if (file instanceof File) {
      return `${file.name}-${file.lastModified}`;
    }
    return file.toString();
  };

  const fileId = getFileId();

  const [drawAnnotations, setDrawAnnotations] = useState(() => {
    const savedAnnotations = localStorage.getItem('pdfDrawAnnotations');
    const allAnnotations = savedAnnotations ? JSON.parse(savedAnnotations) : {};
    return fileId ? (allAnnotations[fileId] || []) : [];
  });
  
  const [drawColor, setDrawColor] = useState(() => {
    return "#000000"; // Default black color
  });

  // Save draw annotations to localStorage whenever they change
  useEffect(() => {
    if (fileId) {
      const savedAnnotations = localStorage.getItem('pdfDrawAnnotations');
      const allAnnotations = savedAnnotations ? JSON.parse(savedAnnotations) : {};
      
      // Update annotations for current file
      allAnnotations[fileId] = drawAnnotations;
      
      localStorage.setItem('pdfDrawAnnotations', JSON.stringify(allAnnotations));
    }
  }, [drawAnnotations, fileId]);

  const handleDrawStart = (e, containerRef) => {
    if (!containerRef.current || !fileId) return;
    
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
          color: drawColor,
          fileId, // Store fileId with the annotation
        },
      ]);
    }
    setCurrentPath([]);
  };

  return {
    drawAnnotations: fileId ? drawAnnotations : [], // Only return annotations if file is loaded
    isDrawing,
    currentPath,
    drawColor,
    setDrawColor,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
  };
}; 