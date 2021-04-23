import * as ReactKonva from "react-konva";
import React, { useRef, useState } from "react";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  imageInstancesSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotationsIds,
} from "../../../../../store/slices";
import Konva from "konva";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";

type box = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type TransformerProps = {
  transformPosition: ({
    x,
    y,
  }: {
    x: number;
    y: number;
  }) => { x: number; y: number } | undefined;
  annotationId: string;
};

export const Transformer = ({
  transformPosition,
  annotationId,
}: TransformerProps) => {
  const annotations = useSelector(imageInstancesSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const transformerRef = useRef<Konva.Transformer | null>(null);

  const dispatch = useDispatch();

  const [boundBox, setBoundBox] = useState<box | null>(null);

  const [startBox, setStartBox] = useState<box>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    rotation: 0,
  });

  const stageScale = useSelector(stageScaleSelector);

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

  const onTransformEnd = () => {
    if (!boundBox || !startBox) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox) return;

    // get necessary parameters for transfromation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;
    const centerX = relativeBoundBox.x + relativeBoundBox.width / 2;
    const centerY = relativeBoundBox.y + relativeBoundBox.height / 2;

    // change image anniotatons with new contour
    const annotation = _.filter(annotations, (annotation: AnnotationType) => {
      return annotation.id === annotationId;
    })[0];

    const others = _.filter(annotations, (annotation: AnnotationType) => {
      return annotation.id !== annotationId;
    });

    if (!annotation && selectedAnnotation) {
      const contour = selectedAnnotation.contour;

      const resizedContour = _.flatten(
        _.map(_.chunk(contour, 2), (el: Array<number>) => {
          return [
            centerX + scaleX * (el[0] - centerX),
            centerY + scaleY * (el[1] - centerY),
          ];
        })
      );

      dispatch(
        setSelectedAnnotation({
          selectedAnnotation: {
            ...selectedAnnotation,
            contour: resizedContour,
          },
        })
      );
    } else {
      const contour = annotation.contour;

      const resizedContour = _.flatten(
        _.map(_.chunk(contour, 2), (el: Array<number>) => {
          return [
            centerX + scaleX * (el[0] - centerX),
            centerY + scaleY * (el[1] - centerY),
          ];
        })
      );

      const updated = { ...annotation, contour: resizedContour }; //FIXME: update bounding box too

      dispatch(
        applicationSlice.actions.setImageInstances({
          instances: [...others, updated],
        })
      );
      dispatch(setSelectedAnnotationsIds({ selectedAnnotationsIds: [] }));
      dispatch(
        applicationSlice.actions.setSelectedAnnotation({
          selectedAnnotation: undefined,
        })
      );
    }
  };

  return (
    <ReactKonva.Transformer
      boundBoxFunc={boundingBoxFunc}
      centeredScaling={true}
      onTransformEnd={onTransformEnd}
      id={"tr-".concat(annotationId)}
      ref={transformerRef}
    />
  );
};
