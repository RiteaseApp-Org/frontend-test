import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';
import { useUnderlineAnnotation } from './annotations/useUnderlineAnnotation';
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
    });
  }, [
    drawAnnotations,
    highlightAnnotations,
    commentAnnotations,
    underlineAnnotations,
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
  }, [
    currentState,
    setDrawAnnotations,
    setHighlightAnnotations,
    setCommentAnnotations,
    setUnderlineAnnotations,
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
    undo: handleUndoWithCheck,
    redo: handleRedoWithCheck,
    canUndo,
    canRedo
  };
}; 