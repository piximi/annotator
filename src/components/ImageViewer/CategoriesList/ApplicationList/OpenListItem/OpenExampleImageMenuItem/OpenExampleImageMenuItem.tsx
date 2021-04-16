import * as React from "react";
import { ListItemText, MenuItem } from "@material-ui/core";

export const OpenExampleImageMenuItem = () => {
  return (
    <React.Fragment>
      <MenuItem>
        <ListItemText primary="Open example classifier" />
      </MenuItem>
    </React.Fragment>
  );
};
