"use client";

import { useState } from "react";
import { toast } from "sonner";

interface PropType {
  onFileSelect: (file: File) => void;
  handleURLChange: () => void;
}

const FileUploader: React.FC<PropType> = ({
  onFileSelect,
  handleURLChange,
}) => {
  // track user dragging a file
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileSelect(files[0]);
      handleURLChange();
    } else {
      toast.error("Files must be in pdf format");
    }

    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      toast.error("Please upload a valid pdf file");
    }
  };

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      htmlFor="file-input"
      className="cursor-pointer"
    >
      <div
        className={`border-2 border-dashed rounded-lg px-6 py-8 cursor-pointer text-center ${
          isDragging
            ? "border-[#0070f3] bg-[#f0f8ff]"
            : "border-[#cccccc] bg-[#f9f9f9]"
        }`}
      >
        <h2 className="text-2xl w-full">Drop your PDF here!</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-input"
        />
      </div>
    </label>
  );
};

export default FileUploader;
