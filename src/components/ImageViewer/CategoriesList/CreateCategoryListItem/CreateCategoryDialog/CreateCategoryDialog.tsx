import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ColorIcon } from "../../ColorIcon";
import Grid from "@material-ui/core/Grid";
import { useStyles } from "./CreateCategoryDialog.css";
import { ColorResult } from "react-color";
import { sample } from "underscore";
import { applicationSlice } from "../../../../../store";
import { v4 } from "uuid";
import { CategoryType } from "../../../../../types/CategoryType";
import { categoriesSelector } from "../../../../../store/selectors";
import { useTranslation } from "../../../../../hooks/useTranslation";
import { replaceDuplicateName } from "../../../../../image/imageHelper";

const COLORS = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

type CreateCategoryDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const CreateCategoryDialog = ({
  onClose,
  open,
}: CreateCategoryDialogProps) => {
  const dispatch = useDispatch();

  const categories = useSelector(categoriesSelector);

  const [color, setColor] = React.useState<string>(sample(COLORS)!);

  const [name, setName] = useState<string>("");

  const classes = useStyles();

  const onCreate = () => {
    const initialName = name ? name : "Unnamed";
    const categoryNames = categories.map((category: CategoryType) => {
      return category.name;
    });
    const updatedName = replaceDuplicateName(initialName, categoryNames);

    const category: CategoryType = {
      color: color,
      id: v4().toString(),
      name: updatedName,
      visible: true,
    };

    dispatch(
      applicationSlice.actions.setCategories({
        categories: [...categories, category],
      })
    );

    dispatch(
      applicationSlice.actions.setSelectedCategory({
        selectedCategory: category.id,
      })
    );

    setName("");

    onClose();

    setColor(sample(COLORS)!);
  };

  const onColorChange = (color: ColorResult) => {
    setColor(color.hex);
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const t = useTranslation();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <form onSubmit={(event) => onSubmit(event)}>
        <DialogTitle>{t("Create category")}</DialogTitle>

        <DialogContent className={classes.createCategoryDialogContent}>
          <div className={classes.createCategoryDialogGrid}>
            <Grid container spacing={1}>
              <Grid item xs={2} className={classes.createCategoryDialogItem}>
                <ColorIcon color={color} onColorChange={onColorChange} />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  autoFocus
                  fullWidth
                  id="name"
                  label={t("Name")}
                  margin="dense"
                  onChange={onNameChange}
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t("Cancel")}
          </Button>

          <Button onClick={onCreate} color="primary" type="submit">
            {t("Create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
