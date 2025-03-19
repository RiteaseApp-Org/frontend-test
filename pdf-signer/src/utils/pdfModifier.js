import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function modifyPDF(file, annotations, zoomLevel = 100) {
  try {
    console.log('Starting PDF modification with:', {
      fileExists: !!file,
      annotationCount: annotations?.length,
      zoomLevel
    });

    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      updateMetadata: false,
      ignoreEncryption: true
    });

    const pages = pdfDoc.getPages();
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Group annotations by page and log
    const annotationsByPage = annotations.reduce((acc, annotation) => {
      const pageNum = annotation.page - 1;
      if (!acc[pageNum]) acc[pageNum] = [];
      acc[pageNum].push(annotation);
      return acc;
    }, {});

    console.log('Annotations by page:', annotationsByPage);

    // Process each page's annotations
    Object.entries(annotationsByPage).forEach(([pageNum, pageAnnotations]) => {
      const page = pages[pageNum];
      const { width, height } = page.getSize();
      console.log(`Processing page ${pageNum} with dimensions:`, { width, height });

      // Convert viewport coordinates to PDF space
      const toPDFSpace = (x, y) => ({
        x: (x * width) / zoomLevel,
        y: height - ((y * height) / zoomLevel)
      });

      // Convert dimensions to PDF space
      const toPDFDimension = (size) => (size * width) / zoomLevel;

      pageAnnotations.forEach((annotation) => {
        try {
          console.log('Processing annotation:', {
            type: annotation.type,
            x: annotation.x,
            y: annotation.y,
            width: annotation.width,
            height: annotation.height
          });

          switch (annotation.type) {
            case 'highlight': {
              const { x, y } = toPDFSpace(annotation.x, annotation.y);
              const w = toPDFDimension(annotation.width);
              const h = toPDFDimension(annotation.height);

              // Draw highlight with searchable text
              page.drawRectangle({
                x,
                y: y - h,
                width: w,
                height: h,
                color: rgb(1, 0.95, 0),
                opacity: 0.3,
                borderWidth: 0
              });

              if (annotation.text) {
                page.drawText(annotation.text, {
                  x,
                  y: y - h,
                  font: helvetica,
                  size: h,
                  color: rgb(0, 0, 0),
                  opacity: 0 // Invisible but searchable
                });
              }
              break;
            }

            case 'underline': {
              const { x, y } = toPDFSpace(annotation.x, annotation.y);
              const w = toPDFDimension(annotation.width);

              page.drawLine({
                start: { x, y },
                end: { x: x + w, y },
                thickness: 1.5,
                color: rgb(0, 0, 0),
                opacity: 0.8,
                lineCap: 'round'
              });
              break;
            }

            case 'draw': {
              if (annotation.path?.length > 1) {
                const color = annotation.color ? hexToRgb(annotation.color) : rgb(0, 0, 0);
                
                // Create smooth path for drawing
                for (let i = 1; i < annotation.path.length; i++) {
                  const start = toPDFSpace(annotation.path[i - 1].x, annotation.path[i - 1].y);
                  const end = toPDFSpace(annotation.path[i].x, annotation.path[i].y);

                  page.drawLine({
                    start,
                    end,
                    thickness: annotation.strokeWidth || 2,
                    color,
                    opacity: 1,
                    lineCap: 'round',
                    lineJoin: 'round'
                  });
                }
              }
              break;
            }

            case 'comment': {
              if (annotation.comment) {
                const { x, y } = toPDFSpace(annotation.x, annotation.y);
                const boxWidth = Math.min(200, width * 0.3);
                const boxHeight = 40;
                const padding = 5;

                // Draw comment box with background
                page.drawRectangle({
                  x,
                  y: y - boxHeight,
                  width: boxWidth,
                  height: boxHeight,
                  color: rgb(0.98, 0.98, 0.98),
                  borderColor: rgb(0.7, 0.7, 0.7),
                  borderWidth: 1,
                  opacity: 1
                });

                // Draw comment text with word wrapping
                const words = annotation.comment.split(' ');
                let line = '';
                let yOffset = padding;
                const fontSize = 9;
                const lineHeight = fontSize * 1.2;

                for (const word of words) {
                  const testLine = line + word + ' ';
                  const textWidth = helvetica.widthOfTextAtSize(testLine, fontSize);

                  if (textWidth > boxWidth - 2 * padding && line !== '') {
                    page.drawText(line.trim(), {
                      x: x + padding,
                      y: y - yOffset - fontSize - padding,
                      size: fontSize,
                      font: helvetica,
                      color: rgb(0, 0, 0)
                    });
                    line = word + ' ';
                    yOffset += lineHeight;
                  } else {
                    line = testLine;
                  }
                }

                if (line.trim()) {
                  page.drawText(line.trim(), {
                    x: x + padding,
                    y: y - yOffset - fontSize - padding,
                    size: fontSize,
                    font: helvetica,
                    color: rgb(0, 0, 0)
                  });
                }
              }
              break;
            }
          }
        } catch (error) {
          console.error('Error processing annotation:', error, annotation);
        }
      });
    });

    console.log('Saving modified PDF...');
    const modifiedPdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      preserveExistingEncryption: true
    });
    console.log('PDF modification complete');
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error in modifyPDF:', error);
    throw error;
  }
}

function hexToRgb(hex) {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  } catch {
    return rgb(0, 0, 0);
  }
} 