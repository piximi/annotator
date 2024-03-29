// @ts-nocheck
import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useState } from "react";
import { CategoryType } from "../../../../types/CategoryType";
import {
  categoryCountsSelector,
  createdCategoriesSelector,
  imageSelector,
  selectedCategorySelector,
  unknownCategorySelector,
} from "../../../../store/selectors";
import { useDispatch, useSelector, batch } from "react-redux";
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
import { applicationSlice, setActiveImage } from "../../../../store";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
} from "@material-ui/core";
import List from "@material-ui/core/List";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import SaveIcon from "@material-ui/icons/Save";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import PopupState, { bindTrigger } from "material-ui-popup-state";
import SettingsIcon from "@material-ui/icons/Settings";
import FeedbackIcon from "@material-ui/icons/Feedback";
import HelpIcon from "@material-ui/icons/Help";
import { SettingsDialog } from "../../SettingsButton/SettingsDialog";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import { CreateCategoryDialog } from "../CreateCategoryListItem/CreateCategoryDialog";
import { selectedAnnotationsIdsSelector } from "../../../../store/selectors/selectedAnnotationsIdsSelector";
import { ImageType } from "../../../../types/ImageType";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { ImageMenu } from "../ImageMenu";
import { DeleteAllAnnotationsDialog } from "../DeleteAllAnnotationsDialog";
import { SaveMenu } from "../SaveMenu/SaveMenu";
import { OpenMenu } from "../OpenMenu/OpenMenu";
import { HelpDialog } from "../../Help/HelpDialog/HelpDialog";
import { OpenImageHelpDialog } from "../../Help/HelpDialog/OpenImageHelpDialog";
import { MakeAnnotationsHelpDialog } from "../../Help/HelpDialog/MakeAnnotationsHelpDialog";
import { ManipulateCanvasHelpDialog } from "../../Help/HelpDialog/ManipulateCanvasHelpDialog";
import { ChangingAnnotationsHelpDialog } from "../../Help/HelpDialog/ChangingAnnotationsHelpDialog";
import { SavingProjectHelpDialog } from "../../Help/HelpDialog/SavingProjectHelpDialog";
import HelpDrawer from "../../Help/HelpDrawer/HelpDrawer";
import { ClearCategoryDialog } from "../ClearCategoryDialog";

