import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Channels } from "../Channels";

type SampleLayersCheckboxProps = {
  checked: boolean;
};

const SampleLayersCheckbox = ({ checked }: SampleLayersCheckboxProps) => {
  const control = <Checkbox checked={checked} name="sample-layers" />;

  return <FormControlLabel control={control} label="Sample all channels?" />;
};

export const SamplingOptions = () => {
  const [checked, setChecked] = useState<boolean>(true);

  const onChange = () => {
    setChecked(!checked);
  };

  return (
    <React.Fragment>
      <SampleLayersCheckbox checked={checked} />

      <Channels />
    </React.Fragment>
  );
};
