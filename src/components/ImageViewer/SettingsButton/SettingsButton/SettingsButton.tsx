import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { SettingsDialog } from "../SettingsDialog";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useStyles } from "./SettingsButton.css";

export const SettingsButton = () => {
  const classes = useStyles();

  const [openSettingsDialog, setOpenSettingsDialog] = useState<boolean>(false);

  const onSettingsClick = () => {
    setOpenSettingsDialog(true);
  };

  const onSettingsDialogClose = () => {
    setOpenSettingsDialog(false);
  };

  const t = useTranslation();

  return (
    <React.Fragment>
      <Tooltip title={t("Settings")}>
        <Button
          className={classes.button}
          startIcon={<SettingsIcon />}
          onClick={onSettingsClick}
        >
          {t("Settings")}
        </Button>
      </Tooltip>
      <SettingsDialog
        open={openSettingsDialog}
        onClose={onSettingsDialogClose}
      />
    </React.Fragment>
  );
};
