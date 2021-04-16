import * as React from "react";
import SaveIcon from "@material-ui/icons/Save";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { SaveMenuList } from "../SaveMenuList";
import { useMenu } from "../../../../../../hooks";

export const SaveListItem = () => {
  const { anchorEl, onClose, onOpen, open } = useMenu();

  return (
    <React.Fragment>
      <ListItem button onClick={onOpen}>
        <ListItemIcon>
          <SaveIcon />
        </ListItemIcon>

        <ListItemText primary="Save" />
      </ListItem>

      <SaveMenuList anchorEl={anchorEl} onClose={() => {}} open={open} />
    </React.Fragment>
  );
};
