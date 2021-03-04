import { useEffect, useState } from "react";
import * as ImageJS from "image-js";
import { Operation } from "../../types/Operation";
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
import { PenSelectionOperator } from "../../image/selection/PenSelectionOperator";
import { useSelector } from "react-redux";
import { operationSelector } from "../../store/selectors";

export const useSelectionOperator = (src: string) => {
  const operation = useSelector(operationSelector);

  const [operator, setOperator] = useState<SelectionOperator>();

  useEffect(() => {
    ImageJS.Image.load(src).then((image: ImageJS.Image) => {
      switch (operation) {
        case Operation.ColorSelection:
          setOperator(new ColorSelectionOperator(image));

          return;
        case Operation.EllipticalSelection:
          setOperator(new EllipticalSelectionOperator(image));

          return;
        case Operation.LassoSelection:
          setOperator(new LassoSelectionOperator(image));

          return;
        case Operation.MagneticSelection:
          setOperator(new MagneticSelectionOperator(image));

          return;
        case Operation.ObjectSelection:
          ObjectSelectionOperator.compile(image).then(
            (operator: ObjectSelectionOperator) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PenSelection:
          PenSelectionOperator.setup(image, 8).then(
            (operator: PenSelectionOperator) => {
              setOperator(operator);
            }
          );

          return;
        case Operation.PolygonalSelection:
          setOperator(new PolygonalSelectionOperator(image));

          return;
        case Operation.QuickSelection:
          const quickSelectionOperator = QuickSelectionOperator.setup(image);
          setOperator(quickSelectionOperator);

          return;
        case Operation.RectangularSelection:
          setOperator(new RectangularSelectionOperator(image));

          return;
      }
    });
  }, [operation, src]);

  return [operator];
};
