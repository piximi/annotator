import * as ReactKonva from "react-konva";
import React, {RefObject} from "react";
import {Category} from "../../types/Category";
import {toRGBA} from "../../image/toRGBA";
import {useMarchingAnts} from "../../hooks";
import {Rect} from "konva/types/shapes/Rect";

type ObjectSelectionProps = {
  activeCategory: Category;
  annotated: boolean;
  annotating: boolean;
  height: number;
  ref: RefObject<Rect>;
  width: number;
  x?: number;
  y?: number;
};

export const ObjectSelection = React.forwardRef<Rect, ObjectSelectionProps>( (props, ref) => {
  const dashOffset = useMarchingAnts();
  if (props.annotated && !props.annotating) {
    return (
        <ReactKonva.Rect
            dash={[4, 2]}
            dashOffset={-dashOffset}
            fill={toRGBA(props.activeCategory.color, 0.3)}
            height={props.height}
            ref={ref}
            stroke="white"
            strokeWidth={1}
            width={props.width}
            x={props.x}
            y={props.y}
        />
    )
  } else if (!props.annotated && props.annotating) {
      return (

        <React.Fragment>
          <ReactKonva.Rect
              height={props.height}
              stroke="black"
              strokeWidth={1}
              width={props.width}
              x={props.x}
              y={props.y}
          />
          <ReactKonva.Rect
              dash={[4, 2]}
              dashOffset={-dashOffset}
              height={props.height}
              stroke="white"
              strokeWidth={1}
              width={props.width}
              x={props.x}
              y={props.y}
          />
        </React.Fragment>
    );
  } else {
    return null;
  }
})
