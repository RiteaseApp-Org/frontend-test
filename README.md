# Document Signer & Annotation Tool

This project is a web-based document signer and annotation tool built using Next.js. It allows users to upload PDFs, annotate them with highlights, underlines, comments, and signatures, and export the annotated document while maintaining quality.

## Setup and Running Instructions

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/siccoo/frontend-test
   cd frontend-test
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Libraries and Tools Used

- **Next.js**: Chosen for its fast performance, SSR capabilities, and seamless development experience.
- **React-PDF**: Used to render and display PDF documents in the viewport.
- **pdf-lib**: Allows for adding annotations and signatures programmatically to the PDF.
- **react-dropzone**: Provides an intuitive drag-and-drop file upload experience.
- **Tailwind CSS**: Used for styling to ensure a modern and responsive UI.

## Challenges Faced & Solutions

1. **Rendering Large PDFs Efficiently**
`Issue`: Some large PDF files caused performance lags.
`Solution`: Used React-PDF’s paginated rendering and lazy loading techniques to optimize performance.

2. **Handling Text Selection for Annotations**
`Issue`: Needed to allow users to highlight or underline selected text dynamically.
`Solution`: Implemented a listener that detects selected text and applies styles dynamically.

3. **Embedding Annotations on Export**
`Issue`: Ensuring that exported PDFs retain user annotations.
`Solution`: Used pdf-lib to programmatically embed highlights, underlines, and signatures onto the document before saving.

4. **Multi-Page Support for Annotations**
`Issue`: Initially, annotations were restricted to a single page.
`Solution`: Modified state management to track annotations on multiple pages and update the rendered PDF dynamically.

## Future Enhancements

1. **Improved Multi-Page Annotation**
Enhancing the UI/UX to make navigation between pages seamless when annotating multiple pages.

2. **Real-Time Collaboration**
Allow multiple users to annotate a document simultaneously in real time.

3. **OCR for Scanned PDFs**
Implement OCR (Optical Character Recognition) to enable text selection and annotation on scanned PDFs.

4. **Export Options**
Support exporting in different formats such as PNG, DOCX, and JSON for structured annotation storage.

## Conclusion

This document signer and annotation tool provides a seamless experience for users who need to work with PDFs interactively. It combines a modern UI with robust annotation capabilities while ensuring high-quality PDF exports. Future improvements will further enhance its usability and feature set!