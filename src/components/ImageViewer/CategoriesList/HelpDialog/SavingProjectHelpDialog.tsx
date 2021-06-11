import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

type SavingProjectHelpDiagogProps = {
  onClose: () => void;
  open: boolean;
};

export const SavingProjectHelpDialog = ({
  onClose,
  open,
}: SavingProjectHelpDiagogProps) => {
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
            <DialogTitle>
              {"Saving project and exporting annotations"}
            </DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <br />
        <Typography variant={"h6"}>Saving a project</Typography>
        <Typography>
          Save all images and their annotations by clicking on "Save project
          file" in the Save menu on the left toolbar. This will download a .json
          file that encodes the image data and their annotations.
        </Typography>
        <br />
        <Typography variant={"h6"}>Opening a saved project</Typography>
        <Typography>
          To open a saved project and make new annotations or change
          annotations, Click "Open project file" in the Open menu on the left
          toolbar. Select the .json file that was downloaded when saving an
          earlier project.
        </Typography>
        <br />
        <Typography variant={"h6"}>Exporting all annotations</Typography>
        <Typography>
          It may be useful to export annotations as binary masks which can then
          be provided to subsequent machine learning pipelines. To export the
          annotations as binary png masks, click on "Export annotations" in the
          Save menu of the left toolbar. This will download a zip file.
          Unzipping the zip file will reveal one folder for each image in the
          project. Each folder includes a folder for each category. These
          folders, names by their category, include multiple png files: each
          annotation file is the mask for an annotated object.
        </Typography>
        <Typography variant={"h6"}>Exporting all annotations</Typography>
        <br />
        <Typography>
          To export annotations of a single image, click on the menu to the
          right of the image thumbnail and select "Export annotations." This
          will export the annotation masks, organized by their category, for the
          select image only.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};
