# RiteEase - PDF Annotation Tool

A powerful Next.js application for annotating PDF documents with various tools including highlighting, underlining, commenting, and signature capabilities.

## Features

- **Document Upload**: Drag and drop or select PDF files to annotate
- **Annotation Tools**:
  - Highlight text with customizable colors
  - Underline text with customizable colors
  - Add comments to specific parts of the document
  - Create and place signatures on the document
- **Document Export**: Export the annotated document with all annotations embedded
- **Responsive Design**: Works well on different screen sizes
- **Intuitive UI**: Clean, modern interface with smooth interactions

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- PDF.js (for rendering PDFs)
- PDF-lib (for PDF manipulation)
- React-signature-canvas (for signature functionality)
- React-dropzone (for file upload)

## Challenges faced

- Getting the annotations to export in the correct position in the PDF
- Getting annotation to start from the correct position in the PDF

## What I would do differently next time

- Work more on fixing the starting o=position of the annotations so it's clearer to the user where the annotation will start
- Write Tests for all annotation functionality and export functionality


## Getting Started

### Prerequisites

- Node.js (v16.8 or later)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ritease.git
cd ritease
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. **Upload a PDF**:
   - Drag and drop a PDF file into the drop zone or click to browse files
   - Only PDF files are accepted

2. **Use Annotation Tools**:
   - Select a tool from the toolbar (highlight, underline, comment, signature)
   - For highlights and underlines, select a color and then click and drag over the desired area
   - For comments, click anywhere on the document to add a comment
   - For signatures, draw your signature in the signature pad

3. **Navigate the Document**:
   - Use the navigation controls to move between pages
   - Adjust zoom level using the zoom controls

4. **Export the Annotated PDF**:
   - Click the export button to download your annotated PDF
   - All annotations will be embedded in the exported document

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 