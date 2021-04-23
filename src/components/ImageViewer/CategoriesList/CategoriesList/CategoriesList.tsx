import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ChangeEvent } from "react";
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
import { CategoryListItemCheckbox } from "../CategoryListItemCheckbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { CategoryMenu } from "../CategoryMenu";
import { DeleteCategoryDialog } from "../DeleteCategoryDialog";
import { EditCategoryDialog } from "../EditCategoryDialog";
import { useDialog } from "../../../../hooks";
import { useTranslation } from "../../../../hooks/useTranslation";
import { applicationSlice, setImage } from "../../../../store";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { AnnotationType } from "../../../../types/AnnotationType";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import SaveIcon from "@material-ui/icons/Save";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import AppBar from "@material-ui/core/AppBar";
import Tooltip from "@material-ui/core/Tooltip";
import Box from "@material-ui/core/Box";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import * as ImageJS from "image-js";
import { ShapeType } from "../../../../types/ShapeType";
import { ExampleImageDialog } from "../ExampleImageDialog";
import SettingsIcon from "@material-ui/icons/Settings";
import FeedbackIcon from "@material-ui/icons/Feedback";
import HelpIcon from "@material-ui/icons/Help";
import { SettingsDialog } from "../../ImageViewerAppBar/SettingsButton/SettingsDialog";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import { CreateCategoryDialog } from "../CreateCategoryListItem/CreateCategoryDialog";

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

  const onOpenImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    onClose: () => void
  ) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const src = event.target.result;

          const image = new Image();

          image.onload = () => {};

          image.src = src as string;
        }
      };

      file.arrayBuffer().then((buffer) => {
        ImageJS.Image.load(buffer).then((image) => {
          const name = file.name;

          const shape: ShapeType = {
            channels: 4,
            frames: 1,
            height: image.height,
            planes: 1,
            width: image.width,
          };

          dispatch(
            setImage({
              image: {
                id: "",
                annotations: [],
                name: name,
                shape: shape,
                src: image.toDataURL(),
              },
            })
          );
        });
      });

      reader.readAsDataURL(file);
    }
  };

  const [openExampleImageDialog, setOpenExampleImageDialog] = React.useState(
    false
  );

  const onOpenExampleImageDialog = (onClose: () => void) => {
    setOpenExampleImageDialog(true);
  };

  const onCloseExampleImageDialog = (onClose: () => void) => {
    setOpenExampleImageDialog(false);
    onClose();
  };

  const [openSettingsDialog, setOpenSettingsDialog] = React.useState(false);

  const onOpenSettingsDialog = () => {
    setOpenSettingsDialog(!openSettingsDialog);
  };

  const onCloseSettingsDialog = () => {
    setOpenSettingsDialog(!openSettingsDialog);
  };

  const [
    openSendFeedbackDialog,
    setOpenSendFeedbackDialog,
  ] = React.useState<boolean>(false);

  const onOpenSendFeedbackDialog = () => {
    setOpenSendFeedbackDialog(!openSendFeedbackDialog);
  };

  const onCloseSendFeedbackDialog = () => {
    setOpenSendFeedbackDialog(!openSendFeedbackDialog);
  };

  const [openHelpDialog, setOpenHelpDialog] = React.useState<boolean>(false);

  const onOpenHelpDialog = () => setOpenHelpDialog(!openHelpDialog);

  const onCloseHelpDialog = () => setOpenHelpDialog(!openHelpDialog);

  const {
    onClose: onCloseCreateCategoryDialog,
    onOpen: onOpenCreateCategoryDialog,
    open: openCreateCategoryDialog,
  } = useDialog();

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

      <List>
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
                <MenuItem component="label">
                  <ListItemText primary="Open image" />
                  <input
                    accept="image/*"
                    hidden
                    id="open-image"
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      onOpenImage(event, popupState.close)
                    }
                    type="file"
                  />
                </MenuItem>

                <MenuItem
                  onClick={() => onOpenExampleImageDialog(popupState.close)}
                >
                  <ListItemText primary="Open example image" />
                  <ExampleImageDialog
                    onClose={() => onCloseExampleImageDialog(popupState.close)}
                    open={openExampleImageDialog}
                  />
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
                <MenuItem onClick={popupState.close}>
                  <ListItemText primary="Save annotations" />
                </MenuItem>

                <MenuItem disabled onClick={popupState.close}>
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

        <ListItem button onClick={onOpenCreateCategoryDialog}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>

          <ListItemText primary={t("Create category")} />

          <CreateCategoryDialog
            onClose={onCloseCreateCategoryDialog}
            open={openCreateCategoryDialog}
          />
        </ListItem>

        <Divider />

        <List>
          <ListItem button onClick={onClearAllAnnotations}>
            <ListItemIcon>
              <DeleteIcon color="disabled" />
            </ListItemIcon>
            <ListItemText primary={t("Clear all annotations")} />
          </ListItem>
        </List>
      </CollapsibleList>

      <Divider />

      <List>
        <ListItem button onClick={onOpenSettingsDialog}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>

          <ListItemText primary="Settings" />

          <SettingsDialog
            onClose={onCloseSettingsDialog}
            open={openSettingsDialog}
          />
        </ListItem>

        <ListItem button onClick={onOpenSendFeedbackDialog}>
          <ListItemIcon>
            <FeedbackIcon />
          </ListItemIcon>

          <ListItemText primary="Send feedback" />

          <Dialog
            onClose={onCloseSendFeedbackDialog}
            open={openSendFeedbackDialog}
          >
            <DialogTitle>{t("Send feedback")}</DialogTitle>

            <DialogContent>
              <DialogContentText>
                Vestibulum eu vestibulum nibh, quis commodo sapien. Donec a sem
                nec augue rutrum tristique. Nam pretium nec dui in sagittis.
              </DialogContentText>

              <TextField
                autoFocus
                margin="dense"
                id="feedback"
                multiline
                rows={12}
                fullWidth
                variant="filled"
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={onCloseSendFeedbackDialog} color="primary">
                Cancel
              </Button>

              <Button onClick={onCloseSendFeedbackDialog} color="primary">
                Send feedback
              </Button>
            </DialogActions>
          </Dialog>
        </ListItem>

        <ListItem button onClick={onOpenHelpDialog}>
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>

          <ListItemText primary="Help" />

          <HelpDialog onClose={onCloseHelpDialog} open={openHelpDialog} />
        </ListItem>
      </List>
    </Drawer>
  );
};

type HelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

const HelpDialog = ({ onClose, open }: HelpDialogProps) => {
  const t = useTranslation();

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <AppBar position="relative">
        <Toolbar>
          <Typography style={{ flexGrow: 1 }} variant="h6">
            <DialogTitle>{t("Help")}</DialogTitle>
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <List>
        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("What’s new?")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Open images")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Make annotations")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Save annotations")} />
        </ListItem>
      </List>
    </Dialog>
  );
};
