import React from 'react';
import { Annotation } from '../../types';

interface UnderlineAnnotationProps {
  annotation: Annotation;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const UnderlineAnnotation: React.FC<UnderlineAnnotationProps> = ({
  annotation,
  scale,
  isSelected,
  onSelect,
  onDelete,
}) => {
  if (!annotation.width) return null;

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotation.position.x * scale}px`,
    top: `${annotation.position.y * scale}px`,
    width: `${annotation.width * scale}px`,
    height: '4px',
    pointerEvents: 'auto',
    cursor: 'pointer',
    zIndex: isSelected ? 20 : 10
  };

  const lineStyle: React.CSSProperties = {
    width: '100%',
    height: '2px',
    backgroundColor: annotation.color ?? '#4285F4',
    borderBottom: isSelected ? '2px dashed #000' : 'none',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div style={containerStyle} onClick={handleClick}>
      <div style={lineStyle}></div>
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

export default UnderlineAnnotation; 