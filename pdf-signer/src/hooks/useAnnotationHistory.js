import { useState, useCallback } from 'react';

export const useAnnotationHistory = () => {
  const [history, setHistory] = useState({
    past: [],
    present: {
      highlights: [],
      underlines: [],
      draws: [],
      comments: [],
      timestamp: Date.now(),
    },
    future: []
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const recordAction = useCallback((newState) => {
    if (!newState) return;
    
    // Deep comparison of states excluding timestamp
    const areStatesEqual = (state1, state2) => {
      const { timestamp: t1, ...state1WithoutTimestamp } = state1;
      const { timestamp: t2, ...state2WithoutTimestamp } = state2;
      return JSON.stringify(state1WithoutTimestamp) === JSON.stringify(state2WithoutTimestamp);
    };
    
    // Don't record if the action is the same as the current state
    if (areStatesEqual(newState, history.present)) return;
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: { ...newState, timestamp: Date.now() },
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
        present: { ...previous, timestamp: Date.now() },
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
        present: { ...next, timestamp: Date.now() },
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