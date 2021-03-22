import * as ReactKonva from "react-konva";
import React from "react";
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
  const toolType = useSelector(toolTypeSelector);

  if (toolType !== ToolType.ColorAnnotation) return <React.Fragment />;

  if (!colorAnnotationTool || !colorAnnotationTool.toolTipPosition)
    return <React.Fragment />;

  return (
    <ReactKonva.Text
      position={colorAnnotationTool.toolTipPosition}
      stroke={"white"}
      text={"Tolerance"}
    />
  );
};
