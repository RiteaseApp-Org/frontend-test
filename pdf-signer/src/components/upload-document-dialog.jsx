"use client"

import { Button } from "@/components/ui/button"

export const UploadDocumentDialog = ({ open, onOpenChange }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Drag and drop your PDF here, or click to select
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Upload</Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 