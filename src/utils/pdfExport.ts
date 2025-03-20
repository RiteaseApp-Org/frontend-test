import { PDFDocument, rgb } from 'pdf-lib';
import { Annotation } from '../types';

export async function exportPdfWithAnnotations(
  sourceFile: File,
  annotations: Annotation[]
): Promise<Blob> {
 
  const fileArrayBuffer = await readFileAsArrayBuffer(sourceFile);
  const pdfDoc = await PDFDocument.load(fileArrayBuffer);
  const pages = pdfDoc.getPages();
  

  const annotationsByPage = groupAnnotationsByPage(annotations);
  
 
  for (const pageNum in annotationsByPage) {
    const pageIndex = parseInt(pageNum) - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;
    
    const page = pages[pageIndex];
    const { height } = page.getSize();
    
    // Scale factor to convert from screen coordinates (612) to PDF coordinates (96)
    const SCALE_FACTOR = 96 / 612;  // This will convert 612 to 96
    
    for (const annotation of annotationsByPage[pageNum]) {
      switch (annotation.type) {
        case 'highlight':
          if (annotation.width && annotation.height) {
            const color = parseColor(annotation.color ?? '#FFEB3B');
            
            // Convert only x position to PDF coordinates, keep original width
            const pdfX = annotation.position.x * SCALE_FACTOR;
            
            page.drawRectangle({
              x: pdfX,
              y: height - annotation.position.y - annotation.height,
              width: annotation.width,
              height: annotation.height,
              color: color,
              opacity: 0.3,
            });
          }
          break;
        
        case 'underline':
          if (annotation.width) {
            const color = parseColor(annotation.color ?? '#4285F4');
            
            // Convert only x position to PDF coordinates, keep original width
            const pdfX = annotation.position.x * SCALE_FACTOR;
            
            page.drawLine({
              start: { x: pdfX, y: height - annotation.position.y - 2 },
              end: { x: pdfX + annotation.width, y: height - annotation.position.y - 2 },
              thickness: 2,
              color,
            });
          }
          break;
        
        case 'comment': {
          const commentColor = parseColor(annotation.color ?? '#FFC107');

          page.drawCircle({
            x: annotation.position.x + 10,
            y: height - annotation.position.y - 10,
            size: 10,
            color: commentColor,
          });
          
          if (annotation.content) {
            const textLines = wrapText(annotation.content, 20);
            
            page.drawRectangle({
              x: annotation.position.x,
              y: height - annotation.position.y - 20 - textLines.length * 12,
              width: 150,
              height: textLines.length * 12 + 10,
              color: commentColor,
              borderColor: commentColor,
              borderWidth: 1,
              opacity: 0.9,
            });
            
            for (let i = 0; i < textLines.length; i++) {
              page.drawText(textLines[i], {
                x: annotation.position.x + 5,
                y: height - annotation.position.y - 30 - i * 12,
                size: 8,
              });
            }
          }
          break;
        }
        
        case 'signature':
          if (annotation.text) {
           
            try {
              const img = await embedSignatureImage(pdfDoc, annotation.text);
              if (img && annotation.width && annotation.height) {
                page.drawImage(img, {
                  x: annotation.position.x,
                  y: height - annotation.position.y - annotation.height,
                  width: annotation.width,
                  height: annotation.height,
                });
              }
            } catch (error) {
              console.error('Error embedding signature:', error);
            }
          }
          break;
      }
    }
  }
  

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}


function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}


function groupAnnotationsByPage(annotations: Annotation[]): Record<string, Annotation[]> {
  return annotations.reduce((acc, annotation) => {
    const pageNum = annotation.position.pageNumber.toString();
    if (!acc[pageNum]) {
      acc[pageNum] = [];
    }
    acc[pageNum].push(annotation);
    return acc;
  }, {} as Record<string, Annotation[]>);
}

function parseColor(hexColor: string) {
  const hex = hexColor.slice(1); // Remove #
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  return rgb(r, g, b);
}


async function embedSignatureImage(pdfDoc: PDFDocument, dataUrl: string) {
  if (!dataUrl) return null;
  
  try {
  
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) return null;
    

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
  
    const image = await pdfDoc.embedPng(bytes);
    return image;
  } catch (error) {
    console.error('Error embedding signature image:', error);
    return null;
  }
}


function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if (currentLine.length + word.length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
} 