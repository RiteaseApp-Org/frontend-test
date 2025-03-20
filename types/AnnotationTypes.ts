export type AnnotationType =
  | "hand"
  | "highlight"
  | "underline"
  | "signature"
  | "comment"
  | null;

export interface Annotation {
  text: string;
  type: AnnotationType;
  x: number;
  y: number;
  height: number;
  width: number;
  page: number;
  color: string;
  comment: string;
  dataUrl: string | null;
}
