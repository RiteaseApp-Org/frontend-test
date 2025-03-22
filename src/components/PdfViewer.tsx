import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Position, Annotation } from '../types';
import AnnotationLayer from './AnnotationLayer';


pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  file: File | null;
  scale: number;
  currentPage: number;
  numPages: number;
  onDocumentLoadSuccess: (numPages: number) => void;
  onPageChange: (pageNumber: number) => void;
  currentTool: string;
  currentColor: string;
  annotations: Annotation[];
  onAnnotationCreate: (annotation: Omit<Annotation, 'id'>) => void;
  onAnnotationUpdate: (id: string, updates: Partial<Annotation>) => void;
  onAnnotationDelete: (id: string) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  scale,
  currentPage,
  numPages,
  onDocumentLoadSuccess,
  onPageChange,
  currentTool,
  currentColor,
  annotations,
  onAnnotationCreate,
  onAnnotationUpdate,
  onAnnotationDelete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [selectionStart, setSelectionStart] = useState<Position | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Position | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    onDocumentLoadSuccess(numPages);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		console.log('running', e);
		
    if (currentTool === 'cursor') return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) ;
      const y = (e.clientY - rect.top);

			console.log(rect);
			
      
      const position: Position = {
        x,
        y,
        pageNumber: currentPage,
      };
			console.log(position);
			
      
      setSelectionStart(position);
      setIsSelecting(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !selectionStart || currentTool === 'cursor') return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const position: Position = {
        x,
        y,
        pageNumber: currentPage,
      };
      
      setSelectionEnd(position);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !selectionStart || currentTool === 'cursor') return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const position: Position = {
        x,
        y,
        pageNumber: currentPage,
      };
      
      const endPosition = position;
      
    
      if (currentTool === 'highlight' || currentTool === 'underline') {
				console.log('selection',selectionStart, endPosition, rect);
				
        onAnnotationCreate({
          type: currentTool,
          position: selectionStart,
          width: endPosition.x - selectionStart.x,
          height: endPosition.y - selectionStart.y,
          color: currentColor,
        });
      } else if (currentTool === 'comment') {
        onAnnotationCreate({
          type: 'comment',
          position: selectionStart,
          content: '',
          color: currentColor,
        });
      } else if (currentTool === 'signature') {
        onAnnotationCreate({
          type: 'signature',
          position: selectionStart,
          width: endPosition.x - selectionStart.x,
          height: endPosition.y - selectionStart.y,
          points: [],
        });
      }
      
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      {file && (
        <>
          <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded text-black">
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {numPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
          <div 
            ref={containerRef}
            className="flex-1 overflow-auto relative border border-gray-300 rounded"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: 'relative' }}
          >
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoadSuccess}
              className="flex justify-center"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="relative"
              />
              <AnnotationLayer
                annotations={annotations.filter(ann => ann.position.pageNumber === currentPage)}
                scale={scale}
                selectedAnnotation={selectedAnnotation}
                onAnnotationSelect={setSelectedAnnotation}
                onAnnotationUpdate={onAnnotationUpdate}
                onAnnotationDelete={onAnnotationDelete}
              />
            </Document>
          </div>
          
     
          {isSelecting && selectionStart && selectionEnd && (
            <div 
              style={{
                position: 'absolute',
                left: `${Math.min(selectionStart.x, selectionEnd.x) * scale}px`,
                top: `${Math.min(selectionStart.y, selectionEnd.y) * scale}px`,
                width: `${Math.abs(selectionEnd.x - selectionStart.x) * scale}px`,
                height: `${Math.abs(selectionEnd.y - selectionStart.y) * scale}px`,
                backgroundColor: currentColor,
                opacity: 0.3,
                pointerEvents: 'none',
                zIndex: 5
              }} 
            />
          )}
        </>
      )}
    </div>
  );
};

export default PdfViewer; 