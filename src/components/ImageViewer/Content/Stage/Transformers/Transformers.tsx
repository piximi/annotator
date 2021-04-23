import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";

import { Transformer } from "../Transformer/Transformer";

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

  if (!selectedAnnotationsIds) return <React.Fragment />;

  return (
    <>
      {selectedAnnotationsIds.map((annotationId, idx) => {
        return (
          <Transformer
            transformPosition={transformPosition}
            annotationId={annotationId}
          />
        );
      })}
    </>
  );
};
