import { Annotation } from "@/types/AnnotationTypes";

interface PropType {
  annotations: Annotation[];
}

const AnnotationList: React.FC<PropType> = ({ annotations }) => {
  return (
    <div className="mt-4 max-w-sm mx-auto lg:mx-0 lg:mr-auto w-full">
      <h3>Book Reference</h3>
      <ul className="mt-2 space-y-2">
        {annotations.length === 0 ? (
          <p className="text-sm text-gray-500">No annotations yet.</p>
        ) : (
          annotations
            .filter((anon) => anon.type !== "signature")
            .map((annotation, index) => (
              <li
                key={index}
                className="px-4 py-3 border rounded bg-white flex justify-between w-full items-end"
              >
                <div className="flex-1">
                  <p className="text-sm">{annotation.text}</p>
                  <p className="text-xs text-gray-700 italic">
                    {annotation.comment}
                  </p>
                </div>
                <p className="text-xs opacity-35">Page {annotation.page}</p>
              </li>
            ))
        )}
      </ul>
    </div>
  );
};

export default AnnotationList;
