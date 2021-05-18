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
import { decode, encode } from "../../../../../image/rle";
import * as ImageJS from "image-js";
import { selectedAnnotationsSelector } from "../../../../../store/selectors/selectedAnnotationsSelector";
import { useCursor } from "../../../../../hooks";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { unselectedAnnotationsSelector } from "../../../../../store/selectors/unselectedAnnotationsSelector";
import useSound from "use-sound";
import createAnnotationSoundEffect from "../../../../../sounds/pop-up-on.mp3";
import { soundEnabledSelector } from "../../../../../store/selectors/soundEnabledSelector";
import deleteAnnotationSoundEffect from "../../../../../sounds/pop-up-off.mp3";
import { imageWidthSelector } from "../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../store/selectors/imageHeightSelector";

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

  const cursor = useCursor();

  const soundEnabled = useSelector(soundEnabledSelector);

  const imageWidth = useSelector(imageWidthSelector);
  const imageHeight = useSelector(imageHeightSelector);

  const [playCreateAnnotationSoundEffect] = useSound(
    createAnnotationSoundEffect
  );

  const [playDeleteAnnotationSoundEffect] = useSound(
    deleteAnnotationSoundEffect
  );

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

  const getScaledCoordinate = (
    contour: Array<number>,
    center: { x: number; y: number },
    scale: { x: number; y: number }
  ) => {
    return _.flatten(
      _.map(_.chunk(contour, 2), (el: Array<number>) => {
        return [
          Math.round(center.x + scale.x * (el[0] - center.x)),
          Math.round(center.y + scale.y * (el[1] - center.y)),
        ];
      })
    );
  };

  const onTransformEnd = () => {
    if (!selectedAnnotation) return;

    if (!boundBox || !startBox) return;

    if (!imageWidth || !imageHeight) return;

    const relativeBoundBox = getRelativeBox(boundBox);
    const relativeStartBox = getRelativeBox(startBox);

    if (!relativeBoundBox || !relativeStartBox || !center) return;

    // get necessary parameters for transformation
    const scaleX = relativeBoundBox.width / relativeStartBox.width;
    const scaleY = relativeBoundBox.height / relativeStartBox.height;

    //extract roi and resize
    const mask = selectedAnnotation.mask;
    const boundingBox = selectedAnnotation.boundingBox;
    const decodedData = new Uint8Array(decode(mask));
    const maskImage = new ImageJS.Image(imageWidth, imageHeight, decodedData, {
      components: 1,
      alpha: 0,
    });

    const roiWidth = boundingBox[2] - boundingBox[0];
    const roiHeight = boundingBox[3] - boundingBox[1];
    const roiX = boundingBox[0];
    const roiY = boundingBox[1];
    const roi = maskImage.crop({
      x: roiX,
      y: roiY,
      width: roiWidth,
      height: roiHeight,
    });

    const resizedMaskROI = roi.resize({
      height: Math.round(roiHeight * scaleY),
      width: Math.round(roiWidth * scaleX),
      preserveAspectRatio: false,
    });

    const scaledOffset = getScaledCoordinate([roiX, roiY], center, {
      x: scaleX,
      y: scaleY,
    });

    const resizedMaskData: Array<number> = [];

    for (let k = 0; k < decodedData.length; k++) {
      const x = k % imageWidth;
      const y = Math.floor(k / imageWidth);
      const pixel = resizedMaskROI.getPixelXY(
        x - scaledOffset[0],
        y - scaledOffset[1]
      )[0];
      if (
        x > scaledOffset[0] &&
        x < scaledOffset[0] + resizedMaskROI.width &&
        y > scaledOffset[1] &&
        y < scaledOffset[1] + resizedMaskROI.height &&
        pixel
      ) {
        resizedMaskData.push(255);
      } else {
        resizedMaskData.push(0);
      }
    }

    const resizedMask = encode(Uint8Array.from(resizedMaskData));

    const updatedAnnotation = {
      ...selectedAnnotation,
      contour: resizedContour,
      boundingBox: [
        scaledOffset[0],
        scaledOffset[1],
        scaledOffset[0] + resizedMaskROI.width,
        scaledOffset[1] + resizedMaskROI.height,
      ] as [number, number, number, number],
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
      //at the beginning of transform, find out the "center" coordinate used for the resizing (i.e., the coordinate that does not move during resize)
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
    }
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
              x: posX - 52,
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
              text={"Cancel"}
            />
          </ReactKonva.Label>
        </ReactKonva.Group>
      )}
    </ReactKonva.Group>
  );
};
