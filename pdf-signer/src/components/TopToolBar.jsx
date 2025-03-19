"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileUp,
  Maximize2,
  Minimize2,
  Redo2,
  Search,
  FilePenLineIcon as Signature,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { modifyPDF } from "@/utils/pdfModifier"

export const Top_ToolBar = ({ 
  setShowUploadDialog, 
  currentPage, 
  setCurrentPage, 
  numPages,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  annotations,
  pdfFile,
  zoomLevel,
  setZoomLevel,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const handleNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleToolSelect = (tool) => {
    setSelectedTool(tool === selectedTool ? null : tool)
  }

  const handleDownload = async () => {
    try {
      if (!pdfFile) return;

      // Modify the PDF with annotations
      const modifiedPdfBytes = await modifyPDF(pdfFile, annotations);

      // Create a blob and download
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'annotated-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading modified PDF:', error);
    }
  };

  return (
    <div className="flex items-center justify-between border-b p-2 border-slate-200 dark:border-slate-800 bg-background">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => setShowUploadDialog(true)}>
                <FileUp className="h-5 w-5" />
                <span className="sr-only">Upload Document</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload Document</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleDownload} 
                disabled={!pdfFile}
                className="cursor-pointer" 
                variant="ghost" 
                size="icon"
              >
                <Download className="h-5 w-5" />
                <span className="sr-only">Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="cursor-pointer" 
                variant="ghost" 
                size="icon"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 className="h-5 w-5" />
                <span className="sr-only">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="cursor-pointer" 
                variant="ghost" 
                size="icon"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 className="h-5 w-5" />
                <span className="sr-only">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-muted rounded-md px-2 py-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <span className="text-sm">
            {currentPage} / {numPages || 1}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7"
            onClick={handleNextPage}
            disabled={!numPages || currentPage >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>

        <div className="flex items-center gap-1 bg-muted rounded-md px-2 py-1">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom Out</span>
          </Button>
          <span className="text-sm w-12 text-center">{zoomLevel}%</span>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer h-7 w-7"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom In</span>
          </Button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghost" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                <span className="sr-only">{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="cursor-pointer" variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Top_ToolBar
