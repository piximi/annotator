import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { KeyboardKey } from "./KeyboardKey";
import { HelpWindowToolTitle } from "./HelpWindowToolTitle";
import { SelectionIcon } from "../../../icons";

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
        <HelpWindowToolTitle
          toolName={"Selecting annotations with the Select tool"}
          letter={"S"}
        >
          <SelectionIcon />
        </HelpWindowToolTitle>
        <Typography>
          Select the Selection tool. Click on a desired annotation to select it,
          and hold shift while clicking other annotations to select multiple
          annotations. Alternatively, draw a rectangular box around multiple
          annotations to select multiple annotations at once.
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>Press the</Typography>
          <KeyboardKey letter="escape" />
          <Typography>
            {" "}
            key to undo changes or to unselect annotations.
          </Typography>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>Press the</Typography>
          <KeyboardKey letter="enter" />
          <Typography>
            {" "}
            key to confirm changes to a selected annotation.
          </Typography>
        </div>
        <br />
        <Typography variant={"h6"}>Resizing an annotation</Typography>
        <Typography>
          Once an annotation is selected, use the anchor points of the bouding
          box to resize it.
        </Typography>
        <br />
        <Typography variant={"h6"}>Adding area to an annotation</Typography>
        <Typography>
          Select the annotation tool to use to add an area and select the "add
          area" selection mode. Draw on the selected annotation with the
          annotation tool to combine areas together.
        </Typography>
        <br />
        <Typography variant={"h6"}>
          Subtracting an area from an annotation
        </Typography>
        <Typography>
          Select the annotation tool to use to subtract an area and select the
          "subtract area" selection mode. Draw on the selected annotation with
          the annotation tool to subtract an area from the selected annotation.
        </Typography>
        <br />
        <Typography variant={"h6"}>Intersection of two annotations</Typography>
        <Typography>
          Select the annotation tool to use to use for the intersection
          operation and select the "intersect" selection mode. Draw on the
          selected annotation with the annotation tool and release to obtain the
          intersection of the two annotations.
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>Make sure to press the</Typography>
          <KeyboardKey letter="enter" />
          <Typography>
            {" "}
            key to save the selected annotations with the new category assigned.
          </Typography>
        </div>
        <br />
        <Typography variant={"h6"}>Deleting selected annotations</Typography>
        <Typography>
          First, use the Select tool to select annotations. To delete one or
          more selected annotations, press the Delete key or click on "Clear
          selected annotations" in the left toolbar.
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
