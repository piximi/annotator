import {
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import * as React from "react";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import PopupState, { bindTrigger } from "material-ui-popup-state";

export const OpenListItem = () => {
  return (
    <PopupState popupId="demo-popup-menu" variant="popover">
      {(popupState) => (
        <React.Fragment>
          <ListItem button {...bindTrigger(popupState)}>
            <ListItemIcon>
              <FolderOpenIcon />
            </ListItemIcon>

            <ListItemText primary="Open" />
          </ListItem>

          <MenuList dense>
            <MenuItem>
              <ListItemText primary="Open image" />
            </MenuItem>

            <MenuItem>
              <ListItemText primary="Open example image" />
            </MenuItem>
          </MenuList>
        </React.Fragment>
      )}
    </PopupState>
  );
};
