import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { useStyles } from "./OperationOptions.css";
import { IconButton } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { theme } from "../../ImageViewer/theme";

type OperationOptionsProps = {
  handleCollapse: (b: boolean) => void;
  name: string;
  settings: React.ReactNode;
};

export const OperationOptions = ({
  handleCollapse,
  name,
  settings,
}: OperationOptionsProps) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="right"
      className={classes.options}
      classes={{ paper: classes.settingsPaper }}
      variant="permanent"
    >
      <div className={classes.settingsToolbar} />
      <List>
        <ListItem dense>
          <ListItemText primary={name} />
          <IconButton
            onClick={() => {
              handleCollapse(false);
            }}
          >
            <ArrowForwardIcon
              fontSize="small"
              style={{ fill: theme.palette.text.primary }}
            />
          </IconButton>
        </ListItem>
      </List>

      <Divider />

      {settings}
    </Drawer>
  );
};
