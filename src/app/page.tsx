"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const addHighlight = () => {
    setAnnotations([...annotations, { type: "highlight", color: "yellow" }]);
  };

  const addUnderline = () => {
    setAnnotations([...annotations, { type: "underline", color: "red" }]);
  };

  const addComment = () => {
    const comment = prompt("Enter your comment:");
    if (comment) {
      setAnnotations([...annotations, { type: "comment", text: comment }]);
    }
  };

  const addSignature = () => {
    const signature = prompt("Enter your signature:");
    if (signature) {
      setSignatures([...signatures, { text: signature }]);
    }
  };


  return <div>Document Uploader</div>;
};

export default DocumentUploader;
