import React from "react";
import { Dialog } from "@material-ui/core";

type SettingsDialogProps = {
  open: boolean;
};
export const SettingsDialog = ({ open }: SettingsDialogProps) => {
  return <Dialog open={open}></Dialog>;
};
