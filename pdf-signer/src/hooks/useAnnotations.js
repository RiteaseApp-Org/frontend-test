import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';
import { useUnderlineAnnotation } from './annotations/useUnderlineAnnotation';

export const useAnnotations = (currentPage, zoomLevel, file) => {
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
    activeComment,
    updateComment,
    saveComment,
    setActiveComment,
    deleteComment,
  } = useCommentAnnotation(currentPage, zoomLevel, file);

  const {
    underlineAnnotations,
    handleUnderline,
  } = useUnderlineAnnotation(currentPage, zoomLevel);

  // Combine all annotations
  const annotations = [
    ...drawAnnotations,
    ...highlightAnnotations,
    ...commentAnnotations,
    ...underlineAnnotations,
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
    handleUnderline,
    activeComment,
    updateComment,
    saveComment,
    setActiveComment,
    deleteComment,
  };
}; 