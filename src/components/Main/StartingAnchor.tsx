import * as ReactKonva from "react-konva";
import React, { RefObject } from "react";
import { Circle } from "konva/types/shapes/Circle";

type StartingAnchorProps = {
  annotating: boolean;
  pointRadius: number;
  position?: { x: number; y: number } | null;
  ref: RefObject<Circle>;
};

export const StartingAnchor = React.forwardRef<Circle, StartingAnchorProps>(
  (props, ref) => (
    <ReactKonva.Circle
      fill="#000"
      globalCompositeOperation="source-over"
      hitStrokeWidth={64}
      id="start"
      name="anchor"
      radius={props.pointRadius}
      ref={ref}
      stroke="#FFF"
      strokeWidth={1}
      x={props.position?.x}
      y={props.position?.y}
    />
  )
);
