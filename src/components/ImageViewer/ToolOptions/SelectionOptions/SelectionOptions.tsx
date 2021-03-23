import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { Typography } from "@material-ui/core";
import { SampleList } from "../SampleList";
import { AnnotationMode } from "../AnnotationMode";
import { InvertAnnotation } from "../InvertAnnotation";

export const SelectionOptions = () => {
  return (
    <React.Fragment>
      <List dense>
        <ListItem>
          <ListItemText>
            <Typography variant="inherit">
              Press the Enter key to confirm an annotation.
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography variant="inherit">
              Select an existing annotation with the Pointer tool.
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <Typography variant="inherit">
              Press the Backspace or Escape key to remove a selected annotation.
            </Typography>
          </ListItemText>
        </ListItem>
      </List>

      <Divider />

      <AnnotationMode />

      <Divider />

      <InvertAnnotation />

      <Divider />

      <SampleList />
    </React.Fragment>
  );
};
