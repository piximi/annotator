import React from "react";
import Tooltip from "@material-ui/core/Tooltip";

type SubtractTooltipProps = {
  children: React.ReactElement;
};

export const SubtractTooltip = ({ children }: SubtractTooltipProps) => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <p>Subtract area from the selected annotation.</p>
        </React.Fragment>
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};
