import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Annotation, PdfViewerState } from '../types';


export const usePdfViewer = () => {
  const [state, setState] = useState<PdfViewerState>({
    file: null,
    annotations: [],
    numPages: 0,
    currentPage: 1,
    scale: 1.0,
    pdfDocument: null,
    currentTool: 'cursor',
    currentColor: '#FFEB3B', 
  });

  const setFile = (file: File | null) => {
    setState((prev) => ({ ...prev, file }));
  };

  const setNumPages = (numPages: number) => {
    setState((prev) => ({ ...prev, numPages }));
  };

  const setPdfDocument = (pdfDocument: any | null) => {
    setState((prev) => ({ ...prev, pdfDocument }));
  };

  const setCurrentPage = (currentPage: number) => {
    setState((prev) => ({ ...prev, currentPage }));
  };

  const setScale = (scale: number) => {
    setState((prev) => ({ ...prev, scale }));
  };

  const setCurrentTool = (currentTool: PdfViewerState['currentTool']) => {
    setState((prev) => ({ ...prev, currentTool }));
  };

  const setCurrentColor = (currentColor: string) => {
    setState((prev) => ({ ...prev, currentColor }));
  };

  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: uuidv4(),
    };
    setState((prev) => ({
      ...prev,
      annotations: [...prev.annotations, newAnnotation],
    }));
    return newAnnotation;
  }, []);

  const updateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    setState((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === id ? { ...ann, ...updates } : ann
      ),
    }));
  }, []);

  const deleteAnnotation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      annotations: prev.annotations.filter((ann) => ann.id !== id),
    }));
  }, []);

  return {
    state,
    setFile,
    setNumPages,
    setPdfDocument,
    setCurrentPage,
    setScale,
    setCurrentTool,
    setCurrentColor,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
  };
}; 