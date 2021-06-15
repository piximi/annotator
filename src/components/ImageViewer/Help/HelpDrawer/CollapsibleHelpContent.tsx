import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import DescriptionIcon from "@material-ui/icons/Description";
import { Typography } from "@material-ui/core";

type CollapsibleHelpContentProps = {
  children: any;
  dense: boolean;
  primary: string;
  closed?: boolean;
};

export const CollapsibleHelpContent = ({
  children,
  dense,
  closed,
  primary,
}: CollapsibleHelpContentProps) => {
  const [collapsed, setCollapsed] = React.useState(closed);

  const onClick = () => {
    setCollapsed(!collapsed);
  };

  return (
    <List dense={dense}>
      <ListItem button onClick={onClick}>
        <ListItemIcon>
          <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={<Typography>{primary}</Typography>} />
      </ListItem>

      <Collapse in={collapsed} timeout="auto" unmountOnExit>
        <List component="div" dense={dense} disablePadding>
          {children}
        </List>
      </Collapse>
    </List>
  );
};
