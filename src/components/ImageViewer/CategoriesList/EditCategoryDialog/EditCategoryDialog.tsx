import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { ColorIcon } from "../ColorIcon";
import { useStyles } from "./EditCategoryDialog.css";
import { CategoryType } from "../../../../types/CategoryType";
import { applicationSlice } from "../../../../store";
import { categoriesSelector } from "../../../../store/selectors";

type EditCategoryDialogProps = {
  category: CategoryType;
  onCloseDialog: () => void;
  openDialog: boolean;
};

export const EditCategoryDialog = ({
  category,
  onCloseDialog,
  openDialog,
}: EditCategoryDialogProps) => {
  const dispatch = useDispatch();

  const classes = useStyles();

  const [color, setColor] = useState<string>(category.color);

  const onColorChange = (color: any) => {
    setColor(color.hex);
  };

  const [name, setName] = useState<string>(category.name);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    debugger;

    setName(event.target.value);
  };

  const categories = useSelector(categoriesSelector);

  const onEdit = () => {
    const updatedCategories = categories?.map((v: CategoryType) => {
      if (v.id === category.id) {
        return {
          ...category,
          color: color,
          name: name,
        };
      } else {
        return v;
      }
    });
    dispatch(
      applicationSlice.actions.setCategories({ categories: updatedCategories })
    );

    onCloseDialog();
  };

  return (
    <Dialog fullWidth onClose={onCloseDialog} open={openDialog}>
      <DialogTitle>Edit category</DialogTitle>

      <DialogContent>
        <div>
          <Grid container spacing={1}>
            <Grid item xs={2} className={classes.createCategoryDialogItem}>
              <ColorIcon color={color} onColorChange={onColorChange} />
            </Grid>
            <Grid item xs={10}>
              <TextField
                autoFocus
                fullWidth
                id="name"
                label="Name"
                margin="dense"
                onChange={onNameChange}
                value={name}
              />
            </Grid>
          </Grid>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCloseDialog} color="primary">
          Cancel
        </Button>

        <Button onClick={onEdit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};
