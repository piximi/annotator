import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { toolTypeSelector } from "../../../../../store/selectors";
import { useSelector } from "react-redux";
import { ToolType } from "../../../../../types/ToolType";
import { ColorAnnotationTool } from "../../../../../image/Tool/AnnotationTool/ColorAnnotationTool";

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

  useEffect(() => {
    if (
      !colorAnnotationTool ||
      !colorAnnotationTool.annotating ||
      !colorAnnotationTool.toolTipPosition
    )
      return;

    setPosition(colorAnnotationTool.toolTipPosition);
    setText(`Tolerance: ${colorAnnotationTool.tolerance}%`);
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
    <ReactKonva.Label position={position} opacity={0.75}>
      <ReactKonva.Tag fill={"black"} />
      <ReactKonva.Text fill={"white"} padding={5} text={text} />
    </ReactKonva.Label>
  );
};
