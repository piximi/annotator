import { useStyles } from "./HelpDialog.css";
import Typography from "@material-ui/core/Typography";
import { KeyboardKey } from "./KeyboardKey";
import React from "react";

type ToolTitleProps = {
  toolName: string;
  letter: string;
};
export const HelpWindowToolTitle = ({ toolName, letter }: ToolTitleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <Typography variant={"h6"}>{toolName}</Typography>
      <Typography variant={"h6"} style={{ marginLeft: "5px" }}>
        (
      </Typography>
      <KeyboardKey letter="shift" />
      <Typography>+</Typography>
      <KeyboardKey letter={letter} />
      <Typography variant={"h6"}>)</Typography>
    </div>
  );
};
