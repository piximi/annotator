import React from "react";
import { Selection } from "../Stage/Selection";
import { ToolType } from "../../../../types/ToolType";
import { AnnotationTool } from "../../../../image/Tool/AnnotationTool/AnnotationTool";
import { ZoomTool } from "../../../../image/Tool/ZoomTool";
import { useSelector } from "react-redux";
import { annotatedSelector } from "../../../../store/selectors/annotatedSelector";
import { toolTypeSelector } from "../../../../store/selectors";

type SelectingProps = {
  annotationTool?: AnnotationTool;
  scale: number;
  zoomTool?: ZoomTool;
};

export const Selecting = ({
  annotationTool,
  scale,
  zoomTool,
}: SelectingProps) => {
  const annotated = useSelector(annotatedSelector);

  const toolType = useSelector(toolTypeSelector);

  if (annotated) return <React.Fragment />;

  return (
    <React.Fragment>
      {toolType !== ToolType.Zoom && (
        <Selection scale={scale} tool={annotationTool} toolType={toolType} />
      )}

      {toolType === ToolType.Zoom && (
        <Selection scale={scale} tool={zoomTool} toolType={toolType} />
      )}
    </React.Fragment>
  );
};
