# AnnotatePro - Secure and Efficient PDF Workflow Solution

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13-blueviolet)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## Overview

The AnnotatePro Application is a robust, modern PDF document management and electronic signature solution built on the Next.js framework. Designed for efficiency and security, this application provides a comprehensive suite of tools for document upload, annotation, and secure digital signing, catering to a wide range of professional document workflows.

## Key Features

*   **Seamless Document Upload:** Intuitive drag-and-drop interface and file selection for effortless PDF uploads.
*   **Advanced Annotation Suite:** Comprehensive annotation tools, including highlighting, underlining, comments, and freehand drawing with customizable options.
*   **Secure Electronic Signatures:** Embedded signature capture directly on the document, enhancing document integrity and authenticity.
*   **High-Fidelity Document Export:** Export annotated and signed documents in high-quality PDF format, preserving clarity and integrity.
*   **Responsive & Accessible Design:**  Built with accessibility in mind (Radix UI), ensuring a seamless user experience across all devices.

## Architecture & Technologies

This application leverages a modern tech stack to provide optimal performance, security, and maintainability.

*   **Frontend:**
    *   **Next.js 13 (App Router & React Server Components):** Enables server-side rendering (SSR), static site generation (SSG), and improved performance.
    *   **React:**  A declarative, efficient, and flexible JavaScript library for building user interfaces.
    *   **TypeScript:** Provides static typing for enhanced code maintainability and reduced runtime errors.
    *   **Radix UI:** A library of unstyled, accessible UI primitives to promote composability and flexibility.
    *   **Tailwind CSS:** A utility-first CSS framework for rapid UI development and consistent styling.
    *   **shadcn/ui:** A collection of re-usable components built on Radix UI and Tailwind CSS, providing a visually appealing and functional user interface.
    *   **react-pdf v9:**  A React component for rendering PDFs, enabling document viewing and interaction.

*   **PDF Processing:**
    *   **PDF.js:**  A Mozilla project for PDF parsing and rendering, providing granular control over document processing.

## Getting Started

Follow these steps to set up and run the application locally:

### Prerequisites

*   Node.js (version 18 or higher)
*   npm (or yarn/pnpm)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd frontend-test
    cd project
    ```

2.  Install dependencies:

    ```bash
    npm install  # or yarn install or pnpm install
    ```

### Development

1.  Start the development server:

    ```bash
    npm run dev  # or yarn dev or pnpm dev
    ```

    Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

### Production Build & Deployment

1.  Build the application for production:

    ```bash
    npm run build  # or yarn build or pnpm build
    ```

2.  Start the production server:

    ```bash
    npm run start  # or yarn start or pnpm start
    ```

    This will serve the built application. You can deploy the `out` directory to a hosting provider of your choice (e.g., Vercel, Netlify, AWS).

## Configuration

The application can be customized via environment variables. Create a `.env.local` file in the root directory and define the necessary variables.  Refer to the `.env.example` file for available configuration options.

## PDF.js Worker Integration

A key challenge in this project was correctly configuring the PDF.js web worker within the Next.js environment.  The following configurations were implemented:

1.  **Webpack Configuration (in `next.config.js`):**

    ```javascript
    const nextConfig = {
      webpack: (config) => {
        config.resolve.alias.canvas = false; // canvas is not needed and errors without this.
        config.plugins.push(
          new webpack.ProvidePlugin({
            PDFWorker: 'pdfjs-dist/build/pdf.worker.js',
          }),
        );
        return config;
      },
    };

    module.exports = nextConfig;
    ```

2.  **Worker Registration (in the PDF viewer component):**

    ```typescript
    import { GlobalWorkerOptions } from 'pdfjs-dist';

    if (typeof window !== 'undefined') { // Ensure it runs client-side
        GlobalWorkerOptions.workerSrc = `/pdf.worker.js`;
    }
    ```

## Roadmap & Future Enhancements

*   **Digital Certificates:** Implementation of cryptographic signing using digital certificates for enhanced document authenticity and non-repudiation.
*   **Advanced Collaboration:**  Features for real-time collaborative annotation and document review, including threaded comments and permission management.
*   **Form Field Support:**  Enabling the creation and editing of interactive form fields within PDF documents.
*   **API Integration:** Providing an API for seamless integration with other business applications and document management systems.
*   **Accessibility Improvements:**  Ongoing efforts to improve accessibility and compliance with WCAG standards.
*   **Multi-document Workflows:** Streamline workflows involving multiple documents, including batch processing and document comparison functionalities.

## Contributing

Contributions are welcome!  Please fork the repository and submit a pull request with your changes.  Be sure to follow the coding style and guidelines.  See `CONTRIBUTING.md` for more details.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.