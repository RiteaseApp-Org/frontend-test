import { useState, useCallback } from 'react';

export const useAnnotationHistory = () => {
  const [history, setHistory] = useState({
    past: [],
    present: {
      draws: [],
      highlights: [],
      comments: [],
      underlines: [],
      signatures: []
    },
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const recordAction = useCallback((action) => {
    if (!action) return;
    
    // Don't record if the action is the same as the current state
    if (JSON.stringify(action) === JSON.stringify(history.present)) return;
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: action,
      future: []
    }));
  }, [history.present]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  return {
    currentState: history.present,
    recordAction,
    undo,
    redo,
    canUndo,
    canRedo
  };
}; 