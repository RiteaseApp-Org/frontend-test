import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Annotation } from '../../types';

interface SignatureAnnotationProps {
  annotation: Annotation;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Annotation>) => void;
  onDelete: () => void;
}

const SignatureAnnotation: React.FC<SignatureAnnotationProps> = ({
  annotation,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  const width = annotation.width || 300;
  const height = annotation.height || 150;

  useEffect(() => {
    if (signatureRef.current && annotation.points && annotation.points.length > 0) {
   
      signatureRef.current.clear();
      
      const sigCanvas = signatureRef.current;
      const ctx = sigCanvas.getCanvas().getContext('2d');
      
      if (ctx) {
        ctx.beginPath();
        annotation.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      }
    }
  }, [annotation.points]);

  const saveSignature = () => {
    if (signatureRef.current) {
      const canvas = signatureRef.current.getCanvas();
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
       
        const points: { x: number; y: number }[] = [];
        
       
        const signatureImage = signatureRef.current.toDataURL('image/png');
        
        onUpdate({ 
          points: points,
          text: signatureImage
        });
      }
      
      setIsDrawing(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotation.position.x * scale}px`,
    top: `${annotation.position.y * scale}px`,
    width: `${width * scale}px`,
    height: `${height * scale}px`,
    pointerEvents: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: isSelected ? '2px dashed #000' : '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    zIndex: isSelected ? 20 : 10
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <div style={containerStyle} onClick={handleClick}>
      {isDrawing ? (
        <div className="bg-white w-full h-full">
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{
              width: width * scale,
              height: height * scale,
              className: 'signature-canvas',
              style: { width: '100%', height: '100%' }
            }}
            backgroundColor="rgba(255, 255, 255, 0.0)"
          />
          <div className="absolute bottom-2 right-2 flex">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-1"
              onClick={saveSignature}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
              onClick={(e) => {
                e.stopPropagation();
                if (signatureRef.current) signatureRef.current.clear();
                setIsDrawing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {annotation.text ? (
       
            <img 
              src={annotation.text} 
              alt="Signature" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
           
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-400 text-sm">Signature area</span>
            </div>
          )}
          
          {isSelected && (
            <div 
              className="absolute top-2 right-2 flex bg-white p-1 border border-gray-200 rounded shadow-sm"
              style={{ zIndex: 30 }}
            >
              <button
                className="text-blue-500 hover:text-blue-700 px-1 text-xs mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDrawing(true);
                }}
              >
                {annotation.text ? 'Edit' : 'Sign'}
              </button>
              <button
                className="text-red-500 hover:text-red-700 px-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SignatureAnnotation; 