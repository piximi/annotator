import { HelpWindowToolTitle } from "../HelpDialog/HelpWindowToolTitle";
import { ColorAdjustmentIcon, HandIcon, ZoomIcon } from "../../../icons";
import Typography from "@material-ui/core/Typography";
import { DialogContent } from "@material-ui/core";
import React from "react";

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
