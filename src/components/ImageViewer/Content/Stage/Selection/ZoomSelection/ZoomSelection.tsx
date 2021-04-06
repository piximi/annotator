import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";

type ZoomSelectionProps = {
  minimum?: { x: number; y: number };
  maximum?: { x: number; y: number };
  selecting: boolean;
};

export const ZoomSelection = ({
  minimum,
  maximum,
  selecting,
}: ZoomSelectionProps) => {
  const dashOffset = useMarchingAnts();

  if (!minimum || !maximum || !selecting) return <React.Fragment />;

  return (
    <React.Fragment>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={maximum.y - minimum.y}
        stroke="black"
        strokeWidth={1}
        width={maximum.x - minimum.x}
        x={minimum.x}
        y={minimum.y}
      />

      {/*<ReactKonva.Rect*/}
      {/*  dash={[4, 2]}*/}
      {/*  dashOffset={-dashOffset}*/}
      {/*  height={maximum.y - minimum.y}*/}
      {/*  scale={{x: scale, y: scale }}*/}
      {/*  stroke="white"*/}
      {/*  strokeWidth={1}*/}
      {/*  width={maximum.x - minimum.x}*/}
      {/*  x={minimum.x}*/}
      {/*  y={minimum.y}*/}
      {/*/>*/}
    </React.Fragment>
  );
};
