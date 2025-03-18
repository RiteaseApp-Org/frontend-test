"use client";

import React, {useState} from 'react';
import { useDropzone } from 'react-dropzone';
import {Document, Page, pdfjs} from "react-pdf";
import { PDFDocument, rgb } from 'pdf-lib';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DocumentUploader = () => {
  const [file, setFile] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [signatures, setSignatures] = useState([]);

  const {getRootProps, getInputProps} = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    }
  })

  return (
    <div>Document Uploader</div>
  )
}

export default DocumentUploader