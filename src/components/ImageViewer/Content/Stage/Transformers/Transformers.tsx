import React from "react";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useSelector } from "react-redux";
import { Transformer } from "../Transformer/Transformer";
import { newAnnotationSelector } from "../../../../../store/selectors/newAnnotationSelector";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";

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

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

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
      {selectedAnnotation && (
        <Transformer
          transformPosition={transformPosition}
          annotationId={selectedAnnotation.id}
        />
      )}
    </>
  );
};
