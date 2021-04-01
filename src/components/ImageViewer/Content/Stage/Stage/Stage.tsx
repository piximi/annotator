import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import Konva from "konva";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ToolType } from "../../../../../types/ToolType";
import {
  boundingClientRectWidthSelector,
  imageInstancesSelector,
  imageSelector,
  invertModeSelector,
  selectedCategroySelector,
  selectionModeSelector,
  stageHeightSelector,
  stageScaleSelector,
  stageWidthSelector,
  toolTypeSelector,
} from "../../../../../store/selectors";
import {
  applicationSlice,
  setBoundingClientRectWidth,
  setSelectedAnnotation,
  setStageHeight,
  setStageScale,
  setStageWidth,
} from "../../../../../store";
import {
  Provider,
  ReactReduxContext,
  useDispatch,
  useSelector,
} from "react-redux";
import { useStyles } from "../../Content/Content.css";
import { useKeyPress } from "../../../../../hooks/useKeyPress";
import { useAnnotationOperator } from "../../../../../hooks";
import { AnnotationType as SelectionType } from "../../../../../types/AnnotationType";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { SelectedContour } from "../SelectedContour";
import { useZoomTool } from "../../../../../hooks/useZoomTool";
import { KonvaEventObject } from "konva/types/Node";
import { Image } from "../Image";
import { Annotations } from "../Annotations";
import { selectedAnnotationSelector } from "../../../../../store/selectors/selectedAnnotationSelector";
import { Selecting } from "../Selecting";
import { annotatedSelector } from "../../../../../store/selectors/annotatedSelector";
import {
  ColorAnnotationTool,
  ObjectAnnotationTool,
  Tool,
} from "../../../../../image/Tool";
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

  const virtualWidth = 750;

  const stageHeight = useSelector(stageHeightSelector);
  const stageWidth = useSelector(stageWidthSelector);

  const [stagedImagePosition, setStagedImagePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [aspectRatio, setAspectRatio] = useState<number>(1);

  const stageScale = useSelector(stageScaleSelector);
  const boundingClientRectWidth = useSelector(boundingClientRectWidthSelector);

  const [annotationTool] = useAnnotationOperator(
    src,
    stagedImagePosition,
    {
      width: stageWidth,
      height: stageHeight,
    },
    stageScale
  );

  const [selecting, setSelecting] = useState<boolean>(false);

  const [currentPosition, setCurrentPosition] = useState<{
    x: number;
    y: number;
  } | null>();

  const [, update] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();

  const annotations = useSelector(imageInstancesSelector);

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
    dispatch(applicationSlice.actions.setAnnotated({ annotated: false }));

    transformerRef.current?.detach();
    transformerRef.current?.getLayer()?.batchDraw();

    selectingRef.current = null;
  };

  const { zoomTool, onZoomClick, onZoomWheel } = useZoomTool(
    aspectRatio,
    toolType,
    src,
    stageWidth
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

    dispatch(setStageScale({ stageScale: zoomTool.scale }));
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

    dispatch(applicationSlice.actions.setAnnotated({ annotated: true }));
  }, [invertMode]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    setSelecting(false);

    if (!annotated || !annotationTool) return;

    if (!annotationTool.annotated) return;

    let combinedMask, combinedContour;

    const selectedInstance = selectedAnnotationRef.current;

    if (!selectedInstance) return;

    if (selectionMode === AnnotationModeType.Add) {
      [combinedMask, combinedContour] = annotationTool.add(
        selectedInstance.mask
      );
    } else if (selectionMode === AnnotationModeType.Subtract) {
      [combinedMask, combinedContour] = annotationTool.subtract(
        selectedInstance.mask
      );
    } else if (selectionMode === AnnotationModeType.Intersect) {
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

    if (
      !annotationTool.boundingBox ||
      !annotationTool.contour ||
      !annotationTool.mask
    )
      return;

    selectedAnnotationRef.current = {
      ...selectedInstance,
      boundingBox: annotationTool.boundingBox,
      contour: annotationTool.contour,
      mask: annotationTool.mask,
    };
  }, [selectionMode, annotated]);

  useEffect(() => {
    if (toolType === ToolType.Zoom) return;

    if (selectionMode === AnnotationModeType.New) return;

    if (!selecting) return;

    if (!selectedAnnotationId) return;

    transformerRef.current?.detach();

    //remove the existing Operator since it's essentially been replaced
    dispatch(
      applicationSlice.actions.deleteImageInstance({
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
      applicationSlice.actions.setImageInstances({
        instances: [...(others as Array<SelectionType>), updated],
      })
    );

    selectedAnnotationRef.current = updated;
  }, [selectedCategory]);

  useEffect(() => {
    if (!annotationTool) return;

    if (annotationTool.annotated) {
      dispatch(
        applicationSlice.actions.setAnnotated({
          annotated: annotationTool.annotated,
        })
      );

      if (selectionMode !== AnnotationModeType.New) return;
      annotationTool.annotate(selectedCategory);
      if (!annotationTool.annotation) return;
      selectedAnnotationRef.current = annotationTool.annotation;
    }

    if (selectionMode === AnnotationModeType.New) return;

    if (annotationTool.annotating) setSelecting(annotationTool.annotating);
  });

  useEffect(() => {
    if (toolType === ToolType.PenAnnotation) {
      // @ts-ignore
      annotationTool.brushSize = penSelectionBrushSize / stageScale;
    }
  }, [penSelectionBrushSize]);

  useEffect(() => {
    if (!annotationTool) return;
    annotationTool.stagedImageShape = {
      width: stageWidth,
      height: stageHeight,
    };
    annotationTool.stagedImagePosition = stagedImagePosition;
  }, [stageWidth, stageHeight, annotationTool]);

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

      if (selectionMode === AnnotationModeType.New)
        selectedAnnotationRef.current = null;

      // if (selectionMode === AnnotationModeType.Add && !shiftPress) //FIXME: implement this logic later, when docs are in app
      //   selectedAnnotationRef.current = null;

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
        applicationSlice.actions.replaceImageInstance({
          id: selectedAnnotationRef.current.id,
          instance: selectedAnnotationRef.current,
        })
      );
    } else {
      dispatch(
        applicationSlice.actions.setImageInstances({
          instances: [...annotations, selectedAnnotationRef.current],
        })
      );
    }

    if (soundEnabled) playCreateAnnotationSoundEffect();

    deselectAnnotation();

    selectedAnnotationRef.current = null;

    if (selectionMode !== AnnotationModeType.New)
      dispatch(
        applicationSlice.actions.setSelectionMode({
          selectionMode: AnnotationModeType.New,
        })
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
          applicationSlice.actions.deleteImageInstance({
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

    setImageWidth(image.shape.width);
    setImageHeight(image.shape.height);

    setAspectRatio(image.shape.height / image.shape.width);

    resize();
  }, [image?.shape]);

  const resize = () => {
    if (!parentDivRef || !parentDivRef.current) return;

    const width = parentDivRef.current.getBoundingClientRect().width;

    dispatch(
      setBoundingClientRectWidth({
        boundingClientRectWidth: parentDivRef.current.getBoundingClientRect()
          .width,
      })
    );

    dispatch(setStageScale({ stageScale: width / virtualWidth }));

    dispatch(setStageHeight({ stageHeight: width }));
    dispatch(setStageWidth({ stageWidth: width }));

    setStagedImagePosition({
      x: 0,
      y: 0,
    });
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
  }, []);

  return (
    <div id={"parent-div"} ref={parentDivRef} className={classes.parent}>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <ReactKonva.Stage
            globalCompositeOperation="destination-over"
            height={stageHeight}
            onContextMenu={(event: Konva.KonvaEventObject<MouseEvent>) => {
              event.evt.preventDefault();
            }}
            onClick={onClick}
            onWheel={onWheel}
            ref={stageRef}
            scale={{
              x: stageScale,
              y: stageScale * aspectRatio,
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
                <Image ref={imageRef} src={src} />

                <Selecting
                  imagePosition={stagedImagePosition}
                  scale={stageScale}
                  stageScale={{
                    x: stageWidth / imageWidth,
                    y: stageHeight / imageHeight,
                  }}
                  tool={tool!}
                />

                {currentPosition &&
                  !annotationTool?.annotating &&
                  toolType === ToolType.PenAnnotation && (
                    <ReactKonva.Ellipse
                      radiusX={
                        (aspectRatio * penSelectionBrushSize) / stageScale
                      }
                      radiusY={penSelectionBrushSize / stageScale}
                      x={currentPosition.x}
                      y={currentPosition.y}
                      stroke="grey"
                      strokewidth={1}
                      dash={[2, 2]}
                    />
                  )}

                {/*{annotated && annotationTool && annotationTool.contour && (*/}
                {/*  <SelectedContour*/}
                {/*    imagePosition={stagedImagePosition}*/}
                {/*    points={annotationTool.contour}*/}
                {/*    scale={stageScale}*/}
                {/*    stageScale={{*/}
                {/*      x: stageWidth / imageWidth,*/}
                {/*      y: stageHeight / imageHeight,*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}

                {selectedAnnotationRef && selectedAnnotationRef.current && (
                  <SelectedContour
                    imagePosition={stagedImagePosition}
                    points={selectedAnnotationRef.current.contour}
                    scale={stageScale}
                    stageScale={{
                      x: stageWidth / imageWidth,
                      y: stageHeight / imageHeight,
                    }}
                  />
                )}

                <Annotations
                  annotationTool={annotationTool}
                  imagePosition={stagedImagePosition}
                  stageScale={{
                    x: stageWidth / imageWidth,
                    y: stageHeight / imageHeight,
                  }}
                />

                <ReactKonva.Transformer ref={transformerRef} />

                <ColorAnnotationToolTip
                  colorAnnotationTool={annotationTool as ColorAnnotationTool}
                  scale={stageScale}
                />
              </ReactKonva.Layer>
            </Provider>
          </ReactKonva.Stage>
        )}
      </ReactReduxContext.Consumer>
    </div>
  );
};
