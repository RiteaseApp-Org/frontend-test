Upload & View PDFs – Easily load and display PDFs in a viewport.

Drag & Drop Support – Seamless file upload via drag-and-drop.

Annotations – Add highlights, comments, underlines, and freehand drawings.

User-Friendly Interface – Simple controls for a smooth annotation experience.


----------------------Setup & Running Instructions----------------------

after clining
cd PDF-SIGNER.
then npm install.
then npm run dev.

 -------------------------------Libraries & Tools Used;-------------------------------

next	: Next.js framework for React-based web apps
react / react-dom	: Core React libraries for building UI
pdfjs-dist : Renders PDF documents in the browser
react-pdf : Displays PDFs in React components
pdf-lib	: Allows modifying and embedding annotations into PDFs
@pdf-lib/fontkit	: Handles custom font embedding for PDFs
@react-pdf/renderer :	Generates PDFs dynamically
tailwind-merge	: Optimizes Tailwind CSS class merging
class-variance-authority :	Manages class-based styling variations
clsx	Simplifies conditional CSS class handling
lucide-react :	Provides modern, customizable icons
sonner :	Displays notifications for a better user


------------------------------Why These Libraries?------------------------------

1. Next.js for performance optimization and server-side rendering.
2. pdfjs-dist & react-pdf for rendering PDF files in the browser.
3. pdf-lib for embedding annotations into the PDF before downloading.
4. Tailwind CSS utilities for efficient styling and UI design.
5. Radix UI components for better accessibility and user interactions.


---------------Challenges & Solutions------------------

1️. Embedding Annotations into the Downloaded PDF
Problem: After adding annotations, downloading the PDF resulted in the original file without the modifications.
Solution: Implemented pdf-lib to flatten annotations into the document. Adjusted coordinate mapping to ensure proper placement when scaling.

2️. Coordinate System Issues
Problem: Annotations were misaligned due to differences between viewport and PDF coordinate systems.
Solution: Converted pixel-based coordinates into a percentage-based system to maintain consistency across different screen sizes.


---------------Features to Add if I Had More Time---------------

1. Search Functionality – Allow users to find specific words in the document.
2. Fullscreen Mode – Expand the document viewer for a better experience.
3. Advanced Undo & Redo – Improve history tracking for better user control.
4. Persistent Annotations – Improve annotation saving, so they remain even after reloading the page