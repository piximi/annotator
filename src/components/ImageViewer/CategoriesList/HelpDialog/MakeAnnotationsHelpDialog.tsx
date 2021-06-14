import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";

type MakeAnnotationsHelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

const useStyles = makeStyles((theme) => ({
  kbd: {
    backgroundColor: "rgba(237, 242, 247, 1)",
    borderWidth: "1px 1px 3px",
    borderRadius: "6px",
    fontSize: "0.8em",
    paddingInline: "0.4em",
    whiteSpace: "nowrap",
    fontWeight: 700,
    borderColor: "rgba(184, 186, 189, 1)",
    borderStyle: "solid",
    color: "rgba(45, 55, 72, 1)",
    width: "fit-content",
    lineHeight: "revert",
    marginLeft: "5px",
    marginRight: "5px",
  },
  title: {
    display: "flex",
    alignItems: "center",
  },
}));

type KeyboardKeyProps = {
  letter: string;
};
const KeyboardKey = ({ letter }: KeyboardKeyProps) => {
  const classes = useStyles();

  return <div className={classes.kbd}>{letter}</div>;
};

type ToolTitleProps = {
  toolName: string;
  letter: string;
};
const ToolTitle = ({ toolName, letter }: ToolTitleProps) => {
  const classes = useStyles();

  return (
    <div className={classes.title}>
      <Typography variant={"h6"}>{toolName}</Typography>
      <Typography variant={"h6"} style={{ marginLeft: "5px" }}>
        (
      </Typography>
      <KeyboardKey letter="shift" />
      <Typography>+</Typography>
      <KeyboardKey letter={letter} />
      <Typography variant={"h6"}>)</Typography>
    </div>
  );
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
          canvas or by using their keyboard key shortcut.
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
        <ToolTitle toolName={"Rectangular annotation"} letter={"R"} />
        <Typography>
          Click and drag to start drawing a rectangular annotation (bounding
          box). Release to close the annotation.
        </Typography>
        <br />
        <ToolTitle toolName={"Elliptical annotation"} letter={"E"} />
        <Typography>
          Click and drag to start drawing an elliptical annotation. Release to
          close the annotation.
        </Typography>
        <br />
        <ToolTitle toolName={"Pen annotation"} letter={"D"} />
        <Typography>
          Select desired brush size using the brush size slider. Draw over
          pixels by clicking and dragging over the desired area. Release to
          close the annotation.
        </Typography>
        <br />
        <ToolTitle toolName={"Lasso annotation"} letter={"L"} />
        <Typography>
          Click and drag cursor around the desired region. Release to
          automatically close the lasso annotation.
        </Typography>
        <br />
        <ToolTitle toolName={"Polygonal annotation"} letter={"P"} />
        <Typography>
          Click and release to create new anchor points. Close the polygonal
          annotation either by clicking on its origin point or by hitting enter
          on your keyboard.
        </Typography>
        <br />
        <ToolTitle toolName={"Magnetic annotation"} letter={"M"} />
        <Typography>
          Click and release to create new anchor points. The tool will
          automatically snap onto the edges of an object. Close the magnetic
          annotation by clicking on its origin point.
        </Typography>
        <br />
        <ToolTitle toolName={"Color annotation"} letter={"C"} />
        <Typography>
          Click on a pixel with the color of interest, hold and drag outwards to
          select a region of similar color intensities near the point. Release
          to finish the annotation.
        </Typography>
        <br />
        <ToolTitle toolName={"Quick annotation"} letter={"Q"} />
        <Typography>
          Click and drag to select a region of superpixels. Release to finish
          the annotation.
        </Typography>
        <br />
      </DialogContent>
    </Dialog>
  );
};
