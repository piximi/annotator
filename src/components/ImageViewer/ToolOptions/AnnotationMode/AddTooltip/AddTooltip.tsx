import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

type AddTooltipProps = {
  children: React.ReactElement;
};

export const AddTooltip = ({ children }: AddTooltipProps) => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <p>Add area to the selected annotation.</p>
        </React.Fragment>
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};
