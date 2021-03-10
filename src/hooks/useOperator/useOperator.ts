import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { Tool } from "../../types/Tool";
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
import { operationSelector } from "../../store/selectors";
import { ZoomTool } from "../../image/Tool/ZoomTool";

export const useOperator = (src: string) => {
  const operation = useSelector(operationSelector);

  const [operator, setOperator] = useState<AnnotationTool | ZoomTool>();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case Tool.ColorAnnotation:
          setOperator(new ColorAnnotationTool(image));

          return;
        case Tool.EllipticalAnnotation:
          setOperator(new EllipticalAnnotationTool(image));

          return;
        case Tool.LassoAnnotation:
          setOperator(new LassoAnnotationTool(image));

          return;
        case Tool.MagneticAnnotation:
          setOperator(new MagneticAnnotationTool(image));

          return;
        case Tool.ObjectAnnotation:
          ObjectAnnotationTool.compile(image).then(
            (operator: ObjectAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case Tool.PenAnnotation:
          PenAnnotationTool.setup(image, 8).then(
            (operator: PenAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case Tool.PolygonalAnnotation:
          setOperator(new PolygonalAnnotationTool(image));

          return;
        case Tool.QuickAnnotation:
          const quickSelectionOperator = QuickAnnotationTool.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case Tool.RectangularSelection:
          setOperator(new RectangularAnnotationTool(image));

          return;
        case Tool.Zoom:
          setOperator(new ZoomTool(image));
          return;
      }
    });
  }, [operation, src]);

  return [operator];
};
