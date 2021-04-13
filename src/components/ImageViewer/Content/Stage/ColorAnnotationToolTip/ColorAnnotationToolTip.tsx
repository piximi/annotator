import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import {
  stageScaleSelector,
  toolTypeSelector,
} from "../../../../../store/selectors";
import { useSelector } from "react-redux";
import { ToolType } from "../../../../../types/ToolType";
import { ColorAnnotationTool } from "../../../../../image/Tool";

type ColorAnnotationToolTipProps = {
  colorAnnotationTool: ColorAnnotationTool;
};

export const ColorAnnotationToolTip = ({
  colorAnnotationTool,
}: ColorAnnotationToolTipProps) => {
  const [position, setPosition] = useState<{
    x: number;
    y: number | undefined;
  }>();
  const [text, setText] = useState<string>("Tolerance: 0%");
  const toolType = useSelector(toolTypeSelector);

  const stageScale = useSelector(stageScaleSelector);

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

  if (!position || !position.x || !position.y) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Line
        points={[
          position.x,
          position.y!,
          colorAnnotationTool.initialPosition.x,
          colorAnnotationTool.initialPosition.y,
        ]}
        scale={{ x: stageScale, y: stageScale }}
        strokeWidth={1}
        stroke="white"
      />
      <ReactKonva.Label
        position={{ x: position.x * stageScale, y: position.y * stageScale }}
        opacity={0.75}
      >
        <ReactKonva.Tag fill={"black"} />
        <ReactKonva.Text fill={"white"} fontSize={12} padding={5} text={text} />
      </ReactKonva.Label>
    </ReactKonva.Group>
  );
};
