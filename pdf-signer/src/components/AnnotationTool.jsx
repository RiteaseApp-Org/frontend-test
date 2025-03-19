"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { UploadDocumentDialog } from "./upload-document-dialog";
import TopToolBar from "./TopToolBar";
import { useAnnotations } from "@/hooks/useAnnotations";

const AnnotationTool = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);

  const {
    annotations,
    // ... other annotation props
    undo,
    redo,
    canUndo,
    canRedo
  } = useAnnotations(currentPage, zoomLevel, pdfFile);

  const handleFileUpload = (file) => {
    console.log('File being uploaded:', file);
    setPdfFile(file);
  };

  return (
    <div className={`flex bg-[#fbfbfc] flex-col h-screen ${
      isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
    }`}>
      <TopToolBar 
        numPages={numPages} 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage} 
        showUploadDialog={showUploadDialog} 
        setShowUploadDialog={setShowUploadDialog}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        annotations={annotations}
        pdfFile={pdfFile}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          numPages={numPages} 
          setNumPages={setNumPages} 
          file={pdfFile}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
        />
      </div> 

      <UploadDocumentDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default AnnotationTool;
