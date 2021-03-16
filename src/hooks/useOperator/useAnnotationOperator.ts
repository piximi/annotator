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

export const useAnnotationOperator = (src: string) => {
  const operation = useSelector(toolTypeSelector);

  const [operator, setOperator] = useState<AnnotationTool>();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case ToolType.ColorAnnotation:
          setOperator(new ColorAnnotationTool(image));

          return;
        case ToolType.EllipticalAnnotation:
          setOperator(new EllipticalAnnotationTool(image));

          return;
        case ToolType.LassoAnnotation:
          setOperator(new LassoAnnotationTool(image));

          return;
        case ToolType.MagneticAnnotation:
          setOperator(new MagneticAnnotationTool(image));

          return;
        case ToolType.ObjectAnnotation:
          ObjectAnnotationTool.compile(image).then(
            (operator: ObjectAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case ToolType.PenAnnotation:
          PenAnnotationTool.setup(image, 8).then(
            (operator: PenAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case ToolType.PolygonalAnnotation:
          setOperator(new PolygonalAnnotationTool(image));

          return;
        case ToolType.QuickAnnotation:
          const quickSelectionOperator = QuickAnnotationTool.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case ToolType.RectangularSelection:
          setOperator(new RectangularAnnotationTool(image));

          return;
      }
    });
  }, [operation, src]);

  return [operator];
};
