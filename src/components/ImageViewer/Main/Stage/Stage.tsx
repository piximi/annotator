import React, { useRef } from "react";
import * as ReactKonva from "react-konva";
import Konva from "konva";
import { Provider, useSelector } from "react-redux";
import {
  stageHeightSelector,
  stageWidthSelector,
} from "../../../../store/selectors";
import { store } from "../../../../store";
import { ZoomSelection } from "../../Content/Stage/Selection/ZoomSelection";
import { Layer } from "../Layer";
import { Image } from "../../Content/Stage/Image";
import { useZoom } from "../../../../hooks";

export const Stage = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const stageWidth = useSelector(stageWidthSelector);
  const stageHeight = useSelector(stageHeightSelector);

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
        <Layer>
          <Image ref={imageRef} />
          <ZoomSelection />
        </Layer>
      </Provider>
    </ReactKonva.Stage>
  );
};
