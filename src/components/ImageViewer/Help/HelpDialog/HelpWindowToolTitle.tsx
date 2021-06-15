import { useStyles } from "./HelpDialog.css";
import Typography from "@material-ui/core/Typography";
import { KeyboardKey } from "./KeyboardKey";
import React from "react";
import { HelpWindowToolIcon } from "./HelpWindowToolIcons";
import { Box } from "@material-ui/core";

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
      <Typography>
        <Box fontWeight="fontWeightBold">{toolName}</Box>
      </Typography>
      <Typography style={{ marginLeft: "5px" }}>(</Typography>
      <KeyboardKey letter="shift" />
      <Typography>+</Typography>
      <KeyboardKey letter={letter} />
      <Typography>)</Typography>
    </div>
  );
};
