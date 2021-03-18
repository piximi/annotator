import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const SampleLayersCheckbox = () => {
  return (
    <FormControlLabel
      control={<Checkbox name="sample-layers" />}
      label="Sample all channels?"
    />
  );
};

export const SamplingOptions = () => {
  return (
    <React.Fragment>
      <SampleLayersCheckbox />
    </React.Fragment>
  );
};
