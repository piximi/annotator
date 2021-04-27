import * as ReactKonva from "react-konva";
import React, { useRef, useState } from "react";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  imageInstancesSelector,
  imageSelector,
  stageScaleSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setSelectedAnnotation,
  setSelectedAnnotationsIds,
} from "../../../../../store/slices";
import Konva from "konva";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { connectPoints } from "../../../../../image/imageHelper";
import { simplify } from "../../../../../image/simplify/simplify";
import { slpf } from "../../../../../image/polygon-fill/slpf";
import { encode } from "../../../../../image/rle";
import * as ImageJS from "image-js";

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

  const image = useSelector(imageSelector);

  if (!image || !image.shape) return <React.Fragment />;

  const imageWidth = image.shape.width;
  const imageHeight = image.shape.height;

  const computeBoundingBoxFromContours = (
    contour: Array<number>
  ): [number, number, number, number] => {
    const pairs = _.chunk(contour, 2);

    return [
      Math.round(_.min(_.map(pairs, _.first))!),
      Math.round(_.min(_.map(pairs, _.last))!),
      Math.round(_.max(_.map(pairs, _.first))!),
      Math.round(_.max(_.map(pairs, _.last))!),
    ];
  };

  const boundingBoxFunc = (oldBox: box, newBox: box) => {
    if (!boundBox) setStartBox(oldBox);

    const relativeNewBox = getRelativeBox(newBox);

    if (!imageWidth || !imageHeight || !relativeNewBox)
      return boundBox ? boundBox : startBox;
    if (
      relativeNewBox.x + relativeNewBox.width > imageWidth ||
      relativeNewBox.y + relativeNewBox.height > imageHeight ||
      relativeNewBox.x + relativeNewBox.width < 0 ||
      relativeNewBox.y + relativeNewBox.height < 0
    )
      return boundBox ? boundBox : startBox;

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

  const resizeContour = (
    contour: Array<number>,
    center: { x: number; y: number },
    scale: { x: number; y: number }
  ) => {
    return _.flatten(
      _.map(_.chunk(contour, 2), (el: Array<number>) => {
        return [
          center.x + scale.x * (el[0] - center.x),
          center.y + scale.y * (el[1] - center.y),
        ];
      })
    );
  };

  const onTransformEnd = () => {
    if (!boundBox || !startBox) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox) return;

    // get necessary parameters for transfromation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;

    const oppositeAnchorPosition = getOppositeAnchorPosition();
    const scaledOppositeAnchorPosition = {
      x: oppositeAnchorPosition.x / stageScale,
      y: oppositeAnchorPosition.y / stageScale,
    };

    const centerX = scaledOppositeAnchorPosition.x + relativeBoundBox.x;
    const centerY = scaledOppositeAnchorPosition.y + relativeBoundBox.y;

    // change image anniotatons with new contour
    const annotation = _.filter(annotations, (annotation: AnnotationType) => {
      return annotation.id === annotationId;
    })[0];

    const others = _.filter(annotations, (annotation: AnnotationType) => {
      return annotation.id !== annotationId;
    });

    let contour: Array<number>;

    if (!annotation && selectedAnnotation) {
      //Found this to be necessary to detach transformer before re-attaching
      dispatch(
        applicationSlice.actions.setSelectedAnnotation({
          selectedAnnotation: undefined,
        })
      );

      contour = selectedAnnotation.contour;

      const resizedContour = resizeContour(
        contour,
        { x: centerX, y: centerY },
        { x: scaleX, y: scaleY }
      );

      const maskImage = new ImageJS.Image({
        width: imageWidth,
        height: imageHeight,
        bitDepth: 8,
      });

      const coords = _.chunk(resizedContour, 2);

      const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
      simplify(connectedPoints, 1, true);
      slpf(connectedPoints, maskImage);

      console.info(maskImage.toDataURL());

      //@ts-ignore
      const resizedMask = encode(maskImage.getChannel(0).data);

      dispatch(
        setSelectedAnnotation({
          selectedAnnotation: {
            ...selectedAnnotation,
            contour: resizedContour,
            boundingBox: computeBoundingBoxFromContours(resizedContour),
            mask: resizedMask,
          },
        })
      );

      setBoundBox(null);
    } else {
      const contour = annotation.contour;

      const resizedContour = resizeContour(
        contour,
        { x: centerX, y: centerY },
        { x: scaleX, y: scaleY }
      );

      const updated = {
        ...annotation,
        contour: resizedContour,
        boundingBox: computeBoundingBoxFromContours(resizedContour),
      };

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

  const getOppositeAnchorPosition = () => {
    if (!transformerRef || !transformerRef.current) return { x: 0, y: 0 };
    const activeAnchor = transformerRef.current.getActiveAnchor();
    switch (activeAnchor) {
      case "bottom-right": {
        return transformerRef.current
          .findOne(".".concat("top-left"))
          .position();
      }
      case "bottom-center": {
        return transformerRef.current
          .findOne(".".concat("top-center"))
          .position();
      }
      case "bottom-left": {
        return transformerRef.current
          .findOne(".".concat("top-right"))
          .position();
      }
      case "middle-left": {
        return transformerRef.current
          .findOne(".".concat("middle-right"))
          .position();
      }
      case "top-left": {
        return transformerRef.current
          .findOne(".".concat("bottom-right"))
          .position();
      }
      case "top-center": {
        return transformerRef.current
          .findOne(".".concat("bottom-center"))
          .position();
      }
      case "top-right": {
        return transformerRef.current
          .findOne(".".concat("bottom-left"))
          .position();
      }
      case "middle-right": {
        return transformerRef.current
          .findOne(".".concat("middle-left"))
          .position();
      }
      default: {
        return { x: 0, y: 0 };
      }
    }
  };

  return (
    <ReactKonva.Transformer
      boundBoxFunc={boundingBoxFunc}
      onTransformEnd={onTransformEnd}
      id={"tr-".concat(annotationId)}
      ref={transformerRef}
    />
  );
};
