import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Channels } from "../Channels";
import List from "@material-ui/core/List";
import { ListItem } from "@material-ui/core";

type SampleLayersCheckboxProps = {
  checked: boolean;
};

export const SamplingOptions = () => {
  const [checked, setChecked] = useState<boolean>(true);

  const onChange = () => {
    setChecked(!checked);
  };

  return (
    <List component="nav">
      <ListItem>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              name="sample-layers"
              onChange={onChange}
            />
          }
          label="Sample all channels?"
        />
      </ListItem>

      <Channels />
    </List>
  );
};
