"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePdfViewer } from '../hooks/usePdfViewer';
import PdfViewer from '../components/PdfViewer';
import Toolbar from '../components/Toolbar';
import { exportPdfWithAnnotations } from '../utils/pdfExport';

export default function Home() {
  const pdfViewer = usePdfViewer();
  const { 
    state, 
    setFile, 
    setNumPages, 
    setCurrentPage, 
    setScale, 
    setCurrentTool, 
    setCurrentColor,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation 
  } = pdfViewer;

  const [isExporting, setIsExporting] = useState(false);

  // Handle file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      // Check if it's a PDF file
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        setFile(file);
      } else {
        alert('Please upload a valid PDF file');
      }
    }
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });


  const handleExport = async () => {
    if (!state.file) return;
    
    try {
      setIsExporting(true);
      const blob = await exportPdfWithAnnotations(state.file, state.annotations);
			console.log('annotations',state.annotations);
			
      
     
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated_${state.file.name}`;
      document.body.appendChild(a);
      a.click();
      
  
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gray-50">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-blue-500">PDF Annotation Tool</h1>
        <p className="text-center text-gray-600">Upload, annotate, and export PDF documents</p>
      </header>

      <main className="flex-1 flex flex-col">
      
        {state.file && (
          <Toolbar 
            currentTool={state.currentTool}
            currentColor={state.currentColor}
            setCurrentTool={setCurrentTool}
            setCurrentColor={setCurrentColor}
            onExport={handleExport}
            onImport={() => setFile(null)}
            scale={state.scale}
            setScale={setScale}
          />
        )}

       
        {state.file ? (
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white shadow">
            <PdfViewer 
              file={state.file}
              scale={state.scale}
              currentPage={state.currentPage}
              numPages={state.numPages}
              onDocumentLoadSuccess={(numPages) => setNumPages(numPages)}
              onPageChange={setCurrentPage}
              currentTool={state.currentTool}
              currentColor={state.currentColor}
              annotations={state.annotations}
              onAnnotationCreate={addAnnotation}
              onAnnotationUpdate={updateAnnotation}
              onAnnotationDelete={deleteAnnotation}
            />
          </div>
        ) : (
          <div 
            {...getRootProps()}
            className={`flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            <svg 
              className="w-16 h-16 text-gray-400 mb-4" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <p className="text-center text-lg mb-2">
              {isDragActive ? 'Drop the PDF file here...' : 'Drag and drop a PDF file here, or click to select'}
            </p>
            <p className="text-center text-sm text-gray-500">
              Upload a PDF document to start annotating
            </p>
          </div>
        )}

    
        {isExporting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-center">Exporting PDF...</p>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>PDF Annotation Tool</p>
      </footer>
    </div>
  );
} 