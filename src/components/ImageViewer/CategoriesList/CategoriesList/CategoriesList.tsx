import Drawer from "@material-ui/core/Drawer";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { ChangeEvent } from "react";
import { CategoryType } from "../../../../types/CategoryType";
import {
  createdCategoriesSelector,
  imageInstancesSelector,
  imageSelector,
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
import {
  applicationSlice,
  setChannels,
  setImage,
  setImages,
  setOperation,
  setSelectedAnnotation,
  setSelectedAnnotations,
} from "../../../../store";
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
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import * as ImageJS from "image-js";
import { ShapeType } from "../../../../types/ShapeType";
import { ExampleImageDialog } from "../ExampleImageDialog";
import SettingsIcon from "@material-ui/icons/Settings";
import FeedbackIcon from "@material-ui/icons/Feedback";
import HelpIcon from "@material-ui/icons/Help";
import { SettingsDialog } from "../../SettingsButton/SettingsDialog";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import { CreateCategoryDialog } from "../CreateCategoryListItem/CreateCategoryDialog";
import { serializedAnnotationsSelector } from "../../../../store/selectors/serializedAnnotationsSelector";
import { saveAs } from "file-saver";
import { ChannelType } from "../../../../types/ChannelType";
import { ToolType } from "../../../../types/ToolType";
import { selectedAnnotationsIdsSelector } from "../../../../store/selectors/selectedAnnotationsIdsSelector";
import { ImageType } from "../../../../types/ImageType";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { v4 } from "uuid";

export const CategoriesList = () => {
  const classes = useStyles();

  const createdCategories = useSelector(createdCategoriesSelector);
  const selectedCategory = useSelector(selectedCategorySelector);
  const unknownCategory = useSelector(unknownCategorySelector);

  const annotations = useSelector(imageInstancesSelector);

  const selectedAnnotationsIds = useSelector(selectedAnnotationsIdsSelector);

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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

  const onClearAllAnnotations = () => {
    if (!annotations) return;
    annotations.forEach((annotation: AnnotationType) => {
      dispatch(
        applicationSlice.actions.deleteImageInstance({ id: annotation.id })
      );
    });
    dispatch(
      applicationSlice.actions.setSelectedCategory({
        selectedCategory: "00000000-0000-0000-0000-000000000000",
      })
    );
  };

  const onClearSelectedAnnotations = () => {
    if (!selectedAnnotationsIds) return;
    selectedAnnotationsIds.forEach((id: string) => {
      dispatch(applicationSlice.actions.deleteImageInstance({ id: id }));
    });
    dispatch(
      applicationSlice.actions.setSelectedCategory({
        selectedCategory: "00000000-0000-0000-0000-000000000000",
      })
    );
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: [],
      })
    );
  };

  const onImageItemClick = (
    evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
    image: ImageType
  ) => {
    const selectedImage = images.filter((current: ImageType) => {
      return image.id === current.id;
    })[0];

    dispatch(setImage({ image: selectedImage }));
    dispatch(
      applicationSlice.actions.setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );
    dispatch(
      applicationSlice.actions.setSelectedAnnotations({
        selectedAnnotations: [],
      })
    );
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
            Piximi
          </Typography>
        </Toolbar>
      </AppBar>

      <Divider />

      <List dense>
        <OpenListItem />
        <SaveListItem />
      </List>

      <Divider />

      <CollapsibleList dense primary={t("Images")}>
        {images.map((image: ImageType) => {
          if (image)
            return (
              <div key={image.id}>
                <ListItem
                  button
                  id={image.id}
                  onClick={(
                    evt: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => onImageItemClick(evt, image)}
                  selected={image.id === currentImage?.id}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={image.name}
                      src={image.src}
                      variant={"square"}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={image.id}
                    primary={image.name}
                    primaryTypographyProps={{ noWrap: true }}
                  />
                </ListItem>
              </div>
            );
        })}
      </CollapsibleList>

      <CollapsibleList dense primary={t("Categories")}>
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
      </List>

      <List dense>
        <ListItem button onClick={onClearSelectedAnnotations}>
          <ListItemIcon>
            <DeleteIcon color="disabled" />
          </ListItemIcon>
          <ListItemText primary={t("Clear selected annotations")} />
        </ListItem>
      </List>

      <Divider />

      <List dense>
        <SettingsListItem />

        <SendFeedbackListItem />

        <HelpListItem />
      </List>
    </Drawer>
  );
};

type OpenAnnotationsMenuItemProps = {
  popupState: any;
};

type OpenExampleImageMenuItemProps = {
  popupState: any;
};

type OpenImageMenuItemProps = {
  popupState: any;
};

type OpenMenuProps = {
  popupState: any;
};

type HelpDialogProps = {
  onClose: () => void;
  open: boolean;
};

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

type SaveModelMenuItemProps = {
  popupState: any;
};

type SaveMenuProps = {
  popupState: any;
};

type SendFeedbackDialogProps = {
  onClose: () => void;
  open: boolean;
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

const HelpListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  return (
    <ListItem button onClick={onOpen}>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>

      <ListItemText primary="Help" />

      <HelpDialog onClose={onClose} open={open} />
    </ListItem>
  );
};

