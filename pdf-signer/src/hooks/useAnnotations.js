import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';
import { useUnderlineAnnotation } from './annotations/useUnderlineAnnotation';
import { useSignatureAnnotation } from './annotations/useSignatureAnnotation';
import { useAnnotationHistory } from './useAnnotationHistory';
import { useCallback, useEffect, useRef } from 'react';

export const useAnnotations = (currentPage, zoomLevel, file) => {
  const isFirstRender = useRef(true);
  const isUpdatingFromHistory = useRef(false);

  const {
    drawAnnotations,
    setDrawAnnotations,
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
    setHighlightAnnotations,
    handleHighlight,
  } = useHighlightAnnotation(currentPage, zoomLevel);

  const {
    commentAnnotations,
    setCommentAnnotations,
    handleComment,
    activeComment,
    updateComment,
    saveComment,
    setActiveComment,
    deleteComment,
  } = useCommentAnnotation(currentPage, zoomLevel, file);

  const {
    underlineAnnotations,
    setUnderlineAnnotations,
    handleUnderline,
  } = useUnderlineAnnotation(currentPage, zoomLevel);

  const {
    signatureAnnotations,
    setSignatureAnnotations,
    isDrawingSignature,
    currentSignature,
    handleSignatureStart,
    handleSignatureMove,
    handleSignatureEnd,
    deleteSignature,
  } = useSignatureAnnotation(currentPage, zoomLevel, file);

  const {
    currentState,
    recordAction,
    undo,
    redo,
    canUndo,
    canRedo
  } = useAnnotationHistory();

  // Combine all annotations
  const allAnnotations = [
    ...drawAnnotations,
    ...highlightAnnotations,
    ...commentAnnotations,
    ...underlineAnnotations,
    ...signatureAnnotations,
  ];

  // Record the current state whenever annotations change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isUpdatingFromHistory.current) {
      isUpdatingFromHistory.current = false;
      return;
    }

    recordAction({
      draws: drawAnnotations,
      highlights: highlightAnnotations,
      comments: commentAnnotations,
      underlines: underlineAnnotations,
      signatures: signatureAnnotations
    });
  }, [
    drawAnnotations,
    highlightAnnotations,
    commentAnnotations,
    underlineAnnotations,
    signatureAnnotations,
    recordAction
  ]);

  // Apply history state when it changes
  useEffect(() => {
    if (!currentState) return;
    
    isUpdatingFromHistory.current = true;
    
    setDrawAnnotations(currentState.draws || []);
    setHighlightAnnotations(currentState.highlights || []);
    setCommentAnnotations(currentState.comments || []);
    setUnderlineAnnotations(currentState.underlines || []);
    setSignatureAnnotations(currentState.signatures || []);
  }, [
    currentState,
    setDrawAnnotations,
    setHighlightAnnotations,
    setCommentAnnotations,
    setUnderlineAnnotations,
    setSignatureAnnotations
  ]);

  const handleUndoWithCheck = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [canUndo, undo]);

  const handleRedoWithCheck = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [canRedo, redo]);

  return {
    annotations: allAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    handleHighlight,
    handleUnderline,
    handleComment,
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
    undo: handleUndoWithCheck,
    redo: handleRedoWithCheck,
    canUndo,
    canRedo
  };
}; 