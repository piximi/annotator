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
      maxWidth="md"
      onClose={onClose}
      open={open}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <DialogTitle>{"Making new annotations"}</DialogTitle>
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
        <Typography>
          Once you an annotation is completed, press "Enter" on your keyboard or
          click on "confirm".
        </Typography>
        <br />
        <Typography>
          To undo an unconfirmed annotation, press "Escape" on your keyboard or
          click on "cancel".
        </Typography>
        <br />
        <Typography variant={"h6"}>Rectangular annotation (r)</Typography>
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Elliptical annotation (e)</Typography>
        <Typography>
          Click and drag to start drawing an elliptical annotation. Release to
          close the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Pen annotation (d)</Typography>
        <Typography>
          Select desired brush size using the brush size slider. Draw over
          pixels by clicking and dragging over the desired area. Release to
          close the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Lasso annotation (l)</Typography>
        <Typography>
          Click and drag cursor around the desired region. Release to
          automatically close the lasso annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Polygonal annotation (p)</Typography>
        <Typography>
          Click and release to create new anchor points. Close the polygonal
          annotation either by clicking on its origin point or by hitting enter
          on your keyboard.
        </Typography>
        <br />
        <Typography variant={"h6"}>Magnetic annotation (m)</Typography>
        <Typography>
          Click and release to create new anchor points. The tool will
          automatically snap onto the edges of an object. Close the magnetic
          annotation by clicking on its origin point.
        </Typography>
        <br />
        <Typography variant={"h6"}>Color annotation (c)</Typography>
        <Typography>
          Click on a pixel with the color of interest, hold and drag outwards to
          select a region of similar color intensities near the point. Release
          to finish the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Quick annotation (q)</Typography>
        <Typography>
          Click and drag to select a region of superpixels. Release to finish
          the annotation.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
