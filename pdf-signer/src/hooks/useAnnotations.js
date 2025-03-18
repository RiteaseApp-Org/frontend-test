import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';
import { useUnderlineAnnotation } from './annotations/useUnderlineAnnotation';
import { useSignatureAnnotation } from './annotations/useSignatureAnnotation';

export const useAnnotations = (currentPage, zoomLevel, file) => {
  const {
    drawAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    drawColor,
    setDrawColor,
  } = useDrawAnnotation(currentPage, zoomLevel, file);

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

  const {
    signatureAnnotations,
    isDrawingSignature,
    currentSignature,
    handleSignatureStart,
    handleSignatureMove,
    handleSignatureEnd,
    deleteSignature,
  } = useSignatureAnnotation(currentPage, zoomLevel, file);

  // Combine all annotations
  const annotations = [
    ...drawAnnotations,
    ...highlightAnnotations,
    ...commentAnnotations,
    ...underlineAnnotations,
    ...signatureAnnotations,
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
    drawColor,
    setDrawColor,
    isDrawingSignature,
    currentSignature,
    handleSignatureStart,
    handleSignatureMove,
    handleSignatureEnd,
    deleteSignature,
  };
}; 