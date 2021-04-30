import * as ReactKonva from "react-konva";
import React, { useRef, useState } from "react";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  imageSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotations,
  setNewAnnotation,
} from "../../../../../store/slices";
import Konva from "konva";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { newAnnotationSelector } from "../../../../../store/selectors/newAnnotationSelector";
import {
  computeBoundingBoxFromContours,
  getOppositeAnchorPosition,
  resizeContour,
  resizeMask,
} from "../../../../../image/transformerHelper";

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
  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

  const newAnnotation = useSelector(newAnnotationSelector);

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

  const [center, setCenter] = useState<{ x: number; y: number } | undefined>();

  const stageScale = useSelector(stageScaleSelector);

  const image = useSelector(imageSelector);

  if (!image || !image.shape) return <React.Fragment />;

  const imageWidth = image.shape.width;
  const imageHeight = image.shape.height;

  const computeResizedContour = () => {
    if (!boundBox || !startBox) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox) return;

    // get necessary parameters for transfromation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;

    let contour;

    if (newAnnotation) {
      contour = newAnnotation.contour;
      if (!center || !contour) return;

      const resizedContour = resizeContour(contour, center, {
        x: scaleX,
        y: scaleY,
      });
      const updatedAnnotation = {
        ...newAnnotation,
        contour: resizedContour,
        boundingBox: computeBoundingBoxFromContours(resizedContour),
      };

      updateNewAnnotation(updatedAnnotation);
    } else if (selectedAnnotation) {
      contour = selectedAnnotation.contour;
      if (!center || !contour) return;

      const resizedContour = resizeContour(contour, center, {
        x: scaleX,
        y: scaleY,
      });
      const updatedAnnotation = {
        ...selectedAnnotation,
        contour: resizedContour,
        boundingBox: computeBoundingBoxFromContours(resizedContour),
      };

      updateSelectedAnnotation(updatedAnnotation);
    }

    setBoundBox(null);
  };

  const boundingBoxFunc = (oldBox: box, newBox: box) => {
    if (!boundBox) setStartBox(oldBox);

    const relativeNewBox = getRelativeBox(newBox);

    if (!imageWidth || !imageHeight || !relativeNewBox)
      return boundBox ? boundBox : startBox;
    if (
      relativeNewBox.x + relativeNewBox.width > imageWidth ||
      relativeNewBox.y + relativeNewBox.height > imageHeight ||
      relativeNewBox.x < 0 ||
      relativeNewBox.y < 0
    ) {
      return boundBox ? boundBox : startBox;
    }

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

  const updateSelectedAnnotation = (updatedAnnotation: AnnotationType) => {
    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [updatedAnnotation],
      })
    );

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: updatedAnnotation,
      })
    );
  };

  const updateNewAnnotation = (updatedAnnotation: AnnotationType) => {
    dispatch(
      setNewAnnotation({
        newAnnotation: updatedAnnotation,
      })
    );
  };

  const onTransform = () => {
    if (!center) {
      if (!transformerRef || !transformerRef.current) return { x: 0, y: 0 };
      const oppositeAnchorPosition = getOppositeAnchorPosition(
        transformerRef.current
      );
      const scaledOppositeAnchorPosition = {
        x: oppositeAnchorPosition.x / stageScale,
        y: oppositeAnchorPosition.y / stageScale,
      };

      const relativeStartBox = getRelativeBox(startBox);

      if (!relativeStartBox) return;

      setCenter({
        x: scaledOppositeAnchorPosition.x + relativeStartBox.x,
        y: scaledOppositeAnchorPosition.y + relativeStartBox.y,
      });
    } else computeResizedContour();
  };

  const onTransformStart = () => {
    if (newAnnotation) return;

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: selectedAnnotations.filter(
          (annotation: AnnotationType) => {
            return annotation.id === annotationId;
          }
        )[0],
      })
    );

    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [
          selectedAnnotations.filter((annotation: AnnotationType) => {
            return annotation.id === annotationId;
          })[0],
        ],
      })
    );
  };

  const onTransformEnd = () => {
    if (!selectedAnnotation) return;

    let contour;

    if (newAnnotation) {
      contour = newAnnotation.contour;

      const resizedMask = resizeMask(contour, imageWidth, imageHeight);

      const updatedAnnotation = {
        ...newAnnotation,
        mask: resizedMask,
      };

      updateNewAnnotation(updatedAnnotation);
    } else if (selectedAnnotation) {
      contour = selectedAnnotation.contour;

      const resizedMask = resizeMask(contour, imageWidth, imageHeight);

      const updatedAnnotation = {
        ...selectedAnnotation,
        mask: resizedMask,
      };
      updateSelectedAnnotation(updatedAnnotation);
    }

    setCenter(undefined);
  };

  return (
    <ReactKonva.Transformer
      boundBoxFunc={boundingBoxFunc}
      onTransform={onTransform}
      onTransformEnd={onTransformEnd}
      onTransformStart={onTransformStart}
      id={"tr-".concat(annotationId)}
      ref={transformerRef}
      rotateEnabled={false}
    />
  );
};
