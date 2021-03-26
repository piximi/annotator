import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { toolTypeSelector } from "../../../../../store/selectors";
import { useSelector } from "react-redux";
import { ToolType } from "../../../../../types/ToolType";
import { ColorAnnotationTool } from "../../../../../image/Tool";

type ColorAnnotationToolTipProps = {
  colorAnnotationTool: ColorAnnotationTool;
  scale: number;
};

export const ColorAnnotationToolTip = ({
  colorAnnotationTool,
  scale,
}: ColorAnnotationToolTipProps) => {
  const [position, setPosition] = useState<{
    x: number;
    y: number | undefined;
  }>();
  const [text, setText] = useState<string>("Tolerance: 0%");
  const toolType = useSelector(toolTypeSelector);

  useEffect(() => {
    if (
      !colorAnnotationTool ||
      !colorAnnotationTool.annotating ||
      !colorAnnotationTool.toolTipPosition
    )
      return;

    setPosition(colorAnnotationTool.toolTipPosition);
    setText(`Tolerance: ${colorAnnotationTool.tolerance}`);
  }, [colorAnnotationTool?.toolTipPosition]);

  if (toolType !== ToolType.ColorAnnotation) return <React.Fragment />;

  if (
    !colorAnnotationTool ||
    !colorAnnotationTool.annotating ||
    colorAnnotationTool.annotated
  )
    return <React.Fragment />;

  if (!position) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        points={[
          position.x,
          position.y!,
          colorAnnotationTool.initialPosition.x,
          colorAnnotationTool.initialPosition.y,
        ]}
        strokeWidth={1}
        stroke="white"
      />
      <ReactKonva.Label position={position} opacity={0.75}>
        <ReactKonva.Tag fill={"black"} />
        <ReactKonva.Text
          fill={"white"}
          fontSize={12 / scale}
          padding={5 / scale}
          text={text}
        />
      </ReactKonva.Label>
    </ReactKonva.Group>
  );
};
