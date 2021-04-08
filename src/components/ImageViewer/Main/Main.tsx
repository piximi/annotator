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
  imageAspectRatioSelector,
  stageScaleSelector,
  stageWidthSelector,
  toolTypeSelector,
  zoomToolOptionsSelector,
} from "../../../store/selectors";
import {
  setOffset,
  setStageScale,
  setStageWidth,
  store,
} from "../../../store/";
import { ZoomModeType } from "../../../types/ZoomModeType";
import { ToolType } from "../../../types/ToolType";
import { ZoomSelection } from "../Content/Stage/Selection/ZoomSelection";
import { offsetSelector } from "../../../store/selectors/offsetSelector";

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
      dash={[4 / scale, 2 / scale]}
      stroke="black"
      strokeWidth={1 / scale}
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
  children?: React.ReactNode;
  offset: { x: number; y: number };
  position: { x: number; y: number };
};

const Layer = ({ children, offset, position }: LayerProps) => {
  return (
    <ReactKonva.Layer
      imageSmoothingEnabled={false}
      offset={offset}
      position={position}
    >
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

  const stageWidth = useSelector(stageWidthSelector);

  const stageHeight = 1000;

  const scale = useSelector(stageScaleSelector);

  const offset = useSelector(offsetSelector);

  const toolType = useSelector(toolTypeSelector);

  const imageAspectRatio = useSelector(imageAspectRatioSelector);

  const imageWidth = 1600 * scale;
  const imageHeight = 1200 * scale;

  const dispatch = useDispatch();

  const { automaticCentering, mode } = useSelector(zoomToolOptionsSelector);

  const [minimum, setMinimum] = useState<{ x: number; y: number }>();
  const [maximum, setMaximum] = useState<{ x: number; y: number }>();
  const [selecting, setSelecting] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  const scaleBy = 1.25;

  const zoom = (deltaY: number, scaleBy: number) => {
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

    dispatch(setStageWidth({ stageWidth: boundingClientRect.width }));
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
      return {
        x: stageWidth - stageWidth / 2,
        y: stageHeight - stageHeight / 2,
      };
    }
  }, [
    automaticCentering,
    pointerPosition,
    stageWidth,
    stageHeight,
    imageWidth,
    imageHeight,
  ]);

  // this function will return pointer position relative to the passed node
  const getRelativePointerPosition = (node: Konva.Node) => {
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    const stage = node.getStage();

    if (!stage) return;

    // get pointer (say mouse or touch) position
    const pos = stage.getPointerPosition();

    if (!pos) return;

    // now we can find relative point
    return transform.point(pos);
  };

  const onMouseDown = () => {
    if (mode === ZoomModeType.Out) return;

    if (!imageRef || !imageRef.current) return;

    const relative = getRelativePointerPosition(imageRef.current);

    setMinimum(relative);

    setSelecting(true);
    setSelected(false);
  };

  const onMouseMove = () => {
    if (!selecting) return;

    if (!imageRef || !imageRef.current) return;

    const relative = getRelativePointerPosition(imageRef.current);

    if (!minimum) return;

    setMaximum(relative);
  };

  const onMouseUp = () => {
    if (!selecting) return;

    if (!imageRef || !imageRef.current) return;

    const relative = getRelativePointerPosition(imageRef.current);

    if (!relative || !minimum) return;

    setMaximum(relative);

    setSelecting(false);
    setSelected(true);

    if (!maximum) return;

    const newScale = imageWidth / (maximum.x - minimum.x);
    const delta = newScale / scale;

    dispatch(
      setStageScale({ stageScale: imageWidth / (maximum.x - minimum.x) })
    );

    if (!automaticCentering) {
      const centerX = minimum.x + (maximum.x - minimum.x) / 2;
      const centerY = minimum.y + (maximum.y - minimum.y) / 2;

      dispatch(
        setOffset({ offset: { x: centerX * delta, y: centerY * delta } })
      );
    }
  };

  const onClick = (event: KonvaEventObject<MouseEvent>) => {
    if (toolType !== ToolType.Zoom) return;

    if (!imageRef || !imageRef.current) return;

    if (!imageAspectRatio) return;

    if (!automaticCentering) {
      const position = getRelativePointerPosition(imageRef.current);

      if (!position) return;

      const pos =
        mode === ZoomModeType.In
          ? { x: position.x * scaleBy, y: position.y * scaleBy }
          : { x: position.x / scaleBy, y: position.y / scaleBy };
      dispatch(setOffset({ offset: pos }));
    }

    zoom(mode === ZoomModeType.In ? 100 : -100, scaleBy);
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    if (toolType !== ToolType.Zoom) return;

    event.evt.preventDefault();

    if (!stageRef || !stageRef.current) return;

    zoom(event.evt.deltaY, scaleBy);
  };

  return (
    <ReactKonva.Stage
      height={stageHeight}
      onClick={onClick} //FIXME: disable onClick while other mouse events are activated. Need to fix logix so that both can work together.
      // onMouseDown={onMouseDown}
      // onMouseMove={onMouseMove}
      // onMouseUp={onMouseUp}
      onWheel={onWheel}
      ref={stageRef}
      width={stageWidth}
    >
      <Provider store={store}>
        <Layer offset={offset} position={layerPosition()}>
          <Image height={imageHeight} ref={imageRef} width={imageWidth} />

          <CustomSelection />

          <ZoomSelection
            minimum={minimum}
            maximum={maximum}
            selecting={selecting}
          />
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
