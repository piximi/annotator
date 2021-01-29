import { EllipticalSelectionOperator } from "../../image/selection";
import * as ReactKonva from "react-konva";

type EllipticalSelectionProps = {
  operator: EllipticalSelectionOperator;
};

export const EllipticalSelection = ({ operator }: EllipticalSelectionProps) => {
  console.info("beep");

  if (!operator.center || !operator.radius) return null;

  console.info("boop");

  return (
    <ReactKonva.Ellipse
      radiusX={operator.radius.x}
      radiusY={operator.radius.y}
      stroke="white"
      strokeWidth={1}
      x={operator.center.x}
      y={operator.center.y}
    />
  );
};
