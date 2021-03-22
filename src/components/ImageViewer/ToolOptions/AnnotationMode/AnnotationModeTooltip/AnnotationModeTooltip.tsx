import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { Box } from "@material-ui/core";
import { useStyles } from "./AnnotationModeTooltip.css";

type AnnotationModeTooltipProps = {
  children: React.ReactElement;
  content: React.ReactElement;
};

export const AnnotationModeTooltip = ({
  children,
  content,
}: AnnotationModeTooltipProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={<Box>{content}</Box>} placement="bottom">
      {children}
    </Tooltip>
  );
};
