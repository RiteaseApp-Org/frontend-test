import { Document } from 'react-pdf';

export interface Position {
  x: number;
  y: number;
  pageNumber: number;
}

export interface Annotation {
  id: string;
  type: 'highlight' | 'underline' | 'comment' | 'signature';
  position: Position;
  content?: string;
  color?: string;
  width?: number;
  height?: number;
  text?: string;
  points?: { x: number; y: number }[];
}

export interface PdfViewerState {
  file: File | null;
  annotations: Annotation[];
  numPages: number;
  currentPage: number;
  scale: number;
  pdfDocument: ReturnType<typeof Document> | null;
  currentTool: 'cursor' | 'highlight' | 'underline' | 'comment' | 'signature';
  currentColor: string;
} 