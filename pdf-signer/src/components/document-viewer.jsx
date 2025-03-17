"use client";

import { useRef, useState } from "react";

export function DocumentViewer({ zoomLevel, currentPage, selectedTool }) {
  const containerRef = useRef(null);
  const [annotations, setAnnotations] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState([]);

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
        {/* Page content - placeholder */}
        <div className="absolute inset-0 p-12 text-sm text-gray-600">
          <h1 className="text-2xl font-bold mb-6">
            Sample Document - Page {currentPage}
          </h1>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed
            auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
          </p>
          <p className="mb-4">
            Ut in nulla enim. Phasellus molestie magna non est bibendum non
            venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
            Mauris iaculis porttitor posuere. Praesent id metus massa, ut
            blandit odio.
          </p>
          <p className="mb-4">
            Proin quis tortor orci. Etiam at risus et justo dignissim congue.
            Donec congue lacinia dui, a porttitor lectus condimentum laoreet.
            Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum
            faucibus eget in metus.
          </p>
          <p className="mb-4">
            In pellentesque faucibus vestibulum. Nulla at nulla justo, eget
            luctus tortor. Nulla facilisi. Duis aliquet egestas purus in
            blandit. Curabitur vulputate, ligula lacinia scelerisque tempor,
            lacus lacus ornare ante.
          </p>
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
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          Page {currentPage}
        </div>
      </div>
    </div>
  );
}
