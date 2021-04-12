import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { ToolType } from "../../types/ToolType";
import {
  ColorAnnotationTool,
  EllipticalAnnotationTool,
  LassoAnnotationTool,
  MagneticAnnotationTool,
  ObjectAnnotationTool,
  PenAnnotationTool,
  PolygonalAnnotationTool,
  QuickAnnotationTool,
  RectangularAnnotationTool,
  AnnotationTool,
} from "../../image/Tool";
import { useSelector } from "react-redux";
import {
  imageSrcSelector,
  stageScaleSelector,
  toolTypeSelector,
} from "../../store/selectors";
import { penSelectionBrushSizeSelector } from "../../store/selectors/penSelectionBrushSizeSelector";
import { imageWidthSelector } from "../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../store/selectors/imageHeightSelector";

export const useAnnotationTool = () => {
  const src = useSelector(imageSrcSelector);
  const operation = useSelector(toolTypeSelector);
  const imageWidth = useSelector(imageWidthSelector);
  const imageHeight = useSelector(imageHeightSelector);
  const stageScale = useSelector(stageScaleSelector);

  const [stagedImageShape, setStagedImageShape] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [stagedImagePosition, setStagedImagePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!imageHeight || !imageWidth) return;

    setStagedImageShape({ width: imageWidth, height: imageHeight });
  }, [imageHeight, imageWidth]);

  const [operator, setOperator] = useState<AnnotationTool>();

  const [image, setImage] = useState<ImageJS.Image>();

  const brushSize = useSelector(penSelectionBrushSizeSelector);

  useEffect(() => {
    if (!src) return;

    const loadImage = async () => {
      const image = await ImageJS.Image.load(src);
      setImage(image);
    };

    loadImage();
  }, [src]);

  useEffect(() => {
    if (!image) return;

    switch (operation) {
      case ToolType.ColorAnnotation:
        setOperator(
          new ColorAnnotationTool(image, stagedImagePosition, stagedImageShape)
        );

        return;
      case ToolType.EllipticalAnnotation:
        setOperator(
          new EllipticalAnnotationTool(
            image,
            stagedImagePosition,
            stagedImageShape
          )
        );

        return;
      case ToolType.LassoAnnotation:
        setOperator(
          new LassoAnnotationTool(image, stagedImagePosition, stagedImageShape)
        );

        return;
      case ToolType.MagneticAnnotation:
        setOperator(
          new MagneticAnnotationTool(
            image,
            0.5,
            stagedImagePosition,
            stagedImageShape
          )
        );

        return;
      case ToolType.ObjectAnnotation:
        ObjectAnnotationTool.compile(
          image,
          stagedImagePosition,
          stagedImageShape
        ).then((operator: ObjectAnnotationTool) => {
          setOperator(operator);
        });

        return;
      case ToolType.PenAnnotation:
        const scale = stageScale ? stageScale : 1;
        PenAnnotationTool.setup(
          image,
          brushSize / scale,
          stagedImagePosition,
          stagedImageShape
        ).then((operator: PenAnnotationTool) => {
          setOperator(operator);
        });

        return;
      case ToolType.PolygonalAnnotation:
        setOperator(
          new PolygonalAnnotationTool(
            image,
            stagedImagePosition,
            stagedImageShape
          )
        );

        return;
      case ToolType.QuickAnnotation:
        const quickSelectionOperator = QuickAnnotationTool.setup(
          image,
          stagedImagePosition,
          stagedImageShape
        );
        setOperator(quickSelectionOperator);

        return;
      case ToolType.RectangularAnnotation:
        setOperator(
          new RectangularAnnotationTool(
            image,
            stagedImagePosition,
            stagedImageShape
          )
        );

        return;
    }
  }, [operation, image]);

  return [operator];
};
