import * as ReactKonva from "react-konva";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import {
  imageInstancesSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";

import { Transformer } from "../Transformer/Transformer";

type box = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

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
