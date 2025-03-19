"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { FileUp, Upload, File, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function UploadDocumentDialog({ open, onOpenChange, onFileUpload }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const dropZoneRef = useRef(null)

  const validateFile = (file) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file')
      return false
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size should be less than 10MB')
      return false
    }
    setError(null)
    return true
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setFile(file)
        setIsUploading(true)
        // Simulate upload progress
        setTimeout(() => setIsUploading(false), 1000)
      } else {
        e.target.value = null
      }
    }
  }

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if the drag is entering the drop zone
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      const isInDropZone = (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      )
      setIsDragging(isInDropZone)
    }
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
    
    // Check if still in drop zone
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      const isInDropZone = (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      )
      setIsDragging(isInDropZone)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if the drag is leaving the drop zone
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      const isOutsideDropZone = (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      )
      if (isOutsideDropZone) {
        setIsDragging(false)
      }
    }
  }, [])

  // Add event listeners to handle dragging outside the dialog
  useEffect(() => {
    const handleWindowDragLeave = (e) => {
      if (!e.relatedTarget) {
        setIsDragging(false)
      }
    }

    window.addEventListener('dragleave', handleWindowDragLeave)
    return () => {
      window.removeEventListener('dragleave', handleWindowDragLeave)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    const pdfFile = droppedFiles.find(file => file.type.includes('pdf'))

    if (pdfFile) {
      if (validateFile(pdfFile)) {
        setFile(pdfFile)
        setIsUploading(true)
        // Simulate upload progress
        setTimeout(() => setIsUploading(false), 1000)
      }
    } else {
      setError('Please drop a PDF file')
    }
  }, [])

  const handleUpload = () => {
    if (file) {
      const fileBlob = new Blob([file], { type: file.type });
      onFileUpload(fileBlob);
      onOpenChange(false);
      setFile(null);
      setError(null);
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a PDF document to annotate.</DialogDescription>
        </DialogHeader>

        <div
          ref={dropZoneRef}
          className={cn(
            "mt-4 relative border-2 border-dashed rounded-lg transition-all duration-300 ease-in-out",
            isDragging && "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50",
            file && !isUploading && "border-primary/50 bg-primary/5",
            !file && !isDragging && "border-muted-foreground/20 hover:border-primary/50",
            "group"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Blue overlay during drag */}
          {isDragging && (
            <div className="absolute inset-0 rounded-lg flex items-center justify-center pointer-events-none">
              <div className="absolute inset-0 bg-blue-50/90 rounded-lg" />
              <div className="relative flex flex-col items-center gap-2 text-blue-600">
                <div className="p-3 bg-white rounded-full shadow-lg">
                  <File className="h-6 w-6" />
                </div>
                <p className="font-medium text-sm bg-white px-4 py-1 rounded-full shadow-sm">
                  Drop PDF here
                </p>
              </div>
            </div>
          )}

          <div className={cn(
            "flex flex-col items-center gap-4 p-8",
            isDragging && "opacity-0 transition-opacity duration-300"
          )}>
            <div className={cn(
              "rounded-full p-4 transition-all duration-300",
              file ? 'bg-primary/10' : 'bg-muted group-hover:bg-muted/70',
              isUploading && 'animate-pulse'
            )}>
              {file && !isUploading ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <FileUp className={cn(
                  "h-6 w-6",
                  file ? 'text-primary' : 'text-muted-foreground'
                )} />
              )}
            </div>

            {file ? (
              <div className="text-center space-y-1">
                <p className="font-medium text-primary truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {isUploading && (
                  <p className="text-sm text-primary animate-pulse">
                    Processing file...
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">
                  Drag and drop your PDF here or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Files up to 10MB are supported
                </p>
              </div>
            )}

            {!file && (
              <Label htmlFor="file-upload" className="mt-2">
                <div className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </div>
                <Input 
                  id="file-upload" 
                  type="file" 
                  accept=".pdf" 
                  className="sr-only" 
                  onChange={handleFileChange}
                />
              </Label>
            )}

            {error && (
              <p className="text-sm text-destructive text-center animate-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              onOpenChange(false)
              setFile(null)
              setError(null)
              setIsUploading(false)
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className={cn(
              "transition-all duration-300",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? "Processing..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

