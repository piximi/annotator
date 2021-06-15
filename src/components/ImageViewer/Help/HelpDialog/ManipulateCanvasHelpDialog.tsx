import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { ManipulatingCanvasContent } from "../HelpContent/HelpContent";

type ManipulateCanvasHelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const ManipulateCanvasHelpDialog = ({
  onClose,
  open,
}: ManipulateCanvasHelpDialogProps) => {
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
            <DialogTitle>{"Manipulating the canvas"}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <ManipulatingCanvasContent />
      </DialogContent>
    </Dialog>
  );
};
