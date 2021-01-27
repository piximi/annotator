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
  ellipticalSelectionCenterX?: number;
  ellipticalSelectionCenterY?: number;
  ellipticalSelectionRadiusX: number;
  ellipticalSelectionRadiusY: number;
  ellipticalSelectionRef: RefObject<Ellipse>;
};

export const EllipticalSelection = React.forwardRef<
  Ellipse,
  EllipticalSelectionProps
>((props, ref) => {
  const dashOffset = useMarchingAnts();

  if (props.annotated && !props.annotating) {
    return (
      <ReactKonva.Ellipse
        dash={[4, 2]}
        dashOffset={-dashOffset}
        radiusX={props.ellipticalSelectionRadiusX}
        radiusY={props.ellipticalSelectionRadiusY}
        ref={props.ellipticalSelectionRef}
        stroke="white"
        strokeWidth={1}
        x={props.ellipticalSelectionCenterX}
        y={props.ellipticalSelectionCenterY}
        fill={toRGBA(props.activeCategory.color, 0.3)}
      />
    );
  } else if (!props.annotated && props.annotating) {
    return (
      <React.Fragment>
        <ReactKonva.Ellipse
          radiusX={props.ellipticalSelectionRadiusX}
          radiusY={props.ellipticalSelectionRadiusY}
          stroke="black"
          strokeWidth={1}
          x={props.ellipticalSelectionCenterX}
          y={props.ellipticalSelectionCenterY}
        />
        <ReactKonva.Ellipse
          dash={[4, 2]}
          dashOffset={-dashOffset}
          radiusX={props.ellipticalSelectionRadiusX}
          radiusY={props.ellipticalSelectionRadiusY}
          stroke="white"
          strokeWidth={1}
          x={props.ellipticalSelectionCenterX}
          y={props.ellipticalSelectionCenterY}
        />
      </React.Fragment>
    );
  } else {
    return null;
  }
});
