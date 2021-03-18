import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import List from "@material-ui/core/List";
import { ListItem } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

export const SampleList = () => {
  const [checked, setChecked] = React.useState([0, 1, 2]);

  const onChange = (index: number) => () => {
    const current = checked.indexOf(index);

    const updated = [...checked];

    if (current === -1) {
      updated.push(index);
    } else {
      updated.splice(current, 1);
    }

    setChecked(updated);
  };

  return (
    <List
      component="nav"
      subheader={<ListSubheader component="div">Sample</ListSubheader>}
    >
      <ListItem button onClick={onChange(0)}>
        <ListItemIcon>
          <Checkbox
            checked={checked.indexOf(0) !== -1}
            disableRipple
            edge="start"
            tabIndex={-1}
          />
        </ListItemIcon>

        <ListItemText primary="Red" />
      </ListItem>

      <ListItem button onClick={onChange(1)}>
        <ListItemIcon>
          <Checkbox
            checked={checked.indexOf(1) !== -1}
            disableRipple
            edge="start"
            tabIndex={-1}
          />
        </ListItemIcon>

        <ListItemText primary="Green" />
      </ListItem>

      <ListItem button onClick={onChange(2)}>
        <ListItemIcon>
          <Checkbox
            checked={checked.indexOf(2) !== -1}
            disableRipple
            edge="start"
            tabIndex={-1}
          />
        </ListItemIcon>

        <ListItemText primary="Blue" />
      </ListItem>
    </List>
  );
};
