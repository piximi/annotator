import * as ReactKonva from "react-konva";
import React from "react";
import { useMarchingAnts } from "../../../../../../hooks";
import { useSelector } from "react-redux";

import { pointerSelectionSelector } from "../../../../../../store/selectors/pointerSelectionSelector";
import { toolTypeSelector } from "../../../../../../store/selectors";
import { ToolType } from "../../../../../../types/ToolType";

export const PointerSelection = () => {
  const dashOffset = useMarchingAnts();

  const toolType = useSelector(toolTypeSelector);

  const { minimum, maximum, selecting } = useSelector(pointerSelectionSelector);

  if (!minimum || !maximum || !selecting) return <React.Fragment />;

  if (toolType !== ToolType.Pointer) return <React.Fragment />;

  return (
    <React.Fragment>
      <ReactKonva.Rect
        dash={[4, 2]}
        dashOffset={-dashOffset}
        height={maximum.y - minimum.y}
        stroke="black"
        strokeWidth={1}
        width={maximum.x - minimum.x}
        x={minimum.x}
        y={minimum.y}
      />
    </React.Fragment>
  );
};
