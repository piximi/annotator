import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";

import { SelectedAnnotationsTransformers } from "./SelectedAnnotationsTransformers/SelectedAnnotationsTransformers";
import { newAnnotationSelector } from "../../../../../store/selectors/newAnnotationSelector";

type TransformersProps = {
  transformPosition: ({
    x,
    y,
  }: {
    x: number;
    y: number;
  }) => { x: number; y: number } | undefined;
};

export const Transformers = ({ transformPosition }: TransformersProps) => {
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const newAnnotation = useSelector(newAnnotationSelector);

  if (!selectedAnnotationsIds && newAnnotation) return <React.Fragment />;

  return (
    <>
      <SelectedAnnotationsTransformers transformPosition={transformPosition} />
      {/*{newAnnotation && (*/}
      {/*  <SelectedAnnotationsTransformer*/}
      {/*    transformPosition={transformPosition}*/}
      {/*    annotationId={newAnnotation.id}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
