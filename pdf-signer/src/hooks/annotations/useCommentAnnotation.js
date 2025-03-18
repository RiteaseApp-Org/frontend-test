import { useState } from 'react';

export const useCommentAnnotation = (currentPage, zoomLevel) => {
  const [commentAnnotations, setCommentAnnotations] = useState([]);

  const handleComment = (e, containerRef) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    setCommentAnnotations((prev) => [
      ...prev,
      {
        type: "comment",
        x,
        y,
        text: "Add a comment...",
        page: currentPage,
      },
    ]);
  };

  return {
    commentAnnotations,
    handleComment,
  };
}; 