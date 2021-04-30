import React from "react";
import { SelectedAnnotationTransformer } from "./SelectedAnnotationTransformer";
import { selectedAnnotationsIdsSelector } from "../../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { useSelector } from "react-redux";

type TransformerProps = {
  transformPosition: ({
    x,
    y,
  }: {
    x: number;
    y: number;
  }) => { x: number; y: number } | undefined;
};

export const SelectedAnnotationsTransformers = ({
  transformPosition,
}: TransformerProps) => {
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  return (
    <>
      {selectedAnnotationsIds.map((annotationId: string) => {
        return (
          <SelectedAnnotationTransformer
            transformPosition={transformPosition}
            annotationId={annotationId}
          />
        );
      })}
    </>
  );
};
