import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { Operation } from "../../types/Operation";
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

export const useOperator = (src: string) => {
  const operation = useSelector(operationSelector);

  const [operator, setOperator] = useState<AnnotationTool>();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case Operation.ColorSelection:
          setOperator(new ColorAnnotationTool(image));

          return;
        case Operation.EllipticalSelection:
          setOperator(new EllipticalAnnotationTool(image));

          return;
        case Operation.LassoSelection:
          setOperator(new LassoAnnotationTool(image));

          return;
        case Operation.MagneticSelection:
          setOperator(new MagneticAnnotationTool(image));

          return;
        case Operation.ObjectSelection:
          ObjectAnnotationTool.compile(image).then(
            (operator: ObjectAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PenSelection:
          PenAnnotationTool.setup(image, 8).then(
            (operator: PenAnnotationTool) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PolygonalSelection:
          setOperator(new PolygonalAnnotationTool(image));

          return;
        case Operation.QuickSelection:
          const quickSelectionOperator = QuickAnnotationTool.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case Operation.RectangularSelection:
          setOperator(new RectangularAnnotationTool(image));

          return;
      }
    });
  }, [operation, src]);

  return [operator];
};
