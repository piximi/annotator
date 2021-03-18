import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const SampleLayersCheckbox = () => {
  const control = <Checkbox name="sample-layers" />;

  return <FormControlLabel control={control} label="Sample all channels?" />;
};

export const SamplingOptions = () => {
  return (
    <React.Fragment>
      <SampleLayersCheckbox />

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
    </React.Fragment>
  );
};
