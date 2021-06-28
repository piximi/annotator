import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { batch, useDispatch } from "react-redux";
import { applicationSlice } from "../../../../store";

type DeleteAllAnnotationsDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const DeleteAllAnnotationsDialog = ({
  onClose,
  open,
}: DeleteAllAnnotationsDialogProps) => {
  const dispatch = useDispatch();

  const onDelete = () => {
    batch(() => {
      dispatch(applicationSlice.actions.deleteAllInstances({ id: "" }));
      dispatch(
        applicationSlice.actions.setSelectedCategory({
          selectedCategory: "00000000-0000-0000-0000-000000000000",
        })
      );
    });

    onClose();
  };

  return (
    <Dialog disableBackdropClick={true} fullWidth onClose={onClose} open={open}>
      <DialogTitle>Delete all annotations?</DialogTitle>

      <DialogContent>
        All annotations across all images will be permanently deleted."
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={onDelete} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
