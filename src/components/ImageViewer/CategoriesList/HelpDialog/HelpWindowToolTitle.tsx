import { useStyles } from "./HelpDialog.css";
import Typography from "@material-ui/core/Typography";
import { KeyboardKey } from "./KeyboardKey";
import React from "react";
import { HelpWindowToolIcon } from "./HelpWindowToolIcons";
import { HandIcon, RectangularSelectionIcon } from "../../../icons";
import { DialogContent } from "@material-ui/core";

type ToolTitleProps = {
  toolName: string;
  letter: string;
  children: React.ReactNode;
};
export const HelpWindowToolTitle = ({
  children,
  toolName,
  letter,
}: ToolTitleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <HelpWindowToolIcon>{children}</HelpWindowToolIcon>
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
