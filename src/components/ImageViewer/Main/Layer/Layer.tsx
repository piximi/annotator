import React from "react";
import * as ReactKonva from "react-konva";

type LayerProps = {
  children?: React.ReactNode;
  offset: { x: number; y: number };
  position: { x: number; y: number };
};

export const Layer = ({ children, offset, position }: LayerProps) => {
  return (
    <ReactKonva.Layer
      imageSmoothingEnabled={false}
      offset={offset}
      position={position}
    >
      {children}
    </ReactKonva.Layer>
  );
};
