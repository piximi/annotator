import * as React from "react";
import { SaveListItem } from "../SaveListItem";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
} from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";

export const ApplicationList = () => {
  return (
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
      <SaveListItem />
    </List>
  );
};
