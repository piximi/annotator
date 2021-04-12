import React, { useCallback, useEffect, useRef } from "react";
import * as ReactKonva from "react-konva";
import Konva from "konva";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  boundingClientRectSelector,
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
import { imageWidthSelector } from "../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../store/selectors/imageHeightSelector";

export const Stage = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const stageWidth = useSelector(stageWidthSelector);
  const stageHeight = useSelector(stageHeightSelector);
  const boundingClientRect = useSelector(boundingClientRectSelector);

  const offset = useSelector(offsetSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!boundingClientRect) return;

    dispatch(setStageWidth({ stageWidth: boundingClientRect.width }));
  }, [boundingClientRect]);

  const { onMouseDown, onMouseMove, onMouseUp, onWheel } = useZoom(
    stageRef,
    imageRef
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
        <Layer offset={offset}>
          <Image ref={imageRef} />
          <ZoomSelection />
        </Layer>
      </Provider>
    </ReactKonva.Stage>
  );
};
