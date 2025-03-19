import React, { useState } from 'react';
import { Annotation } from '../../types';

interface CommentAnnotationProps {
  annotation: Annotation;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Annotation>) => void;
  onDelete: () => void;
}

const CommentAnnotation: React.FC<CommentAnnotationProps> = ({
  annotation,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(annotation.content || '');

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotation.position.x * scale}px`,
    top: `${annotation.position.y * scale}px`,
    width: `${20 * scale}px`,
    height: `${20 * scale}px`,
    backgroundColor: annotation.color ?? '#FFC107',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    fontSize: `${12 * scale}px`,
    fontWeight: 'bold',
    cursor: 'pointer',
    pointerEvents: 'auto',
    border: isSelected ? '2px dashed #000' : 'none',
    zIndex: isSelected ? 20 : 10
  };

  const commentStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${(annotation.position.x + 25) * scale}px`,
    top: `${annotation.position.y * scale}px`,
    width: `${200 * scale}px`,
    padding: `${8 * scale}px`,
    backgroundColor: '#fff',
    border: `1px solid ${annotation.color ?? '#FFC107'}`,
    borderRadius: `${4 * scale}px`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 30,
    pointerEvents: 'auto'
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onUpdate({ content });
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <>
      <div style={iconStyle} onClick={handleIconClick}>
        <span>!</span>
      </div>

   
      {isSelected && (
        <div style={commentStyle}>
          {isEditing ? (
            <>
              <textarea
                className="w-full border rounded p-1 mb-2 text-black"
                value={content}
                onChange={handleContentChange}
                autoFocus
                rows={4}
                style={{ fontSize: `${12 * scale}px` }}
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div 
                className="text-sm mb-2 text-black" 
                style={{ 
                  minHeight: `${60 * scale}px`,
                  fontSize: `${12 * scale}px`,
                  wordBreak: 'break-word'
                }}
              >
                {content || 'No comment text'}
              </div>
              <div className="flex justify-end">
                <button
                  className="text-blue-500 hover:text-blue-700 px-2 text-xs mr-1"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:text-red-700 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CommentAnnotation; 