import { useState, useCallback } from 'react';

export const useUnderlineAnnotation = (currentPage, zoomLevel) => {
  const [underlineAnnotations, setUnderlineAnnotations] = useState([]);

  const handleUnderline = useCallback((e, containerRef, color) => {
    if (!containerRef.current) return;

    // Get the selected text
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      return;
    }

    // Get the selected range
    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Get the selected text content
    const text = selection.toString();

    if (text.trim()) {
      // Create an underline for each line of text
      const underlines = Array.from(rects).map((rect, index) => ({
        type: "underline",
        x: (rect.left - containerRect.left) / (zoomLevel / 100),
        y: (rect.top - containerRect.top) / (zoomLevel / 100),
        width: rect.width / (zoomLevel / 100),
        height: rect.height,
        text: text,
        color, // Store the color with each annotation
        page: currentPage,
        id: `${Date.now()}-${index}` // Unique ID for each underline
      }));

      setUnderlineAnnotations(prev => [...prev, ...underlines]);

      // Clear the selection after underlining
      selection.removeAllRanges();
    }
  }, [currentPage, zoomLevel]);

  return {
    underlineAnnotations,
    setUnderlineAnnotations,
    handleUnderline,
  };
}; 