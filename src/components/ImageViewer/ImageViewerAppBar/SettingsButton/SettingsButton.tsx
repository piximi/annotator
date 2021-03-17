import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { useStyles } from "../ExportButton/ExportButton.css";

export const SettingsButton = () => {
  const classes = useStyles();

  const onClick = () => {};

  return (
    <React.Fragment>
      <Tooltip title="Settings">
        <Button
          className={classes.button}
          startIcon={<SettingsIcon />}
          onClick={onClick}
        >
          Settings
        </Button>
      </Tooltip>
    </React.Fragment>
  );
};
