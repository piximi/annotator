import Box from "@material-ui/core/Box";
import React from "react";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useStyles } from "./InformationBox.css";

type InformationBoxProps = {
  description: string;
  name: string;
};

export const InformationBox = ({ description, name }: InformationBoxProps) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} color="default">
      <Toolbar disableGutters={true}>
        <Typography variant="h6" color="inherit">
          &nbsp;
        </Typography>
        <Typography style={{ marginLeft: 12 }}>{name}</Typography>
      </Toolbar>
    </AppBar>
  );
};
