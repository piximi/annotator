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
    if (toolType !== ToolType.ColorAnnotation) return;

    if (!colorAnnotationTool || !colorAnnotationTool.toolTipPosition) return;

    setPosition(colorAnnotationTool.toolTipPosition);
  }, [colorAnnotationTool?.toolTipPosition]);

  if (!position) return <React.Fragment />;

  return (
    <ReactKonva.Text
      position={colorAnnotationTool.toolTipPosition}
      stroke={"white"}
      text={"Tolerance"}
    />
  );
};
