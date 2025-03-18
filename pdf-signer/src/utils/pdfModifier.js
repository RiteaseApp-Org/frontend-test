import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function modifyPDF(file, annotations) {
  try {
    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Embed the standard font for text annotations
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Group annotations by page
    const annotationsByPage = annotations.reduce((acc, annotation) => {
      const pageNum = annotation.page - 1;
      if (!acc[pageNum]) acc[pageNum] = [];
      acc[pageNum].push(annotation);
      return acc;
    }, {});

    // Process each page
    Object.entries(annotationsByPage).forEach(([pageNum, pageAnnotations]) => {
      const page = pages[pageNum];
      const { width, height } = page.getSize();

      // PDF points per inch (72 points = 1 inch)
      const POINTS_PER_INCH = 72;
      // Screen DPI (usually 96)
      const SCREEN_DPI = 96;

      // Calculate scale factors (convert from screen coordinates to PDF points)
      const scaleX = POINTS_PER_INCH / SCREEN_DPI;
      const scaleY = POINTS_PER_INCH / SCREEN_DPI;

      pageAnnotations.forEach((annotation) => {
        try {
          switch (annotation.type) {
            case 'highlight':
              page.drawRectangle({
                x: annotation.x * scaleX,
                y: height - (annotation.y * scaleY) - (annotation.height * scaleY),
                width: annotation.width * scaleX,
                height: annotation.height * scaleY,
                color: rgb(1, 0.9, 0),
                opacity: 0.3,
              });
              break;

            case 'underline':
              page.drawLine({
                start: { 
                  x: annotation.x * scaleX,
                  y: height - (annotation.y * scaleY)
                },
                end: { 
                  x: (annotation.x + annotation.width) * scaleX,
                  y: height - (annotation.y * scaleY)
                },
                thickness: 1.5,
                color: rgb(0, 0, 0),
                opacity: 1,
              });
              break;

            case 'draw':
              if (annotation.path && annotation.path.length > 1) {
                const pathPoints = annotation.path.map(point => ({
                  x: point.x * scaleX,
                  y: height - (point.y * scaleY)
                }));

                for (let i = 1; i < pathPoints.length; i++) {
                  const color = annotation.color ? hexToRgb(annotation.color) : rgb(0, 0, 0);
                  page.drawLine({
                    start: pathPoints[i - 1],
                    end: pathPoints[i],
                    thickness: annotation.strokeWidth || 2,
                    color,
                    opacity: 1,
                  });
                }
              }
              break;

            case 'comment':
              if (annotation.comment) {
                const commentText = `📝 ${annotation.comment}`;
                page.drawText(commentText, {
                  x: annotation.x * scaleX,
                  y: height - (annotation.y * scaleY),
                  size: 12,
                  font,
                  color: rgb(0, 0, 1),
                  maxWidth: width * 0.3,
                  lineHeight: 14,
                });
              }
              break;

            case 'signature':
              if (annotation.path && annotation.path.length > 1) {
                const signaturePoints = annotation.path.map(point => ({
                  x: point.x * scaleX,
                  y: height - (point.y * scaleY)
                }));

                for (let i = 1; i < signaturePoints.length; i++) {
                  page.drawLine({
                    start: signaturePoints[i - 1],
                    end: signaturePoints[i],
                    thickness: 2,
                    color: rgb(0, 0, 0),
                    opacity: 1,
                  });
                }
              }
              break;
          }
        } catch (error) {
          console.error(`Error processing annotation of type ${annotation.type}:`, error);
        }
      });
    });

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error modifying PDF:', error);
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