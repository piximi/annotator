import * as ReactKonva from "react-konva";
import React, { RefObject } from "react";
import { Category } from "../../types/Category";
import { toRGBA } from "../../image/toRGBA";
import { useMarchingAnts } from "../../hooks";
import { Ellipse } from "konva/types/shapes/Ellipse";

type EllipticalSelectionProps = {
  activeCategory: Category;
  annotated: boolean;
  annotating: boolean;
  center?: { x: number; y: number };
  radius?: { x: number; y: number };
  ellipticalSelectionRef: RefObject<Ellipse>;
};

export const EllipticalSelection = React.forwardRef<
  Ellipse,
  EllipticalSelectionProps
>((props, ref) => {
  const dashOffset = useMarchingAnts();

  if (!props.center || !props.radius) return null;

  if (props.annotated && !props.annotating) {
    return (
      <ReactKonva.Ellipse
        dash={[4, 2]}
        dashOffset={-dashOffset}
        radiusX={props.radius.x}
        radiusY={props.radius.y}
        ref={props.ellipticalSelectionRef}
        stroke="white"
        strokeWidth={1}
        x={props.center.x}
        y={props.center.y}
        fill={toRGBA(props.activeCategory.color, 0.3)}
      />
    );
  } else if (!props.annotated && props.annotating) {
    return (
      <React.Fragment>
        <ReactKonva.Ellipse
          radiusX={props.radius.x}
          radiusY={props.radius.y}
          stroke="black"
          strokeWidth={1}
          x={props.center.x}
          y={props.center.y}
        />
        <ReactKonva.Ellipse
          dash={[4, 2]}
          dashOffset={-dashOffset}
          radiusX={props.radius.x}
          radiusY={props.radius.y}
          stroke="white"
          strokeWidth={1}
          x={props.center.x}
          y={props.center.y}
        />
      </React.Fragment>
    );
  } else {
    return null;
  }
});
