import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { MakingNewAnnotationsHelpContent } from "../HelpContent/HelpContent";

type MakeAnnotationsHelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const MakeAnnotationsHelpDialog = ({
  onClose,
  open,
}: MakeAnnotationsHelpDialogProps) => {
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
          <Typography variant={"h6"}>
            Creating new categories and editting categories
          </Typography>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <DialogTitle>{"Making new annotations"}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <MakingNewAnnotationsHelpContent />
      </DialogContent>
    </Dialog>
  );
};
