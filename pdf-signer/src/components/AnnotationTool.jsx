"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { UploadDocumentDialog } from "./upload-document-dialog";
import TopToolBar from "./TopToolBar";

const AnnotationTool = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  return (
    <>
      <div
        className={`flex flex-col h-screen ${
          isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
        }`}
      >
        <TopToolBar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
        </div>

        <UploadDocumentDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
        />
      </div>
    </>
  );
};

export default AnnotationTool;
