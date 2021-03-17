import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { useStyles } from "../../ExportButton/ExportButton.css";
import { SettingsDialog } from "../SettingsDialog/SettingsDialog";

export const SettingsButton = () => {
  const classes = useStyles();

  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);

  const onSettingsClick = () => {
    setOpenSettingsDialog(true);
  };

  const onSettingsDialogClose = () => {
    setOpenSettingsDialog(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Settings">
        <Button
          className={classes.button}
          startIcon={<SettingsIcon />}
          onClick={onSettingsClick}
        >
          Settings
        </Button>
      </Tooltip>
      <SettingsDialog
        open={openSettingsDialog}
        onClose={onSettingsDialogClose}
      />
    </React.Fragment>
  );
};
