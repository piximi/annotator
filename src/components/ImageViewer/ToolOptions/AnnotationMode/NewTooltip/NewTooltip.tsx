import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

type NewTooltipProps = {
  children: React.ReactElement;
};

export const NewTooltip = ({ children }: NewTooltipProps) => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <p>Create a new annotation.</p>
        </React.Fragment>
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};
