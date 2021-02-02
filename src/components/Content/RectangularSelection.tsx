import { RectangularSelectionOperator } from "../../image/selection";
import * as ReactKonva from "react-konva";

type RectangularSelectionProps = {
  operator: RectangularSelectionOperator;
};

export const RectangularSelection = ({
  operator,
}: RectangularSelectionProps) => {
  if (!operator.origin || !operator.width || !operator.height) return null;

  return (
    <ReactKonva.Rect
      height={operator.height}
      stroke="white"
      strokeWidth={1}
      width={operator.width}
      x={operator.origin.x}
      y={operator.origin.y}
    />
  );
};
