import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export const Channels = () => {
  return (
    <List component="nav">
      <ListItem button>
        <ListItemText primary="Red" />
      </ListItem>

      <ListItem button>
        <ListItemText primary="Green" />
      </ListItem>

      <ListItem button>
        <ListItemText primary="Blue" />
      </ListItem>
    </List>
  );
};
