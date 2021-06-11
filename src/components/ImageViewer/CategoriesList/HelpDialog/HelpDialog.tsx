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
};

export const HelpDialog = ({
  onClose,
  open,
  onOpenOpenImagesHelpDialog,
  onOpenMakeAnnotationsHelpDialog,
}: HelpDialogProps) => {
  const t = useTranslation();

  const onOpenImagesHelpClick = () => {
    onOpenOpenImagesHelpDialog();
  };

  const onMakeAnnotationsHelpClick = () => {
    onOpenMakeAnnotationsHelpDialog();
  };

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
        <ListItem button onClick={onOpenImagesHelpClick}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Opening images")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Manipulating images")} />
        </ListItem>

        <ListItem button onClick={onMakeAnnotationsHelpClick}>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Making annotations")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Changing annotations")} />
        </ListItem>

        <ListItem button>
          <ListItemIcon>
            <DescriptionIcon />
          </ListItemIcon>

          <ListItemText primary={t("Save project and export annotations")} />
        </ListItem>
      </List>
    </Dialog>
  );
};
