import { useDrawAnnotation } from './annotations/useDrawAnnotation';
import { useHighlightAnnotation } from './annotations/useHighlightAnnotation';
import { useCommentAnnotation } from './annotations/useCommentAnnotation';
import { useUnderlineAnnotation } from './annotations/useUnderlineAnnotation';
import { useAnnotationHistory } from './useAnnotationHistory';
import { useCallback, useEffect, useRef } from 'react';

export const useAnnotations = (currentPage, zoomLevel, file) => {
  const isFirstRender = useRef(true);
  const isUpdatingFromHistory = useRef(false);

  // Initialize all annotation hooks
  const {
    drawAnnotations,
    setDrawAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart: baseHandleDrawStart,
    handleDrawMove,
    handleDrawEnd: baseHandleDrawEnd,
    drawColor,
    setDrawColor,
  } = useDrawAnnotation(currentPage, zoomLevel, file);

  const {
    highlightAnnotations,
    setHighlightAnnotations,
    handleHighlight: baseHandleHighlight,
  } = useHighlightAnnotation(currentPage, zoomLevel);

  const {
    commentAnnotations,
    setCommentAnnotations,
    activeComment,
    handleComment: baseHandleComment,
    updateComment: baseUpdateComment,
    saveComment: baseSaveComment,
    setActiveComment,
    deleteComment: baseDeleteComment,
  } = useCommentAnnotation(currentPage, zoomLevel, file);

  const {
    underlineAnnotations,
    setUnderlineAnnotations,
    handleUnderline: baseHandleUnderline,
  } = useUnderlineAnnotation(currentPage, zoomLevel);

  const {
    currentState,
    recordAction,
    undo,
    redo,
    canUndo,
    canRedo
  } = useAnnotationHistory();

  // Combine all annotations for rendering
  const allAnnotations = [
    ...drawAnnotations,
    ...highlightAnnotations,
    ...commentAnnotations,
    ...underlineAnnotations,
  ].filter(annotation => annotation.page === currentPage);

  // Create a snapshot of the current state
  const createSnapshot = useCallback(() => {
    return {
      draws: drawAnnotations,
      highlights: highlightAnnotations,
      comments: commentAnnotations,
      underlines: underlineAnnotations,
      timestamp: Date.now(), // Add timestamp to ensure state changes are detected
    };
  }, [drawAnnotations, highlightAnnotations, commentAnnotations, underlineAnnotations]);

  // Apply state from history with proper synchronization
  const applyState = useCallback((state) => {
    if (!state) return;

    isUpdatingFromHistory.current = true;
    
    // Batch state updates to prevent multiple rerenders
    Promise.resolve().then(() => {
      setDrawAnnotations(state.draws || []);
      setHighlightAnnotations(state.highlights || []);
      setCommentAnnotations(state.comments || []);
      setUnderlineAnnotations(state.underlines || []);
      
      isUpdatingFromHistory.current = false;
    });
  }, [setDrawAnnotations, setHighlightAnnotations, setCommentAnnotations, setUnderlineAnnotations]);

  // Record state changes only when not updating from history
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isUpdatingFromHistory.current) {
      const currentSnapshot = createSnapshot();
      recordAction(currentSnapshot);
    }
  }, [drawAnnotations, highlightAnnotations, commentAnnotations, underlineAnnotations, recordAction, createSnapshot]);

  // Enhanced handlers with proper state management
  const handleHighlight = useCallback((e, containerRef, color) => {
    baseHandleHighlight(e, containerRef, color);
  }, [baseHandleHighlight]);

  const handleUnderline = useCallback((e, containerRef, color) => {
    baseHandleUnderline(e, containerRef, color);
  }, [baseHandleUnderline]);

  const handleDrawEnd = useCallback((color, strokeWidth) => {
    baseHandleDrawEnd(color, strokeWidth);
  }, [baseHandleDrawEnd]);

  const handleComment = useCallback((e, containerRef) => {
    baseHandleComment(e, containerRef);
  }, [baseHandleComment]);

  // Improved undo/redo handlers with proper state synchronization
  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    
    undo();
    // Wait for the next tick to ensure state is updated
    requestAnimationFrame(() => {
      if (currentState) {
        applyState(currentState);
      }
    });
  }, [canUndo, undo, currentState, applyState]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    
    redo();
    requestAnimationFrame(() => {
      if (currentState) {
        applyState(currentState);
      }
    });
  }, [canRedo, redo, currentState, applyState]);

  return {
    annotations: allAnnotations,
    isDrawing,
    currentPath,
    handleDrawStart: baseHandleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    handleHighlight,
    handleUnderline,
    handleComment,
    activeComment,
    updateComment: baseUpdateComment,
    saveComment: baseSaveComment,
    setActiveComment,
    deleteComment: baseDeleteComment,
    drawColor,
    setDrawColor,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo
  };
}; 