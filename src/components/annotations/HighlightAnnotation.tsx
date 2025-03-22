import React from 'react';
import { Annotation } from '../../types';

interface HighlightAnnotationProps {
  annotation: Annotation;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const HighlightAnnotation: React.FC<HighlightAnnotationProps> = ({
  annotation,
  scale,
  isSelected,
  onSelect,
  onDelete,
}) => {
  if (!annotation.width || !annotation.height) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${annotation.position.x * scale}px`,
    top: `${annotation.position.y * scale}px`,
    width: `${annotation.width * scale}px`,
    height: `${annotation.height * scale}px`,
    backgroundColor: annotation.color || '#FFEB3B',
    opacity: 0.3,
    pointerEvents: 'auto',
    cursor: 'pointer',
    border: isSelected ? '2px dashed #000' : 'none',
    zIndex: isSelected ? 20 : 10
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div style={style} onClick={handleClick}>
      {isSelected && (
        <div 
          className="absolute top-0 right-0 bg-white p-1 border border-gray-300 rounded shadow-sm"
          style={{ pointerEvents: 'auto', zIndex: 30 }}
        >
          <button
            className="text-red-500 hover:text-red-700 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default HighlightAnnotation; 