import React from "react";
import { ToolType } from "../../../../../types/ToolType";
import * as ReactKonva from "react-konva";
import { useSelector } from "react-redux";
import { currentPositionSelector } from "../../../../../store/selectors/currentPositionSelector";
import { AnnotationTool } from "../../../../../image/Tool/AnnotationTool/AnnotationTool";
import { toolTypeSelector } from "../../../../../store/selectors";
import { penSelectionBrushSizeSelector } from "../../../../../store/selectors/penSelectionBrushSizeSelector";

type PenAnnotationToolTipProps = {
  annotationTool?: AnnotationTool;
};
export const PenAnnotationToolTip = ({
  annotationTool,
}: PenAnnotationToolTipProps) => {
  const currentPosition = useSelector(currentPositionSelector);

  const toolType = useSelector(toolTypeSelector);

  const penSelectionBrushSize = useSelector(penSelectionBrushSizeSelector);

  if (
    !currentPosition ||
    !annotationTool ||
    annotationTool.annotating ||
    toolType !== ToolType.PenAnnotation
  )
    return <React.Fragment />;

  return (
    <ReactKonva.Ellipse
      radiusX={penSelectionBrushSize}
      radiusY={penSelectionBrushSize}
      x={currentPosition.x}
      y={currentPosition.y}
      stroke="grey"
      strokewidth={1}
      dash={[2, 2]}
    />
  );
};
