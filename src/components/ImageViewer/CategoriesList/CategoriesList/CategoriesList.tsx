import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { CategoryType } from "../../../../types/CategoryType";
import {
  createdCategoriesSelector,
  imageInstancesSelector,
  selectedCategorySelector,
  unknownCategorySelector,
} from "../../../../store/selectors";
import { useDispatch, useSelector } from "react-redux";
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
import { Divider, Menu, MenuItem } from "@material-ui/core";
import List from "@material-ui/core/List";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { AnnotationType } from "../../../../types/AnnotationType";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import SaveIcon from "@material-ui/icons/Save";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import { MiscellaneousList } from "../MiscellaneousList";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";

export const CategoriesList = () => {
  const classes = useStyles();

  const createdCategories = useSelector(createdCategoriesSelector);
  const selectedCategory = useSelector(selectedCategorySelector);
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

  const onCategoryMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: CategoryType
  ) => {
    dispatch(
      applicationSlice.actions.setSeletedCategory({
        selectedCategory: category.id,
      })
    );
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
      <Box
        style={{ paddingTop: 60 }}
        className={classes.toolbar}
        display="flex"
        justifyContent="flex-end"
        px={8}
      />

      <AppBar className={classes.appBar} color="default">
        <Toolbar disableGutters={true}>
          <Tooltip title={(true ? "Hide " : "Show ") + "sidebar"}>
            <IconButton
              aria-label="open sidebar"
              className={classes.menuButton}
              color="inherit"
              onClick={() => {}}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" color="inherit">
            Piximi
          </Typography>
        </Toolbar>
      </AppBar>

      <Divider />

      <List dense>
        <PopupState variant="popover">
          {(popupState) => (
            <React.Fragment>
              <ListItem button {...bindTrigger(popupState)}>
                <ListItemIcon>
                  <FolderOpenIcon />
                </ListItemIcon>

                <ListItemText primary="Open" />
              </ListItem>

              <Menu {...bindMenu(popupState)}>
                <MenuItem dense onClick={popupState.close}>
                  <ListItemText primary="Open image" />
                </MenuItem>

                <MenuItem dense onClick={popupState.close}>
                  <ListItemText primary="Open example image" />
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>

        <PopupState variant="popover">
          {(popupState) => (
            <React.Fragment>
              <ListItem button {...bindTrigger(popupState)}>
                <ListItemIcon>
                  <SaveIcon />
                </ListItemIcon>

                <ListItemText primary="Save" />
              </ListItem>

              <Menu {...bindMenu(popupState)}>
                <MenuItem dense onClick={popupState.close}>
                  <ListItemText primary="Save annotations" />
                </MenuItem>

                <MenuItem dense disabled onClick={popupState.close}>
                  <ListItemText primary="Save classifier" />
                </MenuItem>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
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
                  <IconButton
                    edge="end"
                    onClick={(event) => onCategoryMenuOpen(event, category)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <CategoryMenu
                anchorElCategoryMenu={anchorEl}
                category={category}
                onCloseCategoryMenu={onCategoryMenuClose}
                onOpenCategoryMenu={(event) =>
                  onCategoryMenuOpen(event, category)
                }
                onOpenDeleteCategoryDialog={onOpenDeleteCategoryDialog}
                onOpenEditCategoryDialog={onOpenEditCategoryDialog}
                openCategoryMenu={Boolean(anchorEl)}
              />

              <DeleteCategoryDialog
                onClose={onCloseDeleteCategoryDialog}
                open={openDeleteCategoryDialog}
              />

              <EditCategoryDialog
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

      <MiscellaneousList />
    </Drawer>
  );
};
