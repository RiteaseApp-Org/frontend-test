import { Annotation } from "@/types/AnnotationTypes";
import { hexToRgba } from "@/utils/hexToRgba";
import Image from "next/image";

interface PropType {
  annotation: Annotation;
}

const RenderAnnotation: React.FC<PropType> = ({ annotation }) => {
  if (annotation.type === "signature") {
    return (
      <div
        style={{
          position: "absolute",
          top: annotation.y,
          left: annotation.x,
          width: annotation.width,
          height: annotation.height,
        }}
      >
        <Image
          src={annotation.dataUrl || ""}
          alt="Signature"
          layout="fill"
          objectFit="contain"
        />
      </div>
    );
  }
  return (
    <div
      style={{
        position: "absolute",
        top: annotation.y,
        left: annotation.x,
        width: annotation.width,
        height: annotation.height,
        backgroundColor:
          annotation.type === "highlight"
            ? hexToRgba(annotation.color, 0.4)
            : "transparent",
        textDecoration: annotation.type === "underline" ? "underline" : "none",
        borderBottom:
          annotation.type === "underline"
            ? `2px solid ${annotation.color}`
            : "none",
      }}
    ></div>
  );
};

export default RenderAnnotation;
