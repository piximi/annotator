import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import * as React from "react";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { OpenMenuList } from "../OpenMenuList";

export const OpenListItem = () => {
  const { anchorEl, openedMenu, openMenu, closeMenu } = useMenu();

  return (
    <React.Fragment>
      <ListItem button onClick={openMenu}>
        <ListItemIcon>
          <FolderOpenIcon />
        </ListItemIcon>

        <ListItemText primary="Open" />
      </ListItem>

      <OpenMenuList
        anchorEl={anchorEl}
        closeMenu={closeMenu}
        openedMenu={openedMenu}
      />
    </React.Fragment>
  );
};
