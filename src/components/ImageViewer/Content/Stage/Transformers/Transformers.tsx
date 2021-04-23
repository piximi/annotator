import * as ReactKonva from "react-konva";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectedAnnotationsIdsSelector } from "../../../../../store/selectors/selectedAnnotationsIdsSelector";
import { stageScaleSelector } from "../../../../../store/selectors";

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

  const [boundBox, setBoundBox] = useState<box>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
  });

  const stageScale = useSelector(stageScaleSelector);

  if (!selectedAnnotationsIds) return <React.Fragment />;

  const boundingBoxFunc = (oldBox: box, newBox: box) => {
    setBoundBox(newBox);
    return newBox;
  };

  const getRelativeBox = (boundBox: box) => {
    const relativePosition = transformPosition({
      x: boundBox.x,
      y: boundBox.y,
    });
    if (!relativePosition) return;
    return {
      x: relativePosition.x / stageScale,
      y: relativePosition.y / stageScale,
      height: boundBox.height / stageScale,
      width: boundBox.width / stageScale,
    };
  };

  return (
    <>
      {selectedAnnotationsIds.map((annotationId, idx) => {
        return (
          <ReactKonva.Transformer
            boundBoxFunc={boundingBoxFunc}
            onTransformEnd={() => {
              console.info(getRelativeBox(boundBox));
            }}
            id={"tr-".concat(annotationId)}
          />
        );
      })}
    </>
  );
};
