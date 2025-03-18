"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { UploadDocumentDialog } from "./upload-document-dialog";
import TopToolBar from "./TopToolBar";

const AnnotationTool = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  
  const handleFileUpload = (file) => {
    console.log('File being uploaded:', file);
    setPdfFile(file);
  };

  return (
    <>
      <div
        className={`flex bg-[#fbfbfc] flex-col h-screen ${
          isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
        }`}
      >
        <TopToolBar 
          numPages={numPages} 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage} 
          showUploadDialog={showUploadDialog} 
          setShowUploadDialog={setShowUploadDialog} 
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
            numPages={numPages} 
            setNumPages={setNumPages} 
            file={pdfFile} 
          />
        </div> 

        <UploadDocumentDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onFileUpload={handleFileUpload}
        />
      </div>
    </>
  );
};

export default AnnotationTool;
