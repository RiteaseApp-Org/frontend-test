"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";

pdfjs.GlobalWorkerOptions.workerSrc = `http://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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

  const exportPDF = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const existingPdfBytes = reader.result;
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      annotations.forEach((annotation) => {
        if (annotation.type === "highlight") {
          firstPage.drawRectangle({
            x: 50,
            y: 500,
            width: 200,
            height: 50,
            color: rgb(1, 1, 0),
            opacity: 0.5,
          });
        } else if (annotation.type === "underline") {
          firstPage.drawLine({
            start: { x: 50, y: 480 },
            end: { x: 250, y: 480 },
            thickness: 2,
            color: rgb(1, 0, 0),
          });
        } else if (annotation.type === "comment") {
          firstPage.drawText(annotation.text, {
            x: 50,
            y: 460,
            size: 12,
            color: rgb(0, 0, 1),
          });
        }
      });

      signatures.forEach((signature, index) => {
        firstPage.drawText(signature.text, {
          x: 50,
          y: 400 - index * 20,
          size: 16,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "annotated.pdf";
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center p-5">
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-10 rounded-lg cursor-pointer hover:border-gray-600"
      >
        <input {...getInputProps()} />
        <p>Drag & drop a PDF here, or click to select a file</p>
      </div>

      {file && (
        <div className="mt-5 w-full">
          <Document file={file}>
            <Page pageNumber={1} />
          </Document>
          <button
            onClick={addHighlight}
            className="mt-2 p-2 bg-yellow-500 text-white rounded"
          >
            Highlight
          </button>
          <button
            onClick={addUnderline}
            className="mt-2 p-2 bg-red-500 text-white rounded"
          >
            Underline
          </button>
          <button
            onClick={addComment}
            className="mt-2 p-2 bg-green-500 text-white rounded"
          >
            Add Comment
          </button>
          <button
            onClick={addSignature}
            className="mt-2 p-2 bg-purple-500 text-white rounded"
          >
            Sign
          </button>
          <button
            onClick={exportPDF}
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
