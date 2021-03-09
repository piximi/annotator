import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { Operation } from "../../types/Operation";
import {
  ColorSelectionTool,
  EllipticalSelectionTool,
  LassoSelectionTool,
  MagneticSelectionTool,
  ObjectSelectionTool,
  PenSelectionTool,
  PolygonalSelectionTool,
  QuickSelectionTool,
  RectangularSelectionTool,
  SelectionTool,
} from "../../image/Tool";
import { useSelector } from "react-redux";
import { operationSelector } from "../../store/selectors";

export const useOperator = (src: string) => {
  const operation = useSelector(operationSelector);

  const [operator, setOperator] = useState<SelectionTool>();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case Operation.ColorSelection:
          setOperator(new ColorSelectionTool(image));

          return;
        case Operation.EllipticalSelection:
          setOperator(new EllipticalSelectionTool(image));

          return;
        case Operation.LassoSelection:
          setOperator(new LassoSelectionTool(image));

          return;
        case Operation.MagneticSelection:
          setOperator(new MagneticSelectionTool(image));

          return;
        case Operation.ObjectSelection:
          ObjectSelectionTool.compile(image).then(
            (operator: ObjectSelectionTool) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PenSelection:
          PenSelectionTool.setup(image, 8).then(
            (operator: PenSelectionTool) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PolygonalSelection:
          setOperator(new PolygonalSelectionTool(image));

          return;
        case Operation.QuickSelection:
          const quickSelectionOperator = QuickSelectionTool.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case Operation.RectangularSelection:
          setOperator(new RectangularSelectionTool(image));

          return;
      }
    });
  }, [operation, src]);

  return [operator];
};
