import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { CategoryType } from "../../../../types/CategoryType";
import { AnnotationType } from "../../../../types/AnnotationType";
import { applicationSlice } from "../../../../store";
import {
  imageInstancesSelector,
  selectedCategorySelector,
} from "../../../../store/selectors";

type DeleteCategoryDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const DeleteCategoryDialog = ({
  onClose,
  open,
}: DeleteCategoryDialogProps) => {
  const dispatch = useDispatch();

  const category = useSelector(selectedCategorySelector);

  const selections = useSelector(imageInstancesSelector);

  const onDelete = () => {
    dispatch(
      applicationSlice.actions.setSeletedCategory({
        selectedCategory: "00000000-0000-0000-0000-000000000000",
      })
    );

    dispatch(applicationSlice.actions.deleteCategory({ category: category }));

    const instances = selections?.map((instance: AnnotationType) => {
      if (instance.categoryId === category.id) {
        return {
          ...instance,
          categoryId: "00000000-0000-0000-0000-000000000000",
        };
      } else {
        return instance;
      }
    });

    dispatch(
      applicationSlice.actions.setImageInstances({
        instances: instances as Array<AnnotationType>,
      })
    );

    onClose();
  };

  return (
    <Dialog fullWidth onClose={onClose} open={open}>
      <DialogTitle>Delete "{category.name}" category?</DialogTitle>

      <DialogContent>
        Images categorized as "{category.name}" will not be deleted.
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
