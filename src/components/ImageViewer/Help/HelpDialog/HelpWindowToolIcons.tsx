import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { useStyles } from "./HelpDialog.css";

type ToolProps = {
  children: React.ReactNode;
};
export const HelpWindowToolIcon = ({ children }: ToolProps) => {
  const classes = useStyles();
  return (
    <SvgIcon className={classes.icon} fontSize="small">
      {children}
    </SvgIcon>
  );
};
