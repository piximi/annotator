import { useTranslation } from "../../../../hooks/useTranslation";
import { Dialog, DialogTitle } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

type HelpDialogProps = {
  onClose: () => void;
  open: boolean;
  onOpenOpenImagesHelpDialog: () => void;
  onOpenMakeAnnotationsHelpDialog: () => void;
  onOpenManipulatingCanvasHelpDialog: () => void;
  onOpenChangingAnnotationsHelpDialog: () => void;
  onOpenSavingProjectHelpDialog: () => void;
};

export const HelpDialog = ({
  onClose,
  open,
  onOpenOpenImagesHelpDialog,
  onOpenMakeAnnotationsHelpDialog,
  onOpenManipulatingCanvasHelpDialog,
  onOpenChangingAnnotationsHelpDialog,
  onOpenSavingProjectHelpDialog,
}: HelpDialogProps) => {
  const t = useTranslation();

  return (
    <Dialog
      disableBackdropClick={true}
      fullWidth
      maxWidth="xs"
      onClose={onClose}
      open={open}
    >
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
        <ListItem button onClick={onOpenOpenImagesHelpDialog}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Opening images")} />
        </ListItem>

        <ListItem button onClick={onOpenManipulatingCanvasHelpDialog}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Manipulating the canvas")} />
        </ListItem>

        <ListItem button onClick={onOpenMakeAnnotationsHelpDialog}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Making new annotations")} />
        </ListItem>

        <ListItem button onClick={onOpenChangingAnnotationsHelpDialog}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Changing existing annotations")} />
        </ListItem>

        <ListItem button onClick={onOpenSavingProjectHelpDialog}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText
            primary={t("Saving project and exporting annotations")}
          />
        </ListItem>
      </List>
    </Dialog>
  );
};
