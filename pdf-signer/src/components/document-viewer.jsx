"use client";

import React, { useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from 'react-pdf';
import { useAnnotations } from "@/hooks/useAnnotations";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

export function DocumentViewer({ file, zoomLevel, currentPage, numPages, setNumPages, selectedTool, drawColor, strokeWidth, highlightColor, underlineColor }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  const {
    annotations,
    isDrawing,
    currentPath,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    handleHighlight,
    handleComment,
    handleUnderline,
    activeComment,
    updateComment,
    saveComment,
    setActiveComment,
    deleteComment,
  } = useAnnotations(currentPage, zoomLevel, file);

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

  // Add useEffect for handling click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (activeComment && !event.target.closest('.comment-container')) {
        saveComment();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeComment, saveComment]);

  const handleMouseDown = (e) => {
    if (selectedTool === "draw") {
      handleDrawStart(e, containerRef, drawColor, strokeWidth);
    }
  };

  const handleMouseMove = (e) => {
    if (selectedTool === "draw") {
      handleDrawMove(e, containerRef);
    }
  };

  const handleMouseUp = () => {
    if (selectedTool === "draw") {
      handleDrawEnd(drawColor, strokeWidth);
    }
  };

  const handleClick = (e) => {
    if (selectedTool === "highlight") {
      handleHighlight(e, containerRef, highlightColor);
    } else if (selectedTool === "underline") {
      handleUnderline(e, containerRef, underlineColor);
    } else if (selectedTool === "comment" && !activeComment) {
      handleComment(e, containerRef);
    }
  };

  // Filter annotations for current page
  const currentAnnotations = annotations.filter(
    (annotation) => annotation.page === currentPage
  );

  return (
    <div 
      className="flex-1 w-full overflow-auto bg-muted/30"
    >
      <div 
        className="w-full flex flex-col p-4 md:p-8"
      >
        <div
          ref={containerRef}
          className="relative bg-white shadow-lg transition-transform duration-200 ease-in-out cursor-default max-w-full mx-auto"
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
          <div className="absolute inset-0">
            {file ? (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex items-center justify-center h-full">
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
                    width={containerRef.current?.clientWidth}
                    className="max-w-full"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                )}
              </Document>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Upload a PDF to get started</p>
              </div>
            )}
          </div>

          {/* Render annotations */}
          {currentAnnotations.map((annotation, index) => {
            if (annotation.type === "highlight") {
              return (
                <div
                  key={annotation.id || index}
                  className="absolute"
                  style={{
                    left: annotation.x,
                    top: annotation.y,
                    width: annotation.width,
                    height: annotation.height,
                    backgroundColor: annotation.color,
                    opacity: 0.3,
                    pointerEvents: "none",
                  }}
                  title={annotation.text}
                />
              );
            } else if (annotation.type === "underline") {
              return (
                <div
                  key={annotation.id || index}
                  className="absolute"
                  style={{
                    left: annotation.x,
                    top: annotation.y + annotation.height - 1,
                    width: annotation.width,
                    height: '1px',
                    backgroundColor: annotation.color,
                    pointerEvents: "none",
                  }}
                  title={annotation.text}
                />
              );
            } else if (annotation.type === "comment") {
              const isActive = activeComment === annotation.id;
              return (
                <div
                  key={index}
                  className={`absolute comment-container ${isActive ? 'z-50' : 'z-40'}`}
                  style={{
                    left: annotation.x,
                    top: annotation.y,
                  }}
                >
                  {isActive ? (
                    <div className="bg-white shadow-lg rounded-lg p-4 w-[300px]">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-gray-500">
                          {annotation.timestamp}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 -mt-2 -mr-2"
                          onClick={() => deleteComment(annotation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Add your comment..."
                        value={annotation.comment}
                        onChange={(e) => updateComment(annotation.id, e.target.value)}
                        className="min-h-[100px] mb-2"
                        autoFocus
                      />
                      {annotation.lastEdited && (
                        <div className="text-xs text-gray-500 mb-2">
                          Last edited: {annotation.lastEdited}
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveComment(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveComment}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-blue-600 relative group"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the click outside handler
                        setActiveComment(annotation.id);
                      }}
                    >
                      <span className="text-xs">i</span>
                      {/* Preview tooltip */}
                      {annotation.comment && (
                        <div className="absolute left-full ml-2 hidden group-hover:block bg-white text-gray-900 p-2 rounded shadow-lg w-[200px] text-sm">
                          <div className="text-xs text-gray-500 mb-1">
                            {annotation.timestamp}
                          </div>
                          {annotation.comment}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            } else if (annotation.type === "draw") {
              const pathData = annotation.path.reduce((acc, point, i) => {
                return i === 0
                  ? `M ${point.x} ${point.y}`
                  : `${acc} L ${point.x} ${point.y}`;
              }, "");

              return (
                <svg
                  key={annotation.id || index}
                  className="absolute inset-0 pointer-events-none"
                  style={{ width: "100%", height: "100%" }}
                >
                  <path 
                    d={pathData} 
                    stroke={annotation.color}
                    strokeWidth={annotation.strokeWidth}
                    fill="none" 
                  />
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
                stroke={drawColor}
                strokeWidth={strokeWidth}
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
    </div>
  );
}
