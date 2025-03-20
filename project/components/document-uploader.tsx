"use client";

import { useState, useRef } from 'react';
import { FileUp, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; 

interface DocumentUploaderProps {
  onFileUpload: (file: File) => void;
}

export function DocumentUploader({ onFileUpload }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        onFileUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        onFileUpload(file);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <motion.div 
        className={cn(
          "relative rounded-lg p-8 transition-colors cursor-pointer",
          isDragging ? "bg-primary/10" : "hover:bg-accent hover:bg-opacity-5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        whileHover={{ scale: 1.03, backgroundColor: "rgba(var(--accent-rgb), 0.15)" }} // Hover animation
        whileDrag={{ scale: 1.05, backgroundColor: "rgba(var(--primary-rgb), 0.25)", borderColor: "rgba(var(--primary-rgb), 1)", borderWidth: 2, transition: { duration: 0.2 } }} // Drag animation
        transition={{ duration: 0.2, ease: "easeInOut" }} // General transition
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <motion.div // Animate the icon container
            className="rounded-full bg-muted p-3 flex items-center justify-center"
            animate={{ scale: isDragging ? 1.1 : 1 }} // Icon pulse on drag
            transition={{ duration: 0.2 }}
          >
            <FileUp className="h-6 w-6 text-muted-foreground" />
          </motion.div>
          <div className="space-y-1">
            <h3 className="font-medium text-lg">Drag & Drop PDF here</h3>
            <p className="text-sm text-muted-foreground">
              or <span className="underline underline-offset-2 text-primary font-medium cursor-pointer">browse files</span>
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
            PDF files only, max 10MB
          </p>
        </div>
      </motion.div>
    </div>
  );
}