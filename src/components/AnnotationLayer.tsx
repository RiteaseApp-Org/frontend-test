import React from 'react';
import { Annotation } from '../types';
import SignatureAnnotation from './annotations/SignatureAnnotation';
import HighlightAnnotation from './annotations/HighlightAnnotation';
import UnderlineAnnotation from './annotations/UnderlineAnnotation';
import CommentAnnotation from './annotations/CommentAnnotation';

interface AnnotationLayerProps {
  annotations: Annotation[];
  scale: number;
  selectedAnnotation: string | null;
  onAnnotationSelect: (id: string | null) => void;
  onAnnotationUpdate: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete: (id: string) => void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  annotations,
  scale,
  selectedAnnotation,
  onAnnotationSelect,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none', zIndex: 10 }}>
      {annotations.map((annotation) => {
        const isSelected = selectedAnnotation === annotation.id;
        
        switch (annotation.type) {
          case 'highlight':
            return (
              <HighlightAnnotation
                key={annotation.id}
                annotation={annotation}
                scale={scale}
                isSelected={isSelected}
                onSelect={() => onAnnotationSelect(annotation.id)}
                onDelete={() => onAnnotationDelete(annotation.id)}
              />
            );
          case 'underline':
            return (
              <UnderlineAnnotation
                key={annotation.id}
                annotation={annotation}
                scale={scale}
                isSelected={isSelected}
                onSelect={() => onAnnotationSelect(annotation.id)}
                onDelete={() => onAnnotationDelete(annotation.id)}
              />
            );
          case 'comment':
            return (
              <CommentAnnotation
                key={annotation.id}
                annotation={annotation}
                scale={scale}
                isSelected={isSelected}
                onSelect={() => onAnnotationSelect(annotation.id)}
                onUpdate={(updates) => onAnnotationUpdate(annotation.id, updates)}
                onDelete={() => onAnnotationDelete(annotation.id)}
              />
            );
          case 'signature':
            return (
              <SignatureAnnotation
                key={annotation.id}
                annotation={annotation}
                scale={scale}
                isSelected={isSelected}
                onSelect={() => onAnnotationSelect(annotation.id)}
                onUpdate={(updates) => onAnnotationUpdate(annotation.id, updates)}
                onDelete={() => onAnnotationDelete(annotation.id)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default AnnotationLayer; 