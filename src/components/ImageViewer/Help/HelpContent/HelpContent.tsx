import { HelpWindowToolTitle } from "../HelpDialog/HelpWindowToolTitle";
import {
  ColorAdjustmentIcon,
  ColorSelectionIcon,
  EllipticalSelectionIcon,
  HandIcon,
  LassoSelectionIcon,
  MagneticSelectionIcon,
  PenSelectionIcon,
  PolygonalSelectionIcon,
  QuickSelectionIcon,
  RectangularSelectionIcon,
  SelectionIcon,
  ZoomIcon,
} from "../../../icons";
import Typography from "@material-ui/core/Typography";
import { DialogContent } from "@material-ui/core";
import React from "react";
import { KeyboardKey } from "../HelpDialog/KeyboardKey";

export const ManipulatingCanvasContent = () => {
  return (
    <React.Fragment>
      <br />
      <HelpWindowToolTitle toolName={"Hand tool"} letter={"H"}>
        <HandIcon />
      </HelpWindowToolTitle>
      <Typography>
        Select the Hand tool. Hold and drag to pan the image in the canvas.
        Click on "Reset position" to center the image back onto the canvas.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Zoom tool"} letter={"Z"}>
        <ZoomIcon />
      </HelpWindowToolTitle>
      <Typography>
        Select the Zoom tool. Use the zoom slider or your mouse wheel to zoom in
        or out of the image.
      </Typography>
      <br />
      <Typography>
        To zoom in a particular region of the image, first unselect
        "Auto-center" and then use your mouse to select the rectangular region
        in which you would like to zoom in. Release the mouse to zoom in the
        selected region.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Intensity adjustment"} letter={"I"}>
        <ColorAdjustmentIcon />
      </HelpWindowToolTitle>
      <Typography>
        Select the Intensity adjustment tool. Filter each color channel by
        setting new minimum and maximum for each color channel. Untoggle a
        channel box to disable the channel. Click on "Reset" to reset the
        intensities to their original values.
      </Typography>
      <br />
    </React.Fragment>
  );
};

export const OpeningImagesHelpContent = () => {
  return (
    <React.Fragment>
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
        Take a look at our pre-annotated images by clicking "Open example image"
        and selecting the image of choice!
      </Typography>
      <br />
    </React.Fragment>
  );
};

export const MakingNewAnnotationsHelpContent = () => {
  return (
    <React.Fragment>
      <br />
      <Typography>
        Create a new category by clicking on the "Create category" button. Once
        a category is created, its name and color can be changed by selecting
        its options menu on the right on the category menu in the left toobar.
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
      <HelpWindowToolTitle toolName={"Rectangular annotation"} letter={"R"}>
        <RectangularSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and drag to start drawing a rectangular annotation (bounding box).
        Release to close the annotation.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Elliptical annotation"} letter={"E"}>
        <EllipticalSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and drag to start drawing an elliptical annotation. Release to
        close the annotation.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Pen annotation"} letter={"D"}>
        <PenSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Select desired brush size using the brush size slider. Draw over pixels
        by clicking and dragging over the desired area. Release to close the
        annotation.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Lasso annotation"} letter={"L"}>
        <LassoSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and drag cursor around the desired region. Release to
        automatically close the lasso annotation.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Polygonal annotation"} letter={"P"}>
        <PolygonalSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and release to create new anchor points. Close the polygonal
        annotation either by clicking on its origin point or by hitting enter on
        your keyboard.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Magnetic annotation"} letter={"M"}>
        <MagneticSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and release to create new anchor points. The tool will
        automatically snap onto the edges of an object. Close the magnetic
        annotation by clicking on its origin point.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Color annotation"} letter={"C"}>
        <ColorSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click on a pixel with the color of interest, hold and drag outwards to
        select a region of similar color intensities near the point. Release to
        finish the annotation.
      </Typography>
      <br />
      <HelpWindowToolTitle toolName={"Quick annotation"} letter={"Q"}>
        <QuickSelectionIcon />
      </HelpWindowToolTitle>
      <Typography>
        Click and drag to select a region of superpixels. Release to finish the
        annotation.
      </Typography>
      <br />
    </React.Fragment>
  );
};

export const ChangingAnnotationsHelpContent = () => {
  return (
    <React.Fragment>
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
        Click on "Select all" in the Selection tool menu to select all existing
        annotations. To select/unselect annotations of a specific category,
        toggle/untoggle the corresponding category in the Selection tool menu.
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
        Once an annotation is selected, use the anchor points of the bouding box
        to resize it.
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
        "subtract area" selection mode. Draw on the selected annotation with the
        annotation tool to subtract an area from the selected annotation.
      </Typography>
      <br />
      <Typography variant={"h6"}>Intersection of two annotations</Typography>
      <Typography>
        Select the annotation tool to use to use for the intersection operation
        and select the "intersect" selection mode. Draw on the selected
        annotation with the annotation tool and release to obtain the
        intersection of the two annotations.
      </Typography>
      <br />
      <Typography variant={"h6"}>
        Changing the category of an annotation
      </Typography>
      <Typography>
        To change the category, first select the annotation(s) and click on the
        desired category in the left toolbar. If the desired category does not
        exist, click "Create category" to make a new category.
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
        First, use the Select tool to select annotations. To delete one or more
        selected annotations, press the Delete key or click on "Clear selected
        annotations" in the left toolbar.
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
    </React.Fragment>
  );
};

export const SavingProjectHelpContent = () => {
  return (
    <React.Fragment>
      <br />
      <Typography variant={"h6"}>Saving a project</Typography>
      <Typography>
        Save all images and their annotations by clicking on "Save project file"
        in the Save menu on the left toolbar. This will download a .json file
        that encodes the image data and their annotations.
      </Typography>
      <br />
      <Typography variant={"h6"}>Opening a saved project</Typography>
      <Typography>
        To open a saved project and make new annotations or change annotations,
        Click "Open project file" in the Open menu on the left toolbar. Select
        the .json file that was downloaded when saving an earlier project.
      </Typography>
      <br />
      <Typography variant={"h6"}>Exporting all annotations</Typography>
      <Typography>
        It may be useful to export annotations as binary masks which can then be
        provided to subsequent machine learning pipelines. To export the
        annotations as binary png masks, click on "Export annotations" in the
        Save menu of the left toolbar. This will download a zip file. Unzipping
        the zip file will reveal one folder for each image in the project. Each
        folder includes a folder for each category. These folders, names by
        their category, include multiple png files: each annotation file is the
        mask for an annotated object.
      </Typography>
      <br />
      <Typography variant={"h6"}>
        Exporting annotations of a single image
      </Typography>
      <Typography>
        To export annotations of a single image, click on the menu to the right
        of the image thumbnail and select "Export annotations." This will export
        the annotation masks, organized by their category, for the select image
        only.
      </Typography>
    </React.Fragment>
  );
};
