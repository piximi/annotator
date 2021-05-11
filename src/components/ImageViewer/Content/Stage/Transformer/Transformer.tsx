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
  setSelectedAnnotations,
  setSelectedAnnotation,
} from "../../../../../store/slices";
import Konva from "konva";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { connectPoints } from "../../../../../image/imageHelper";
import { simplify } from "../../../../../image/simplify/simplify";
import { slpf } from "../../../../../image/polygon-fill/slpf";
import { encode } from "../../../../../image/rle";
import * as ImageJS from "image-js";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { useCursor } from "../../../../../hooks";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { unselectedAnnotationsSelector } from "../../../../../store/selectors/unselectedAnnotationsSelector";
import useSound from "use-sound";
import createAnnotationSoundEffect from "../../../../../sounds/pop-up-on.mp3";
import { soundEnabledSelector } from "../../../../../store/selectors/soundEnabledSelector";
import deleteAnnotationSoundEffect from "../../../../../sounds/pop-up-off.mp3";

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
  const unselectedAnnotations = useSelector(unselectedAnnotationsSelector);

  const selectedAnnotation = useSelector(selectedAnnotationSelector);

  const selectedAnnotations = useSelector(selectedAnnotationsSelector);

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

  const [resizedContour, setResizedContour] = useState<Array<number>>([]);

  const stageScale = useSelector(stageScaleSelector);

  const image = useSelector(imageSelector);

  const cursor = useCursor();

  const soundEnabled = useSelector(soundEnabledSelector);

  const [playCreateAnnotationSoundEffect] = useSound(
    createAnnotationSoundEffect
  );

  const [playDeleteAnnotationSoundEffect] = useSound(
    deleteAnnotationSoundEffect
  );

  if (!image || !image.shape) return <React.Fragment />;

  const imageWidth = image.shape.width;
  const imageHeight = image.shape.height;

  const computeResizedContour = () => {
    if (!boundBox || !startBox) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox) return;

    // get necessary parameters for transformation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;

    if (!selectedAnnotation) return;

    const contour = selectedAnnotation.contour;

    if (!center) return;

    setResizedContour(
      resizeContour(contour, center, {
        x: scaleX,
        y: scaleY,
      })
    );
  };

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
    if (!boundBox) {
      setStartBox(oldBox);
    }

    const relativeNewBox = getRelativeBox(newBox);

    if (!imageWidth || !imageHeight || !relativeNewBox)
      return boundBox ? boundBox : startBox;
    if (
      Math.floor(relativeNewBox.x + relativeNewBox.width) > imageWidth ||
      Math.floor(relativeNewBox.y + relativeNewBox.height) > imageHeight ||
      relativeNewBox.x < 0 ||
      relativeNewBox.y < 0
    ) {
      return boundBox ? boundBox : oldBox;
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

  const resizeMask = (points: Array<number>) => {
    const maskImage = new ImageJS.Image({
      width: imageWidth,
      height: imageHeight,
      bitDepth: 8,
    });

    const coords = _.chunk(points, 2);

    const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
    simplify(connectedPoints, 1, true);
    slpf(connectedPoints, maskImage);

    //@ts-ignore
    return encode(maskImage.getChannel(0).data);
  };

  const onTransformEnd = () => {
    if (!selectedAnnotation) return;

    const resizedMask = resizeMask(resizedContour);

    const updatedAnnotation = {
      ...selectedAnnotation,
      contour: resizedContour,
      boundingBox: computeBoundingBoxFromContours(resizedContour),
      mask: resizedMask,
    };

    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );

    updateSelectedAnnotation(updatedAnnotation);

    setCenter(undefined);
    setBoundBox(null);
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

  const onTransform = () => {
    if (!center) {
      const oppositeAnchorPosition = getOppositeAnchorPosition();
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

  const onSaveAnnotationClick = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const container = event.target.getStage()!.container();
    container.style.cursor = cursor.cursor!;

    dispatch(
      applicationSlice.actions.setImageInstances({
        instances: [...unselectedAnnotations, ...selectedAnnotations],
      })
    );

    transformerRef.current!.detach();
    transformerRef.current!.getLayer()?.batchDraw();
    dispatch(applicationSlice.actions.setAnnotating({ annotating: false }));
    dispatch(
      applicationSlice.actions.setSelectionMode({
        selectionMode: AnnotationModeType.New,
      })
    );
    dispatch(setSelectedAnnotations({ selectedAnnotations: [] }));
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
    if (soundEnabled) playCreateAnnotationSoundEffect();
  };

  const onClearAnnotationClick = (
    event: Konva.KonvaEventObject<MouseEvent>
  ) => {
    const container = event.target.getStage()!.container();
    container.style.cursor = cursor.cursor!;
    dispatch(setSelectedAnnotations({ selectedAnnotations: [] }));
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
    if (soundEnabled) playDeleteAnnotationSoundEffect();
  };

  const onMouseEnter = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const container = event.target.getStage()!.container();
    container.style.cursor = "pointer";
  };

  const onMouseLeave = (event: Konva.KonvaEventObject<MouseEvent>) => {
    const container = event.target.getStage()!.container();
    container.style.cursor = cursor.cursor!;
  };

  let posX = 0;
  let posY = 0;

  if (selectedAnnotation && selectedAnnotations.length === 1) {
    posX =
      Math.max(
        selectedAnnotation.boundingBox[0],
        selectedAnnotation.boundingBox[2]
      ) * stageScale;
    posY =
      Math.max(
        selectedAnnotation.boundingBox[1],
        selectedAnnotation.boundingBox[3]
      ) * stageScale;
  }

  return (
    <ReactKonva.Group>
      <ReactKonva.Transformer
        boundBoxFunc={boundingBoxFunc}
        onTransform={onTransform}
        onTransformEnd={onTransformEnd}
        onTransformStart={onTransformStart}
        id={"tr-".concat(annotationId)}
        ref={transformerRef}
        rotateEnabled={false}
      />
      {selectedAnnotation && selectedAnnotations.length === 1 && (
        <ReactKonva.Group>
          <ReactKonva.Label
            position={{
              x: posX - 58,
              y: posY + 6,
            }}
            onClick={onSaveAnnotationClick}
            id={"label"}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <ReactKonva.Tag
              cornerRadius={3}
              fill={"darkgreen"}
              lineJoin={"round"}
              shadowColor={"black"}
              shadowBlur={10}
              shadowOffset={{ x: 5, y: 5 }}
            />
            <ReactKonva.Text
              fill={"white"}
              fontSize={14}
              padding={6}
              text={"Confirm"}
            />
          </ReactKonva.Label>
          <ReactKonva.Label
            position={{
              x: posX - 43,
              y: posY + 35,
            }}
            onClick={onClearAnnotationClick}
            id={"label"}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <ReactKonva.Tag
              cornerRadius={3}
              fill={"darkred"}
              lineJoin={"round"}
              shadowColor={"black"}
              shadowBlur={10}
              shadowOffset={{ x: 5, y: 5 }}
            />
            <ReactKonva.Text
              fill={"white"}
              fontSize={14}
              padding={6}
              text={"Clear"}
            />
          </ReactKonva.Label>
        </ReactKonva.Group>
      )}
    </ReactKonva.Group>
  );
};
