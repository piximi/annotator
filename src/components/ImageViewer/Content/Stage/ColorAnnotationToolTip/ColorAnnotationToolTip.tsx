import * as ReactKonva from "react-konva";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { toolTypeSelector } from "../../../../../store/selectors";
import { useSelector } from "react-redux";
import { ToolType } from "../../../../../types/ToolType";
import { ColorAnnotationTool } from "../../../../../image/Tool/AnnotationTool/ColorAnnotationTool";
import Konva from "konva";

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
  const toolType = useSelector(toolTypeSelector);

  useEffect(() => {
    if (
      !colorAnnotationTool ||
      !colorAnnotationTool.annotating ||
      !colorAnnotationTool.toolTipPosition
    )
      return;

    setPosition(colorAnnotationTool.toolTipPosition);
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
    <ReactKonva.Text position={position} stroke={"white"} text={"Tolerance"} />
  );
};
