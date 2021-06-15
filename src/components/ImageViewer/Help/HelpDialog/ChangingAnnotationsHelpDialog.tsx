import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { ChangingAnnotationsHelpContent } from "../HelpContent/HelpContent";

type ChangingAnnotationsHelpDiagogProps = {
  onClose: () => void;
  open: boolean;
};

export const ChangingAnnotationsHelpDialog = ({
  onClose,
  open,
}: ChangingAnnotationsHelpDiagogProps) => {
  return (
    <Dialog
      disableBackdropClick={true}
      fullWidth
      maxWidth="md"
      onClose={onClose}
      open={open}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <DialogTitle>{"Changing existing annotations"}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ChangingAnnotationsHelpContent />
      </DialogContent>
    </Dialog>
  );
};
