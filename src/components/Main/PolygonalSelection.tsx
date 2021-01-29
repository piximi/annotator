import * as ReactKonva from "react-konva";
import React, { RefObject } from "react";
import { Category } from "../../types/Category";
import { useMarchingAnts } from "../../hooks";
import { Line } from "konva/types/shapes/Line";

type PolygonalSelectionProps = {
  activeCategory: Category;
  anchor?: { x: number; y: number };
  buffer: Array<number>;
  origin?: { x: number; y: number };
  points: Array<number>;
  ref: RefObject<Line>;
  selected: boolean;
  selecting: boolean;
};

export const PolygonalSelection = React.forwardRef<
  Line,
  PolygonalSelectionProps
>((props, ref) => {
  const PolygonalSelectionAnchor = () => {
    if (props.selecting && props.anchor) {
      return (
        <ReactKonva.Circle
          fill="#FFF"
          name="anchor"
          radius={3}
          stroke="#FFF"
          strokeWidth={1}
          x={props.anchor.x}
          y={props.anchor.y}
        />
      );
    } else {
      return <React.Fragment />;
    }
  };

  const dashOffset = useMarchingAnts();

  if (props.selected && !props.selecting) {
    return (
      <React.Fragment>
        <PolygonalSelectionAnchor />

        {props.points && (
          <React.Fragment>
            <ReactKonva.Line
              points={props.points}
              stroke="black"
              strokeWidth={1}
            />

            <ReactKonva.Line
              closed
              dash={[4, 2]}
              dashOffset={-dashOffset}
              points={props.points}
              stroke="white"
              strokeWidth={1}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  } else if (!props.selected && props.selecting) {
    return (
      <React.Fragment>
        <ReactKonva.Line points={props.buffer} stroke="black" strokeWidth={1} />

        <ReactKonva.Line
          closed={false}
          dash={[4, 2]}
          dashOffset={-dashOffset}
          fill="None"
          points={props.buffer}
          stroke="white"
          strokeWidth={1}
        />

        <PolygonalSelectionAnchor />
      </React.Fragment>
    );
  } else {
    return null;
  }
});
