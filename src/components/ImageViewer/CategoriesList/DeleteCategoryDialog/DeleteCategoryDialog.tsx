import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { CategoryType } from "../../../../types/CategoryType";
import { AnnotationType } from "../../../../types/AnnotationType";
import { slice } from "../../../../store";
import {
  imageInstancesSelector,
  selectedCategroySelector,
} from "../../../../store/selectors";

type DeleteCategoryDialogProps = {
  category: CategoryType;
  onClose: () => void;
  open: boolean;
};

export const DeleteCategoryDialog = ({
  category,
  onClose,
  open,
}: DeleteCategoryDialogProps) => {
  const dispatch = useDispatch();

  const activeCategory = useSelector(selectedCategroySelector);

  const selections = useSelector(imageInstancesSelector);

  const onDelete = () => {
    //change activeCategory if we are about to delete it
    if (activeCategory.id === category.id) {
      dispatch(
        slice.actions.setSeletedCategory({
          selectedCategory: "00000000-0000-0000-0000-000000000000",
        })
      );
    }

    dispatch(slice.actions.deleteCategory({ category: category }));

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
      slice.actions.setImageInstances({
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
