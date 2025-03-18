import { useState } from 'react';

export const useHighlightAnnotation = (currentPage, zoomLevel) => {
  const [highlightAnnotations, setHighlightAnnotations] = useState([]);

  const handleHighlight = (e, containerRef) => {
    if (!containerRef.current) return;

    // Get the selected text
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      // If no text is selected or selection is collapsed, return
      return;
    }

    // Get the selected range
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate coordinates relative to the container
    const x = (rect.left - containerRect.left) / (zoomLevel / 100);
    const y = (rect.top - containerRect.top) / (zoomLevel / 100);
    const width = rect.width / (zoomLevel / 100);
    const height = rect.height / (zoomLevel / 100);

    // Get the selected text content
    const text = selection.toString();

    if (text.trim()) {
      setHighlightAnnotations((prev) => [
        ...prev,
        {
          type: "highlight",
          x,
          y,
          width,
          height,
          text,
          page: currentPage,
        },
      ]);

      // Clear the selection after highlighting
      selection.removeAllRanges();
    }
  };

  return {
    highlightAnnotations,
    handleHighlight,
  };
}; 