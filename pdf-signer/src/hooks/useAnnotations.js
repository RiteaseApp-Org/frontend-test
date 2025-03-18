import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';

export const useAnnotations = (currentPage, zoomLevel) => {
  const {
    drawAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
  } = useDrawAnnotation(currentPage, zoomLevel);

  const {
    highlightAnnotations,
    handleHighlight,
  } = useHighlightAnnotation(currentPage, zoomLevel);

  const {
    commentAnnotations,
    handleComment,
  } = useCommentAnnotation(currentPage, zoomLevel);

  // Combine all annotations
  const annotations = [
    ...drawAnnotations,
    ...highlightAnnotations,
    ...commentAnnotations,
  ];

  return {
    annotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    handleHighlight,
    handleComment,
  };
}; 