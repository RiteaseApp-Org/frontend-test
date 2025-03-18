"use client"

import { useState } from "react"
import { FileUp, Upload } from "lucide-react"

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

export function UploadDocumentDialog({ open, onOpenChange, onFileUpload }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)

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
      } else {
        e.target.value = null
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setFile(file)
      }
    }
  }

  const handleUpload = () => {
    if (file) {
      // Create a copy of the file to ensure it's properly handled
      const fileBlob = new Blob([file], { type: file.type });
      onFileUpload(fileBlob);
      onOpenChange(false);
      setFile(null);
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Upload a PDF document to annotate. Supported formats: PDF, DOCX.</DialogDescription>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted p-3">
              <FileUp className="h-6 w-6 text-muted-foreground" />
            </div>

            {file ? (
              <div className="mt-2">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground">Files up to 10MB are supported</p>
              </>
            )}

            <Label htmlFor="file-upload" className="mt-2">
              <div className="flex cursor-pointer items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
              </div>
              <Input id="file-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} />
            </Label>

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

