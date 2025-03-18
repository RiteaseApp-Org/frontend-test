import { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '@/utils/storage';

export const useSignatureAnnotation = (currentPage, zoomLevel, file) => {
  // Generate a unique identifier for the file
  const getFileId = () => {
    if (!file) return null;
    if (file instanceof File) {
      return `${file.name}-${file.lastModified}`;
    }
    return file.toString();
  };

  const fileId = getFileId();

  const [signatureAnnotations, setSignatureAnnotations] = useState(() => {
    const allAnnotations = getFromStorage('pdfSignatures', {});
    return fileId ? (allAnnotations[fileId] || []) : [];
  });

  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [currentSignature, setCurrentSignature] = useState([]);

  // Save signatures to localStorage whenever they change
  useEffect(() => {
    if (fileId) {
      const allAnnotations = getFromStorage('pdfSignatures', {});
      allAnnotations[fileId] = signatureAnnotations;
      saveToStorage('pdfSignatures', allAnnotations);
    }
  }, [signatureAnnotations, fileId]);

  const handleSignatureStart = (e, containerRef) => {
    if (!containerRef.current || !fileId) return;
    
    setIsDrawingSignature(true);
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);
    setCurrentSignature([{ x, y }]);
  };

  const handleSignatureMove = (e, containerRef) => {
    if (!isDrawingSignature || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);
    setCurrentSignature((prev) => [...prev, { x, y }]);
  };

  const handleSignatureEnd = () => {
    if (!isDrawingSignature) return;
    
    setIsDrawingSignature(false);
    if (currentSignature.length > 1) {
      setSignatureAnnotations((prev) => [
        ...prev,
        {
          type: "signature",
          path: currentSignature,
          page: currentPage,
          timestamp: new Date().toLocaleString(),
          fileId,
        },
      ]);
    }
    setCurrentSignature([]);
  };

  const deleteSignature = (index) => {
    setSignatureAnnotations(prev => prev.filter((_, i) => i !== index));
  };

  return {
    signatureAnnotations: fileId ? signatureAnnotations : [],
    setSignatureAnnotations,
    isDrawingSignature,
    currentSignature,
    handleSignatureStart,
    handleSignatureMove,
    handleSignatureEnd,
    deleteSignature,
  };
}; 