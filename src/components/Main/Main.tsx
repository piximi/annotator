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
import {
  imageViewerImageInstancesSelector,
  imageViewerImageSelector,
  imageViewerOperationSelector,
} from "../../store/selectors";
import { Image } from "konva/types/shapes/Image";
import { Vector2d } from "konva/types/types";
import { FloodImage, floodPixels, makeFloodMap } from "../../image/flood";
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
  EllipticalSelectionOperator,
  LassoSelectionOperator,
  PolygonalSelectionOperator,
} from "../../image/selection";
import Konva from "konva";

type MainProps = {
  activeCategory: Category;
  zoomReset?: boolean;
};

export const Main = ({ activeCategory }: MainProps) => {
  const dispatch = useDispatch();

  const image = useSelector(imageViewerImageSelector);
  const instances = useSelector(imageViewerImageInstancesSelector);

  const [img] = useImage(image!.src, "Anonymous");
  const classes = useStyles();
  const stageRef = useRef<Stage>(null);
  const imageRef = useRef<Konva.Image>(null);

  const activeOperation = useSelector(imageViewerOperationSelector);

  const [transform, setTransform] = useState<Konva.Transform>();

  useEffect(() => {
    if (imageRef && imageRef.current) {
      setTransform(imageRef.current.getAbsoluteTransform().invert().copy());
    }
  }, [imageRef, imageRef.current]);

  /*
   * Color selection
   */
  const ColorSelection = () => {
    return (
      <React.Fragment>
        <ReactKonva.Image
          image={colorSelectOverlayImage}
          ref={colorSelectOverlayRef}
        />
        {annotating && colorSelectInitialPosition && (
          <ReactKonva.Label
            x={colorSelectInitialPosition.x}
            y={colorSelectInitialPosition.y}
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
              text={colorSelectTolerance.toString()}
              padding={5}
            />
          </ReactKonva.Label>
        )}
      </React.Fragment>
    );
  };

  const [colorSelectOverlayData, setColorSelectOverlayData] = useState<string>(
    ""
  );
  const [colorSelectOverlayImage] = useImage(
    colorSelectOverlayData,
    "Anonymous"
  );

  const colorSelectOverlayRef = React.useRef<Image>(null);

  const [
    colorSelectInitialPosition,
    setColorSelectInitialPosition,
  ] = useState<Vector2d>();
  const [colorSelectTolerance, setColorSelectTolerance] = useState<number>(1);

  const [
    colorSelectImageData,
    setColorSelectImageData,
  ] = useState<FloodImage>();

  const updateOverlay = (position: { x: any; y: any }) => {
    const results = floodPixels({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      image: colorSelectImageData!,
      tolerance: colorSelectTolerance,
      color: activeCategory.color,
    });
    setColorSelectOverlayData(results);
  };

  const onColorSelection = () => {};

  const onColorSelectionMouseDown = async (position: {
    x: number;
    y: number;
  }) => {
    console.log(position);
    setAnnotated(false);
    setAnnotating(true);
    setColorSelectTolerance(1);
    let jsImage;
    // Todo: Fix this little setup problem
    if (imageRef.current && !colorSelectImageData) {
      console.log(imageRef.current.toDataURL());
      jsImage = await ImageJS.Image.load(imageRef.current.toDataURL());
      setColorSelectImageData(jsImage as FloodImage);
      return;
    }
    if (stageRef && stageRef.current) {
      if (position) {
        if (imageRef && imageRef.current) {
          if (position !== colorSelectInitialPosition) {
            setColorSelectInitialPosition(position);
            setColorSelectImageData(
              makeFloodMap({
                x: Math.floor(position.x),
                y: Math.floor(position.y),
                image: colorSelectImageData!,
              })
            );
          }
          updateOverlay(position);
        }
      }
    }
  };

  const onColorSelectionMouseMove = (position: { x: number; y: number }) => {
    if (annotating && stageRef && stageRef.current) {
      if (position && colorSelectInitialPosition) {
        const diff = Math.ceil(
          Math.hypot(
            position.x - colorSelectInitialPosition!.x,
            position.y - colorSelectInitialPosition!.y
          )
        );
        if (diff !== colorSelectTolerance) {
          setColorSelectTolerance(diff);
          updateOverlay(colorSelectInitialPosition);
        }
      }
    }
  };

  const onColorSelectionMouseUp = (position: { x: number; y: number }) => {
    setAnnotated(true);
    setAnnotating(false);
  };

  /*
   * Elliptical selection
   */

  // FIXME: this is for prototyping only, it's very slow to update
  const [ellipticalSelectionOperator] = useState(
    new EllipticalSelectionOperator()
  );

  const ellipticalSelectionRef = React.useRef<Ellipse>(null);

  /*
   * Lasso selection
   */
  const [lassoSelectionOperator] = useState(new LassoSelectionOperator());

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

      return (
        rectangle.x <= position.x &&
        position.x <= rectangle.x + rectangle.width &&
        rectangle.y <= position.y &&
        position.y <= rectangle.y + rectangle.height
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
    if (activeOperation === ImageViewerOperation.ObjectSelection) {
      //this should be called only once
      createModel();
    }
  }, [activeOperation]);

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

  const onSelection = () => {
    switch (activeOperation) {
      case ImageViewerOperation.ColorAdjustment:
        return;
      case ImageViewerOperation.ColorSelection:
        return onColorSelection();
      case ImageViewerOperation.EllipticalSelection:
        return ellipticalSelectionOperator.select(0);
      case ImageViewerOperation.Hand:
        return;
      case ImageViewerOperation.LassoSelection:
        return lassoSelectionOperator.select(0);
      case ImageViewerOperation.MagneticSelection:
        return onMagneticSelection();
      case ImageViewerOperation.ObjectSelection:
        return onObjectSelection();
      case ImageViewerOperation.PolygonalSelection:
        return polygonalSelectionOperator.select(0);
      case ImageViewerOperation.QuickSelection:
        return onQuickSelection();
      case ImageViewerOperation.RectangularSelection:
        return onRectangularSelection();
      case ImageViewerOperation.Zoom:
        return;
    }
  };

  const { annotated, annotating, setAnnotated, setAnnotating } = useSelection(
    onSelection
  );

  const onMouseDown = useMemo(() => {
    const throttled = _.throttle(() => {
      if (stageRef && stageRef.current) {
        const position = transform.point(stageRef.current.getPointerPosition());

        if (position) {
          switch (activeOperation) {
            case ImageViewerOperation.ColorAdjustment:
              break;
            case ImageViewerOperation.ColorSelection:
              return onColorSelectionMouseDown(position);
            case ImageViewerOperation.EllipticalSelection:
              return ellipticalSelectionOperator.onMouseDown(position);
            case ImageViewerOperation.Hand:
              break;
            case ImageViewerOperation.LassoSelection:
              return lassoSelectionOperator.onMouseDown(position);
            case ImageViewerOperation.MagneticSelection:
              if (annotated) return;

              return onMagneticSelectionMouseDown(position);
            case ImageViewerOperation.ObjectSelection:
              if (annotated) return;

              setAnnotating(true);
              return onRectangularSelectionMouseDown(position);
            case ImageViewerOperation.PolygonalSelection:
              return polygonalSelectionOperator.onMouseDown(position);
            case ImageViewerOperation.QuickSelection:
              return onQuickSelectionMouseDown(position);
            case ImageViewerOperation.RectangularSelection:
              if (annotated) return;

              setAnnotating(true);

              return onRectangularSelectionMouseDown(position);
          }
        }
      }
    }, 100);

    return () => {
      return throttled();
    };
  }, [
    activeOperation,
    annotated,
    ellipticalSelectionOperator,
    lassoSelectionOperator,
    onColorSelectionMouseDown,
    onMagneticSelectionMouseDown,
    polygonalSelectionOperator,
    setAnnotating,
    transform,
  ]);

  const onMouseMove = useMemo(() => {
    const throttled = _.throttle(() => {
      if (stageRef && stageRef.current && imageRef) {
        const position = transform.point(stageRef.current.getPointerPosition());

        if (position) {
          switch (activeOperation) {
            case ImageViewerOperation.ColorAdjustment:
              break;
            case ImageViewerOperation.ColorSelection:
              return onColorSelectionMouseMove(position);
            case ImageViewerOperation.EllipticalSelection:
              return ellipticalSelectionOperator.onMouseMove(position);
            case ImageViewerOperation.Hand:
              break;
            case ImageViewerOperation.LassoSelection:
              return lassoSelectionOperator.onMouseMove(position);
            case ImageViewerOperation.MagneticSelection:
              if (annotated || !annotating) return;

              return onMagneticSelectionMouseMove(position);
            case ImageViewerOperation.ObjectSelection:
              if (annotated || !annotating) return;
              return onRectangularSelectionMouseMove(position);
            case ImageViewerOperation.PolygonalSelection:
              return polygonalSelectionOperator.onMouseMove(position);
            case ImageViewerOperation.QuickSelection:
              return onQuickSelectionMouseMove(position);
            case ImageViewerOperation.RectangularSelection:
              if (annotated) return;

              return onRectangularSelectionMouseMove(position);
          }
        }
      }
    }, 100);

    return () => {
      return throttled();
    };
  }, [
    activeOperation,
    annotated,
    annotating,
    ellipticalSelectionOperator,
    lassoSelectionOperator,
    onColorSelectionMouseMove,
    onRectangularSelectionMouseMove,
    polygonalSelectionOperator,
    transform,
  ]);

  const onMouseUp = () => {
    if (stageRef && stageRef.current) {
      let position = stageRef.current.getPointerPosition();

      if (position) {
        switch (activeOperation) {
          case ImageViewerOperation.ColorAdjustment:
            break;
          case ImageViewerOperation.ColorSelection:
            return onColorSelectionMouseUp(position);
          case ImageViewerOperation.EllipticalSelection:
            return ellipticalSelectionOperator.onMouseUp(position);
          case ImageViewerOperation.Hand:
            break;
          case ImageViewerOperation.LassoSelection:
            return lassoSelectionOperator.onMouseUp(position);
          case ImageViewerOperation.MagneticSelection:
            if (annotated || !annotating) return;

            return onMagneticSelectionMouseUp(position);
          case ImageViewerOperation.ObjectSelection:
            return onObjectSelectionMouseUp(position);
          case ImageViewerOperation.PolygonalSelection:
            return polygonalSelectionOperator.onMouseUp(position);
          case ImageViewerOperation.QuickSelection:
            return onQuickSelectionMouseUp(position);
          case ImageViewerOperation.RectangularSelection:
            if (annotated || !annotating) return;

            setAnnotated(true);
            setAnnotating(false);

            return onRectangularSelectionMouseUp(position);
        }
      }
    }
  };

  const initialWidth = 1000;
  const parentRef = useRef<HTMLDivElement>(null);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div ref={parentRef} className={classes.parent}>
        <ReactKonva.Stage
          className={classes.stage}
          globalCompositeOperation="destination-over"
          height={initialWidth}
          ref={stageRef}
          width={initialWidth}
        >
          <ReactKonva.Layer
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            {img && <ReactKonva.Image ref={imageRef} image={img} />}

            {activeOperation === ImageViewerOperation.ColorSelection && (
              <ColorSelection />
            )}

            {activeOperation === ImageViewerOperation.EllipticalSelection && (
              <EllipticalSelection
                activeCategory={activeCategory}
                annotated={ellipticalSelectionOperator.selected}
                annotating={ellipticalSelectionOperator.selecting}
                center={ellipticalSelectionOperator.center}
                ellipticalSelectionRef={ellipticalSelectionRef}
                radius={ellipticalSelectionOperator.radius}
              />
            )}

            {activeOperation === ImageViewerOperation.LassoSelection && (
              <PolygonalSelection
                activeCategory={activeCategory}
                anchor={lassoSelectionOperator.anchor}
                buffer={lassoSelectionOperator.buffer}
                origin={lassoSelectionOperator.origin}
                points={lassoSelectionOperator.points}
                selected={lassoSelectionOperator.selected}
                selecting={lassoSelectionOperator.selecting}
              />
            )}

            {activeOperation === ImageViewerOperation.MagneticSelection && (
              <MagneticSelection />
            )}

            {activeOperation === ImageViewerOperation.ObjectSelection && (
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

            {activeOperation === ImageViewerOperation.PolygonalSelection && (
              <PolygonalSelection
                activeCategory={activeCategory}
                anchor={polygonalSelectionOperator.anchor}
                buffer={polygonalSelectionOperator.buffer}
                origin={polygonalSelectionOperator.origin}
                points={polygonalSelectionOperator.points}
                selected={polygonalSelectionOperator.selected}
                selecting={polygonalSelectionOperator.selecting}
              />
            )}

            {activeOperation === ImageViewerOperation.QuickSelection && (
              <QuickSelection />
            )}

            {activeOperation === ImageViewerOperation.RectangularSelection && (
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
          </ReactKonva.Layer>
        </ReactKonva.Stage>
      </div>
    </main>
  );
};
