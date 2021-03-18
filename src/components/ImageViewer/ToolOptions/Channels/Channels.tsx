import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

export const Channels = () => {
  return (
    <React.Fragment>
      <ListItem button>
        <ListItemIcon>
          <Checkbox checked disableRipple edge="start" tabIndex={-1} />
        </ListItemIcon>

        <ListItemText primary="Red" />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <Checkbox checked disableRipple edge="start" tabIndex={-1} />
        </ListItemIcon>

        <ListItemText primary="Green" />
      </ListItem>

      <ListItem button>
        <ListItemIcon>
          <Checkbox checked disableRipple edge="start" tabIndex={-1} />
        </ListItemIcon>

        <ListItemText primary="Blue" />
      </ListItem>
    </React.Fragment>
  );
};
