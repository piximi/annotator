import React from "react";
import { Dialog, Select } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";

type SettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};
export const SettingsDialog = ({ onClose, open }: SettingsDialogProps) => {
  return (
    <Dialog fullWidth={true} maxWidth={"md"} onClose={onClose} open={open}>
      <DialogTitle id="max-width-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <form noValidate className="form-group form-inline">
          <FormControl>
            <Select
              autoFocus
              value={"english"}
              onChange={() => {}}
              inputProps={{
                name: "language",
                id: "language",
              }}
            >
              <MenuItem value="english">english</MenuItem>
              <MenuItem value="deutsch">deutsch</MenuItem>
              <MenuItem value="francais">francais</MenuItem>
            </Select>
          </FormControl>
        </form>
      </DialogContent>
    </Dialog>
  );
};
