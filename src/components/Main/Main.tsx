import * as ReactKonva from "react-konva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useImage from "use-image";
import { BoundingBox } from "../../types/BoundingBox";
import { Category } from "../../types/Category";
import { Ellipse } from "konva/types/shapes/Ellipse";
import { ImageViewerOperation } from "../../types/ImageViewerOperation";
import { Rect } from "konva/types/shapes/Rect";
import { Stage } from "konva/types/Stage";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce, useMarchingAnts, useSelection } from "../../hooks";
import { useStyles } from "./Main.css";
import { Circle } from "konva/types/shapes/Circle";
import * as _ from "underscore";
import { RectangularSelection } from "./RectangularSelection";
import { PolygonalSelection } from "./PolygonalSelection";
import { ZoomSelection } from "./ZoomSelection";
import {
  categoriesSelector,
  imageViewerImageInstancesSelector,
  imageViewerImageSelector,
  imageViewerOperationSelector,
  imageViewerZoomModeSelector,
} from "../../store/selectors";
import { Image } from "konva/types/shapes/Image";
import * as ImageJS from "image-js";
import { setImageViewerImageInstances } from "../../store/slices";
import { ObjectSelection } from "./ObjectSelection";
import { EllipticalSelection } from "./EllipticalSelection";
import * as tensorflow from "@tensorflow/tfjs";
import { Tensor3D, Tensor4D } from "@tensorflow/tfjs";
import {
  createPathFinder,
  makeGraph,
  PiximiGraph,
} from "../../image/GraphHelper";
import {
  ColorSelectionOperator,
  EllipticalSelectionOperator,
  LassoSelectionOperator,
  MagneticSelectionOperator,
  ObjectSelectionOperator,
  PolygonalSelectionOperator,
  QuickSelectionOperator,
  RectangularSelectionOperator,
  SelectionOperator,
} from "../../image/selection";
import Konva from "konva";

type MainProps = {
  activeCategory: Category;
  zoomReset: boolean;
};

