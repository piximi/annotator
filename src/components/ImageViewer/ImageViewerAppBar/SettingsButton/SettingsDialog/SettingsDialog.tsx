import React from "react";
import { Dialog } from "@material-ui/core";

type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};
export const SettingsDialog = ({ onClose, open }: SettingsDialogProps) => {
  return <Dialog onClose={onClose} open={open}></Dialog>;
};
