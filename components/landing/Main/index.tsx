"use client";

import { useRef, useState } from "react";
import FileUploader from "../FileUploader";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Button } from "@/components/ui/button";
import PDFViewer from "../PDFViewer";
import AnnotationTools from "../AnnotationTools";
import { AnnotationType, Annotation } from "@/types/AnnotationTypes";
import AnnotationList from "../AnnotationList";

const Main = () => {
  // pdf file & loading
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfURL, setPdfURL] = useState<string>("");

  // colorpicker
  const [selectedColor, setSelectedColor] = useState("#0000ff");

  // annotation drawing
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationType, setAnnotationType] = useState<AnnotationType>("hand");

  // pdf viewer ref for smooth scrolling
  const viewerSecRef = useRef<HTMLDivElement | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setLoading(true);

    // simulate 3 seconds for file upload
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  // reset url when pdf file is changed
  const resetPdfURL = () => {
    setPdfURL("");
    setAnnotations([]);
  };

  const handleViewBtnClick = () => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPdfURL(url);
      viewerSecRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      toast.error("No file selected");
    }
  };

  // add new annotation
  const addAnnotation = (annotation: Annotation) => {
    setAnnotations((prevState) => [...prevState, annotation]);
  };

  const setAnnotation = (type: AnnotationType) => {
    setAnnotationType(type);
  };

  return (
    <div className="w-full py-6 md:py-10">
      <div className="">
        {/* Drag and drop zone */}
        <div className="w-full max-w-sm mx-auto">
          <FileUploader
            onFileSelect={handleFileSelect}
            handleURLChange={resetPdfURL}
          />
          <div className="mt-8 text-center">
            {loading && <LoadingSpinner />}
            {selectedFile && !loading && (
              <div>
                <h4 className="text-sm md:text-base lg:text-xl">
                  Selected File:
                </h4>
                <p>{selectedFile.name}</p>
                <Button onClick={handleViewBtnClick} className="mt-4">
                  {!pdfURL ? "View PDF" : "Scroll Down"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PDF viewer */}
        {pdfURL && (
          <div
            className="md:px-8 mt-[900px] w-full h-full flex flex-col gap-2"
            ref={viewerSecRef}
          >
            <div className="py-4 px-4 bg-neutral-200 w-full rounded-sm">
              <AnnotationTools
                color={selectedColor}
                setColor={setSelectedColor}
                setAnnotationType={setAnnotation}
                pdfUrl={pdfURL}
                annotations={annotations
                  .filter((ann): ann is Annotation & { type: 'highlight' | 'underline' | 'signature' } => 
                    ['highlight', 'underline', 'signature'].includes(ann.type as 'highlight' | 'underline' | 'signature')
                  )
                  .map(ann => ({
                    ...ann,
                    dataUrl: ann.dataUrl || undefined // Convert null to undefined
                  }))}
                fileName={selectedFile?.name}
              />
            </div>
            <div className="bg-neutral-200 p-4 rounded-sm flex flex-col lg:flex-row gap-4">
              <PDFViewer
                pdfUrl={pdfURL}
                addAnnotation={addAnnotation}
                annotationType={annotationType}
                selectedColor={selectedColor}
                annotations={annotations}
              />
              <AnnotationList annotations={annotations} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
