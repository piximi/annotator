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
  icon?: any;
};
export const HelpWindowToolTitle = ({
  toolName,
  letter,
  icon,
}: ToolTitleProps) => {
  const classes = useStyles();

  const loaded = icon ? icon : <HandIcon />;

  return (
    <div className={classes.title}>
      <HelpWindowToolIcon>{loaded}</HelpWindowToolIcon>
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
