import { ObjectSelectionOperator } from "../../../../../../image/selection";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type ObjectSelectionProps = {
  operator: ObjectSelectionOperator;
};

export const ObjectSelection = ({ operator }: ObjectSelectionProps) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (operator.prediction) {
      const img = new Image();
      img.src = operator.prediction.toDataURL();
      setImage(img);
    }
  }, [operator.prediction]);

  const dashOffset = useMarchingAnts();

  if (!operator.origin || !operator.width || !operator.height) return null;

  return (
    <ReactKonva.Group>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="black"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={operator.height}
        stroke="white"
        strokeWidth={1}
        width={operator.width}
        x={operator.origin.x}
        y={operator.origin.y}
      />

      {/*<ReactKonva.Line*/}
      {/*  stroke="white"*/}
      {/*  points={operator.points}*/}
      {/*  strokeWidth={1}*/}
      {/*/>*/}

      {operator.offset && (
        <ReactKonva.Image
          image={image}
          x={operator.offset.x}
          y={operator.offset.y}
        />
      )}
    </ReactKonva.Group>
  );
};