export const CategoriesList = () => {
  const classes = useStyles();

  const createdCategories = useSelector(createdCategoriesSelector);
  const selectedCategory = useSelector(selectedCategorySelector);
  const unknownCategory = useSelector(unknownCategorySelector);

  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

  const categoryCounts = useSelector(categoryCountsSelector);

  const images = useSelector(imagesSelector);
  const currentImage = useSelector(imageSelector);

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

  const {
    onClose: onCloseClearCategoryDialog,
    onOpen: onOpenClearCategoryDialog,
    open: openClearCategoryDialog,
  } = useDialog();

  const {
    onClose: onCloseDeleteAllAnnotationsDialog,
    onOpen: onOpenDeleteAllAnnotationsDialog,
    open: openDeleteAllAnnotationsDialog,
  } = useDialog();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [imageAnchorEl, setImageAnchorEl] = React.useState<null | HTMLElement>(
    null
  );

  const onCategoryClick = (
    event: React.MouseEvent<HTMLDivElement>,
    category: CategoryType
  ) => {
    dispatch(
      applicationSlice.actions.setSelectedCategory({
        selectedCategory: category.id,
      })
    );
  };

  const onCategoryMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: CategoryType
  ) => {
    dispatch(
      applicationSlice.actions.setSelectedCategory({
        selectedCategory: category.id,
      })
    );
    setAnchorEl(event.currentTarget);
  };

  const onCategoryMenuClose = () => {
    setAnchorEl(null);
  };

  const onImageMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    image: ImageType
  ) => {
    onImageItemClick(event, image);
    setImageAnchorEl(event.currentTarget);
  };

  const onImageMenuClose = () => {
    setImageAnchorEl(null);
  };

  const onClearAllAnnotations = () => {
    const existingAnnotations = images
      .map((image: ImageType) => {
        return [...image.annotations];
      })
      .flat();
    if (existingAnnotations.length) {
      onOpenDeleteAllAnnotationsDialog();
    }
  };

  const onClearSelectedAnnotations = () => {
    if (!selectedAnnotationsIds) return;
    batch(() => {
      dispatch(
        applicationSlice.actions.deleteImageInstances({
          ids: selectedAnnotationsIds,
        })
      );
      dispatch(
        applicationSlice.actions.setSelectedCategory({
          selectedCategory: "00000000-0000-0000-0000-000000000000",
        })
      );
      dispatch(
        applicationSlice.actions.setSelectedAnnotations({
          selectedAnnotations: [],
          selectedAnnotation: undefined,
        })
      );
    });
  };

  const onImageItemClick = (
    evt: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>,
    image: ImageType
  ) => {
    batch(() => {
      dispatch(setActiveImage({ image: image.id }));

      dispatch(
        applicationSlice.actions.setSelectedAnnotations({
          selectedAnnotations: [],
          selectedAnnotation: undefined,
        })
      );
    });
  };

  const t = useTranslation();

  return (
    <Drawer
      anchor="left"
      className={classes.drawer}
      classes={{ paper: classes.paper }}
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
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Piximi Annotator
          </Typography>
        </Toolbar>
      </AppBar>

      <Divider />

      <List dense>
        <OpenListItem />
        <SaveListItem />
      </List>

      <Divider />

      <CollapsibleList closed dense primary={t("Images")}>
        {images.map((image: ImageType) => {
          return (
            <div key={image.id}>
              <ListItem
                button
                id={image.id}
                onClick={(evt: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                  onImageItemClick(evt, image)
                }
                selected={image.id === currentImage?.id}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={image.name}
                    src={image.avatar}
                    variant={"square"}
                  />
                </ListItemAvatar>
                <ListItemText
                  id={image.id}
                  primary={image.name}
                  primaryTypographyProps={{ noWrap: true }}
                />
                {image.annotations.length !== 0 && (
                  <Chip label={image.annotations.length} size="small" />
                )}
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(event) => onImageMenuOpen(event, image)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </div>
          );
        })}
        <ImageMenu
          anchorElImageMenu={imageAnchorEl}
          onCloseImageMenu={onImageMenuClose}
          openImageMenu={Boolean(imageAnchorEl)}
        />
      </CollapsibleList>

      <Divider />

      <CollapsibleList closed dense primary={t("Categories")}>
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
                {categoryCounts[category.id] !== 0 && (
                  <Chip label={categoryCounts[category.id]} size="small" />
                )}

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
                onCloseCategoryMenu={onCategoryMenuClose}
                onOpenCategoryMenu={(event) =>
                  onCategoryMenuOpen(event, category)
                }
                onOpenDeleteCategoryDialog={onOpenDeleteCategoryDialog}
                onOpenEditCategoryDialog={onOpenEditCategoryDialog}
                onOpenClearCategoryDialog={onOpenClearCategoryDialog}
                openCategoryMenu={Boolean(anchorEl)}
              />
            </div>
          );
        })}
        {unknownCategory && (
          <div key={unknownCategory.id}>
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
              {categoryCounts[unknownCategory.id] !== 0 && (
                <Chip label={categoryCounts[unknownCategory.id]} size="small" />
              )}
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={(event) =>
                    onCategoryMenuOpen(event, unknownCategory)
                  }
                >
                  <MoreHorizIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>

            <CategoryMenu
              anchorElCategoryMenu={anchorEl}
              onCloseCategoryMenu={onCategoryMenuClose}
              onOpenCategoryMenu={(event) =>
                onCategoryMenuOpen(event, unknownCategory)
              }
              onOpenDeleteCategoryDialog={onOpenDeleteCategoryDialog}
              onOpenEditCategoryDialog={onOpenEditCategoryDialog}
              openCategoryMenu={Boolean(anchorEl)}
              onOpenClearCategoryDialog={onOpenClearCategoryDialog}
            />
          </div>
        )}

        <DeleteCategoryDialog
          onClose={onCloseDeleteCategoryDialog}
          open={openDeleteCategoryDialog}
        />

        <EditCategoryDialog
          onCloseDialog={onCloseEditCategoryDialog}
          openDialog={openEditCategoryDialog}
        />

        <ClearCategoryDialog
          onClose={onCloseClearCategoryDialog}
          open={openClearCategoryDialog}
        />

        <CreateCategoryListItem />
      </CollapsibleList>

      <Divider />

      <List dense>
        <ListItem button onClick={onClearAllAnnotations}>
          <ListItemIcon>
            <DeleteIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary={t("Clear all annotations")} />
        </ListItem>

        <DeleteAllAnnotationsDialog
          onClose={onCloseDeleteAllAnnotationsDialog}
          open={openDeleteAllAnnotationsDialog}
        />

        <ListItem button onClick={onClearSelectedAnnotations}>
          <ListItemIcon>
            <DeleteIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary={t("Clear selected annotations")} />
        </ListItem>
      </List>

      <Divider />

      <List dense>
        <HelpDrawer />
        <SettingsListItem />
        <SendFeedbackListItem />
      </List>
    </Drawer>
  );
};

type SendFeedbackDialogProps = {
  onClose: () => void;
  open: boolean;
  onSend: (text: string) => void;
};

const CreateCategoryListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  const t = useTranslation();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>

        <ListItemText primary={t("Create category")} />
      </ListItem>
      <CreateCategoryDialog onClose={onClose} open={open} />
    </React.Fragment>
  );
};

/*
 * WARNING: This list item and its dialog box is not used anymore as it is been replaced with the HelpDrawer component.
 * */

const HelpListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  const {
    onClose: onCloseOpenImagesHelpDialog,
    onOpen: onOpenOpenImagesHelpDialog,
    open: openOpenImagesHelpDialog,
  } = useDialog();

  const {
    onClose: onCloseManipulatingCanvasHelpDialog,
    onOpen: onOpenManipulatingCanvasHelpDialog,
    open: openManipulatingCanvasHelpDialog,
  } = useDialog();

  const {
    onClose: onCloseMakeAnnotationsHelpDialog,
    onOpen: onOpenMakeAnnotationsHelpDialog,
    open: openMakeAnnotationsHelpDialog,
  } = useDialog();

  const {
    onClose: onCloseChangingAnnotationsHelpDialog,
    onOpen: onOpenChangingAnnotationsHelpDialog,
    open: openChangingAnnotationsHelpDialog,
  } = useDialog();

  const {
    onClose: onCloseSavingProjectHelpDialog,
    onOpen: onOpenSavingProjectHelpDialog,
    open: openSavingProjectHelpDialog,
  } = useDialog();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>

        <ListItemText primary="Help" />
      </ListItem>

      <HelpDrawer />

      {/*<HelpDialog*/}
      {/*  onClose={onClose}*/}
      {/*  open={open}*/}
      {/*  onOpenOpenImagesHelpDialog={onOpenOpenImagesHelpDialog}*/}
      {/*  onOpenMakeAnnotationsHelpDialog={onOpenMakeAnnotationsHelpDialog}*/}
      {/*  onOpenManipulatingCanvasHelpDialog={onOpenManipulatingCanvasHelpDialog}*/}
      {/*  onOpenChangingAnnotationsHelpDialog={*/}
      {/*    onOpenChangingAnnotationsHelpDialog*/}
      {/*  }*/}
      {/*  onOpenSavingProjectHelpDialog={onOpenSavingProjectHelpDialog}*/}
      {/*/>*/}
      {/*<OpenImageHelpDialog*/}
      {/*  onClose={onCloseOpenImagesHelpDialog}*/}
      {/*  open={openOpenImagesHelpDialog}*/}
      {/*/>*/}
      {/*<MakeAnnotationsHelpDialog*/}
      {/*  onClose={onCloseMakeAnnotationsHelpDialog}*/}
      {/*  open={openMakeAnnotationsHelpDialog}*/}
      {/*/>*/}
      {/*<ManipulateCanvasHelpDialog*/}
      {/*  onClose={onCloseManipulatingCanvasHelpDialog}*/}
      {/*  open={openManipulatingCanvasHelpDialog}*/}
      {/*/>*/}
      {/*<ChangingAnnotationsHelpDialog*/}
      {/*  onClose={onCloseChangingAnnotationsHelpDialog}*/}
      {/*  open={openChangingAnnotationsHelpDialog}*/}
      {/*/>*/}
      {/*<SavingProjectHelpDialog*/}
      {/*  onClose={onCloseSavingProjectHelpDialog}*/}
      {/*  open={openSavingProjectHelpDialog}*/}
      {/*/>*/}
    </React.Fragment>
  );
};

const OpenListItem = () => {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <React.Fragment>
          <ListItem button {...bindTrigger(popupState)}>
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>

            <ListItemText primary="Open" />
          </ListItem>

          <OpenMenu popupState={popupState} />
        </React.Fragment>
      )}
    </PopupState>
  );
};

const SaveListItem = () => {
  const t = useTranslation();

  return (
    <PopupState variant="popover">
      {(popupState) => (
        <React.Fragment>
          <ListItem button {...bindTrigger(popupState)}>
            <ListItemIcon>
              <SaveIcon />
            </ListItemIcon>

            <ListItemText primary={t("Save")} />
          </ListItem>
          <SaveMenu popupState={popupState} />
        </React.Fragment>
      )}
    </PopupState>
  );
};

const SendFeedbackDialog = ({
  onClose,
  open,
  onSend,
}: SendFeedbackDialogProps) => {
  const classes = useStyles();

  const t = useTranslation();

  const [input, setInput] = useState("");

  const send = () => {
    onSend(input);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{t("Send feedback")}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {t(
            "Use this form to report issues with Piximi via our GitHub page, or visit"
          )}{" "}
          <a
            className={classes.a}
            href="https://forum.image.sc/tag/piximi"
            target="_blank"
            rel="noreferrer"
          >
            forum.image.sc/tag/piximi
          </a>
          .
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="feedback"
          onChange={(e) => setInput(e.target.value)}
          multiline
          rows={12}
          fullWidth
          variant="filled"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={send} color="primary">
          Send feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SendFeedbackListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  const onSend = (text: string) => {
    const url =
      "https://github.com/piximi/annotator/issues/new?title=Bug%20Report&labels=bug&body=" +
      encodeURIComponent(text);
    window.open(url);
  };

  const t = useTranslation();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <FeedbackIcon />
        </ListItemIcon>

        <ListItemText primary={t("Send feedback")} />
      </ListItem>
      <SendFeedbackDialog onClose={onClose} open={open} onSend={onSend} />
    </React.Fragment>
  );
};

const SettingsListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  const t = useTranslation();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>

        <ListItemText primary={t("Settings")} />
      </ListItem>
      <SettingsDialog onClose={onClose} open={open} />
    </React.Fragment>
  );
};
