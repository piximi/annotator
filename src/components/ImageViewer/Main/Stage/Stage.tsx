import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ReactKonva from "react-konva";
import Konva from "konva";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  imageSelector,
  stageHeightSelector,
  stageScaleSelector,
  stageWidthSelector,
  zoomToolOptionsSelector,
} from "../../../../store/selectors";
import { setStageWidth, store } from "../../../../store";
import { ZoomSelection } from "../../Content/Stage/Selection/ZoomSelection";
import { offsetSelector } from "../../../../store/selectors/offsetSelector";
import { Layer } from "../Layer";
import { Image } from "../../Content/Stage/Image";
import { useZoom } from "../../../../hooks";

type StageProps = {
  boundingClientRect?: DOMRect;
};

export const Stage = ({ boundingClientRect }: StageProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const stageWidth = useSelector(stageWidthSelector);
  const stageHeight = useSelector(stageHeightSelector);

  const scale = useSelector(stageScaleSelector);
  const offset = useSelector(offsetSelector);
  const image = useSelector(imageSelector);

  const imageWidth = (image && image.shape ? image.shape.width : 512) * scale;
  const imageHeight = (image && image.shape ? image.shape.height : 512) * scale;

  const dispatch = useDispatch();

  const { automaticCentering } = useSelector(zoomToolOptionsSelector);

  useEffect(() => {
    if (!boundingClientRect) return;

    dispatch(setStageWidth({ stageWidth: boundingClientRect.width }));
  }, [boundingClientRect]);

  const layerPosition = useCallback(() => {
    if (automaticCentering) {
      return {
        x: (stageWidth - imageWidth) / 2,
        y: (stageHeight - imageHeight) / 2,
      };
    } else {
      return {
        x: stageWidth - stageWidth / 2,
        y: stageHeight - stageHeight / 2,
      };
    }
  }, [automaticCentering, stageWidth, stageHeight, imageWidth, imageHeight]);

  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = useZoom(
    stageRef,
    imageRef,
    imageWidth
  );

  return (
    <ReactKonva.Stage
      height={stageHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
      ref={stageRef}
      width={stageWidth}
    >
      <Provider store={store}>
        <Layer offset={offset} position={layerPosition()}>
          <Image height={imageHeight} ref={imageRef} width={imageWidth} />
          <ZoomSelection />
        </Layer>
      </Provider>
    </ReactKonva.Stage>
  );
};
