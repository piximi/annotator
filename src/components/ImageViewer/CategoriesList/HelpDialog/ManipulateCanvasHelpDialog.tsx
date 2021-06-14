import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { HelpWindowToolTitle } from "./HelpWindowToolTitle";

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
        <br />
        <HelpWindowToolTitle toolName={"Hand tool"} letter={"H"} />
        <Typography>
          Select the Hand tool. Hold and drag to pan the image in the canvas.
          Click on "Reset position" to center the image back onto the canvas.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Zoom tool"} letter={"Z"} />
        <Typography>
          Select the Zoom tool. Use the zoom slider or your mouse wheel to zoom
          in or out of the image.
        </Typography>
        <br />
        <Typography>
          To zoom in a particular region of the image, first unselect
          "Auto-center" and then use your mouse to select the rectangular region
          in which you would like to zoom in. Release the mouse to zoom in the
          selected region.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Intensity adjustment"} letter={"I"} />
        <Typography>
          Select the Intensity adjustment tool. Filter each color channel by
          setting new minimum and maximum for each color channel. Untoggle a
          channel box to disable the channel. Click on "Reset" to reset the
          intensities to their original values.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
