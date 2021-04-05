import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStyles } from "./Main.css";
import * as ReactKonva from "react-konva";
import useImage from "use-image";
import src from "../../../images/malaria.png";
import Konva from "konva";
import { useBoundingClientRect } from "../../../hooks/useBoundingClientRect";
import { KonvaEventObject } from "konva/types/Node";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  stageScaleSelector,
  toolTypeSelector,
  zoomToolOptionsSelector,
} from "../../../store/selectors";
import { setStageScale, store } from "../../../store/";
import { ZoomModeType } from "../../../types/ZoomModeType";
import { ToolType } from "../../../types/ToolType";

type ImageProps = {
  height: number;
  width: number;
};

const Image = React.forwardRef<Konva.Image, ImageProps>(
  ({ height, width }, ref) => {
    const [image] = useImage(src);

    return (
      <ReactKonva.Image height={height} image={image} ref={ref} width={width} />
    );
  }
);

const CustomSelection = () => {
  const scale = useSelector(stageScaleSelector);

  return (
    <ReactKonva.Line
      dash={[4, 2]}
      stroke="black"
      strokeWidth={1}
      points={[
        135,
        200,
        135 + 100,
        200,
        135 + 100,
        200 + 95,
        135,
        200 + 95,
        135,
        200,
      ]}
      scale={{ x: scale, y: scale }}
    />
  );
};

type LayerProps = {
  position: { x: number; y: number };
  children?: React.ReactNode;
};

const Layer = ({ children, position }: LayerProps) => {
  return (
    <ReactKonva.Layer imageSmoothingEnabled={false} position={position}>
      {children}
    </ReactKonva.Layer>
  );
};

type StageProps = {
  boundingClientRect?: DOMRect;
};

const Stage = ({ boundingClientRect }: StageProps) => {
  const stageRef = useRef<Konva.Stage>(null);

  const imageRef = useRef<Konva.Image>(null);

  const [stageWidth, setStageWidth] = useState(1);

  const stageHeight = 1000;

  const scale = useSelector(stageScaleSelector);

  const toolType = useSelector(toolTypeSelector);

  const imageWidth = 1600 * scale;
  const imageHeight = 1200 * scale;

  const dispatch = useDispatch();

  const { automaticCentering, mode } = useSelector(zoomToolOptionsSelector);

  const zoom = (deltaY: number, scaleBy: number = 1.25) => {
    dispatch(
      setStageScale({
        stageScale: deltaY > 0 ? scale * scaleBy : scale / scaleBy,
      })
    );
  };

  /*
   * Dynamically resize the stage width to the container width
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setStageWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const [pointerPosition, setPointerPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const layerPosition = useCallback(() => {
    if (automaticCentering) {
      return {
        x: (stageWidth - imageWidth) / 2,
        y: (stageHeight - imageHeight) / 2,
      };
    } else {
      return pointerPosition;
    }
  }, [pointerPosition, stageWidth, stageHeight, imageWidth, imageHeight]);

  const onClick = (event: KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Zoom) return;

    if (!stageRef || !stageRef.current) return;

    if (!automaticCentering) {
      const position = stageRef.current.getPointerPosition();
      if (!position) return;
      setPointerPosition(position);
    }

    zoom(mode === ZoomModeType.In ? 100 : -100);
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (toolType !== ToolType.Zoom) return;

    event.evt.preventDefault();

    if (!stageRef || !stageRef.current) return;

    zoom(event.evt.deltaY);
  };

  return (
    <ReactKonva.Stage
      height={stageHeight}
      onClick={onClick}
      onWheel={onWheel}
      ref={stageRef}
      width={stageWidth}
    >
      <Provider store={store}>
        <Layer position={layerPosition()}>
          <Image height={imageHeight} ref={imageRef} width={imageWidth} />

          <CustomSelection />
        </Layer>
      </Provider>
    </ReactKonva.Stage>
  );
};

export const Main = () => {
  const ref = useRef<HTMLDivElement>(null);

  const boundingClientRect = useBoundingClientRect(ref);

  const classes = useStyles();

  return (
    <main className={classes.content} ref={ref}>
      <Stage boundingClientRect={boundingClientRect} />
    </main>
  );
};
