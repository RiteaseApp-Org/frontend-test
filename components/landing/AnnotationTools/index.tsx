"use client";

import {
  Download,
  Hand,
  Highlighter,
  MessageCircle,
  PaintBucket,
  Signature,
  Underline,
} from "lucide-react";
import AnnotatonBtn from "./AnnotatonBtn";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { AnnotationType } from "@/types/AnnotationTypes";
import { PDFDocument, rgb } from "pdf-lib";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface PropType {
  setColor: (c: string) => void;
  color: string;
  setAnnotationType: (t: AnnotationType) => void;
  pdfUrl: string;
  annotations: any[];
  fileName: string | undefined;
}

const AnnotationTools: React.FC<PropType> = ({
  color,
  setColor,
  setAnnotationType,
  pdfUrl,
  annotations,
  fileName,
}) => {
  const [selectedTool, setSelectedTool] = useState<string>("hand");

  const handleToolSelection = (value: any) => {
    setSelectedTool(value);

    if (value === "color") return;
    setAnnotationType(value);
  };

  const exportPdfWithAnnotations = async () => {
    // Fetch the existing PDF
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
      res.arrayBuffer()
    );

    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Add annotations (including signatures) to the PDF
    const pages = pdfDoc.getPages();
    console.log("Total pages in PDF:", pages.length);

    for (const annotation of annotations) {
      if (annotation.page < 1 || annotation.page > pages.length) {
        console.error(
          `Invalid pageNumber: ${annotation.page}. Skipping annotation.`
        );
        continue;
      }
      const page = pages[annotation.page - 1];

      if (annotation.type === "highlight" || annotation.type === "underline") {
        page.drawRectangle({
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height,
          color: annotation.type === "highlight" ? rgb(1, 1, 0) : rgb(1, 0, 0),
          opacity: 0.5,
        });
      } else if (annotation.type === "signature" && annotation.dataUrl) {
        // Embed the signature image from the base64 data URL
        const signatureImageBytes = Uint8Array.from(
          atob(annotation.dataUrl.split(",")[1]),
          (c) => c.charCodeAt(0)
        );
        const signatureImageEmbed = await pdfDoc.embedPng(signatureImageBytes);

        page.drawImage(signatureImageEmbed, {
          x: annotation.x,
          y: annotation.y,
          width: annotation.width || 100,
          height: annotation.height || 50,
        });
      }
    }

    // export modified PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName || "annotated.pdf";
    link.click();
  };

  return (
    <div className="">
      <div className="flex gap-4 flex-wrap justify-center">
        <AnnotatonBtn
          color={color}
          label="Hand"
          disabled={selectedTool === "hand"}
          onClick={() => handleToolSelection("hand")}
          Icon={Hand}
        />

        <Dialog>
          <DialogTrigger asChild>
            <AnnotatonBtn
              color={color}
              label="Color"
              onClick={() => handleToolSelection("color")}
              Icon={PaintBucket}
            />
          </DialogTrigger>
          <DialogContent className="w-auto p-2 bg-white border rounded-lg shadow-lg">
            <HexColorPicker
              style={{
                width: 180,
                height: 180,
              }}
              onChange={setColor}
              color={color}
            />
          </DialogContent>
        </Dialog>

        <AnnotatonBtn
          color={color}
          label="Highlight"
          disabled={selectedTool === "highlight"}
          onClick={() => handleToolSelection("highlight")}
          Icon={Highlighter}
        />
        <AnnotatonBtn
          color={color}
          label="Underline"
          disabled={selectedTool === "underline"}
          onClick={() => handleToolSelection("underline")}
          Icon={Underline}
        />
        <AnnotatonBtn
          color={color}
          label="Comment"
          disabled={selectedTool === "comment"}
          onClick={() => handleToolSelection("comment")}
          Icon={MessageCircle}
        />
        <AnnotatonBtn
          color={color}
          label="Sign"
          disabled={selectedTool === "signature"}
          onClick={() => handleToolSelection("signature")}
          Icon={Signature}
        />
        <AnnotatonBtn
          color={color}
          label="Save"
          Icon={Download}
          onClick={exportPdfWithAnnotations}
        />
      </div>
    </div>
  );
};

export default AnnotationTools;
