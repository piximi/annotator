import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ToolType } from "../../../../../types/ToolType";
import {
  imageInstancesSelector,
  imageSelector,
  invertModeSelector,
  selectedCategroySelector,
  selectionModeSelector,
  toolTypeSelector,
  zoomSettingsSelector,
} from "../../../../../store/selectors";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useStyles } from "../../Content/Content.css";
import { setSelectedAnnotation, slice } from "../../../../../store";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationOperator } from "../../../../../hooks";
import { Selection as SelectionType } from "../../../../../types/Selection";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { SelectedContour } from "../SelectedContour";
import { useZoomOperator } from "../../../../../hooks/useZoomOperator";
import { KonvaEventObject } from "konva/types/Node";
import { Image } from "../Image";
import { Annotations } from "../Annotations";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { Selecting } from "../Selecting";
import { annotatedSelector } from "../../../../../store/selectors/annotatedSelector";
import { Tool } from "../../../../../image/Tool";
import { ObjectAnnotationTool } from "../../../../../image/Tool";
import { ColorAnnotationTool } from "../../../../../image/Tool";
import { ColorAnnotationToolTip } from "../ColorAnnotationToolTip";
import useSound from "use-sound";
import createAnnotationSoundEffect from "../../../../../sounds/pop-up-on.mp3";
import deleteAnnotationSoundEffect from "../../../../../sounds/pop-up-off.mp3";
import { soundEnabledSelector } from "../../../../../store/selectors/soundEnabledSelector";

type StageProps = {
  src: string;
};

