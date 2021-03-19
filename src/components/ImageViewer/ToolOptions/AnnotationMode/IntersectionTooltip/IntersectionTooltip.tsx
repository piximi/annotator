import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

type IntersectionTooltipProps = {
  children: React.ReactElement;
};

export const IntersectionTooltip = ({ children }: IntersectionTooltipProps) => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <p>
            Constrain the boundary of the new annotation to the selected
            annotation.
          </p>
        </React.Fragment>
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};
