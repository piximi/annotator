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

  const [boundBox, setBoundBox] = useState<box | null>(null);

  const [startBox, setStartBox] = useState<box>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
  });

  const stageScale = useSelector(stageScaleSelector);

  if (!selectedAnnotationsIds) return <React.Fragment />;

  const boundingBoxFunc = (oldBox: box, newBox: box) => {
    if (!boundBox) setStartBox(oldBox);
    setBoundBox(newBox);
    return newBox;
  };

  /*
   * Obtain box coordinates in image space
   */
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
      rotation: 0,
    };
  };

  const getResizedContour = () => {
    if (!boundBox || !startBox) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox) return;

    // get necessary parameters for transfromation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;
    const centerX = relativeBoundBox.x + relativeBoundBox.width / 2;
    const centerY = relativeBoundBox.y + relativeBoundBox.height / 2;
  };

  const onTransformEnd = () => {
    getResizedContour();

    // change image annotations with new contour
  };

  return (
    <>
      {selectedAnnotationsIds.map((annotationId, idx) => {
        return (
          <ReactKonva.Transformer
            boundBoxFunc={boundingBoxFunc}
            centeredScaling={true}
            onTransformEnd={onTransformEnd}
            id={"tr-".concat(annotationId)}
          />
        );
      })}
    </>
  );
};
