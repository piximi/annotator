import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

type SampleLayersCheckboxProps = {
  checked: boolean;
};

const SampleLayersCheckbox = ({ checked }: SampleLayersCheckboxProps) => {
  const control = <Checkbox checked={checked} name="sample-layers" />;

  return <FormControlLabel control={control} label="Sample all channels?" />;
};

export const SamplingOptions = () => {
  return (
    <React.Fragment>
      <SampleLayersCheckbox checked />

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
