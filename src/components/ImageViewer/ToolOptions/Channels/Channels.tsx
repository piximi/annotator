import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Checkbox, ListItemIcon } from "@material-ui/core";

export const Channels = () => {
  return (
    <List component="nav">
      <ListItem button>
        <ListItemIcon>
          <Checkbox checked disableRipple edge="start" tabIndex={-1} />
        </ListItemIcon>

        <ListItemText primary="Red" />
      </ListItem>

      <ListItem button>
        <Checkbox checked disableRipple edge="start" tabIndex={-1} />

        <ListItemText primary="Green" />
      </ListItem>

      <ListItem button>
        <Checkbox checked disableRipple edge="start" tabIndex={-1} />
        <ListItemText primary="Blue" />
      </ListItem>
    </List>
  );
};
