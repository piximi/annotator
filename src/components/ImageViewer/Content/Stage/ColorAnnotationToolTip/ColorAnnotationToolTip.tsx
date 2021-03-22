import * as ReactKonva from "react-konva";
import React, { useEffect, useRef, useState } from "react";
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
  const colorAnnotationToolTipRef = useRef<Konva.Layer | null>(null);

  const [position, setPosition] = useState<{
    x: number;
    y: number | undefined;
  }>();

  const toolType = useSelector(toolTypeSelector);

  useEffect(() => {
    if (toolType !== ToolType.ColorAnnotation) return;

    if (!colorAnnotationTool || !colorAnnotationTool.toolTipPosition) return;

    if (!colorAnnotationToolTipRef || !colorAnnotationToolTipRef.current)
      return;

    setPosition(colorAnnotationTool.toolTipPosition);

    colorAnnotationToolTipRef.current.batchDraw();
  }, [colorAnnotationTool?.toolTipPosition]);

  if (!position) return <React.Fragment />;

  return (
    <ReactKonva.Layer ref={colorAnnotationToolTipRef}>
      <ReactKonva.Text
        position={position}
        stroke={"white"}
        text={"Tolerance"}
      />
    </ReactKonva.Layer>
  );
};
