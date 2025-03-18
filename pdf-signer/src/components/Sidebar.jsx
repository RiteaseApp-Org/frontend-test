"use client";

import { useState } from "react";
import {
  Highlighter,
  MessageSquare,
  Pen,
  FilePenLineIcon as Signature,
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

const Sidebar = ({ file, currentPage, numPages, setNumPages, setCurrentPage }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedTool, setSelectedTool] = useState(null);


  const handleToolSelect = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <>
      <div className="w-16 md:w-20 border-r border-slate-200 dark:border-slate-800 bg-background flex flex-col items-center py-4 gap-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "highlight" ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-xl cursor-pointer transition-all duration-200",
                  selectedTool === "highlight"
                    ? "bg-zinc-200 "
                    : "hover:bg-zinc-100 hover:shadow-sm"
                )}
                onClick={() => handleToolSelect("highlight")}
              >
                <Highlighter className="h-5 w-5" />
                <span className="sr-only">Highlight</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Highlight</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "underline" ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-xl cursor-pointer transition-all duration-200",
                  selectedTool === "underline"
                    ? "bg-zinc-200 "
                    : "hover:bg-zinc-100 hover:shadow-sm"
                )}
                onClick={() => handleToolSelect("underline")}
              >
                <Underline className="h-5 w-5" />
                <span className="sr-only">Underline</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Underline</TooltipContent>
          </Tooltip>
        </TooltipProvider>

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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "draw" ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-xl cursor-pointer transition-all duration-200",
                  selectedTool === "draw"
                    ? "bg-zinc-200 "
                    : "hover:bg-zinc-100 hover:shadow-sm"
                )}
                onClick={() => handleToolSelect("draw")}
              >
                <Pen className="h-5 w-5" />
                <span className="sr-only">Draw</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Draw</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedTool === "signature" ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "rounded-xl cursor-pointer transition-all duration-200",
                  selectedTool === "signature"
                    ? "bg-zinc-200 "
                    : "hover:bg-zinc-100 hover:shadow-sm"
                )}
                onClick={() => handleToolSelect("signature")}
              >
                <Signature className="h-5 w-5" />
                <span className="sr-only">Signature</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Signature</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        />
      </div>
    </>
  );
};

export default Sidebar;
