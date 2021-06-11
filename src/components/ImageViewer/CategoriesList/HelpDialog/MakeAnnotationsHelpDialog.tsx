import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <DialogTitle>{"Make annotations"}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <br />
        <Typography>
          All annotation tools are accessed from the toolbar to the right of the
          canvas. Alternatively, use the corresponding keyboard shortcut, often
          corresponding to the first letter of the tool name, to quickly enter
          the tool.
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Elliptical annotation (e)</Typography>
        <Typography>
          Click and drag to start drawing an elliptical annotation. Release to
          close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation."
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
