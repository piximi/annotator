import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import { useStyles } from "./OperationOptions.css";

type OperationOptionsProps = {
  settings: React.ReactNode;
};

export const OperationOptions = ({ settings }: OperationOptionsProps) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      className={classes.options}
      classes={{ paper: classes.settingsPaper }}
      variant="permanent"
    >
      <div className={classes.settingsToolbar} />

      <Divider />

      {settings}
    </Drawer>
  );
};
