import React from "react";
import { Selection } from "../Selection";
import { useSelector } from "react-redux";
import { annotatedSelector } from "../../../../../store/selectors/annotatedSelector";
import { toolTypeSelector } from "../../../../../store/selectors";
import { Tool } from "../../../../../image/Tool";

type SelectingProps = {
  imagePosition: { x: number; y: number };
  tool: Tool;
};

export const Selecting = ({ imagePosition, tool }: SelectingProps) => {
  const annotated = useSelector(annotatedSelector);

  const toolType = useSelector(toolTypeSelector);

  if (annotated) return <React.Fragment />;

  return (
    <React.Fragment>
      <Selection
        imagePosition={imagePosition}
        tool={tool}
        toolType={toolType}
      />
    </React.Fragment>
  );
};
