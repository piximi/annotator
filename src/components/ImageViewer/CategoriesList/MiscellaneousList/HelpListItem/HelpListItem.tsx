import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import * as React from "react";
import HelpIcon from "@material-ui/icons/Help";

export const HelpListItem = () => {
  return (
    <ListItem dense disabled button>
      <ListItemIcon>
        <HelpIcon />
      </ListItemIcon>

      <ListItemText primary="Help" />
    </ListItem>
  );
};
