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
import { toolTypeSelector } from "../../store/selectors";

export const useAnnotationOperator = (src: string, stageWidth: number) => {
  const operation = useSelector(toolTypeSelector);

  const [operator, setOperator] = useState<AnnotationTool>();

  const [image, setImage] = useState<ImageJS.Image>();

  useEffect(() => {
    // // PUT HERE
    // const image = new Image();
    //
    // image.onload = () => {
    //     const width = image.naturalWidth;
    //     const height = image.naturalHeight;
    //
    //     const request = new Request(src);
    //
    //     fetch(request).then((response) => response.blob()).then((buffer) => {
    //         const foo = new ImageJS.Image(width, height, buffer)
    //         console.info(foo.toDataURL());
    //     })
    // };
    //
    // image.src = src;

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
        setOperator(new ColorAnnotationTool(image, stageWidth));

        return;
      case ToolType.EllipticalAnnotation:
        setOperator(new EllipticalAnnotationTool(image, stageWidth));

        return;
      case ToolType.LassoAnnotation:
        setOperator(new LassoAnnotationTool(image, stageWidth));

        return;
      case ToolType.MagneticAnnotation:
        setOperator(new MagneticAnnotationTool(image, 0.5, stageWidth));

        return;
      case ToolType.ObjectAnnotation:
        ObjectAnnotationTool.compile(image, stageWidth).then(
          (operator: ObjectAnnotationTool) => {
            setOperator(operator);
          }
        );

        return;
      case ToolType.PenAnnotation:
        PenAnnotationTool.setup(image, 8, stageWidth).then(
          (operator: PenAnnotationTool) => {
            setOperator(operator);
          }
        );

        return;
      case ToolType.PolygonalAnnotation:
        setOperator(new PolygonalAnnotationTool(image, stageWidth));

        return;
      case ToolType.QuickAnnotation:
        const quickSelectionOperator = QuickAnnotationTool.setup(
          image,
          stageWidth
        );
        setOperator(quickSelectionOperator);

        return;
      case ToolType.RectangularSelection:
        setOperator(new RectangularAnnotationTool(image, stageWidth));

        return;
    }
  }, [operation, image]);

  return [operator];
};
