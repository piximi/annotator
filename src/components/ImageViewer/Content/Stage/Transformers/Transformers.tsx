import React from "react";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useSelector } from "react-redux";
import { Transformer } from "../Transformer/Transformer";
import { newAnnotationSelector } from "../../../../../store/selectors/newAnnotationSelector";

type TransformerProps = {
  transformPosition: ({
    x,
    y,
  }: {
    x: number;
    y: number;
  }) => { x: number; y: number } | undefined;
};

export const Transformers = ({ transformPosition }: TransformerProps) => {
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const newAnnotation = useSelector(newAnnotationSelector);

  return (
    <>
      {selectedAnnotationsIds.map((annotationId: string) => {
        return (
          <Transformer
            transformPosition={transformPosition}
            annotationId={annotationId}
          />
        );
      })}
      {newAnnotation && (
        <Transformer
          transformPosition={transformPosition}
          annotationId={newAnnotation.id}
        />
      )}
    </>
  );
};
