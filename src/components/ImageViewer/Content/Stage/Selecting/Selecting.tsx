import React from "react";
import { Selection } from "../Selection";
import { useSelector } from "react-redux";
import { annotatedSelector } from "../../../../../store/selectors/annotatedSelector";
import { toolTypeSelector } from "../../../../../store/selectors";
import { Tool } from "../../../../../image/Tool";

type SelectingProps = {
  tool: Tool;
  scale: number;
  stageScale: { x: number; y: number };
};

export const Selecting = ({ scale, stageScale, tool }: SelectingProps) => {
  const annotated = useSelector(annotatedSelector);

  const toolType = useSelector(toolTypeSelector);

  if (annotated) return <React.Fragment />;

  return (
    <React.Fragment>
      <Selection
        scale={scale}
        stageScale={stageScale}
        tool={tool}
        toolType={toolType}
      />
    </React.Fragment>
  );
};