const OpenAnnotationsMenuItem = ({
  popupState,
}: OpenAnnotationsMenuItemProps) => {
  const dispatch = useDispatch();

  const onOpenAnnotations = (
    event: React.ChangeEvent<HTMLInputElement>,
    onClose: () => void
  ) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          const annotations = JSON.parse(event.target.result as string);

          dispatch(
            applicationSlice.actions.openAnnotations({
              annotations: annotations,
            })
          );
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <MenuItem component="label">
      <ListItemText primary="Open annotations" />
      <input
        accept="application/json"
        hidden
        id="open-annotations"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onOpenAnnotations(event, popupState.close)
        }
        type="file"
      />
    </MenuItem>
  );
};

const OpenExampleImageMenuItem = ({
  popupState,
}: OpenExampleImageMenuItemProps) => {
  const { onClose, onOpen, open } = useDialog();

  return (
    <MenuItem onClick={onOpen}>
      <ListItemText primary="Open example image" />
      <ExampleImageDialog
        onClose={() => {
          onClose();

          popupState.close();
        }}
        open={open}
      />
    </MenuItem>
  );
};

const OpenImageMenuItem = ({ popupState }: OpenImageMenuItemProps) => {
  const dispatch = useDispatch();

  const images = useSelector(imagesSelector);

  const onOpenImage = (
    event: React.ChangeEvent<HTMLInputElement>,
    onClose: () => void
  ) => {
    onClose();

    event.persist();

    const loadedImages: Array<ImageType> = [...images];

    if (event.currentTarget.files) {
      for (let i = 0; i < event.currentTarget.files.length; i++) {
        const file = event.currentTarget.files[i];

        file.arrayBuffer().then((buffer) => {
          ImageJS.Image.load(buffer).then((image) => {
            const name = file.name;

            const shape: ShapeType = {
              channels: image.components,
              frames: 1,
              height: image.height,
              planes: 1,
              width: image.width,
            };

            const loaded: ImageType = {
              id: v4(),
              annotations: [],
              name: name,
              shape: shape,
              originalSrc: image.toDataURL(),
              src: image.toDataURL(),
            };

            dispatch(setImages({ images: [...loadedImages, loaded] }));
            loadedImages.push(loaded);

            if (i === 0) {
              dispatch(
                setImage({
                  image: loaded,
                })
              );

              dispatch(
                setSelectedAnnotations({
                  selectedAnnotations: [],
                })
              );

              dispatch(
                setSelectedAnnotation({
                  selectedAnnotation: undefined,
                })
              );

              let channels: Array<ChannelType> = []; //number of channels depends if image is greyscale or RGB
              for (let i = 0; i < image.components; i++) {
                channels.push({ visible: true, range: [0, 255] });
              }
              dispatch(setChannels({ channels: channels }));

              dispatch(
                setOperation({ operation: ToolType.RectangularAnnotation })
              );
            }
          });
        });
      }
    }
  };

  return (
    <MenuItem component="label">
      <ListItemText primary="Open image" />
      <input
        accept="image/*"
        hidden
        multiple
        id="open-image"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onOpenImage(event, popupState.close)
        }
        type="file"
      />
    </MenuItem>
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

const OpenMenu = ({ popupState }: OpenMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <OpenImageMenuItem popupState={popupState} />

      <OpenAnnotationsMenuItem popupState={popupState} />

      <Divider />

      <OpenExampleImageMenuItem popupState={popupState} />
    </Menu>
  );
};

const SaveAnnotationsMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(serializedAnnotationsSelector);

  const onSaveAnnotations = () => {
    popupState.close();
    const blob = new Blob([JSON.stringify(annotations)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, `${annotations[0].imageFilename}.json`);
  };

  return (
    <MenuItem onClick={onSaveAnnotations}>
      <ListItemText primary="Save annotations" />
    </MenuItem>
  );
};

const SaveMenu = ({ popupState }: SaveMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <SaveAnnotationsMenuItem popupState={popupState} />

      <SaveModelMenuItem popupState={popupState} />
    </Menu>
  );
};

const SaveModelMenuItem = ({ popupState }: SaveModelMenuItemProps) => {
  const t = useTranslation();

  return (
    <MenuItem disabled onClick={popupState.close}>
      <ListItemText primary={t("Save model")} />
    </MenuItem>
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

const SendFeedbackDialog = ({ onClose, open }: SendFeedbackDialogProps) => {
  const t = useTranslation();

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{t("Send feedback")}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Vestibulum eu vestibulum nibh, quis commodo sapien. Donec a sem nec
          augue rutrum tristique. Nam pretium nec dui in sagittis.
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
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button onClick={onClose} color="primary">
          Send feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SendFeedbackListItem = () => {
  const { onClose, onOpen, open } = useDialog();

  const t = useTranslation();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <FeedbackIcon />
        </ListItemIcon>

        <ListItemText primary={t("Send feedback")} />
      </ListItem>
      <SendFeedbackDialog onClose={onClose} open={open} />
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
