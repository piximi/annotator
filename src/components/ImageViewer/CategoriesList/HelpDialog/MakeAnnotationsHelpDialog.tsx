import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { HelpWindowToolTitle } from "./HelpWindowToolTitle";
import { KeyboardKey } from "./KeyboardKey";
import SvgIcon from "@material-ui/core/SvgIcon";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { HandIcon, RectangularSelectionIcon } from "../../../icons";
import ListItem from "@material-ui/core/ListItem";
import { HelpWindowToolIcon } from "./HelpWindowToolIcons";

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
        <br />
        <Typography>
          Create a new category by clicking on the "Create category" button.
          Once a category is created, its name and color can be changed by
          selecting its options menu on the right on the category menu in the
          left toobar.
        </Typography>
        <br />
        <Typography>
          All annotation tools are accessed from the toolbar to the right of the
          canvas or by using their keyboard key shortcut.
        </Typography>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>Once you an annotation is completed, press</Typography>
          <KeyboardKey letter="enter" />
          <Typography>on your keyboard or click on "confirm".</Typography>
        </div>
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography>To undo an unconfirmed annotation, press</Typography>
          <KeyboardKey letter="escape" />
          <Typography>on your keyboard or click on "cancel".</Typography>
        </div>
        <br />
        <HelpWindowToolTitle toolName={"Rectangular annotation"} letter={"R"} />
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Elliptical annotation"} letter={"E"} />
        <Typography>
          Click and drag to start drawing an elliptical annotation. Release to
          close the annotation.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Pen annotation"} letter={"D"} />
        <Typography>
          Select desired brush size using the brush size slider. Draw over
          pixels by clicking and dragging over the desired area. Release to
          close the annotation.
        </Typography>
        <br />

        <HelpWindowToolTitle toolName={"Lasso annotation"} letter={"L"} />
        <Typography>
          Click and drag cursor around the desired region. Release to
          automatically close the lasso annotation.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Polygonal annotation"} letter={"P"} />
        <Typography>
          Click and release to create new anchor points. Close the polygonal
          annotation either by clicking on its origin point or by hitting enter
          on your keyboard.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Magnetic annotation"} letter={"M"} />
        <Typography>
          Click and release to create new anchor points. The tool will
          automatically snap onto the edges of an object. Close the magnetic
          annotation by clicking on its origin point.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Color annotation"} letter={"C"} />
        <Typography>
          Click on a pixel with the color of interest, hold and drag outwards to
          select a region of similar color intensities near the point. Release
          to finish the annotation.
        </Typography>
        <br />
        <HelpWindowToolTitle toolName={"Quick annotation"} letter={"Q"} />
        <Typography>
          Click and drag to select a region of superpixels. Release to finish
          the annotation.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