export const Main = ({ activeCategory, zoomReset }: MainProps) => {
  const dispatch = useDispatch();

  const image = useSelector(imageViewerImageSelector);
  const instances = useSelector(imageViewerImageInstancesSelector);

  const [img] = useImage(image!.src, "Anonymous");
  const dashOffset = useMarchingAnts();
  const classes = useStyles();
  const stageRef = useRef<Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const pointRadius: number = 3;

  const operation = useSelector(imageViewerOperationSelector);

  const [operator, setOperator] = useState<SelectionOperator>(
    new RectangularSelectionOperator()
  );

  useEffect(() => {
    switch (operation) {
      case ImageViewerOperation.EllipticalSelection:
        setOperator(new EllipticalSelectionOperator());

        return;
      case ImageViewerOperation.LassoSelection:
        setOperator(new LassoSelectionOperator());

        return;
      case ImageViewerOperation.PolygonalSelection:
        setOperator(new PolygonalSelectionOperator());

        return;
      case ImageViewerOperation.RectangularSelection:
        setOperator(new RectangularSelectionOperator());

        return;
    }
  }, [operation]);

  const [transform, setTransform] = useState<Konva.Transform>();

  useEffect(() => {
    if (imageRef && imageRef.current) {
      setTransform(imageRef.current.getAbsoluteTransform().invert().copy());
    }
  }, [imageRef, imageRef.current]);

  /*
   * Color selection
   */

  const [colorSelectionOperator] = useState(
    new ColorSelectionOperator(activeCategory.color, img)
  );

  const colorSelectionOverlayRef = React.useRef<Image>(null);

  const ColorSelection = () => {
    return (
      <React.Fragment>
        <ReactKonva.Image
          image={colorSelectionOperator.overlayImage}
          ref={colorSelectionOverlayRef}
        />
        {annotating && colorSelectionOperator.initialPosition && (
          <ReactKonva.Label
            x={colorSelectionOperator.initialPosition.x}
            y={colorSelectionOperator.initialPosition.y}
          >
            <ReactKonva.Tag
              fill={"#f0ce0f"}
              stroke={"#907c09"}
              shadowColor={"black"}
              pointerDirection={"up"}
              pointerWidth={10}
              pointerHeight={10}
              cornerRadius={5}
            />
            <ReactKonva.Text
              text={colorSelectionOperator.tolerance.toString()}
              padding={5}
            />
          </ReactKonva.Label>
        )}
      </React.Fragment>
    );
  };

  /*
   * Elliptical selection
   */
  const ellipticalSelectionRef = React.useRef<Ellipse>(null);

  const isInside = (
    startingAnchorCircleRef: React.RefObject<Circle>,
    position: { x: number; y: number }
  ) => {
    if (
      startingAnchorCircleRef &&
      startingAnchorCircleRef.current &&
      imageRef &&
      imageRef.current
    ) {
      let rectangle = startingAnchorCircleRef.current.getClientRect();

      const transform = imageRef.current.getAbsoluteTransform().copy();
      transform.invert();
      const transformedRectangle = transform.point({
        x: rectangle.x,
        y: rectangle.y,
      });

      return (
        transformedRectangle.x <= position.x &&
        position.x <= transformedRectangle.x + rectangle.width &&
        transformedRectangle.y <= position.y &&
        position.y <= transformedRectangle.y + rectangle.height
      );
    } else {
      return false;
    }
  };

  const connected = (
    position: { x: number; y: number },
    startingAnchorCircleRef: React.RefObject<Circle>,
    strokes: Array<{ points: Array<number> }>,
    canClose: boolean
  ) => {
    if (startingAnchorCircleRef) {
      const inside = isInside(startingAnchorCircleRef, position);
      if (strokes && strokes.length > 0) {
        return inside && canClose;
      }
    }
  };

  /*
   * Magnetic selection
   */

  // const transformerRef = React.useRef<Transformer>(null);

  const [magneticSelectionAnchor, setMagneticSelectionAnchor] = useState<{
    x: number;
    y: number;
  }>();
  const [
    magneticSelectionAnnotation,
    setMagneticSelectionAnnotation,
  ] = useState<{ points: Array<number> }>();
  const [
    magneticSelectionCanClose,
    setMagneticSelectionCanClose,
  ] = useState<boolean>(false);
  const [
    magneticSelectionDownsizedWidth,
    setMagneticSelectionDownsizedWidth,
  ] = useState<number>(0);
  const [
    magneticSelectionFactor,
    setMagneticSelectionFactor,
  ] = useState<number>(0.5);
  const [
    magneticSelectionGraph,
    setMagneticSelectionGraph,
  ] = useState<PiximiGraph | null>(null);
  const [
    magneticSelectionPreviousStroke,
    setMagneticSelectionPreviousStroke,
  ] = useState<Array<{ points: Array<number> }>>([]);
  const [magneticSelectionStart, setMagneticSelectionStart] = useState<{
    x: number;
    y: number;
  }>();
  const [magneticSelectionStrokes, setMagneticSelectionStrokes] = useState<
    Array<{ points: Array<number> }>
  >([]);
  const magneticSelectionPosition = React.useRef<{
    x: number;
    y: number;
  } | null>(null);
  const magneticSelectionDebouncedPosition = useDebounce(
    magneticSelectionPosition.current,
    20
  );
  const magneticSelectionPathCoordsRef = React.useRef<any>();
  const magneticSelectionPathFinder = React.useRef<any>();
  // const magneticSelectionRef = React.useRef<Line>(null);
  const magneticSelectionStartPosition = React.useRef<{
    x: number;
    y: number;
  } | null>(null);
  const magneticSelectionStartingAnchorCircleRef = React.useRef<Circle>(null);
  useEffect(() => {
    if (magneticSelectionGraph && img) {
      magneticSelectionPathFinder.current = createPathFinder(
        magneticSelectionGraph,
        magneticSelectionDownsizedWidth,
        magneticSelectionFactor
      );
    }
  }, [magneticSelectionDownsizedWidth, magneticSelectionGraph, img]);

  // useEffect(() => {
  //   if (imageRef && imageRef.current) {
  //     imageRef.current.cache();
  //
  //     imageRef.current.getLayer()?.batchDraw();
  //   }
  // });

  useEffect(() => {
    console.log("Loading image");
    const loadImg = async () => {
      const img = await ImageJS.Image.load(image!.src);
      const grey = img.grey();
      const edges = grey.sobelFilter();
      setMagneticSelectionDownsizedWidth(img.width * magneticSelectionFactor);
      const downsized = edges.resize({ factor: magneticSelectionFactor });
      setMagneticSelectionGraph(
        makeGraph(downsized.data, downsized.height, downsized.width)
      );
    };
    loadImg();
  }, [image, image?.src, magneticSelectionFactor]);

  // React.useEffect(() => {
  //   if (
  //       annotated &&
  //       magneticSelectionRef &&
  //       magneticSelectionRef.current &&
  //       transformerRef &&
  //       transformerRef.current
  //   ) {
  //     transformerRef.current.nodes([magneticSelectionRef.current]);
  //
  //     transformerRef.current.getLayer()?.batchDraw();
  //   }
  // }, [annotated]);

  const MagneticSelection = () => {
    return (
      <React.Fragment>
        {magneticSelectionStart && (
          <ReactKonva.Circle
            fill="#000"
            globalCompositeOperation="source-over"
            hitStrokeWidth={64}
            id="start"
            name="anchor"
            radius={3}
            ref={magneticSelectionStartingAnchorCircleRef}
            stroke="#FFF"
            strokeWidth={1}
            x={magneticSelectionStart.x}
            y={magneticSelectionStart.y}
          />
        )}

        {!annotated &&
          annotating &&
          magneticSelectionStrokes.map(
            (stroke: { points: Array<number> }, key: number) => (
              <React.Fragment>
                <ReactKonva.Line
                  // key={key}
                  points={stroke.points}
                  stroke="#FFF"
                  strokeWidth={1}
                />

                <ReactKonva.Line
                  dash={[4, 2]}
                  // key={key}
                  points={stroke.points}
                  stroke="#FFF"
                  strokeWidth={1}
                />
              </React.Fragment>
            )
          )}

        {!annotated &&
          annotating &&
          magneticSelectionPreviousStroke.map(
            (stroke: { points: Array<number> }, key: number) => (
              <React.Fragment>
                <ReactKonva.Line
                  // key={key}
                  points={stroke.points}
                  stroke="#FFF"
                  strokeWidth={1}
                />

                <ReactKonva.Line
                  dash={[4, 2]}
                  // key={key}
                  points={stroke.points}
                  stroke="#FFF"
                  strokeWidth={1}
                />
              </React.Fragment>
            )
          )}
      </React.Fragment>
    );
  };

  useEffect(
    () => {
      if (magneticSelectionDebouncedPosition && annotating) {
        onMagneticSelectionMouseMove(magneticSelectionDebouncedPosition);
      }
    },
    [magneticSelectionDebouncedPosition] // Only call effect if debounced search term changes
  );

  const magnetConnected = (position: { x: number; y: number }) => {
    const inside = isInside(magneticSelectionStartingAnchorCircleRef, position);
    if (magneticSelectionStrokes && magneticSelectionStrokes.length > 0) {
      return inside && magneticSelectionCanClose;
    }
  };

  const onMagneticSelection = () => {};

  const onMagneticSelectionMouseDown = (position: { x: number; y: number }) => {
    if (annotated) {
      return;
    }

    if (stageRef && stageRef.current) {
      magneticSelectionPosition.current = position;

      if (magneticSelectionPosition && magneticSelectionPosition.current) {
        if (magnetConnected(magneticSelectionPosition.current)) {
          const stroke = {
            points: _.flatten(
              magneticSelectionStrokes.map((stroke) => stroke.points)
            ),
          };

          setAnnotated(true);

          setAnnotating(false);

          setMagneticSelectionAnnotation(stroke);
        } else {
          setAnnotating(true);

          magneticSelectionStartPosition.current =
            magneticSelectionPosition.current;

          if (magneticSelectionStrokes.length > 0) {
            setMagneticSelectionAnchor(magneticSelectionPosition.current);

            setMagneticSelectionPreviousStroke([
              ...magneticSelectionPreviousStroke,
              ...magneticSelectionStrokes,
            ]);
          } else {
            setMagneticSelectionStart(magneticSelectionPosition.current);
          }
        }
      }
    }
  };

  const onMagneticSelectionMouseMove = (position: { x: number; y: number }) => {
    // if (annotated || !annotating) {
    //   return;
    // }
    //
    // if (stageRef && stageRef.current) {
    //   magneticSelectionPosition.current = position;
    //
    //   if (magneticSelectionPosition && magneticSelectionPosition.current) {
    //     if (
    //       !magneticSelectionCanClose &&
    //       !isInside(
    //         magneticSelectionStartingAnchorCircleRef,
    //         magneticSelectionPosition.current
    //       )
    //     ) {
    //       setMagneticSelectionCanClose(true);
    //     }
    //
    //     // let startPosition;
    //     if (
    //       magneticSelectionPathFinder &&
    //       magneticSelectionPathFinder.current &&
    //       img &&
    //       magneticSelectionStartPosition &&
    //       magneticSelectionStartPosition.current
    //     ) {
    //       magneticSelectionPathCoordsRef.current = magneticSelectionPathFinder.current.find(
    //         getIdx(magneticSelectionDownsizedWidth, 1)(
    //           Math.floor(
    //             magneticSelectionStartPosition.current.x *
    //               magneticSelectionFactor
    //           ),
    //           Math.floor(
    //             magneticSelectionStartPosition.current.y *
    //               magneticSelectionFactor
    //           ),
    //           0
    //         ),
    //         getIdx(magneticSelectionDownsizedWidth, 1)(
    //           Math.floor(
    //             magneticSelectionPosition.current.x * magneticSelectionFactor
    //           ),
    //           Math.floor(
    //             magneticSelectionPosition.current.y * magneticSelectionFactor
    //           ),
    //           0
    //         )
    //       );
    //
    //       setMagneticSelectionStrokes(
    //         transformCoordinatesToStrokes(
    //           magneticSelectionPathCoordsRef.current
    //         )
    //       );
    //     }
    //   }
    // }
  };

  const onMagneticSelectionMouseUp = (position: { x: number; y: number }) => {
    if (annotated) {
      return;
    }

    if (!annotating) {
      return;
    }

    if (stageRef && stageRef.current) {
      magneticSelectionPosition.current = position;

      if (magneticSelectionPosition && magneticSelectionPosition.current) {
        if (magnetConnected(magneticSelectionPosition.current)) {
          if (magneticSelectionStart) {
            const stroke = {
              points: [
                magneticSelectionPosition.current.x,
                magneticSelectionPosition.current.y,
                magneticSelectionStart.x,
                magneticSelectionStart.y,
              ],
            };

            setMagneticSelectionStrokes([...magneticSelectionStrokes, stroke]);
          }

          const stroke = {
            points: _.flatten(
              magneticSelectionStrokes.map((stroke) => stroke.points)
            ),
          };

          setAnnotated(true);

          setAnnotating(false);

          setMagneticSelectionAnnotation(stroke);

          setMagneticSelectionStrokes([]);
        } else {
          if (magneticSelectionStrokes.length > 0) {
            setMagneticSelectionAnchor(magneticSelectionPosition.current);

            magneticSelectionStartPosition.current =
              magneticSelectionPosition.current;

            setMagneticSelectionPreviousStroke([
              ...magneticSelectionPreviousStroke,
              ...magneticSelectionStrokes,
            ]);
          } else {
            setMagneticSelectionStart(magneticSelectionPosition.current);
          }
        }
      }
    }
  };

  /*
   * Object selection
   */
  const objectSelectionRef = React.useRef<Rect>(null);
  const [model, setModel] = useState<tensorflow.LayersModel>();
  const tensorRef = React.useRef<Tensor3D | Tensor4D>();
  const [objectSelectionAnnotation, setObjectSelectionAnnotation] = useState<
    Array<number>
  >([]);

  const createModel = async () => {
    // FIXME: should be a local file
    const pathname =
      "https://raw.githubusercontent.com/zaidalyafeai/HostedModels/master/unet-128/model.json";

    const graph = await tensorflow.loadLayersModel(pathname);

    const optimizer = tensorflow.train.adam();

    graph.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    setModel(graph);
  };

  useEffect(() => {
    if (operation === ImageViewerOperation.ObjectSelection) {
      //this should be called only once
      createModel();
    }
  }, [operation]);

  useEffect(() => {
    if (tensorRef && tensorRef.current) {
      tensorRef.current.print();
      console.log(tensorRef.current.shape);
    }
  }, [tensorRef.current]);

  const onObjectSelection = () => {};

  const onObjectSelectionMouseUp = async (position: {
    x: number;
    y: number;
  }) => {
    if (annotated || !annotating) return;
    setAnnotated(true);
    setAnnotating(false);

    const f = async () => {
      if (imageRef && imageRef.current) {
        const config = {
          callback: (cropped: HTMLImageElement) => {
            tensorRef.current = tensorflow.tidy(() => {
              if (cropped) {
                const croppedInput: tensorflow.Tensor3D = tensorflow.browser.fromPixels(
                  cropped
                );

                const size: [number, number] = [128, 128];
                const resized = tensorflow.image.resizeBilinear(
                  croppedInput,
                  size
                );
                const standardized = resized.div(tensorflow.scalar(255));
                const batch = standardized.expandDims(0);

                if (model && rectangularSelectionY && rectangularSelectionX) {
                  const prediction = model.predict(
                    batch
                  ) as tensorflow.Tensor<tensorflow.Rank>;

                  const output = prediction
                    .squeeze([0])
                    .tile([1, 1, 3])
                    .sub(0.3)
                    .sign()
                    .relu()
                    .resizeBilinear([
                      Math.floor(rectangularSelectionHeight),
                      Math.floor(rectangularSelectionWidth),
                    ])
                    .greaterEqual(0.5)
                    .pad([
                      [
                        Math.floor(rectangularSelectionY),
                        imageRef.current.height() -
                          (Math.floor(rectangularSelectionY) +
                            Math.floor(rectangularSelectionHeight)),
                      ],
                      [
                        Math.floor(rectangularSelectionX),
                        imageRef.current.width() -
                          (Math.floor(rectangularSelectionX) +
                            Math.floor(rectangularSelectionWidth)),
                      ],
                      [0, 0],
                    ])
                    .cast("float32");
                  return output as tensorflow.Tensor3D;
                }
              }
            });
          },
          height: rectangularSelectionHeight,
          width: rectangularSelectionWidth,
          x: rectangularSelectionX,
          y: rectangularSelectionY,
        };
        await imageRef.current.toImage(config);
      }
    };
    await f();
  };

  /*
   * Polygonal selection
   */
  const [polygonalSelectionOperator] = useState(
    new PolygonalSelectionOperator()
  );

  /*
   * Quick selection
   */
  const QuickSelection = () => {
    return null;
  };

  const onQuickSelection = () => {};

  const onQuickSelectionMouseDown = (position: { x: number; y: number }) => {};

  const onQuickSelectionMouseMove = (position: { x: number; y: number }) => {};

  const onQuickSelectionMouseUp = (position: { x: number; y: number }) => {};

  /*
   * Rectangular selection
   */
  const rectangularSelectionRef = React.useRef<Rect>(null);

  const [
    rectangularSelectionX,
    setRectangularSelectionX,
  ] = React.useState<number>();

  const [
    rectangularSelectionY,
    setRectangularSelectionY,
  ] = React.useState<number>();

  const [
    rectangularSelectionHeight,
    setRectangularSelectionHeight,
  ] = React.useState<number>(0);

  const [
    rectangularSelectionWidth,
    setRectangularSelectionWidth,
  ] = React.useState<number>(0);

  const onRectangularSelection = () => {
    if (rectangularSelectionRef && rectangularSelectionRef.current) {
      const mask = rectangularSelectionRef.current.toDataURL({
        callback(data: string) {
          return data;
        },
      });

      const {
        x,
        y,
        width,
        height,
      } = rectangularSelectionRef.current.getClientRect();

      const boundingBox: BoundingBox = [x, y, x + width, y + height];

      const instance = {
        boundingBox: boundingBox,
        categoryId: activeCategory.id,
        id: image!.id,
        mask: mask,
      };

      if (image) {
        const payload = {
          instances: [instance, ...instances!],
        };

        dispatch(setImageViewerImageInstances(payload));
      }
    }
  };

  const onRectangularSelectionMouseDown = (position: {
    x: number;
    y: number;
  }) => {
    setRectangularSelectionX(position.x);
    setRectangularSelectionY(position.y);
  };

  const onRectangularSelectionMouseMove = (position: {
    x: number;
    y: number;
  }) => {
    if (rectangularSelectionX && rectangularSelectionY) {
      setRectangularSelectionHeight(position.y - rectangularSelectionY);

      setRectangularSelectionWidth(position.x - rectangularSelectionX);
    }
  };

  const onRectangularSelectionMouseUp = (position: {
    x: number;
    y: number;
  }) => {};

  /*
   * Zoom
   */
  const [zoomScaleX, setZoomScaleX] = useState<number>(1);
  const [zoomScaleY, setZoomScaleY] = useState<number>(1);
  const [stageX, setStageX] = useState<number>(0);
  const [stageY, setStageY] = useState<number>(0);

  const [zoomSelectionX, setZoomSelectionX] = useState<number>();
  const [zoomSelectionY, setZoomSelectionY] = useState<number>();
  const [zoomSelectionHeight, setZoomSelectionHeight] = useState<number>(0);
  const [zoomSelectionWidth, setZoomSelectionWidth] = useState<number>(0);

  const [zoomSelecting, setZoomSelecting] = useState<boolean>(false);
  const [zoomSelected, setZoomSelected] = useState<boolean>(false);

  const zoomIncrement = 1.1; // by how much we want to zoom in or out with each click

  const zoomMode = useSelector(imageViewerZoomModeSelector);

  useEffect(() => {
    setZoomScaleX(1);
    setZoomScaleY(1);
    setStageX(0);
    setStageY(0);
    setZoomSelectionX(0);
    setZoomSelectionY(0);
    setZoomSelectionHeight(0);
    setZoomSelectionWidth(0);
    setZoomSelecting(false);
    setZoomSelected(false);
  }, [zoomReset]);

  const onZoomMouseDown = (position: { x: number; y: number }) => {
    if (zoomSelected) return;

    setZoomSelectionX(position.x);
    setZoomSelectionY(position.y);

    setZoomSelecting(true);
  };

  const onZoomMouseMove = (position: { x: number; y: number }) => {
    if (zoomSelected) return;
    if (!zoomSelecting) return;

    if (zoomSelectionX && zoomSelectionY) {
      setZoomSelectionHeight(position.y - zoomSelectionY);
      setZoomSelectionWidth(position.x - zoomSelectionX);

      setZoomSelecting(true);
    }
  };

  const onZoomMouseUp = (position: { x: number; y: number }) => {
    if (
      zoomSelecting &&
      zoomSelectionX &&
      zoomSelectionY &&
      zoomSelectionWidth &&
      zoomSelectionHeight
    ) {
      if (stageRef && stageRef.current) {
        const newScale =
          zoomScaleX * (stageRef.current.width() / zoomSelectionWidth);
        setStageX(-1 * zoomSelectionX * newScale);
        setStageY(-1 * zoomSelectionY * newScale);
        setZoomScaleX(newScale);
        setZoomScaleY(newScale);
      }
      setZoomSelected(true);
    } else {
      const scaleStep = zoomMode ? 1 / zoomIncrement : zoomIncrement;

      if (stageRef && stageRef.current) {
        const newScale = zoomScaleX * scaleStep;

        setStageX(position.x - position.x * newScale);
        setStageY(position.y - position.y * newScale);

        setZoomScaleX(newScale);
        setZoomScaleY(newScale);
      }
    }

    setZoomSelecting(false);
  };

  const onSelection = () => {
    operator.select(activeCategory);
    // switch (operation) {
    //   case ImageViewerOperation.ColorAdjustment:
    //     return;
    //   case ImageViewerOperation.ColorSelection:
    //     return (operator as ColorSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.EllipticalSelection:
    //     return (operator as EllipticalSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.Hand:
    //     return;
    //   case ImageViewerOperation.LassoSelection:
    //     return (operator as LassoSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.MagneticSelection:
    //     return (operator as MagneticSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.ObjectSelection:
    //     return (operator as ObjectSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.PolygonalSelection:
    //     return (operator as PolygonalSelectionOperator).select(activeCategory);
    //   case ImageViewerOperation.QuickSelection:
    //     return operator.select(activeCategory);
    //   case ImageViewerOperation.RectangularSelection:
    //     return (operator as RectangularSelectionOperator).select(
    //       activeCategory
    //     );
    //   case ImageViewerOperation.Zoom:
    //     return;
    // }
  };

  const { annotated, annotating, setAnnotated, setAnnotating } = useSelection(
    onSelection
  );

  const onMouseDown = () => {
    if (!stageRef || !stageRef.current) return;

    if (transform && stageRef && stageRef.current) {
      let position = stageRef.current.getPointerPosition();

      if (!position) return;

      if (position) {
        position = transform.point(position);
        operator.onMouseDown(position);
      }
    }
  };

  // const onMouseDown = useMemo(() => {
  //   const throttled = _.throttle(() => {
  //     if (stageRef && stageRef.current && imageRef && imageRef.current) {
  //       // const position = stageRef.current.getPointerPosition();
  //       // const transform = imageRef.current.getAbsoluteTransform().copy();
  //       // transform.invert();
  //       const position = transform.point(stageRef.current.getPointerPosition());
  //
  //       if (position) {
  //         switch (operation) {
  //           case ImageViewerOperation.ColorAdjustment:
  //             break;
  //           case ImageViewerOperation.ColorSelection:
  //             return colorSelectionOperator.onMouseDown(position);
  //           case ImageViewerOperation.EllipticalSelection:
  //             return ellipticalSelectionOperator.onMouseDown(position);
  //           case ImageViewerOperation.Hand:
  //             break;
  //           case ImageViewerOperation.LassoSelection:
  //             return lassoSelectionOperator.onMouseDown(position);
  //           case ImageViewerOperation.MagneticSelection:
  //             if (annotated) return;
  //
  //             return onMagneticSelectionMouseDown(position);
  //           case ImageViewerOperation.ObjectSelection:
  //             if (annotated) return;
  //
  //             setAnnotating(true);
  //             return onRectangularSelectionMouseDown(position);
  //           case ImageViewerOperation.PolygonalSelection:
  //             return polygonalSelectionOperator.onMouseDown(position);
  //           case ImageViewerOperation.QuickSelection:
  //             return onQuickSelectionMouseDown(position);
  //           case ImageViewerOperation.RectangularSelection:
  //             if (annotated) return;
  //
  //             setAnnotating(true);
  //
  //             return onRectangularSelectionMouseDown(position);
  //           case ImageViewerOperation.Zoom:
  //             return onZoomMouseDown(position);
  //         }
  //       }
  //     }
  //   }, 100);
  //   return () => {
  //     return throttled();
  //   };
  // }, [
  //   operation,
  //   annotated,
  //   ellipticalSelectionOperator,
  //   lassoSelectionOperator,
  //   colorSelectionOperator,
  //   onMagneticSelectionMouseDown,
  //   onZoomMouseDown,
  //   polygonalSelectionOperator,
  //   setAnnotating,
  // ]);

  const onMouseMove = () => {
    if (!stageRef || !stageRef.current) return;

    if (transform && stageRef && stageRef.current) {
      let position = stageRef.current.getPointerPosition();

      if (!position) return;

      if (position) {
        position = transform.point(position);
        operator.onMouseMove(position);
      }
    }
  };

  // const onMouseMove = useMemo(() => {
  //   const throttled = _.throttle(() => {
  //     if (stageRef && stageRef.current && imageRef && imageRef.current) {
  //       // const position = stageRef.current.getPointerPosition();
  //       // const transform = imageRef.current.getAbsoluteTransform().copy();
  //       // transform.invert();
  //       const position = transform.point(stageRef.current.getPointerPosition());
  //
  //       if (position) {
  //         switch (operation) {
  //           case ImageViewerOperation.ColorAdjustment:
  //             break;
  //           case ImageViewerOperation.ColorSelection:
  //             return colorSelectionOperator.onMouseMove(position);
  //           case ImageViewerOperation.EllipticalSelection:
  //             return ellipticalSelectionOperator.onMouseMove(position);
  //           case ImageViewerOperation.Hand:
  //             break;
  //           case ImageViewerOperation.LassoSelection:
  //             return lassoSelectionOperator.onMouseMove(position);
  //           case ImageViewerOperation.MagneticSelection:
  //             if (annotated || !annotating) return;
  //
  //             return onMagneticSelectionMouseMove(position);
  //           case ImageViewerOperation.ObjectSelection:
  //             if (annotated || !annotating) return;
  //             return onRectangularSelectionMouseMove(position);
  //           case ImageViewerOperation.PolygonalSelection:
  //             return polygonalSelectionOperator.onMouseMove(position);
  //           case ImageViewerOperation.QuickSelection:
  //             return onQuickSelectionMouseMove(position);
  //           case ImageViewerOperation.RectangularSelection:
  //             if (annotated) return;
  //
  //             return onRectangularSelectionMouseMove(position);
  //           case ImageViewerOperation.Zoom:
  //             return onZoomMouseMove(position);
  //         }
  //       }
  //     }
  //   }, 100);
  //   return () => {
  //     return throttled();
  //   };
  // }, [
  //   operation,
  //   annotated,
  //   annotating,
  //   ellipticalSelectionOperator,
  //   lassoSelectionOperator,
  //   colorSelectionOperator,
  //   onRectangularSelectionMouseMove,
  //   onZoomMouseMove,
  //   polygonalSelectionOperator,
  // ]);

  const onMouseUp = () => {
    if (!stageRef || !stageRef.current) return;

    if (transform && stageRef && stageRef.current) {
      let position = stageRef.current.getPointerPosition();

      if (!position) return;

      if (position) {
        position = transform.point(position);
        operator.onMouseUp(position);
      }
    }
  };

  // const onMouseUp = useMemo(() => {
  //   const throttled = _.throttle(() => {
  //     if (stageRef && stageRef.current && imageRef.current) {
  //       // const position = stageRef.current.getPointerPosition();
  //       // const transform = imageRef.current.getAbsoluteTransform().copy();
  //       // transform.invert();
  //       const position = transform.point(stageRef.current.getPointerPosition());
  //
  //       if (position) {
  //         switch (operation) {
  //           case ImageViewerOperation.ColorAdjustment:
  //             break;
  //           case ImageViewerOperation.ColorSelection:
  //             return colorSelectionOperator.onMouseUp(position);
  //           case ImageViewerOperation.EllipticalSelection:
  //             return ellipticalSelectionOperator.onMouseUp(position);
  //           case ImageViewerOperation.Hand:
  //             break;
  //           case ImageViewerOperation.LassoSelection:
  //             return lassoSelectionOperator.onMouseUp(position);
  //           case ImageViewerOperation.MagneticSelection:
  //             if (annotated || !annotating) return;
  //
  //             return onMagneticSelectionMouseUp(position);
  //           case ImageViewerOperation.ObjectSelection:
  //             return onObjectSelectionMouseUp(position);
  //           case ImageViewerOperation.PolygonalSelection:
  //             return polygonalSelectionOperator.onMouseUp(position);
  //           case ImageViewerOperation.QuickSelection:
  //             return onQuickSelectionMouseUp(position);
  //           case ImageViewerOperation.RectangularSelection:
  //             if (annotated || !annotating) return;
  //
  //             setAnnotated(true);
  //             setAnnotating(false);
  //
  //             return onRectangularSelectionMouseUp(position);
  //           case ImageViewerOperation.Zoom:
  //             return onZoomMouseUp(position);
  //         }
  //       }
  //     }
  //   }, 100);
  //   return () => {
  //     return throttled();
  //   };
  // }, [
  //   operation,
  //   annotated,
  //   annotating,
  //   ellipticalSelectionOperator,
  //   lassoSelectionOperator,
  //   colorSelectionOperator,
  //   onMagneticSelectionMouseUp,
  //   onObjectSelectionMouseUp,
  //   onZoomMouseUp,
  //   polygonalSelectionOperator,
  //   setAnnotated,
  //   setAnnotating,
  // ]);

  const initialWidth = 1000;
  const parentRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState<number>(initialWidth);
  const [stageHeight, setStageHeight] = useState<number>(initialWidth);

  useEffect(() => {
    const resize = () => {
      if (parentRef && parentRef.current) {
        setZoomScaleX(parentRef.current.offsetWidth / initialWidth);
        setZoomScaleY(parentRef.current.offsetWidth / initialWidth);
        setStageWidth(stageWidth * zoomScaleX);
        setStageHeight(stageHeight * zoomScaleY);
      }
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [stageHeight, stageWidth, zoomScaleX, zoomScaleY]);

  useEffect(() => {
    const resize = () => {};

    resize();
  }, []);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div ref={parentRef} className={classes.parent}>
        <ReactKonva.Stage
          className={classes.stage}
          globalCompositeOperation="destination-over"
          height={initialWidth}
          position={{ x: stageX, y: stageY }}
          ref={stageRef}
          scale={{ x: zoomScaleX, y: zoomScaleY }}
          width={initialWidth}
        >
          <ReactKonva.Layer
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {img && <ReactKonva.Image ref={imageRef} image={img} />}

            {operation === ImageViewerOperation.ColorSelection && (
              <ColorSelection />
            )}

            {operation === ImageViewerOperation.EllipticalSelection && (
              <EllipticalSelection
                activeCategory={activeCategory}
                annotated={(operator as EllipticalSelectionOperator).selected}
                annotating={(operator as EllipticalSelectionOperator).selecting}
                center={(operator as EllipticalSelectionOperator).center}
                ellipticalSelectionRef={ellipticalSelectionRef}
                radius={(operator as EllipticalSelectionOperator).radius}
              />
            )}

            {operation === ImageViewerOperation.LassoSelection && (
              <PolygonalSelection
                activeCategory={activeCategory}
                anchor={(operator as PolygonalSelectionOperator).anchor}
                buffer={(operator as PolygonalSelectionOperator).buffer}
                origin={(operator as PolygonalSelectionOperator).origin}
                points={(operator as PolygonalSelectionOperator).points}
                selected={(operator as PolygonalSelectionOperator).selected}
                selecting={(operator as PolygonalSelectionOperator).selecting}
              />
            )}

            {operation === ImageViewerOperation.MagneticSelection && (
              <MagneticSelection />
            )}

            {operation === ImageViewerOperation.ObjectSelection && (
              <React.Fragment>
                <ObjectSelection
                  activeCategory={activeCategory}
                  annotated={annotated}
                  annotating={annotating}
                  height={rectangularSelectionHeight}
                  points={objectSelectionAnnotation}
                  ref={objectSelectionRef}
                  width={rectangularSelectionWidth}
                  x={rectangularSelectionX}
                  y={rectangularSelectionY}
                />
              </React.Fragment>
            )}

            {operation === ImageViewerOperation.PolygonalSelection && (
              <PolygonalSelection
                activeCategory={activeCategory}
                anchor={(operator as PolygonalSelectionOperator).anchor}
                buffer={(operator as PolygonalSelectionOperator).buffer}
                origin={(operator as PolygonalSelectionOperator).origin}
                points={(operator as PolygonalSelectionOperator).points}
                selected={(operator as PolygonalSelectionOperator).selected}
                selecting={(operator as PolygonalSelectionOperator).selecting}
              />
            )}

            {operation === ImageViewerOperation.QuickSelection && (
              <QuickSelection />
            )}

            {operation === ImageViewerOperation.RectangularSelection && (
              <RectangularSelection
                activeCategory={activeCategory}
                annotated={annotated}
                annotating={annotating}
                height={rectangularSelectionHeight}
                ref={rectangularSelectionRef}
                width={rectangularSelectionWidth}
                x={rectangularSelectionX}
                y={rectangularSelectionY}
              />
            )}

            {operation === ImageViewerOperation.Zoom && (
              <ZoomSelection
                selected={zoomSelected}
                selecting={zoomSelecting}
                height={zoomSelectionHeight}
                width={zoomSelectionWidth}
                x={zoomSelectionX}
                y={zoomSelectionY}
              />
            )}
          </ReactKonva.Layer>
        </ReactKonva.Stage>
      </div>
    </main>
  );
};