export const Stage = ({ src }: StageProps) => {
  const imageRef = useRef<Konva.Image>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectingRef = useRef<Konva.Line | null>(null);

  const selectedAnnotationRef = useRef<SelectionType | null>(null);

  const classes = useStyles();

  const toolType = useSelector(toolTypeSelector);

  const invertMode = useSelector(invertModeSelector);
  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);
  const selectedAnnotationId = useSelector(selectedAnnotationSelector);
  const selectedCategory = useSelector(selectedCategroySelector);
  const selectionMode = useSelector(selectionModeSelector);

  const [stageWidth, setStageWidth] = useState<number>(1000);
  const [stageHeight, setStageHeight] = useState<number>(1000);

  const [stagedImageShape, setStagedImageShape] = useState<{
    width: number;
    height: number;
  }>({ width: 512, height: 512 });

  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const [zoomScale, setZoomScale] = useState<number>(1);

  const [annotationTool] = useAnnotationOperator(
    src,
    stagedImageShape,
    zoomScale
  );

  const [selecting, setSelecting] = useState<boolean>(false);

  const [currentPosition, setCurrentPosition] = useState<{
    x: number;
    y: number;
  } | null>();

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const annotations = useSelector(imageInstancesSelector);

  const zoomSettings = useSelector(zoomSettingsSelector);

  const annotated = useSelector(annotatedSelector);

  const backspacePress = useKeyPress("Backspace");
  const deletePress = useKeyPress("Delete");
  const enterPress = useKeyPress("Enter");
  const escapePress = useKeyPress("Escape");
  const shiftPress = useKeyPress("Shift");

  const [zooming, setZooming] = useState<boolean>(false);

  const [playCreateAnnotationSoundEffect] = useSound(
    createAnnotationSoundEffect
  );
  const [playDeleteAnnotationSoundEffect] = useSound(
    deleteAnnotationSoundEffect
  );

  const soundEnabled = useSelector(soundEnabledSelector);

  const deselectAnnotation = () => {
    if (!annotationTool) return;

    annotationTool.deselect();

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
    dispatch(slice.actions.setAnnotated({ annotated: false }));

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    selectingRef.current = null;
  };

  const { zoomTool, onZoomClick, onZoomWheel } = useZoomOperator(
    toolType,
    src,
    stageWidth,
    zoomSettings
  );

  const onClick = (event: KonvaEventObject<MouseEvent>) => {
    switch (toolType) {
      case ToolType.Zoom:
        if (zooming) return;
        onZoomClick(event);
    }
  };

  const onWheel = (event: KonvaEventObject<WheelEvent>) => {
    switch (toolType) {
      case ToolType.Zoom:
        onZoomWheel(event);
    }
  };

  useEffect(() => {
    if (toolType !== ToolType.Zoom) return;

    if (!zoomTool || !zoomTool.scale) return;

    setZoomScale(zoomTool.scale);
  }, [zoomTool?.scale]);

  useEffect(() => {
    if (!selectedAnnotationId || !annotationTool) return;

    if (!annotations) return;

    const selectedInstance: SelectionType = annotations.filter(
      (instance: SelectionType) => {
        return instance.id === selectedAnnotationId;
      }
    )[0];

    if (
      !selectedInstance ||
      !selectedInstance.mask ||
      !selectedInstance.contour
    )
      return;

    const invertedMask = annotationTool.invert(selectedInstance.mask, true);

    const invertedContour = annotationTool.invertContour(
      selectedInstance.contour
    );

    const invertedBoundingBox = annotationTool.computeBoundingBoxFromContours(
      invertedContour
    );

    const instance = annotations.filter((instance: SelectionType) => {
      return instance.id === selectedAnnotationId;
    })[0];

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    selectedAnnotationRef.current = {
      ...instance,
      boundingBox: invertedBoundingBox,
      contour: invertedContour,
      mask: invertedMask,
    };

    annotationTool.mask = invertedMask;
    annotationTool.boundingBox = invertedBoundingBox;
    annotationTool.contour = invertedContour;

    dispatch(slice.actions.setAnnotated({ annotated: true }));
  }, [invertMode]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === SelectionMode.New) return; // "New" mode

    setSelecting(false);

    if (!annotated || !annotationTool) return;

    let combinedMask, combinedContour;

    const selectedInstance = selectedAnnotationRef.current;

    if (!selectedInstance) return;

    if (selectionMode === SelectionMode.Add) {
      [combinedMask, combinedContour] = annotationTool.add(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Subtract) {
      [combinedMask, combinedContour] = annotationTool.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === SelectionMode.Intersect) {
      [combinedMask, combinedContour] = annotationTool.intersect(
        selectedInstance.mask
      );
    }

    annotationTool.mask = combinedMask;
    annotationTool.contour = combinedContour;

    if (!combinedContour) return;
    annotationTool.boundingBox = annotationTool.computeBoundingBoxFromContours(
      combinedContour
    );
  }, [selectionMode, annotated]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === SelectionMode.New) return;

    if (!selecting) return;

    if (!selectedAnnotationId) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      slice.actions.deleteImageInstance({
        id: selectedAnnotationId,
      })
    );
  }, [selecting]);

  useEffect(() => {
    if (!selectedAnnotationId) return;

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    const others = annotations?.filter(
      (instance: SelectionType) => instance.id !== selectedAnnotationId
    );

    const updated: SelectionType = {
      ...annotations?.filter(
        (instance: SelectionType) => instance.id === selectedAnnotationId
      )[0],
      categoryId: selectedCategory.id,
    } as SelectionType;

    dispatch(
      slice.actions.setImageInstances({
        instances: [...(others as Array<SelectionType>), updated],
      })
    );

    selectedAnnotationRef.current = updated;
  }, [selectedCategory]);

  useEffect(() => {
    if (!annotationTool) return;

    if (annotationTool.annotated)
      dispatch(
        slice.actions.setAnnotated({ annotated: annotationTool.annotated })
      );

    if (selectionMode === SelectionMode.New) return;

    if (annotationTool.annotating) setSelecting(annotationTool.annotating);
  });

  useEffect(() => {
    if (toolType === ToolType.PenAnnotation) {
      // @ts-ignore
      annotationTool.brushSize = penSelectionBrushSize / zoomScale;
    }
  }, [penSelectionBrushSize]);

  useEffect(() => {
    if (!annotationTool) return;
    annotationTool.stagedImageShape = stagedImageShape;
  }, [stagedImageShape, annotationTool]);

  useEffect(() => {
    if (!annotated) return;

    if (!transformerRef || !transformerRef.current) return;

    if (!annotationTool || !annotationTool.contour) return;

    if (!stageRef || !stageRef.current) return;

    const transform = stageRef.current.getAbsoluteTransform().copy();

    const scaledContour: Array<number> = _.flatten(
      _.chunk(annotationTool.contour, 2).map((el: Array<number>) => {
        const transformed = transform.point({ x: el[0], y: el[1] });
        return [transformed.x, transformed.y];
      })
    );

    selectingRef.current = new Konva.Line<Konva.LineConfig>({
      points: scaledContour,
    });

    const node = stageRef.current.findOne("#selected");

    if (!node) return;

    transformerRef.current.nodes([node]);

    const layer = transformerRef.current.getLayer();

    if (!layer) return;

    layer.batchDraw();

    if (!annotationTool) return;

    annotationTool.annotate(selectedCategory);

    if (!annotationTool.annotation) return;

    selectedAnnotationRef.current = annotationTool.annotation;
  }, [annotated]);

  /*
   * Connect Konva.Transformer to selected annotation Konva.Node
   */
  useEffect(() => {
    if (!stageRef || !stageRef.current) return;

    if (!selectedAnnotationId) return;

    const node = stageRef.current.findOne(`#${selectedAnnotationId}`);

    if (!node) return;

    if (!transformerRef || !transformerRef.current) return;

    transformerRef.current.nodes([node]);

    if (!annotations) return;

    selectedAnnotationRef.current = annotations.filter((v: SelectionType) => {
      // @ts-ignore
      return v.id === selectedAnnotationId;
    })[0];
  }, [selectedAnnotationId]);

  const getRelativePointerPosition = (position: { x: number; y: number }) => {
    if (!stageRef || !stageRef.current) return;

    const transform = stageRef.current.getAbsoluteTransform().copy();

    transform.invert();

    return transform.point(position);
  };

  const onTransformerMouseDown = () => {
    console.info("Clicked on transformer!");
  };

  //FIXME not using useMemo() because could not pass event argument to it
  const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (toolType === ToolType.Pointer) return;

    if (event.target.getParent().className === "Transformer") {
      onTransformerMouseDown();
      return;
    }

    if (event.evt.button === 0) {
      // left click only

      if (annotated) deselectAnnotation();

      if (selectionMode === SelectionMode.New)
        selectedAnnotationRef.current = null;

      if (selectionMode === SelectionMode.Add && !shiftPress)
        selectedAnnotationRef.current = null;

      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (toolType === ToolType.Zoom) {
        zoomTool?.onMouseDown(relative);
        setZooming(false);
      } else {
        annotationTool.onMouseDown(relative);
      }

      update();
    }
  };

  const onMouseMove = useMemo(() => {
    const func = () => {
      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      setCurrentPosition(relative);

      if (!relative) return;
      if (toolType === ToolType.Zoom) {
        zoomTool?.onMouseMove(relative);
        setZooming(true);
      } else {
        annotationTool.onMouseMove(relative);
      }

      update();
    };

    const throttled = _.throttle(func, 5);

    return () => throttled();
  }, [annotationTool, toolType, zoomTool]);

  const onMouseUp = useMemo(() => {
    const func = async () => {
      if (!annotationTool || !stageRef || !stageRef.current) return;

      const position = stageRef.current.getPointerPosition();

      if (!position) return;

      const relative = getRelativePointerPosition(position);

      if (!relative) return;

      if (toolType === ToolType.Zoom) {
        zoomTool?.onMouseUp(relative);
      } else {
        if (toolType === ToolType.ObjectAnnotation)
          await (annotationTool as ObjectAnnotationTool).onMouseUp(relative);
        else {
          annotationTool.onMouseUp(relative);
        }
      }

      update();
    };

    const throttled = _.throttle(func, 10);

    return () => throttled();
  }, [annotationTool, toolType, zoomTool]);

  useEffect(() => {
    if (!enterPress) return;

    if (!annotations || !annotationTool || annotationTool.annotating) return;

    if (!selectedAnnotationRef || !selectedAnnotationRef.current) return;

    if (selectedAnnotationId === selectedAnnotationRef.current.id) {
      dispatch(
        slice.actions.replaceImageInstance({
          id: selectedAnnotationRef.current.id,
          instance: selectedAnnotationRef.current,
        })
      );
    } else {
      dispatch(
        slice.actions.setImageInstances({
          instances: [...annotations, selectedAnnotationRef.current],
        })
      );
    }

    if (soundEnabled) playCreateAnnotationSoundEffect();

    deselectAnnotation();

    selectedAnnotationRef.current = null;

    if (selectionMode !== SelectionMode.New)
      dispatch(
        slice.actions.setSelectionMode({ selectionMode: SelectionMode.New })
      );
  }, [enterPress]);

  useEffect(() => {
    if (
      toolType !== ToolType.PolygonalAnnotation &&
      toolType !== ToolType.LassoAnnotation
    )
      return;

    if (!annotationTool) return;

    annotationTool.connect();
  }, [enterPress]);

  useEffect(() => {
    if (selectedAnnotationId) {
      if (backspacePress || escapePress || deletePress) {
        dispatch(
          slice.actions.deleteImageInstance({
            id: selectedAnnotationId,
          })
        );

        if (soundEnabled) playDeleteAnnotationSoundEffect();

        selectedAnnotationRef.current = null;
      }
    }

    deselectAnnotation();
  }, [backspacePress, deletePress, escapePress]);

  useEffect(() => {
    if (!stageRef || !stageRef.current) return;
    const content = document.querySelector(
      ".konvajs-content"
    ) as HTMLDivElement;
    if (!content) return;
    content.style.marginLeft = "auto";
    content.style.marginRight = "auto";
  }, [stageRef.current]);

  const [tool, setTool] = useState<Tool>();

  useEffect(() => {
    if (toolType === ToolType.Zoom) {
      setTool(zoomTool);
    } else {
      setTool(annotationTool);
    }
  }, [annotationTool, toolType, zoomTool]);

  const image = useSelector(imageSelector);

  const [imageWidth, setImageWidth] = useState<number>(512);
  const [imageHeight, setImageHeight] = useState<number>(512);

  useEffect(() => {
    if (!image) return;

    if (!image.shape) return;

    setImageWidth(image.shape.c);
    setImageHeight(image.shape.r);

    setAspectRatio(image.shape.r / image.shape.c);
  }, [image, image?.shape]);

  useEffect(() => {
    const resize = () => {
      if (!parentDivRef || !parentDivRef.current) return;
      const prevWidth = stageWidth;
      const parentDivWidth = parentDivRef.current.getBoundingClientRect().width;
      setZoomScale(parentDivWidth / prevWidth);
      setStagedImageShape({
        width: parentDivWidth,
        height: Math.floor(parentDivWidth * aspectRatio),
      });
      setStageWidth(parentDivWidth);
      setStageHeight(Math.floor(parentDivWidth * aspectRatio));
    };
    window.addEventListener("resize", resize);
  }, []);

  return (
    <div id={"parent-div"} ref={parentDivRef} className={classes.parent}>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <ReactKonva.Stage
            className={classes.stage}
            globalCompositeOperation="destination-over"
            height={stageHeight}
            onContextMenu={(event: Konva.KonvaEventObject<MouseEvent>) => {
              event.evt.preventDefault();
            }}
            onClick={onClick}
            onWheel={onWheel}
            ref={stageRef}
            scale={{
              x: zoomScale,
              y: zoomScale * aspectRatio,
            }}
            width={stageWidth}
            x={zoomTool ? zoomTool.x : 0}
            y={zoomTool ? zoomTool.y : 0}
          >
            <Provider store={store}>
              <ReactKonva.Layer
                onMouseDown={(event) => onMouseDown(event)}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
              >
                <Image
                  ref={imageRef}
                  src={src}
                  stageWidth={stageWidth}
                  stageHeight={stageHeight}
                />

                <Selecting
                  scale={zoomScale}
                  stageScale={{
                    x: stagedImageShape.width / imageWidth,
                    y: stagedImageShape.height / imageHeight,
                  }}
                  tool={tool!}
                />

                {currentPosition &&
                  !annotationTool?.annotating &&
                  toolType === ToolType.PenAnnotation && (
                    <ReactKonva.Circle
                      radius={penSelectionBrushSize / zoomScale}
                      x={currentPosition.x}
                      y={currentPosition.y}
                      stroke="grey"
                      strokewidth={1}
                      dash={[2, 2]}
                    />
                  )}

                {annotated && annotationTool && annotationTool.contour && (
                  <SelectedContour
                    points={annotationTool.contour}
                    scale={zoomScale}
                    stageScale={{
                      x: stagedImageShape.width / imageWidth,
                      y: stagedImageShape.height / imageHeight,
                    }}
                  />
                )}

                {selectionMode !== SelectionMode.New &&
                  annotationTool &&
                  annotationTool.annotating &&
                  !annotationTool.annotated &&
                  selectedAnnotationRef &&
                  selectedAnnotationRef.current && (
                    <SelectedContour
                      points={selectedAnnotationRef.current.contour}
                      scale={zoomScale}
                      stageScale={{
                        x: stagedImageShape.width / imageWidth,
                        y: stagedImageShape.height / imageHeight,
                      }}
                    />
                  )}

                <Annotations
                  annotationTool={annotationTool}
                  stageScale={{
                    x: stagedImageShape.width / imageWidth,
                    y: stagedImageShape.height / imageHeight,
                  }}
                />

                <ReactKonva.Transformer ref={transformerRef} />

                <ColorAnnotationToolTip
                  colorAnnotationTool={annotationTool as ColorAnnotationTool}
                  scale={zoomScale}
                />
              </ReactKonva.Layer>
            </Provider>
          </ReactKonva.Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  );
};
