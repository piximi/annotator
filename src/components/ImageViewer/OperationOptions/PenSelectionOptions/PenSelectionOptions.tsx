import React, { useState } from "react";
import { SelectionOptions } from "../SelectionOptions";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";

export const PenSelectionOptions = () => {
  const [value, setValue] = useState<number>(1);

  const onChange = (event: any, changed: number | number[]) => {
    setValue(changed as number);
  };

  return (
    <React.Fragment>
      <SelectionOptions />

      <Divider />

      <Slider aria-labelledby="brush-size" onChange={onChange} value={value} />
    </React.Fragment>
  );
};
