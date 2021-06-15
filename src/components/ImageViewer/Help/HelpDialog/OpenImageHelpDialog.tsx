import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

type OpenImageHelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const OpenImageHelpDialog = ({
  onClose,
  open,
}: OpenImageHelpDialogProps) => {
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
            <DialogTitle>{"Opening images"}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <br />
        <Typography variant={"h6"}>Opening images</Typography>
        <Typography>
          In the left menu, select "Open new image" to select one or multiple
          image files to open.
        </Typography>
        <br />
        <Typography>
          Alternatively, drag and drop the desired image files directly onto the
          canvas.
        </Typography>
        <br />
        <Typography>
          Note that we currently only support 1-channel (grayscale) or 3-channel
          2D images. We do not support multi-dimensional images.
        </Typography>
        <br />
        <Typography variant={"h6"}>Deleting images</Typography>
        <Typography>
          Images can be deleted from the workspace at any time by selecting
          "Delete image" on the menu options next to the image thumbnail.
        </Typography>
        <br />
        <Typography variant={"h6"}>Example pre-annotated images</Typography>
        <Typography>
          Take a look at our pre-annotated images by clicking "Open example
          image" and selecting the image of choice!
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
