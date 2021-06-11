import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
        <br />
        <Typography variant={"h6"}>
          Selecting annotations with the Select tool (s)
        </Typography>
        <Typography>
          Select the Selection tool or press "s" on your keyboard to enter the
          selection tool. Click on a desired annotation to select it, and hold
          shift while clicking other annotations to select multiple annotations.
          Alternatively, draw a rectangular box around multiple annotations to
          select multiple annotations at once.
        </Typography>
        <br />
        <Typography>
          Click on "Select all" in the Selection tool menu to select all
          existing annotations. To select/unselect annotations of a specific
          category, toggle/untoggle the corresponding category in the Selection
          tool menu.
        </Typography>
        <br />
        <Typography>
          In the case of overlapping annotations, repeatedly click on the
          intersecting region of the overlapping annotations until the desired
          annotation is selected.
        </Typography>
        <br />
        <Typography>Press the Escape key to unselect annotations.</Typography>
        <br />
        <Typography variant={"h6"}>Resizing an annotation</Typography>
        <Typography>
          Once an annotation is selected, use the anchor points of the bouding
          box to resize it. Click "confirm" to save the resized annotation, or
          "cancel" to undo the resize event.
        </Typography>
        <br />
        <Typography variant={"h6"}>Adding area to an annotation</Typography>
        <Typography>
          Select the annotation tool to use to add an area and select the "add
          area" selection mode. Draw on the selected annotation with the
          annotation tool to combine areas together. Once finished annotating,
          press the "Enter key" or hit "confirm" to save the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>
          Subtracting an area from an annotation
        </Typography>
        <Typography>
          Select the annotation tool to use to subtract an area and select the
          "subtract area" selection mode. Draw on the selected annotation with
          the annotation tool to subtract an area from the selected annotation.
          Once finished annotating, press the "Enter key" or hit "confirm" to
          save the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Intersection of two annotations</Typography>
        <Typography>
          Select the annotation tool to use to use for the intersection
          operation and select the "intersect" selection mode. Draw on the
          selected annotation with the annotation tool and release to obtain the
          intersection of the two annotations. One finished annotating, press
          the "Enter key" or hit "confirm" to save the annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>
          Changing the category of an annotation
        </Typography>
        <Typography>
          To change the category, first select the annotation(s) and click on
          the desired category in the left toolbar. If the desired category does
          not exist, click "Create category" to make a new category.
        </Typography>
        <br />
        <Typography>
          Press the "Enter" key to save the selected annotations with the new
          category assigned.
        </Typography>
        <br />
        <Typography variant={"h6"}>Deleting selected annotations</Typography>
        <Typography>
          To delete one or more selected annotations, press the Delete key or
          click on "Clear selected annotations" in the left toolbar.
        </Typography>
        <br />
        <Typography variant={"h6"}>
          Deleting all annotations for a single image
        </Typography>
        <Typography>
          To clear annotations of a particular image, click on the menu to the
          right of the image thumbnail and select "Clear annotations."
        </Typography>
        <br />
        <Typography variant={"h6"}>Deleting all annotations</Typography>
        <Typography>
          Delete all annotations by clicking "Clear all annotations" in the left
          toolbar. WARNING: This will delete all annotations across all images
          loaded, not just the active image.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
