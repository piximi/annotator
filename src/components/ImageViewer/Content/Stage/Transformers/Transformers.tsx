import * as ReactKonva from "react-konva";
import React from "react";
import { useSelector } from "react-redux";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";

export const Transformers = () => {
  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  if (!selectedAnnotationsIds) return <React.Fragment />;

  return (
    <>
      {selectedAnnotationsIds.map((annotationId, idx) => {
        return <ReactKonva.Transformer id={"tr-".concat(annotationId)} />;
      })}
    </>
  );
};
