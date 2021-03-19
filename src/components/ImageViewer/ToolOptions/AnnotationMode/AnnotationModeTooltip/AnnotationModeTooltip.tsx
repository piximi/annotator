import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { Box } from "@material-ui/core";

type AnnotationModeTooltipProps = {
  children: React.ReactElement;
  content: React.ReactElement;
};

export const AnnotationModeTooltip = ({
  children,
  content,
}: AnnotationModeTooltipProps) => {
  return (
    <Tooltip
      title={
        <React.Fragment>
          <Box>{content}</Box>
        </React.Fragment>
      }
      placement="bottom"
    >
      {children}
    </Tooltip>
  );
};
