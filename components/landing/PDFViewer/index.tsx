"use client";
import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Annotation, AnnotationType } from "@/types/AnnotationTypes";
import RenderAnnotation from "./RenderAnnotation";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PropType {
  pdfUrl: string;
  annotations: any[];
  addAnnotation: (annotation: Annotation) => void;
  annotationType: AnnotationType;
  selectedColor: string;
}

const PDFViewer: React.FC<PropType> = ({
  pdfUrl,
  annotationType,
  annotations,
  selectedColor,
  addAnnotation,
}) => {
  // pdf current page and number of pages
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // signature
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [showSignaturePad, setShowSignaturePad] = useState<boolean>(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
  };

  //   pdf page display ref
  const viewerRef = useRef<HTMLDivElement>(null);
  const signaturePadRef = useRef<SignatureCanvas | null>(null);

  // selecting text in pdf
  const handleTextSelection = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const viewerRect = viewerRef.current?.getBoundingClientRect();

    if (viewerRect) {
      const selectedText = selection?.toString().trim();

      if (!selectedText) return;

      if (annotationType === "hand" || annotationType === "signature") return;

      // Prompt user for a comment
      const comment = prompt("Enter a comment for the selected text:");

      const annotation = {
        dataUrl: null,
        text: selectedText,
        type: annotationType,
        x: rect.left - viewerRect.left,
        y: rect.top - viewerRect.top,
        height: rect.height,
        width: rect.width,
        page: pageNumber,
        color: selectedColor,
        comment: comment || "",
      };

      // check if highlighted text already exist
      const isDuplicate = annotations.some((existing) => {
        return (
          existing.text === annotation.text &&
          existing.page === annotation.page &&
          (existing.x === annotation.x || existing.y === annotation.y)
        );
      });

      // only add unique annotation
      if (!isDuplicate) {
        addAnnotation(annotation);
      } else {
        toast.info("Book reference already");
      }
    }
  };

  // Track mouse position for signature
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (annotationType === "signature") {
      const rect = viewerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left; // Mouse position relative to the PDF page
        const y = e.clientY - rect.top;
        setSignaturePosition({ x, y }); // Store the position
        setShowSignaturePad(true);
      }
    }
  };

  const handleSignatureComplete = () => {
    if (signaturePadRef.current) {
      const signatureData = signaturePadRef.current.toDataURL("image/png");

      const annotation = {
        type: annotationType,
        dataUrl: signatureData,
        page: pageNumber,
        color: selectedColor,
        x: signaturePosition.x,
        y: signaturePosition.y,
        text: "",
        height: 50,
        width: 100,
        comment: "",
      };
      addAnnotation(annotation);
      setShowSignaturePad(false);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 20;
    const y = e.clientY - rect.top - 20;
    setSignaturePosition({ x, y });
  };

  // page scale
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale(0.6);
      } else {
        setScale(1.0);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative w-full h-full overflow-auto ">
      <div className="flex flex-col items-center justify-center">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LoadingSpinner />}
        >
          <div
            ref={viewerRef}
            className="border-2 relative overflow-auto"
            onMouseUp={handleTextSelection}
            onMouseDown={handleMouseDown}
          >
            <Page
              pageNumber={pageNumber}
              className="w-full max-w-full md:max-w-4xl"
              renderAnnotationLayer={false}
              scale={scale}
            />
            {/* render annotations */}
            {annotations
              .filter((anno) => anno.page === pageNumber)
              .map((anno, index) => (
                <RenderAnnotation annotation={anno} key={index} />
              ))}
          </div>
        </Document>

        {/* navigation for the pages */}
        <div className="flex justify-center items-center space-x-4 mt-4">
          <Button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prevState) => prevState - 1)}
          >
            <ArrowLeft />
          </Button>

          <span>
            Page {pageNumber} of {numPages}
          </span>
          <Button
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>

      {/* show signature pad */}
      {showSignaturePad && (
        <div
          className="absolute z-10 w-[200px] rounded-md bg-[rgba(255,255,255,0.4)]"
          style={{
            left: signaturePosition.x,
            top: signaturePosition.y,
          }}
        >
          <div className="p-4">
            <SignatureCanvas
              ref={signaturePadRef}
              backgroundColor="transparent"
              penColor={selectedColor}
              canvasProps={{
                width: 160,
                height: 75,
                className: "border-2",
                onMouseDown: () => {
                  handleCanvasMouseDown;
                },
              }}
            />
            <div className="mt-4 flex justify-center items-center space-x-3">
              <Button
                onClick={() => setShowSignaturePad(false)}
                className="text-sm px-4 py-2 bg-gray-400 text-white rounded"
              >
                <X />
              </Button>
              <Button
                onClick={handleSignatureComplete}
                className="text-sm px-4 py-2 bg-green-400 text-white rounded"
              >
                <Check />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
