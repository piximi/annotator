import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { CategoryType } from "../../../../types/CategoryType";
import {
  createdCategoriesSelector,
  imageInstancesSelector,
  selectedCategroySelector,
  unknownCategorySelector,
} from "../../../../store/selectors";
import { useSelector } from "react-redux";
import { useStyles } from "./CategoriesList.css";
import { CollapsibleList } from "../CollapsibleList";
import { CreateCategoryListItem } from "../CreateCategoryListItem";
import { CategoryListItemCheckbox } from "../CategoryListItemCheckbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { CategoryMenu } from "../CategoryMenu";
import { DeleteCategoryDialog } from "../DeleteCategoryDialog";
import { EditCategoryDialog } from "../EditCategoryDialog";
import { useDialog } from "../../../../hooks";
import { useTranslation } from "../../../../hooks/useTranslation";
import { applicationSlice } from "../../../../store";
import { useDispatch } from "react-redux";
import { Divider } from "@material-ui/core";
import List from "@material-ui/core/List";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { AnnotationType } from "../../../../types/AnnotationType";
import SettingsIcon from "@material-ui/icons/Settings";
import FeedbackIcon from "@material-ui/icons/Feedback";
import HelpIcon from "@material-ui/icons/Help";
import OpenIcon from "@material-ui/icons/FolderOpen";
import SaveIcon from "@material-ui/icons/Save";

export const CategoriesList = () => {
  const classes = useStyles();

  const createdCategories = useSelector(createdCategoriesSelector);
  const selectedCategory = useSelector(selectedCategroySelector);
  const unknownCategory = useSelector(unknownCategorySelector);

  const annotations = useSelector(imageInstancesSelector);

  const dispatch = useDispatch();

  const {
    onClose: onCloseDeleteCategoryDialog,
    onOpen: onOpenDeleteCategoryDialog,
    open: openDeleteCategoryDialog,
  } = useDialog();

  const {
    onClose: onCloseEditCategoryDialog,
    onOpen: onOpenEditCategoryDialog,
    open: openEditCategoryDialog,
  } = useDialog();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const onCategoryClick = (
    event: React.MouseEvent<HTMLDivElement>,
    category: CategoryType
  ) => {
    dispatch(
      applicationSlice.actions.setSeletedCategory({
        selectedCategory: category.id,
      })
    );
  };

  const onCategoryMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onCategoryMenuClose = () => {
    setAnchorEl(null);
  };

  const onClearAllAnnotations = () => {
    if (!annotations) return;
    annotations.forEach((annotation: AnnotationType) => {
      dispatch(
        applicationSlice.actions.deleteImageInstance({ id: annotation.id })
      );
    });
    dispatch(
      applicationSlice.actions.setSeletedCategory({
        selectedCategory: "00000000-0000-0000-0000-000000000000",
      })
    );
  };

  const t = useTranslation();

  return (
    <Drawer
      anchor="left"
      className={classes.applicationDrawer}
      classes={{ paper: classes.applicationDrawerPaper }}
      open
      variant="persistent"
    >
      <div className={classes.applicationDrawerHeader} />

      <List component="nav" dense>
        <ListItem button>
          <ListItemIcon>
            <OpenIcon />
          </ListItemIcon>

          <ListItemText primary={t("Open")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>

          <ListItemText primary={t("Save")} />
        </ListItem>
      </List>

      <Divider />

      <CollapsibleList primary={t("Categories")}>
        {createdCategories.map((category: CategoryType) => {
          return (
            <div key={category.id}>
              <ListItem
                button
                dense
                id={category.id}
                onClick={(event) => onCategoryClick(event, category)}
                selected={category.id === selectedCategory.id}
              >
                <CategoryListItemCheckbox category={category} />

                <ListItemText
                  id={category.id}
                  primary={category.name}
                  primaryTypographyProps={{ noWrap: true }}
                />

                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={onCategoryMenuOpen}>
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <CategoryMenu
                anchorElCategoryMenu={anchorEl}
                category={category}
                onCloseCategoryMenu={onCategoryMenuClose}
                onOpenCategoryMenu={onCategoryMenuOpen}
                onOpenDeleteCategoryDialog={onOpenDeleteCategoryDialog}
                onOpenEditCategoryDialog={onOpenEditCategoryDialog}
                openCategoryMenu={Boolean(anchorEl)}
              />

              <DeleteCategoryDialog
                category={category}
                onClose={onCloseDeleteCategoryDialog}
                open={openDeleteCategoryDialog}
              />

              <EditCategoryDialog
                category={category}
                onCloseDialog={onCloseEditCategoryDialog}
                openDialog={openEditCategoryDialog}
              />
            </div>
          );
        })}

        <ListItem
          button
          dense
          id={unknownCategory.id}
          onClick={(event) => onCategoryClick(event, unknownCategory)}
          selected={unknownCategory.id === selectedCategory.id}
        >
          <CategoryListItemCheckbox category={unknownCategory} />

          <ListItemText
            id={unknownCategory.id}
            primary={t(unknownCategory.name)}
            primaryTypographyProps={{ noWrap: true }}
          />
        </ListItem>

        <CreateCategoryListItem />

        <Divider />

        <List component="nav" dense>
          <ListItem button onClick={onClearAllAnnotations}>
            <ListItemIcon>
              <DeleteIcon color="disabled" />
            </ListItemIcon>
            <ListItemText primary={t("Clear all annotations")} />
          </ListItem>
        </List>
      </CollapsibleList>

      <Divider />

      <List component="nav" dense>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>

          <ListItemText primary={t("Settings")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>

          <ListItemText primary={t("Send feedback")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>

          <ListItemText primary={t("Help")} />
        </ListItem>
      </List>
    </Drawer>
  );
};
