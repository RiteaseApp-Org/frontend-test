"use client";

import { useState } from "react";
import {
  Highlighter,
  MessageSquare,
  Pen,
  Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DocumentViewer } from "./document-viewer";
// import { UploadDocumentDialog } from "./upload-document-dialog";
import { cn } from "@/lib/utils";
import { AnnotationColorPicker } from "./ui/annotation-color-picker";

const Sidebar = ({ 
  file, 
  currentPage, 
  setCurrentPage, 
  numPages, 
  setNumPages,
  zoomLevel,
  setZoomLevel,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  
  // Colors for different annotation types
  const [highlightColor, setHighlightColor] = useState("#FFEB3B");
  const [underlineColor, setUnderlineColor] = useState("#000000");
  const [drawColor, setDrawColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleToolSelect = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <>
      <div className="w-16 md:w-20 border-r border-slate-200 dark:border-slate-800 bg-background flex flex-col items-center py-4 gap-6">
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "highlight" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-xl cursor-pointer transition-all duration-200",
                    selectedTool === "highlight"
                      ? "bg-zinc-200"
                      : "hover:bg-zinc-100 hover:shadow-sm"
                  )}
                  onClick={() => handleToolSelect("highlight")}
                >
                  <Highlighter 
                    className="h-5 w-5" 
                    style={{ color: selectedTool === "highlight" ? highlightColor : "currentColor" }}
                  />
                  <span className="sr-only">Highlight</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Highlight</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {selectedTool === "highlight" && (
            <AnnotationColorPicker
              selectedColor={highlightColor}
              onColorChange={setHighlightColor}
              position="right"
              colors={[
                { name: "yellow", value: "#FFEB3B" },
                { name: "green", value: "#4CAF50" },
                { name: "blue", value: "#2196F3" },
                { name: "pink", value: "#E91E63" },
                { name: "orange", value: "#FF9800" },
              ]}
            />
          )}
        </div>

        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "underline" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-xl cursor-pointer transition-all duration-200",
                    selectedTool === "underline"
                      ? "bg-zinc-200"
                      : "hover:bg-zinc-100 hover:shadow-sm"
                  )}
                  onClick={() => handleToolSelect("underline")}
                >
                  <Underline 
                    className="h-5 w-5" 
                    style={{ color: selectedTool === "underline" ? underlineColor : "currentColor" }}
                  />
                  <span className="sr-only">Underline</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Underline</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {selectedTool === "underline" && (
            <AnnotationColorPicker
              selectedColor={underlineColor}
              onColorChange={setUnderlineColor}
              position="right"
            />
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "comment" ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-xl cursor-pointer transition-all duration-200",
                  selectedTool === "comment"
                    ? "bg-zinc-200 "
                    : "hover:bg-zinc-100 hover:shadow-sm"
                )}
                onClick={() => handleToolSelect("comment")}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Comment</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Comment</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedTool === "draw" ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "rounded-xl cursor-pointer transition-all duration-200",
                    selectedTool === "draw"
                      ? "bg-zinc-200"
                      : "hover:bg-zinc-100 hover:shadow-sm"
                  )}
                  onClick={() => handleToolSelect("draw")}
                >
                  <Pen 
                    className="h-5 w-5" 
                    style={{ color: selectedTool === "draw" ? drawColor : "currentColor" }}
                  />
                  <span className="sr-only">Draw</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Draw</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {selectedTool === "draw" && (
            <AnnotationColorPicker
              selectedColor={drawColor}
              onColorChange={setDrawColor}
              showStrokeWidth={true}
              strokeWidth={strokeWidth}
              onStrokeWidthChange={setStrokeWidth}
              position="right"
            />
          )}
        </div>

      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <DocumentViewer
          file={file}
          zoomLevel={zoomLevel}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          numPages={numPages}
          setNumPages={setNumPages}
          selectedTool={selectedTool}
          drawColor={drawColor}
          highlightColor={highlightColor}
          underlineColor={underlineColor}
          strokeWidth={strokeWidth}
        />
      </div>
    </>
  );
};

export default Sidebar;
