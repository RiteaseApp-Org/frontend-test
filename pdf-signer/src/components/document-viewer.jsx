"use client";

import React, { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();


export function DocumentViewer({ file, zoomLevel, currentPage, selectedTool }) {
  const containerRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    console.log("PDF loaded successfully with", numPages, "pages");
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err) {
    console.error("Error loading PDF:", err);
    setError("Failed to load PDF file. Please make sure it's a valid PDF.");
  }

  // Create a URL for the file if it's a File object
  const fileUrl = file instanceof File ? URL.createObjectURL(file) : file;

  // Cleanup URL on component unmount
  useEffect(() => {
    return () => {
      if (fileUrl && file instanceof File) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl, file]);

  const handleMouseDown = (e) => {
    if (selectedTool === "draw" && containerRef.current) {
      setIsDrawing(true);
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoomLevel / 100);
      const y = (e.clientY - rect.top) / (zoomLevel / 100);
      setCurrentPath([{ x, y }]);
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && selectedTool === "draw" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoomLevel / 100);
      const y = (e.clientY - rect.top) / (zoomLevel / 100);
      setCurrentPath((prev) => [...prev, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && selectedTool === "draw") {
      setIsDrawing(false);
      if (currentPath.length > 1) {
        setAnnotations((prev) => [
          ...prev,
          {
            type: "draw",
            path: currentPath,
            page: currentPage,
          },
        ]);
      }
      setCurrentPath([]);
    }
  };

  const handleClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoomLevel / 100);
    const y = (e.clientY - rect.top) / (zoomLevel / 100);

    if (selectedTool === "highlight") {
      setAnnotations((prev) => [
        ...prev,
        {
          type: "highlight",
          x,
          y,
          width: 100,
          height: 20,
          page: currentPage,
        },
      ]);
    } else if (selectedTool === "comment") {
      setAnnotations((prev) => [
        ...prev,
        {
          type: "comment",
          x,
          y,
          text: "Add a comment...",
          page: currentPage,
        },
      ]);
    }
  };

  // Filter annotations for current page
  const currentAnnotations = annotations.filter(
    (annotation) => annotation.page === currentPage
  );

  return (
    <div className="flex justify-center p-8 min-h-full">
      <div
        ref={containerRef}
        className="relative bg-white shadow-lg transition-transform duration-200 ease-in-out cursor-default"
        style={{
          width: `calc(8.5in * ${zoomLevel / 100})`,
          height: `calc(11in * ${zoomLevel / 100})`,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "top center",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {file ? (
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex items-center justify-center">
                  <p>Loading PDF...</p>
                </div>
              }
              error={
                error && (
                  <div className="text-red-500 text-center">
                    <p>{error}</p>
                    <p className="text-sm mt-2">Please try uploading again</p>
                  </div>
                )
              }
            >
              {numPages > 0 && (
                <Page
                  pageNumber={currentPage}
                  width={8.5 * 96} // 8.5 inches * 96 DPI
                  className="page"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              )}
            </Document>
          ) : (
            <div>
              <p>Upload a PDF to get started</p>
            </div>
          )}
        </div>

        {/* Render annotations */}
        {currentAnnotations.map((annotation, index) => {
          if (annotation.type === "highlight") {
            return (
              <div
                key={index}
                className="absolute bg-yellow-200 opacity-50"
                style={{
                  left: annotation.x,
                  top: annotation.y,
                  width: annotation.width,
                  height: annotation.height,
                }}
              />
            );
          } else if (annotation.type === "comment") {
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  left: annotation.x,
                  top: annotation.y,
                }}
              >
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-xs">i</span>
                </div>
              </div>
            );
          } else if (annotation.type === "draw") {
            // Create SVG path from points
            const pathData = annotation.path.reduce((acc, point, i) => {
              return i === 0
                ? `M ${point.x} ${point.y}`
                : `${acc} L ${point.x} ${point.y}`;
            }, "");

            return (
              <svg
                key={index}
                className="absolute inset-0 pointer-events-none"
                style={{ width: "100%", height: "100%" }}
              >
                <path d={pathData} stroke="red" strokeWidth="2" fill="none" />
              </svg>
            );
          }
          return null;
        })}

        {/* Current drawing path */}
        {isDrawing && currentPath.length > 1 && (
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          >
            <path
              d={currentPath.reduce((acc, point, i) => {
                return i === 0
                  ? `M ${point.x} ${point.y}`
                  : `${acc} L ${point.x} ${point.y}`;
              }, "")}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        )}

        {/* Page number indicator */}
        {file && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            Page {currentPage} of {numPages}
          </div>
        )}
      </div>
    </div>
  );
}
