import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import * as React from "react";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import { OpenMenuList } from "../OpenMenuList";
import { useMenu } from "../../../../../../hooks";

export const OpenListItem = () => {
  const { anchorEl, onClose, onOpen, open } = useMenu();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <FolderOpenIcon />
        </ListItemIcon>

        <ListItemText primary="Open" />
      </ListItem>

      <OpenMenuList
        anchorEl={anchorEl}
        closeMenu={() => {}}
        openedMenu={open}
      />
    </React.Fragment>
  );
};
