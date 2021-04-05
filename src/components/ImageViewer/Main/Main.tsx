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
  zoomToolOptionsSelector,
} from "../../../store/selectors";
import { setStageScale, store } from "../../../store/";
import { ZoomModeType } from "../../../types/ZoomModeType";

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

  const imageWidth = 1600 * scale;
  const imageHeight = 1200 * scale;

  const dispatch = useDispatch();

  // TODO: What do other applications use?

  // const [imageWidth, setImageWidth] = useState<number>(160);
  // const [imageHeight, setImageHeight] = useState<number>(120);

  const { automaticCentering, mode } = useSelector(zoomToolOptionsSelector);

  const zoom = (deltaY: number, scaleBy: number = 1.25) => {
    dispatch(
      setStageScale({
        stageScale: deltaY > 0 ? scale * scaleBy : scale / scaleBy,
      })
    );
  };

  /*
   * Fetch the image's dimensions from the image ref
   */
  useEffect(() => {
    if (!imageRef || !imageRef.current) return;

    // setImageWidth(imageWidth * scale);
    // setImageHeight(imageHeight * scale);
  }, [imageRef, scale]);

  /*
   * Dynamically resize the stage width to the container width
   */
  useEffect(() => {
    if (!boundingClientRect) return;

    setStageWidth(boundingClientRect.width);
  }, [boundingClientRect]);

  const layerPosition = useCallback(() => {
    return {
      x: (stageWidth - imageWidth) / 2,
      y: (stageHeight - imageHeight) / 2,
    };
  }, [stageWidth, stageHeight, imageWidth, imageHeight]);

  const onClick = (event: KonvaEventObject<MouseEvent>) => {
    if (!stageRef || !stageRef.current) return;

    if (automaticCentering) {
      zoom(mode === ZoomModeType.In ? 100 : -100);
    }
    // else {
    //     const position = stageRef.current.getPointerPosition();
    // }
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (!stageRef || !stageRef.current) return;

    zoom(event.evt.deltaY);
  };

  // useEffect(() => {
  //   if (!imageRef || !imageRef.current) return;
  //
  //   console.info(imageRef.current.scale());
  // })

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
