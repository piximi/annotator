import * as React from "react";
import { SaveListItem } from "../SaveListItem";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@material-ui/core";
import PopupState, { bindTrigger } from "material-ui-popup-state";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import Divider from "@material-ui/core/Divider";

export const ApplicationList = () => {
  return (
    <List dense>
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
      <SaveListItem />
    </List>
  );
};
