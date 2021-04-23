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

export const Transformers = () => {
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
    setBoundBox({
      x: newBox.x,
      y: newBox.y,
      width: newBox.width / stageScale,
      height: newBox.height / stageScale,
      rotation: 0,
    });
    return newBox;
  };

  return (
    <>
      {selectedAnnotationsIds.map((annotationId, idx) => {
        return (
          <ReactKonva.Transformer
            boundBoxFunc={boundingBoxFunc}
            onTransformEnd={() => {
              console.info(boundBox);
            }}
            id={"tr-".concat(annotationId)}
          />
        );
      })}
    </>
  );
};
