import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../store";
import { selectedCategorySelector } from "../../../../store/selectors";

type ClearCategoryDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const ClearCategoryDialog = ({
  onClose,
  open,
}: ClearCategoryDialogProps) => {
  const dispatch = useDispatch();

  const category = useSelector(selectedCategorySelector);

  const onClear = () => {
    dispatch(
      applicationSlice.actions.clearCategoryAnnotations({ category: category })
    );

    onClose();
  };

  return (
    <Dialog disableBackdropClick={true} fullWidth onClose={onClose} open={open}>
      <DialogTitle>Clear "{category.name}" annotations?</DialogTitle>

      <DialogContent>
        Annotations categorized as "{category.name}" will be deleted".
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={onClear} color="primary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
