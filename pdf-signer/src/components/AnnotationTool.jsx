"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

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
        <Top_ToolBar />

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
